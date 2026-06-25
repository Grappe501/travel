# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 4 — Data Architecture & Database Master Blueprint

**Version 1.0**

**Platform:** Supabase · PostgreSQL 15+ · Row Level Security on all `public` tables

---

## Who This Document Is For

Volume 4 defines **the data**. If Volumes 0–3 define vision, experience, and behavior, this volume makes backend development predictable.

| Role | Use this document to… |
|------|----------------------|
| **Backend engineers** | Write migrations, RLS policies, triggers, and functions |
| **Frontend engineers** | Know entity shapes, FK relationships, and denormalization rules |
| **QA** | Validate data integrity, soft-delete, and audit requirements |
| **Security** | Apply encryption, RLS, and retention policies |
| **Product** | Understand what is stored, for how long, and why |

**Related:** [Volume 3 — Functional Requirements](03-functional-requirements.md) · [Volume 5 — AI Design](05-ai-design.md) · [Volume 8 — Security](08-security.md)

---

## Guiding Principle

> **Every piece of data should exist only once, have a single source of truth, be fully auditable, and remain extensible without breaking future versions.**

---

# Chapter 1 — Data Philosophy

Every persistent entity in the system follows **base entity conventions**:

| Convention | Rule |
|------------|------|
| **Primary key** | UUID v4 (`gen_random_uuid()`) — never sequential integers exposed to clients |
| **Timestamps** | `created_at`, `updated_at` (timestamptz, UTC) — `updated_at` via trigger |
| **Ownership** | `user_id` FK → `auth.users` on all user-owned rows (directly or via business) |
| **Soft delete** | `deleted_at` timestamptz NULL = active; never hard-delete financial rows in V1 UI |
| **Lifecycle status** | `record_status` enum where needed: `active`, `archived`, `deleted` |
| **Audit** | Financial mutations → `audit_logs` + `business_events` |
| **Schema version** | `schema_version` on export bundles; migrations numbered in repo |
| **Row version** | `version` int DEFAULT 1 — increment on update for optimistic concurrency (V1.1) |

**Single source of truth examples:**

| Fact | Source of truth | Never duplicate as authoritative |
|------|-----------------|----------------------------------|
| Trip mileage | `trips.miles` after FR-302 completion | Dashboard aggregates derive |
| Receipt image | Supabase Storage path in `receipts.storage_path` | Not inline in Postgres |
| Applied mileage rate | `trips.mileage_rate` snapshot | Do not re-read live rate for past trips |
| OCR extraction | `ocr_results` | User-confirmed values live on `expenses` |

Design for **years of growth** — index strategy, partitioning hooks, and search separation from day one.

---

# Chapter 2 — Core Entity Relationship Map

```
auth.users
 └── profiles (1:1)
      ├── subscriptions (1:1)
      │      └── usage_counters (1:n per month)
      ├── businesses (1:n)
      │      ├── employees (1:n)          [V1.1 Business tier]
      │      ├── vehicles (1:n)
      │      │      └── vehicle_odometer_history (1:n)
      │      ├── clients (1:n)
      │      │      └── projects (1:n)
      │      ├── mileage_rates (1:n)      [custom/versioned]
      │      ├── trips (1:n)
      │      │      ├── trip_notes (1:n)
      │      │      ├── expenses (1:n)
      │      │      │      └── receipts (0:1 optional link)
      │      │      └── gps_points (1:n)  [future]
      │      └── reports (1:n)
      ├── receipts (1:n)                  [may exist unassigned]
      ├── notifications (1:n)
      ├── audit_logs (1:n)
      ├── ai_suggestions (1:n)
      └── business_events (1:n)           [event ledger]

Global reference (read-only):
 └── mileage_rates_reference (IRS seeds)

AI (separate from user-entered truth):
 ├── ocr_results (1:1 receipts)
 └── ai_suggestions

Search (derived):
 └── search_documents (materialized / trigger-maintained)

Files (object storage metadata in DB, bytes in Storage):
 └── buckets: receipts, exports, logos, avatars
```

### Relationship Rules

