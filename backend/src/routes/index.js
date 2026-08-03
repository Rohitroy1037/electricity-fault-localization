/**
 * Root Router Aggregator
 *
 * Mounts all sub-routers. As new modules are introduced, their routes are registered here.
 * Currently mounts only foundation endpoints (e.g., health check).
 */

import { Router } from 'express';
import healthRoutes from './health.routes.js';
import telemetryRoutes from './telemetry.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

// Mount Health Check endpoint
router.use('/health', healthRoutes);

// Mount Telemetry endpoint (API v1)
router.use('/api/v1/telemetry', telemetryRoutes);

// Mount Analytics endpoint (API v1)
router.use('/api/v1/analytics', analyticsRoutes);

export default router;

