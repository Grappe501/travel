# Production Deployment Runbook

**OPS-RB-010** · Volume 19 Ch. 7 · Volume 9

## Pre-deploy

- [ ] CI green on `main`
- [ ] CHANGELOG updated
- [ ] STEP doc created/updated
- [ ] Migrations applied to staging
- [ ] Staging smoke passed
- [ ] Rollback plan ready (OPS-RB-004)
- [ ] Approval (founder or eng lead for high-risk)

## Deploy

1. Merge to `main` (or trigger Netlify production deploy)
2. Apply migrations: `supabase db push` (production project)
3. Deploy Edge Functions if changed
4. Wait for Netlify build complete

## Post-deploy

1. Health check: API-HLT-001
2. Smoke: login, start trip, upload test receipt (staging user in prod — careful)
3. Monitor Sentry 30 minutes
4. Update BUILD-LOG with deploy SHA
5. Update ADM-REL release center

## Emergency deploy

Abbreviated staging only for P1 — document justification in incident log.
