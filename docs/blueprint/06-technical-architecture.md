# Volume 6 — Technical Architecture

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

Development through production — optimized for **H: drive local dev** and **GitHub → Netlify** deploy.

---

## Stack Summary

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript | SSR/SSG, PWA, Netlify support |
| **Styling** | Tailwind CSS + shadcn/ui | Mobile-first, fast iteration |
| **Backend** | Supabase | Postgres, Auth, Storage, Edge Functions, RLS |
| **AI / OCR** | Supabase Edge Function → OpenAI Vision API | Server-side only; keys never in client |
| **Payments** | Stripe Checkout + Customer Portal | Subscriptions, webhooks |
| **Maps** | Mapbox GL JS or Google Maps (TBD) | Trip route display |
| **Email** | Resend or Supabase Auth emails | Transactional |
| **Hosting** | Netlify | GitHub integration, previews, headers |
| **CI** | GitHub Actions | Lint, typecheck, test on PR |
| **Monorepo** | npm workspaces (or pnpm) | `apps/web` + `packages/shared` |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER DEVICES                              │
│              Mobile browser (PWA) · Desktop browser                │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NETLIFY CDN                              │
│              Next.js app (apps/web) · Edge headers               │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
             │ Supabase JS (anon key)        │ Optional Netlify Functions
             ▼                               ▼
┌────────────────────────────┐    ┌──────────────────────────────┐
│        SUPABASE           │    │  Thin proxies (if needed)    │
│  ┌──────────────────────┐ │    └──────────────────────────────┘
│  │ Auth (JWT + cookies) │ │
│  │ PostgreSQL + RLS     │ │
│  │ Storage (receipts)   │ │
│  │ Edge Functions       │◄─── Stripe webhooks, OCR, reports
│  └──────────────────────┘ │
└────────────┬───────────────┘
             │
     ┌───────┴───────┐
     ▼               ▼
