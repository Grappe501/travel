# MEC-V1-S005 — Business & Vehicle Setup

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S005 — Business & Vehicle Setup

Mission:
Users can create/edit business, add/edit vehicle, and configure mileage rate.

Context:
- Prior: MEC-V1-S004 complete
- MRIDs: BUS-MRID-000002, VEH-MRID-000003
- FR-100, FR-200

Allowed paths:
apps/web/src/app/businesses/**
apps/web/src/app/vehicles/**
apps/web/src/app/settings/mileage/**
apps/web/src/server/services/business.service.ts
apps/web/src/server/services/vehicle.service.ts
apps/web/src/app/api/businesses/**
apps/web/src/app/api/vehicles/**

Forbidden:
- Trip engine
- Stripe limits (S010)
- Multi-tenant org features

Deliverables:
1. CRUD business (default business support)
2. CRUD vehicle (odometer field, default vehicle)
3. Mileage rate settings page
4. Ownership checks (user can only edit own records)

Validation:
pnpm lint && pnpm typecheck && pnpm build
pnpm test (if unit tests added)

Exit criteria:
- [ ] New user creates business
- [ ] New user adds vehicle with starting odometer
- [ ] Mileage rate stored
- [ ] Validation errors shown via design system

Commit:
feat(core): MEC-V1-S005 business vehicle mileage setup

Step: STEP-037
BUILD-IDs: BUILD-004
MRID-IDs: MRID-000002, MRID-000003
```
