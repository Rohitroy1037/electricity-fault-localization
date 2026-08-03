import { telemetrySchema } from '../validators/telemetry.validator.js';
import { telemetryQueue } from '../jobs/telemetry.queue.js';
import { logger } from '../config/logger.js';
import { AppError } from '../errors/app-error.js';

/**
 * Telemetry Controller
 *
 * Exposes the HTTP endpoint for IoT devices to push telemetry data.
 * The controller is kept intentionally lean: it validates the payload
 * and pushes it to the message queue, delegating persistence to workers
 * for maximum write throughput.
 */
export class TelemetryController {
  static async ingest(req, res, next) {
    try {
      // 1. Validate incoming payload against schema
      const parsed = telemetrySchema.safeParse(req.body);
      if (!parsed.success) {
        logger.warn({ err: parsed.error, body: req.body }, 'Validation failure: Invalid telemetry payload');
        throw new AppError(400, 'Invalid telemetry payload', parsed.error.flatten().fieldErrors);
      }

      const payload = parsed.data;

      // 2. Enqueue the payload for background processing
      // Job ID is set to device_id + seq to ensure we don't enqueue the exact same event multiple times simultaneously
      const jobId = `${payload.device_id}-${payload.seq}`;
      
      await telemetryQueue.add('process-telemetry', payload, {
        jobId, 
      });

      logger.info({ device_id: payload.device_id, seq: payload.seq }, 'Telemetry received and enqueued');

      // 3. Return early response (202 Accepted) - IoT devices need quick acks
      return res.status(202).json({
        success: true,
        message: 'Telemetry accepted for processing',
      });
    } catch (error) {
      next(error);
    }
  }
}
