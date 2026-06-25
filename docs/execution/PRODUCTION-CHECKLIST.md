# Production Readiness Checklist — MEC-V1-S018 / STEP-050

Use this checklist before and after the first Netlify production deploy. Mark items when verified in the target environment.

**Health endpoint:** `GET /health` — returns `dependencies` flags (booleans only, no secrets).

**Runbooks:** [docs/runbooks/README.md](../runbooks/README.md)

---

## 1. Netlify site

| Item | Owner | Staging | Production |
|------|-------|---------|------------|
| Site connected to GitHub `main` | Eng | ☐ | ☐ |
| Build command: `pnpm install && pnpm db:generate && pnpm build` | Eng | ☐ | ☐ |
| Node 22 (`netlify.toml` / UI) | Eng | ☐ | ☐ |
| `@netlify/plugin-nextjs` v5 enabled | Eng | ☐ | ☐ |
| Production URL set in `NEXT_PUBLIC_APP_URL` | Eng | ☐ | ☐ |
| Deploy preview smoke: `/health` returns `status: ok` | Eng | ☐ | ☐ |

---

## 2. Database (Neon / Supabase Postgres)

| Variable | Owner | Purpose | Staging | Production |
|----------|-------|---------|---------|------------|
| `DATABASE_URL` | Eng | **Pooled** connection for Prisma at runtime | ☐ | ☐ |
| `DIRECT_URL` | Eng | **Direct** connection for `prisma migrate deploy` | ☐ | ☐ |

**Supabase pooler region:** use the pooler host for your project region (e.g. `aws-1-us-east-1` in Supabase dashboard → Database → Connection string → Transaction pooler).

---

## 3. Supabase Auth & Storage

| Variable | Owner | Purpose | Staging | Production |
|----------|-------|---------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Eng | Auth + storage API base | ☐ | ☐ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Eng | Browser auth client | ☐ | ☐ |
| `SUPABASE_SERVICE_ROLE_KEY` | Eng | Server-only receipt uploads | ☐ | ☐ |
| `STORAGE_BUCKET` | Eng | Receipt bucket (default `receipts`) | ☐ | ☐ |

---

## 4. Stripe billing

| Variable | Owner | Purpose | Staging | Production |
|----------|-------|---------|---------|------------|
| `STRIPE_SECRET_KEY` | Eng | Checkout + portal | ☐ | ☐ |
| `STRIPE_WEBHOOK_SECRET` | Eng | Webhook signature verification | ☐ | ☐ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Eng | Client | ☐ | ☐ |
| `STRIPE_PRICE_PRO_MONTHLY` | Eng | Pro plan price ID | ☐ | ☐ |
| `STRIPE_PRICE_SMALL_BUSINESS_MONTHLY` | Eng | Small Business price ID | ☐ | ☐ |

**Webhook URL:** `https://<your-site>.netlify.app/api/stripe/webhook`

**Runbook:** [stripe-outage.md](../runbooks/stripe-outage.md)

---

## 5. OpenAI (receipt OCR)

| Variable | Owner | Purpose | Staging | Production |
|----------|-------|---------|---------|------------|
| `OPENAI_API_KEY` | Eng | Vision OCR | ☐ | ☐ |

Set in Netlify for production OCR. **Runbook:** [ai-provider-outage.md](../runbooks/ai-provider-outage.md)

---

## 6. Monitoring (Sentry)

| Variable | Owner | Purpose | Staging | Production |
|----------|-------|---------|---------|------------|
| `SENTRY_DSN` | Eng | Server errors | ☐ | ☐ |
| `NEXT_PUBLIC_SENTRY_DSN` | Eng | Client errors (same DSN) | ☐ | ☐ |
| `SENTRY_ENVIRONMENT` | Eng | `staging` / `production` | ☐ | ☐ |
| `SENTRY_TEST_ENABLED` | Eng | Enables `POST /health/sentry-test` | ☐ | ☐ |

**Verify:** `curl -X POST https://<staging>.netlify.app/health/sentry-test` → event in Sentry.

---

## 7. Admin access (STEP-051)

| Variable | Owner | Purpose | Staging | Production |
|----------|-------|---------|---------|------------|
| `ADMIN_EMAIL_ALLOWLIST` | Eng | Comma-separated support staff emails | ☐ | ☐ |

Alternatively set Supabase `app_metadata.role` to `admin` or `support` for staff accounts.

**Verify:** Non-admin session → `403` on `/admin` and `/api/admin/*`; allowlisted admin can look up a test user.

---

## 8. Post-deploy smoke

| Check | Staging | Production |
|-------|---------|------------|
| `GET /health` → `status: ok` | ☐ | ☐ |
| `GET /health` → `readiness.productionReady: true` (GA) | ☐ | ☐ |
| Login, trip, receipt, report flows | ☐ | ☐ |
| Sentry 30m watch | ☐ | ☐ |

**Readiness:** `GET /health` → `readiness.gates[]` with hints for missing integrations.

**CLI:** `pnpm prod:check-env -- --tier=production`

**Deploy procedure:** [deployment.md](../runbooks/deployment.md) · **Migrations:** [database-migrations.md](../runbooks/database-migrations.md)
