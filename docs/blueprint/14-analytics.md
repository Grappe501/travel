# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 14 — Analytics, Metrics & Business Intelligence

**Version 1.0**

---

## Who This Document Is For

Volume 14 defines **what we measure, why we measure it, and how** product, revenue, AI, support, and engineering decisions are made after launch.

| Role | Use this volume to… |
|------|---------------------|
| **Product** | Funnels, activation, retention, roadmap evidence |
| **Engineering** | Implement events from registry — no ad-hoc names |
| **Founders** | MRR, North Star, weekly review rhythm |
| **AI/ML** | OCR and suggestion quality metrics |
| **Support** | Ticket categories tied to product gaps |
| **Privacy** | What never enters analytics tools |

**Related:** [Volume 7 — Business Ops Ch. 16](07-business-operations.md) · [Volume 11 — SCR analytics](11-screen-bible.md) · [Volume 13 — SM events](13-state-machines.md) · [Volume 8 — Privacy](08-security.md)

Volume 7 Ch. 16 is a **summary**; **Volume 14 is canonical** for analytics.

---

## Event Registry

Permanent event names with **EVT-IDs** — referenced in SCR specs, SM transitions, and commits.

Full registry: [`docs/analytics/EVENT-REGISTRY.md`](../analytics/EVENT-REGISTRY.md)

Naming format: `object_action` or `object_action_status` (Ch. 16)

---

# 1. Purpose

Analytics must answer:

| Question | Metric area |
|----------|-------------|
| Are users activating? | Ch. 4 — Activation |
| Are users getting value? | Ch. 6 — Usage, Ch. 11 — Reports |
| Where do users quit? | Ch. 8 — Funnels |
| What makes people upgrade? | Ch. 5, Ch. 12 — Revenue & Billing |
| Which features drive retention? | Ch. 7, Ch. 9 |
| Where does AI help or hurt? | Ch. 10 — AI Performance |
| Are reports being generated? | Ch. 11 — Report Quality |
| Is the business growing? | Ch. 5 — Revenue |

> The goal is not to collect everything. **The goal is to collect the right things.**

---

# 2. Analytics Philosophy

**Measure behavior, not vanity.**

| Care less about | Care more about |
|-----------------|-----------------|
| Raw downloads | First trip logged |
| Page views alone | First receipt captured |
| Signups without activation | First report generated |
| | Free limit reached |
| | Upgrade completed |
| | Monthly report generated |
| | Retained at 30 / 60 / 90 days |

Every metric ties to a **decision** — if it doesn't inform product, revenue, or reliability, don't track it in V1.

---

# 3. North Star Metric

### Primary North Star

> **Paid users who generate at least one report per month.**

**Why:** A report means the app delivered its core promise — turning travel activity into **usable documentation**.

| Supporting metric | Definition |
|-------------------|------------|
| Product North Star (Volume 1) | Completed business trips documented per week |
| Activation North Star | Trip + receipt within 24h (Ch. 4) |

**SQL sketch (internal):**

```sql
SELECT count(DISTINCT user_id)
FROM reports r
JOIN subscriptions s ON s.user_id = r.user_id
WHERE s.plan IN ('pro', 'business')
  AND s.status = 'active'
  AND r.created_at >= date_trunc('month', now());
```

Review weekly on Founder Dashboard (Ch. 18).

---

# 4. Activation Metrics

First moment of value — track progression through activation events:

| EVT-ID | Event | SCR | When |
|--------|-------|-----|------|
| EVT-001 | `account_created` | SCR-004 | Signup success |
| EVT-002 | `business_created` | SCR-010 | First business saved |
| EVT-003 | `vehicle_added` | SCR-011 | First vehicle saved |
| EVT-004 | `trip_started` | SCR-019 | Any trip start |
| EVT-005 | `trip_started_first` | SCR-019 | User's first ever |
| EVT-006 | `trip_completed` | SCR-020 | Trip closed |
| EVT-007 | `trip_completed_first` | SCR-020 | User's first ever |
| EVT-008 | `receipt_uploaded` | SCR-023 | Image stored |
| EVT-009 | `receipt_uploaded_first` | SCR-023 | User's first ever |
| EVT-010 | `receipt_review_approved` | SCR-024 | User confirms OCR |
| EVT-011 | `report_generated` | SCR-031 | Report job complete |
| EVT-012 | `report_generated_first` | SCR-031 | User's first ever |

