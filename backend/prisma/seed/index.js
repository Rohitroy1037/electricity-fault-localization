/**
 * Database Seed Script
 *
 * Generates deterministic synthetic data for the Electricity Distribution
 * Fault Localization System. Uses a seeded PRNG (mulberry32) so every run
 * produces identical output — safe for CI and reproducible debugging.
 *
 * Run: npx prisma db seed
 *
 * Dataset targets (configurable via SEED_CONFIG):
 *   4 Substations  |  31 Feeders  |  412 Transformers
 *   ~4,500 Poles    |  ~91% Device coverage  |  ~60% missing topology
 */

import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ─── Load environment variables ──────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ═════════════════════════════════════════════════════════════════════════════
// CONFIGURATION — Adjust these values for smaller dev datasets if needed
// ═════════════════════════════════════════════════════════════════════════════

const SEED_VALUE = 42;

const SEED_CONFIG = {
  substations: 4,
  feeders: 31,
  transformers: 412,
  polesPerDtMin: 8,
  polesPerDtMax: 14,
  deviceCoverage: 0.91,        // 91% of poles get an IoT device
  topologyMappedRate: 0.40,    // 40% of DTs have full topology (=> ~60% missing)
  oldFirmwareRate: 0.08,       // 8% of devices run legacy v1.2.x firmware
  center: { lat: 17.385, lng: 78.4867 }, // Hyderabad, India
};

// ═════════════════════════════════════════════════════════════════════════════
// DETERMINISTIC PRNG — Mulberry32
//
// JavaScript's Math.random() is not seedable. This implementation produces
// a uniform distribution in [0, 1) from a 32-bit integer seed, ensuring
// identical data on every run.
// ═════════════════════════════════════════════════════════════════════════════

