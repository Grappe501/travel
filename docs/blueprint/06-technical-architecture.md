# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 6 — Technical Architecture & Production Infrastructure

**Version 1.0**

---

## Who This Document Is For

Volume 6 is the **technical spine** — build instructions for Cursor, engineers, and CI/CD. It defines stack, architecture, services, deployment, and guardrails.

| Audience | Use this volume to… |
|----------|---------------------|
| **Cursor / AI agents** | Follow Chapter 31 build rules without improvising stack |
| **Engineers** | Scaffold modules, deploy, and harden production |
| **DevOps** | Environments, CI gates, monitoring — **Volume 19** is the Operations Bible |
| **QA** | Test targets tied to architecture (Chapter 25) |

**Related:** [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md) · [Volume 4 — Data](04-database-architecture.md) · [Volume 5 — AI](05-ai-design.md) · [Volume 19 — Production SRE](19-production-sre.md)

---

# Chapter 1 — Purpose of Volume 6

Volume 6 defines how the application is **built, deployed, secured, scaled, and maintained**.

This volume answers:

* What technology stack are we using?
* How is the frontend structured?
* How is the backend structured?
* Where does data live?
* Where do receipt images live?
* How does AI processing work?
* How do subscriptions work?
* How do reports generate?
* How does the app work offline?
* How do we deploy safely?
* What does production-ready mean?

**Goal:** Build a **real SaaS product**, not a fragile prototype.

---

# Chapter 2 — Recommended Stack (Locked for This Project)

## Stack Decision Record

| Layer | **Chosen** | Alternatives considered | Why locked |
|-------|------------|-------------------------|------------|
| Frontend | **Next.js 15**, React 19, TypeScript, Tailwind, shadcn/ui | Remix, Vite SPA | PWA, SSR, Netlify support |
| Backend data | **Supabase** (Postgres + Auth + Storage + Edge Functions) | Prisma + Neon, custom API | RLS, Auth, Storage integrated; Volume 4 schema |
| ORM | **SQL migrations** + generated types (`supabase gen types`) | Prisma | Single source: `supabase/migrations/` |
| Auth | **Supabase Auth** | Clerk | Same platform as DB; SSR cookies via `@supabase/ssr` |
| Files | **Supabase Storage** | S3, R2 | RLS-aligned paths; one vendor |
| Payments | **Stripe** | — | Industry standard subscriptions |
| AI/OCR | **OpenAI Vision** via Edge Functions | Google Vision, Textract | Volume 5 prompt library |
| Email | **Resend** (+ Supabase Auth emails) | Postmark | Transactional |
| Hosting | **Netlify** | Vercel | User workflow; GitHub deploy |
| Monorepo | **npm workspaces** | pnpm, turbo | `apps/web` + `packages/shared` |
| Local dev | **100% H: drive** | — | C: nearly full |

> **Note:** Prisma + Neon is a valid pattern but **not this project**. All database access goes through Supabase client + RLS. Business logic lives in `packages/shared` and Edge Functions.

## Frontend

* Next.js App Router — PWA mobile-web first
* Future: Expo / React Native wrapper (Chapter 30) — reuse `packages/shared`

## AI/OCR Fallback Roadmap

| Provider | Use |
|----------|-----|
| OpenAI Vision | V1 primary |
| Google Vision | V1.1 fallback |
| AWS Textract | Enterprise optional |
| Tesseract | Local dev only — never production |

---

# Chapter 3 — Architecture Philosophy

Build a **modular SaaS system**, not a pile of pages.

## Core Modules

| Module | FR refs | Owns |
|--------|---------|------|
| Auth | FR-001, FR-002 | Session, profile |
| Billing | FR-003 | Stripe, usage counters |
| Business | FR-100 | Businesses, clients, projects |
| Vehicle | FR-200 | Vehicles, odometer history |
| Trip | FR-300–305 | Trip lifecycle |
| Receipt | FR-400–403 | Upload, OCR trigger |
| Expense | FR-600, FR-610 | Line items, categories |
| Report | FR-700 | PDF/CSV/Excel generation |
| AI | FR-1300, Volume 5 | Engines, prompts |
| Notification | FR-900 | In-app + email |
| Export | FR-1600 | Full backup |
| Admin | Internal | Support tools |
| Audit/Event | Volume 4 Ch. 17, 26 | audit_logs, business_events |
| Offline/Sync | FR-1400, FR-1500 | IndexedDB queue |

