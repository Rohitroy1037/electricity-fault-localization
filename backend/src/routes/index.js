/**
 * Root Router Aggregator
 *
 * Mounts all sub-routers.
 */

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import telemetryRoutes from './telemetry.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

// Root welcome & health status
router.get('/', (req, res) => {
  res.json({
    name: 'Electricity Distribution Fault Localization API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      telemetry: '/api/v1/telemetry',
      analytics: '/api/v1/analytics',
    },
  });
});

// Mount Health Check endpoint
router.use('/health', healthRoutes);

// Mount Telemetry endpoint (API v1)
router.use('/api/v1/telemetry', telemetryRoutes);

// Mount Analytics endpoint (API v1)
router.use('/api/v1/analytics', analyticsRoutes);

export default router;
