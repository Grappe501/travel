# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 12 — API Architecture & Integration Specification

**Version 1.0**

---

## Who This Document Is For

Volume 12 is the **API Constitution** — the contract every client, integration, and AI agent builds against. Once this exists, no one should ask *"What should this endpoint return?"*

| Role | Use this volume to… |
|------|---------------------|
| **Frontend** | Know exact request/response shapes per SCR screen |
| **Backend** | Implement Edge Functions + RLS before UI depends on them |
| **QA** | API test matrices (Volume 9) per API-ID |
| **Integrations** | Build third-party clients without reading source code |
| **AI agents** | Generate handlers from API-ID specs |

**Related:** [Volume 4 — Data](04-database-architecture.md) · [Volume 6 — Technical](06-technical-architecture.md) · [Volume 8 — Security](08-security.md) · [Volume 11 — SCR-IDs](11-screen-bible.md)

Volume 6 Ch. 23 is a **summary**; **Volume 12 is canonical** for all API behavior.

---

## Architecture Overview

This project uses a **two-layer API**:

| Layer | Technology | Use |
|-------|------------|-----|
| **Data API** | Supabase PostgREST + RLS | CRUD on Postgres tables |
| **Service API** | Supabase Edge Functions (+ thin Next.js BFF) | OCR, reports, Stripe, limits, AI |

Both layers obey the **response envelope** (Ch. 3). PostgREST errors are **mapped** to the standard envelope at the client adapter layer (`lib/api/envelope.ts`).

**Base URLs:**

| Environment | Data API | Service API |
|-------------|----------|-------------|
| Production | `https://{project}.supabase.co/rest/v1` | `https://{project}.supabase.co/functions/v1` |
| Local | `http://127.0.0.1:54321/rest/v1` | `http://127.0.0.1:54321/functions/v1` |

**Version prefix (Service API):** `/functions/v1/{function-name}` — bump to `v2` only on breaking changes.

---

## API ID Catalog

Permanent **API-IDs** referenced in FRs, SCRs, tests, and commits.

Companion tracker: [`docs/api-catalog/API-INDEX.md`](../api-catalog/API-INDEX.md)

