/**
 * @file outage-analytics.dto.js
 * @description Data Transfer Object for Outage Analytics responses.
 */

export class OutageAnalyticsDTO {
  /**
   * @param {Object} params
   * @param {Array<Object>} [params.items]
   * @param {Object} [params.summary]
   * @param {Object} [params.pagination]
   * @param {Object} [params.filterApplied]
   */
  constructor({ items = [], summary = {}, pagination = {}, filterApplied = {} } = {}) {
    this.items = items.map((item) => ({
      id: item.id,
      type: item.type || (item.isScheduled ? 'SCHEDULED' : 'UNSCHEDULED'),
      title: item.title || item.rootCause || 'Outage Event',
      feederId: item.feederId || item.feeder_id || null,
      dtId: item.dtId || item.dt_id || null,
      scope: item.scope || item.faultType || 'UNKNOWN',
      startTime: item.startTime ? new Date(item.startTime).toISOString() : null,
      endTime: item.endTime ? new Date(item.endTime).toISOString() : null,
      durationMinutes: item.durationMinutes != null ? Math.round(item.durationMinutes) : null,
      status: item.status || 'UNKNOWN',
      affectedHouseholds: item.affectedHouseholds ?? 0,
      affectedPolesCount: item.affectedPolesCount ?? 0,
      isScheduled: Boolean(item.isScheduled),
      confidence: item.confidence != null ? Number(item.confidence.toFixed(2)) : null,
    }));

    this.summary = {
      totalOutages: summary.totalOutages ?? this.items.length,
      scheduledCount: summary.scheduledCount ?? 0,
      unscheduledCount: summary.unscheduledCount ?? 0,
      totalDurationMinutes: Math.round(summary.totalDurationMinutes ?? 0),
      avgDurationMinutes: Math.round((summary.avgDurationMinutes ?? 0) * 10) / 10,
      totalAffectedHouseholds: summary.totalAffectedHouseholds ?? 0,
    };

    this.pagination = {
      page: pagination.page ?? 1,
      pageSize: pagination.pageSize ?? 20,
      totalItems: pagination.totalItems ?? this.items.length,
      totalPages: pagination.totalPages ?? 1,
      hasNextPage: pagination.hasNextPage ?? false,
      hasPrevPage: pagination.hasPrevPage ?? false,
    };

    this.filterApplied = {
      startDate: filterApplied.startDate || null,
      endDate: filterApplied.endDate || null,
      feederId: filterApplied.feederId || null,
      scope: filterApplied.scope || null,
      type: filterApplied.type || null,
    };
  }

  /**
   * Factory method
   * @param {Object} raw
   * @returns {OutageAnalyticsDTO}
   */
  static transform(raw) {
    return new OutageAnalyticsDTO(raw);
  }
}
