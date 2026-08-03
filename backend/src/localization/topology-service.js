/**
 * Topology Service
 *
 * Provides higher‑level operations to query the network topology.
 * It currently delegates to GraphBuilder, but all methods are placeholders
 * awaiting the future localization implementation.
 */
import { GraphBuilder } from './graph-builder.js';

export class TopologyService {
  constructor() {
    this.graphBuilder = new GraphBuilder();
  }

  /**
   * Builds the network graph and returns it.
   * @returns {Promise<void>}
   */
  async getNetworkGraph() {
    // TODO: Build and return the graph structure.
    await this.graphBuilder.buildGraph();
  }
}