### Core activation definition

> **User logs one trip and uploads one receipt within 24 hours of account creation.**

| Metric | Target (V1 beta) |
|--------|------------------|
| Activation rate | ≥ 60% of signups |
| Time to first trip | < 5 min median |
| Time to first receipt | < 24h of first trip |

Cohort by signup week; alert if activation drops > 10% week-over-week.

---

# 5. Revenue Metrics

| Metric | Source | Review |
|--------|--------|--------|
| MRR | Stripe + internal | Weekly |
| ARR | MRR × 12 | Monthly |
| Free-to-paid conversion | PostHog funnel | Weekly |
| Pro subscriptions | Stripe | Daily |
| Small Business subscriptions | Stripe (V1.1) | Weekly |
| Upgrade rate | `upgrade_completed` / MAU | Weekly |
| Downgrade rate | Stripe webhooks | Weekly |
| Churn rate | Canceled / paid base | Monthly |
| Failed payments | Stripe + `payment_failed` | Daily |
| Recovered payments | Stripe retry success | Weekly |
| ARPU | MRR / paid users | Monthly |
| LTV | Model: ARPU / churn | Quarterly |
| CAC | Marketing spend / paid signups | When ads run |

**Rule:** Revenue metrics from **Stripe Dashboard + internal DB** — never trust client-only counts.

---

# 6. Usage Metrics

Volume and depth of product use:

| Metric | Event / query |
|--------|---------------|
| Trips created | count `trip_started` |
| Trips completed | count `trip_completed` |
| Receipts uploaded | count `receipt_uploaded` |
| Receipts approved | count `receipt_review_approved` |
| Expenses logged | count `expense_created` |
| Reports generated | count `report_generated` |
| Reports downloaded | count `report_downloaded` |
| Reports emailed | future |
| Vehicles added | count `vehicle_added` |
| Businesses added | count `business_created` |
| Clients/projects used | count where `client_id` set |

Segment by plan (`free` vs `pro`), platform, and business type where known.

---

# 7. Feature Adoption Metrics

Each feature tracks five stages:

| Stage | Meaning |
|-------|---------|
| **Viewed** | Screen or entry point seen |
| **Started** | User initiated action |
| **Completed** | Successful outcome |
| **Failed** | Error state reached |
| **Abandoned** | Started, no complete within session |

### V1 features

| Feature | SCR | Key completed event |
|---------|-----|---------------------|
| Manual trip logging | SCR-019 | `trip_completed` |
| Receipt OCR | SCR-023–024 | `receipt_review_approved` |
| Report builder | SCR-031 | `report_generated` |
| Search | SCR-043 | `search_result_clicked` |
| AI suggestions | SCR-040 | `ai_suggestion_accepted` |
| Export | SCR-050 | `account_export_completed` |
| Billing upgrade | SCR-044 | `upgrade_completed` |
| Team invites | V1.1 | `team_invite_sent` |
| Notification center | SCR-042 | `notification_opened` |

**Adoption rate** = completed / viewed (unique users, 28-day window).

---

# 8. Funnel Analytics

## Onboarding Funnel

```
visit_site → account_created → business_created → vehicle_added →
trip_started_first → trip_completed_first → receipt_uploaded_first →
report_generated_first
```

| Step | Drop-off alert |
|------|----------------|
| account → business | > 25% |
| business → first trip | > 30% |
| first trip → first receipt | > 40% |
| first receipt → first report | > 50% |

## Upgrade Funnel

