// src/localization/missing-device-handler.js
/**
 * Missing Device Handler (Phase 7.5)
 *
 * Inspects SpanFaultCandidates for gaps where poles lack telemetry devices.
 * If any pole between the energized parent and the de‑energized child does
 * not have an associated device, the exact span cannot be trusted. Instead,
 * an **Estimated Fault Range** (`PossibleFaultRange`) is emitted.
 *
 * The detector works exclusively on the cached `GraphRepository` – no
 * PostgreSQL queries are performed. It is deliberately isolated from
 * feeder‑fault detection, confidence scoring, ticket creation, incident
 * grouping, and restoration logic.
 */
import { logger } from '../config/logger.js';
import crypto from 'crypto'; // Node's built‑in crypto for UUID generation

/**
 * Model for an estimated fault range when telemetry devices are missing.
 * @typedef {Object} PossibleFaultRange
 * @property {string}   rangeId               Unique identifier (UUID).
 * @property {string|number} transformerId   ID of the transformer.
 * @property {string|number} startPoleId     ID of the parent (LIVE) pole.
 * @property {string|number} endPoleId       ID of the child (DARK) pole.
 * @property {Array<string|number>} possibleMissingPoles  Pole IDs that lack devices.
 * @property {number}   minimumLatitude      Minimum latitude among poles in the range.
 * @property {number}   minimumLongitude     Minimum longitude among poles in the range.
 * @property {number}   maximumLatitude      Maximum latitude among poles in the range.
 * @property {number}   maximumLongitude     Maximum longitude among poles in the range.
 * @property {boolean}  estimated            Always true – this is an estimate.
 * @property {string}   reason               Explanation for the estimation.
 * @property {boolean}  knownTopology        Indicates if topology was known (true) or unknown (false).
 * @property {string}   certaintyLevel       One of 'HIGH', 'MEDIUM', 'LOW' indicating confidence.
 * @property {string}   reasonEnum           One of 'MISSING_DEVICE', 'UNKNOWN_TOPOLOGY', 'PARTIAL_TELEMETRY'.
 */

/**
 * Result object returned by the handler.
 * @typedef {Object} MissingDeviceResult
 * @property {Array<Object>} validSpanFaults   SpanFaultCandidates that remain valid.
 * @property {PossibleFaultRange[]} possibleFaultRanges  Estimated ranges for candidates with missing devices.
 */

/** Helper: retrieve a pole by ID from the repository. */
function getPole(repository, poleId) {
  return repository.getById('pole', poleId) || null;
}

/** Helper: find a path (list of pole IDs) from `startId` to `targetId`.
 * Uses DFS with a visited set to avoid cycles. Returns null if no path.
 */
function findPath(repository, startId, targetId) {
  const stack = [{ id: startId, path: [startId] }];
  const visited = new Set();
  while (stack.length) {
    const { id, path } = stack.pop();
    if (visited.has(id)) continue;
    visited.add(id);
    if (id === targetId) return path;
    const children = repository.getChildren(id) || [];
    for (const childId of children) {
      stack.push({ id: childId, path: [...path, childId] });
    }
  }
  return null; // no path found
}