Each module includes:

* UI components (`apps/web/src/components/{module}/`)
* Validation schemas (`packages/shared/src/schemas/`)
* Service functions (`packages/shared/src/services/` or Edge Functions)
* Database tables (Volume 4)
* Tests (`*.test.ts`)
* Step doc in `docs/build-steps/` when implemented

**Rule:** Do not mix UI, DB calls, and business rules in one file (Chapter 31).

---

# Chapter 4 — Repository & App Structure

## Monorepo Layout (H:\Travel-Expense)

```txt
H:/Travel-Expense/
├── apps/web/                         # Next.js PWA — Netlify deploy target
│   ├── public/                       # manifest, icons, sw.js
│   └── src/
│       ├── app/                      # App Router (Volume 2 routes)
│       │   ├── (auth)/
│       │   ├── (app)/
│       │   │   ├── dashboard/
│       │   │   ├── trips/
│       │   │   ├── expenses/
│       │   │   ├── reports/
│       │   │   ├── settings/
│       │   │   └── billing/
│       │   ├── admin/                # Internal — role-gated
│       │   └── api/                  # Thin Route Handlers only when needed
│       ├── components/
│       │   ├── layout/
│       │   ├── dashboard/
│       │   ├── trips/
│       │   ├── receipts/
│       │   ├── reports/
│       │   ├── billing/
│       │   ├── forms/
│       │   └── ui/                   # shadcn
│       ├── lib/
│       │   ├── supabase/             # client, server, middleware
│       │   ├── auth/
│       │   ├── billing/
│       │   ├── storage/
│       │   ├── offline/              # IndexedDB sync queue
│       │   ├── permissions/
│       │   └── audit/
│       ├── hooks/
│       └── styles/
├── packages/shared/
│   └── src/
│       ├── types/
│       ├── schemas/                  # Zod — all FR inputs
│       ├── constants/
│       ├── calculations/             # mileage, totals
│       ├── permissions/              # canCreateTrip(), etc.
│       └── services/                 # pure business logic
├── supabase/
│   ├── migrations/                   # SQL — source of truth
│   ├── functions/                    # Edge Functions + _shared/prompts
│   └── seed/
├── scripts/                          # setup-h-drive.ps1, dev.ps1
└── .github/workflows/
```

**Primary data path:** Browser → Supabase (RLS) for CRUD.  
**Heavy jobs:** Browser → Edge Function → OpenAI / PDF lib / Stripe.

---

# Chapter 5 — Database Layer

## Platform

* **PostgreSQL 15+** hosted by Supabase
* **Schema:** `supabase/migrations/*.sql` (Volume 4)
* **Types:** `packages/shared/src/types/database.ts` generated via `supabase gen types typescript`

## Core Tables (maps to Volume 4)

`profiles` · `subscriptions` · `usage_counters` · `businesses` · `employees` · `vehicles` · `vehicle_odometer_history` · `clients` · `projects` · `trips` · `trip_notes` · `receipts` · `expenses` · `expense_categories` · `mileage_rates` · `mileage_rates_reference` · `reports` · `notifications` · `audit_logs` · `business_events` · `ocr_results` · `ai_suggestions` · `search_documents` · `ai_interaction_log` · `user_ai_preferences`

## Rules

* UUID primary keys everywhere
* `created_at`, `updated_at` on all core tables
* Soft-delete via `deleted_at` + `record_status`
* **Snapshot** `trips.mileage_rate` at completion — never rewrite history
* Financial edits → `audit_logs` trigger
* **RLS enabled** on every public table before any production data

## Local Database

```powershell
cd H:\Travel-Expense
supabase start          # Docker on H: if configured
supabase db reset       # Apply migrations + seed
supabase gen types typescript --local > packages/shared/src/types/database.ts
```

---

# Chapter 6 — Authentication Architecture

