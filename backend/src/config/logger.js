/**
 * Logger Configuration (Pino)
 *
 * Creates the application-wide logger instance.
 * - Development: Pretty-printed, colorized output via pino-pretty
 * - Production: Structured JSON for log aggregation (ELK, Datadog, etc.)
 *
 * All modules import this logger. Never use console.log in application code.
 */

import pino from 'pino';
import { env } from './env.js';

// ──────────────────────────────────────────────
// Logger options
// ──────────────────────────────────────────────
const loggerOptions = {
  level: env.LOG_LEVEL,

  // Attach service name to every log entry for multi-service filtering
  base: {
    service: 'electricity-fault-localization',
  },

  // ISO timestamps for consistent log parsing across timezones
  timestamp: pino.stdTimeFunctions.isoTime,
};

// ──────────────────────────────────────────────
// In development, pipe logs through pino-pretty for readability.
// In production, raw JSON goes to stdout for log aggregation.
// ──────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  loggerOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss.l',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(loggerOptions);
