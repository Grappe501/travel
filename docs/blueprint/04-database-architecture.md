# Volume 4 — Database Architecture

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

**Platform:** Supabase (PostgreSQL 15+) · Row Level Security on all public tables

---

## Entity Relationship Overview

```
users (auth.users extended via profiles)
  ├── businesses
  ├── vehicles
  ├── subscriptions
  ├── trips
  │     ├── expenses
  │     │     └── receipts (optional 1:1 or 1:many)
  │     └── ocr_results (via receipts)
  ├── expense_categories
  ├── mileage_rates (reference + user overrides)
  ├── reports (generated report metadata)
  ├── notifications
  └── audit_logs
```

---

## Tables

### `profiles`

Extends `auth.users`.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | FK → auth.users.id |
| email | text | Denormalized for queries |
| full_name | text | |
| avatar_url | text | Supabase Storage |
| timezone | text | IANA, default UTC |
| currency | char(3) | Default USD |
| tax_year | int | Default current year |
| mileage_rate_type | enum | irs, company, custom |
| custom_mileage_rate | decimal(6,4) | When type=custom |
| dark_mode | enum | system, light, dark |
| onboarding_completed | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

### `businesses`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | Owner |
| name | text NOT NULL | |
| ein | text | Optional, encrypted at app layer |
| address | jsonb | Optional |
| is_default | boolean | One per user |
| custom_mileage_rate | decimal(6,4) | Optional override |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | Soft delete |

**Index:** `(user_id)` WHERE deleted_at IS NULL

---

### `vehicles`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| business_id | uuid FK | Optional link |
| name | text NOT NULL | |
| make_model | text | |
| license_plate | text | |
| last_odometer | decimal(10,1) | Updated on trip end |
| mpg | decimal(5,2) | Optional |
| is_default | boolean | |
| custom_mileage_rate | decimal(6,4) | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | |

---

### `trips`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| business_id | uuid FK | |
| vehicle_id | uuid FK | |
| status | enum | draft, active, completed, deleted |
| purpose | text NOT NULL | |
| client | text | |
| destination | text | |
| start_location | text | |
| end_location | text | |
| start_lat | decimal(10,7) | |
| start_lng | decimal(10,7) | |
| end_lat | decimal(10,7) | |
| end_lng | decimal(10,7) | |
| start_odometer | decimal(10,1) | |
| end_odometer | decimal(10,1) | |
| miles | decimal(10,1) | Computed on complete |
| mileage_rate | decimal(6,4) | Snapshot at completion |
| reimbursement_amount | decimal(10,2) | miles × rate |
| expense_total | decimal(10,2) | Sum of expenses |
| grand_total | decimal(10,2) | reimbursement + expenses |
| notes | text | |
| checklist_responses | jsonb | End-trip checklist |
| reimbursement_status | enum | none, pending, submitted, paid |
| invoice_status | enum | none, sent, paid |
| started_at | timestamptz | |
| ended_at | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | |

**Indexes:**
- `(user_id, status)` WHERE deleted_at IS NULL
- `(user_id, ended_at DESC)` for timeline
- GIN full-text on `(purpose, client, destination, notes)`

---

### `expense_categories`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | NULL = system category |
| business_id | uuid FK | Optional scope |
| name | text NOT NULL | |
| slug | text | fuel, meal, hotel, etc. |
| icon | text | |
| is_deductible | boolean | Informational V1 |
| is_hidden | boolean | |
| sort_order | int | |
| created_at | timestamptz | |

**Seed:** System categories inserted via migration.

---

### `expenses`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| trip_id | uuid FK | Nullable if unassigned |
| business_id | uuid FK | |
| category_id | uuid FK | |
| receipt_id | uuid FK | Optional |
| merchant | text | |
| amount | decimal(10,2) NOT NULL | |
| tax_amount | decimal(10,2) | |
| expense_date | date NOT NULL | |
| payment_method | text | |
| notes | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | |

**Index:** `(trip_id)`, `(user_id, expense_date DESC)`

---

### `receipts`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| storage_path | text NOT NULL | Supabase Storage bucket |
| file_hash | text | SHA-256 for duplicate detection |
| file_size_bytes | int | |
| mime_type | text | |
| upload_status | enum | pending, processing, ready, failed |
| review_status | enum | pending, confirmed, rejected |
| created_at | timestamptz | |

