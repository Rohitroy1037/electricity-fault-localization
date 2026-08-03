/**
 * @file socket-envelope.js
 * @description Helper to wrap any payload in a standardized event envelope.
 * This envelope is used for all business events emitted to external clients.
 */
import { randomUUID } from 'node:crypto';

/**
 * Create a normalized envelope for a socket emission.
 *
 * @param {string} event   - Name of the event (must be a registered business event).
 * @param {any}    payload - Arbitrary data to be sent to the client.
 * @param {number} [version=1] - Semantic version of the event schema.
 * @returns {object} An envelope object ready for emission.
 */
export const createEnvelope = (event, payload, version = 1) => ({
  id: randomUUID(),
  event,
  eventVersion: version,
  timestamp: new Date().toISOString(),
  payload,
});
