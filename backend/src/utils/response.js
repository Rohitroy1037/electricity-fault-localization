/**
 * @file response.js
 * @description Standardized API response helper ensuring uniform JSON envelope across all endpoints.
 */

/**
 * Sends a standardized success response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {*} data - Response payload (DTO, object, or array)
 * @param {Object} [meta={}] - Optional metadata (e.g., pagination, filters)
 * @param {number} [statusCode=200] - HTTP status code
 * @param {import('express').Request} [req=null] - Express request object to extract requestId
 */
export const sendSuccess = (res, data, meta = {}, statusCode = 200, req = null) => {
  const requestId = req?.id || req?.headers?.['x-request-id'] || 'req-' + Math.random().toString(36).substring(2, 9);
  const timestamp = new Date().toISOString();

  return res.status(statusCode).json({
    success: true,
    requestId,
    timestamp,
    data,
    meta,
    error: null,
  });
};

/**
 * Sends a standardized error response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {Object|string} error - Error message or detailed error object
 * @param {number} [statusCode=500] - HTTP status code
 * @param {import('express').Request} [req=null] - Express request object
 */
export const sendError = (res, error, statusCode = 500, req = null) => {
  const requestId = req?.id || req?.headers?.['x-request-id'] || 'req-' + Math.random().toString(36).substring(2, 9);
  const timestamp = new Date().toISOString();

  return res.status(statusCode).json({
    success: false,
    requestId,
    timestamp,
    data: null,
    meta: {},
    error: typeof error === 'string' ? { message: error } : error,
  });
};
