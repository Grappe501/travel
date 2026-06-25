# STEP-038 — MEC-V1-S006 Trip Engine

| Field | Value |
|-------|-------|
| **Step ID** | STEP-038 |
| **Phase** | A |
| **Slice** | MEC-V1-S006 |
| **Date** | 2026-06-24 |
| **Commit** | _(pending)_ |
| **Status** | complete |

## Objective

Full trip lifecycle: start, active, end, history, detail, edit — with mileage calculation, rate snapshot, odometer validation, and audit on financial edits.

## Changes

- `packages/shared/src/calculations/mileage.ts` — miles, reimbursement, odometer validation
- `packages/shared/src/schemas/trip.ts` — trip update schema
- `apps/web/src/server/services/trip.service.ts` — start/end/update, one active trip per user, audit + events
- API: `/api/trips`, `/api/trips/active`, `/api/trips/start`, `/api/trips/[id]`, `/api/trips/[id]/end`
- Pages: `/trips`, `/trips/start`, `/trips/[id]`, `/trips/[id]/end`, `/trips/[id]/edit`

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

## Traceability

- **BUILD-005** · **MRID-000004**, **MRID-000005**, **MRID-000006**

## Next step

**STEP-039** — [MEC-V1-S007 Receipt upload](../execution/slices/MEC-V1-S007-receipt-upload.md)
