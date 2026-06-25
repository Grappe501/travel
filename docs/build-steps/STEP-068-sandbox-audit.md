# STEP-068 — Sandbox audit & deploy hardening (MEC-V1-S036)

**Version:** 1.9.2 · **Slice:** MEC-V1-S036

## Scope

Full sandbox pass: route/link audit, auth middleware gaps, Netlify build alignment, and public smoke tests.

### Route & link audit

- `route-catalog.ts` — canonical static routes + nav href collector
- `route-audit.test.ts` — verifies every nav/settings link resolves to `page.tsx` or `route.ts`
- 35+ static routes catalogued including settings sub-pages and legal pages

### Auth middleware

- Added `/search` and `/notifications` to `PROTECTED_ROUTE_PREFIXES`
- Middleware matcher includes `/dashboard`, `/search`, `/notifications` (session refresh + redirect)

### Deploy hardening

- `netlify.toml` — `corepack enable`, pnpm `9.15.0` aligned with `packageManager`
- E2E smoke: `e2e/smoke/public-routes.spec.ts` — public pages + protected redirects + `/health` JSON

### Fixes

- Removed unused `_request` param lint in notifications PATCH handler

## Verification

- [x] `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- [x] Route audit tests pass (nav links → pages)
- [x] CI integration job runs migrations + `db:verify-schema`

## Production checklist (manual)

1. Netlify env: `DATABASE_URL`, `DIRECT_URL`, Supabase keys, `NEXT_PUBLIC_APP_URL`
2. Run migrations per [database-migrations.md](../runbooks/database-migrations.md)
3. Confirm `/health` → `1.9.2` / `STEP-068` after deploy
