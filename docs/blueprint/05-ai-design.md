# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 5 — AI & Intelligence Architecture Master Blueprint

**Version 1.0**

---

## Who This Document Is For

Volume 5 defines **every AI decision, prompt, confidence score, and Copilot interaction**. AI is a first-class subsystem — not a feature bolted onto OCR.

| Role | Use this document to… |
|------|----------------------|
| **AI / backend engineers** | Implement engines, prompts, pipelines, and telemetry |
| **Product** | Scope V1 vs. roadmap; gate releases on quality targets |
| **Design** | Confidence UI, explanations, suggestion cards (Volume 2 Ch. 11) |
| **QA** | Test against quality gates (Chapter 24) and human-in-the-loop flows (Ch. 23) |
| **Legal / compliance** | Boundaries on advice, data use, and training consent |

**Related:** [Volume 3 — FR-1300](03-functional-requirements.md) · [Volume 4 — AI tables](04-database-architecture.md) · [Volume 0 — AI principles](00-product-doctrine.md)

---

## Philosophy

> **The AI should think like an experienced executive assistant — not an accountant and not a tax professional.**

**Purpose:** Reduce administrative work while keeping the user in control of every financial decision.

---

# Chapter 1 — AI Doctrine

## AI Exists To

* **Save time** — fewer taps, less typing
* **Reduce mistakes** — catch duplicates, missing receipts, incomplete trips
* **Detect missing information** — fuel on long trips, unlinked receipts
* **Organize records** — categorize, associate, summarize
* **Increase confidence** — explainable suggestions, visible confidence

## AI Never

* Replaces the user as decision-maker
* Silently alters dollar amounts, mileage, or stored financial records
* Provides legal, tax, or accounting advice
* Invents facts not visible on a receipt or in user data

**The human remains the final authority** (Chapter 23).

---

# Chapter 2 — AI Operating Principles

Every AI feature obeys these seven rules:

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Suggest before changing** | All writes go through user confirm on review screen |
| 2 | **Never alter financial values automatically** | N6 — no background UPDATE to `expenses`/`trips` totals |
| 3 | **Explain recommendations** | Chapter 14 — `explanation` string on every suggestion |
| 4 | **Show confidence** | Chapter 12 — per-field scores + High/Medium/Low bands |
| 5 | **Learn from corrections** | Chapter 11 — private per-user preference store |
| 6 | **Preserve original data** | `ocr_results` immutable; user values on `expenses`/`receipts` |
| 7 | **Never invent missing facts** | null + confidence 0 when unreadable |

---

# Chapter 3 — AI Architecture

Version 1 uses **specialized engines** — not one monolithic prompt. Each engine is independently versioned, replaceable, and testable.

```
┌─────────────────────────────────────────────────────────────┐
│                     Copilot Orchestrator                     │
│          (Edge Functions · routes to engines · logs)         │
└───┬─────────┬─────────┬─────────┬─────────┬─────────┬─────┘
    │         │         │         │         │         │
    ▼         ▼         ▼         ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ OCR   │ │Class- │ │ Trip  │ │Remind-│ │Report │ │Insight│
│Engine │ │ification│ │Intel  │ │  er   │ │Assist │ │Engine │
└───────┘ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘
    │         │           │         │         │         │
    └─────────┴───────────┴────┬────┴─────────┴─────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Learning Engine     │
                    │ Personal Memory     │
                    └─────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
              ocr_results          ai_suggestions
              business_events      user_ai_preferences
              ai_interaction_log
```

### Engine Summary

| Engine | V1 scope | Primary FR |
|--------|----------|------------|
| **OCR** | Receipt field extraction | FR-401 |
| **Classification** | Category + merchant type | FR-401, FR-610 |
| **Trip Intelligence** | Active trip, end-trip nudges | FR-301, FR-302 |
| **Reminder** | Missing actions, notifications | FR-900 |
| **Reporting Assistant** | Monthly narrative summary | FR-700 |
| **Insight** | Spending pattern cards | Dashboard V1.1 |
| **Learning** | Merchant→category prefs | Chapter 11 |
| **Personal Memory** | Frequent clients, routes | Chapter 25 |

**Provider abstraction:** each engine implements a TypeScript interface in `packages/shared/src/ai/` — swap OpenAI, Anthropic, or local models without client changes.