## Supabase Auth + `@supabase/ssr`

Users can:

* Create account (email/password)
* Sign in / sign out
* Reset password
* Verify email
* Stay signed in (refresh token rotation)
* Google login — **V1.1** (schema ready)

## Roles (V1 schema, V1.1 enforcement)

| Role | Scope |
|------|-------|
| Owner | Full account + businesses |
| Admin | Business tier — manage team |
| Employee | Own trips/expenses |
| Viewer | Read-only reports — Enterprise |

V1 launches **Owner-only**; `employees` table exists for Business tier.

## Session

* HTTP-only cookies via Next.js middleware
* JWT 1 hour; refresh rotation enabled
* `middleware.ts` refreshes session on every matched route

---

# Chapter 7 — Permission System

**Centralized** in `packages/shared/src/permissions/` — never scatter in components.

```typescript
// Examples — implement against FR-003 + Volume 4 RLS
canCreateTrip(user, business): boolean
canEditReceipt(user, receipt): boolean
canGenerateReport(user, business, format): boolean
canInviteEmployee(user, business): boolean
canAccessBilling(user): boolean
canAccessAdmin(user): boolean
```

**Two layers:**

1. **Client UI** — hide/disable actions (UX only)
2. **Server** — RLS + Edge Function checks (authoritative)

## Plan Limits (FR-003)

| Plan | Trips/mo | Receipts/mo | Employees |
|------|----------|-------------|-----------|
| Free | 5 | 10 | 0 |
| Pro | ∞ | ∞ | 0 |
| Small Business | ∞ | ∞ | 5 |
| Enterprise | custom | custom | ∞ |

---

# Chapter 8 — Billing Architecture

## Stripe Responsibilities

* Checkout · Subscriptions · Upgrades/downgrades · Failed payments · Customer Portal · Webhooks

## Webhook Handler

**Location:** `supabase/functions/stripe-webhook` (not Netlify — avoids cold-start signature issues)

## Required Events

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create/update subscription |
| `customer.subscription.created` | Set plan |
| `customer.subscription.updated` | Sync plan/status |
| `customer.subscription.deleted` | Downgrade to free |
| `invoice.payment_failed` | `past_due` grace 3 days |
| `invoice.payment_succeeded` | Confirm active |

## Source of Truth

| Concern | Authority |
|---------|-----------|
| Payment status | Stripe |
| Feature access | App DB after webhook sync |
| Usage counts | `usage_counters` (app) |

**Never fake payment success.** Test with Stripe test mode + CLI forward.

---

# Chapter 9 — Usage Limit Enforcement

Track in `usage_counters`:

* `trips_count` per calendar month (user TZ)
* `receipts_count` per calendar month

**Enforcement points:**

* `start_trip` → increment on success
* `receipt upload` → increment before OCR queue
* `check-limits` Edge Function for pre-flight UI

**At limit:**

* Show upgrade modal (Volume 2)
* **Do not delete** captured data
* Offline drafts allowed locally; **block cloud OCR/sync** until upgrade or new month
* Clear copy: "5 of 5 trips used — resets April 1"

---

# Chapter 10 — Receipt Upload Architecture

```
User captures receipt
    ↓
Temp blob (IndexedDB if offline)
    ↓
Upload to Supabase Storage (receipts bucket)     ← MUST succeed first
    ↓
INSERT receipts (upload_status: pending)
    ↓
POST /functions/v1/process-receipt (async)
    ↓
OCR → ocr_results
    ↓
upload_status: ready · review_status: pending
    ↓
User review screen → confirm
    ↓
INSERT expenses + link receipt
    ↓
business_event: receipt.ocr_completed, expense.created
```

**Invariant:** Image exists in Storage even if OCR fails forever.

---

# Chapter 11 — AI/OCR Processing Architecture

Async — **never freeze UI** (Volume 2 loading states).

## Receipt Status Machine

```
uploaded → processing → needs_review → processed
                    ↘ failed → manual entry
```

Maps to DB: `upload_status`, `review_status`

## Separation

