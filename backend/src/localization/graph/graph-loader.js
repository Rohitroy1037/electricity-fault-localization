// src/localization/graph/graph-loader.js
/**
 * GraphLoader
 *
 * Loads topology entities from PostgreSQL. Placeholder implementation – returns
 * empty collections. Real DB queries will be added later.
 */
export class GraphLoader {
  constructor() {
    // TODO: inject DB client if needed.
  }

  /** Load all topology data */
  async loadAll() {
    return {
      substations: [],
      feeders: [],
      transformers: [],
      poles: [],
      devices: []
    };
  }
}
