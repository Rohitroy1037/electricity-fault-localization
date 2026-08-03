/**
 * Health Controller
 *
 * Provides system health status and uptime information.
 */

/**
 * Handle GET /health
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'electricity-fault-localization',
    timestamp: new Date().toISOString(),
  });
};