**Deployment:** Supabase Edge Functions on H: dev; secrets in Supabase vault only.

---

# Chapter 4 — Receipt Intelligence Engine

## Purpose

Convert a receipt image into structured expense data for user review.

## Pipeline

```
Image upload (FR-400)
    ↓
[1] Image quality check          → blur/dark/too-small flags
    ↓
[2] OCR (vision model)           → raw text + layout hints
    ↓
[3] Merchant detection           → normalize name + merchant_id lookup
    ↓
[4] Field extraction             → merchant, date, time, subtotal, tax, total
    ↓
[5] Category prediction          → Classification Engine
    ↓
[6] Confidence scoring           → per-field 0.0–1.0
    ↓
[7] User review screen           → Volume 2 Journey B
    ↓
[8] User confirm → expenses row  → business_event: expense.created
```

## Stage Logging

Every stage writes to `ai_interaction_log`:

| Field | Example |
|-------|---------|
| `stage` | `quality_check`, `ocr`, `merchant`, `classify` |
| `duration_ms` | 142 |
| `confidence` | 0.94 |
| `engine_version` | `receipt-v1.0.0` |

## Image Quality Check (pre-OCR)

| Check | Fail action |
|-------|-------------|
| Resolution < 640px short edge | Warn "Try closer photo" |
| Blur score > threshold | Lower confidence; suggest retake |
| File size > 10MB | Reject before upload |

## Latency Targets

| Metric | Target |
|--------|--------|
| P50 end-to-end | < 3s |
| P95 end-to-end | < 5s |
| Quality check | < 200ms |
| OCR call | < 4s |

---

# Chapter 5 — Merchant Intelligence

## Purpose

Normalize merchants and accelerate categorization via a growing knowledge base.

## `merchant_knowledge` (global + user overrides)

| Column | Purpose |
|--------|---------|
| `normalized_name` | `shell`, `chevron` |
| `display_name` | Shell |
| `merchant_type` | gas_station, restaurant, hotel, … |
| `default_category_slug` | fuel |
| `typical_tax_behavior` | jsonb — report hints, not advice |
| `confidence` | 0.99 for seeded majors |
| `source` | `system`, `user_correction`, `aggregated` |

**V1 seed:** Top 200 US fuel, hotel, parking, fast-food chains.

**Lookup order:**

1. User private override (`user_merchant_preferences`)
2. Global `merchant_knowledge`
3. OCR extracted raw name + fuzzy match
4. Unknown → classification engine only

**Example:**

```
Shell → Fuel · gas_station · confidence 99%
"This receipt was categorized as Fuel because Shell is recognized as a gas station."
```

Knowledge base grows from user corrections (Chapter 11) — **never shared across users without anonymized aggregation opt-in**.

---

# Chapter 6 — Category Intelligence

## Purpose

Predict expense category with top suggestion + alternatives.

## Categories (align FR-610)

fuel · parking · toll · meal · hotel · airfare · supplies · equipment · other · office (V1.1)

## Classification Layers

| Layer | Input | Output |
|-------|-------|--------|
| **L1 Merchant KB** | normalized merchant | category + 0.95+ confidence |
| **L2 Merchant type** | gas_station, restaurant | category mapping |
| **L3 Keywords** | "PARKING", "TOLL" in raw OCR | category |
| **L4 LLM classify** | OCR text snippet | category + confidence |
| **L5 User history** | user always picks meal for this merchant | boost meal |
| **L6 Trip context** | active trip, prior fuel expense | boost fuel |

## Response Shape

```json
{
  "primary": { "slug": "fuel", "confidence": 0.95, "explanation": "…" },
  "alternatives": [
    { "slug": "supplies", "confidence": 0.12 },
    { "slug": "other", "confidence": 0.08 }
  ]
}
```

**UI:** Show primary pre-selected; tap to see alternatives if confidence < 0.85.

---

# Chapter 7 — Duplicate Detection

## Purpose

Prevent double-logging expenses before save.

## Signals (weighted)

| Signal | Weight | Method |
|--------|--------|--------|
| Image hash | 1.0 match → definite | SHA-256 `file_hash` |
| Merchant + total + date | 0.9 | Fuzzy within ±1 day |
| Amount + time window | 0.7 | Same day, ±$0.01 |
| Location (future) | 0.5 | Same geohash |

## Behavior

