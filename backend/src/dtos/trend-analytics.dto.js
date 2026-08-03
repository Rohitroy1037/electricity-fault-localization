/**
 * @file trend-analytics.dto.js
 * @description Data Transfer Object for time-series trend analytics responses.
 */

export class TrendAnalyticsDTO {
  /**
   * @param {Object} params
   * @param {string} [params.groupBy]
   * @param {Object} [params.dateRange]
   * @param {Array<Object>} [params.series]
   * @param {Object} [params.totals]
   */
  constructor({ groupBy = 'day', dateRange = {}, series = [], totals = {} } = {}) {
    this.groupBy = groupBy;
    this.dateRange = {
      startDate: dateRange.startDate || null,
      endDate: dateRange.endDate || null,
    };

    this.series = series.map((bucket) => ({
      timestamp: bucket.timestamp,
      label: bucket.label || bucket.timestamp,
      incidents: {
        total: bucket.incidents?.total ?? 0,
        spanFaults: bucket.incidents?.spanFaults ?? 0,
        transformerFaults: bucket.incidents?.transformerFaults ?? 0,
        feederFaults: bucket.incidents?.feederFaults ?? 0,
      },
      tickets: {
        created: bucket.tickets?.created ?? 0,
        resolved: bucket.tickets?.resolved ?? 0,
        closed: bucket.tickets?.closed ?? 0,
      },
      outages: {
        count: bucket.outages?.count ?? 0,
        totalDurationMinutes: Math.round(bucket.outages?.totalDurationMinutes ?? 0),
      },
    }));

    this.totals = {
      totalIncidents: totals.totalIncidents ?? 0,
      totalTicketsCreated: totals.totalTicketsCreated ?? 0,
      totalTicketsResolved: totals.totalTicketsResolved ?? 0,
      totalOutageDurationMinutes: Math.round(totals.totalOutageDurationMinutes ?? 0),
    };
  }

  /**
   * Factory method
   * @param {Object} raw
   * @returns {TrendAnalyticsDTO}
   */
  static transform(raw) {
    return new TrendAnalyticsDTO(raw);
  }
}
