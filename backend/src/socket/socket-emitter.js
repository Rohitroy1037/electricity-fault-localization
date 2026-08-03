/**
 * @file socket-emitter.js
 * @description Emits only BUSINESS events to external Socket.IO clients.
 * Internal lifecycle events are handled separately and never reach client namespaces.
 */
import { SocketEvents } from './socket-events.js';
import { createEnvelope } from './socket-envelope.js';
import { logger } from '../config/logger.js';
import { Namespaces } from './socket-namespaces.js';

let ioInstance = null;

/**
 * Called once by socket-server during initialization to store the underlying io object.
 */
export const setIO = (io) => {
  ioInstance = io;
};

/**
 * Validate that the event is a registered business event.
 */
const isBusinessEvent = (event) => Object.values(SocketEvents).includes(event);

/**
 * Emit a business event.
 *
 * @param {string} event   - Business event name (must be in SocketEvents).
 * @param {any}    payload - Payload object.
 * @param {object} [options] - Optional emission controls.
 * @param {string} [options.namespace] - One of Namespaces values; defaults to root.
 * @param {string} [options.room] - Optional Socket.IO room within the namespace.
 */
export const emitBusinessEvent = (event, payload, options = {}) => {
  if (!isBusinessEvent(event)) {
    throw new Error(`Attempted to emit non‑business event "${event}" via SocketEmitter`);
  }
  if (!ioInstance) {
    logger.warn('SocketEmitter called before io instance was set');
    return;
  }

  const envelope = createEnvelope(event, payload);
  const { namespace, room } = options;

  // Determine target emitter: root or a specific namespace.
  const target = namespace ? ioInstance.of(namespace) : ioInstance;

  try {
    if (room) {
      target.to(room).emit(event, envelope);
      logger.debug({ event, namespace, room }, 'Business event emitted to room');
    } else {
      target.emit(event, envelope);
      logger.debug({ event, namespace }, 'Business event emitted');
    }
  } catch (err) {
    logger.warn({ err, event, namespace, room }, 'Failed to emit business event');
  }
};
