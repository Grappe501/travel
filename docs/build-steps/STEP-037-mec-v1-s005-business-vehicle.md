# STEP-037 — MEC-V1-S005 Business & Vehicle Setup

| Field | Value |
|-------|-------|
| **Step ID** | STEP-037 |
| **Phase** | A |
| **Slice** | MEC-V1-S005 |
| **Date** | 2026-06-24 |
| **Commit** | `91d5412` |
| **Status** | complete |

## Objective

CRUD for businesses and vehicles with default selection, mileage rate settings, and per-user ownership checks.

## Changes

- `packages/shared/src/schemas/business-vehicle.ts` — update + mileage settings schemas
- `apps/web/src/server/services/business.service.ts` — list/create/update/delete with default business
- `apps/web/src/server/services/vehicle.service.ts` — list/create/update/delete with odometer + default vehicle
- `apps/web/src/server/services/mileage.service.ts` — profile mileage settings + rate history
- API routes: `/api/businesses`, `/api/vehicles`, `/api/settings/mileage`
- UI: business/vehicle managers, mileage settings form
- Pages: `/businesses`, `/vehicles`, `/settings/mileage`

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

Requires `DATABASE_URL` + migrated Neon DB for runtime CRUD.

## Traceability

- **BUILD-004** · **MRID-000002** · **MRID-000003**

## Next step

**STEP-038** — [MEC-V1-S006 Trip engine](../execution/slices/MEC-V1-S006-trip-engine.md)