| From | To | Cardinality | On delete |
|------|-----|-------------|-----------|
| profiles | businesses | 1:n | Restrict if trips exist |
| businesses | trips | 1:n | Soft-delete business; trips retain FK |
| trips | expenses | 1:n | Soft-delete trip; expenses unlinked or cascade soft |
| expenses | receipts | n:1 optional | Receipt retained if expense deleted |
| trips | clients | n:1 optional | SET NULL on client delete |
| trips | projects | n:1 optional | SET NULL |
| receipts | ocr_results | 1:1 | Cascade delete OCR with receipt purge |

---

# Chapter 3 — User Tables

## Purpose

Authenticated account and application profile. **Password hash lives in Supabase `auth.users` only** — never duplicated in `public`.

## `auth.users` (Supabase managed)

| Field | Notes |
|-------|-------|
| id | UUID PK |
| email | Unique |
| encrypted_password | Managed by Supabase Auth |
| email_confirmed_at | Verification |
| last_sign_in_at | Last login |
| raw_app_meta_data | Server-only roles (never for RLS — Volume 8) |

## `profiles` (extends auth)

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | FK → auth.users.id ON DELETE CASCADE |
| email | text | | Denormalized for queries |
| display_name | text | ✓ | Full display |
| first_name | text | ✓ | |
| last_name | text | ✓ | |
| phone | text | ✓ | E.164 optional |
| timezone | text | | IANA, default `UTC` |
| language | char(5) | | BCP 47, default `en-US` |
| country | char(2) | ✓ | ISO 3166-1 |
| avatar_url | text | ✓ | Storage path |
| currency | char(3) | | Default `USD` |
| tax_year | int | | Default current year |
| mileage_rate_type | enum | | `irs`, `company`, `custom` |
| custom_mileage_rate | decimal(6,4) | ✓ | |
| dark_mode | enum | | `system`, `light`, `dark` |
| subscription_id | uuid | ✓ | FK → subscriptions.id |
| account_status | enum | | `active`, `suspended`, `pending_deletion`, `deleted` |
| email_verified | boolean | | Sync from auth |
| two_factor_enabled | boolean | | Default false; future-ready |
| onboarding_completed | boolean | | |
| last_login_at | timestamptz | ✓ | |
| deleted_at | timestamptz | ✓ | Soft delete |
| version | int | | Default 1 |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**Indexes:** `(email)` WHERE deleted_at IS NULL  
**RLS:** `id = auth.uid()`  
**Audit:** profile updates (email, status)  
**Volume:** 1 row per user — low

---

# Chapter 4 — Subscription Tables

## Purpose

Decouple plan logic from application code (FR-003). Stripe is billing source of truth; DB mirrors for fast gating.

## `subscriptions`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid UNIQUE | | FK → profiles |
| plan | enum | | `free`, `pro`, `small_business`, `enterprise` |
| billing_cycle | enum | ✓ | `monthly`, `annual`, null for free |
| status | enum | | `active`, `trialing`, `past_due`, `canceled`, `incomplete` |
| stripe_customer_id | text | ✓ | |
| stripe_subscription_id | text | ✓ | |
| trial_ends_at | timestamptz | ✓ | |
| current_period_start | timestamptz | ✓ | |
| current_period_end | timestamptz | ✓ | Renewal date |
| canceled_at | timestamptz | ✓ | |
| feature_flags | jsonb | | Plan overrides, e.g. `{"csv_export": true}` |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**RLS:** SELECT own row; INSERT/UPDATE service role (Stripe webhook) only  
**Audit:** plan changes → business_events

## `usage_counters`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| period_month | date | First day of month (user TZ normalized on write) |
| trips_count | int | Default 0 |
| receipts_count | int | Default 0 |
| ocr_count | int | Default 0 |

**Unique:** `(user_id, period_month)`  
**RLS:** `user_id = auth.uid()` SELECT; increment via security definer function

---

# Chapter 5 — Business Table

## `businesses`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | Owner FK |
| name | text | | Business name |
| logo_storage_path | text | ✓ | Storage metadata |
| tax_id | text | ✓ | Encrypt app-layer V1.1 |
| address | jsonb | ✓ | Structured address |
| phone | text | ✓ | |
| website | text | ✓ | |
| currency | char(3) | | Default USD |
| default_mileage_rate | decimal(6,4) | ✓ | Overrides profile default |
| timezone | text | ✓ | Business-level TZ |
| is_default | boolean | | One per user |
| record_status | enum | | `active`, `archived`, `deleted` |
| deleted_at | timestamptz | ✓ | |
| version | int | | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**Validation:** name 1–100 chars (FR-100)  
**Index:** `(user_id)` WHERE deleted_at IS NULL  
**RLS:** `user_id = auth.uid()`  
**Expected volume:** 1–5 per Pro user; 1 per Free user

