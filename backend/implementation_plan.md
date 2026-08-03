# Phase 9.2 – Socket Event Integration

**Goal**: Hook existing backend modules to emit business events via the new `SocketEmitter.emitBusinessEvent()` after successful completion of their primary operation. No business logic is changed; only post‑processing emission is added.

## Modified Files (overview)
| Module | File(s) to edit | Emitted event(s) | Target namespace |
|---|---|---|---|
| Telemetry Worker | `src/workers/telemetry.worker.js` | `telemetry_received` | `analytics` |
| Localization Engine | `src/localization/localization-engine.js` | `localization_completed` | `analytics` |
| Fault Detector | `src/localization/fault-detector.js` | `fault_detected` | `analytics` |
| Incident Grouping Engine | `src/localization/grouping-engine.js` | `incident_created`, `incident_updated` | `analytics` |
| Ticket Workflow Engine | `src/ticket/ticket-workflow-engine.js` | `ticket_created`, `ticket_updated`, `ticket_transition` | `operator` |
| Restoration Verification Engine | `src/restoration/restoration-verification-engine.js` (or similar) | `verification_started`, `verification_completed` | `operator` |
| Dashboard Service | `src/services/dashboard.service.js` | `dashboard_updated` | `dashboard` |

## General Integration Pattern
1. **Import** `emitBusinessEvent` from `src/socket/socket-emitter.js`.
2. After the primary asynchronous operation resolves successfully, build a **payload DTO** containing only the fields that are part of the public response (use existing response DTOs or create minimal ones).
3. Call:
   ```js
   emitBusinessEvent(eventName, payload, { namespace: Namespaces.<TARGET> });
   ```
   where `eventName` is from `SocketEvents` and `<TARGET>` is the appropriate namespace.
4. Wrap the call in a `try/catch` that logs any emission failures but does **not** affect the original operation’s success path.
5. **Never** emit internal lifecycle events; those remain handled inside the socket layer.
6. Add a **structured Pino log** before the emission:
   ```js
   logger.info({ event: eventName, payload }, 'Emitting socket event');
   ```

## Specific Integration Details
### 1. Telemetry Worker
- After `TelemetryService.processTelemetry(payload)` returns a successful result, construct a DTO (e.g., `{ deviceId: payload.device_id, seq: payload.seq, timestamp: payload.timestamp }`).
- Emit `SocketEvents.TELEMETRY_RECEIVED` in `Namespaces.ANALYTICS`.

### 2. Localization Engine
- At the end of `processTelemetry` (line 44), return the placeholder result. Use that result to emit `localization_completed` with payload `{ status: result.status, telemetryId: payload.id }`.
- Namespace: `analytics`.

### 3. Fault Detector
- Inside `detectFault` (currently placeholder), after the detection logic succeeds, emit `fault_detected` with a minimal payload (`{ payload, detected: true }`).
- Namespace: `analytics`.

### 4. Incident Grouping Engine (GroupingEngine)
- In `group(data)` (or a new method `process(data)`), after grouping is performed, emit:
  - `incident_created` when a new incident object is produced.
  - `incident_updated` when an existing incident is modified.
- Payloads should mirror the incident DTOs used by the Incident API (`IncidentResponseDTO`).
- Namespace: `analytics`.

### 5. Ticket Workflow Engine (`src/ticket/ticket-workflow-engine.js`)
- After each public method (`createTicket`, `updateTicket`, `transitionTicket`) resolves, emit the corresponding event via `emitBusinessEvent` with payload matching the `TicketResponseDTO`.
- Namespace: `operator`.

### 6. Restoration Verification Engine (`src/restoration/restoration-verification-engine.js`)
- Emit `verification_started` at the beginning of the verification process and `verification_completed` after successful completion, using a lightweight DTO (e.g., `{ verificationId, status }`).
- Namespace: `operator`.

### 7. Dashboard Service (`src/services/dashboard.service.js`)
- After the dashboard data is prepared for the client, emit `dashboard_updated` with the same DTO sent in the HTTP response.
- Namespace: `dashboard`.

## Logging & Error Handling
- Each emission is preceded by a structured Pino `info` log.
- Emission failures are caught and logged as `error` but **do not** re‑throw, preserving original flow.

## Testing & Verification
- Unit‑test each modified module to ensure the event is emitted **only** on successful execution.
- Mock `SocketEmitter.emitBusinessEvent` to verify correct arguments (event name, payload, namespace).
- Run existing test suite to confirm no regression.

## Open Questions
> [!IMPORTANT]
> - Do any of the modules already have DTO files we should reuse, or do we need to create minimal DTOs for the socket payloads?
> - For the Ticket Workflow Engine, does the engine already import response DTOs (`ticket-response.dto.js`)? If not, we should import them.
> - Should the emission be performed *after* the HTTP response is sent (e.g., in the controller) or directly inside the service/worker? The requirement states **after successful completion of each module**, so we emit inside the module.

## Next Steps (pending approval)
1. Apply the import and emission changes to each listed file.
2. Add required DTO imports where needed.
3. Add structured Pino logs.
4. Update unit tests (mock emitter).
5. Run the full test suite.

**User review is required** before proceeding with the code modifications.
