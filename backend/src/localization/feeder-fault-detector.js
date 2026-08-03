// src/localization/feeder-fault-detector.js
/**
 * Feeder Fault Detector (Phase 7.6)
 *
 * Detects feeder‑wide outages using only the DTFaultCandidate[] produced by the
 * DT Fault Detector. No telemetry is re‑queried; all required information is
 * derived from the candidates and the static topology cached in GraphRepository.
 */
import crypto from 'crypto';
import { logger } from '../config/logger.js';

/**
 * @typedef {Object} DTFaultCandidate
 * @property {string|number} transformerId  Identifier of the transformer.
 * @property {string} status                Expected to be "OFF" for a fault.
 * @property {string|number} feederId       Identifier of the feeder the transformer belongs to.
 * // other fields may exist but are not required here
 */

/**
 * @typedef {Object} FeederFaultCandidate
 * @property {string}            faultId
 * @property {string|number}    feederId
 * @property {Array<string|number>} transformerIds
 * @property {number}           latitude   // centroid of affected transformers
 * @property {number}           longitude  // centroid of affected transformers
 * @property {number}           affectedTransformers
 * @property {number}           affectedPoles
 * @property {number}           affectedHouseholds
 * @property {string}           reason
 * @property {string}           status
 * @property {'HIGH'|'MEDIUM'|'LOW'} certaintyLevel
 * @property {'FULL'|'PARTIAL'} feederType
 */

/** Helper: group DTFaultCandidate[] by feederId */
function groupByFeeder(candidates) {
  const map = new Map();
  for (const c of candidates) {
    const fid = c.feederId;
    if (!fid) continue; // ignore candidates without feeder association
    if (!map.has(fid)) map.set(fid, []);
    map.get(fid).push(c);
  }
  return map;
}

/** Helper: verify that every transformer belonging to a feeder has a corresponding
 *  DTFaultCandidate and that none is in an UNKNOWN state.
 *  Returns an object with a boolean flag and the list of transformer IDs.
 */
function allTransformersKnownAndOff(feederId, dtCandidates, repository) {
  // Retrieve the full list of transformer IDs for the feeder from static topology.
  const feeder = repository.getById('feeder', feederId);
  const allTransformerIds = (feeder && Array.isArray(feeder.transformerIds)) ? feeder.transformerIds : [];

  // Build a map of transformerId -> candidate for quick lookup.
  const candMap = new Map();
  for (const c of dtCandidates) {
    candMap.set(c.transformerId, c);
  }

  // Ensure every transformer has a candidate and that the status is definitively OFF.
  for (const tId of allTransformerIds) {
    const cand = candMap.get(tId);
    if (!cand) return { ok: false, transformerIds: [] }; // missing candidate -> unknown topology
    if (cand.status !== 'OFF') return { ok: false, transformerIds: [] }; // unknown/ambiguous state
  }

  return { ok: true, transformerIds: allTransformerIds };
}

/** Helper: compute centroid (average lat/lon) of the given transformers. */
function computeCentroid(transformerIds, repository) {
  let sumLat = 0;
  let sumLon = 0;
  let count = 0;
  for (const tId of transformerIds) {
    const transformer = repository.getById('transformer', tId);
    if (transformer && typeof transformer.lat === 'number' && typeof transformer.lon === 'number') {
      sumLat += transformer.lat;
      sumLon += transformer.lon;
      count++;
    }
  }
  if (count === 0) return { latitude: null, longitude: null };
  return { latitude: sumLat / count, longitude: sumLon / count };
}

/** Helper: count total poles under the given transformers. */
function sumAffectedPoles(transformerIds, repository) {
  let total = 0;
  for (const tId of transformerIds) {
    const poles = repository.getPolesByTransformer ? repository.getPolesByTransformer(tId) : [];
    total += poles.length;
  }
  return total;
}

/** Helper: sum households served by the given transformers using the registry field. */
function sumAffectedHouseholds(transformerIds, repository) {
  let total = 0;
  for (const tId of transformerIds) {
    const transformer = repository.getById('transformer', tId);
    const households = transformer && typeof transformer.households_served === 'number' ? transformer.households_served : 0;
    total += households;
  }
  return total;
}

/** Helper: determine feeder type (FULL or PARTIAL).
 *  FULL – the feeder's registered transformer list exactly matches the set of
 *         transformers present in the system (i.e., repository knows all).
 *  PARTIAL – otherwise.
 */
function determineFeederType(feederId, repository) {
  const feeder = repository.getById('feeder', feederId);
  if (!feeder) return 'PARTIAL';
  const declared = feeder.transformerIds || [];
  // Compare with transformer IDs actually present in the repository.
  const repositoryTransformers = repository.transformers?.map(t => t.id) || [];
  const missing = declared.filter(id => !repositoryTransformers.includes(id));
  return missing.length === 0 ? 'FULL' : 'PARTIAL';
}

/**
 * Main detector function.
 * @param {Object} repository           Cached GraphRepository.
 * @param {Array<DTFaultCandidate>} dtFaultCandidates
 * @returns {Array<FeederFaultCandidate>}
 */
export async function detectFeederFaults(repository, dtFaultCandidates) {
  const startTime = Date.now();
  logger.info({ event: 'feeder_detector_started' }, 'Feeder fault detection started');

  const result = [];
  const candidatesByFeeder = groupByFeeder(dtFaultCandidates);

  for (const [feederId, dtCandidates] of candidatesByFeeder.entries()) {
    const { ok, transformerIds } = allTransformersKnownAndOff(feederId, dtCandidates, repository);
    if (!ok) {
      // Skip this feeder – missing or unknown transformer data.
      continue;
    }

    // Compute geometric and count aggregates.
    const { latitude, longitude } = computeCentroid(transformerIds, repository);
    const affectedPoles = sumAffectedPoles(transformerIds, repository);
    const affectedHouseholds = sumAffectedHouseholds(transformerIds, repository);
    const feederType = determineFeederType(feederId, repository);
    const certaintyLevel = 'HIGH'; // all transformers known and off per rules

    const candidate = {
      faultId: crypto.randomUUID(),
      feederId,
      transformerIds,
      latitude,
      longitude,
      affectedTransformers: transformerIds.length,
      affectedPoles,
      affectedHouseholds,
      reason: 'All monitored transformers de‑energized',
      status: 'OPEN',
      certaintyLevel,
      feederType,
    };

    result.push(candidate);
    logger.info({
      event: 'feeder_candidate_created',
      feederId,
      faultId: candidate.faultId,
      transformerCount: transformerIds.length,
      affectedPoles,
      affectedHouseholds,
      certaintyLevel,
      feederType,
    }, 'Feeder fault candidate created');
  }

  const elapsed = Date.now() - startTime;
  logger.info({
    event: 'feeder_detector_completed',
    totalFeedersProcessed: candidatesByFeeder.size,
    feederFaultsCreated: result.length,
    traversalTimeMs: elapsed,
  }, 'Feeder fault detection completed');

  return result;
}
