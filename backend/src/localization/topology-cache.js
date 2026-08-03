// import { GraphBuilder } from './graph-builder.js';
import { bootstrapGraph } from './graph/graph-bootstrap.js';
import { logger } from '../config/logger.js';

/**
 * TopologyCache
 *
 * Holds in‑memory representations of the network topology.
 * Two graphs are kept:
 *  - knownGraph: the authoritative graph built from the DB.
 *  - estimatedGraph: a graph that may be derived from estimations (placeholder for now).
 *
 * The cache is a singleton exported as the default export. It is
 * initialized once on backend startup and can be refreshed on demand.
 */
class TopologyCache {
  constructor() {
    this._initialized = false;
    this._knownGraph = null;
    this._estimatedGraph = null;
    // No direct GraphBuilder; topology is bootstrapped via bootstrapGraph.
  }

  /**
   * Initialize the cache – called once during server boot.
   * Populates both known and estimated graphs (currently empty placeholders).
   */
  async initialize() {
    logger.info({ event: 'topology_cache_initializing' }, 'Topology cache initializing');
    // Bootstrap the full topology: load, validate, index, and store.
    const repository = await bootstrapGraph();
    // For now both known and estimated graphs point to the same repository.
    this._knownGraph = repository;
    this._estimatedGraph = repository;
    this._initialized = true;
    logger.info({ event: 'topology_cache_initialized' }, 'Topology cache initialized');
  }

  /**
   * Refresh the cache – can be triggered by an admin action or a periodic job.
   */
  async refresh() {
    logger.info({ event: 'topology_cache_refreshed' }, 'Topology cache refreshed');
    const repository = await bootstrapGraph();
    this._knownGraph = repository;
    this._estimatedGraph = repository;
  }

  /** Return the known topology graph. */
  getKnownGraph() {
    logger.info({ event: 'topology_cache_requested' }, 'Topology cache requested (knownGraph)');
    return this._knownGraph;
  }

  /** Return the estimated topology graph. */
  getEstimatedGraph() {
    logger.info({ event: 'topology_cache_requested' }, 'Topology cache requested (estimatedGraph)');
    return this._estimatedGraph;
  }

  /** Whether the cache has been initialized. */
  isInitialized() {
    return this._initialized;
  }
}

// Export a singleton instance for the whole application.
const topologyCache = new TopologyCache();
export default topologyCache;
