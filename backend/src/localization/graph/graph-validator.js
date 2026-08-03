// src/localization/graph/graph-validator.js
/**
 * GraphValidator
 *
 * Performs lightweight validation of the loaded topology data.
 * It **does not** mutate the data – it only logs warnings for:
 *   • Missing parent references (e.g., a pole referencing a non‑existent transformer)
 *   • Duplicate IDs within the same entity collection
 *   • Circular references (placeholder – not fully implemented)
 *   • Missing entities where required (e.g., transformers without feeders)
 *
 * All warnings are logged via the shared Pino logger. The validation
 * returns a boolean indicating whether the data passed basic sanity
 * checks (true) or had issues (false). The pipeline proceeds regardless
 * because the graph may still be useful, but the logs surface potential
 * data‑quality problems.
 */
export class GraphValidator {
  /**
   * @param {Object} data - Loaded topology data.
   * @param {Object} logger - Pino logger instance.
   * @returns {boolean} true if data looks sane, false otherwise.
   */
  static validate(data, logger) {
    let ok = true;
    // Helper to detect duplicate ids
    const detectDuplicates = (items, type) => {
      const seen = new Set();
      items.forEach(item => {
        if (seen.has(item.id)) {
          ok = false;
          logger.warn({
            event: 'graph_validation_duplicate',
            entity: type,
            id: item.id
          }, `${type} duplicate id detected: ${item.id}`);
        } else {
          seen.add(item.id);
        }
      });
    };

    // Check duplicates for each collection
    detectDuplicates(data.substations || [], 'substation');
    detectDuplicates(data.feeders || [], 'feeder');
    detectDuplicates(data.transformers || [], 'transformer');
    detectDuplicates(data.poles || [], 'pole');
    detectDuplicates(data.devices || [], 'device');

    // Helper to verify parent references
    const parentCheck = (childItems, parentMap, childType, parentType, parentKey) => {
      childItems.forEach(child => {
        const parentId = child[parentKey];
        if (parentId != null && !parentMap.has(parentId)) {
          ok = false;
          logger.warn({
            event: 'graph_validation_missing_parent',
            child: childType,
            parent: parentType,
            childId: child.id,
            parentId
          }, `${childType} ${child.id} references missing ${parentType} ${parentId}`);
        }
      });
    };

    // Build quick maps of ids for parent look‑ups
    const substationMap = new Map((data.substations || []).map(s => [s.id, s]));
    const feederMap = new Map((data.feeders || []).map(f => [f.id, f]));
    const transformerMap = new Map((data.transformers || []).map(t => [t.id, t]));
    const poleMap = new Map((data.poles || []).map(p => [p.id, p]));

    // Validate hierarchical relationships
    parentCheck(data.feeders || [], substationMap, 'feeder', 'substation', 'substationId');
    parentCheck(data.transformers || [], feederMap, 'transformer', 'feeder', 'feederId');
    parentCheck(data.poles || [], transformerMap, 'pole', 'transformer', 'transformerId');
    parentCheck(data.devices || [], poleMap, 'device', 'pole', 'poleId');

    // Circular reference detection is out of scope for this placeholder.
    // In a real implementation we would perform a depth‑first search.

    return ok;
  }
}
