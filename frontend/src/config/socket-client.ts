// src/config/socket-client.ts
// Placeholder Socket.IO client – lazily initialized on first use.

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

let socket: Socket | null = null;

/**
 * Get or create the Socket.IO client singleton.
 * Returns null if VITE_SOCKET_URL is not configured.
 */
export const getSocket = (): Socket | null => {
  if (!SOCKET_URL) {
    return null;
  }
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      // TODO: Add authentication token
    });
  }
  return socket;
};

export default getSocket;
