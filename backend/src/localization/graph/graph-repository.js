// src/localization/graph/graph-repository.js
import { logger } from '../../config/logger.js';
/**
 * GraphRepository
 *
 * Holds the loaded topology data and provides simple accessor methods.
 * The repository is intentionally lightweight – it stores the raw entity
 * arrays (substations, feeders, transformers, poles, devices) and a set of
 * indexes built by `GraphIndexes`. Indexes enable O(1) look‑ups by id.
 *
 * This class is used by the `TopologyCache` to expose the in‑memory graph to
 * other components of the backend.
 */
export class GraphRepository {
  /**
   * @param {Object} data - The raw topology payload returned from GraphLoader.
   *   Expected shape: { substations, feeders, transformers, poles, devices }.
   */
  constructor(data) {
    this.substations = data.substations ?? [];
    this.feeders = data.feeders ?? [];
    this.transformers = data.transformers ?? [];
    this.poles = data.poles ?? [];
    this.devices = data.devices ?? [];
    this._indexes = null; // will be set via setIndexes()
    // adjacency structures for poles
    this._poleChildrenMap = new Map(); // poleId -> [childPoleId]
    this._poleParentMap = new Map(); // poleId -> parentPoleId
  }

  /** Attach pre‑built indexes for fast id look‑ups and build pole adjacency. */
  setIndexes(indexes) {
    this._indexes = indexes;
    // Build pole adjacency after indexes are ready
    this._buildPoleAdjacency();
  }

  /** Build O(1) adjacency maps for poles (parent and children). */
  _buildPoleAdjacency() {
    // Initialize children arrays for all poles
    this.poles.forEach(p => {
      this._poleChildrenMap.set(p.id, []);
    });
    // Populate parent map and children arrays
    this.poles.forEach(p => {
      const parentId = p.parentPoleId ?? p.parentId ?? null;
      if (parentId && this._poleChildrenMap.has(parentId)) {
        this._poleParentMap.set(p.id, parentId);
        const children = this._poleChildrenMap.get(parentId);
        children.push(p.id);
      } else {
        this._poleParentMap.set(p.id, null);
      }
    });
    logger.info({ event: 'pole_adjacency_built', poleCount: this.poles.length }, 'Pole adjacency list built');
  }

  /** Retrieve an entity by its id using the appropriate index. */
  getById(entityType, id) {
    if (!this._indexes) return null;
    switch (entityType) {
      case 'substation':
        return this._indexes.substationIdMap.get(id) || null;
      case 'feeder':
        return this._indexes.feederIdMap.get(id) || null;
      case 'transformer':
        return this._indexes.transformerIdMap.get(id) || null;
      case 'pole':
        return this._indexes.poleIdMap.get(id) || null;
      case 'device':
        return this._indexes.deviceIdMap.get(id) || null;
      default:
        return null;
    }
  }

  /** Get children pole IDs for a given pole ID (O(1)). */
  getChildren(poleId) {
    return this._poleChildrenMap.get(poleId) || [];
  }

  /** Get parent pole ID for a given pole ID (O(1)). */
  getParent(poleId) {
    return this._poleParentMap.get(poleId) || null;
  }
}