| API-ID | Name | Method | Path | SCR refs |
|--------|------|--------|------|----------|
| API-AUTH-001 | Register | POST | Supabase `auth.signUp` | SCR-004 |
| API-AUTH-002 | Login | POST | `auth.signInWithPassword` | SCR-003 |
| API-AUTH-003 | Logout | POST | `auth.signOut` | SCR-047 |
| API-AUTH-004 | Refresh Session | POST | `auth.refreshSession` | all |
| API-AUTH-005 | Verify Email | POST | `auth.resend` | SCR-005 |
| API-AUTH-006 | Forgot Password | POST | `auth.resetPasswordForEmail` | SCR-006 |
| API-AUTH-007 | Reset Password | POST | `auth.updateUser` | SCR-007 |
| API-AUTH-008 | Current User | GET | `auth.getUser` + `profiles` | SCR-015 |
| API-AUTH-009 | Update Profile | PATCH | `profiles` | SCR-047 |
| API-SUB-001 | Current Plan | GET | `subscriptions` | SCR-044 |
| API-SUB-002 | Usage | GET | `usage_counters` | SCR-045 |
| API-SUB-003 | Checkout | POST | `/functions/v1/create-checkout` | SCR-044, SCR-058 |
| API-SUB-004 | Billing Portal | POST | `/functions/v1/billing-portal` | SCR-044 |
| API-SUB-005 | Stripe Webhook | POST | `/functions/v1/stripe-webhook` | — |
| API-BIZ-001 | List Businesses | GET | `businesses` | SCR-033 |
| API-BIZ-002 | Create Business | POST | `businesses` | SCR-010, SCR-034 |
| API-BIZ-003 | Update Business | PATCH | `businesses?id=` | SCR-034 |
| API-BIZ-004 | Archive Business | PATCH | `record_status=archived` | SCR-034 |
| API-VEH-001 | List Vehicles | GET | `vehicles` | SCR-035 |
| API-VEH-002 | Create Vehicle | POST | `vehicles` | SCR-011, SCR-035 |
| API-VEH-003 | Update Vehicle | PATCH | `vehicles?id=` | SCR-036 |
| API-VEH-004 | Odometer History | GET | `vehicle_odometer_history` | SCR-036 |
| API-CLI-001 | List Clients | GET | `clients` | SCR-037 |
| API-CLI-002 | Create Client | POST | `clients` | SCR-037 |
| API-CLI-003 | Update Client | PATCH | `clients?id=` | SCR-038 |
| API-PRJ-001 | List Projects | GET | `projects` | SCR-039 |
| API-PRJ-002 | Create Project | POST | `projects` | SCR-039 |
| API-TRIP-001 | Start Trip | POST | `trips` | SCR-019 |
| API-TRIP-002 | End Trip | PATCH | `trips?id=` + RPC | SCR-020 |
| API-TRIP-003 | Edit Trip | PATCH | `trips?id=` | SCR-021 |
| API-TRIP-004 | Delete Trip | PATCH | soft-delete | SCR-057 |
| API-TRIP-005 | Duplicate Trip | POST | RPC `duplicate_trip` | SCR-022 |
| API-TRIP-006 | Trip Details | GET | `trips` + embed | SCR-018 |
| API-TRIP-007 | List Trips | GET | `trips` | SCR-017 |
| API-TRIP-008 | Trip Timeline | GET | `business_events` | SCR-018 |
| API-RCP-001 | Upload Receipt | POST | Storage + `receipts` | SCR-023 |
| API-RCP-002 | OCR Process | POST | `/functions/v1/process-receipt` | SCR-024 |
| API-RCP-003 | OCR Status | GET | `ocr_results` | SCR-024 |
| API-RCP-004 | OCR Retry | POST | `/functions/v1/process-receipt` | SCR-024 |
| API-RCP-005 | Review Receipt | PATCH | `receipts` + `expenses` | SCR-024 |
| API-RCP-006 | List Receipts | GET | `receipts` | SCR-026 |
| API-RCP-007 | Link to Trip | PATCH | `expenses.trip_id` | SCR-029 |
| API-EXP-001 | Add Expense | POST | `expenses` | SCR-028 |
| API-EXP-002 | Edit Expense | PATCH | `expenses?id=` | SCR-028 |
| API-EXP-003 | Delete Expense | PATCH | soft-delete | SCR-028 |
| API-EXP-004 | List Expenses | GET | `expenses` | SCR-027 |
| API-MLG-001 | Current Rate | GET | `mileage_rates` | SCR-012, SCR-060 |
| API-MLG-002 | Update Rate | POST | `mileage_rates` | SCR-060 |
| API-MLG-003 | Calculate Reimbursement | POST | shared calc (client) + verify RPC | SCR-020 |
| API-RPT-001 | Generate Report | POST | `/functions/v1/generate-report` | SCR-031 |
| API-RPT-002 | Report Status | GET | `reports?id=` | SCR-032 |
| API-RPT-003 | Download Report | GET | signed URL | SCR-032 |
| API-RPT-004 | List Reports | GET | `reports` | SCR-030 |
| API-DSH-001 | Dashboard Summary | GET | RPC `dashboard_summary` | SCR-015 |
| API-DSH-002 | Recent Activity | GET | `business_events` | SCR-015 |
| API-DSH-003 | AI Insights | GET | `/functions/v1/ai-suggestions` | SCR-040 |
| API-NOT-001 | List Notifications | GET | `notifications` | SCR-042 |
| API-NOT-002 | Mark Read | PATCH | `notifications?id=` | SCR-042 |
| API-NOT-003 | Preferences | PATCH | `profiles.notification_prefs` | SCR-046 |
| API-SRH-001 | Unified Search | GET | `/functions/v1/search` | SCR-043 |
| API-AI-001 | Category Suggestion | POST | `/functions/v1/suggest-category` | SCR-024 |
| API-AI-002 | Duplicate Detection | POST | `/functions/v1/check-duplicate` | SCR-024 |
| API-AI-003 | AI Feedback | POST | `ai_interaction_log` | SCR-041 |
| API-EXP-010 | Account Export | POST | `/functions/v1/export-account` | SCR-050 |
| API-FIL-001 | Signed URL | POST | Storage `createSignedUrl` | SCR-025 |
| API-FIL-002 | Delete File | DELETE | Storage + DB | SCR-025 |
| API-ADM-001 | User Lookup | GET | admin RPC | SCR-054 |
| API-ADM-002 | System Health | GET | `/functions/v1/health` | SCR-055 |
| API-HLT-001 | App Health | GET | `/functions/v1/health` | — |
| API-LIM-001 | Check Limits | GET | `/functions/v1/check-limits` | SCR-019, SCR-058 |

**Total V1 API-IDs:** 70+

---

# Chapter 1 — Purpose

Volume 12 defines **every API** used by the application.

Every endpoint documents:

| Field | Description |
|-------|-------------|
| Purpose | Why it exists |
| Route | URL or resource |
| HTTP method | GET, POST, PATCH, DELETE |
| Authentication | Bearer JWT, service role, webhook secret |
| Permissions | Role + ownership (RLS) |
| Request schema | Zod schema name |
| Validation | Business rules |
| Response schema | Success shape |
| Error responses | Code + HTTP status |
| Rate limits | Category limits |
| Logging | What to log (no PII in logs) |
| Audit | `audit_logs` / `business_events` |
| Version history | Changelog entry |

**No endpoint is implemented before it is documented here.**

---

# Chapter 2 — API Philosophy

The API is:

| Property | Meaning |
|----------|---------|
| **Predictable** | Same envelope, same error shape, same pagination |
| **Consistent** | Naming, filters, and auth patterns repeat |
| **Versioned** | Breaking changes require new version |
| **Secure** | RLS + explicit permission checks on services |
| **Self-documenting** | API-IDs, schemas, examples in this volume |
| **Easy to test** | Every API-ID has integration test |
| **Easy to extend** | New fields additive; integrations via events |

