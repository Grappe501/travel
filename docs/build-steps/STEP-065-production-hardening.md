# STEP-065 — Production hardening (MEC-V1-S033)

**Version:** 1.8.2 · **Slice:** MEC-V1-S033

## Scope

- **Production readiness gates** — `/health` and `/admin/health` expose `readiness.gates[]` with hints
- **Stripe mode detection** — `readiness.stripeMode`: `live` | `test` | `off`
- **Email gate** — requires `RESEND_FROM_EMAIL` on verified domain (not `resend.dev`)
- **Sentry release tracking** — `COMMIT_REF` → `release` + `NEXT_PUBLIC_SENTRY_RELEASE`
- **Migration runbook** — [database-migrations.md](../runbooks/database-migrations.md)
- **Env CLI** — `pnpm prod:check-env -- --tier=production`
- **CI** — schema verify after migrate; concurrency; `workflow_dispatch`

## Verification

- [x] `GET /health` returns `readiness.coreReady` and `readiness.productionReady`
- [x] Admin health panel shows gate checklist
- [x] `production-readiness.test.ts` + updated `config.test.ts`
- [x] CI runs `pnpm db:verify-schema` after integration migrate
- [x] `pnpm prod:check-env` exits 0 with core vars set locally

## Netlify actions (manual)

Configure in Netlify UI — cannot be set from code:

1. Stripe live keys + webhook to `/api/stripe/webhook`
2. Resend API key + verified `RESEND_FROM_EMAIL`
3. Sentry DSN + `SENTRY_ENVIRONMENT=production`
4. `ADMIN_EMAIL_ALLOWLIST`
5. Run migrations per runbook after deploy
