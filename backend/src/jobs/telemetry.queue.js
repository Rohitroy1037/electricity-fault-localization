import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

/**
 * Telemetry Queue (Producer)
 *
 * Dedicated BullMQ queue for high-throughput ingestion of telemetry data.
 * Offloads database inserts and updates from the main HTTP thread.
 */
export const telemetryQueue = new Queue('TelemetryQueue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true, 
    removeOnFail: 1000,
  },
});
