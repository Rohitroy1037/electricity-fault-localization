import prisma from '../utils/prisma.js';
import { logger } from '../config/logger.js';
import { eventBus } from '../events/event-bus.js';
import { DomainEvents } from '../events/event-types.js';
import crypto from 'crypto';

/**
 * Telemetry Service
 *
 * Handles the core business logic (Unit of Work) for saving telemetry data
 * and updating the associated Device and Pole status.
 */
export class TelemetryService {
  /**
   * Persists a telemetry event and updates Device/Pole.
   * Handles duplicate packets by checking the Unique Constraint violation.
   *
   * @param {Object} payload Validated telemetry payload
   * @returns {Promise<{success: boolean, duplicate?: boolean}>}
   */
  static async processTelemetry(payload) {
    let incomingTs;
    let serverTs;

    try {
      // Execute the entire operation inside an ACID transaction to prevent partial updates.
      await prisma.$transaction(async (tx) => {
        // 1. Fetch current device state to check timestamps for out-of-order events
        const currentDevice = await tx.device.findUnique({
          where: { device_id: payload.device_id },
          select: { last_device_timestamp: true },
        });

        incomingTs = new Date(payload.ts);
        serverTs = new Date();

        // 2. Insert Telemetry record (Always store historical data)
        await tx.telemetry.create({
          data: {
            device_id: payload.device_id,
            seq_no: payload.seq,
            event_type: payload.event,
            energized: payload.energized,
            device_timestamp: incomingTs,
            received_at: serverTs,
            battery_mv: payload.battery_mv,
            rssi: payload.rssi,
          },
        });

        // 3. Out-of-Order Check
        if (currentDevice && currentDevice.last_device_timestamp && incomingTs < currentDevice.last_device_timestamp) {
          logger.warn(
            {
              device_id: payload.device_id,
              pole_id: payload.pole_id,
              seq: payload.seq,
              incoming_timestamp: incomingTs,
              latest_processed_timestamp: currentDevice.last_device_timestamp,
            },
            'Out-of-order telemetry packet detected. Stored in history but skipped state update.'
          );
          return; // Skip Device and Pole state updates
        }

        // 4. Update Device state
        await tx.device.update({
          where: { device_id: payload.device_id },
          data: {
            last_device_timestamp: incomingTs,
            last_seen: serverTs,
            battery_mv: payload.battery_mv,
            rssi: payload.rssi,
            firmware_version: payload.fw,
            online_status: 'ONLINE', // Re-energized or heartbeat means it's online
          },
        });

        // 5. Update Pole status
        await tx.pole.update({
          where: { pole_id: payload.pole_id },
          data: {
            current_status: payload.energized ? 'ENERGIZED' : 'DE_ENERGIZED',
          },
        });
      });

      // 6. Publish internal domain event for downstream consumers
      // (e.g. Fault Localization, Websocket Broadcasting)
      // This is fired ONLY if the database transaction commits successfully.
      if (incomingTs && serverTs) {
        eventBus.publish(DomainEvents.TELEMETRY_STORED, {
          event_id: crypto.randomUUID(),
          correlation_id: crypto.randomUUID(),
          device_id: payload.device_id,
          pole_id: payload.pole_id,
          event: payload.event,
          energized: payload.energized,
          device_timestamp: incomingTs,
          received_at: serverTs,
          sequence_number: payload.seq,
        });
      }

      return { success: true };
    } catch (error) {
      // Prisma error code P2002 corresponds to a Unique Constraint violation
      // We designed the DB with a compound unique constraint on (device_id, seq_no)
      if (error.code === 'P2002') {
        const deviceTs = incomingTs || new Date(payload.ts);
        const receivedTs = serverTs || new Date();
        
        const logData = {
          device_id: payload.device_id,
          pole_id: payload.pole_id,
          seq: payload.seq,
          event: payload.event,
          device_timestamp: deviceTs,
          received_at: receivedTs,
          reason: 'Duplicate telemetry packet ignored',
        };

        if (payload.event_id) logData.event_id = payload.event_id;
        if (payload.correlation_id) logData.correlation_id = payload.correlation_id;

        logger.warn(
          logData,
          'Duplicate telemetry packet detected. Packet ignored because it has already been processed.'
        );
        
        return { success: true, duplicate: true };
      }

      // Foreign key violation (e.g. unknown device or pole)
      if (error.code === 'P2003') {
        logger.error(
          { err: error, device_id: payload.device_id, pole_id: payload.pole_id },
          'Telemetry processing failed: Unknown Device or Pole'
        );
        throw new Error('Unknown Device or Pole');
      }

      throw error; // Bubble up other DB failures to be retried by the queue
    }
  }
}
