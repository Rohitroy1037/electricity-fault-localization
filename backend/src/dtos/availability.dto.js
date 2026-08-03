/**
 * @file availability.dto.js
 * @description Data Transfer Object for Grid Reliability and Availability analytics responses.
 */

export class AvailabilityDTO {
  /**
   * @param {Object} params
   * @param {Object} [params.overall]
   * @param {Array<Object>} [params.byFeeder]
   * @param {Array<Object>} [params.byInterval]
   * @param {Object} [params.filterApplied]
   */
  constructor({ overall = {}, byFeeder = [], byInterval = [], filterApplied = {} } = {}) {
    this.overall = {
      systemAvailabilityPercentage: Number((overall.systemAvailabilityPercentage ?? 100.0).toFixed(3)),
      asai: Number((overall.asai ?? 0.999).toFixed(4)), // Average Service Availability Index
      saidiMinutes: Number((overall.saidiMinutes ?? 0).toFixed(2)), // System Average Interruption Duration Index
      saifiCount: Number((overall.saifiCount ?? 0).toFixed(2)), // System Average Interruption Frequency Index
      caidiMinutes: Number((overall.caidiMinutes ?? 0).toFixed(2)), // Customer Average Interruption Duration Index
      totalMonitoredMinutes: Math.round(overall.totalMonitoredMinutes ?? 0),
      totalDowntimeMinutes: Math.round(overall.totalDowntimeMinutes ?? 0),
      totalCustomersServed: overall.totalCustomersServed ?? 0,
    };

    this.byFeeder = byFeeder.map((f) => ({
      feederId: f.feederId || f.feeder_id,
      feederName: f.feederName || f.feeder_name || f.feederId,
      availabilityPercentage: Number((f.availabilityPercentage ?? 100.0).toFixed(3)),
      downtimeMinutes: Math.round(f.downtimeMinutes ?? 0),
      incidentCount: f.incidentCount ?? 0,
      affectedHouseholds: f.affectedHouseholds ?? 0,
    }));

    this.byInterval = byInterval.map((bucket) => ({
      timestamp: bucket.timestamp,
      label: bucket.label || bucket.timestamp,
      availabilityPercentage: Number((bucket.availabilityPercentage ?? 100.0).toFixed(3)),
      downtimeMinutes: Math.round(bucket.downtimeMinutes ?? 0),
      outageCount: bucket.outageCount ?? 0,
    }));

    this.filterApplied = {
      startDate: filterApplied.startDate || null,
      endDate: filterApplied.endDate || null,
      groupBy: filterApplied.groupBy || 'day',
      feederId: filterApplied.feederId || null,
    };
  }

  /**
   * Factory method
   * @param {Object} raw
   * @returns {AvailabilityDTO}
   */
  static transform(raw) {
    return new AvailabilityDTO(raw);
  }
}
