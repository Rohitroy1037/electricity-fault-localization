/**
 * Server Entrypoint
 *
 * Boots the HTTP server and handles graceful shutdown workflows.
 * Listens for OS termination signals (SIGINT, SIGTERM) and unhandled process exceptions.
 */

import { createServer } from 'http';
import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { initSocketServer } from './socket/index.js';

const server = createServer(app);
initSocketServer(server);

/**
 * Start Server
 */
const startServer = async () => {
  server.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        env: env.NODE_ENV,
      },
      `⚡ Electricity Fault Localization backend running on port ${env.PORT}`
    );
  });
};

/**
 * Graceful Shutdown Handler
 * Ensures existing requests are completed before shutting down connections.
 */
const gracefulShutdown = (signal) => {
  logger.info({ signal }, `Received ${signal}. Initiating graceful shutdown...`);

  server.close((err) => {
    if (err) {
      logger.error({ err }, 'Error during HTTP server shutdown');
      process.exit(1);
    }
    logger.info('HTTP server closed successfully');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcefully terminating process due to shutdown timeout');
    process.exit(1);
  }, 10000).unref();
};

// Process-level termination signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'Unhandled Promise Rejection detected');
  process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception detected');
  process.exit(1);
});

startServer();

export { server };
