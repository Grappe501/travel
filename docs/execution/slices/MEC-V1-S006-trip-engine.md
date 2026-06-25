# MEC-V1-S006 — Trip Engine

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S006 — Trip Engine

Mission:
Complete trip lifecycle: start, active, end, history, detail, edit with mileage calculation and audit on financial edits.

Context:
- Prior: MEC-V1-S005 complete
- MRIDs: TRIP-MRID-000004, 000005, 000006
- DEC-002: one active trip per USER (V1)
- SM-TRIP · chains/TRIP-MRID-000004.md

Allowed paths:
apps/web/src/app/trips/**
apps/web/src/server/services/trip.service.ts
apps/web/src/app/api/trips/**
packages/shared/src/calculations/**

Rules:
- ending_odometer >= starting_odometer
- one active trip per user (V1)
- mileage rate snapshot on trip complete
- audit log on completed trip edits

Forbidden:
- Receipt attach (S007)
- Offline queue (V1.1)
- GPS auto-tracking

Deliverables:
1. /trips/start, active trip UI, /trips/[id]/end
2. /trips list + detail + edit
3. Mileage + reimbursement calculation
4. AuditLog writes on financial field changes
5. EVT trip_started / trip_ended (stub analytics ok)

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] User completes start → end flow
- [ ] History shows completed trips
- [ ] Edit recalculates mileage
- [ ] Invalid odometer rejected

Commit:
feat(trips): MEC-V1-S006 trip engine start end history

Step: STEP-038
BUILD-IDs: BUILD-005
MRID-IDs: MRID-000004, MRID-000005, MRID-000006
DRS-IDs: TRIP-MRID-000004, TRIP-SCREEN-002, TRIP-API-001
```