> Treat the API as a **stable product**, not a backend implementation detail.

---

# Chapter 3 — API Standards

## Response Envelope (Service API + client adapter)

**Success:**

```json
{
  "success": true,
  "data": {},
  "meta": {},
  "requestId": "req_01HXYZ...",
  "timestamp": "2026-06-24T12:00:00.000Z"
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "TRIP_ALREADY_ACTIVE",
    "message": "You already have an active trip.",
    "details": [{ "field": "trip_id", "issue": "active_exists" }]
  },
  "requestId": "req_01HXYZ...",
  "timestamp": "2026-06-24T12:00:00.000Z"
}
```

## HTTP Status Mapping

| Status | Use |
|--------|-----|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No content (DELETE soft) |
| 400 | Validation / business rule |
| 401 | Unauthenticated |
| 403 | Permission denied |
| 404 | Not found or RLS hide |
| 409 | Conflict (active trip, idempotency) |
| 422 | Semantic validation |
| 429 | Rate limit |
| 500 | Internal (generic message to client) |

## Headers

| Header | Required |
|--------|----------|
| `Authorization: Bearer {jwt}` | User endpoints |
| `apikey: {anon_key}` | Supabase client |
| `Content-Type: application/json` | JSON bodies |
| `Idempotency-Key: {uuid}` | POST where noted |
| `X-Request-Id` | Echo or generate |

Never return inconsistent structures. PostgREST arrays wrap in `{ success, data: rows }` at adapter.

---

# Chapter 4 — Authentication APIs

Auth via **Supabase Auth**; profile in `profiles` table.

## API-AUTH-001 — Register

| Field | Value |
|-------|-------|
| Method | POST (Supabase client) |
| Auth | Anon key |
| Request | `{ email, password, options: { data: { full_name } } }` |
| Response | `{ user, session? }` — session null until verified if enforced |
| Errors | `AUTH_EMAIL_TAKEN`, `AUTH_WEAK_PASSWORD` |
| Audit | `user_registered` business_event |
| Rate limit | 5/hour/IP |
| FR | FR-001 |
| SCR | SCR-004 |

## API-AUTH-002 — Login

| Request | `{ email, password }` |
| Response | `{ user, session: { access_token, refresh_token, expires_at } }` |
| Errors | `AUTH_INVALID_CREDENTIALS`, `AUTH_EMAIL_NOT_VERIFIED` |
| Audit | `login_success` / `login_failure` |
| Rate limit | 10/min/IP |
| SCR | SCR-003 |

## API-AUTH-003 — Logout

Invalidates refresh token. Client clears local session.

## API-AUTH-004 — Refresh Session

Automatic via Supabase client. On failure → `AUTH_SESSION_EXPIRED` → SCR-003.

## API-AUTH-005 — Verify Email

Resend verification. No account enumeration in response.

## API-AUTH-006 — Forgot Password

Always returns success message.

## API-AUTH-007 — Reset Password

Token from email link. `AUTH_TOKEN_EXPIRED` on invalid token.

## API-AUTH-008 — Current User

```json
{
  "success": true,
  "data": {
    "user": { "id", "email", "emailVerified" },
    "profile": { "fullName", "onboardingComplete", "activeBusinessId" }
  }
}
```

## API-AUTH-009 — Update Profile

PATCH `profiles`. Fields: `full_name`, `active_business_id`. Audit on change.

---

# Chapter 5 — Subscription APIs

**Rule:** Billing state from **Stripe**; feature access from **`subscriptions`** after webhook sync.

## API-SUB-001 — Current Plan

GET `subscriptions` where `user_id = auth.uid()`.

```json
{
  "data": {
    "plan": "free" | "pro" | "business",
    "status": "active" | "past_due" | "canceled",
    "currentPeriodEnd": "ISO8601",
    "stripeCustomerId": "cus_..."
  }
}
```

## API-SUB-002 — Usage

GET `usage_counters` for current billing month.

## API-SUB-003 — Checkout (Upgrade)

POST `/functions/v1/create-checkout`

Request: `{ priceId, successUrl, cancelUrl }`  
Response: `{ checkoutUrl }`  
Idempotency-Key supported.

## API-SUB-004 — Billing Portal

POST `/functions/v1/billing-portal` → `{ portalUrl }`

## API-SUB-005 — Stripe Webhook

POST `/functions/v1/stripe-webhook`  
Auth: `Stripe-Signature` header  
Events: `checkout.session.completed`, `customer.subscription.updated`, `invoice.payment_failed`  
Updates `subscriptions`, `usage_counters`; audit `subscription_changed`  
**Never** deletes user data on downgrade.

## API-LIM-001 — Check Limits

GET `/functions/v1/check-limits?action=start_trip|upload_receipt`

Response: `{ allowed: boolean, reason?, usage, limit }`  
SCR-019, SCR-058 pre-flight.

---

# Chapter 6 — Business APIs

RLS: user owns business via `businesses.user_id`.

