# STEP-045 — MEC-V1-S013 Test Harness & Unit Tests

| Field | Value |
|-------|-------|
| **Step ID** | STEP-045 |
| **Phase** | A |
| **Slice** | MEC-V1-S013 |
| **BUILD-ID** | BUILD-014 (part 1/5) |
| **Date** | 2026-06-25 |
| **Commit** | — |
| **Status** | complete |

## Objective

Vitest across monorepo; unit tests for calculations, Zod schemas, and usage limit logic (Volume 9 pyramid base).

## Changes

- `packages/shared/vitest.config.ts` — Vitest + 80% coverage thresholds on calculations/schemas
- `apps/web/vitest.config.ts` — Vitest with `@/` alias
- Root `pnpm test` and `pnpm test:coverage` scripts
- `packages/shared/src/**/*.test.ts` — mileage calc, auth/trip/receipt/expense/report/billing schemas
- `apps/web/src/lib/billing/usage-limits.ts` — pure trip/receipt limit helpers
- `apps/web/src/lib/billing/*.test.ts` — usage limits + subscription access
- CI: `pnpm test` job in `.github/workflows/ci.yml`
- Health: `/health` → `MEC-V1-S013` / `STEP-045`

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
pnpm test       # pass (49 tests)
pnpm test:coverage  # pass, ≥80% on shared calculations/schemas
```

## Traceability

- **BUILD-014** (part 1/5) · Volume 9 test pyramid base

## Next step

**STEP-046** — [MEC-V1-S014 Integration tests](../execution/slices/MEC-V1-S014-integration-tests.md)

GA roadmap: [ROADMAP-043-052.md](../execution/ROADMAP-043-052.md)
