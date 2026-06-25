# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 16 — AI Operating System, Prompt Registry & Intelligence Architecture

**Version 1.0**

---

## Who This Document Is For

Volume 16 is the **brain manual** — the **AI Operating System** for every AI capability. Volumes 0–15 define the application; Volume 16 defines the **intelligence behind it**.

| Role | Use this volume to… |
|------|---------------------|
| **AI engineers** | Engines, prompts, orchestration — no scattered prompts in code |
| **Product** | Maturity roadmap, human-in-the-loop rules |
| **QA** | Golden set, regression, prompt version gates |
| **Design** | Confidence UI, explainability copy |
| **Leadership** | Cost dashboard, founder intelligence |

**Related:** [Volume 5 — AI summary](05-ai-design.md) · [Volume 8 — AI privacy](08-security.md) · [Volume 13 — SM-OCR](13-state-machines.md) · [Volume 15 — AI messages](15-communication-engine.md)

Volume 5 owns **engine behavior summaries**; **Volume 16 is canonical** for the prompt registry, AI OS governance, and maturity model.

---

## ID Catalogs

| Catalog | Path | Purpose |
|---------|------|---------|
| **ENG-IDs** | [`ENGINE-INDEX.md`](../ai-catalog/ENGINE-INDEX.md) | 10 specialized engines |
| **PRM-IDs** | [`PROMPT-INDEX.md`](../ai-catalog/PROMPT-INDEX.md) | Versioned prompts — never only in source code |

**Code paths:** `packages/shared/src/ai/` · `supabase/functions/_shared/prompts/` · Edge Function orchestrator

---

# Part I — AI Philosophy

## Chapter 1 — Purpose

The AI exists for one reason:

> **Reduce administrative work while increasing accuracy and user confidence.**

| Role | AI | Human |
|------|-----|-------|
| Decision maker | ✗ | ✓ |
| Assistant | ✓ | — |
| Approves financial records | ✗ | ✓ |

---

## Chapter 2 — AI Mission

The AI should:

* Reduce typing
* Reduce forgotten receipts
* Reduce duplicate work
* Reduce reporting time
* Increase organization
* Explain recommendations
* Learn user preferences over time
* **Never create uncertainty**

---

## Chapter 3 — AI Doctrine

**Behave like:**

* An experienced executive assistant
* An organized office manager
* A meticulous travel coordinator

**Not like:**

* A tax advisor · lawyer · financial planner
* A chatbot trying to sound human

**Tone:** Professional, calm, precise (Volume 15 MSG-AI templates).

---

# Part II — AI Architecture

## Chapter 4 — AI Engine Registry

Ten specialized engines — not one monolithic prompt. Each has **ENG-ID**, independent versioning, and interface in `packages/shared/src/ai/engines/`.

```
                    ┌─────────────────────────┐
                    │  Copilot Orchestrator   │
                    │  process-receipt, etc.  │
                    └───────────┬─────────────┘
        ┌──────────┼──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼          ▼
   ENG-OCR   ENG-MERCH  ENG-CAT   ENG-TRIP  ENG-DUP
        │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼
   ENG-REM   ENG-RPT   ENG-SRCH  ENG-MEM  ENG-PROD
```

| ENG-ID | Engine | V1 | Primary API |
|--------|--------|-----|-------------|
| ENG-OCR | Receipt Intelligence | ✓ | API-RCP-002 |
| ENG-MERCH | Merchant Intelligence | ✓ | part of OCR |
| ENG-CAT | Category Intelligence | ✓ | API-AI-001 |
| ENG-TRIP | Trip Intelligence | ✓ | API-DSH-003 |
| ENG-DUP | Duplicate Detection | ✓ | API-AI-002 |
| ENG-REM | Reminder Intelligence | ✓ | cron + notifications |
| ENG-RPT | Report Intelligence | ✓ | API-RPT-001 |
| ENG-SRCH | Search Intelligence | V1.1 | API-SRH-001 |
| ENG-MEM | Personal Memory | ✓ | preferences store |
| ENG-PROD | Product Intelligence | internal | admin only |

**Rule:** Engines evolve independently; orchestrator routes by ENG-ID.

---

# Part III — Prompt Registry

## Chapter 5 — Prompt Standards

Every prompt (**PRM-ID**) documents:

| Field | Required |
|-------|----------|
| PRM-ID | e.g. PRM-OCR-001 |
| Name | Human-readable |
| Version | semver |
| Owner | team / role |
| Purpose | One sentence |
| Engine | ENG-ID |
| Inputs | typed list |
| Outputs | JSON schema name |
| Safety rules | bullet list |
| Expected confidence | per field targets |
| Fallback behavior | on failure / low confidence |
| Test cases | golden fixture refs |
| Changelog | version history |

**Location:** `supabase/functions/_shared/prompts/{prm-id}.{version}.yaml`  
**No prompt exists only in application code.**

---

## Chapter 6 — Receipt OCR Prompt

**PRM-ID:** PRM-OCR-001 · **ENG-OCR** · model: `gpt-4o` (vision)

| Field | Spec |
|-------|------|
| Purpose | Extract structured data from receipt image |
| Inputs | `image_url`, `locale`, `currency_preference` |
| Outputs | merchant, date, total, tax?, category_hint, confidence per field |

**Safety:**

* Never fabricate unreadable values — `null` + confidence `0`
* Total = amount **due**, not subtotal
* Handwritten → confidence ≤ 0.5

**Canonical system rules (v1.0.0):**

```
Extract ONLY visible text. Respond ONLY with valid JSON matching ReceiptOcrSchema.
You are not a tax advisor. Do not suggest deductibility.
```

**Fallback:** Return `ocr_failed` → manual entry SCR-024 (SM-OCR `failed`).

**Tests:** `tests/fixtures/receipts/golden/` — Volume 16 Ch. 21

---

## Chapter 7 — Merchant Recognition Prompt

**PRM-ID:** PRM-MERCH-001 · **ENG-MERCH**

| Step | Example |
|------|---------|
| Raw OCR | `SHELL #347` |
| Normalized | `Shell` |
| Type | `fuel` / `gas_station` |

**Rule:** Store `merchant_raw` separately from `merchant_normalized` (Volume 4).

Never overwrite raw text with normalized value.

---

## Chapter 8 — Expense Categorization Prompt

**PRM-ID:** PRM-CAT-001 · **ENG-CAT**

**Output schema:**

```json
{
  "primary": { "slug": "fuel", "confidence": 0.91, "explanation": "..." },
  "alternatives": [{ "slug": "parking", "confidence": 0.4 }]
}
```

Categories: fuel, parking, toll, meal, hotel, airfare, supplies, equipment, other.

Moderate/low confidence → show alternatives in UI (Volume 10 `AISuggestionPanel`).

---

## Chapter 9 — Duplicate Detection Prompt

**PRM-ID:** PRM-DUP-001 · **ENG-DUP**

**Compare signals:**

| Signal | Weight |
|--------|--------|
| Merchant similarity | high |
| Amount match | high |
| Date proximity | medium |
| Image fingerprint | medium |
| Trip association | low |

**Output:** `duplicate_probability`, `reasoning`, `recommendation: review|ignore`

**Never delete duplicates automatically** — user confirms (Volume 8 non-negotiable).

---

## Chapter 10 — Missing Receipt Prompt

**PRM-ID:** PRM-REM-001 · **ENG-REM**

Evaluate **completed trips** for patterns:

| Pattern | Reminder |
|---------|----------|
| Long trip, no fuel | MSG-AI-003 |
| Hotel stay, no lodging | suggest category |
| Airport, no parking | optional |
| Multi-day, no meals | soft suggestion |

Present as **reminders**, not assumptions. MSG-IDs in Volume 15.

---

# Part IV — AI Memory

## Chapter 11 — Personal Learning Model

**ENG-MEM** learns (per user, private):

| Preference | Storage |
|------------|---------|
| Category overrides | `user_ai_preferences` |
| Frequent merchants | `merchant_knowledge` |
| Common trip purposes | `user_travel_patterns` |
| Favorite clients | autocomplete ranking |
| Typical routes | trip history aggregates |
| Default vehicle patterns | implicit |

**Rule:** Learning improves **future suggestions** — never rewrites historical records.

Correction → `ai_correction_log` → preference update.

---

## Chapter 12 — Memory Boundaries

**Never infer:**

* Personal beliefs · sensitive attributes · health status · financial condition

**Only learn** data directly relevant to expense documentation.

Users: **review and reset** preferences in SCR-050 / settings.

GDPR export includes `user_ai_preferences`; delete on account deletion.

---

# Part V — AI Decision Framework

## Chapter 13 — Confidence Levels

Every AI response includes per-field and overall confidence:

| Band | Range | UI |
|------|-------|-----|
| **High** | ≥ 0.85 | default styling |
| **Medium** | 0.60–0.84 | subtle highlight |
| **Low** | < 0.60 | amber border + review required |

Display via `ConfidenceBadge` (Volume 10). User review **required** before save for any field < 0.70 on financial fields.

---

## Chapter 14 — Explainability

Every recommendation answers:

| Question | Field |
|----------|-------|
| What did I recommend? | `suggestion` |
| Why? | `explanation` |
| How confident? | `confidence` |
| What evidence? | `evidence[]` optional |

MSG-AI-001 pattern (Volume 15). Logged to `ai_interaction_log`.

---

## Chapter 15 — Human Approval Rules

| AI may | AI may not |
|--------|------------|
| Suggest | Submit reports |
| Highlight | Delete financial records |
| Recommend | Change totals or mileage |
| Organize | Approve expenses |
| | Send reports without user action |

All writes flow through SCR-024 confirm → SM-RCP `approved`.

---

# Part VI — AI Safety

## Chapter 16 — Hallucination Prevention

When information cannot be determined:

> "I couldn't determine this from the receipt."

**Never invent:** totals · dates · merchants · taxes · mileage · categories with false certainty.

Structured output + Zod validation + null defaults.

---

## Chapter 17 — AI Safety Rules

The AI must **never:**

* Give tax advice
* Give legal advice
* Estimate deductions
* Alter user records silently
* Hide uncertainty
* Pretend confidence

**Banned phrases (post-filter):** "deductible", "IRS allows", "you should claim", "tax savings guaranteed"

Volume 5 Ch. 19 · Volume 8 AI privacy.

---

# Part VII — AI Analytics

## Chapter 18 — Prompt Performance

Per **PRM-ID** track:

| Metric | Source |
|--------|--------|
| Execution time | Edge Function logs |
| Success rate | completed / invoked |
| Correction rate | Volume 14 Ch. 10 |
| User acceptance | EVT `ai_suggestion_accepted` |
| Failures | `ocr_failed` count |
| Cost per request | tokens × price |

Stored in `ai_interaction_log` + aggregates for admin.

---

## Chapter 19 — Prompt A/B Testing

```
PRM-OCR-001 (A)  vs  PRM-OCR-002 (B)
```

Compare: accuracy · user satisfaction · processing time · cost

**Assignment:** 10% canary on staging; 5% production max until winner.

Winner promoted → version bump → golden set must pass.

---

## Chapter 20 — AI Cost Dashboard

| Metric | Alert |
|--------|-------|
| Requests / day | — |
| Tokens / request | P95 |
| Cost per user / month | > $0.50 Free, > $2 Pro |
| Cost per feature | OCR vs classify |
| Cost per tier | sustainability |

**Target:** AI COGS < 15% of Pro MRR at scale (Volume 7).

Admin: SCR-055 + ENG-PROD internal views.

---

# Part VIII — AI Testing

## Chapter 21 — Golden Test Set

Permanent library in `tests/fixtures/receipts/golden/`:

| Category | Count (V1) |
|----------|------------|
| Fuel | 10 |
| Hotel | 8 |
| Restaurant | 10 |
| Parking / toll | 6 |
| Airfare | 4 |
| Handwritten | 5 |
| Low-quality / faded | 10 |
| Foreign currency | 5 |
| Multi-language | future |

**Every prompt change** runs golden set in CI — Volume 9 OCR gate.

---

## Chapter 22 — Regression Testing

Changing one PRM-ID must not reduce:

* Merchant accuracy
* Category accuracy
* OCR field accuracy
* User correction rate (staging shadow)

Cross-engine: PRM-CAT change must not break PRM-OCR pipeline.

---

# Part IX — AI Governance

## Chapter 23 — Prompt Versioning

Each PRM-ID records:

| Field | Example |
|-------|---------|
| Version | 1.0.0 → 1.1.0 |
| Author | engineer |
| Release date | ISO date |
| Change summary | "Improved handwritten totals" |
| Test results | golden pass % |
| Rollback | previous YAML tag |

Logged in `ai_interaction_log.prompt_version` on every call.

**Same discipline as code changes** — PR requires PROMPT-INDEX update.

---

## Chapter 24 — Prompt Review Process

Before production deploy:

| Review | Checks |
|--------|--------|
| Technical | schema, latency, cost |
| Product | UX impact, copy |
| Safety | Ch. 16–17, banned phrases |
| QA | golden set green |
| Performance | vs prior version |

No PRM goes live without **all sign-offs** (Volume 9 launch gate).

---

# Part X — Future AI

## Chapter 25 — Conversational Assistant

Future **ENG-CONV** — natural language over same engines:

* "Show me my mileage from last month."
* "Find my fuel receipts."
* "Generate a reimbursement report."

Routes to ENG-SRCH, ENG-RPT — not a separate undocumented prompt stack.

---

## Chapter 26 — Voice Intelligence

Future hands-free:

* "Start a trip." · "End my trip." · "Attach this receipt."

Safety: confirm destructive actions · no financial commits by voice alone.

---

## Chapter 27 — Predictive Intelligence

Pattern recognition (Level 4–5 maturity):

* Weekly client visits
* Regular travel schedules
* Recurring expenses

**Suggest only** — user always in control.

---

# Part XI — Internal AI

## Chapter 28 — Founder Intelligence

**ENG-PROD** dashboards answer:

* Where is OCR struggling?
* Which merchants cause confusion?
* Which PRM-IDs generate most corrections?
* What to improve next?

Internal only — no customer PII in aggregate views.

---

## Chapter 29 — Support Intelligence

Assist support staff:

* Ticket summarization
* Recurring issue detection
* Doc update suggestions

Customer-facing actions require **human oversight**.

---

# Part XII — AI Readiness

## Chapter 30 — Version 1 AI Checklist

Before launch:

| # | Item |
|---|------|
| 1 | [ ] PROMPT-INDEX complete for V1 PRM-IDs |
| 2 | [ ] All prompts versioned in YAML |
| 3 | [ ] Golden test suite passing |
| 4 | [ ] Confidence indicators in SCR-024 |
| 5 | [ ] Explanation UI (MSG-AI-001) |
| 6 | [ ] Human approval workflow verified |
| 7 | [ ] Cost monitoring enabled |
| 8 | [ ] AI analytics in `ai_interaction_log` |
| 9 | [ ] Safety review complete |
| 10 | [ ] Volume 8 AI privacy checklist |

---

## Chapter 31 — AI Non-Negotiables

| # | Rule |
|---|------|
| 1 | AI always suggests; users decide |
| 2 | AI never fabricates financial data |
| 3 | AI always communicates uncertainty |
| 4 | AI always explains meaningful recommendations |
| 5 | AI never changes records without approval |
| 6 | AI prompts are versioned and documented |
| 7 | AI quality is measured continuously |
| 8 | AI behavior is reproducible and auditable |
| 9 | No prompts only in source code |
| 10 | No cross-tenant data in prompts |

---

## Chapter 32 — AI Maturity Roadmap

| Level | Capability |
|-------|------------|
| **1** (V1) | Receipt OCR + categorization |
| **2** | Personalized merchant/category learning |
| **3** | Workflow reminders + intelligent search |
| **4** | Predictive travel/expense assistance |
| **5** | Business insights + optimization |
| **6** | Administrative copilot — orchestrates routine tasks; user retains all financial decisions |

Ship level-by-level — never skip human-in-the-loop.

---

## Chapter 33 — The AI Constitution

> **If the AI disappeared tomorrow, the application would still function correctly. If the AI is present, it should make every workflow faster, clearer, and easier—without ever reducing the user's control or confidence.**

AI is a **force multiplier**, not a dependency. Trustworthy, maintainable, valuable regardless of how AI technology evolves.

---

## Cross-Reference Index

| Volume | Link |
|--------|------|
| Volume 5 | Engine behavior detail |
| Volume 4 | `ocr_results`, `ai_suggestions`, preferences tables |
| Volume 9 | Golden set, launch gates |
| Volume 14 | AI performance metrics |
| Volume 15 | AI user messaging |

---

## Document Map

| Need | Go to |
|------|-------|
| Prompt files | [PROMPT-INDEX.md](../ai-catalog/PROMPT-INDEX.md) |
| Engines | [ENGINE-INDEX.md](../ai-catalog/ENGINE-INDEX.md) |
| Golden fixtures | `tests/fixtures/receipts/golden/` |
| Copilot UX | [Volume 10 Ch. 24](10-design-system.md) |

---

*Previous: [Volume 15 — Communication Engine](15-communication-engine.md) | Return to [Blueprint Index](README.md)*
