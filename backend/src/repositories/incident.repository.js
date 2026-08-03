/**
 * @file incident.repository.js
 * @description Incident/Fault repository providing data access abstraction over Prisma Fault model.
 */

import prisma from '../utils/prisma.js';

export class IncidentRepository {
  /**
   * Finds faults based on structured filter criteria
   * @param {Object} filter
   * @returns {Promise<Array<Object>>}
   */
  static async findMany(filter = {}) {
    const where = this._buildWhereClause(filter);
    const orderBy = this._buildOrderBy(filter);
    const skip = filter.page && filter.pageSize ? (filter.page - 1) * filter.pageSize : undefined;
    const take = filter.pageSize || undefined;

    return prisma.fault.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        feeder: true,
        transformer: true,
        from_pole: true,
        to_pole: true,
        ai_summaries: true,
      },
    });
  }

  /**
   * Counts faults matching filter
   * @param {Object} filter
   * @returns {Promise<number>}
   */
  static async count(filter = {}) {
    const where = this._buildWhereClause(filter);
    return prisma.fault.count({ where });
  }

  /**
   * Fetches raw fault statistics for analytics aggregation
   * @param {Object} filter
   * @returns {Promise<Object>}
   */
  static async getFaultStats(filter = {}) {
    const where = this._buildWhereClause(filter);

    const [total, open, investigating, resolved, falseAlarms, byType] = await Promise.all([
      prisma.fault.count({ where }),
      prisma.fault.count({ where: { ...where, status: 'OPEN' } }),
      prisma.fault.count({ where: { ...where, status: 'INVESTIGATING' } }),
      prisma.fault.count({ where: { ...where, status: 'RESOLVED' } }),
      prisma.fault.count({ where: { ...where, status: 'FALSE_ALARM' } }),
      prisma.fault.groupBy({
        by: ['fault_type'],
        where,
        _count: { id: true },
      }),
    ]);

    const faultTypeMap = byType.reduce((acc, curr) => {
      acc[curr.fault_type] = curr._count.id;
      return acc;
    }, {});

    return {
      total,
      active: open + investigating,
      investigating,
      resolved,
      falseAlarms,
      byType: {
        spanFaults: faultTypeMap['SPAN_FAULT'] || 0,
        transformerFaults: faultTypeMap['TRANSFORMER_FAULT'] || 0,
        feederFaults: faultTypeMap['FEEDER_FAULT'] || 0,
      },
    };
  }

  /**
   * Helper to construct Prisma where clause from structured filter
   * @private
   */
  static _buildWhereClause(filter = {}) {
    const where = {};

    if (filter.feederId) {
      where.feeder_id = filter.feederId;
    }

    if (filter.dtId) {
      where.dt_id = filter.dtId;
    }

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.faultType) {
      where.fault_type = filter.faultType;
    }

    if (filter.startDate || filter.endDate) {
      where.detected_at = {};
      if (filter.startDate) where.detected_at.gte = new Date(filter.startDate);
      if (filter.endDate) where.detected_at.lte = new Date(filter.endDate);
    }

    if (filter.search) {
      where.OR = [
        { root_cause: { contains: filter.search, mode: 'insensitive' } },
        { feeder_id: { contains: filter.search, mode: 'insensitive' } },
        { dt_id: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  /**
   * Helper to construct Prisma orderBy clause
   * @private
   */
  static _buildOrderBy(filter = {}) {
    const sortBy = filter.sortBy || 'detected_at';
    const sortOrder = filter.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const allowedSortFields = ['detected_at', 'resolved_at', 'confidence', 'created_at', 'status'];
    const field = allowedSortFields.includes(sortBy) ? sortBy : 'detected_at';

    return { [field]: sortOrder };
  }
}
