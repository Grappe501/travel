# MEC-V1-S014 — Integration Tests

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S014 — Integration Tests

Mission:
Add integration tests for server services and API route handlers against a test database — MEI §11 IT layer for critical MRID paths.

Context:
- Prior: MEC-V1-S013 (STEP-045) complete
- WAVE: WAVE-010 prep
- MRIDs covered: 000004–000006, 000007–000011, 000012–000015 (service-level)
- Baseline: STEP-045 Vitest harness exists

Allowed paths:
apps/web/src/server/services/**/*.integration.test.ts
apps/web/src/app/api/**/*.integration.test.ts
apps/web/src/test/** (fixtures, db helpers, mocks)
packages/shared/src/**/*.integration.test.ts (if needed)
vitest.integration.config.ts (or vitest workspace project)

Rules:
- Use dedicated test DATABASE_URL or transactional rollback pattern
- Mock Supabase Storage, OpenAI, Stripe HTTP — test app logic + Prisma
- Each test file cleans up owned rows (userId scoped)
- Stripe webhook tests use fixture payloads + signature helper
- Do not run integration tests against production DB

Forbidden:
- Playwright/browser tests (STEP-047)
- Live OpenAI or Stripe API calls
- Modifying production schema outside migrations

Deliverables:
1. Test DB bootstrap helper (beforeAll seed user profile + subscription)
2. trip.service integration: start, end, conflict on double active
3. usage.service integration: limit block at 6th trip / 11th receipt
4. expense.service integration: CRUD + trip total recalc (requires S011)
5. report.service integration: generate CSV row counts
6. subscription.service integration: hasUnlimitedUsage matrix
7. pnpm test:integration script separate from unit (faster default test)
8. CI: integration job with DATABASE_URL secret (or skip if unavailable with documented local-only)

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test && pnpm test:integration

Exit criteria:
- [ ] Trip start/end integration tests pass
- [ ] Usage limit enforcement tested at boundary
- [ ] Expense create updates trip expense_total
- [ ] Report generation returns expected row shape
- [ ] Tests isolated per user; no cross-test pollution

Commit:
test(integration): MEC-V1-S014 API and service integration tests

Step: STEP-046
BUILD-IDs: BUILD-014 (part 2/5)
MRID-IDs: MRID-000004–000015 (service coverage)
```
