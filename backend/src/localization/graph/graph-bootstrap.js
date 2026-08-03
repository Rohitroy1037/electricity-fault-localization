// src/localization/graph/graph-bootstrap.js
/**
 * Graph Bootstrap
 *
 * Orchestrates the full graph loading pipeline:
 *   1. Load raw topology data from the database (GraphLoader).
 *   2. Validate the data (GraphValidator) – logs warnings only.
 *   3. Build lookup indexes (GraphIndexes).
 *   4. Assemble a GraphRepository and attach the indexes.
 *   5. Return the repository instance for caching.
 *
 * All steps emit structured Pino logs so that operators can track the
 * progress of the bootstrap during application start‑up.
 */
import { logger } from '../../config/logger.js';
import { GraphLoader } from './graph-loader.js';
import { GraphValidator } from './graph-validator.js';
import { GraphIndexes } from './graph-indexes.js';
import { GraphRepository } from './graph-repository.js';

/**
 * Bootstrap the in‑memory graph.
 * @returns {Promise<GraphRepository>} The repository containing the loaded topology.
 */
export async function bootstrapGraph() {
  logger.info({ event: 'graph_loading_started' }, 'Graph loading started');

  const loader = new GraphLoader();
  const rawData = await loader.loadAll();

  logger.info({ event: 'graph_loading_completed' }, 'Graph loading completed');

  // Validate – warnings only, continue even if validation fails.
  GraphValidator.validate(rawData, logger);
  logger.info({ event: 'graph_validation_completed' }, 'Graph validation completed');

  // Build indexes for fast look‑ups.
  const indexes = new GraphIndexes(rawData);
  logger.info({ event: 'graph_indexes_built' }, 'Graph indexes built');

  // Assemble repository and attach indexes.
  const repository = new GraphRepository(rawData);
  repository.setIndexes(indexes);

  logger.info({ event: 'topology_cache_populated' }, 'Topology cache populated');
  return repository;
}