---

# Chapter 6 — Employee Table

## Purpose

Business tier team management (V1.1). **Table created in V1 migration; unused until Business tier.**

## `employees`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| business_id | uuid | | FK |
| user_id | uuid | ✓ | FK → profiles when invite accepted |
| invite_email | text | ✓ | Pending invite |
| role | enum | | `owner`, `admin`, `employee` |
| status | enum | | `pending`, `active`, `suspended`, `removed` |
| can_approve_reimbursement | boolean | | |
| joined_at | timestamptz | ✓ | |
| assigned_vehicle_ids | uuid[] | ✓ | |
| assigned_project_ids | uuid[] | ✓ | |
| record_status | enum | | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**RLS:** business owner/admin manage; employee read self  
**FK cascade:** soft-remove only

---

# Chapter 7 — Vehicle Tables

## `vehicles`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | Owner |
| business_id | uuid | ✓ | FK |
| nickname | text | | Display name |
| make | text | ✓ | |
| model | text | ✓ | |
| year | int | ✓ | |
| vin | text | ✓ | Optional |
| license_plate | text | ✓ | |
| fuel_type | enum | ✓ | `gas`, `diesel`, `electric`, `hybrid`, `other` |
| current_odometer | decimal(10,1) | ✓ | Updated on trip complete |
| default_mileage_rate | decimal(6,4) | ✓ | |
| is_default | boolean | | |
| record_status | enum | | `active`, `archived`, `deleted` |
| deleted_at | timestamptz | ✓ | |
| version | int | | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

## `vehicle_odometer_history`

Preserves odometer changes over time — never infer from trips alone.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| vehicle_id | uuid FK | |
| odometer_reading | decimal(10,1) | |
| source | enum | `trip_end`, `manual_edit`, `initial` |
| trip_id | uuid | ✓ FK |
| recorded_at | timestamptz | |
| recorded_by | uuid | FK → profiles |

**Trigger:** insert row on trip complete (FR-302) and manual vehicle edit  
**Index:** `(vehicle_id, recorded_at DESC)`

---

# Chapter 8 — Client Table

## Purpose

Structured clients replace free-text-only on trips (FR-1000 search). Trips retain denormalized `client_name` snapshot.

## `clients`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | Owner |
| business_id | uuid | ✓ | Scope |
| name | text | | |
| address | jsonb | ✓ | |
| phone | text | ✓ | |
| email | text | ✓ | |
| notes | text | ✓ | |
| default_reimbursement_rules | jsonb | ✓ | Future billing hints |
| record_status | enum | | |
| deleted_at | timestamptz | ✓ | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**Index:** `(user_id, name)` trigram for autocomplete  
**V1:** Trips may use `client_id` OR legacy `client_name` text during transition

---

# Chapter 9 — Project Table

## Purpose

Group trips under client engagements (FR-700 client reports).

## `projects`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | |
| business_id | uuid | | |
| client_id | uuid | ✓ | FK → clients |
| name | text | | |
| status | enum | | `active`, `completed`, `archived` |
| budget | decimal(12,2) | ✓ | Optional |
| notes | text | ✓ | |
| tags | text[] | ✓ | |
| record_status | enum | | |
| deleted_at | timestamptz | ✓ | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**Index:** `(client_id)`, `(business_id, status)`

---

# Chapter 10 — Trip Table

## Purpose

Core entity (FR-300–305). Historical mileage rates **never overwritten** — `mileage_rate` snapshotted at completion.

