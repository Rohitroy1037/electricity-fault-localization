/**
 * Express Application Configuration
 *
 * Configures the Express instance with security headers, CORS policies,
 * response compression, request parsing, structured logging, and global error handling.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import { env } from './config/env.js';
import { requestLogger } from './middleware/request-logger.js';
import { notFoundHandler, errorHandler } from './middleware/error-handler.js';
import routes from './routes/index.js';

const app = express();

// ──────────────────────────────────────────────
// 1. Security Headers (Helmet)
// ──────────────────────────────────────────────
// Sets secure HTTP headers to protect against common web vulnerabilities (XSS, clickjacking, etc.)
app.use(helmet());

// ──────────────────────────────────────────────
// 2. Cross-Origin Resource Sharing (CORS)
// ──────────────────────────────────────────────
// Restricts API access to authorized frontend origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Support comma-separated origins or single origin
      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy does not allow access from origin: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    credentials: true,
  })
);

// ──────────────────────────────────────────────
// 3. Response Compression
// ──────────────────────────────────────────────
// Compresses response payloads (Gzip/Deflate) to minimize network payload size
app.use(compression());

// ──────────────────────────────────────────────
// 4. Request Body Parsing
// ──────────────────────────────────────────────
// Parse incoming JSON payloads with size guard to prevent payload-based DoS
app.use(express.json({ limit: '2mb' }));
// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ──────────────────────────────────────────────
// 5. Request Logging
// ──────────────────────────────────────────────
// Intercepts every incoming request to log method, URL, status code, and duration via Pino
app.use(requestLogger);

// ──────────────────────────────────────────────
// 6. Application Routes
// ──────────────────────────────────────────────
// Mount root router (includes /health and future endpoints)
app.use('/', routes);

// ──────────────────────────────────────────────
// 7. 404 & Global Error Handling
// ──────────────────────────────────────────────
// Catch unhandled routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

export { app };