| API-ID | Method | Resource | Notes |
|--------|--------|----------|-------|
| API-BIZ-001 | GET | `businesses?record_status=eq.active` | List |
| API-BIZ-002 | POST | `businesses` | Schema: `businessProfileSchema` |
| API-BIZ-003 | PATCH | `businesses?id=eq.{id}` | Ownership check |
| API-BIZ-004 | PATCH | archive | `record_status=archived` |
| API-BIZ-005 | PATCH | restore | `record_status=active` |

Validation: name required 1–200 chars. EIN optional format check.

Errors: `PERMISSION_DENIED`, `VALIDATION_FAILED`

---

# Chapter 7 — Vehicle APIs

| API-ID | Method | Notes |
|--------|--------|-------|
| API-VEH-001 | GET | Filter by `business_id` |
| API-VEH-002 | POST | `vehicleSchema`; set `is_default` clears others |
| API-VEH-003 | PATCH | Odometer update triggers history row |
| API-VEH-004 | GET | `vehicle_odometer_history?vehicle_id=` |

**Rule:** Odometer updates validated — new reading ≥ last recorded unless `force=true` admin.

Errors: `ODOMETER_INVALID`, `ODOMETER_DECREASED`

---

# Chapter 8 — Client APIs

CRM-ready. Scoped to `business_id`.

| API-ID | Operation |
|--------|-----------|
| API-CLI-001 | List with search `ilike` on name |
| API-CLI-002 | Create |
| API-CLI-003 | Update / archive |

Future: external CRM webhook on create (Ch. 36).

---

# Chapter 9 — Project APIs

| API-ID | Operation |
|--------|-----------|
| API-PRJ-001 | List by `client_id` |
| API-PRJ-002 | Create |
| API-PRJ-003 | Update / archive |

Trips reference `project_id` optional FK.

---

# Chapter 10 — Trip APIs

Core domain. All mutations audit + `business_events`.

## API-TRIP-001 — Start Trip

POST `trips`

**Request (`startTripSchema`):**

```json
{
  "businessId": "uuid",
  "vehicleId": "uuid",
  "purpose": "Client visit — Acme Corp",
  "clientId": "uuid|null",
  "destination": "string|null",
  "startOdometer": 12345.5,
  "startLocation": { "lat", "lng" } | null,
  "startedAt": "ISO8601|null"
}
```

**Validation:**

* Purpose required 1–500 chars
* No other `status=active` trip for user → `TRIP_ALREADY_ACTIVE`
* Free tier → API-LIM-001 → `SUBSCRIPTION_LIMIT_REACHED`
* Vehicle belongs to business

**Response:** `{ trip: { id, status: "active", ... } }`

**Events:** `TripStarted` · notification optional  
**Audit:** `trip_started`  
**SCR:** SCR-019 · **FR:** FR-300

## API-TRIP-002 — End Trip

PATCH + RPC `complete_trip`

**Request (`endTripSchema`):**

```json
{
  "endOdometer": 12390.0,
  "endLocation": {},
  "notes": "",
  "checklistCompleted": ["fuel", "parking"]
}
```

**Validation:** `endOdometer >= startOdometer` else `ODOMETER_INVALID`  
**Response:** `{ trip, miles, reimbursement, expenseTotal }`  
**Events:** `TripCompleted` · AI missing-receipt check  
**SCR:** SCR-020 · **FR:** FR-302

## API-TRIP-003 — Edit Trip

PATCH. Financial field changes → audit with before/after.  
**FR:** FR-303 · **SCR:** SCR-021

## API-TRIP-004 — Delete Trip

Soft-delete `deleted_at`. 30-day undo window (client).  
**FR:** FR-304

## API-TRIP-005 — Duplicate Trip

RPC copies metadata, not expenses. **FR:** FR-305

## API-TRIP-006 — Trip Details

GET with embed: `expenses(*)`, `receipts(*)`, `trip_notes(*)`

## API-TRIP-007 — List / Search Trips

GET with filters (Ch. 28). Pagination (Ch. 27).

## API-TRIP-008 — Trip Timeline

GET `business_events?entity_id=eq.{tripId}` ordered by `created_at`.

---

# Chapter 11 — Receipt APIs

**Upload is asynchronous** — image stored first, OCR queued.

## API-RCP-001 — Upload Receipt

1. POST Storage `receipts/{userId}/{uuid}.jpg`
2. INSERT `receipts` row `status=pending`
3. Trigger API-RCP-002 async

Max size: 10 MB. MIME: jpeg, png, pdf.  
Errors: `RECEIPT_TOO_LARGE`, `RECEIPT_INVALID_TYPE`

## API-RCP-002 — OCR Process

POST `/functions/v1/process-receipt`

Request: `{ receiptId }`  
Response: `{ ocrResultId, status: "processing"|"complete"|"failed" }`  
Rate limit: 30/hour/user (Free: 10)

## API-RCP-003 — OCR Status

GET `ocr_results?receipt_id=`

## API-RCP-004 — OCR Retry