## `trips`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | Owner |
| business_id | uuid | | FK |
| vehicle_id | uuid | | FK |
| client_id | uuid | ✓ | FK → clients |
| project_id | uuid | ✓ | FK → projects |
| client_name | text | ✓ | Denormalized snapshot |
| project_name | text | ✓ | Denormalized snapshot |
| status | enum | | `draft`, `active`, `completed`, `deleted` |
| purpose | text | | Required |
| destination | text | ✓ | |
| start_location | text | ✓ | |
| end_location | text | ✓ | |
| start_lat | decimal(10,7) | ✓ | |
| start_lng | decimal(10,7) | ✓ | |
| end_lat | decimal(10,7) | ✓ | |
| end_lng | decimal(10,7) | ✓ | |
| start_odometer | decimal(10,1) | ✓ | |
| end_odometer | decimal(10,1) | ✓ | |
| miles | decimal(10,1) | ✓ | Set on complete (FR-500) |
| mileage_rate | decimal(6,4) | ✓ | **Snapshot** at completion |
| mileage_rate_source | enum | ✓ | `irs`, `company`, `custom`, `vehicle`, `business` |
| reimbursement_amount | decimal(10,2) | ✓ | |
| expense_total | decimal(10,2) | ✓ | Maintained by trigger |
| grand_total | decimal(10,2) | ✓ | |
| notes | text | ✓ | Summary notes |
| checklist_responses | jsonb | ✓ | End-trip checklist |
| reimbursement_status | enum | | `none`, `pending`, `submitted`, `paid` |
| invoice_status | enum | | `none`, `sent`, `paid` |
| started_at | timestamptz | ✓ | |
| ended_at | timestamptz | ✓ | |
| record_status | enum | | |
| deleted_at | timestamptz | ✓ | |
| version | int | | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

## `trip_notes`

Separate quick notes during active trip (FR-301).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| trip_id | uuid FK | |
| user_id | uuid FK | |
| body | text | |
| created_at | timestamptz | |

**Indexes:**
- `(user_id, status)` WHERE deleted_at IS NULL
- `(user_id, ended_at DESC NULLS LAST)`
- `(business_id, started_at DESC)`
- `(client_id)` WHERE client_id IS NOT NULL
- GIN trigram on `(purpose, client_name, destination, notes)`

**Triggers:** `compute_trip_totals`, `log_audit_trail`, `emit_business_event`, `sync_search_document`

---

# Chapter 11 — Receipt Table

## Purpose

Image metadata in DB; bytes in Storage (FR-400). OCR lives separately (Chapter 18).

## `receipts`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | |
| business_id | uuid | ✓ | |
| trip_id | uuid | ✓ | Nullable until associated |
| storage_path | text | | Original image |
| processed_storage_path | text | ✓ | Optimized/thumbnail |
| thumbnail_path | text | ✓ | List view |
| file_hash | text | | SHA-256 duplicate detection |
| file_size_bytes | int | | |
| mime_type | text | | |
| merchant | text | ✓ | User-confirmed or OCR |
| receipt_date | date | ✓ | |
| receipt_time | time | ✓ | |
| subtotal | decimal(10,2) | ✓ | |
| tax | decimal(10,2) | ✓ | |
| total | decimal(10,2) | ✓ | |
| currency | char(3) | | Default USD |
| ocr_confidence | decimal(3,2) | ✓ | Overall score |
| upload_status | enum | | `pending`, `processing`, `ready`, `failed` |
| review_status | enum | | `pending`, `confirmed`, `rejected` |
| idempotency_key | uuid | ✓ | Client UUID |
| record_status | enum | | |
| deleted_at | timestamptz | ✓ | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**Index:** `(user_id, file_hash)` WHERE deleted_at IS NULL  
**Unique:** `(user_id, idempotency_key)` WHERE idempotency_key IS NOT NULL

---

# Chapter 12 — Expense Table

## Purpose

Business cost line items (FR-600). **Separate from receipts** — manual expenses allowed without receipt.

## `expenses`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | |
| business_id | uuid | | |
| trip_id | uuid | ✓ | Unassigned allowed |
| category_id | uuid | | FK |
| receipt_id | uuid | ✓ | Optional link |
| merchant | text | ✓ | Vendor |
| amount | decimal(10,2) | | |
| tax_amount | decimal(10,2) | ✓ | |
| currency | char(3) | | |
| expense_date | date | | |
| payment_method | text | ✓ | |
| notes | text | ✓ | |
| record_status | enum | | |
| deleted_at | timestamptz | ✓ | |
| version | int | | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**Trigger:** update `trips.expense_total` on insert/update/delete  
**Index:** `(trip_id)`, `(user_id, expense_date DESC)`, `(category_id)`

---

# Chapter 13 — Expense Category Table