┌─────────┐   ┌─────────────┐
│ Stripe  │   │ OpenAI API  │
└─────────┘   └─────────────┘
```

---

## H: Drive Development Configuration

**Principle:** Zero writes to C: for this project.

### Directory assignments

See [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md).

### Environment variables (session / user)

| Variable | Value |
|----------|-------|
| `PROJECT_ROOT` | `H:\Travel-Expense` |
| `TEMP` | `H:\Travel-Expense\.tmp\os` |
| `TMP` | `H:\Travel-Expense\.tmp\os` |
| `npm_config_cache` | `H:\Travel-Expense\.cache\npm` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `PLAYWRIGHT_BROWSERS_PATH` | `H:\Travel-Expense\.cache\playwright` |

Run `.\scripts\setup-h-drive.ps1` to create directories and set user env vars.

### Cursor / VS Code

Workspace settings pin terminal cwd and search exclude caches:

```json
{
  "terminal.integrated.cwd": "H:\\Travel-Expense",
  "files.watcherExclude": {
    "**/.cache/**": true,
    "**/.tmp/**": true,
    "**/node_modules/**": true
  }
}
```

### Docker (Supabase local — optional)

If using local Supabase, configure Docker Desktop data root on H: (Docker settings → Resources → Advanced → Disk image location). Document in runbook when enabled.

---

## GitHub Repository Structure

```
github.com/{org}/mileage-expense-copilot   (or travel-expense)
├── main          → Netlify production
├── develop       → optional staging branch
└── feature/*     → Netlify deploy previews
```

### Branch protection (recommended)

- `main`: require PR, passing CI, no direct push
- Signed commits optional

### GitHub Actions — `ci.yml`

```yaml
# Triggers: pull_request, push to main
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup-node 22
      - npm ci
      - npm run lint
      - npm run typecheck
      - npm run test
```

Note: CI runs on GitHub runners (cloud), not H: — only local dev uses H:.

---

## Netlify Deployment

### Connection

1. Create Netlify site linked to GitHub repo
2. Build settings read from `netlify.toml` at repo root
3. Environment variables set in Netlify UI (never committed)

### Required Netlify env vars

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL              # https://app.mileagecopilot.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# Server-side via Netlify env (not NEXT_PUBLIC):
SUPABASE_SERVICE_ROLE_KEY        # Only if Netlify Functions need it
STRIPE_SECRET_KEY                # Prefer Supabase Edge for webhooks
```

**Recommendation:** Keep Stripe webhooks and OCR on Supabase Edge Functions — Netlify serves static/SSR frontend only.

### Next.js on Netlify

Use `@netlify/plugin-nextjs` (auto-detected for Next.js sites).

Build:
- **Base directory:** `apps/web` (or root with adjusted paths)
- **Command:** `npm run build`
- **Publish:** handled by Next.js adapter

### Deploy previews

Every PR → unique preview URL for QA.

### Custom domain

```
app.mileagecopilot.com  → Netlify production
www.mileagecopilot.com  → Marketing site (future, separate or same repo /marketing)
```

---

## Supabase Configuration

### Project setup

1. Create Supabase project (production)
2. Optional: separate staging project
3. Apply migrations from `supabase/migrations/`
4. Enable RLS on all tables (see Volume 4)
5. Create Storage bucket `receipts` (private)
6. Deploy Edge Functions:
   - `process-receipt` — OCR pipeline
   - `stripe-webhook` — subscription sync
   - `generate-report` — PDF/CSV/Excel

### Auth settings

- Email/password enabled V1
- OAuth Google/Apple — V1.1
- JWT expiry: 1 hour; refresh token rotation enabled
- Site URL: Netlify production URL
- Redirect URLs: Netlify preview wildcard pattern

### Local Supabase (optional)

```powershell
cd H:\Travel-Expense
supabase start    # Requires Docker on H:
supabase db reset # Apply migrations + seed
```

---

## API Design

### Primary data access

**Supabase client direct** with RLS — no custom REST layer for CRUD V1.

### Edge Functions (HTTP)

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/functions/v1/process-receipt` | POST | JWT | OCR pipeline |
| `/functions/v1/generate-report` | POST | JWT | Async report generation |
| `/functions/v1/stripe-webhook` | POST | Stripe signature | Billing events |
| `/functions/v1/check-limits` | GET | JWT | Tier quota before action |

### Realtime (optional V1)

Subscribe to `trips` status changes for active trip banner — nice-to-have.

---

## Frontend Architecture

```
apps/web/src/
├── app/                    # Routes (match Volume 2 screen inventory)
│   ├── (auth)/
│   ├── (app)/
│   │   ├── home/
│   │   ├── trips/
│   │   ├── scan/
│   │   ├── reports/
│   │   └── settings/
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── trips/
│   ├── receipts/
│   └── reports/
├── lib/
│   ├── supabase/           # Client, server, middleware
│   ├── offline/            # IndexedDB queue
│   └── stripe/             # Checkout redirect
└── hooks/
```

### PWA

- `manifest.json` — installable, standalone display
- Service worker — cache shell, offline trip queue
- Camera API — `capture="environment"` for receipt scan

### State management

- Server state: TanStack Query + Supabase
- Local draft trips: IndexedDB via `idb`
- Minimal global client state (Zustand only if needed)

---

## Shared Package

```
packages/shared/src/
├── types/          # Trip, Expense, Receipt interfaces
├── schemas/        # Zod validation (shared client + edge)
├── calculations/   # Mileage, totals, report aggregations
└── constants/      # Categories, IRS rates
```

Single source of truth for business logic — tested independently.

---

## Caching Strategy

| Cache | Location | TTL |
|-------|----------|-----|
| Next.js static assets | Netlify CDN | Long |
| Dashboard aggregates | Supabase query + React Query | 30s stale |
| IRS rates | DB reference table | Until year change |
| Signed receipt URLs | Generated on demand | 60s |

---

## Logging & Monitoring

| Tool | Purpose |
|------|---------|
| Netlify Analytics | Traffic, Web Vitals |
| Supabase Logs | DB, Auth, Edge Function errors |
| Sentry (recommended) | Frontend + Edge Function exceptions |
| Stripe Dashboard | Payment failures |

No PII in client logs. Receipt images never logged.

---

## Scaling Plan

| Stage | Users | Actions |
|-------|-------|---------|
| Launch | < 1K | Supabase free/pro, Netlify starter |
| Growth | 1K–10K | Supabase pro, connection pooling, CDN |
| Scale | 10K+ | Read replicas, report queue, OCR batch |

V1 architecture supports 10K MAU without structural changes.

---

## Backup & Recovery

- **Database:** Supabase automated backups (enable Pro)
- **Storage:** Supabase Storage replication
- **Code:** GitHub
- **Secrets:** Netlify + Supabase vaults — document rotation runbook

**RTO:** 4 hours · **RPO:** 24 hours (backup frequency)

---

## Implementation Phase A Checklist (First Code)

When blueprint is signed off:

1. [ ] Initialize monorepo on `H:\Travel-Expense`
2. [ ] Run `setup-h-drive.ps1`
3. [ ] Scaffold `apps/web` (Next.js + Tailwind + shadcn)
4. [ ] Scaffold `packages/shared`
5. [ ] Initialize Supabase linked project
6. [ ] First migration: profiles, businesses, vehicles
7. [ ] GitHub repo + push
8. [ ] Netlify site linked
9. [ ] CI workflow green
10. [ ] `.env.example` documented

---

*Previous: [Volume 5 — AI & Intelligence Architecture](05-ai-design.md) | Next: [Volume 7 — Business Operations](07-business-operations.md)*