```
free_usage → limit_warning_shown → pricing_viewed → upgrade_started →
checkout_completed → pro_active
```

Track SCR-058 modal views → SCR-044 checkout.

## Receipt Funnel

```
capture_started → image_saved → upload_complete → ocr_complete →
user_reviewed → receipt_review_approved
```

Maps to SM-RCP + SM-OCR (Volume 13).

## Report Funnel

```
report_builder_opened → filters_selected → report_generated →
report_viewed → report_downloaded
```

---

# 9. Retention Metrics

| Metric | Definition |
|--------|------------|
| D1 retention | % return day after signup |
| D7 retention | % active 7 days after signup |
| D30 retention | % active 30 days after signup |
| MAU | Unique users with ≥1 trip or receipt in 30d |
| WAU | Same, 7d window |
| Trips per active user | trips completed / MAU |
| Receipts per active user | receipts approved / MAU |
| Reports per active user | reports generated / MAU |
| Repeat report generation | ≥2 reports in 90d |
| Months retained by plan | cohort survival |

### Most important retention question

> **Does the user come back the next time they travel?**

Proxy: user active in month N and month N+3 during typical travel season (field-worker cohorts).

---

# 10. AI Performance Metrics

AI is measured by **whether it reduces work**, not whether it feels impressive.

| Metric | Source | Target (V1) |
|--------|--------|-------------|
| OCR success rate | `ocr_complete` / uploads | ≥ 90% |
| OCR failure rate | `ocr_failed` / uploads | < 10% |
| Avg OCR processing time | Edge Function logs | P95 < 5s |
| Merchant extraction accuracy | golden set + corrections | ≥ 80% |
| Total extraction accuracy | within $0.01 | ≥ 90% |
| Category suggestion acceptance | accepted / suggested | ≥ 70% |
| User correction rate | fields edited / fields | < 15% |
| Duplicate detection accuracy | true positives / flags | TBD beta |
| AI suggestion dismissal rate | dismissed / shown | monitor |
| AI suggestion acceptance rate | accepted / shown | ≥ 40% |

Feed AI Dashboard (Ch. 18). Volume 5 Ch. telemetry aligns.

**Never** log receipt image content or extracted amounts in PostHog — use correction **counts** only.

---

# 11. Report Quality Metrics

| Metric | Source |
|--------|--------|
| Reports generated successfully | `report_generated` |
| Report generation failures | `report_failed` |
| Average generation time | Edge Function duration |
| PDF downloads | `report_downloaded` { format: pdf } |
| CSV downloads | format csv |
| Excel downloads | format xlsx |
| Report regeneration rate | duplicate report jobs / user |
| Report support complaints | tickets tagged report |
| Share frequency | `report_shared` if implemented |

North Star dependency — monitor report failures as **P0** reliability issue.

---

# 12. Billing Metrics

| Metric | Event |
|--------|-------|
| Checkout starts | `upgrade_started` |
| Checkout completions | `upgrade_completed` |
| Abandoned checkouts | started − completed |
| Failed payments | `payment_failed` |
| Payment retries | Stripe webhook |
| Cancellations | `subscription_canceled` |
| Refunds | Stripe |
| Plan changes | `subscription_changed` |
| Free limit hits | `free_limit_reached_trips` / `_receipts` |
| Upgrade prompt views | `upgrade_prompt_viewed` |
| Upgrade prompt conversions | completed / viewed |

SM-SUB transitions (Volume 13) map to these events.

---

# 13. Support Metrics

| Metric | Use |
|--------|-----|
| Ticket volume | Overall load |
| Ticket category | Product gap detection |
| First response time | SLA (Volume 7) |
| Resolution time | Efficiency |
| Reopened tickets | Quality of fix |
| Billing issues | Stripe UX |
| OCR issues | AI pipeline |
| Report issues | Export pipeline |
| Login issues | Auth friction |
| Data export issues | GDPR flow |

**Rule:** High volume in any category → UX or copy improvement before new features.

