# MEC-V1-S018 — Production Ops & Monitoring

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S018 — Production Ops & Monitoring

Mission:
Wire production observability, environment readiness checklist, and runbook links so the team can operate the deployed app on Netlify + Supabase.

Context:
- Prior: MEC-V1-S017 (STEP-049) complete
- Volumes: 19 (SRE), 7 (business readiness), 6 (env vars)
- Baseline: /health exists; SENTRY_DSN placeholder; Netlify configured

Allowed paths:
apps/web/src/app/health/route.ts
apps/web/src/lib/monitoring/** (Sentry init)
apps/web/sentry.client.config.ts / sentry.server.config.ts (if using @sentry/nextjs)
netlify.toml
docs/runbooks/**
docs/execution/PRODUCTION-CHECKLIST.md
.env.example

Rules:
- Sentry only when SENTRY_DSN set — no crash if missing
- Health endpoint reports slice/step, config flags (no secrets)
- Production checklist covers: DATABASE_URL, Supabase, Storage, OpenAI, Stripe, webhooks
- Document Supabase pooler region (aws-1-us-east-1) and direct URL usage
- Runbooks: stripe-outage.md exists — link from checklist

Forbidden:
- Committing secrets or .env.local
- Disabling error reporting in production without ADR
- New product features

Deliverables:
1. Sentry SDK integrated (client + server) with environment guard
2. Enhanced /health: version/build sha optional, dependency config flags
3. docs/execution/PRODUCTION-CHECKLIST.md — all env vars with owner
4. Netlify env var documentation aligned with .env.example
5. Stripe webhook URL + OpenAI key deployment notes for Netlify
6. Runbook index updated with on-call basics (Volume 19)

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] Sentry captures test error in staging when DSN set
- [ ] /health returns accurate configuration flags
- [ ] PRODUCTION-CHECKLIST complete with ☑/☐ per env var
- [ ] Deploy to Netlify succeeds with documented env set
- [ ] Runbooks linked from README or docs/runbooks/README.md

Commit:
chore(ops): MEC-V1-S018 production monitoring and env readiness

Step: STEP-050
BUILD-IDs: —
MRID-IDs: —
```
