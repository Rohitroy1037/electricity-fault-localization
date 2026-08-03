import { Worker } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { TelemetryService } from '../services/telemetry.service.js';
import { logger } from '../config/logger.js';

/**
 * Telemetry Worker (Consumer)
 *
 * Background process that dequeues telemetry payloads, interacts with the
 * database service, and handles transient failures via retry logic.
 */
export const telemetryWorker = new Worker(
  'TelemetryQueue',
  async (job) => {
    try {
      const payload = job.data;
      
      const result = await TelemetryService.processTelemetry(payload);
      
      if (result.duplicate) {
        // We log duplicates in the service but treat the job as successful
        // to remove it from the queue without failing.
        return { status: 'duplicate_dropped' };
      }
      
      logger.info(
        { device_id: payload.device_id, seq: payload.seq },
        'Packet stored successfully'
      );
      
      return { status: 'success' };
    } catch (error) {
      // Re-throw so BullMQ triggers a retry based on backoff config
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process 5 jobs concurrently
  }
);

telemetryWorker.on('failed', (job, err) => {
  logger.error(
    { err, jobId: job?.id },
    'Telemetry worker failed to process job'
  );
});