Same as 002 with `force=true`. Max 3 retries.

## API-RCP-005 — Review Receipt

PATCH confirms fields → creates/updates `expenses`. User must confirm.  
**FR:** FR-401, FR-402 · **SCR:** SCR-024

## API-RCP-006 — List / Search

GET with filters. Embeds thumbnail signed URL.

## API-RCP-007 — Link / Unlink Trip

PATCH `expenses.trip_id`

---

# Chapter 12 — Expense APIs

| API-ID | Method | Notes |
|--------|--------|-------|
| API-EXP-001 | POST | Manual expense; receipt optional |
| API-EXP-002 | PATCH | Category, amount, notes |
| API-EXP-003 | PATCH | Soft-delete |
| API-EXP-004 | GET | Group by trip, date, category |

Schema: `expenseSchema` — amount 2 decimal, positive.  
Supports expenses **with or without** receipts. **FR:** FR-600

---

# Chapter 13 — Mileage APIs

## API-MLG-001 — Current Mileage Rate

Resolution order: trip snapshot > vehicle > business > user default > IRS reference.

## API-MLG-002 — Update Mileage Rate

POST new `mileage_rates` row — versioned; does not alter completed trips.

## API-MLG-003 — Calculate Reimbursement

Client uses `packages/shared/calculations`; server RPC `verify_trip_totals` on complete.

**Rule:** Historical calculations **immutable** after trip complete.

---

# Chapter 14 — Report APIs

Long-running — async with status polling.

## API-RPT-001 — Generate Report

POST `/functions/v1/generate-report`

Request (`reportGenerateSchema`):

```json
{
  "type": "mileage"|"expense"|"combined",
  "format": "pdf"|"csv"|"xlsx",
  "dateFrom": "2026-01-01",
  "dateTo": "2026-06-30",
  "businessId": "uuid",
  "vehicleId": "uuid|null",
  "clientId": "uuid|null"
}
```

Response: `{ reportId, status: "queued" }`  
Idempotency-Key: same key returns same `reportId`.

## API-RPT-002 — Report Status

GET `reports?id=` → `{ status: queued|processing|complete|failed, progress? }`

## API-RPT-003 — Download Report

Returns signed URL when `status=complete`. TTL 15 min.

## API-RPT-004 — List Reports

GET paginated history.

## API-RPT-005 — Delete Report

Soft-delete metadata; storage cleanup async.

Formats: PDF, CSV, Excel. **FR:** FR-700 · **SCR:** SCR-031, SCR-032

---

# Chapter 15 — Dashboard APIs

Optimized read paths — prefer RPC over N+1 queries.

## API-DSH-001 — Dashboard Summary

RPC `dashboard_summary(p_business_id, p_period)`

```json
{
  "data": {
    "milesToday": 42.5,
    "milesMonth": 380.2,
    "expensesMonth": 1240.50,
    "deductionEstimate": 266.14,
    "activeTrip": { "id", "purpose", "startedAt" } | null,
    "pendingReceipts": 3
  }
}
```

Target: **< 200ms** P95. **SCR:** SCR-015 · **FR:** FR-800

## API-DSH-002 — Recent Activity

GET `business_events` limit 20.

## API-DSH-003 — AI Insights

GET `/functions/v1/ai-suggestions?businessId=`  
Returns top 3 actionable suggestions.

---

# Chapter 16 — Notification APIs

| API-ID | Operation |
|--------|-----------|
| API-NOT-001 | List paginated, filter by category |
| API-NOT-002 | PATCH `read_at` |
| API-NOT-003 | PATCH preferences JSON on profile |

Provider-agnostic schema — push tokens table future-ready.

---

# Chapter 17 — Search APIs

## API-SRH-001 — Unified Search

GET `/functions/v1/search?q=&types=trips,receipts,...&page=1`

**Response:**

```json
{
  "data": {
    "trips": [{ "id", "title", "snippet", "score" }],
    "receipts": [],
    "clients": [],
    "totalByType": {}
  },
  "meta": { "page", "pageSize", "hasNext" }
}
```

Uses `search_documents` index (Volume 4). **FR:** FR-1000 · **SCR:** SCR-043

---

# Chapter 18 — AI APIs

AI **separated from business logic** — Edge Functions only; never auto-writes financial records.

| API-ID | Function | Response metadata |
|--------|----------|-------------------|
| API-RCP-002 | OCR | `confidence`, `fields[]` |
| API-AI-001 | Category suggestion | `confidence`, `explanation` |
| API-AI-002 | Duplicate detection | `matchReceiptId`, `score` |
| API-DSH-003 | Suggestions list | `action`, `reason` |
| API-AI-003 | Feedback | `{ suggestionId, accepted: boolean }` |

All AI responses include:

```json
{
  "confidence": 0.0-1.0,
  "explanation": "Merchant name matches fuel category",
  "model": "gpt-4o",
  "processingMs": 1200
}
```

Logged to `ai_interaction_log`. Volume 5 privacy rules apply.

---

# Chapter 19 — Export APIs