Tag tickets with SCR-ID and EVT-ID when applicable.

---

# 14. Reliability Metrics

Engineering and ops — feed **Operations Dashboard** (Ch. 18) and SCR-055.

| Metric | Source |
|--------|--------|
| API error rate | Supabase logs, 5xx % |
| API latency P95 | Edge + PostgREST |
| Upload failures | `receipt_upload_failed` |
| OCR queue failures | `ocr_failed` + queue depth |
| Report failures | `report_failed` |
| Sync failures | `sync_failed` |
| Storage failures | Supabase Storage errors |
| Stripe webhook failures | webhook handler logs |
| Auth failures | `signin_failure` count |

Alert thresholds in Volume 9 Ch. 23. No PII in error analytics payloads.

---

# 15. Privacy Rules

Align with Volume 8 data classification.

| ✓ Allowed in analytics | ✗ Never send to PostHog / third parties |
|------------------------|----------------------------------------|
| User ID (opaque UUID) | Receipt images |
| Business ID | Merchant names (free text) |
| Plan type | Expense amounts |
| Device / platform | Trip purpose / notes |
| Event metadata (counts, enums) | Client names |
| SCR-ID, SM-ID | OCR extracted fields |
| Error codes | Full API error payloads |

Analytics events use **IDs and metadata** — not document contents.

Marketing site: Plausible or PostHog with **no cookie banner** if cookieless config (Volume 7).

Internal `business_events` table may store more detail — still no receipt blobs.

---

# 16. Event Naming Standard

Format: **`object_action`** or **`object_action_status`**

| Pattern | Examples |
|---------|----------|
| Lifecycle | `trip_started`, `trip_completed` |
| Upload pipeline | `receipt_uploaded`, `receipt_upload_failed` |
| OCR | `receipt_ocr_started`, `receipt_ocr_completed`, `receipt_ocr_failed` |
| Review | `receipt_review_started`, `receipt_review_approved` |
| Reports | `report_generated`, `report_downloaded`, `report_failed` |
| Billing | `upgrade_started`, `upgrade_completed`, `payment_failed` |
| Screen | `screen_viewed` + `{ scr_id }` |

**Rules:**

* Lowercase snake_case only
* Past tense for completed actions
* `_first` suffix for activation milestones
* No spaces, no camelCase in event names

Volume 13 analytics keys must match this registry — update EVENT-REGISTRY when adding events.

---

# 17. Required Event Properties

Every product event includes:

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| `user_id` | uuid | Yes* | *Omit pre-auth except anonymous_id |
| `business_id` | uuid | When applicable | Active business context |
| `plan_type` | enum | Yes | free, pro, business |
| `device_type` | enum | Yes | mobile, tablet, desktop |
| `platform` | enum | Yes | ios, android, web |
| `timestamp` | ISO8601 | Yes | Server time preferred |
| `app_version` | string | Yes | semver |
| `session_id` | uuid | Yes | Per session |
| `request_id` | string | Optional | From API envelope |
| `scr_id` | string | When UI | SCR-015 etc. |
| `sm_id` | string | When workflow | SM-RCP etc. |

**Optional safe metadata:** `trip_id`, `receipt_id`, `report_type`, `format`, `error_code`, `duration_ms`, `field_count_edited`

Implement via `packages/shared/src/analytics/track.ts` — single track function.

---

# 18. Dashboards Needed

## Founder Dashboard

| Widget | Metric |
|--------|--------|
| MRR | Ch. 5 |
| Paid users | Stripe |
| New signups | EVT-001 cohort |
| Activation rate | Ch. 4 |
| Churn | Ch. 5 |
| Reports generated | Ch. 11 |
| Upgrade conversion | Ch. 12 |

## Product Dashboard

| Widget | Metric |
|--------|--------|
| Funnel drop-off | Ch. 8 |
| Feature adoption | Ch. 7 |
| Time to first trip | Activation |
| Time to first report | Activation |
| D7 / D30 retention | Ch. 9 |