| Layer | Table | Mutable by user? |
|-------|-------|------------------|
| AI suggestion | `ocr_results` | No (immutable) |
| User truth | `expenses`, `receipts` confirmed fields | Yes (with audit) |

See Volume 5 for engines, prompts, confidence.

---

# Chapter 12 — Trip Engine Architecture

## Status Enum

`draft` · `active` · `completed` · `archived` · `deleted`

## Flow

```
Start Trip → INSERT active → banner + events
    ↓
During: receipts, notes, expenses
    ↓
End Trip → checklist → compute (FR-500) → completed
    ↓
Core summary locked — edits require audit (FR-303)
```

## Active Trip Rule

**V1:** One active trip per **user** (Volume 3).  
**Schema:** supports per-vehicle constraint for V1.1 fleet.

---

# Chapter 13 — Mileage Calculation

Implemented in `packages/shared/src/calculations/mileage.ts` — **unit tested**.

```txt
business_miles = ending_odometer - starting_odometer   // or GPS / override per FR-500
reimbursement  = business_miles × mileage_rate_snapshot
```

Rules:

* End ≥ start (validate client + server + DB constraint)
* Rate copied to `trips.mileage_rate` at completion
* Historical trips immutable when rates change
* GPS optional V1 — not required for launch

---

# Chapter 14 — Report Generation

**Server-side** Edge Function `generate-report`.

## Types (FR-700)

Mileage · Expense · Combined · Reimbursement · Monthly · Annual · By vehicle/client

## Formats

PDF (Free+) · CSV (Pro+) · Excel (Pro+)

## PDF Header (required)

Business name · User name · Date range · Trip table · Expense table · Mileage totals · Expense totals · Grand total · Generated timestamp · Report ID

## Implementation

* PDF: `@react-pdf/renderer` or `pdfkit` in Edge Function (Deno-compatible lib TBD at scaffold)
* Store output in `exports` bucket · metadata in `reports` table
* TTL 7 days · regenerate anytime

---

# Chapter 15 — Export Architecture

| Mode | V1 | Architecture |
|------|-----|--------------|
| Download now | ✓ sync for small reports | Edge Function returns signed URL |
| Email to self | V1.1 | Resend + stored report |
| Report history | ✓ | `reports` table |
| Regenerate | ✓ | Same filters → new row |
| Full JSON backup | ✓ | FR-1600 bundled export |

Large exports → async job + notification (status `pending` → `ready`).

---

# Chapter 16 — Offline-First Architecture

Minimum V1 (N3):

* Start/end trip offline
* Capture receipt offline (local blob)
* Draft records in IndexedDB
* Sync on reconnect

**Tech:**

* `idb` library · custom sync queue in `apps/web/src/lib/offline/`
* Service worker caches app shell (PWA)

## Sync Status (client-side)

`local_only` · `pending_sync` · `synced` · `sync_failed` · `conflict`

---

# Chapter 17 — Sync Engine

Every offline record:

```typescript
interface OfflineRecord {
  localId: string
  serverId?: string
  entityType: 'trip' | 'expense' | 'receipt'
  payload: unknown
  createdAt: string
  updatedAt: string
  syncStatus: SyncStatus
  retryCount: number
  idempotencyKey: string
}
```

**Conflict rule:** Never silently overwrite server financial data. UI: "Two versions of this trip — choose which to keep." (FR-1500)

**Retry:** Exponential backoff, max 5 attempts → `sync_failed` + user notification.

---

# Chapter 18 — Notification Architecture

| Type | Channel V1 |
|------|------------|
| Trip still active | In-app + email |
| Receipt needs review | In-app |
| Monthly report ready | Email opt-in |
| Usage limit approaching | In-app (80%, 100%) |
| Subscription issue | Email |
| Sync failed | In-app |
| Export ready | In-app |

Push — V1.2 native app.

**Delivery:** `notifications` table + Resend for email · Edge Function cron (Supabase `pg_cron` V1.1)

---

# Chapter 19 — Admin Architecture

Internal route group `apps/web/src/app/admin/` — gated by `profiles.account_status` or allowlist.

