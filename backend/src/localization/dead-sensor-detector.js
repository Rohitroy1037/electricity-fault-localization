// src/localization/dead-sensor-detector.js
/**
 * Dead Sensor Detector (Phase 7.4)
 *
 * Detects physically impossible outage patterns where a pole reports OFF
 * but one or more downstream poles remain ON. Those cases are classified
 * as dead sensors rather than genuine power faults.
 *
 * The detector works entirely on the cached in‑memory graph (`GraphRepository`)
 * and never queries PostgreSQL.
 *
 * Input: an array of `SpanFaultCandidate` objects and the `GraphRepository`.
 * For each candidate it traverses the subtree beginning at `childPoleId`.
 * If any descendant pole is energized, the candidate is removed and a
 * `DeadSensor` object is created instead.
 */
import { logger } from '../config/logger.js';
import crypto from 'crypto'; // Node built‑in for UUID generation

/**
 * Model representing a detected dead sensor.
 * @typedef {Object} DeadSensor
 * @property {string}   sensorId          Unique identifier (UUID).
 * @property {string|number} poleId       ID of the pole that reported OFF.
 * @property {string|number} transformerId ID of the transformer the pole belongs to.
 * @property {string}   reason            Explanation for detection.
 * @property {?string|number} nearestLiveParent ID of the nearest upstream pole that is live, or null.
 * @property {Array<string|number>} liveDescendants List of descendant pole IDs that are ON.
 * @property {string}   status            Processing status (e.g., 'new').
 */

/**
 * Result structure returned by the detector.
 * @typedef {Object} DeadSensorResult
 * @property {Array<Object>} validSpanFaults   SpanFaultCandidate objects that remain valid.
 * @property {DeadSensor[]} deadSensors       Array of detected dead sensors.
 * @property {number}        removedFaultCount Number of SpanFaultCandidates that were removed.
 */

/** Helper: collect all descendant pole IDs from a starting pole.
 * Also returns the subset that are currently energized.
 * @param {Object} repository GraphRepository instance.
 * @param {string|number} startPoleId Pole ID to start traversal from.
 * @returns {{ all: Array<string|number>, live: Array<string|number> }}
 */
function collectDescendants(repository, startPoleId) {
  const all = [];
  const live = [];
  const stack = [startPoleId];
  const visited = new Set();

  while (stack.length) {
    const currentId = stack.pop();
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    all.push(currentId);

    const pole = repository.getById('pole', currentId);
    if (pole && pole.energized) {
      live.push(currentId);
    }

    const children = repository.getChildren(currentId) || [];
    for (const childId of children) {
      stack.push(childId);
    }
  }

  return { all, live };
}

/** Helper: walk upstream using the adjacency maps to find the nearest live parent.
 * Returns null if none is found or a cycle is detected.
 * @param {Object} repository GraphRepository instance.
 * @param {string|number} poleId Starting pole ID (the dead sensor pole).
 * @returns {?string|number}
 */
function findNearestLiveParent(repository, poleId) {
  let currentId = poleId;
  const visited = new Set();
  while (true) {
    const parentId = repository.getParent(currentId);
    if (!parentId) return null;
    if (visited.has(parentId)) return null; // safeguard against cycles
    visited.add(parentId);
    const parentPole = repository.getById('pole', parentId);
    if (parentPole && parentPole.energized) {
      return parentId;
    }
    currentId = parentId;
  }
}

/**
 * Detect dead sensors and filter out invalid SpanFaultCandidates.
 *
 * @param {Object} repository           GraphRepository (cached graph).
 * @param {Array<Object>} spanCandidates Array of SpanFaultCandidate objects.
 * @returns {DeadSensorResult} Result containing the filtered candidates and any dead sensors detected.
 */
export async function detectDeadSensors(repository, spanCandidates) {
  const startTime = Date.now();
  logger.info({ event: 'dead_sensor_detector_started' }, 'Dead sensor detection started');

  const validSpanFaults = [];
  const deadSensors = [];
  let removedFaultCount = 0;

  for (const candidate of spanCandidates) {
    const { childPoleId, transformerId } = candidate;
    // Gather descendants of the child pole.
    const { live: liveDescendants } = collectDescendants(repository, childPoleId);

    if (liveDescendants.length > 0) {
      // Dead sensor detected – create a DeadSensor record.
      const nearestLiveParent = findNearestLiveParent(repository, childPoleId);
      const deadSensor = {
        sensorId: crypto.randomUUID(),
        poleId: childPoleId,
        transformerId,
        reason: 'Downstream poles remain energized while this pole reports OFF',
        nearestLiveParent,
        liveDescendants,
        status: 'new'
      };
      deadSensors.push(deadSensor);
      removedFaultCount++;

      logger.info({
        event: 'dead_sensor_detected',
        sensorId: deadSensor.sensorId,
        poleId: deadSensor.poleId,
        transformerId: deadSensor.transformerId,
        liveDescendantsCount: liveDescendants.length
      }, 'Dead sensor detected');

      logger.info({
        event: 'span_candidate_removed',
        faultId: candidate.faultId,
        reason: 'Dead sensor detected'
      }, 'Span fault candidate removed due to dead sensor');
    } else {
      // No energized descendants – candidate remains valid.
      validSpanFaults.push(candidate);
    }
  }

  const elapsed = Date.now() - startTime;
  logger.info({
    event: 'dead_sensor_detector_completed',
    totalCandidates: spanCandidates.length,
    validCandidates: validSpanFaults.length,
    deadSensorsDetected: deadSensors.length,
    removedFaultCount,
    traversalTimeMs: elapsed
  }, 'Dead sensor detection completed');

  return {
    validSpanFaults,
    deadSensors,
    removedFaultCount
  };
}
