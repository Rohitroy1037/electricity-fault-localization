/**
 * @file socket-internal-events.js
 * @description Internal lifecycle events used only by the socket infrastructure.
 * These events are NOT emitted to external clients; they are logged/metriced internally.
 */

export const InternalEvents = Object.freeze({
  CLIENT_CONNECTED: 'client_connected',
  CLIENT_DISCONNECTED: 'client_disconnected',
  ROOM_JOINED: 'room_joined',
  ROOM_LEFT: 'room_left',
});
