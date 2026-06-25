# STEP-034 — MEC-V1-S002 Database Foundation

| Field | Value |
|-------|-------|
| **Step ID** | STEP-034 |
| **Phase** | A |
| **Slice** | MEC-V1-S002 |
| **Date** | 2026-06-24 |
| **Commit** | `ff83d90` |
| **Status** | complete |

## Objective

Prisma schema + initial migration for all V1 core entities; Prisma client singleton; shared Zod input schemas.

## Changes

- `prisma/schema.prisma` — 16 models (UserProfile, Business, BusinessMember, Vehicle, MileageRate, Trip, Receipt, Expense, Report, Subscription, UsageCounter, AuditLog, BusinessEvent, OCRResult, AISuggestion, FileAsset)
- `prisma/migrations/20260624180000_init/migration.sql`
- `apps/web/src/lib/db/prisma.ts`
- `packages/shared/src/schemas/` — business, vehicle, trip, receipt, mileage rate
- Root Prisma scripts + CI generate/validate

## Apply to Neon

```bash
# .env.local with DATABASE_URL from Neon
pnpm db:migrate:deploy
```

See [prisma/README.md](../../prisma/README.md).

## Verification

```bash
pnpm db:validate   # pass
pnpm db:generate   # pass
pnpm typecheck     # pass
pnpm build         # pass
```

## Next step

**STEP-035** — [MEC-V1-S003 Authentication](../execution/slices/MEC-V1-S003-auth.md)