| API-ID | Scope | Async |
|--------|-------|-------|
| API-EXP-010 | Full account GDPR bundle | Yes |
| API-RPT-001 | Report types | Yes |
| API-EXP-011 | Trips CSV only | Yes if > 1000 rows |
| API-EXP-012 | Expenses CSV | Yes if large |

Export notifies via email when ready (optional). **FR:** FR-1600

---

# Chapter 20 — File APIs

Never expose raw storage paths to clients.

| API-ID | Operation |
|--------|-----------|
| API-FIL-001 | Create signed upload URL OR direct upload with RLS path |
| API-FIL-002 | Get signed download URL (TTL 15 min) |
| API-FIL-003 | Replace image (new version; old retained audit period) |
| API-FIL-004 | Delete (soft; storage purge async) |

Storage path pattern: `{bucket}/{user_id}/{entity}/{id}/{filename}`  
RLS on storage buckets (Volume 8 Ch. 9).

---

# Chapter 21 — Admin APIs

Require `app_metadata.role = admin` or `support`. All actions **audited**.

| API-ID | Purpose |
|--------|---------|
| API-ADM-001 | User lookup by email/id |
| API-ADM-002 | Subscription override (read-only V1) |
| API-ADM-003 | OCR queue status |
| API-ADM-004 | Error log query |
| API-ADM-005 | Support notes CRUD |
| API-ADM-006 | Feature flags read |

Break-glass customer data access: log `support_access` with reason. Volume 8 Ch. 29.

---

# Chapter 22 — Analytics APIs

Internal only — admin auth.

| API-ID | Metrics |
|--------|---------|
| API-ANL-001 | DAU, signups, upgrades |
| API-ANL-002 | Feature adoption by FR |
| API-ANL-003 | OCR accuracy aggregates |
| API-ANL-004 | Report generation volume |

No PII in aggregate responses.

---

# Chapter 23 — Audit APIs

Append-only read for users (own data) and admins.

| API-ID | Resource |
|--------|----------|
| API-AUD-001 | GET `audit_logs?entity_id=` |
| API-AUD-002 | GET `business_events` timeline |
| API-AUD-003 | GET security events (admin) |

Users see own financial audit trail. **Volume 8 Ch. 13**

---

# Chapter 24 — Health APIs

## API-HLT-001 — Application Health

GET `/functions/v1/health`

```json
{
  "success": true,
  "data": {
    "status": "healthy"|"degraded"|"down",
    "database": "ok",
    "storage": "ok",
    "aiProvider": "ok",
    "stripe": "ok",
    "queueDepth": { "ocr": 0, "reports": 2 }
  }
}
```

Used by Netlify monitoring + SCR-055. Unauthenticated with internal key only in production.

---

# Chapter 25 — Event APIs

Domain events (internal `business_events` + future outbound webhooks):

| Event | Trigger | Payload keys |
|-------|---------|--------------|
| `TripStarted` | API-TRIP-001 | tripId, userId, businessId |
| `TripCompleted` | API-TRIP-002 | tripId, miles, reimbursement |
| `ReceiptUploaded` | API-RCP-001 | receiptId |
| `OCRCompleted` | API-RCP-002 | receiptId, ocrResultId, success |
| `ExpenseCreated` | API-EXP-001 | expenseId, tripId |
| `ReportGenerated` | API-RPT-001 | reportId, type, format |
| `SubscriptionChanged` | API-SUB-005 | plan, status |

Events enable automation, analytics, and Ch. 36 webhooks.

---

# Chapter 26 — Validation Standards

**Single source:** `packages/shared/src/schemas/` (Zod)

| Layer | Responsibility |
|-------|----------------|
| Client | UX validation — immediate feedback |
| PostgREST | CHECK constraints, FK, NOT NULL |
| RLS | Ownership, role |
| Edge Function | Business rules, limits, AI |
| RPC | Atomic multi-table operations |

Every API-ID lists its schema in the inventory. No duplicate validation logic — import shared schemas.

---

# Chapter 27 — Pagination Standards

Collection GET parameters (consistent names):

| Param | Default | Max |
|-------|---------|-----|
| `page` | 1 | — |
| `pageSize` | 20 | 100 |
| `sort` | `-created_at` | field list |
| `cursor` | — | future |

**Meta:**

```json
{
  "meta": {
    "totalItems": 142,
    "totalPages": 8,
    "currentPage": 1,
    "pageSize": 20,
    "hasNextPage": true
  }
}
```

PostgREST: `Range` headers mapped to meta at adapter.

---

# Chapter 28 — Filtering Standards

Standard query params across resources:

| Param | Type | Example |
|-------|------|---------|
| `dateFrom` | ISO date | `2026-01-01` |
| `dateTo` | ISO date | `2026-06-30` |
| `businessId` | uuid | required context |
| `vehicleId` | uuid | optional |
| `clientId` | uuid | optional |
| `categoryId` | uuid | expenses/receipts |
| `status` | enum | trip status |
| `q` | string | search term |
| `recordStatus` | enum | active, archived |

Same names on trips, expenses, receipts, reports.

