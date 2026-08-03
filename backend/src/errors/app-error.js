/**
 * Base Application Error
 *
 * All custom operational errors extend this class.
 * Centralizing error structure guarantees consistent error responses across API endpoints.
 */

export class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {boolean} [isOperational=true] - Distinguishes operational errors from programming bugs
   * @param {Array|Object|null} [details=null] - Additional validation or contextual error details
   */
  constructor(message, statusCode = 500, isOperational = true, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400, true, details);
  }
}