1. Run on FR-400 upload (hash) and pre-save (fuzzy)
2. If score ≥ 0.85 → `ai_suggestions` type `duplicate_receipt`
3. UI: "This looks like a receipt from Mar 12 — Shell $42.18. Save anyway?"
4. User **Confirm duplicate save** or **Cancel**

**False positive target:** < 5% (Chapter 24)

---

# Chapter 8 — Trip Intelligence

## Purpose

Monitor active trips; suggest — never auto-end.

## Rules (V1 — deterministic + optional LLM copy)

| Condition | Suggestion |
|-----------|------------|
| Active > 6 hours | "Trip still active — still driving?" |
| GPS: no movement 60 min | "You stopped moving — end trip?" |
| GPS: near known client geofence (V1.1) | "Arrived at {client}?" |
| Start without purpose > 5 min | "Add purpose for your records" |

## Outputs

* `ai_suggestions` type `trip_end_suggested`
* Optional push via FR-900

**Never:** auto-set `status = completed` without user action.

---

# Chapter 9 — Missing Expense Detection

## Purpose

Identify likely omissions — reminders, not assumptions.

## Heuristics (V1)

| Pattern | Suggestion |
|---------|------------|
| Trip > 100 mi, no fuel expense | "Long trip — fuel receipt?" |
| Destination contains "Airport", no parking | "Airport visit — parking?" |
| Trip spans overnight, no hotel | "Overnight trip — lodging?" |
| Active 11:30–13:30, no meal, >50 mi | "Lunch during travel?" |
| End-trip checklist checked, no matching expense | Link to Scan with category |

**Triggered:** End trip checklist (Volume 2) + post-trip batch job (optional email).

**Copy tone:** "Did you…?" not "You forgot…"

---

# Chapter 10 — Reminder Intelligence

## Purpose

Timely, dismissible nudges (Volume 2 Ch. 8, FR-900).

| Reminder | Trigger | Delivery |
|----------|---------|----------|
| Trip not ended | Active 24h | Push/email |
| Receipt unlinked | Upload 48h, no trip | In-app card |
| Reimbursement report ready | Month end + completed trips | Optional email |
| OCR review pending | confidence < 0.6 | Dashboard badge |
| Sync backlog | Offline > 24h | Header indicator |

**Rules:** Max 1 push/day · quiet hours 22:00–07:00 · every reminder dismissible · deep link to fix

---

# Chapter 11 — Learning Engine

## Purpose

Lightweight **private** personalization from user corrections.

## `user_ai_preferences` (Volume 4 extension)

| Key pattern | Example value |
|-------------|---------------|
| `merchant:shell → category` | fuel |
| `client:ABC Mfg → purpose` | Weekly service visit |
| `destination:regex → client_id` | uuid |

## Learning Rules

| Event | Update |
|-------|--------|
| User changes category on OCR save | Increment merchant→category count |
| Same correction ≥ 3 times | Auto-suggest (not auto-apply) with boosted confidence |
| User rejects suggestion 3 times | Stop suggesting that pattern |

**Privacy:** Preferences never leave user account · no cross-user training in V1 · export included in FR-1600 · delete on account purge

---

# Chapter 12 — AI Confidence Model

## Scores

Every field: **0.0–1.0** stored in `ocr_results.confidence_scores`

## Bands (UI)

| Band | Range | UI treatment |
|------|-------|--------------|
| **High** | ≥ 0.85 | Default styling |
| **Medium** | 0.60–0.84 | Amber highlight |
| **Low** | < 0.60 | Required review; helper text |

## Example Display

```
Merchant:  Shell        99%  High
Category:  Fuel         95%  High
Tax:       $4.62        83%  Medium  ← user should glance
Total:     $63.42       91%  High
```

**Save button:** Always enabled if required fields manually filled; low total confidence shows confirmation dialog.

## Thresholds (engineering)

| Field | Highlight below |
|-------|-----------------|
| total | 0.85 |
| merchant | 0.80 |
| date | 0.80 |
| category | 0.75 |
| tax | 0.80 |

Overall receipt confidence = min(total, merchant, date).

---

# Chapter 13 — Natural Language Search

## Purpose

Understand intent, not just keywords (FR-1000 + future NL layer).

## V1 (hybrid)

