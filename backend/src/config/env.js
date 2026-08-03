/**
 * Environment Configuration
 *
 * Loads environment variables from .env and validates them using Zod.
 * The application fails fast on startup if required config is missing
 * or invalid — no silent failures from undefined env vars.
 *
 * Every module imports config from here. No module reads process.env directly.
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { z } from 'zod';

// ──────────────────────────────────────────────
// Load .env file relative to the backend root
// ──────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

// ──────────────────────────────────────────────
// Schema: defines every env var, its type, and default
// Adding a new env var? Add it here with validation rules.
// ──────────────────────────────────────────────
const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(3000),

  // PostgreSQL (connection string used by Prisma)
  DATABASE_URL: z
    .string()
    .url({ message: 'DATABASE_URL must be a valid PostgreSQL connection string' }),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Logging
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
});

// ──────────────────────────────────────────────
// Parse and validate — crash immediately if invalid
// ──────────────────────────────────────────────
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

/**
 * Validated, frozen environment configuration object.
 * Use this instead of process.env throughout the application.
 *
 * @type {z.infer<typeof envSchema>}
 */
export const env = Object.freeze(parsed.data);
