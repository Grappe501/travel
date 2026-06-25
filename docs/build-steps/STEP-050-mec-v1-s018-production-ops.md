# STEP-050 — MEC-V1-S018 Production Ops & Monitoring

| Field | Value |
|-------|-------|
| **Step ID** | STEP-050 |
| **Phase** | B |
| **Slice** | MEC-V1-S018 |
| **WAVE** | WAVE-010 |
| **Date** | 2026-06-25 |
| **Commit** | — |
| **Status** | complete |

## Objective

Sentry integration, production env checklist, runbook links, enhanced `/health` (Volume 19 SRE).

## Changes

- `@sentry/nextjs` — client + server init when DSN set; no crash when missing
- `src/lib/monitoring/**` — config flags, capture helpers, instrumentation
- `/health` — dependency booleans, build metadata (`commitRef`, `deployUrl`)
- `POST /health/sentry-test` — staging verification when `SENTRY_TEST_ENABLED=1`
- `docs/execution/PRODUCTION-CHECKLIST.md` — env var sign-off table
- Runbook index on-call basics; README ops links; `.env.example` Netlify notes
- CSP updated for Sentry ingest endpoints

## Verification

```bash
pnpm lint            # pass
pnpm typecheck       # pass
pnpm build           # pass
pnpm test            # pass (includes monitoring.config.test.ts)
curl http://localhost:3000/health
# Staging: SENTRY_TEST_ENABLED=1 curl -X POST .../health/sentry-test
```

## Next step

**STEP-051** — [MEC-V1-S019 AdminOS minimum](../execution/slices/MEC-V1-S019-admin-minimum.md)