| Feature | Notes |
|---------|-------|
| User lookup | By email/id |
| Subscription status | Read Stripe + DB |
| Usage counters | Support debugging |
| OCR failure logs | `ai_interaction_log` |
| Report logs | `reports` |
| Error correlation | Sentry id search |
| Support notes | V1.1 table |
| Account suspend | Service role action + audit |

**Receipt images:** Support view requires explicit user grant + logged access (Volume 8).

---

# Chapter 20 — Logging & Monitoring

| Signal | Tool |
|--------|------|
| Frontend errors | Sentry |
| Edge Function errors | Sentry + Supabase logs |
| Business timeline | `business_events` |
| Payments | Stripe Dashboard |
| Infrastructure | Netlify logs |
| OCR quality | Volume 5 telemetry |

**Never log:** receipt bytes, full OCR images, `service_role` key, Stripe secret.

---

# Chapter 21 — Security Architecture

Minimum standards (Volume 8 expands):

* HTTPS everywhere (Netlify default)
* Encryption at rest (Supabase)
* Secure auth cookies (`@supabase/ssr`)
* Rate limiting — Supabase Auth + Edge Function guards
* Zod validation all inputs
* File type + size validation (10MB, JPEG/PNG/HEIC/PDF)
* Signed URLs 60s for receipts
* RLS on all tables
* Audit logs on financial edits
* No secrets in repo
* No public receipt buckets

---

# Chapter 22 — Environment Variables

## Local (`H:\Travel-Expense\.env.local`)

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Mileage & Expense Copilot
PROJECT_ROOT=H:/Travel-Expense

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Edge Functions + server only

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=                  # Edge Functions only
STRIPE_WEBHOOK_SECRET=

# AI
OPENAI_API_KEY=                     # Edge Functions only

