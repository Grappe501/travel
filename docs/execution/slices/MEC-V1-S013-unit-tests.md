# MEC-V1-S013 — Test Harness & Unit Tests

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S013 — Test Harness & Unit Tests

Mission:
Introduce Vitest across the monorepo and cover pure logic — calculations, schemas, validators — per Volume 9 test pyramid base layer.

Context:
- Prior: MEC-V1-S012 (STEP-044) complete
- WAVE: WAVE-010 prep (BUILD-014 foundation)
- Volume 9: Vitest runner; unit tests for calculations, schemas, utils
- Baseline: zero test files; execution package lists pnpm test

Allowed paths:
packages/shared/src/**/*.test.ts
packages/shared/vitest.config.ts (or root vitest.config.ts)
apps/web/src/**/*.test.ts
apps/web/vitest.config.ts
package.json (root + workspace test scripts)
.github/workflows/** (add test job if CI exists)
turbo.json / pnpm-workspace (test script wiring only)

Rules:
- Test pure functions without DB where possible
- Shared package tests run in CI on every PR
- No flaky timers; use fixed dates for mileage/date logic
- Mock external APIs (OpenAI, Stripe) — not in unit layer

Forbidden:
- E2E or Playwright in this slice
- Hitting production Supabase/Stripe in unit tests
- Testing Next.js page render unless trivial pure helpers
- Skipping CI wiring

Deliverables:
1. Vitest configured at repo root or per-package
2. pnpm test runs shared + web unit suites
3. Tests: mileage calculations (packages/shared)
4. Tests: trip odometer validation, reimbursement calc
5. Tests: Zod schemas (trip, receipt, expense, report, billing)
6. Tests: usage limit helpers (FREE_TRIPS/RECEIPTS boundaries)
7. Tests: report date-range guard (366 days)
8. CI job runs pnpm test on pull_request

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test

Exit criteria:
- [ ] pnpm test passes locally and in CI
- [ ] ≥80% line coverage on packages/shared/src/calculations and schemas
- [ ] Usage limit boundary tests (5 trips, 10 receipts)
- [ ] No test requires network or DATABASE_URL

Commit:
test(unit): MEC-V1-S013 Vitest harness and calculation tests

Step: STEP-045
BUILD-IDs: BUILD-014 (part 1/5)
MRID-IDs: —
```