## `expense_categories`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | ✓ | NULL = system |
| business_id | uuid | ✓ | |
| name | text | | |
| slug | text | | `fuel`, `parking`, etc. |
| icon | text | ✓ | |
| color | text | ✓ | Hex |
| tax_behavior | jsonb | ✓ | Report mapping defaults |
| is_deductible | boolean | | Informational |
| sort_order | int | | |
| record_status | enum | | |
| is_system | boolean | | Cannot delete |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**Seed (FR-610):** fuel, parking, toll, meal, hotel, airfare, supplies, equipment, other  
**Unique:** `(business_id, slug)` for custom; system slugs global

---

# Chapter 14 — Mileage Rate Tables

## Versioned custom rates (FR-501)

## `mileage_rates`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | ✓ | |
| business_id | uuid | ✓ | |
| name | text | | e.g. "2026 Company Rate" |
| rate | decimal(6,4) | | |
| source | enum | | `irs`, `company`, `custom` |
| effective_from | date | | |
| effective_to | date | ✓ | NULL = open-ended |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

**Rule:** Trips store snapshotted rate — this table drives **future** trip resolution only.

## `mileage_rates_reference` (IRS global read-only)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| tax_year | int | |
| rate | decimal(6,4) | |
| effective_from | date | |
| effective_to | date | |
| source | text | IRS notice ref |

**RLS:** SELECT authenticated; no user writes

---

# Chapter 15 — Report Table

## `reports`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | Generated by |
| business_id | uuid | ✓ | |
| report_type | enum | | FR-700 types |
| date_range_start | date | | |
| date_range_end | date | | |
| format | enum | | `pdf`, `csv`, `xlsx` |
| filters | jsonb | | Full filter snapshot |
| storage_path | text | | |
| file_hash | sha256 | ✓ | Integrity |
| file_size_bytes | int | ✓ | |
| status | enum | | `pending`, `ready`, `failed`, `expired` |
| error_message | text | ✓ | |
| generated_at | timestamptz | | |
| expires_at | timestamptz | | Default +7 days |
| created_at | timestamptz | | |

**Index:** `(user_id, generated_at DESC)`

---

# Chapter 16 — Notification Table

## `notifications`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | |
| type | text | | FR-900 types |
| title | text | | |
| body | text | | |
| payload | jsonb | ✓ | Deep link, entity refs |
| delivery_method | enum | | `in_app`, `email`, `push` |
| scheduled_at | timestamptz | ✓ | |
| delivered_at | timestamptz | ✓ | |
| read_at | timestamptz | ✓ | |
| created_at | timestamptz | | |

**Index:** `(user_id, read_at NULLS FIRST, created_at DESC)`

---

# Chapter 17 — Audit Log

## Purpose

Financial and security troubleshooting; compliance foundation (FR-303, Volume 8).

## `audit_logs`

| Column | Type | Null | Notes |
|--------|------|------|-------|
| id | uuid PK | | |
| user_id | uuid | | Actor |
| entity_type | text | | `trip`, `expense`, `receipt`, … |
| entity_id | uuid | | |
| action | enum | | `create`, `update`, `delete`, `restore` |
| old_values | jsonb | ✓ | Financial fields only on update |
| new_values | jsonb | ✓ | |
| ip_address | inet | ✓ | Where appropriate |
| user_agent | text | ✓ | |
| source | enum | | `web`, `mobile`, `api`, `system` |
| created_at | timestamptz | | Immutable |

**Rules:** append-only — no UPDATE/DELETE on audit rows  
**Retention:** 2 years default (Chapter 22)  
**Index:** `(entity_type, entity_id)`, `(user_id, created_at DESC)`

---

# Chapter 18 — AI Tables

**AI-generated data is never the sole source of truth for user financial records.**

## `ocr_results`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| receipt_id | uuid UNIQUE FK | |
| raw_response | jsonb | Redacted provider response |
| bounding_boxes | jsonb | ✓ Future field locations |
| merchant | text | ✓ |
| receipt_date | date | ✓ |
| receipt_time | time | ✓ |
| subtotal | decimal(10,2) | ✓ |
| tax | decimal(10,2) | ✓ |
| total | decimal(10,2) | ✓ |
| payment_method | text | ✓ |
| suggested_category_id | uuid | ✓ |
| confidence_scores | jsonb | Per-field 0–1 |
| processing_engine | text | e.g. `gpt-4o-vision` |
| model_version | text | Prompt version |
| processed_at | timestamptz | |