---

# Chapter 29 — Error Code Registry

Stable codes — never repurpose meanings.

| Code | HTTP | Description |
|------|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Login failed |
| `AUTH_EMAIL_NOT_VERIFIED` | 403 | Verify email first |
| `AUTH_SESSION_EXPIRED` | 401 | Re-login required |
| `AUTH_EMAIL_TAKEN` | 409 | Signup duplicate |
| `AUTH_WEAK_PASSWORD` | 422 | Policy fail |
| `AUTH_TOKEN_EXPIRED` | 400 | Reset link expired |
| `PERMISSION_DENIED` | 403 | RLS or role |
| `NOT_FOUND` | 404 | Resource or hidden by RLS |
| `VALIDATION_FAILED` | 422 | Schema fail |
| `TRIP_ALREADY_ACTIVE` | 409 | One active trip |
| `ODOMETER_INVALID` | 422 | End < start |
| `ODOMETER_DECREASED` | 422 | History violation |
| `RECEIPT_TOO_LARGE` | 413 | > 10 MB |
| `RECEIPT_INVALID_TYPE` | 422 | MIME not allowed |
| `OCR_FAILED` | 422 | Processing failed |
| `OCR_RATE_LIMITED` | 429 | Too many OCR requests |
| `SUBSCRIPTION_LIMIT_REACHED` | 403 | Free tier cap |
| `REPORT_GENERATION_FAILED` | 500 | Report job failed |
| `IDEMPOTENCY_CONFLICT` | 409 | Key reused with different body |
| `RATE_LIMIT_EXCEEDED` | 429 | Generic limit |
| `INTERNAL_ERROR` | 500 | Generic — no stack trace |

Full list: `docs/api-catalog/ERROR-CODES.md` (create Phase A).

---

# Chapter 30 — Versioning Strategy

| Layer | Version |
|-------|---------|
| PostgREST | Schema migrations — additive preferred |
| Edge Functions | `/functions/v1/` → `/functions/v2/` on break |
| Shared schemas | Semver in `packages/shared` |
| Error codes | Immutable once published |

**Rules:**

* Avoid breaking changes within v1
* Deprecate with `Sunset` header + 6-month notice
* Document migration in API changelog

---

# Chapter 31 — Rate Limiting

| Category | Limit | API-IDs |
|----------|-------|---------|
| Authentication | 10/min/IP | AUTH-* |
| Receipt upload | 20/min/user | RCP-001 |
| OCR | 30/hour (Free: 10) | RCP-002 |
| AI suggestions | 60/hour | AI-*, DSH-003 |
| Report generation | 10/hour | RPT-001 |
| Search | 60/min | SRH-001 |
| General API | 300/min/user | Data API |

429 response includes `Retry-After` header. Volume 8 Ch. 12.

---

# Chapter 32 — Idempotency

`Idempotency-Key` header (UUID) on:

| API-ID | Window |
|--------|--------|
| API-RCP-001 | 24h |
| API-RCP-002 | 24h |
| API-RPT-001 | 24h |
| API-SUB-003 | 1h |
| API-TRIP-001 | 1h (offline sync) |

Store keys in `idempotency_keys` table. Replay returns original response.

---

# Chapter 33 — API Security

Every API-ID documents:

| Control | Implementation |
|---------|----------------|
| Authentication | JWT except webhooks (signatures) |
| Role | `profiles.role`, `app_metadata` |
| Ownership | RLS `auth.uid()` |
| Audit | Financial mutations logged |
| Sensitive data | No full card numbers; receipt URLs signed |
| Service role | Edge Functions only — never client |

Volume 8 is authoritative for depth. Security tests per API-ID (Volume 9 Ch. 15).

---

# Chapter 34 — API Documentation Standards

Each API-ID entry includes:

1. Description
2. Request example (JSON)
3. Response example (success)
4. Error examples (2+)
5. Required permissions
6. Related API-IDs + SCR-IDs
7. Notes (idempotency, async, webhooks)
8. Change history table

OpenAPI spec generated from Zod schemas at Phase G: `docs/api-catalog/openapi.yaml`

---

# Chapter 35 — Integration Architecture

Future integration points — **adapter pattern** in `packages/shared/src/integrations/`:

| Integration | Direction | Interface |
|-------------|-----------|-----------|
| QuickBooks / Xero | Outbound | Export adapter |
| Google Calendar | Inbound | OAuth + event sync |
| Google Maps | Outbound | Distance API |
| Dropbox / Drive | Inbound | Receipt import |
| Enterprise SSO | Inbound | SAML/OIDC provider |

Core business logic never imports vendor SDKs directly — adapters only.

---

# Chapter 36 — Webhook Framework

**Outbound** (V1.1+) — business subscribers:

| Feature | Spec |
|---------|------|
| Registration | Admin UI — URL + secret |
| Events | Ch. 25 event list |
| Signature | HMAC-SHA256 `X-Signature` |
| Retry | Exponential backoff, 5 attempts |
| Log | `webhook_deliveries` table |

