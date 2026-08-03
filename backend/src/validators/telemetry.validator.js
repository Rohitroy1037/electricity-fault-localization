import { z } from 'zod';

/**
 * Telemetry Payload Validator
 *
 * Enforces strict typing and presence of required fields exactly as specified
 * in the assignment requirements.
 */
export const telemetrySchema = z.object({
  device_id: z.string().min(1, 'device_id is required'),
  pole_id: z.string().min(1, 'pole_id is required'),
  event: z.enum(['heartbeat', 'power_lost', 'power_restored', 'boot']),
  energized: z.boolean(),
  ts: z.string().datetime({ message: 'ts must be a valid ISO8601 string' }),
  seq: z.number().int().nonnegative('seq must be a non-negative integer'),
  battery_mv: z.number().int().positive('battery_mv must be positive'),
  rssi: z.number().int(),
  fw: z.string().min(1, 'fw version is required'),
});
