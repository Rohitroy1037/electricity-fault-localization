/**
 * HTTP Request Logger Middleware
 *
 * Wraps pino-http to log all incoming HTTP requests and their responses.
 * Assigns a unique request ID (x-request-id header or generated UUID) to every request.
 */

import { pinoHttp } from 'pino-http';
import { randomUUID } from 'crypto';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export const requestLogger = pinoHttp({
  logger,
  // Generate a unique ID for tracing requests across logs
  genReqId: (req) => req.headers['x-request-id'] || randomUUID(),

  // Custom log level based on HTTP response status code
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  // Avoid logging noisy health checks in production if needed, or keep minimal
  autoLogging: {
    ignore: (req) => {
      // In production, keep health checks from cluttering logs if desired
      return env.NODE_ENV === 'test';
    },
  },

  // Custom request serialization to avoid logging sensitive headers
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
