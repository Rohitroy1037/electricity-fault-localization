-- CreateEnum
CREATE TYPE "FaultType" AS ENUM ('SPAN_FAULT', 'TRANSFORMER_FAULT', 'FEEDER_FAULT');

-- CreateEnum
CREATE TYPE "TelemetryEvent" AS ENUM ('HEARTBEAT', 'POWER_LOST', 'POWER_RESTORED', 'BOOT');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('DETECTED', 'ACKNOWLEDGED', 'CREW_ASSIGNED', 'RESOLVED', 'VERIFIED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FaultStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_ALARM');

-- CreateEnum
CREATE TYPE "PoleStatus" AS ENUM ('ENERGIZED', 'DE_ENERGIZED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "OutageScope" AS ENUM ('FEEDER', 'TRANSFORMER', 'POLE_SPAN');

-- CreateTable
CREATE TABLE "substations" (
    "substation_id" VARCHAR(64) NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "capacity_mva" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "substations_pkey" PRIMARY KEY ("substation_id")
);

-- CreateTable
CREATE TABLE "feeders" (
    "feeder_id" VARCHAR(64) NOT NULL,
    "substation_id" VARCHAR(64) NOT NULL,
    "feeder_name" VARCHAR(128) NOT NULL,
    "voltage_kv" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feeders_pkey" PRIMARY KEY ("feeder_id")
);

-- CreateTable
CREATE TABLE "transformers" (
    "dt_id" VARCHAR(64) NOT NULL,
    "feeder_id" VARCHAR(64) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "capacity_kva" DOUBLE PRECISION,
    "households_served" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transformers_pkey" PRIMARY KEY ("dt_id")
);

-- CreateTable
CREATE TABLE "poles" (
    "pole_id" VARCHAR(64) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "feeder_id" VARCHAR(64) NOT NULL,
    "dt_id" VARCHAR(64) NOT NULL,
    "seq_on_line" INTEGER,
    "parent_pole_id" VARCHAR(64),
    "pole_type" VARCHAR(64) NOT NULL DEFAULT 'LT_DISTRIBUTION',
    "ward" VARCHAR(64) NOT NULL,
    "pincode" VARCHAR(16),
    "has_device" BOOLEAN NOT NULL DEFAULT false,
    "current_status" "PoleStatus" NOT NULL DEFAULT 'UNKNOWN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poles_pkey" PRIMARY KEY ("pole_id")
);

-- CreateTable
CREATE TABLE "devices" (
    "device_id" VARCHAR(64) NOT NULL,
    "pole_id" VARCHAR(64) NOT NULL,
    "firmware_version" VARCHAR(32),
    "battery_mv" INTEGER,
    "rssi" INTEGER,
    "last_seen" TIMESTAMP(3),
    "online_status" "DeviceStatus" NOT NULL DEFAULT 'UNKNOWN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "telemetries" (
    "id" BIGSERIAL NOT NULL,
    "device_id" VARCHAR(64) NOT NULL,
    "pole_id" VARCHAR(64) NOT NULL,
    "seq_no" INTEGER NOT NULL,
    "event" "TelemetryEvent" NOT NULL,
    "energized" BOOLEAN NOT NULL,
    "device_timestamp" TIMESTAMP(3) NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faults" (
    "id" UUID NOT NULL,
    "fault_type" "FaultType" NOT NULL,
    "status" "FaultStatus" NOT NULL DEFAULT 'OPEN',
    "feeder_id" VARCHAR(64) NOT NULL,
    "dt_id" VARCHAR(64),
    "from_pole_id" VARCHAR(64),
    "to_pole_id" VARCHAR(64),
    "pincode" VARCHAR(16),
    "estimated_lat" DOUBLE PRECISION,
    "estimated_lng" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "affected_poles" JSONB NOT NULL DEFAULT '[]',
    "root_cause" TEXT NOT NULL,
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" UUID NOT NULL,
    "ticket_no" VARCHAR(32) NOT NULL,
    "fault_id" UUID NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'DETECTED',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "assigned_crew" VARCHAR(128),
    "crew_notes" TEXT,
    "verification_notes" TEXT,
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledged_at" TIMESTAMP(3),
    "crew_assigned_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "verified_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_outages" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "reason" TEXT NOT NULL,
    "scope" "OutageScope" NOT NULL,
    "feeder_id" VARCHAR(64),
    "dt_id" VARCHAR(64),
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_outages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulator_scenarios" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "feeder_id" VARCHAR(64) NOT NULL,
    "fault_type" "FaultType" NOT NULL,
    "target_dt_id" VARCHAR(64),
    "target_pole_id" VARCHAR(64),
    "target_span_from" VARCHAR(64),
    "target_span_to" VARCHAR(64),
    "event_sequence" JSONB NOT NULL DEFAULT '[]',
    "is_running" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simulator_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "action" VARCHAR(128) NOT NULL,
    "entity_type" VARCHAR(64) NOT NULL,
    "entity_id" VARCHAR(64) NOT NULL,
    "user_id" VARCHAR(128),
    "ticket_id" UUID,
    "metadata" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_incident_summaries" (
    "id" UUID NOT NULL,
    "fault_id" UUID NOT NULL,
    "summary_text" TEXT NOT NULL,
    "affected_summary" TEXT,
    "recommended_action" TEXT,
    "model_used" VARCHAR(64),
    "prompt_tokens" INTEGER,
    "completion_tokens" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_incident_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_feeder_substation" ON "feeders"("substation_id");

-- CreateIndex
CREATE INDEX "idx_transformer_feeder" ON "transformers"("feeder_id");

-- CreateIndex
CREATE INDEX "idx_pole_feeder" ON "poles"("feeder_id");

-- CreateIndex
CREATE INDEX "idx_pole_dt" ON "poles"("dt_id");

-- CreateIndex
CREATE INDEX "idx_pole_parent" ON "poles"("parent_pole_id");

-- CreateIndex
CREATE INDEX "idx_pole_status" ON "poles"("current_status");

-- CreateIndex
CREATE INDEX "idx_pole_ward" ON "poles"("ward");

-- CreateIndex
CREATE UNIQUE INDEX "devices_pole_id_key" ON "devices"("pole_id");

-- CreateIndex
CREATE INDEX "idx_device_online_status" ON "devices"("online_status");

-- CreateIndex
CREATE INDEX "idx_device_last_seen" ON "devices"("last_seen");

-- CreateIndex
CREATE INDEX "idx_telemetry_device_time" ON "telemetries"("device_id", "device_timestamp" DESC);

-- CreateIndex
CREATE INDEX "idx_telemetry_pole_time" ON "telemetries"("pole_id", "device_timestamp" DESC);

-- CreateIndex
CREATE INDEX "idx_telemetry_time" ON "telemetries"("device_timestamp" DESC);

-- CreateIndex
CREATE INDEX "idx_telemetry_event" ON "telemetries"("event");

-- CreateIndex
CREATE UNIQUE INDEX "telemetries_device_id_seq_no_key" ON "telemetries"("device_id", "seq_no");

-- CreateIndex
CREATE INDEX "idx_fault_status" ON "faults"("status");

-- CreateIndex
CREATE INDEX "idx_fault_feeder_status" ON "faults"("feeder_id", "status");

-- CreateIndex
CREATE INDEX "idx_fault_dt" ON "faults"("dt_id");

-- CreateIndex
CREATE INDEX "idx_fault_pincode" ON "faults"("pincode");

-- CreateIndex
CREATE INDEX "idx_fault_detected_at" ON "faults"("detected_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticket_no_key" ON "tickets"("ticket_no");

-- CreateIndex
CREATE INDEX "idx_ticket_status" ON "tickets"("status");

-- CreateIndex
CREATE INDEX "idx_ticket_priority" ON "tickets"("priority");

-- CreateIndex
CREATE INDEX "idx_ticket_fault" ON "tickets"("fault_id");

-- CreateIndex
CREATE INDEX "idx_ticket_created_at" ON "tickets"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_outage_feeder" ON "scheduled_outages"("feeder_id");

-- CreateIndex
CREATE INDEX "idx_outage_dt" ON "scheduled_outages"("dt_id");

-- CreateIndex
CREATE INDEX "idx_outage_window" ON "scheduled_outages"("start_time", "end_time");

-- CreateIndex
CREATE INDEX "idx_audit_entity" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_audit_action" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "idx_audit_created_at" ON "audit_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_ai_summary_fault" ON "ai_incident_summaries"("fault_id");

-- AddForeignKey
ALTER TABLE "feeders" ADD CONSTRAINT "feeders_substation_id_fkey" FOREIGN KEY ("substation_id") REFERENCES "substations"("substation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transformers" ADD CONSTRAINT "transformers_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeders"("feeder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poles" ADD CONSTRAINT "poles_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeders"("feeder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poles" ADD CONSTRAINT "poles_dt_id_fkey" FOREIGN KEY ("dt_id") REFERENCES "transformers"("dt_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poles" ADD CONSTRAINT "poles_parent_pole_id_fkey" FOREIGN KEY ("parent_pole_id") REFERENCES "poles"("pole_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_pole_id_fkey" FOREIGN KEY ("pole_id") REFERENCES "poles"("pole_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetries" ADD CONSTRAINT "telemetries_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("device_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetries" ADD CONSTRAINT "telemetries_pole_id_fkey" FOREIGN KEY ("pole_id") REFERENCES "poles"("pole_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faults" ADD CONSTRAINT "faults_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeders"("feeder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faults" ADD CONSTRAINT "faults_dt_id_fkey" FOREIGN KEY ("dt_id") REFERENCES "transformers"("dt_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faults" ADD CONSTRAINT "faults_from_pole_id_fkey" FOREIGN KEY ("from_pole_id") REFERENCES "poles"("pole_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faults" ADD CONSTRAINT "faults_to_pole_id_fkey" FOREIGN KEY ("to_pole_id") REFERENCES "poles"("pole_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_fault_id_fkey" FOREIGN KEY ("fault_id") REFERENCES "faults"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_outages" ADD CONSTRAINT "scheduled_outages_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeders"("feeder_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulator_scenarios" ADD CONSTRAINT "simulator_scenarios_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeders"("feeder_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_incident_summaries" ADD CONSTRAINT "ai_incident_summaries_fault_id_fkey" FOREIGN KEY ("fault_id") REFERENCES "faults"("id") ON DELETE CASCADE ON UPDATE CASCADE;