# Email
RESEND_API_KEY=

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# Optional
NEXT_PUBLIC_MAPBOX_TOKEN=
```

**Rules:**

* `NEXT_PUBLIC_*` = browser-safe only
* Never prefix secrets with `NEXT_PUBLIC_`
* `.env.example` placeholders only — commit that, never `.env.local`
* Netlify + Supabase dashboards mirror production values

---

# Chapter 23 — API Design

> **Canonical specification:** [Volume 12 — API Architecture & Integration Specification](12-api-architecture.md)

## Pattern

| Operation | Path |
|-----------|------|
| CRUD (trips, expenses, etc.) | Supabase client + RLS |
| OCR, reports, Stripe, limits | Supabase Edge Functions |
| Thin BFF (if needed) | Next.js Route Handlers — delegate to shared services |

## Edge Functions (canonical)

```txt
POST /functions/v1/process-receipt
POST /functions/v1/generate-report
GET  /functions/v1/check-limits
POST /functions/v1/stripe-webhook
POST /functions/v1/suggest-trip-prefill    # Volume 5 Ch. 25
```

## Optional Next.js Routes (BFF)

```txt
POST /api/billing/checkout      → create Stripe session
POST /api/billing/portal        → portal URL
```

Keep **business logic** in `packages/shared` — routes are thin adapters.

---

# Chapter 24 — Validation Standards

All schemas in `packages/shared/src/schemas/` — used by client, Route Handlers, and Edge Functions.

| Schema | FR |
|--------|-----|
| `startTripSchema` | FR-300 |
| `endTripSchema` | FR-302 |
| `receiptUploadSchema` | FR-400 |
| `expenseSchema` | FR-600 |
| `reportGenerateSchema` | FR-700 |
| `businessProfileSchema` | FR-100 |
| `vehicleSchema` | FR-200 |

**Server-side validation mandatory** — client validation is UX only.

---

# Chapter 25 — Testing Strategy

Minimum before production (Volume 9 details):

| Suite | Location |
|-------|----------|
| Mileage calculation | `packages/shared/src/calculations/*.test.ts` |
| Odometer validation | shared |
| Usage limits | integration + Edge Function |
| Subscription access | Stripe webhook mocks |
| OCR parsing | golden fixtures + prompt regression |
| Report generation | snapshot PDF text |
| Permissions | `permissions/*.test.ts` |
| Stripe webhooks | handler unit tests |
| Sync queue | offline E2E |
| Export | format validation |

**CI blocks merge** if core calculation tests fail.

---

# Chapter 26 — Deployment Strategy

## Environments

| Env | Branch / trigger | Supabase | Stripe |
|-----|------------------|----------|--------|
| **Local** | H:\ dev | `supabase start` or remote dev project | Test mode |
| **Preview** | PR → Netlify | Staging project or branch DB | Test mode |
| **Staging** | `develop` optional | Staging project | Test mode |
| **Production** | `main` → Netlify | Production project | Live mode |

## Rules

* Production deploys **only from `main`**
* Migrations applied **intentionally** — `supabase db push` in runbook, not accidental on deploy
* Stripe webhooks verified in staging before prod
* AI mocked in CI; staging uses real OpenAI with rate limits
* Every deploy tagged in BUILD-LOG step doc

---

# Chapter 27 — CI/CD Gates

## Every PR (`.github/workflows/ci.yml`)

```txt
npm run lint
npm run typecheck
npm run test
npm run build
supabase db lint          # when linked
```

## Pre-production release

```txt
npm run test:e2e
npm audit --audit-level=high
npm run production:readiness   # script: checklist Ch. 28
```

## Netlify

* Build from `netlify.toml`
* Deploy previews on PR
* Production on `main` merge

---

# Chapter 28 — Production Readiness Checklist

V1 is **not** production-ready until all pass:

- [ ] Auth: signup, login, reset, verify, logout
- [ ] Billing: checkout, portal, webhooks, plan sync
- [ ] Free limits enforced (5 trips, 10 receipts)
- [ ] Trip start → end → totals correct
- [ ] Receipt: upload → OCR → review → expense
- [ ] Reports: PDF minimum; CSV/Excel Pro
- [ ] Data export (JSON bundle)
- [ ] Sentry active
- [ ] Supabase backups enabled (Pro)
- [ ] Privacy policy + Terms published
- [ ] Support email configured
- [ ] Stripe webhooks signature verified
- [ ] Mobile UX tested (390px viewport)
- [ ] Offline capture tested (Volume 2 Journey G)
- [ ] No secrets in client bundle (`grep` CI check)
- [ ] RLS advisor clean

---

# Chapter 29 — Recommended Build Order

Aligns with Volume 3 Ch. 21 + BUILD-LOG steps:

| Step | Work | Phase |
|------|------|-------|
| 1 | Monorepo scaffold, H: setup, CI, Netlify | A |
| 2 | Supabase project + first migrations | B |
| 3 | Auth + profiles + middleware | B |
| 4 | Business + vehicle CRUD | B |
| 5 | Trip start/end + mileage calc | C |
| 6 | Receipt upload (Storage first) | D |
| 7 | OCR Edge Function + review UI | D |
| 8 | Expenses + categories | D |
| 9 | Reports Edge Function | E |
| 10 | Stripe + usage limits | F |
| 11 | Offline queue + sync | G |
| 12 | Notifications | G |
| 13 | Admin minimal | G |
| 14 | Production hardening (Ch. 28) | H |

Document each as `STEP-NNN` in BUILD-LOG.

---

# Chapter 30 — Future Expansion Hooks

Design V1 to avoid blocking:

| Future | Hook |
|--------|------|
| Native mobile | `packages/shared` + Supabase SDK |
| GPS auto-tracking | `gps_points` table stub |
| Calendar | `integrations` table |
| QuickBooks / Xero | `integrations` + event webhooks |
| Team approvals | `employees.role`, workflow status on trips |
| Enterprise policies | `businesses.policy_rules` jsonb |
| Fleet | per-vehicle active trip |
| Per diem | `expense_categories` + rules engine |
| Multi-currency | `amount_usd`, exchange rate on expenses |
| Voice entry | Volume 5 engine slot |

**Do not build in V1** — schema hooks only where cheap.

---

# Chapter 31 — Cursor / Agent Build Instructions

When generating code for this repository, follow **[Volume 21 — Construction Manual](21-construction-manual.md)** (waves, AI protocol) and use [`AI-HANDOFF-TEMPLATE.md`](../construction/AI-HANDOFF-TEMPLATE.md) for every task.

1. **Build modularly** — one module slice per PR/step
2. **Never mix** UI + DB + business logic in one file
3. **TypeScript everywhere** — strict mode
4. **Zod** for all external inputs
5. **Database** via Supabase migrations + RLS — not Prisma
6. **AI prompts** in `supabase/functions/_shared/prompts/` only
7. **Billing** centralized in billing module + stripe-webhook function
8. **Permissions** centralized in `packages/shared/src/permissions/`
9. **Tests** for every calculation and webhook handler
10. **Document** each slice in `docs/build-steps/STEP-NNN-*.md`
11. **Never commit secrets**
12. **Never fake payment success**
13. **Never silently alter financial data**
14. **Never expose receipt images publicly**
15. **All local artifacts on H:** — run `setup-h-drive.ps1`
16. **Commit only** after lint, typecheck, test pass
17. **Traceability:** commit message includes `Step: STEP-NNN`

---

# Chapter 32 — Volume 6 Non-Negotiables

| # | Rule |
|---|------|
| 1 | User data is the product foundation |
| 2 | Financial records must be traceable (audit + events) |
| 3 | AI suggestions never final until user accepts |
| 4 | Receipt images saved before OCR processing |
| 5 | Offline capture must not lose records |
| 6 | Billing gates must be reliable |
| 7 | Reports must be reproducible from stored data |
| 8 | Every sensitive action permission-checked |
| 9 | Every production error observable |
| 10 | Every module replaceable without rewrite |

---

# Chapter 33 — Technical Debt Policy

Technical debt is allowed **only when documented**.

Every shortcut requires a **Debt Record** in `docs/tech-debt/TD-NNN.md`:

```markdown
# TD-001 — Short title

| Field | Value |
|-------|-------|
| What was skipped | |
| Why | |
| Risk | low / medium / high |
| Approved by | |
| Cleanup deadline | YYYY-MM-DD |
| Tracking issue | STEP or GitHub # |
```

**Rules:**

* Fast MVP is good; **fragile is not**
* High-risk debt blocks production (Ch. 28)
* Review open debt items in monthly blueprint review
* Resolved debt → close TD doc + note in BUILD-LOG

---

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│  Clients: Mobile PWA · Desktop browser                            │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│  NETLIFY — Next.js 15 (apps/web) · CDN · headers · previews       │
└────────────┬───────────────────────────────┬─────────────────────┘
             │ Supabase JS (anon) + cookies    │ Sentry
             ▼                                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  SUPABASE                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ Auth        │  │ PostgreSQL   │  │ Storage (receipts, etc.)│ │
│  │ + RLS       │  │ + migrations │  │ signed URLs             │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Edge Functions: process-receipt · generate-report · stripe  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────┬───────────────────────────────┬─────────────────────┘
             │                               │
             ▼                               ▼
      ┌──────────┐                    ┌──────────┐
      │ Stripe   │                    │ OpenAI   │
      └──────────┘                    └──────────┘
             │
             ▼
      ┌──────────┐
      │ Resend   │
      └──────────┘

Local dev: H:\Travel-Expense · Git: github.com/Grappe501/travel
```

---

## H: Drive Quick Reference

| Artifact | Path |
|----------|------|
| Repo root | `H:\Travel-Expense` |
| npm cache | `H:\Travel-Expense\.cache\npm` |
| Temp | `H:\Travel-Expense\.tmp\os` |
| Setup script | `.\scripts\setup-h-drive.ps1` |

See [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md).

---

## Document Map

| Need | Go to |
|------|-------|
| Schema detail | [Volume 4](04-database-architecture.md) |
| AI pipelines | [Volume 5](05-ai-design.md) |
| UX routes | [Volume 2](02-user-experience.md) |
| Security depth | [Volume 8](08-security.md) |
| Test plan | [Volume 9](09-testing-quality.md) |
| Design system | [Volume 10](10-design-system.md) |
| Filesystem | [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md) |

---

*Previous: [Volume 5 — AI & Intelligence Architecture](05-ai-design.md) | Next: [Volume 7 — Business Operations & Go-to-Market](07-business-operations.md)*
