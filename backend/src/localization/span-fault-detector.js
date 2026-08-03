// src/localization/span-fault-detector.js
/**
 * Span Fault Detector (Phase 7.2)
 *
 * Consumes the `BoundarySearchResult` produced by the Boundary Detection
 * Engine and converts qualifying boundaries into **SpanFaultCandidate**
 * objects. The detector works entirely on the cached in‑memory graph
 * (`GraphRepository`) – no PostgreSQL queries are performed.
 *
 * The detector is deliberately isolated from any downstream concerns such
 * as DT/Feeder fault detection, confidence scoring, ticket creation, or
 * incident grouping.
 */
import { logger } from '../config/logger.js';
import crypto from 'crypto'; // Node's built‑in crypto for UUID generation

/**
 * Model representing a potential span fault.
 * @typedef {Object} SpanFaultCandidate
 * @property {string}   faultId           Unique identifier (UUID).
 * @property {string|number} parentPoleId   ID of the energized parent pole.
 * @property {string|number} childPoleId    ID of the de‑energized child pole.
 * @property {string|number} transformerId  ID of the transformer owning the span.
 * @property {number}   latitude          Mid‑point latitude between parent & child.
 * @property {number}   longitude         Mid‑point longitude between parent & child.
 * @property {?string|number} pincode    Postal code – prefers parent, falls back to child.
 * @property {Array<string|number>} affectedPoles List of downstream pole IDs.
 * @property {number}   affectedPoleCount Number of poles downstream of the child.
 * @property {string}   reason            Reason for classification (fixed string).
 * @property {string}   status            Current processing status (e.g., 'new').
 */

/**
 * Helper: safely retrieve a pole entity from the repository.
 * Returns `null` if the pole cannot be found – the caller can decide how to
 * handle missing data (e.g., dead‑sensor placeholder).
 */
function getPole(repository, poleId) {
  // GraphRepository exposes a generic getById method.
  return repository.getById('pole', poleId) || null;
}

/**
 * Detect span fault candidates from a BoundarySearchResult.
 *
 * @param {Object} repository           GraphRepository (cached graph).
 * @param {Object} boundarySearchResult BoundarySearchResult produced by
 *                                       `detectBoundaries`.
 * @returns {SpanFaultCandidate[]} Array of detected candidates.
 */
export async function detectSpanFaults(repository, boundarySearchResult) {
  const startTime = Date.now();
  logger.info({ event: 'span_detector_started' }, 'Span fault detection started');

  // Guard against missing or error results.
  if (!boundarySearchResult || boundarySearchResult.error) {
    const elapsed = Date.now() - startTime;
    logger.warn({ event: 'span_detector_completed', elapsed, reason: 'Invalid BoundarySearchResult' }, 'Span detection completed with no candidates');
    return [];
  }

  const candidates = [];

  for (const boundary of boundarySearchResult.boundaries || []) {
    // Validate boundary fields – they should already represent a LIVE→DARK edge.
    const parentPole = getPole(repository, boundary.parentPoleId);
    const childPole = getPole(repository, boundary.childPoleId);

    // If either pole is missing, we cannot construct a candidate.
    // This is where a dead‑sensor detection hook could be added later.
    if (!parentPole || !childPole) {
      logger.warn({
        event: 'span_detector_missing_pole',
        transformerId: boundarySearchResult.transformerId,
        parentPoleId: boundary.parentPoleId,
        childPoleId: boundary.childPoleId
      }, 'Pole data missing for boundary – skipping candidate');
      continue;
    }

    // Ensure the boundary still satisfies the energization condition.
    if (!parentPole.energized || childPole.energized) {
      // This should not happen for a Boundary, but we guard defensively.
      continue;
    }

    // ----- Coordinate calculation -----
    const latitude = (Number(parentPole.lat) + Number(childPole.lat)) / 2;
    const longitude = (Number(parentPole.lon) + Number(childPole.lon)) / 2;
    logger.info({
      event: 'span_coordinates_calculated',
      transformerId: boundary.transformerId,
      parentPoleId: parentPole.id,
      childPoleId: childPole.id,
      latitude,
      longitude
    }, 'Coordinates calculated for span fault candidate');

    // ----- Pincode selection -----
    const pincode = parentPole.pincode ?? childPole.pincode ?? null;

    const candidate = {
      faultId: crypto.randomUUID(),
      parentPoleId: parentPole.id,
      childPoleId: childPole.id,
      transformerId: boundary.transformerId,
      latitude,
      longitude,
      pincode,
      affectedPoles: boundary.affectedPoles,
      affectedPoleCount: boundary.affectedPoleCount,
      reason: 'LIVE_TO_DARK_boundary', // fixed reason indicating why this is a span fault
      status: 'new' // initial status – downstream services may update it
    };

    candidates.push(candidate);
    logger.info({
      event: 'span_candidate_created',
      faultId: candidate.faultId,
      transformerId: candidate.transformerId,
      parentPoleId: candidate.parentPoleId,
      childPoleId: candidate.childPoleId,
      affectedPoleCount: candidate.affectedPoleCount
    }, 'Span fault candidate created');
  }

  const elapsed = Date.now() - startTime;
  logger.info({
    event: 'span_detector_completed',
    candidateCount: candidates.length,
    traversalTimeMs: elapsed
  }, 'Span fault detection completed');

  return candidates;
}
