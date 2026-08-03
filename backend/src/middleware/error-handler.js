/**
 * Error Handling Middleware
 *
 * Provides:
 * 1. notFoundHandler - Catches requests to unmapped routes and passes a 404 AppError.
 * 2. errorHandler - Central catch-all Express error handler. Formats errors uniformly
 *    and prevents internal stack traces from leaking in production.
 */

import { AppError } from '../errors/app-error.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

/**
 * 404 Not Found Middleware
 * Triggered when no route matched the requested URL.
 */
export const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server`, 404);
  next(err);
};

/**
 * Global Centralized Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational ?? false;

  // Log non-operational (programming bugs) at error level, operational at warn
  if (!isOperational) {
    logger.error(
      {
        err,
        reqId: req.id,
        method: req.method,
        url: req.originalUrl,
      },
      'Unhandled internal server error'
    );
  } else {
    logger.warn(
      {
        statusCode,
        message: err.message,
        details: err.details,
        reqId: req.id,
        method: req.method,
        url: req.originalUrl,
      },
      'Operational error handled'
    );
  }

  // Response payload
  const response = {
    status: 'error',
    statusCode,
    message: isOperational || env.NODE_ENV !== 'production' ? err.message : 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  };

  res.status(statusCode).json(response);
};
