# STEP-048 Security Audit — MEC-V1-S016

| Field | Value |
|-------|-------|
| **Step** | STEP-048 |
| **Slice** | MEC-V1-S016 |
| **Date** | 2026-06-25 |
| **Auditor** | Engineering (automated + code review) |
| **Status** | **Signed off** — no critical/high open items |

## Scope

Volume 8 security pass before GA: API auth boundaries, storage privacy, webhook verification, RLS posture, upload/OCR limits, security headers, SEC tests.

## API route inventory (29 handlers)

All routes under `apps/web/src/app/api/**/route.ts` were scanned. Static test: `api-auth.security.test.ts`.

| Route | Auth mechanism | Notes |
|-------|----------------|-------|
| `/api/businesses` | `requireSessionUser` | GET, POST |
| `/api/businesses/[id]` | `requireSessionUser` | PATCH |
| `/api/vehicles` | `requireSessionUser` | GET, POST |
| `/api/vehicles/[id]` | `requireSessionUser` | PATCH |
| `/api/trips` | `requireSessionUser` | GET |
| `/api/trips/active` | `requireSessionUser` | GET |
| `/api/trips/start` | `requireSessionUser` | POST |
| `/api/trips/[id]` | `requireSessionUser` | GET, PATCH |
| `/api/trips/[id]/end` | `requireSessionUser` | POST |
| `/api/receipts` | `requireSessionUser` | GET |
| `/api/receipts/upload` | `requireSessionUser` + rate limit | POST |
| `/api/receipts/[id]` | `requireSessionUser` | GET |
| `/api/receipts/[id]/file` | `requireSessionUser` | GET signed URL |
| `/api/receipts/[id]/ocr` | `requireSessionUser` + rate limit | GET, POST |
| `/api/receipts/[id]/approve` | `requireSessionUser` | POST |
| `/api/receipts/[id]/attach` | `requireSessionUser` | POST |
| `/api/expenses` | `requireSessionUser` | GET, POST |
| `/api/expenses/[id]` | `requireSessionUser` | GET, PATCH, DELETE |
| `/api/reports` | `requireSessionUser` | POST |
| `/api/reports/[id]` | `requireSessionUser` | GET |
| `/api/reports/[id]/download` | `requireSessionUser` | GET |
| `/api/settings/mileage` | `requireSessionUser` | GET, PATCH |
| `/api/onboarding/status` | `requireSessionUser` | GET |
| `/api/onboarding/complete` | `requireSessionUser` | POST |
| `/api/onboarding/skip` | `requireSessionUser` | POST |
| `/api/usage` | `requireSessionUser` | GET |
| `/api/stripe/checkout` | `requireSessionUser` | POST |
| `/api/stripe/portal` | `requireSessionUser` | POST |
| `/api/stripe/webhook` | **Stripe signature** | No session; `constructEvent` required |

**Public (non-API):** `/health` — status only in production (config flags dev-only).

## Findings log

| ID | Severity | Finding | Status | Remediation |
|----|----------|---------|--------|-------------|
| F-001 | High | No CSP / HSTS on production responses | **Fixed** | Added CSP + HSTS to `netlify.toml` and `next.config.ts` via shared header module |
| F-002 | High | No app-level rate limits on upload/OCR | **Fixed** | In-memory per-user limits: upload 20/min, OCR 10/min (`lib/security/rate-limit.ts`) |
| F-003 | High | Receipt upload trusted client MIME only | **Fixed** | Magic-byte validation in `uploadReceipt` (`lib/receipts/magic-bytes.ts`) |
| F-004 | High | Missing SEC / IDOR automated tests | **Fixed** | `*.security.test.ts` — auth inventory, 401, IDOR 404, webhook signature |
| F-005 | Medium | `/health` disclosed integration config flags | **Fixed** | Production response omits `*Configured` booleans |
| F-006 | Medium | RLS enabled but no explicit policies on app tables | **Accepted** | Intentional PostgREST deny; Prisma server-side access + service-layer `getOwned*` |
| F-007 | Medium | No `storage.objects` RLS policies | **Deferred** | Private bucket + service-role uploads; add policies in ops hardening if PostgREST exposed |
| F-008 | Medium | CSP uses `unsafe-inline` / `unsafe-eval` for Next.js | **Deferred** | Documented; tighten with nonce/hash in post-GA sprint |
| F-009 | Low | In-memory rate limit not shared across serverless instances | **Deferred** | Accept for v1; migrate to Redis/Upstash at scale |
| F-010 | Low | No security audit event logging (login failures) | **Deferred** | Backlog for admin/ops slice |

## RLS review

Migration `20260625041100_enable_rls_app_tables.sql` enables RLS on 16 app tables with **no permissive policies** — default deny for Supabase PostgREST/JWT clients. The Next.js app uses Prisma with direct Postgres credentials and enforces ownership in services (`getOwnedTrip`, `getOwnedReceipt`, `getOwnedExpense`, etc.). Cross-user reads return **404** (not 403) to avoid ID enumeration.

Storage bucket `receipts` is **private** (`public = false`) with 10 MB and MIME allowlist at bucket level.

## Stripe webhook

- Requires `stripe-signature` header (400 if missing)
- Uses `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`
- Returns 503 if secret unset
- Covered by `auth-boundaries.security.test.ts`

## Receipt storage privacy

- Upload path: `{userId}/{receiptId}/original.{ext}`
- Access: signed URLs via `getReceiptSignedUrl` after `getOwnedReceipt`
- Service role key server-only (`SUPABASE_SERVICE_ROLE_KEY`)

## Admin / env allowlist

No admin API routes in v1. `/admin` page is middleware-protected placeholder only. Documented env vars with elevated privilege:

| Variable | Scope | Client exposure |
|----------|-------|-----------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Never |
| `STRIPE_SECRET_KEY` | Server only | Never |
| `STRIPE_WEBHOOK_SECRET` | Webhook route only | Never |
| `OPENAI_API_KEY` | OCR service only | Never |
| `DATABASE_URL` | Prisma server only | Never |

## SEC test coverage

| Test file | Coverage |
|-----------|----------|
| `api-auth.security.test.ts` | Route inventory + 401 without session |
| `auth-boundaries.security.test.ts` | Cross-user trip/receipt/expense 404; webhook signature |
| `rate-limit.test.ts` | Upload/OCR limiter behavior |
| `magic-bytes.test.ts` | Content sniffing |

Run with `pnpm test` (IDOR tests skip without integration DB).

## Sign-off

| Criterion | Met |
|-----------|-----|
| No API route missing auth (except webhook + public health) | Yes |
| Cross-user access blocked (404) | Yes — tested |
| Stripe webhook rejects invalid signature | Yes — tested |
| Audit lists all findings with fixed/deferred status | Yes |
| No critical open items | Yes |

**Approved for STEP-048 completion.** Next: STEP-049 (performance & a11y).