## AI Dashboard

| Widget | Metric |
|--------|--------|
| OCR success rate | Ch. 10 |
| Correction rate | Ch. 10 |
| Processing time P95 | Ch. 10 |
| Suggestion acceptance | Ch. 10 |

## Operations Dashboard

| Widget | Metric |
|--------|--------|
| Error rate | Ch. 14 |
| Failed jobs | OCR, reports |
| Upload issues | Ch. 14 |
| Stripe webhooks | Ch. 14 |
| Support tickets | Ch. 13 |

**V1 tooling:** PostHog (product) · Stripe (revenue) · Supabase/Sentry (ops) · Internal SQL (MRR, North Star)

SCR-053 Admin Dashboard surfaces ops subset.

---

# 19. Weekly Review Rhythm

Every **Monday** — 30-minute review:

| Review item | Owner |
|-------------|-------|
| New users (week) | Product |
| Activated users % | Product |
| Paid conversions | Founder |
| Churn events | Founder |
| Support top 3 categories | Support |
| OCR quality trend | Engineering |
| Top user complaints | Product |
| Most / least used features | Product |
| North Star count | Founder |

**Output:** Top 3 evidence-based priorities for sprint — not guesswork.

Post-launch first 30 days: **daily** subset (Volume 9 Ch. 28).

---

# 20. Version 1 Analytics Checklist

Before launch:

| # | Item |
|---|------|
| 1 | [ ] EVENT-REGISTRY published and reviewed |
| 2 | [ ] Core funnels instrumented (Ch. 8) |
| 3 | [ ] Revenue dashboard connected (Stripe) |
| 4 | [ ] Activation dashboard live |
| 5 | [ ] AI dashboard live |
| 6 | [ ] Error tracking (Sentry) integrated |
| 7 | [ ] Analytics privacy review completed |
| 8 | [ ] No sensitive receipt data in PostHog |
| 9 | [ ] Admin dashboard has business health metrics |
| 10 | [ ] `track()` wrapper enforces required properties |
| 11 | [ ] Screen views include SCR-ID |
| 12 | [ ] North Star SQL query validated |

Gate: Volume 9 launch certification includes analytics sign-off.

---

# 21. Non-Negotiables

| # | Rule |
|---|------|
| 1 | Do not track private receipt contents in analytics |
| 2 | Do not track more than we can use |
| 3 | Do not optimize only for upgrades — retention matters |
| 4 | Do not ignore retention |
| 5 | Do not let vanity metrics drive product decisions |
| 6 | Do not ship AI without measuring correction rates |
| 7 | Do not make roadmap decisions without usage evidence |
| 8 | Do not add events without EVENT-REGISTRY entry |
| 9 | Do not bypass `track()` for product events |
| 10 | Do not send financial amounts to third-party analytics |

---

# Final Standard

Volume 14 succeeds when we can answer one question every week:

> **Are users saving enough time and gaining enough confidence to keep paying?**

If the data can't answer that, fix instrumentation before adding features.

---

## Cross-Reference Index

| Volume | Link |
|--------|------|
| Volume 7 | GTM, pricing, support SLA |
| Volume 11 | SCR screen analytics (Ch. 22) |
| Volume 12 | `business_events`, API-ANL-* |
| Volume 13 | SM transition analytics (Ch. 9) |
| Volume 8 | Privacy classification (Ch. 15) |
| Volume 5 | AI telemetry targets |

---

## Document Map

| Need | Go to |
|------|-------|
| Event list | [EVENT-REGISTRY.md](../analytics/EVENT-REGISTRY.md) |
| Screen events | [Volume 11 Ch. 22](11-screen-bible.md) |
| SM events | [Volume 13 §9](13-state-machines.md) |
| Business metrics | [Volume 7 Ch. 16](07-business-operations.md) |

---

*Previous: [Volume 13 — State Machines](13-state-machines.md) | Return to [Blueprint Index](README.md)*
