// src/localization/graph/graph-indexes.js
/**
 * GraphIndexes
 *
 * Builds fast lookup maps for topology entities.
 * The maps are simple `Map(id -> entity)` structures.
 * No traversal logic is performed here – only direct id look‑ups.
 */
export class GraphIndexes {
  /**
   * @param {Object} data - Loaded topology data.
   *   Expected shape: { substations, feeders, transformers, poles, devices }
   */
  constructor(data) {
    this.poleIdMap = new Map();
    this.deviceIdMap = new Map();
    this.transformerIdMap = new Map();
    this.feederIdMap = new Map();
    this.substationIdMap = new Map();
    this.build(data);
  }

  build(data) {
    data.substations?.forEach(s => this.substationIdMap.set(s.id, s));
    data.feeders?.forEach(f => this.feederIdMap.set(f.id, f));
    data.transformers?.forEach(t => this.transformerIdMap.set(t.id, t));
    data.poles?.forEach(p => this.poleIdMap.set(p.id, p));
    data.devices?.forEach(d => this.deviceIdMap.set(d.id, d));
  }
}
