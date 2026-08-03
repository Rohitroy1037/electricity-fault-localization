import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

/**
 * Redis Connection Configuration
 *
 * Instantiates the Redis client used by BullMQ and caching layers.
 * Configured with lazy retries and graceful fallback if Redis is unavailable in cloud environments (e.g. Render Free Tier).
 */
const createRedisInstance = () => {
  const options = {
    host: env.REDIS_HOST || '127.0.0.1',
    port: Number(env.REDIS_PORT) || 6379,
    password: env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // Critical requirement for BullMQ
    enableOfflineQueue: false,
    retryStrategy(times) {
      if (times > 3) {
        logger.warn('Redis connection unavailable after 3 retries. System running in standalone mode.');
        return null; // Stop retrying to prevent process crash
      }
      return Math.min(times * 100, 2000);
    },
  };

  const instance = env.REDIS_URL ? new Redis(env.REDIS_URL, options) : new Redis(options);

  instance.on('error', (err) => {
    logger.warn({ message: err.message }, 'Redis warning (running in standalone / non-cached mode)');
  });

  instance.on('ready', () => {
    logger.info('Redis connection established');
  });

  return instance;
};

export const redisConnection = createRedisInstance();
