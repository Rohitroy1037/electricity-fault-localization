/**
 * @file mttr.dto.js
 * @description Data Transfer Object for Mean Time To Resolution (MTTR) analytics responses.
 */

export class MTTRDTO {
  /**
   * @param {Object} params
   * @param {Object} [params.overall]
   * @param {Object} [params.byFaultType]
   * @param {Object} [params.byPriority]
   * @param {Array<Object>} [params.byInterval]
   * @param {Object} [params.filterApplied]
   */
  constructor({ overall = {}, byFaultType = {}, byPriority = {}, byInterval = [], filterApplied = {} } = {}) {
    this.overall = {
      mttrMinutes: Number((overall.mttrMinutes ?? 0).toFixed(1)),
      mttaMinutes: Number((overall.mttaMinutes ?? 0).toFixed(1)),
      mttdMinutes: Number((overall.mttdMinutes ?? 0).toFixed(1)),
      mttvMinutes: Number((overall.mttvMinutes ?? 0).toFixed(1)),
      sampleSize: overall.sampleSize ?? 0,
    };

    this.byFaultType = {
      spanFault: {
        mttrMinutes: Number((byFaultType.spanFault?.mttrMinutes ?? 0).toFixed(1)),
        count: byFaultType.spanFault?.count ?? 0,
      },
      transformerFault: {
        mttrMinutes: Number((byFaultType.transformerFault?.mttrMinutes ?? 0).toFixed(1)),
        count: byFaultType.transformerFault?.count ?? 0,
      },
      feederFault: {
        mttrMinutes: Number((byFaultType.feederFault?.mttrMinutes ?? 0).toFixed(1)),
        count: byFaultType.feederFault?.count ?? 0,
      },
    };

    this.byPriority = {
      low: {
        mttrMinutes: Number((byPriority.low?.mttrMinutes ?? 0).toFixed(1)),
        count: byPriority.low?.count ?? 0,
      },
      medium: {
        mttrMinutes: Number((byPriority.medium?.mttrMinutes ?? 0).toFixed(1)),
        count: byPriority.medium?.count ?? 0,
      },
      high: {
        mttrMinutes: Number((byPriority.high?.mttrMinutes ?? 0).toFixed(1)),
        count: byPriority.high?.count ?? 0,
      },
      critical: {
        mttrMinutes: Number((byPriority.critical?.mttrMinutes ?? 0).toFixed(1)),
        count: byPriority.critical?.count ?? 0,
      },
    };

    this.byInterval = byInterval.map((bucket) => ({
      timestamp: bucket.timestamp,
      label: bucket.label || bucket.timestamp,
      mttrMinutes: Number((bucket.mttrMinutes ?? 0).toFixed(1)),
      mttaMinutes: Number((bucket.mttaMinutes ?? 0).toFixed(1)),
      resolvedCount: bucket.resolvedCount ?? 0,
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
   * @returns {MTTRDTO}
   */
  static transform(raw) {
    return new MTTRDTO(raw);
  }
}