/** Helper: compute latitude/longitude bounds for a list of pole objects. */
function computeLatLonBounds(poles) {
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;
  poles.forEach(p => {
    const lat = Number(p.lat);
    const lon = Number(p.lon);
    if (!isNaN(lat)) {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
    if (!isNaN(lon)) {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
    }
  });
  return { minLat, maxLat, minLon, maxLon };
}

/**
 * Detect missing‑device situations and produce either a valid SpanFaultCandidate
 * or an estimated `PossibleFaultRange`.
 *
 * @param {Object} repository           GraphRepository (cached graph).
 * @param {Array<Object>} spanCandidates Array of SpanFaultCandidate objects.
 * @returns {MissingDeviceResult} Result containing retained candidates and
 *                                 any estimated fault ranges.
 */
export async function handleMissingDevices(repository, spanCandidates) {
  const startTime = Date.now();
  logger.info({ event: 'missing_device_detector_started' }, 'Missing device detection started');

  const validSpanFaults = [];
  const possibleFaultRanges = [];

  for (const candidate of spanCandidates) {
    const { parentPoleId, childPoleId, transformerId } = candidate;
    // Handle unknown topology scenario where parentPoleId is missing/undefined.
    if (!parentPoleId) {
      // No known parent pole; create a transformer‑level estimated fault range.
      const allPoles = repository.getPolesByTransformer ? repository.getPolesByTransformer(transformerId) : [];
      const { minLat, maxLat, minLon, maxLon } = computeLatLonBounds(allPoles);
      const unknownRange = {
        rangeId: crypto.randomUUID(),
        transformerId,
        startPoleId: null,
        endPoleId: null,
        possibleMissingPoles: [],
        minimumLatitude: minLat === Infinity ? null : minLat,
        minimumLongitude: minLon === Infinity ? null : minLon,
        maximumLatitude: maxLat === -Infinity ? null : maxLat,
        maximumLongitude: maxLon === -Infinity ? null : maxLon,
        estimated: true,
        reason: 'Topology unknown – fallback estimated range',
        knownTopology: false,
        certaintyLevel: 'LOW',
        reasonEnum: 'UNKNOWN_TOPOLOGY'
      };
      possibleFaultRanges.push(unknownRange);
      logger.info({
        event: 'missing_device_fallback_range_created',
        transformerId,
        known_topology: false,
        unknown_topology: true,
        fallback_estimated_range: true
      }, 'Fallback estimated fault range created for unknown topology');
      continue;
    }
    // Find the path between parent and child inclusive.
    const pathIds = findPath(repository, parentPoleId, childPoleId);
    if (!pathIds) {
      // Unexpected – log and keep the candidate as‑is.
      logger.warn({
        event: 'missing_device_path_not_found',
        parentPoleId,
        childPoleId,
        transformerId,
        known_topology: true
      }, 'Unable to locate path between poles; candidate retained');
      validSpanFaults.push(candidate);
      continue;
    }

    // Retrieve pole objects and identify those missing a telemetry device.
    const polesInPath = pathIds.map(id => getPole(repository, id)).filter(p => p !== null);
    const missingPoles = polesInPath.filter(p => !p.deviceId && !p.device).map(p => p.id);

    if (missingPoles.length > 0) {
      // Build an estimated fault range.
      const { minLat, maxLat, minLon, maxLon } = computeLatLonBounds(polesInPath);
      // Determine reason enum and certainty level based on missing device distribution.
      const totalPoles = polesInPath.length;
      const missingCount = missingPoles.length;
      let reasonEnum = 'MISSING_DEVICE';
      let certaintyLevel = 'HIGH';
      if (missingCount > 0 && missingCount < totalPoles) {
        reasonEnum = 'PARTIAL_TELEMETRY';
        certaintyLevel = 'MEDIUM';
      }
      const range = {
        rangeId: crypto.randomUUID(),
        transformerId,
        startPoleId: parentPoleId,
        endPoleId: childPoleId,
        possibleMissingPoles: missingPoles,
        minimumLatitude: minLat === Infinity ? null : minLat,
        minimumLongitude: minLon === Infinity ? null : minLon,
        maximumLatitude: maxLat === -Infinity ? null : maxLat,
        maximumLongitude: maxLon === -Infinity ? null : maxLon,
        estimated: true,
        reason: 'Missing telemetry devices on poles within span',
        knownTopology: true,
        certaintyLevel,
        reasonEnum
      };
      possibleFaultRanges.push(range);
      logger.info({
        event: 'missing_device_range_created',
        rangeId: range.rangeId,
        transformerId,
        startPoleId: parentPoleId,
        endPoleId: childPoleId,
        missingPoleCount: missingPoles.length,
        known_topology: true,
        certaintyLevel,
        reasonEnum
      }, 'Estimated fault range created due to missing devices');
    } else {
      // No missing devices – candidate remains valid.
      validSpanFaults.push(candidate);
    }
  }

  const elapsed = Date.now() - startTime;
  logger.info({
    event: 'missing_device_detector_completed',
    totalCandidates: spanCandidates.length,
    validCandidates: validSpanFaults.length,
    estimatedRanges: possibleFaultRanges.length,
    traversalTimeMs: elapsed
  }, 'Missing device detection completed');

  return {
    validSpanFaults,
    possibleFaultRanges
  };
}
