/**
 * @file analytics.routes.js
 * @description Express routing definitions for Analytics API endpoints.
 */

import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';

const router = Router();

/**
 * GET /api/v1/analytics/summary
 * Retrieves overall KPI analytics summary
 */
router.get('/summary', AnalyticsController.getSummary);

/**
 * GET /api/v1/analytics/outages
 * Retrieves scheduled and unscheduled outage analytics
 */
router.get('/outages', AnalyticsController.getOutages);

/**
 * GET /api/v1/analytics/trends
 * Retrieves time-series trend analytics
 */
router.get('/trends', AnalyticsController.getTrends);

/**
 * GET /api/v1/analytics/availability
 * Retrieves grid availability and reliability index metrics
 */
router.get('/availability', AnalyticsController.getAvailability);

/**
 * GET /api/v1/analytics/mttr
 * Retrieves Mean Time To Resolution (MTTR) analytics
 */
router.get('/mttr', AnalyticsController.getMttr);

export default router;