| Query type | Handler |
|------------|---------|
| `"Shell"`, `"Dallas"` | `search_documents` full-text |
| `"fuel receipts"` | category_slug = fuel + entity filter |
| `"over $100"` | amount >= 100 |
| `"March mileage"` | date range + entity type trip |
| `"trips to Client ABC"` | client_name trigram |

## V1.1 (LLM intent parser)

Edge Function `parse-search-intent`:

```json
{
  "intent": "list_receipts",
  "filters": { "category": "fuel", "min_amount": null },
  "date_range": { "month": "2026-03" }
}
```

**Safety:** Parser outputs filters only — never SQL. Parameterized query builder applies filters.

**Future-ready:** Stub interface in V1; rule-based covers 80% of queries.

---

# Chapter 14 — AI Explanations

Every recommendation includes human-readable **`explanation`**.

## Templates

| Situation | Example |
|-----------|---------|
| Merchant KB | "Categorized as Fuel because Shell is commonly recognized as a gas station." |
| Merchant type | "Restaurants are typically logged as Meals for business travel." |
| User history | "You usually categorize this merchant as Fuel." |
| Trip context | "Attached to your active trip to Henderson estimate." |
| Duplicate | "Same amount and merchant as a receipt you saved on Mar 12." |
| Low confidence | "We couldn't clearly read the total — please verify." |

**UI:** Info icon on OCR review · expandable on suggestion cards · never modal-only

---

# Chapter 15 — Report Intelligence

## Purpose

Narrative summaries alongside exports — **descriptive, not advisory**.

## Reporting Assistant (V1)

Input: aggregated stats for date range  
Output: 2–4 sentence summary stored in `reports.filters.summary_text`

**Example:**

> "You drove 2,842 business miles this month across 41 trips and logged 63 receipts. Fuel accounted for 54% of your travel expenses."

## Rules

* No "you should deduct…" language
* No tax advice
* Numbers must match report SQL exactly (same query source)
* User can hide summaries in settings

**Engine:** Template + slot filling V1; LLM polish V1.1 optional

---

# Chapter 16 — Spending Insights

## Purpose

Informational pattern cards (V1.1 dashboard; stub V1).

## Example Insights

| Insight | Logic |
|---------|-------|
| Fuel spending up MoM | Compare category totals |
| Most travel with Client A | Group by client_name |
| Avg meal $18 on travel days | meal / travel day count |

**Rules:**

* Informational only — no "you should reduce…"
* Dismissible cards · refresh weekly
* Require ≥ 10 trips before showing trends (avoid noise)

---

# Chapter 17 — OCR Training Pipeline

## Purpose

Improve OCR/classification from corrections — with consent.

## Data Captured (per receipt)

| Artifact | Storage |
|----------|---------|
| Original image | Storage (existing) |
| OCR output | `ocr_results` (immutable) |
| User corrections | `ai_correction_log` |
| Final saved values | `expenses` / `receipts` |

## `ai_correction_log`

| Column | Notes |
|--------|-------|
| receipt_id | |
| field_name | total, merchant, … |
| ocr_value | |
| user_value | |
| created_at | |

## Use

| Consumer | V1 | Future |
|----------|-----|--------|
| User learning engine | ✓ | |
| Prompt regression tests | ✓ | |
| Global model fine-tune | ✗ | Opt-in anonymized batch only |

**Privacy policy:** Explicit opt-in for anonymized contribution (Volume 7).

---

# Chapter 18 — Prompt Library

**No magic prompts in application code.** All prompts live in `supabase/functions/_shared/prompts/` with version headers.

## Prompt Registry

| ID | Version | Engine | Purpose |
|----|---------|--------|---------|
| `ocr-receipt-v1` | 1.0.0 | OCR | Extract receipt fields |
| `classify-category-v1` | 1.0.0 | Classification | Category from OCR text |
| `summarize-report-v1` | 1.0.0 | Reporting | Monthly narrative |
| `explain-category-v1` | 1.0.0 | Explanation | One-line why |
| `parse-search-v1` | 1.0.0 | Search | NL → filters (V1.1) |
| `trip-suggestion-copy-v1` | 1.0.0 | Trip intel | Human-friendly nudge text |

## Prompt File Structure

