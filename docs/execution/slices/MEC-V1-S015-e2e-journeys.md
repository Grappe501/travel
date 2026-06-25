# MEC-V1-S015 — E2E Critical Journeys

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S015 — E2E Critical Journeys

Mission:
Playwright E2E suite for Volume 9 journeys E2E-01 through E2E-07 — the user-facing launch gate before security/ops hardening.

Context:
- Prior: MEC-V1-S014 (STEP-046) complete
- Depends on: S012 onboarding (E2E-01), S011 expenses (E2E-03/04)
- Volume 9: Playwright; mobile viewport 390×844 for E2E-01–04
- Baseline: no Playwright config

Allowed paths:
apps/web/playwright.config.ts
apps/web/e2e/**
apps/web/package.json (test:e2e script)
.github/workflows/** (e2e job)
.env.test.example (document E2E env vars)

Rules:
- Run against local dev server or staging URL via PLAYWRIGHT_BASE_URL
- Mock OCR in E2E-04 (route intercept or test flag) — do not require OPENAI_API_KEY
- Stripe E2E-06 uses test mode checkout or mocked redirect
- Use test user factory; delete/cleanup test data where possible
- Smoke subset (E2E-01, E2E-03) on PR; full suite on main merge (Volume 9)

Forbidden:
- E2E against production
- Storing real credentials in repo
- Flaky waits without expect polling
- Skipping mobile viewport tests for E2E-01–04

Deliverables:
1. Playwright installed and configured for apps/web
2. E2E-01: signup → onboarding → dashboard
3. E2E-02: create business → add vehicle
4. E2E-03: start trip → manual expense → end trip → summary visible
5. E2E-04: upload receipt → review (mock OCR) → approve → expense linked
6. E2E-05: generate report → download file
7. E2E-06: billing upgrade flow (Stripe test or mock)
8. E2E-07: free tier 6th trip blocked with upgrade message
9. pnpm test:e2e + CI workflow (may use continue-on-error until env secrets set)

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e

Exit criteria:
- [x] E2E-01–07 defined and pass locally with documented env
- [x] E2E-01–04 pass at 390×844 viewport
- [x] CI runs smoke E2E on PR when secrets available
- [x] README or docs/execution/E2E-SETUP.md explains local run

Commit:
test(e2e): MEC-V1-S015 Playwright critical journeys

Step: STEP-047
BUILD-IDs: BUILD-014 (part 3/5)
MRID-IDs: MRID-000001–000015 (journey coverage)
```
