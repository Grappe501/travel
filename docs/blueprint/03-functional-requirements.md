# Volume 3 — Functional Requirements

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

Each feature: purpose, inputs, outputs, rules, permissions, validation, errors.

---

## FR-001 Authentication

**Purpose:** Secure account access.

| | |
|---|---|
| **Inputs** | Email, password; OAuth (Google, Apple — V1.1 optional) |
| **Outputs** | Session JWT, user profile record |
| **Rules** | Email verification required before full access; password min 8 chars |
| **Permissions** | Public: signup/login; Authenticated: all app features |
| **Validation** | Valid email format; password strength indicator |
| **Errors** | Invalid credentials, unverified email, rate limited |

---

## FR-002 Business Management

**Purpose:** Organize trips/expenses by business entity.

| | |
|---|---|
| **Inputs** | Name, optional EIN, optional address, default mileage rate override |
| **Outputs** | `businesses` record |
| **Rules** | Free: max 1 business; Pro: unlimited; one default business per user |
| **Permissions** | Owner only (V1) |
| **Validation** | Name required, 1–100 chars |
| **Errors** | Limit exceeded → upgrade prompt |

---

## FR-003 Vehicle Management

**Purpose:** Track mileage per vehicle.

| | |
|---|---|
| **Inputs** | Name, make/model (optional), license plate (optional), starting odometer, MPG (optional), default flag |
| **Outputs** | `vehicles` record |
| **Rules** | Free: 1 vehicle; Pro: unlimited; one default; odometer monotonic warning (not block) |
| **Permissions** | Owner only |
| **Validation** | Name required; odometer ≥ 0 |
| **Errors** | Limit exceeded |

---

## FR-004 Start Trip

**Purpose:** Begin documenting a business trip.

| | |
|---|---|
| **Inputs** | business_id, vehicle_id, purpose, client (optional), destination (optional), start_location (optional), start_odometer (optional), start_lat/lng (optional) |
| **Outputs** | `trips` record with status=`active`, started_at timestamp |
| **Rules** | Only one active trip per user at a time; Free tier trip count checked; auto-save draft every 30s; GPS optional |
| **Permissions** | Authenticated user owns trip |
| **Validation** | purpose required (1–500 chars); vehicle and business required |
| **Errors** | Active trip exists (offer go-to or end); monthly limit reached |

**Calculations (deferred until end):** miles = end_odometer − start_odometer OR GPS distance if both points present.

---

## FR-005 Add Expense (During Trip)

**Purpose:** Attach cost to active trip.

| | |
|---|---|
| **Inputs** | trip_id, amount, category_id, merchant (optional), date (optional), receipt_id (optional), notes |
| **Outputs** | `expenses` record linked to trip |
| **Rules** | Defaults date to today; category suggested by OCR if receipt attached |
| **Permissions** | Trip owner |
| **Validation** | amount > 0; category required |
| **Errors** | Trip not active or not found |

---

## FR-006 End Trip

**Purpose:** Close trip and compute totals.

| | |
|---|---|
| **Inputs** | trip_id, end_odometer (optional), end_location (optional), end_lat/lng (optional), notes (optional), checklist_responses (optional JSON) |
| **Outputs** | Trip status=`completed`, miles, reimbursement_amount, expense_total, grand_total |
| **Rules** | Show "Forgot Something?" checklist before final submit; reimbursement = miles × applicable rate; deduction estimate = reimbursement (informational, not tax advice) |
| **Permissions** | Trip owner |
| **Validation** | end_odometer ≥ start_odometer if both provided; at least one mileage source (odometer pair OR GPS OR manual miles override) |
| **Errors** | Invalid odometer; missing mileage data |

**Mileage rate resolution order:** vehicle override → business override → user default → IRS standard for tax year.

---

## FR-007 Edit / Delete / Duplicate Trip

| | |
|---|---|
| **Edit** | All fields except id, user_id; completed trips editable with audit log entry |
| **Delete** | Soft delete; receipts unlinked not deleted; confirm dialog |
| **Duplicate** | Copy metadata to new draft trip; no receipts copied |

---

## FR-008 Receipt Capture & OCR

**Purpose:** One-tap expense intelligence.

| | |
|---|---|
| **Inputs** | Image (camera or file), optional trip_id |
| **Outputs** | `receipts` record, `ocr_results` record, suggested `expense` draft |
| **Rules** | Free: 10 receipts/month; Pro: unlimited; max file size 10 MB; formats JPEG, PNG, HEIC, PDF; duplicate detection runs on save |
| **Permissions** | Owner |
| **Validation** | Image readable; trip belongs to user if specified |
| **Errors** | OCR failure → manual entry; limit exceeded |

