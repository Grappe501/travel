# MEC-V1-S012 — Onboarding & Auth Polish

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S012 — Onboarding & Auth Polish

Mission:
Complete first-run onboarding and auth edge flows so new users can reach a configured workspace without dead-end shells — prerequisite for E2E-01 and Volume 9 launch gates.

Context:
- Prior: MEC-V1-S011 (STEP-043) complete
- MRIDs: AUTH-MRID-000001 (completion), supports MRID-000002–000003 onboarding
- FR: FR-001 (signup/profile), onboarding FRs in Volume 2/11
- SCR: SCR-005–008 (verify, forgot, reset), SCR-010–012 (business, vehicle, mileage rate setup)
- Baseline: login/signup work; no guided onboarding; password reset/verify are gaps

Allowed paths:
apps/web/src/app/login/**
apps/web/src/app/signup/**
apps/web/src/app/auth/**
apps/web/src/app/onboarding/**
apps/web/src/components/onboarding/**
apps/web/src/lib/auth/**
apps/web/src/server/services/auth.service.ts
apps/web/src/server/services/onboarding.service.ts (new)

Rules:
- After signup, redirect into onboarding until business + vehicle exist (or user skips with explicit choice)
- Reuse existing business/vehicle/mileage APIs — orchestrate, do not duplicate CRUD
- Password reset via Supabase Auth flows only
- Set onboardingCompleted on profile when flow finishes
- Mobile-first; max 4 onboarding panels before dashboard (Volume 2)

Forbidden:
- OAuth providers (Google/Apple) — V1.1
- Enterprise SSO
- Skipping auth on onboarding API calls
- New payment or billing logic

Deliverables:
1. /auth/forgot-password and /auth/reset-password pages (SCR-006, SCR-007)
2. /auth/verify-email holding page + resend (SCR-005)
3. /onboarding multi-step wizard: business → vehicle → mileage rate (SCR-010–012)
4. Post-login redirect: incomplete onboarding → /onboarding; complete → /dashboard
5. onboarding.service — check completeness, mark complete
6. Dashboard empty state links into onboarding when incomplete

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] New user completes onboarding and lands on dashboard with business + vehicle
- [ ] Forgot password email flow works (Supabase)
- [ ] Verify-email page shown for unverified users with resend option
- [ ] Returning user with completed onboarding skips wizard
- [ ] E2E-01 path is possible (manual or automated after STEP-047)

Commit:
feat(onboarding): MEC-V1-S012 auth polish and first-run setup

Step: STEP-044
BUILD-IDs: —
MRID-IDs: MRID-000001
DRS-IDs: AUTH-MRID-000001
```
