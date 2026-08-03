// src/localization/boundary-detector.js
/**
 * Boundary Detection Engine (Phase 7.1 – Enhanced)
 *
 * Detects **all** LIVE → DARK transitions (boundaries) within the pole
 * hierarchy of a specified transformer. It works completely on the cached
 * in‑memory graph (GraphRepository) – no PostgreSQL queries are performed.
 *
 * The engine performs a depth‑first search (DFS) with a visited set to guard
 * against accidental cycles. For every edge where the parent pole is
 * energized (`energized === true`) and the child pole is not energized
 * (`energized === false`) a **Boundary** object is created.
 *
 * Each Boundary contains the parent/child identifiers, the list of all
 * downstream (affected) poles from the child, the number of affected poles,
 * an optional `branchId` (taken from the child pole if present), and the
 * depth of the child pole from the transformer root.
 *
 * The engine returns a **BoundarySearchResult** summarising all detected
 * boundaries, visited node/edge counts and the total traversal time.
 */
import { logger } from '../config/logger.js';

/**
 * Boundary model representing a LIVE → DARK transition.
 * @typedef {Object} Boundary
 * @property {string|number} parentPoleId   ID of the energized parent pole.
 * @property {string|number} childPoleId    ID of the de‑energized child pole.
 * @property {number}        affectedPoleCount Number of poles downstream of the child.
 * @property {Array<string|number>} affectedPoles   List of downstream pole IDs.
 * @property {?string|number} branchId    Optional branch identifier (nullable).
 * @property {number}        depth       Depth of the child pole from the transformer root.
 */

/**
 * Result model for a boundary search operation.
 * @typedef {Object} BoundarySearchResult
 * @property {Boundary[]} boundaries       All detected boundaries.
 * @property {number}    boundaryCount    Total number of boundaries.
 * @property {number}    visitedNodes     Count of unique poles visited.
 * @property {number}    visitedEdges     Count of edges examined.
 * @property {number}    traversalTimeMs  Total time spent in milliseconds.
 * @property {?string}   error            Optional error message (e.g., transformer not found).
 */

/** Helper: recursively collect all descendant pole IDs starting from a pole. */
function collectSubtree(repository, poleId, visited = new Set()) {
  const result = [];
  const stack = [poleId];
  while (stack.length) {
    const currentId = stack.pop();
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    result.push(currentId);
    const children = repository.getChildren(currentId) || [];
    for (const childId of children) {
      stack.push(childId);
    }
  }
  return result;
}

/**
 * Detect all LIVE → DARK boundaries for a given transformer.
 *
 * @param {Object} repository      GraphRepository instance (cached graph).
 * @param {string|number} transformerId Identifier of the transformer to analyze.
 * @returns {BoundarySearchResult} Detailed search result.
 */
export async function detectBoundaries(repository, transformerId) {
  const startTime = Date.now();
  logger.info({ event: 'boundary_search_started', transformerId }, 'Boundary detection started');

  // Validate transformer existence.
  const transformer = repository.getById('transformer', transformerId);
  if (!transformer) {
    const elapsed = Date.now() - startTime;
    logger.warn({ event: 'boundary_search_error', transformerId, reason: 'Transformer not found' }, 'Transformer does not exist');
    return {
      boundaries: [],
      boundaryCount: 0,
      visitedNodes: 0,
      visitedEdges: 0,
      traversalTimeMs: elapsed,
      error: 'Transformer not found'
    };
  }

  // Gather poles belonging to this transformer.
  const transformerPoles = (repository.poles || []).filter(p => p.transformerId === transformerId);

  const boundaries = [];
  const visitedNodes = new Set();
  let visitedEdges = 0;

  // Map of poleId -> pole for quick lookup.
  const poleMap = new Map();
  transformerPoles.forEach(p => poleMap.set(p.id, p));

  // Identify root poles (no parent within the same transformer).
  const rootIds = [];
  transformerPoles.forEach(p => {
    const parentId = p.parentPoleId ?? p.parentId ?? null;
    if (!parentId || !poleMap.has(parentId)) {
      rootIds.push(p.id);
    }
  });

  // DFS stack holds objects { id, depth }.
  const stack = rootIds.map(id => ({ id, depth: 0 }));

  while (stack.length) {
    const { id: parentId, depth } = stack.pop();
    if (visitedNodes.has(parentId)) continue;
    visitedNodes.add(parentId);
    const parentPole = poleMap.get(parentId);
    if (!parentPole) continue; // Safety – should not happen.

    const childrenIds = repository.getChildren(parentId) || [];
    for (const childId of childrenIds) {
      visitedEdges++;
      const childPole = poleMap.get(childId);
      if (!childPole) continue; // Belongs to another transformer.

      // Boundary condition: parent energized, child not energized.
      if (parentPole.energized && !childPole.energized) {
        const affectedPoles = collectSubtree(repository, childId);
        const boundary = {
          parentPoleId: parentPole.id,
          childPoleId: childPole.id,
          affectedPoleCount: affectedPoles.length,
          affectedPoles,
          branchId: childPole.branchId ?? null,
          depth: depth + 1 // child depth is parent depth + 1
        };
        boundaries.push(boundary);
        logger.info({
          event: 'boundary_found',
          transformerId,
          parentPoleId: parentPole.id,
          childPoleId: childPole.id,
          affectedPoleCount: affectedPoles.length,
          depth: depth + 1
        }, 'Boundary detected');
        // Continue traversal to discover further boundaries downstream.
      }

      // Continue DFS deeper.
      stack.push({ id: childId, depth: depth + 1 });
    }
  }

  const elapsed = Date.now() - startTime;
  logger.info({
    event: 'boundary_search_completed',
    transformerId,
    boundaryCount: boundaries.length,
    visitedNodes: visitedNodes.size,
    visitedEdges,
    traversalTimeMs: elapsed
  }, 'Boundary detection completed');

  return {
    boundaries,
    boundaryCount: boundaries.length,
    visitedNodes: visitedNodes.size,
    visitedEdges,
    traversalTimeMs: elapsed
  };
}
