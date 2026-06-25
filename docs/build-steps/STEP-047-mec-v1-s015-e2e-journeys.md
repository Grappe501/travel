# STEP-047 — MEC-V1-S015 E2E Critical Journeys

| Field | Value |
|-------|-------|
| **Step ID** | STEP-047 |
| **Phase** | B |
| **Slice** | MEC-V1-S015 |
| **BUILD-ID** | BUILD-014 (part 3/5) |
| **Date** | 2026-06-25 |
| **Commit** | `8a9c334` |
| **Status** | complete |

## Objective

Playwright E2E suite for Volume 9 journeys E2E-01 through E2E-07 including mobile viewport coverage.

## Changes

- `apps/web/playwright.config.ts` — mobile + desktop projects, auth setup dependency
- `apps/web/e2e/` — seven journey specs, OCR/Stripe mocks, API helpers
- Root `pnpm test:e2e` / `pnpm test:e2e:smoke` (`@smoke` = E2E-01, E2E-03)
- `.env.test.example`, `docs/execution/E2E-SETUP.md`
- CI: `e2e` job (smoke on PR when secrets set, `continue-on-error` until configured)
- Health: `/health` → `MEC-V1-S015` / `STEP-047`

## Verification

```bash
pnpm lint            # pass
pnpm typecheck       # pass
pnpm build           # pass
pnpm test:e2e        # skips without E2E_TEST=1 + env (see E2E-SETUP.md)
```

Local E2E run:

```bash
cp .env.test.example .env.test
# configure Supabase + E2E user
pnpm exec playwright install chromium
E2E_TEST=1 pnpm test:e2e
```

## Traceability

- **BUILD-014** (part 3/5) · MRID-000001–000015 journey coverage

## Next step

**STEP-048** — [MEC-V1-S016 Security hardening](../execution/slices/MEC-V1-S016-security-hardening.md)

GA roadmap: [ROADMAP-043-052.md](../execution/ROADMAP-043-052.md)
