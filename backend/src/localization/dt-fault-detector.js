// src/localization/dt-fault-detector.js
/**
 * Distribution Transformer (DT) Fault Detector – Phase 7.3
 *
 * Consumes a `BoundarySearchResult` and the cached `GraphRepository` to
 * determine whether a transformer has suffered a total outage (DT fault).
 *
 * A DT Fault Candidate is produced **only** when:
 *   1. The `BoundarySearchResult` contains **zero** boundaries for the
 *      transformer (i.e., no LIVE → DARK transitions were observed).
 *   2. **All** monitored poles belonging to the transformer are de‑energized
 *      (`energized === false`).
 *
 * The detector is completely isolated from downstream concerns such as
 * feeder‑fault detection, dead‑sensor logic, confidence scoring, ticket
 * creation, incident grouping, or restoration handling.
 */
import { logger } from '../config/logger.js';
import crypto from 'crypto'; // Node's built‑in crypto for UUID generation

/**
 * Model representing a DT fault candidate.
 * @typedef {Object} DTFaultCandidate
 * @property {string}   faultId           Unique identifier (UUID).
 * @property {string|number} transformerId   ID of the affected transformer.
 * @property {string|number} feederId        ID of the feeder the transformer belongs to.
 * @property {number}   latitude          Latitude taken directly from transformer.
 * @property {number}   longitude         Longitude taken directly from transformer.
 * @property {?string|number} pincode      Postal code – first available from any pole, or null.
 * @property {Array<string|number>} affectedPoles    List of IDs of all poles under the transformer.
 * @property {number}   affectedPoleCount Number of poles under the transformer.
 * @property {string}   reason            Fixed reason string.
 * @property {string}   status            Initial processing status.
 */

/** Helper: retrieve a pole by ID from the repository. */
function getPole(repository, poleId) {
  return repository.getById('pole', poleId) || null;
}

/** Helper: retrieve the first non‑null pincode from a list of poles. */
function findFirstPincode(poles) {
  for (const p of poles) {
    if (p.pincode != null) return p.pincode;
  }
  return null;
}

/**
 * Detect DT fault candidates for a specific transformer.
 *
 * @param {Object} repository           GraphRepository (cached graph).
 * @param {Object} boundarySearchResult BoundarySearchResult produced by the Boundary Detector.
 * @param {string|number} transformerId Identifier of the transformer to evaluate.
 * @returns {DTFaultCandidate[]} Array containing zero or one DT fault candidate.
 */
export async function detectDTFaults(repository, boundarySearchResult, transformerId) {
  const startTime = Date.now();
  logger.info({ event: 'dt_detector_started', transformerId }, 'DT fault detection started');

  // Validate transformer existence.
  const transformer = repository.getById('transformer', transformerId);
  if (!transformer) {
    logger.warn({ event: 'dt_detector_error', transformerId, reason: 'Transformer not found' }, 'Transformer missing – DT detection aborted');
    return [];
  }

  // Ensure the boundary result pertains to the same transformer (optional safety).
  const boundaryCount = (boundarySearchResult && boundarySearchResult.boundaries) ? boundarySearchResult.boundaries.length : 0;

  // Gather all poles belonging to this transformer.
  const transformerPoles = (repository.poles || []).filter(p => p.transformerId === transformerId);

  // If there are no poles, we cannot assess the state – return empty.
  if (!transformerPoles.length) {
    logger.warn({ event: 'dt_detector_error', transformerId, reason: 'No poles for transformer' }, 'No poles found – DT detection aborted');
    return [];
  }

  // Condition 1: No boundaries detected.
  if (boundaryCount !== 0) {
    logger.info({ event: 'dt_detector_completed', transformerId, candidateCount: 0, traversalTimeMs: Date.now() - startTime }, 'Boundaries present – no DT fault candidate');
    return [];
  }

  // Condition 2: All monitored poles are OFF.
  const anyPoleEnergized = transformerPoles.some(p => p.energized);
  if (anyPoleEnergized) {
    logger.info({ event: 'dt_detector_completed', transformerId, candidateCount: 0, traversalTimeMs: Date.now() - startTime }, 'At least one pole is ON – no DT fault candidate');
    return [];
  }

  // All conditions satisfied – create a DT fault candidate.
  const affectedPoles = transformerPoles.map(p => p.id);
  const affectedPoleCount = affectedPoles.length;
  const pincode = findFirstPincode(transformerPoles);

  const candidate = {
    faultId: crypto.randomUUID(),
    transformerId,
    feederId: transformer.feederId ?? null,
    latitude: Number(transformer.lat),
    longitude: Number(transformer.lon),
    pincode,
    affectedPoles,
    affectedPoleCount,
    reason: 'NO_BOUNDARIES_ALL_POLES_OFF',
    status: 'new'
  };

  logger.info({
    event: 'dt_candidate_created',
    faultId: candidate.faultId,
    transformerId,
    feederId: candidate.feederId,
    affectedPoleCount,
    pincode
  }, 'DT fault candidate created');

  const elapsed = Date.now() - startTime;
  logger.info({ event: 'dt_detector_completed', transformerId, candidateCount: 1, traversalTimeMs: elapsed }, 'DT fault detection completed');

  return [candidate];
}