**OCR extracted fields:** merchant, date, subtotal, tax, total, payment_method, suggested_category, confidence_scores (per field)

User must confirm total and category before expense is created (AI never silently saves).

---

## FR-009 Expense Categories

**Purpose:** Classify spending.

**Default categories (system):** Fuel · Meals · Hotel · Parking · Toll · Supplies · Other

| | |
|---|---|
| **Inputs** | name, icon (optional), business_id (optional for custom) |
| **Rules** | System categories cannot be deleted; custom can be hidden |
| **Validation** | Unique name per business |

---

## FR-010 Dashboard Aggregations

**Purpose:** At-a-glance status.

| Metric | Calculation |
|--------|-------------|
| Today miles | Sum completed trip miles where ended_at is today (user timezone) |
| Month miles | Same for current calendar month |
| Month expenses | Sum expense amounts for month |
| Est. deduction | Month mileage reimbursement + deductible expenses (user-configurable category flags — V1: all business expenses informational) |
| Incomplete trips | Count active + drafts |
| Receipts to review | OCR confidence below threshold or unassigned |

Refresh on navigation and after trip/expense mutations. Target < 2s.

---

## FR-011 Reports

**Purpose:** Export-ready documentation.

| Report type | Grouping | Columns |
|-------------|----------|---------|
| Mileage log | By date | Date, destination, purpose, client, miles, rate, amount |
| Expense | By date/category | Date, merchant, category, amount, trip ref |
| Combined | By trip | Trip header + mileage + line items |
| Client | By client | Client, trips, miles, expenses, total |
| Reimbursement | By date range | Summary + detail appendix |

**Filters:** date range, business_id, vehicle_id, client text, status  
**Exports:** PDF (server-generated), CSV, Excel (xlsx)  
**Rules:** Pro required for CSV/Excel; Free PDF only; generation timeout 30s

---

## FR-012 Subscription & Tier Limits

| Limit | Free | Pro |
|-------|------|-----|
| Trips/month | 5 | Unlimited |
| Receipts/month | 10 | Unlimited |
| Vehicles | 1 | Unlimited |
| Businesses | 1 | Unlimited |
| Export CSV/Excel | No | Yes |

**Enforcement:** Check at action time (start trip, scan receipt); soft warning at 80% usage.

**Stripe events:** checkout.session.completed, customer.subscription.updated, customer.subscription.deleted → update `subscriptions` table.

---

## FR-013 Settings

| Setting | Storage | Default |
|---------|---------|---------|
| Mileage rate type | user/business/vehicle | IRS standard |
| Currency | user profile | USD |
| Tax year | user profile | Current year |
| Dark mode | user profile | System |
| Timezone | user profile | Browser detected |

IRS rate: stored reference table updated annually (admin seed).

---

## FR-014 Trip Timeline & Search

| | |
|---|---|
| **Inputs** | Query string, filters, pagination cursor |
| **Outputs** | Paginated trip cards (20 per page) |
| **Rules** | Full-text search on purpose, client, destination, notes, merchant names on linked expenses |
| **Performance** | P95 < 500ms for first page |

---

## FR-015 Notifications (V1 — Email only)

- Incomplete trip reminder (24h after start, if still active)
- Weekly summary (optional opt-in)
- Receipt review reminder (unassigned receipt > 48h)

---

## FR-016 Data Export & Deletion

**Export:** JSON + CSV bundle of all user data; GDPR-style complete export.  
**Deletion:** 30-day soft delete then hard purge; Stripe customer anonymized; storage files removed.

---

## Cross-Cutting Requirements

| Requirement | Specification |
|-------------|---------------|
| Auto-save | Trip drafts: 30s interval |
| Audit trail | Financial field edits logged to `audit_logs` |
| Idempotency | Receipt upload uses client-generated UUID to prevent duplicates |
| Timezone | All display in user TZ; storage UTC |
| Rounding | Currency 2 decimal places; miles 1 decimal |

---

## Permission Matrix (V1)

| Action | Free user | Pro user | Unauthenticated |
|--------|-----------|----------|-----------------|
| Start trip | ✓ (within limits) | ✓ | ✗ |
| Scan receipt | ✓ (within limits) | ✓ | ✗ |
| PDF report | ✓ | ✓ | ✗ |
| CSV/Excel | ✗ | ✓ | ✗ |
| Multiple vehicles | ✗ | ✓ | ✗ |

---

*Previous: [Volume 2 — User Experience](02-user-experience.md) | Next: [Volume 4 — Database Architecture](04-database-architecture.md)*
