import { Router } from 'express';
import { TelemetryController } from '../controllers/telemetry.controller.js';

const router = Router();

/**
 * POST /api/v1/telemetry
 * Ingests telemetry payloads from IoT sensors.
 */
router.post('/', TelemetryController.ingest);

export default router;
