# MEC-V1-S003 — Authentication

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S003 — Authentication

Mission:
Implement sign up, login, logout, session handling, protected dashboard, and UserProfile creation on first login.

Context:
- Prior: MEC-V1-S002 complete
- MRID: AUTH-MRID-000001
- DEC-001: Supabase Auth + @supabase/ssr
- SCR: AUTH-SCREEN-001 → SCR-003

Allowed paths:
apps/web/src/app/login/**
apps/web/src/app/signup/**
apps/web/src/app/dashboard/**
apps/web/src/lib/auth/**
apps/web/src/middleware.ts
apps/web/src/server/services/auth.service.ts

Routes:
/login, /signup, /dashboard (protected)

Forbidden:
- Trip/receipt features
- Stripe
- Skipping profile row creation in Prisma

Deliverables:
1. Supabase Auth wired with cookies (SSR)
2. Middleware protects /dashboard, /trips, /receipts, etc.
3. UserProfile upsert on auth
4. Logout works

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] User can register
- [ ] User can log in
- [ ] Dashboard requires auth
- [ ] Profile row exists in DB

Commit:
feat(auth): MEC-V1-S003 signup login protected dashboard

Step: STEP-035
BUILD-IDs: BUILD-002
MRID-IDs: MRID-000001
DRS-IDs: AUTH-MRID-000001, AUTH-SCREEN-001, AUTH-API-001
```