```yaml
# ocr-receipt-v1.0.0.yaml
id: ocr-receipt-v1
version: 1.0.0
engine: ocr
model: gpt-4o
purpose: Extract structured receipt fields from image
inputs:
  - image_url
  - locale (default en-US)
outputs:
  - schema: ReceiptOcrSchema.json
safety_rules:
  - Never invent line items not visible
  - Return null with confidence 0 if unreadable
  - Total must match AMOUNT DUE not subtotal
test_cases:
  - fixture: tests/fixtures/receipts/shell-gas.jpg
    expect:
      merchant: Shell
      category_hint: fuel
```

## OCR System Prompt (v1.0.0 — canonical)

```
You extract data from business receipt images for a travel expense app.

RULES:
1. Extract ONLY text visible in the image. Never guess or invent values.
2. If a field is unreadable, return null with confidence 0.
3. "total" must be the final amount due (after tax), not subtotal.
4. Dates in ISO 8601 (YYYY-MM-DD). Assume US format unless currency suggests otherwise.
5. Flag handwritten amounts with confidence ≤ 0.5.
6. merchant_type: gas_station | restaurant | hotel | parking | retail | grocery | other
7. Respond ONLY with valid JSON matching the provided schema.

You are not a tax advisor. Do not suggest deductibility.
```

## Categorization Prompt (v1.0.0 — canonical)

```
Given receipt OCR text and merchant metadata, suggest an expense category slug.

Categories: fuel, parking, toll, meal, hotel, airfare, supplies, equipment, other

Return JSON: { "primary": { "slug", "confidence", "explanation" }, "alternatives": [...] }
If uncertain, lower confidence and list alternatives. Never invent merchant names.
```

**Change process:** bump version → regression tests → deploy Edge Function → log in `ai_interaction_log`

---

# Chapter 19 — AI Safety

## Never

| Prohibited | Mitigation |
|------------|------------|
| Invent receipt values | Structured output + null defaults |
| Guess missing totals | Block auto-save; manual entry |
| Fabricate mileage | Trip miles from FR-500 only |
| Edit stored financial records without approval | No UPDATE from AI jobs |
| Legal or tax advice | Copy review; banned phrases list |
| Cross-user data leakage | RLS + no PII in prompts across tenants |

## When Uncertain

* Ask for clarification (low confidence UI)
* Present alternatives (category picker)
* Offer manual entry path (never dead-end)

## Banned Output Phrases (post-filter)

"deductible", "IRS allows", "you should claim", "tax savings guaranteed", "write off"

Replace with: "consult your tax professional" only in help docs — not in Copilot voice.

---

# Chapter 20 — AI Telemetry

## Metrics (instrument all engines)

| Metric | Target / use |
|--------|--------------|
| OCR field accuracy | > 92% usable without correction |
| Correction rate (total) | < 15% |
| Category acceptance | > 80% keep primary suggestion |
| Duplicate false positive | < 5% |
| Suggestion dismiss rate | Monitor per type |
| P95 OCR latency | < 5s |
| Hallucination reports | User flag + manual review queue |
| Confidence distribution | Dashboard for model drift |
| CSAT on OCR flow | Optional 1-tap after save |

## Storage

`ai_interaction_log` — append-only, 90-day hot retention, aggregate to analytics warehouse V2.

**No receipt images in logs.** Redact provider API keys from `raw_response` in `ocr_results`.

---

# Chapter 21 — AI Versioning & Reproducibility

Every AI interaction records:

| Field | Example |
|-------|---------|
| `model` | gpt-4o-2024-08-06 |
| `prompt_id` | ocr-receipt-v1 |
| `prompt_version` | 1.0.0 |
| `engine` | ocr |
| `duration_ms` | 2847 |
| `confidence` | 0.91 |
| `result_hash` | sha256 of normalized output |
| `correlation_id` | links to receipt_id / trip_id |

Stored in: `ocr_results.model_version` + `ai_interaction_log`

**Reproducibility:** Re-run prompt against fixture images in CI when prompt version changes.

---

# Chapter 22 — Future AI Roadmap

Extension points on modular architecture:

| Capability | Builds on |
|------------|-----------|
| Voice trip logging | Trip engine + NL entity extraction |
| Conversational expense entry | OCR + Personal Memory |
| Automatic itinerary reconstruction | GPS points + business_events |
| Business travel summaries | Report + Insight engines |
| Client profitability | Trips + expenses + clients |
| Calendar-aware suggestions | integrations.calendar + Trip intel |
| Policy-aware reimbursement | businesses.policy_rules jsonb |
| Auto trip detection | GPS stream + Trip engine |

