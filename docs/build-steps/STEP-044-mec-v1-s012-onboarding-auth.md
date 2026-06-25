# STEP-044 — MEC-V1-S012 Onboarding & Auth Polish

| Field | Value |
|-------|-------|
| **Step ID** | STEP-044 |
| **Phase** | A |
| **Slice** | MEC-V1-S012 |
| **Date** | 2026-06-25 |
| **Commit** | `8b3e788` |
| **Status** | complete |

## Objective

Guided first-run onboarding and auth edge flows (password reset, email verify) so new users reach a configured workspace — prerequisite for E2E-01.

## Changes

- `packages/shared/src/schemas/auth.ts` — forgot/reset password schemas
- `apps/web/src/server/services/onboarding.service.ts` — status, complete, skip
- `apps/web/src/lib/auth/guards.ts` — post-auth redirect, onboarding guards
- Auth pages: `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`
- `/auth/continue` — smart redirect after login
- `/onboarding` — 3-step wizard (business → vehicle → mileage rate)
- API: `GET /api/onboarding/status`, `POST /api/onboarding/complete`, `POST /api/onboarding/skip`
- Login/signup/callback — redirect to verify, onboarding, or dashboard
- Dashboard — setup prompt when business/vehicle missing after skip
- Middleware — onboarding route + auth flow handling
- Health: `/health` → `MEC-V1-S012` / `STEP-044`

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

Manual acceptance:

1. New user completes onboarding → dashboard with business + vehicle
2. Forgot password → Supabase reset email → `/auth/reset-password`
3. Unverified user → `/auth/verify-email` with resend
4. Completed onboarding → skips wizard on return
5. Skip for now → dashboard with setup prompt

## Traceability

- **MRID-000001** · **AUTH-MRID-000001** · SCR-005–008, SCR-010–012

## Next step

**STEP-045** — [MEC-V1-S013 Unit tests](../execution/slices/MEC-V1-S013-unit-tests.md)

GA roadmap: [ROADMAP-043-052.md](../execution/ROADMAP-043-052.md)
