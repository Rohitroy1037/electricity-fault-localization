import EventEmitter from 'events';
import { logger } from '../config/logger.js';

/**
 * Internal Domain Event Bus
 * 
 * Extends Node's native EventEmitter to provide a centralized, decoupled
 * message bus for in-memory synchronous/asynchronous event dispatching.
 * 
 * This enables the "Fire and Forget" architectural pattern between decoupled domains
 * (e.g., Telemetry Ingestion -> Fault Localization).
 */
class EventBus extends EventEmitter {
  /**
   * Publishes a domain event to all registered internal listeners.
   * 
   * @param {string} eventName From DomainEvents registry
   * @param {Object} payload The event payload
   */
  publish(eventName, payload) {
    logger.debug({ event: eventName, ...payload }, `${eventName} event published`);
    this.emit(eventName, payload);
  }
}

// Export as a singleton
export const eventBus = new EventBus();
