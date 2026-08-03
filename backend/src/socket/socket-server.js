/**
 * @file socket-server.js
 * @description Initializes Socket.IO on the provided HTTP server.
 * No business logic is added here – only infrastructure setup.
 * Includes placeholders for Redis adapter integration and internal lifecycle handling.
 */
import { Server } from 'socket.io';
import { socketAuth } from './socket-auth.js';
import { socketMiddlewares } from './socket-middlewares.js';
import { setIO } from './socket-emitter.js';
import { InternalEvents } from './socket-internal-events.js';
import { logger } from '../config/logger.js';
import { Namespaces } from './socket-namespaces.js';

/**
 * Initialize Socket.IO and attach it to the given HTTP server.
 *
 * @param {import('http').Server} httpServer – The already‑created HTTP server.
 */
export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    path: '/socket.io',
    // CORS settings can be tightened later as needed.
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  // ---------- Redis Adapter Integration (future) ----------
  // Example (commented out):
  // import { createAdapter } from '@socket.io/redis-adapter';
  // import { createClient } from 'redis';
  // const pubClient = createClient({ url: process.env.REDIS_URL });
  // const subClient = pubClient.duplicate();
  // await Promise.all([pubClient.connect(), subClient.connect()]);
  // io.adapter(createAdapter(pubClient, subClient));

  // Register authentication and generic middlewares.
  io.use(socketAuth);
  socketMiddlewares.forEach((mw) => io.use(mw));

  // Store the io instance for the business‑only emitter.
  setIO(io);

  // ---------- Internal lifecycle event handling ----------
  io.on('connection', (socket) => {
    logger.info({ socketId: socket.id, address: socket.handshake.address }, 'Client connected');
    // Emit internal event for logging/metrics – not broadcast to any namespace.
    logger.debug({ event: InternalEvents.CLIENT_CONNECTED, socketId: socket.id }, 'Internal lifecycle event');

    socket.on('disconnect', (reason) => {
      logger.info({ socketId: socket.id, reason }, 'Client disconnected');
      logger.debug({ event: InternalEvents.CLIENT_DISCONNECTED, socketId: socket.id, reason }, 'Internal lifecycle event');
    });

    // Placeholder for room join/leave logging – clients may emit custom events.
    socket.on('joinRoom', (room) => {
      logger.debug({ socketId: socket.id, room }, 'Room join requested');
      logger.debug({ event: InternalEvents.ROOM_JOINED, socketId: socket.id, room }, 'Internal lifecycle event');
      // Actual socket.io room joining is left to the caller (e.g., client SDK).
    });

    socket.on('leaveRoom', (room) => {
      logger.debug({ socketId: socket.id, room }, 'Room leave requested');
      logger.debug({ event: InternalEvents.ROOM_LEFT, socketId: socket.id, room }, 'Internal lifecycle event');
    });
  });

  // Create named namespaces (no further logic now).
  // These namespaces are available for future use; they share the same underlying server.
  // Example: const dashboardNs = io.of(`/${Namespaces.DASHBOARD}`);
  // For now we just ensure they exist.
  Object.values(Namespaces).forEach((ns) => {
    io.of(`/${ns}`);
  });

  logger.info('Socket.IO server initialized and attached to HTTP server');
};