function createRng(seed) {
  let s = seed | 0;

  function next() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    next,
    /** Random integer in [min, max] inclusive */
    int(min, max) {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    /** Random float in [min, max) */
    float(min, max) {
      return min + next() * (max - min);
    },
    /** Returns true with given probability (0-1) */
    bool(probability = 0.5) {
      return next() < probability;
    },
    /** Pick a random element from an array */
    pick(arr) {
      return arr[Math.floor(next() * arr.length)];
    },
    /** Fisher-Yates shuffle (returns new array) */
    shuffle(arr) {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// REFERENCE DATA — Wards, pincodes, firmware versions, pole types
// ═════════════════════════════════════════════════════════════════════════════

/** Hyderabad municipal wards */
const WARDS = [
  'Secunderabad', 'Begumpet', 'Jubilee Hills', 'Banjara Hills', 'Kukatpally',
  'Miyapur', 'Gachibowli', 'Madhapur', 'Kondapur', 'Tolichowki',
  'Mehdipatnam', 'Ameerpet', 'SR Nagar', 'Malkajgiri', 'Uppal',
  'Dilsukhnagar', 'LB Nagar', 'Santoshnagar', 'Hayathnagar', 'Charminar',
  'Nampally', 'Himayathnagar', 'Koti', 'Tarnaka', 'Amberpet',
  'Musheerabad', 'Khairatabad', 'Yousufguda', 'Erragadda', 'Balanagar',
  'Moosapet', 'Quthbullapur', 'Alwal', 'Kompally', 'Bowenpally',
  'Trimulgherry', 'Marredpally', 'Sainikpuri', 'Kapra', 'Nacharam',
];

/** Hyderabad postal codes */
const PINCODES = [
  '500001', '500003', '500004', '500008', '500016',
  '500018', '500020', '500025', '500028', '500030',
  '500032', '500033', '500034', '500038', '500044',
  '500045', '500049', '500050', '500060', '500070',
  '500072', '500073', '500074', '500076', '500081',
  '500082', '500084', '500085', '500089', '500090',
];

/** IoT device firmware version pools by generation */
const FIRMWARE = {
  old:     ['v1.2.0', 'v1.2.1', 'v1.2.3'],            // Legacy — 8%
  mid:     ['v1.3.0', 'v1.3.1', 'v1.3.2', 'v1.3.4'],  // Stable — 45%
  current: ['v1.4.0', 'v1.4.1', 'v1.4.2'],             // Latest — 47%
};

/** Physical pole construction types used in Indian distribution grids */
const POLE_TYPES = ['PCC', 'STEEL_TUBULAR', 'WOODEN', 'RSJ', 'LT_DISTRIBUTION'];

/** Fixed substation definitions — positioned around Hyderabad */
const SUBSTATION_DEFS = [
  { id: 'SUB-HYD-NORTH', name: '132/33kV Bowenpally Substation',     lat: 17.455, lng: 78.475, capacity_mva: 100 },
  { id: 'SUB-HYD-SOUTH', name: '132/33kV Rajendranagar Substation',  lat: 17.315, lng: 78.480, capacity_mva: 80  },
  { id: 'SUB-HYD-EAST',  name: '132/33kV Uppal Substation',          lat: 17.395, lng: 78.555, capacity_mva: 120 },
  { id: 'SUB-HYD-WEST',  name: '132/33kV Miyapur Substation',        lat: 17.395, lng: 78.420, capacity_mva: 90  },
];

/** How many feeders each substation serves (total = 31) */
const FEEDERS_PER_SUBSTATION = [8, 8, 8, 7];

/** Direction codes mapped to substation index */
const DIRECTION_CODES = ['N', 'S', 'E', 'W'];

// ═════════════════════════════════════════════════════════════════════════════
// DATA GENERATORS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Generate 4 substations from fixed definitions.
 * Substations are the highest-level topology node (33kV/132kV infeed).
 */
function generateSubstations() {
  return SUBSTATION_DEFS.map((def) => ({
    substation_id: def.id,
    name: def.name,
    latitude: def.lat,
    longitude: def.lng,
    capacity_mva: def.capacity_mva,
  }));
}

/**
 * Generate 31 feeders distributed across 4 substations.
 * Each feeder is a primary 11kV or 33kV line radiating from a substation.
 */
function generateFeeders(rng, substations) {
  const feeders = [];

  substations.forEach((sub, subIdx) => {
    const count = FEEDERS_PER_SUBSTATION[subIdx];
    const dir = DIRECTION_CODES[subIdx];

    for (let i = 1; i <= count; i++) {
      const nameParts = sub.name.split(' ');
      feeders.push({
        feeder_id: `FDR-${dir}-${String(i).padStart(2, '0')}`,
        substation_id: sub.substation_id,
        feeder_name: `${nameParts[1]} Feeder ${i}`,
        voltage_kv: rng.pick([11.0, 33.0]),
      });
    }
  });

  return feeders;
}

/**
 * Generate 412 distribution transformers spread across 31 feeders.
 * DTs are placed along each feeder's geographic corridor with realistic jitter.
 *
 * Geographic model:
 *   - Each feeder radiates outward from its substation at a random angle
 *   - DTs are placed at increasing distances along that angle
 *   - Random lateral jitter simulates real-world road/lane offsets (~300m)
 */
function generateTransformers(rng, feeders) {
  const transformers = [];
  const perFeeder = Math.floor(SEED_CONFIG.transformers / feeders.length); // 13
  const remainder = SEED_CONFIG.transformers % feeders.length;             // 9

  feeders.forEach((feeder, fdrIdx) => {
    const sub = SUBSTATION_DEFS.find((s) => s.id === feeder.substation_id);
    const count = perFeeder + (fdrIdx < remainder ? 1 : 0);

    // Each feeder gets a unique outward angle from its substation
    const feederAngle = rng.float(0, 2 * Math.PI);

    for (let i = 1; i <= count; i++) {
      // Progressive distance from substation (2-4 km total spread)
      const fraction = i / count;
      const distance = fraction * rng.float(0.02, 0.04); // ~2-4 km in degrees
      const jitter = rng.float(-0.003, 0.003);            // ~300m lateral offset

      const lat = sub.lat + distance * Math.cos(feederAngle) + jitter;
      const lng = sub.lng + distance * Math.sin(feederAngle) + jitter;

      transformers.push({
        dt_id: `DT-${feeder.feeder_id.replace('FDR-', '')}-${String(i).padStart(3, '0')}`,
        feeder_id: feeder.feeder_id,
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
        capacity_kva: rng.pick([25, 63, 100, 160, 200, 250, 315, 500]),
        households_served: rng.int(20, 300),
      });
    }
  });

  return transformers;
}

/**
 * Generate poles in realistic radial tree structures under each DT.
 *
 * Tree structure per DT:
 *   DT location
 *     └── Root pole (at DT)
 *           ├── Branch 1:  pole → pole → pole
 *           ├── Branch 2:  pole → pole → pole → pole
 *           └── Branch 3:  pole → pole
 *
 * Topology mapping:
 *   ~40% of DTs are "surveyed" — their poles have parent_pole_id & seq_on_line.
 *   ~60% of DTs are "unsurveyed" — poles exist with GPS but no topology links.
 *
 * This produces two distinct classes of data that the localization engine
 * must handle differently (graph traversal vs. geographic clustering).
 *
 * Returns:
 *   - poles: Array of pole records (parent_pole_id initially null)
 *   - topologyUpdates: Array of { pole_id, parent_pole_id, seq_on_line }
 *     to be applied in a second pass (avoids FK ordering issues with createMany)
 *   - topologyMappedDtIds: Set of dt_ids that have full topology
 */
function generatePolesAndTopology(rng, transformers) {
  const poles = [];
  const topologyUpdates = [];
  const topologyMappedDtIds = new Set();

  // Decide which DTs have mapped topology
  transformers.forEach((dt) => {
    if (rng.bool(SEED_CONFIG.topologyMappedRate)) {
      topologyMappedDtIds.add(dt.dt_id);
    }
  });

  transformers.forEach((dt) => {
    const hasTopology = topologyMappedDtIds.has(dt.dt_id);
    const ward = rng.pick(WARDS);
    const pincode = rng.bool(0.85) ? rng.pick(PINCODES) : null;
    const numPoles = rng.int(SEED_CONFIG.polesPerDtMin, SEED_CONFIG.polesPerDtMax);

    // ── Build tree nodes (local indices) ──────────────────────
    const nodes = [];

    // Root pole: positioned at/near the DT
    nodes.push({
      parentIdx: null,
      lat: dt.latitude + rng.float(-0.0002, 0.0002),
      lng: dt.longitude + rng.float(-0.0002, 0.0002),
    });

    // Branch out from root
    const numBranches = rng.int(2, Math.min(4, numPoles - 1));
    const angleStep = (2 * Math.PI) / numBranches;
    let nodeIdx = 1;

    for (let b = 0; b < numBranches && nodeIdx < numPoles; b++) {
      const baseAngle = angleStep * b + rng.float(-0.4, 0.4);
      let parentIdx = 0; // Branch starts from root

      // Calculate poles for this branch
      const remainingPoles = numPoles - nodeIdx;
      const remainingBranches = numBranches - b;
      const branchLen = Math.max(
        1,
        Math.min(
          rng.int(2, 5),
          b === numBranches - 1 ? remainingPoles : Math.ceil(remainingPoles / remainingBranches)
        )
      );

      for (let p = 0; p < branchLen && nodeIdx < numPoles; p++) {
        const dist = rng.float(0.0004, 0.0015); // ~40-150m between poles
        const angle = baseAngle + rng.float(-0.15, 0.15);
        const parent = nodes[parentIdx];

        nodes.push({
          parentIdx,
          lat: parent.lat + dist * Math.cos(angle),
          lng: parent.lng + dist * Math.sin(angle),
        });

        parentIdx = nodeIdx;
        nodeIdx++;
      }
    }

    // ── Convert tree nodes to Pole records ────────────────────
    const dtCode = dt.dt_id.replace('DT-', '');
    const poleIds = nodes.map((_, idx) => `P-${dtCode}-${String(idx + 1).padStart(3, '0')}`);

    nodes.forEach((node, idx) => {
      poles.push({
        pole_id: poleIds[idx],
        latitude: parseFloat(node.lat.toFixed(6)),
        longitude: parseFloat(node.lng.toFixed(6)),
        feeder_id: dt.feeder_id,
        dt_id: dt.dt_id,
        seq_on_line: hasTopology ? idx : null,
        parent_pole_id: null, // Set to null initially; updated in pass 2
        pole_type: rng.pick(POLE_TYPES),
        ward,
        pincode,
        has_device: false, // Will be set during device generation
        current_status: 'ENERGIZED',
      });

      // Queue topology update for non-root poles in mapped DTs
      if (hasTopology && node.parentIdx !== null) {
        topologyUpdates.push({
          pole_id: poleIds[idx],
          parent_pole_id: poleIds[node.parentIdx],
          seq_on_line: idx,
        });
      }
    });
  });

  return { poles, topologyUpdates, topologyMappedDtIds };
}

/**
 * Generate IoT devices for ~91% of all poles.
 *
 * Firmware distribution:
 *   ~8%  legacy v1.2.x  (known stability issues, candidate for OTA update)
 *   ~45% stable v1.3.x  (current production baseline)
 *   ~47% latest v1.4.x  (newest features, being rolled out)
 *
 * Battery and RSSI values are randomized within realistic hardware ranges:
 *   Battery: 3200-4200 mV (3.2V depleted → 4.2V fully charged LiPo)
 *   RSSI:    -95 to -45 dBm (weak cellular to strong signal)
 */
function generateDevices(rng, poles) {
  const devices = [];
  const poleIdsWithDevice = new Set();
  const now = new Date();

  poles.forEach((pole) => {
    if (!rng.bool(SEED_CONFIG.deviceCoverage)) return;

    poleIdsWithDevice.add(pole.pole_id);

    // Select firmware version by generation probability
    let firmwareVersion;
    const roll = rng.next();
    if (roll < SEED_CONFIG.oldFirmwareRate) {
      firmwareVersion = rng.pick(FIRMWARE.old);
    } else if (roll < SEED_CONFIG.oldFirmwareRate + 0.45) {
      firmwareVersion = rng.pick(FIRMWARE.mid);
    } else {
      firmwareVersion = rng.pick(FIRMWARE.current);
    }

    // last_seen: 0 to 300 seconds ago (most devices recently active)
    const lastSeenOffset = rng.int(0, 300) * 1000;

    devices.push({
      device_id: `DEV-${pole.pole_id.replace('P-', '')}`,
      pole_id: pole.pole_id,
      firmware_version: firmwareVersion,
      battery_mv: rng.int(3200, 4200),
      rssi: rng.int(-95, -45),
      last_seen: new Date(now.getTime() - lastSeenOffset),
      online_status: rng.bool(0.95) ? 'ONLINE' : 'OFFLINE',
    });
  });

  return { devices, poleIdsWithDevice };
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN SEED ORCHESTRATOR
// ═════════════════════════════════════════════════════════════════════════════

async function main() {
  const rng = createRng(SEED_VALUE);
  const startTime = Date.now();

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🌱  Electricity Fault Localization — Database Seed');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Seed value:       ${SEED_VALUE}`);
  console.log(`  Target:           ${SEED_CONFIG.substations} substations, ${SEED_CONFIG.feeders} feeders, ${SEED_CONFIG.transformers} DTs`);
  console.log(`  Device coverage:  ${(SEED_CONFIG.deviceCoverage * 100).toFixed(0)}%`);
  console.log(`  Topology mapped:  ${(SEED_CONFIG.topologyMappedRate * 100).toFixed(0)}%`);
  console.log('');

  try {
    // ─── 1. CLEAR EXISTING DATA (reverse FK order) ───────────────────────
    console.log('🧹  Clearing existing data...');
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.aiIncidentSummary.deleteMany(),
      prisma.auditLog.deleteMany(),
      prisma.ticket.deleteMany(),
      prisma.fault.deleteMany(),
      prisma.scheduledOutage.deleteMany(),
      prisma.simulatorScenario.deleteMany(),
      prisma.telemetry.deleteMany(),
      prisma.device.deleteMany(),
      prisma.pole.deleteMany(),
      prisma.transformer.deleteMany(),
      prisma.feeder.deleteMany(),
      prisma.substation.deleteMany(),
    ], { timeout: 60000 });

    // ─── 2. GENERATE ALL DATA IN MEMORY ──────────────────────────────────
    console.log('📦  Generating substations...');
    const substations = generateSubstations();

    console.log('📦  Generating feeders...');
    const feeders = generateFeeders(rng, substations);

    console.log('📦  Generating transformers...');
    const transformers = generateTransformers(rng, feeders);

    console.log('📦  Generating poles (radial trees)...');
    const { poles, topologyUpdates, topologyMappedDtIds } = generatePolesAndTopology(rng, transformers);

    console.log('📦  Generating devices...');
    const { devices, poleIdsWithDevice } = generateDevices(rng, poles);

    // Mark poles that received devices
    poles.forEach((pole) => {
      pole.has_device = poleIdsWithDevice.has(pole.pole_id);
    });

    // ─── 3. INSERT DATA (FK-safe order) ──────────────────────────────────
    console.log('');
    console.log('💾  Inserting substations...');
    await prisma.substation.createMany({ data: substations });

    console.log('💾  Inserting feeders...');
    await prisma.feeder.createMany({ data: feeders });

    console.log('💾  Inserting transformers...');
    await prisma.transformer.createMany({ data: transformers });

    console.log('💾  Inserting poles (pass 1: all poles without parent links)...');
    // Insert in chunks to avoid parameter limit on large datasets
    const POLE_CHUNK = 500;
    for (let i = 0; i < poles.length; i += POLE_CHUNK) {
      await prisma.pole.createMany({ data: poles.slice(i, i + POLE_CHUNK) });
    }

    console.log(`💾  Updating topology (pass 2: ${topologyUpdates.length} parent links)...`);
    // Batch topology updates in transactional chunks of 200
    const TOPO_CHUNK = 200;
    for (let i = 0; i < topologyUpdates.length; i += TOPO_CHUNK) {
      const chunk = topologyUpdates.slice(i, i + TOPO_CHUNK);
      await prisma.$transaction(
        chunk.map((update) =>
          prisma.pole.update({
            where: { pole_id: update.pole_id },
            data: {
              parent_pole_id: update.parent_pole_id,
              seq_on_line: update.seq_on_line,
            },
          })
        ),
        { timeout: 60000 }
      );
    }

    console.log('💾  Inserting devices...');
    const DEVICE_CHUNK = 500;
    for (let i = 0; i < devices.length; i += DEVICE_CHUNK) {
      await prisma.device.createMany({ data: devices.slice(i, i + DEVICE_CHUNK) });
    }

    console.log('💾  Inserting demo users...');
    await prisma.user.createMany({
      data: [
        {
          email: 'operator@propel.grid',
          name: 'Grid Operator',
          role: 'OPERATOR',
          password: 'Password123',
        },
        {
          email: 'admin@propel.grid',
          name: 'System Administrator',
          role: 'ADMIN',
          password: 'Password123',
        },
        {
          email: 'engineer@propel.grid',
          name: 'Field Engineer',
          role: 'ENGINEER',
          password: 'Password123',
        },
      ],
    });

    // ─── 4. COMPUTE AND DISPLAY STATISTICS ───────────────────────────────
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    const topologyMappedDtCount = topologyMappedDtIds.size;
    const topologyMissingDtCount = transformers.length - topologyMappedDtCount;
    // Poles with parent = topology updates count (non-root poles in mapped DTs)
    // Poles without parent = all poles minus those with parent links
    const polesWithParent = topologyUpdates.length;
    const polesWithoutParent = poles.length - polesWithParent;

    // Firmware distribution
    const fwCounts = {};
    devices.forEach((d) => {
      fwCounts[d.firmware_version] = (fwCounts[d.firmware_version] || 0) + 1;
    });
    const oldFwTotal = devices.filter((d) => d.firmware_version.startsWith('v1.2')).length;
    const midFwTotal = devices.filter((d) => d.firmware_version.startsWith('v1.3')).length;
    const curFwTotal = devices.filter((d) => d.firmware_version.startsWith('v1.4')).length;

    // Online/Offline distribution
    const onlineCount = devices.filter((d) => d.online_status === 'ONLINE').length;
    const offlineCount = devices.length - onlineCount;

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  ✅  SEED COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('  Grid Topology');
    console.log('  ─────────────────────────────────────────────────────');
    console.log(`    Substations:          ${substations.length}`);
    console.log(`    Feeders:              ${feeders.length}`);
    console.log(`    Transformers:         ${transformers.length}`);
    console.log(`    Poles:                ${poles.length}`);
    console.log('');
    console.log('  Topology Coverage');
    console.log('  ─────────────────────────────────────────────────────');
    console.log(`    DTs with topology:    ${topologyMappedDtCount} (${((topologyMappedDtCount / transformers.length) * 100).toFixed(1)}%)`);
    console.log(`    DTs without topology: ${topologyMissingDtCount} (${((topologyMissingDtCount / transformers.length) * 100).toFixed(1)}%)`);
    console.log(`    Poles with parent:    ${polesWithParent} (${((polesWithParent / poles.length) * 100).toFixed(1)}%)`);
    console.log(`    Poles without parent: ${polesWithoutParent} (${((polesWithoutParent / poles.length) * 100).toFixed(1)}%)`);
    console.log('');
    console.log('  Device Fleet');
    console.log('  ─────────────────────────────────────────────────────');
    console.log(`    Total devices:        ${devices.length} (${((devices.length / poles.length) * 100).toFixed(1)}% coverage)`);
    console.log(`    Online:               ${onlineCount} (${((onlineCount / devices.length) * 100).toFixed(1)}%)`);
    console.log(`    Offline:              ${offlineCount} (${((offlineCount / devices.length) * 100).toFixed(1)}%)`);
    console.log('');
    console.log('  Firmware Distribution');
    console.log('  ─────────────────────────────────────────────────────');
    console.log(`    v1.2.x (legacy):      ${oldFwTotal} (${((oldFwTotal / devices.length) * 100).toFixed(1)}%)`);
    console.log(`    v1.3.x (stable):      ${midFwTotal} (${((midFwTotal / devices.length) * 100).toFixed(1)}%)`);
    console.log(`    v1.4.x (latest):      ${curFwTotal} (${((curFwTotal / devices.length) * 100).toFixed(1)}%)`);
    console.log('');
    console.log('  Per-version breakdown:');
    Object.entries(fwCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([ver, count]) => {
        console.log(`    ${ver.padEnd(8)} ${String(count).padStart(5)}  (${((count / devices.length) * 100).toFixed(1)}%)`);
      });
    console.log('');
    console.log(`  Completed in ${elapsed}s`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

  } catch (error) {
    console.error('❌  Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
