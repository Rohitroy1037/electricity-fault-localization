/**
 * @file socket-namespaces.js
 * @description Logical namespace definitions for Socket.IO.
 * These namespaces are used to segment public events (dashboard, analytics, operator).
 * No functional code is added – the namespaces are created lazily in socket-server.js.
 */

export const Namespaces = Object.freeze({
  DASHBOARD: 'dashboard',
  ANALYTICS: 'analytics',
  OPERATOR: 'operator',
});