**Inbound:** Stripe (API-SUB-005) only in V1.

---

# Chapter 37 — API Testing

Every API-ID requires:

| Test type | Location |
|-----------|----------|
| Schema unit | `packages/shared/src/schemas/*.test.ts` |
| RLS integration | `supabase/tests/rls/` |
| Edge Function | `supabase/functions/*/test.ts` |
| Authorization | Two-user isolation |
| Error codes | Assert code + status |
| Idempotency | Duplicate key replay |
| Performance | P95 budget per Ch. 38 |

PR convention: `API-IDs: API-TRIP-001, API-TRIP-002`

Volume 9 CI gates block merge on auth + trip API failures.

---

# Chapter 38 — API Performance Standards

| API-ID category | P95 target |
|-----------------|------------|
| Dashboard summary | < 200ms |
| List trips (20) | < 300ms |
| Trip detail + embed | < 400ms |
| Check limits | < 100ms |
| OCR process (async accept) | < 500ms to queue |
| Report generate (async accept) | < 500ms to queue |
| Search | < 500ms |

Monitor via Supabase logs + custom metrics. Load test before launch (Volume 9).

---

# Chapter 39 — API Dependency Map

```
Client (SCR-*)
    │
    ├─► Data API (PostgREST + RLS)
    │       trips · expenses · receipts · businesses · ...
    │
    └─► Service API (Edge Functions)
            │
            ├─ process-receipt ──► OpenAI Vision
            │       └─► ocr_results · ai_interaction_log
            │
            ├─ generate-report ──► PDF/CSV lib · Storage
            │       └─► reports · business_events
            │
            ├─ stripe-webhook ──► subscriptions · usage_counters
            │
            ├─ check-limits ──► usage_counters · subscriptions
            │
            ├─ ai-suggestions ──► trips · receipts · AI engine
            │
            └─ search ──► search_documents

Trip Service (API-TRIP-*)
    → Mileage Service (API-MLG-*)
    → Audit Service (API-AUD-*)
    → Notification Service (API-NOT-*)
    → AI Suggestion Service (API-DSH-003)
```

No circular dependencies. Shared calculations in `packages/shared` only.

---

# Chapter 40 — Version 1 API Inventory

Master checklist — update in [`API-INDEX.md`](../api-catalog/API-INDEX.md).

| API-ID | Route | Method | Module | Auth | Status | Tests | Docs |
|--------|-------|--------|--------|------|--------|-------|------|
| API-AUTH-002 | auth.signIn | POST | auth | anon | ☐ | ☐ | ☑ |
| API-TRIP-001 | trips | POST | trips | user | ☐ | ☐ | ☑ |
| API-TRIP-002 | complete_trip | PATCH | trips | user | ☐ | ☐ | ☑ |
| API-RCP-002 | process-receipt | POST | receipts | user | ☐ | ☐ | ☑ |
| API-RPT-001 | generate-report | POST | reports | user | ☐ | ☐ | ☑ |
| API-SUB-005 | stripe-webhook | POST | billing | stripe | ☐ | ☐ | ☑ |
| API-DSH-001 | dashboard_summary | GET | dashboard | user | ☐ | ☐ | ☑ |

---

# Chapter 41 — API Non-Negotiables

| # | Rule |
|---|------|
| 1 | Never expose sensitive data unnecessarily |
| 2 | Never bypass authorization (RLS + service checks) |
| 3 | Never change response formats without versioning |
| 4 | Never silently alter financial records |
| 5 | Never duplicate business logic across endpoints |
| 6 | Never leave endpoints undocumented |
| 7 | Never deploy untested APIs to production |
| 8 | Never return stack traces to clients |
| 9 | Never store secrets in client-accessible responses |
| 10 | Never let AI APIs write financial data without user confirm API |

---

# Chapter 42 — The API Constitution

> **If the frontend disappeared tomorrow, another team should be able to build a web app, mobile app, desktop app, or third-party integration using only this API specification and produce the same product behavior.**

That is the standard for a mature, production-grade API.

The API is a **stable product in its own right** — not merely a backend implementation detail.

---

## Cross-Reference Index

| Volume | Uses API-IDs in… |
|--------|------------------|
| Volume 3 | FR acceptance → API mapping |
| Volume 11 | SCR screens → API calls |
| Volume 9 | Integration + E2E tests |
| Volume 8 | Rate limits, auth, audit |
| Volume 6 | Edge Function names, file paths |

---

## Document Map

| Need | Go to |
|------|-------|
| Entity shapes | [Volume 4](04-database-architecture.md) |
| Zod schemas | [Volume 6 Ch. 24](06-technical-architecture.md) |
| Screen → API | [Volume 11](11-screen-bible.md) |
| API tracker | [API-INDEX.md](../api-catalog/API-INDEX.md) |
| Error codes | [ERROR-CODES.md](../api-catalog/ERROR-CODES.md) |

---

*Previous: [Volume 11 — Complete Screen Bible](11-screen-bible.md) | Next: [Volume 13 — State Machines](13-state-machines.md)*