## `ai_suggestions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| suggestion_type | enum | `duplicate_receipt`, `missing_receipt`, `category`, `trip_association`, `anomaly` |
| entity_type | text | |
| entity_id | uuid | |
| suggested_value | jsonb | |
| message | text | |
| status | enum | `pending`, `accepted`, `rejected`, `dismissed` |
| created_at | timestamptz | |
| resolved_at | timestamptz | ✓ |

**Rule:** Accepting suggestion writes to `expenses`/`trips` via normal FR paths — never direct silent UPDATE from AI job.

---

# Chapter 19 — File Storage Architecture

Database stores **metadata only**. Files in Supabase Storage with RLS.

| Bucket | Contents | Path pattern | Sizes |
|--------|----------|--------------|-------|
| `receipts` | Original + processed receipt images | `{user_id}/{receipt_id}/original.jpg` | Original ≤10MB; thumb 200px |
| `exports` | Generated PDF/CSV/xlsx | `{user_id}/{report_id}.{ext}` | TTL 7 days |
| `logos` | Business logos | `{user_id}/{business_id}/logo.png` | Max 2MB |
| `avatars` | Profile photos | `{user_id}/avatar.jpg` | Max 1MB |

**Policies:** folder name[1] = `auth.uid()`  
**Signed URLs:** 60s TTL for client display  
**Virus scan:** optional ClamAV edge hook V1.1  
**Never** store file bytes in Postgres BYTEA for receipts at scale

---

# Chapter 20 — Search Index

Transactional tables optimized for writes; search optimized for reads (FR-1000).

## `search_documents`

Denormalized search rows — maintained by triggers on trips, expenses, receipts, clients, vehicles.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid | |
| entity_type | enum | `trip`, `expense`, `receipt`, `client`, `vehicle` |
| entity_id | uuid | |
| business_id | uuid | ✓ |
| search_text | tsvector | Weighted full-text |
| merchant | text | ✓ |
| client_name | text | ✓ |
| project_name | text | ✓ |
| purpose | text | ✓ |
| notes | text | ✓ |
| category_slug | text | ✓ |
| vehicle_nickname | text | ✓ |
| amount | decimal(10,2) | ✓ |
| document_date | date | ✓ |
| updated_at | timestamptz | |

**Index:** GIN on `search_text`; B-tree on `(user_id, document_date DESC)`  
**Query:** `plainto_tsquery` + trigram fallback for merchant  
**Target:** P95 < 500ms at 100K documents per user (partition by user_id if needed V2)

---

# Chapter 21 — Soft Delete Strategy

Three lifecycle states — never immediate hard-delete from user UI.

| State | `record_status` | `deleted_at` | Visible in UI |
|-------|-----------------|--------------|---------------|
| **Active** | `active` | NULL | Yes |
| **Archived** | `archived` | NULL | History only; hidden from pickers |
| **Deleted** | `deleted` | timestamp | Hidden; recoverable 30 days |

**Rules:**

* Financial records: soft-delete only in V1
* Hard purge via scheduled job after retention window
* Reports remain valid — deleted trips show as "[Deleted trip]" in historical exports if referenced
* FK: prefer soft-delete over ON DELETE CASCADE for trips/expenses

**Restore:** clear `deleted_at`, set `record_status = active`, emit `RecordRestored` event

---

# Chapter 22 — Data Retention

| Data type | Retention | User purge | System purge |
|-----------|-----------|------------|--------------|
| Trips, expenses | Until user deletes | Soft → hard after 30d | Account deletion |
| Receipt images | Same as expense/trip | With parent or standalone | Storage wipe on purge |
| Reports (files) | 7 days default | On demand | `expires_at` job |
| Audit logs | 2 years | Anonymize on account delete | Archive to cold storage V2 |
| Business events | 2 years | Anonymize | Same as audit |
| OCR raw_response | 1 year | With receipt | Redact PII, keep metrics |
| AI suggestions dismissed | 90 days | — | Auto-delete |
| Temp uploads | 24 hours | — | Cron cleanup |
| Usage counters | 24 months | Export then delete | Billing disputes |

