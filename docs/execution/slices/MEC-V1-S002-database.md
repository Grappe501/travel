# MEC-V1-S002 — Database Foundation

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S002 — Database Foundation

Mission:
Create Prisma schema and initial migration for all V1 core entities on Neon Postgres.

Context:
- Prior: MEC-V1-S001 complete
- DEC-001: Prisma + Neon
- Volume 4 entities · docs/mei/TBL-INDEX.md

Allowed paths:
prisma/**
apps/web/src/lib/db/**
packages/shared/src/schemas/**
apps/web/package.json (prisma deps)

Models (minimum):
UserProfile, Business, BusinessMember, Vehicle, MileageRate,
Trip, Receipt, Expense, Report, Subscription, UsageCounter,
AuditLog, BusinessEvent, AISuggestion, OCRResult, FileAsset

Forbidden:
- Auth UI
- Business logic services
- Stripe, OpenAI
- Seeding production data

Deliverables:
1. prisma/schema.prisma — all models + relations + @@map snake_case
2. Initial migration
3. apps/web/src/lib/db/prisma.ts singleton
4. packages/shared Zod schemas for core inputs

Validation:
pnpm prisma validate
pnpm prisma generate
pnpm typecheck
pnpm build

Exit criteria:
- [ ] Schema validates
- [ ] Migration applies to Neon (or documents prisma migrate dev)
- [ ] generate succeeds
- [ ] No app route breakage

Commit:
feat(db): MEC-V1-S002 Prisma schema and initial migration

Step: STEP-034
BUILD-IDs: BUILD-001
Slice: MEC-V1-S002
DRS-IDs: TRIP-DB-001, REC-DB-001, AUTH-DB-001
```
