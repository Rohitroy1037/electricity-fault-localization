/**
 * @file analytics.service.js
 * @description Service layer for Analytics API. Implements business aggregation logic,
 * caching architecture hooks, filter normalization, and DTO transformations.
 */

import { AnalyticsRepository } from '../repositories/analytics.repository.js';
import { AnalyticsSummaryDTO } from '../dtos/analytics-summary.dto.js';
import { OutageAnalyticsDTO } from '../dtos/outage-analytics.dto.js';
import { TrendAnalyticsDTO } from '../dtos/trend-analytics.dto.js';
import { AvailabilityDTO } from '../dtos/availability.dto.js';
import { MTTRDTO } from '../dtos/mttr.dto.js';
import { logger } from '../config/logger.js';

/**
 * Interface / Architecture Placeholder for Future Distributed Caching (Redis)
 * @interface IAnalyticsCache
 */
class AnalyticsCachePlaceholder {
  /**
   * @param {string} key
   * @returns {Promise<Object|null>}
   */
  async get(key) {
    // Placeholder: In future implementation, return redisClient.get(key)
    return null;
  }

  /**
   * @param {string} key
   * @param {Object} value
   * @param {number} [ttlSeconds=300]
   * @returns {Promise<void>}
   */
  async set(key, value, ttlSeconds = 300) {
    // Placeholder: In future implementation, execute redisClient.setEx(key, ttlSeconds, JSON.stringify(value))
  }

  /**
   * Generates a deterministic cache key for analytics queries
   * @param {string} prefix
   * @param {Object} filter
   * @returns {string}
   */
  generateCacheKey(prefix, filter = {}) {
    const serialized = Object.keys(filter)
      .sort()
      .map((k) => `${k}:${filter[k]}`)
      .join('|');
    return `analytics:${prefix}:${serialized}`;
  }
}

const analyticsCache = new AnalyticsCachePlaceholder();

export class AnalyticsService {
  /**
   * Retrieves high-level analytics KPI summary
   * @param {Object} query - Express query params
   * @returns {Promise<AnalyticsSummaryDTO>}
   */
  static async getSummary(query = {}) {
    const filter = this._normalizeFilter(query);
    const cacheKey = analyticsCache.generateCacheKey('summary', filter);

    // Check future cache layer
    const cached = await analyticsCache.get(cacheKey);
    if (cached) {
      logger.debug({ cacheKey }, 'Analytics summary served from cache');
      return AnalyticsSummaryDTO.fromAggregation(cached);
    }

    const rawData = await AnalyticsRepository.getSummary(filter);

    // Save to future cache layer
    await analyticsCache.set(cacheKey, rawData, 180);

    return AnalyticsSummaryDTO.fromAggregation(rawData);
  }

  /**
   * Retrieves outage analytics and breakdowns
   * @param {Object} query
   * @returns {Promise<OutageAnalyticsDTO>}
   */
  static async getOutages(query = {}) {
    const filter = this._normalizeFilter(query);
    const cacheKey = analyticsCache.generateCacheKey('outages', filter);

    const cached = await analyticsCache.get(cacheKey);
    if (cached) {
      return OutageAnalyticsDTO.transform(cached);
    }

    const rawData = await AnalyticsRepository.getOutages(filter);
    await analyticsCache.set(cacheKey, rawData, 120);

    return OutageAnalyticsDTO.transform(rawData);
  }

  /**
   * Retrieves time-series trends for incidents, tickets, and outages
   * @param {Object} query
   * @returns {Promise<TrendAnalyticsDTO>}
   */
  static async getTrends(query = {}) {
    const filter = this._normalizeFilter(query);
    const cacheKey = analyticsCache.generateCacheKey('trends', filter);

    const cached = await analyticsCache.get(cacheKey);
    if (cached) {
      return TrendAnalyticsDTO.transform(cached);
    }

    const rawData = await AnalyticsRepository.getTrends(filter);
    await analyticsCache.set(cacheKey, rawData, 300);

    return TrendAnalyticsDTO.transform(rawData);
  }

  /**
   * Retrieves grid availability, reliability metrics, and SAIDI/SAIFI indices
   * @param {Object} query
   * @returns {Promise<AvailabilityDTO>}
   */
  static async getAvailability(query = {}) {
    const filter = this._normalizeFilter(query);
    const cacheKey = analyticsCache.generateCacheKey('availability', filter);

    const cached = await analyticsCache.get(cacheKey);
    if (cached) {
      return AvailabilityDTO.transform(cached);
    }

    const rawData = await AnalyticsRepository.getAvailability(filter);
    await analyticsCache.set(cacheKey, rawData, 300);

    return AvailabilityDTO.transform(rawData);
  }

  /**
   * Retrieves MTTR and incident lifecycle duration metrics
   * @param {Object} query
   * @returns {Promise<MTTRDTO>}
   */
  static async getMttr(query = {}) {
    const filter = this._normalizeFilter(query);
    const cacheKey = analyticsCache.generateCacheKey('mttr', filter);

    const cached = await analyticsCache.get(cacheKey);
    if (cached) {
      return MTTRDTO.transform(cached);
    }

    const rawData = await AnalyticsRepository.getMttr(filter);
    await analyticsCache.set(cacheKey, rawData, 300);

    return MTTRDTO.transform(rawData);
  }

  /**
   * Normalizes incoming raw query parameters into a structured, validated filter object
   * @private
   * @param {Object} query
   * @returns {Object}
   */
  static _normalizeFilter(query = {}) {
    const filter = {};

    // Pagination
    filter.page = query.page ? Math.max(1, parseInt(query.page, 10) || 1) : 1;
    filter.pageSize = query.pageSize
      ? Math.min(100, Math.max(1, parseInt(query.pageSize, 10) || 20))
      : 20;

    // Date range
    if (query.startDate) {
      const start = new Date(query.startDate);
      if (!isNaN(start.getTime())) filter.startDate = start.toISOString();
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      if (!isNaN(end.getTime())) filter.endDate = end.toISOString();
    }

    // Time-series aggregation
    if (query.groupBy) {
      const allowedGroups = ['day', 'week', 'month'];
      filter.groupBy = allowedGroups.includes(query.groupBy.toLowerCase())
        ? query.groupBy.toLowerCase()
        : 'day';
    } else {
      filter.groupBy = 'day';
    }

    if (query.interval) {
      filter.interval = query.interval;
    }

    // Filters
    if (query.feederId) filter.feederId = String(query.feederId).trim();
    if (query.dtId) filter.dtId = String(query.dtId).trim();
    if (query.status) filter.status = String(query.status).trim();
    if (query.severity) filter.severity = String(query.severity).trim();
    if (query.priority) filter.priority = String(query.priority).trim();
    if (query.faultType) filter.faultType = String(query.faultType).trim();
    if (query.scope) filter.scope = String(query.scope).trim();
    if (query.type) filter.type = String(query.type).trim().toUpperCase();

    // Sorting & Searching
    if (query.sortBy) filter.sortBy = String(query.sortBy).trim();
    if (query.sortOrder) filter.sortOrder = query.sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
    if (query.search || query.q) filter.search = String(query.search || query.q).trim();

    return filter;
  }
}
