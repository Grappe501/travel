# MEC-V1-S019 — AdminOS Minimum

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S019 — AdminOS Minimum

Mission:
BUILD-013 minimum — support staff can look up a customer by email, view read-only account summary, and check system health (MRID-000020).

Context:
- Prior: MEC-V1-S018 (STEP-050) complete
- BUILD-ID: BUILD-013 · WAVE-009
- MRID: ADM-MRID-000020 / MRID-000020
- SCR: SCR-053 (admin dashboard), SCR-054 (user detail), SCR-055 (system health)
- Baseline: /admin is empty shell

Allowed paths:
apps/web/src/app/admin/**
apps/web/src/components/admin/**
apps/web/src/server/services/admin.service.ts
apps/web/src/app/api/admin/**
apps/web/src/lib/auth/admin.ts (allowlist helper)

Rules:
- Admin access via ADMIN_EMAIL_ALLOWLIST env (comma-separated) or Supabase app_metadata role
- Read-only — no edit/delete user data from admin UI in V1
- Lookup by email (exact match); show profile, subscription, usage counters, recent trip/receipt counts
- All admin API routes verify admin role before query
- Audit log entry on admin lookup (action: admin.view_user)

Forbidden:
- Full AdminOS (Volume 17 full scope)
- Impersonation / login-as-user
- Bulk exports from admin
- Public /admin without auth

Deliverables:
1. admin.service.ts — lookupUserByEmail, getUserSummary
2. API: GET /api/admin/users?email=, GET /api/admin/health
3. /admin dashboard with search form
4. /admin/users/[id] read-only summary card
5. /admin/health system status (reuse /health data + DB ping)
6. Replace admin shell with DashboardShell + AdminManager

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [x] Non-admin user gets 403 on /admin and /api/admin/*
- [x] Admin can search by email and view subscription + usage
- [x] Admin lookup writes audit log entry
- [x] System health page shows config flags (no secrets)

Commit:
feat(admin): MEC-V1-S019 AdminOS minimum customer lookup

Step: STEP-051
BUILD-IDs: BUILD-013
MRID-IDs: MRID-000020
DRS-IDs: ADM-MRID-000020
```
