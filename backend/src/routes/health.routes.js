/**
 * Health Routes
 *
 * Defines endpoints for service health probing (e.g. by load balancers, Docker, Kubernetes).
 */

import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

const router = Router();

// GET /health
router.get('/', getHealth);

export default router;
