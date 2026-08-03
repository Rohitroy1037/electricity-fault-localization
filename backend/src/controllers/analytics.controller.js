/**
 * @file analytics.controller.js
 * @description REST API Controller for Analytics endpoints.
 * Provides read-only grid performance KPIs, outage statistics, time-series trends,
 * reliability indices (SAIDI/SAIFI/ASAI), and MTTR calculations.
 */

import { AnalyticsService } from '../services/analytics.service.js';
import { sendSuccess } from '../utils/response.js';
import { logger } from '../config/logger.js';

export class AnalyticsController {
  /**
   * @openapi
   * /api/v1/analytics/summary:
   *   get:
   *     tags:
   *       - Analytics
   *     summary: Retrieve system-wide analytics KPI summary
   *     description: Fetches aggregated counts of incidents, tickets, outages, asset health, and baseline performance.
   *     parameters:
   *       - in: query
   *         name: feederId
   *         schema:
   *           type: string
   *         description: Optional feeder filter
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Filter start timestamp (ISO 8601)
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *         description: Filter end timestamp (ISO 8601)
   *     responses:
   *       200:
   *         description: Analytics summary returned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 requestId:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/AnalyticsSummaryDTO'
   *                 meta:
   *                   type: object
   */
  static async getSummary(req, res, next) {
    try {
      logger.info({ route: '/api/v1/analytics/summary', query: req.query }, 'Fetching analytics summary');

      const summaryDTO = await AnalyticsService.getSummary(req.query);

      return sendSuccess(res, summaryDTO, {}, 200, req);
    } catch (error) {
      logger.error({ route: '/api/v1/analytics/summary', err: error }, 'Failed to fetch analytics summary');
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/analytics/outages:
   *   get:
   *     tags:
   *       - Analytics
   *     summary: Retrieve outage analytics and duration metrics
   *     description: Fetches unified scheduled and unscheduled grid outages with pagination, search, and sorting.
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 20
   *       - in: query
   *         name: feederId
   *         schema:
   *           type: string
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [SCHEDULED, UNSCHEDULED]
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Outage analytics returned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 requestId:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/OutageAnalyticsDTO'
   */
  static async getOutages(req, res, next) {
    try {
      logger.info({ route: '/api/v1/analytics/outages', query: req.query }, 'Fetching outage analytics');

      const outageDTO = await AnalyticsService.getOutages(req.query);

      return sendSuccess(res, outageDTO, { pagination: outageDTO.pagination }, 200, req);
    } catch (error) {
      logger.error({ route: '/api/v1/analytics/outages', err: error }, 'Failed to fetch outage analytics');
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/analytics/trends:
   *   get:
   *     tags:
   *       - Analytics
   *     summary: Retrieve time-series trend analytics
   *     description: Fetches incident, ticket, and outage trends aggregated by day, week, or month.
   *     parameters:
   *       - in: query
   *         name: groupBy
   *         schema:
   *           type: string
   *           enum: [day, week, month]
   *           default: day
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: feederId
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Trend analytics returned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 requestId:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/TrendAnalyticsDTO'
   */
  static async getTrends(req, res, next) {
    try {
      logger.info({ route: '/api/v1/analytics/trends', query: req.query }, 'Fetching trend analytics');

      const trendDTO = await AnalyticsService.getTrends(req.query);

      return sendSuccess(res, trendDTO, {}, 200, req);
    } catch (error) {
      logger.error({ route: '/api/v1/analytics/trends', err: error }, 'Failed to fetch trend analytics');
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/analytics/availability:
   *   get:
   *     tags:
   *       - Analytics
   *     summary: Retrieve grid availability and reliability indices (SAIDI, SAIFI, ASAI)
   *     description: Calculates reliability metrics, uptime percentages, and feeder-level availability.
   *     parameters:
   *       - in: query
   *         name: feederId
   *         schema:
   *           type: string
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: groupBy
   *         schema:
   *           type: string
   *           enum: [day, week, month]
   *     responses:
   *       200:
   *         description: Availability analytics returned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 requestId:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/AvailabilityDTO'
   */
  static async getAvailability(req, res, next) {
    try {
      logger.info({ route: '/api/v1/analytics/availability', query: req.query }, 'Fetching availability analytics');

      const availabilityDTO = await AnalyticsService.getAvailability(req.query);

      return sendSuccess(res, availabilityDTO, {}, 200, req);
    } catch (error) {
      logger.error({ route: '/api/v1/analytics/availability', err: error }, 'Failed to fetch availability analytics');
      next(error);
    }
  }

  /**
   * @openapi
   * /api/v1/analytics/mttr:
   *   get:
   *     tags:
   *       - Analytics
   *     summary: Retrieve Mean Time To Resolution (MTTR) and lifecycle duration analytics
   *     description: Analyzes MTTR, MTTA, MTTD, and MTTV broken down by fault type, priority, and time interval.
   *     parameters:
   *       - in: query
   *         name: feederId
   *         schema:
   *           type: string
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: groupBy
   *         schema:
   *           type: string
   *           enum: [day, week, month]
   *     responses:
   *       200:
   *         description: MTTR analytics returned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 requestId:
   *                   type: string
   *                 timestamp:
   *                   type: string
   *                 data:
   *                   $ref: '#/components/schemas/MTTRDTO'
   */
  static async getMttr(req, res, next) {
    try {
      logger.info({ route: '/api/v1/analytics/mttr', query: req.query }, 'Fetching MTTR analytics');

      const mttrDTO = await AnalyticsService.getMttr(req.query);

      return sendSuccess(res, mttrDTO, {}, 200, req);
    } catch (error) {
      logger.error({ route: '/api/v1/analytics/mttr', err: error }, 'Failed to fetch MTTR analytics');
      next(error);
    }
  }
}
