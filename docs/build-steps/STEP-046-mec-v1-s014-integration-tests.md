# STEP-046 — MEC-V1-S014 Integration Tests

| Field | Value |
|-------|-------|
| **Step ID** | STEP-046 |
| **Phase** | A |
| **Slice** | MEC-V1-S014 |
| **BUILD-ID** | BUILD-014 (part 2/5) |
| **Date** | 2026-06-25 |
| **Commit** | `bb3ab71` |
| **Status** | complete |

## Objective

Integration tests for services against a test database — MEI §11 IT layer for MRID service coverage.

## Changes

- `apps/web/vitest.integration.config.ts` — separate integration Vitest project
- `apps/web/src/test/integration/` — DB helpers, fixtures, global migrate setup
- Service integration tests: trip, usage, expense, report, subscription
- Root `pnpm test:integration`; unit `pnpm test` excludes `*.integration.test.ts`
- CI: dedicated `integration` job with Postgres 16 service container
- Health: `/health` → `MEC-V1-S014` / `STEP-046`

## Verification

```bash
pnpm lint            # pass
pnpm typecheck       # pass
pnpm build           # pass
pnpm test            # pass (unit only)
pnpm test:integration  # skips locally without reachable DATABASE_URL; runs in CI
```

Local integration run (Postgres required):

```bash
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mileage_copilot
pnpm db:migrate:deploy
pnpm test:integration
```

## Traceability

- **BUILD-014** (part 2/5) · MRID-000004–000015 service coverage

## Next step

**STEP-047** — [MEC-V1-S015 E2E journeys](../execution/slices/MEC-V1-S015-e2e-journeys.md)

GA roadmap: [ROADMAP-043-052.md](../execution/ROADMAP-043-052.md)
