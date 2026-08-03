/**
 * @file analytics-summary.dto.js
 * @description Data Transfer Object for system-wide analytics summary.
 * Ensures repository entities are not exposed directly to API consumers.
 */

export class AnalyticsSummaryDTO {
  /**
   * @param {Object} data
   * @param {Object} [data.incidents]
   * @param {Object} [data.tickets]
   * @param {Object} [data.outages]
   * @param {Object} [data.grid]
   * @param {Object} [data.performance]
   * @param {string} [data.generatedAt]
   */
  constructor(data = {}) {
    this.incidents = {
      total: data.incidents?.total ?? 0,
      active: data.incidents?.active ?? 0,
      investigating: data.incidents?.investigating ?? 0,
      resolved: data.incidents?.resolved ?? 0,
      falseAlarms: data.incidents?.falseAlarms ?? 0,
      byType: {
        spanFaults: data.incidents?.byType?.spanFaults ?? 0,
        transformerFaults: data.incidents?.byType?.transformerFaults ?? 0,
        feederFaults: data.incidents?.byType?.feederFaults ?? 0,
      },
    };

    this.tickets = {
      total: data.tickets?.total ?? 0,
      detected: data.tickets?.detected ?? 0,
      acknowledged: data.tickets?.acknowledged ?? 0,
      crewAssigned: data.tickets?.crewAssigned ?? 0,
      resolved: data.tickets?.resolved ?? 0,
      verified: data.tickets?.verified ?? 0,
      closed: data.tickets?.closed ?? 0,
      byPriority: {
        low: data.tickets?.byPriority?.low ?? 0,
        medium: data.tickets?.byPriority?.medium ?? 0,
        high: data.tickets?.byPriority?.high ?? 0,
        critical: data.tickets?.byPriority?.critical ?? 0,
      },
    };

    this.outages = {
      activeScheduled: data.outages?.activeScheduled ?? 0,
      totalScheduled: data.outages?.totalScheduled ?? 0,
      unscheduledActive: data.outages?.unscheduledActive ?? 0,
    };

    this.grid = {
      totalFeeders: data.grid?.totalFeeders ?? 0,
      affectedFeeders: data.grid?.affectedFeeders ?? 0,
      healthyFeeders: data.grid?.healthyFeeders ?? 0,
      totalTransformers: data.grid?.totalTransformers ?? 0,
      totalPoles: data.grid?.totalPoles ?? 0,
      onlineDevices: data.grid?.onlineDevices ?? 0,
      offlineDevices: data.grid?.offlineDevices ?? 0,
    };

    this.performance = {
      mttrMinutes: data.performance?.mttrMinutes ?? 0,
      mttaMinutes: data.performance?.mttaMinutes ?? 0,
      availabilityPercentage: data.performance?.availabilityPercentage ?? 100.0,
    };

    this.generatedAt = data.generatedAt || new Date().toISOString();
  }

  /**
   * Factory method to create DTO from aggregated repository data
   * @param {Object} rawData
   * @returns {AnalyticsSummaryDTO}
   */
  static fromAggregation(rawData) {
    return new AnalyticsSummaryDTO(rawData);
  }
}
