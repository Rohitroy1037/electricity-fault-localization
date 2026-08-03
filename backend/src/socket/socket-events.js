/**
 * @file socket-events.js
 * @description Business event registry for the Socket.IO layer.
 * These are the only events that external application clients may receive.
 */

export const SocketEvents = Object.freeze({
  TELEMETRY_RECEIVED: 'telemetry_received',
  LOCALIZATION_COMPLETED: 'localization_completed',
  FAULT_DETECTED: 'fault_detected',
  INCIDENT_CREATED: 'incident_created',
  INCIDENT_UPDATED: 'incident_updated',
  TICKET_CREATED: 'ticket_created',
  TICKET_UPDATED: 'ticket_updated',
  TICKET_TRANSITION: 'ticket_transition',
  VERIFICATION_STARTED: 'verification_started',
  VERIFICATION_COMPLETED: 'verification_completed',
  RESTORATION_DETECTED: 'restoration_detected',
  DASHBOARD_UPDATED: 'dashboard_updated',
});
