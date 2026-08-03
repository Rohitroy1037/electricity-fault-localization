import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

/**
 * Redis Connection Configuration
 *
 * Instantiates the Redis client used by BullMQ and caching layers.
 * Configured properly with `maxRetriesPerRequest: null` as required by BullMQ.
 */
const redisConfig = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Critical requirement for BullMQ
};

export const redisConnection = new Redis(redisConfig);

redisConnection.on('error', (err) => {
  logger.error({ err }, 'Redis connection error');
});

redisConnection.on('ready', () => {
  logger.info('Redis connection established');
});