**Account deletion (FR-1701):** 30-day grace → purge all user rows + Storage prefixes + anonymize audit/events (retain aggregate stats only).

---

# Chapter 23 — Backup & Recovery

| Item | Specification |
|------|---------------|
| **Provider** | Supabase automated backups (Pro plan required for production) |
| **Frequency** | Daily full; PITR if enabled on Pro |
| **Encryption** | AES-256 at rest (Supabase); TLS in transit |
| **Geography** | Match primary region; document in runbook |
| **RPO** | 24 hours (daily) or ≤1 hour with PITR |
| **RTO** | 4 hours target |
| **Restore testing** | Quarterly staging restore drill |
| **Migration rollback** | Forward-only migrations; companion `down` scripts in repo for emergencies |

**Runbook:** `docs/runbooks/disaster-recovery.md` (create at Phase B)

---

# Chapter 24 — Future-Proofing

Extension points reserved without V1 implementation:

| Extension | Schema hook |
|-----------|-------------|
| Accounting integrations | `integrations` table: `provider`, `external_id`, `entity_type`, `last_sync` |
| Banking | `bank_transactions` stub FK optional on expenses |
| GPS history | `gps_points(trip_id, lat, lng, recorded_at, accuracy)` |
| Calendar sync | `calendar_events` linked to trips |
| Fleet management | `employees.assigned_vehicle_ids`, vehicle groups |
| Corporate policy | `policy_rules` jsonb on businesses |
| Multi-currency | `amount_usd` generated column + `exchange_rate` on expenses |
| International tax | `tax_behavior` jsonb on categories |

**Rule:** Add tables via migration — never overload `trips.notes` with structured integration data.

---

# Chapter 25 — Data Governance Standards

Every table must document this metadata before first migration merges. Template:

```
Table: {name}
Purpose: {one sentence}
Owner: {team / domain}
Required fields: {list}
Nullable fields: {list}
Validation: {FR refs}
Indexes: {list + rationale}
Foreign keys: {list + ON DELETE behavior}
Soft delete: {yes/no + field}
Audit required: {yes/no + fields}
Encryption: {columns}
Expected volume @ 12mo: {order of magnitude}
```

### Governance Summary (V1 tables)

| Table | Owner | Audit | Encrypt | Volume/user/yr |
|-------|-------|-------|---------|----------------|
| profiles | Auth | status changes | phone optional | 1 |
| subscriptions | Billing | plan changes | stripe ids | 1 |
| businesses | Core | updates | tax_id V1.1 | 1–5 |
| vehicles | Core | odometer | — | 1–10 |
| trips | Core | all financial | — | 200–2000 |
| expenses | Core | amount, category | — | 500–5000 |
| receipts | Core | upload | — | 500–5000 |
| ocr_results | AI | — | raw redacted | = receipts |
| audit_logs | Platform | N/A append | — | 2–20K |
| business_events | Platform | N/A append | — | 5–50K |
| search_documents | Search | — | — | = trips+expenses |

---

# Chapter 26 — Business Event Ledger

Append-only **event stream** complementing state tables and audit logs. Powers activity feeds, analytics, debugging, and future AI (Volume 1 five-year vision).

## Purpose

Record **what happened**, not just **current state**.

## `business_events`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid | Actor / subject |
| business_id | uuid | ✓ Context |
| event_type | text | See catalog below |
| entity_type | text | ✓ |
| entity_id | uuid | ✓ |
| payload | jsonb | Event-specific data (no receipt bytes) |
| correlation_id | uuid | ✓ Groups related events (e.g. sync batch) |
| occurred_at | timestamptz | Event time |
| created_at | timestamptz | Insert time |

**Immutable:** no UPDATE/DELETE  
**Index:** `(user_id, occurred_at DESC)`, `(entity_type, entity_id)`, `(event_type, occurred_at DESC)`

### Event Catalog (V1)