**Index:** `(user_id, file_hash)` for duplicate check

**Storage bucket:** `receipts` — private, RLS per user folder `{user_id}/{receipt_id}.jpg`

---

### `ocr_results`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| receipt_id | uuid FK UNIQUE | |
| raw_response | jsonb | Full API response (redacted keys) |
| merchant | text | |
| receipt_date | date | |
| subtotal | decimal(10,2) | |
| tax | decimal(10,2) | |
| total | decimal(10,2) | |
| payment_method | text | |
| suggested_category_id | uuid FK | |
| confidence_scores | jsonb | Per-field 0–1 |
| model_version | text | Prompt/model tracking |
| processed_at | timestamptz | |

---

### `mileage_rates_reference`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| tax_year | int NOT NULL | |
| rate | decimal(6,4) NOT NULL | IRS standard |
| effective_from | date | |
| effective_to | date | |
| source | text | e.g. IRS Notice |

**Seed:** 2024, 2025, 2026 rates via migration.

---

### `subscriptions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK UNIQUE | |
| stripe_customer_id | text | |
| stripe_subscription_id | text | |
| plan | enum | free, pro, small_business, enterprise |
| status | enum | active, canceled, past_due, trialing |
| current_period_start | timestamptz | |
| current_period_end | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

### `usage_counters`

Monthly quota tracking for free tier.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| period_month | date | First of month |
| trips_count | int DEFAULT 0 | |
| receipts_count | int DEFAULT 0 | |

**Unique:** `(user_id, period_month)`

---

### `reports`

Generated report metadata (files in Storage).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| report_type | enum | mileage, expense, combined, client, reimbursement |
| format | enum | pdf, csv, xlsx |
| filters | jsonb | Date range, business, etc. |
| storage_path | text | |
| file_size_bytes | int | |
| expires_at | timestamptz | Auto-delete after 7 days |
| created_at | timestamptz | |

---

### `notifications`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| type | text | |
| title | text | |
| body | text | |
| read_at | timestamptz | |
| created_at | timestamptz | |

---

### `audit_logs`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| entity_type | text | trip, expense, receipt |
| entity_id | uuid | |
| action | enum | create, update, delete |
| old_values | jsonb | |
| new_values | jsonb | |
| created_at | timestamptz | |

---

### `ai_suggestions` (V1 lightweight)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK | |
| suggestion_type | enum | duplicate_receipt, missing_receipt, incomplete_trip |
| entity_type | text | |
| entity_id | uuid | |
| message | text | |
| dismissed_at | timestamptz | |
| created_at | timestamptz | |

---

## Row Level Security Policies

**Pattern:** All tables — `user_id = auth.uid()` for SELECT, INSERT, UPDATE, DELETE.

**Exceptions:**
- `mileage_rates_reference` — read-only for authenticated
- `expense_categories` where `user_id IS NULL` — read-only system categories
- `subscriptions` — user read own; updates via service role (Stripe webhook only)

**Storage policies:**
- `receipts` bucket: `(storage.foldername(name))[1] = auth.uid()::text`

---

## Database Functions & Triggers

| Function | Purpose |
|----------|---------|
| `compute_trip_totals(trip_id)` | Recalculate miles, reimbursement, expense_total, grand_total |
| `increment_usage_counter(user_id, type)` | Atomic trip/receipt count for billing period |
| `check_tier_limit(user_id, action)` | Returns boolean + remaining quota |
| `update_vehicle_odometer()` | Trigger on trip complete |
| `log_audit_trail()` | Trigger on financial table updates |

---

## Migration Strategy

1. All schema changes via `supabase/migrations/` SQL files
2. Naming: `{timestamp}_{description}.sql`
3. Never edit applied migrations — new migration to alter
4. Local test on H: via Supabase CLI before push
5. Production apply via Supabase dashboard or CI

---

## Backup & Retention

- Supabase daily backups (Pro plan) — enable before launch
- Receipt images: retained until user deletes
- Generated reports: 7-day TTL
- Audit logs: 2 years
- Soft-deleted records: 30 days then purge job

---

*Previous: [Volume 3 — Functional Requirements](03-functional-requirements.md) | Next: [Volume 5 — AI Design](05-ai-design.md)*
