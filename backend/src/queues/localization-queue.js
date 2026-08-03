/**
 * Localization Queue - Producer
 *
 * Exposes a simple interface to add telemetry events to the localization queue.
 */
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { logger } from '../config/logger.js';

// Create a BullMQ Queue instance dedicated to localization processing.
export const LocalizationQueue = new Queue('LocalizationQueue', {
  connection: redisConnection,
});

export const enqueueLocalization = async (payload) => {
  logger.info({ payload }, 'Localization queued');
  await LocalizationQueue.add('localize', payload);
};