| event_type | Trigger | payload example |
|------------|---------|-----------------|
| `trip.started` | FR-300 | `{trip_id, vehicle_id, purpose}` |
| `trip.ended` | FR-302 | `{trip_id, miles, reimbursement}` |
| `trip.updated` | FR-303 | `{changed_fields[]}` |
| `trip.deleted` | FR-304 | `{trip_id, soft: true}` |
| `receipt.uploaded` | FR-400 | `{receipt_id, trip_id?}` |
| `receipt.ocr_completed` | FR-401 | `{receipt_id, confidence}` |
| `receipt.ocr_failed` | FR-401 | `{receipt_id, error_code}` |
| `expense.created` | FR-600 | `{expense_id, amount, category}` |
| `report.generated` | FR-700 | `{report_id, type, format}` |
| `subscription.upgraded` | FR-003 | `{from_plan, to_plan}` |
| `mileage_rate.changed` | FR-501 | `{rate_id, effective_from}` |
| `sync.completed` | FR-1500 | `{items_synced, conflicts}` |
| `sync.conflict_detected` | FR-1500 | `{entity_type, entity_id}` |

### Consumers

| Consumer | Use |
|----------|-----|
| Dashboard recent activity | Last N events |
| Support debugging | Timeline by user_id |
| Analytics | Aggregates by event_type |
| Future AI | Pattern detection on event sequences |
| Integrations | Webhook fan-out V2 |

**Difference from `audit_logs`:** audit = financial field before/after; events = domain occurrences readable by product features.

---

# Row Level Security (RLS)

**Mandatory** on every `public` table (Supabase Volume 8).

| Pattern | Policy |
|---------|--------|
| User-owned rows | `user_id = auth.uid()` FOR ALL |
| Business-scoped (V1.1) | `business_id IN (SELECT … team membership)` |
| Reference data | SELECT authenticated only |
| subscriptions write | Service role only |
| audit_logs / business_events INSERT | Authenticated + service role; no user DELETE |
| search_documents | `user_id = auth.uid()` SELECT |

**Views:** `security_invoker = true` (Postgres 15+)  
**UPDATE requires SELECT policy** — verify both exist per table

---

# Database Functions & Triggers

| Function / Trigger | Purpose |
|--------------------|---------|
| `set_updated_at()` | Trigger on all tables with `updated_at` |
| `compute_trip_totals(trip_id)` | FR-302 totals |
| `increment_usage_counter(user_id, type)` | FR-003 atomic |
| `check_tier_limit(user_id, action)` | Returns allowed + remaining |
| `update_vehicle_odometer()` | Trip complete → vehicle + history |
| `log_audit_trail()` | Financial column changes |
| `emit_business_event()` | Chapter 26 catalog |
| `sync_search_document()` | Maintain search_documents |
| `soft_delete_entity()` | Standardize lifecycle |

All `security definer` functions in `private` schema — not exposed via API.

---

# Migration Strategy

1. Files in `supabase/migrations/` — create via `supabase migration new {name}`
2. Never edit applied migrations
3. Phase B order matches Volume 3 Chapter 21: auth → business → vehicle → categories → rates → trips → receipts → expenses → reports → events/search
4. Seed data: categories, IRS rates, system config
5. Local test on H: before production apply
6. Post-migration: run Supabase security advisors

---

# FR ↔ Table Mapping (Quick Reference)

| FR | Primary tables |
|----|----------------|
| FR-001/002 | auth.users, profiles |
| FR-003 | subscriptions, usage_counters |
| FR-100 | businesses |
| FR-200 | vehicles, vehicle_odometer_history |
| FR-300–305 | trips, trip_notes |
| FR-400–403 | receipts, ocr_results |
| FR-600 | expenses |
| FR-610 | expense_categories |
| FR-501 | mileage_rates, mileage_rates_reference |
| FR-700 | reports |
| FR-800 | trips, expenses (aggregates) |
| FR-900 | notifications |
| FR-1000 | search_documents |
| FR-1300 | ocr_results, ai_suggestions |
| FR-1500 | business_events (sync.*) |
| FR-1600 | reports + Storage exports |

---

## Document Map

| Need | Go to |
|------|-------|
| Behavior rules | [Volume 3](03-functional-requirements.md) |
| OCR detail | [Volume 5 — AI & Intelligence Architecture](05-ai-design.md) |
| RLS security | [Volume 8](08-security.md) |
| Migrations path | [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md) |

---

*Previous: [Volume 3 — Functional Requirements & Business Logic](03-functional-requirements.md) | Next: [Volume 5 — AI & Intelligence Architecture](05-ai-design.md)*