**Rule:** Each ships as new engine version — never break existing prompt contracts without migration.

---

# Chapter 23 — Human-in-the-Loop Review

Mandatory flow for any financial record:

```
1. AI proposes     → ocr_results / ai_suggestions
2. User reviews    → OCR Review screen (Volume 2)
3. User confirms   → explicit Save tap
   or edits       → correction logged
4. System stores   → expenses / receipts (authoritative)
5. Learning updates → user_ai_preferences (if pattern)
6. Event emitted   → business_events + audit_logs if financial edit
```

**No bypass path** for AI to write `expenses.amount` directly.

---

# Chapter 24 — AI Quality Gates

**No AI capability ships below these thresholds.**

| Capability | Gate | Measurement |
|------------|------|-------------|
| Receipt OCR | ≥ 92% receipts have usable total | Golden set 50 images |
| Merchant recognition (top 50 chains) | ≥ 95% match | Fixture set |
| Category suggestion | ≥ 80% accepted without change | Beta cohort |
| Duplicate detection | < 5% false positive rate | Labeled pairs |
| OCR P95 latency | < 5s | Staging monitor |
| Total correction rate | < 15% | Production analytics |
| Zero silent financial writes | 100% | Security test |

**Release blocker:** Any gate fails → fix or disable engine via feature flag.

---

# Chapter 25 — Personal Travel Memory

## Purpose

Build context from user history — reduce repetitive entry; feel like the app **knows how they work**.

## Memory Sources (read-only aggregates)

| Signal | Derived from |
|--------|--------------|
| Frequent clients | trip count by client_id |
| Regular destinations | geohash / destination text frequency |
| Preferred vehicle | default + usage count |
| Common expense types | category histogram per trip type |
| Typical schedules | day-of-week + hour patterns |
| Recurring routes | similar start/end pairs |

## Suggestion Examples

> "This looks like your weekly visit to ABC Manufacturing. Reuse last week's purpose and client?"

> "You usually scan fuel receipts right after trips to Dallas. Add one now?"

## Behavior

| Rule | Detail |
|------|--------|
| **Suggest only** | Pre-fill form fields — user taps Accept or Edit |
| **Never auto-save** | Memory cannot write trips/expenses without confirm |
| **Private** | Per-user; not trained across accounts |
| **Decay** | Patterns older than 12 months reduce weight |
| **Transparency** | "Suggested from your history" label |

## Implementation (V1)

* Edge Function `suggest-trip-prefill` on Start Trip when destination/client matches pattern ≥ 3 occurrences
* UI: bottom sheet "Use previous details?" with preview
* Store patterns in `user_ai_preferences` + materialized view `user_travel_patterns` (refresh nightly)

**Moat:** Competitors cannot replicate without user's own longitudinal data.

---

## One-Tap Expense Intelligence (Wow Feature)

After OCR confirm (Volume 1):

```
Trip #245 · Fuel · Shell · Tulsa, OK · $63.42
Assigned to: Jones Roofing estimate
Total business trip value: $184.17
```

Orchestrator chains: OCR → Classification → FR-403 association → trip totals refresh → dashboard update.

---

## Engine ↔ Database Map

| Engine | Tables / events |
|--------|-----------------|
| OCR | receipts, ocr_results, ai_interaction_log |
| Classification | ocr_results, merchant_knowledge, user_ai_preferences |
| Trip Intelligence | trips, ai_suggestions, business_events |
| Reminder | notifications, ai_suggestions |
| Reporting Assistant | reports (summary_text) |
| Learning | user_ai_preferences, ai_correction_log |
| Personal Memory | user_travel_patterns, user_ai_preferences |

---

## Document Map

| Need | Go to |
|------|-------|
| FR specs | [Volume 3 — FR-1300](03-functional-requirements.md) |
| Schema | [Volume 4 — Ch. 18](04-database-architecture.md) |
| Copilot UX | [Volume 2 — Ch. 11](02-user-experience.md) |
| Security | [Volume 8](08-security.md) |
| QA gates | [Volume 9](09-testing-quality.md) |

---

*Previous: [Volume 4 — Data Architecture & Database](04-database-architecture.md) | Next: [Volume 6 — Technical Architecture](06-technical-architecture.md)*
