/**
 * @file ticket.repository.js
 * @description Ticket repository providing data access abstraction over Prisma Ticket model.
 */

import prisma from '../utils/prisma.js';

export class TicketRepository {
  /**
   * Finds tickets based on structured filter criteria
   * @param {Object} filter
   * @returns {Promise<Array<Object>>}
   */
  static async findMany(filter = {}) {
    const where = this._buildWhereClause(filter);
    const orderBy = this._buildOrderBy(filter);
    const skip = filter.page && filter.pageSize ? (filter.page - 1) * filter.pageSize : undefined;
    const take = filter.pageSize || undefined;

    return prisma.ticket.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        fault: true,
      },
    });
  }

  /**
   * Counts tickets matching filter
   * @param {Object} filter
   * @returns {Promise<number>}
   */
  static async count(filter = {}) {
    const where = this._buildWhereClause(filter);
    return prisma.ticket.count({ where });
  }

  /**
   * Fetches ticket statistics for analytics aggregation
   * @param {Object} filter
   * @returns {Promise<Object>}
   */
  static async getTicketStats(filter = {}) {
    const where = this._buildWhereClause(filter);

    const [total, byStatus, byPriority] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),
      prisma.ticket.groupBy({
        by: ['priority'],
        where,
        _count: { id: true },
      }),
    ]);

    const statusMap = byStatus.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {});

    const priorityMap = byPriority.reduce((acc, curr) => {
      acc[curr.priority] = curr._count.id;
      return acc;
    }, {});

    return {
      total,
      detected: statusMap['DETECTED'] || 0,
      acknowledged: statusMap['ACKNOWLEDGED'] || 0,
      crewAssigned: statusMap['CREW_ASSIGNED'] || 0,
      resolved: statusMap['RESOLVED'] || 0,
      verified: statusMap['VERIFIED'] || 0,
      closed: statusMap['CLOSED'] || 0,
      byPriority: {
        low: priorityMap['LOW'] || 0,
        medium: priorityMap['MEDIUM'] || 0,
        high: priorityMap['HIGH'] || 0,
        critical: priorityMap['CRITICAL'] || 0,
      },
    };
  }

  /**
   * Helper to construct Prisma where clause from structured filter
   * @private
   */
  static _buildWhereClause(filter = {}) {
    const where = {};

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.priority) {
      where.priority = filter.priority;
    }

    if (filter.assignedCrew) {
      where.assigned_crew = filter.assignedCrew;
    }

    if (filter.startDate || filter.endDate) {
      where.created_at = {};
      if (filter.startDate) where.created_at.gte = new Date(filter.startDate);
      if (filter.endDate) where.created_at.lte = new Date(filter.endDate);
    }

    if (filter.search) {
      where.OR = [
        { ticket_no: { contains: filter.search, mode: 'insensitive' } },
        { assigned_crew: { contains: filter.search, mode: 'insensitive' } },
        { crew_notes: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  /**
   * Helper to construct Prisma orderBy clause
   * @private
   */
  static _buildOrderBy(filter = {}) {
    const sortBy = filter.sortBy || 'created_at';
    const sortOrder = filter.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const allowedSortFields = ['created_at', 'updated_at', 'detected_at', 'priority', 'status'];
    const field = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';

    return { [field]: sortOrder };
  }
}
