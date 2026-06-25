# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 22 — Platform Architecture, Ecosystem & Long-Term Evolution

**Version 1.0**

---

## Who This Document Is For

Volumes **0–21** describe how to build and launch the application. **Volume 22** describes how the application becomes something that can grow for **10+ years without a rewrite** — turning a product into a **platform**.

| Role | Use this volume to… |
|------|---------------------|
| **Architects** | Layer boundaries, domain ownership, extension points |
| **Engineers** | Module contracts, integration adapters, AI decoupling |
| **Product** | Platform maturity roadmap, product family vision |
| **Leadership** | Platform Council decisions, long-term capital allocation |

**Related:** [Volume 4 — Data](04-database-architecture.md) · [Volume 6 — Technical](06-technical-architecture.md) · [Volume 12 — API](12-api-architecture.md) · [Volume 16 — AI OS](16-ai-operating-system.md) · [Volume 20 — Evolution](20-product-evolution-roadmap.md) · [Volume 21 — Construction](21-construction-manual.md)

**Volume 22 is canonical** for platform layers, domain modules, plugin architecture, integration standards, and the Platform Standard. V1 implements a **focused subset**; V22 ensures every V1 decision preserves the future.

---

## Platform Catalog

Permanent **PLT-IDs** for layers, domains, modules, and shared services.

Tracker: [`docs/platform/PLT-INDEX.md`](../platform/PLT-INDEX.md)

---

# Part I — Platform Philosophy

## Chapter 1 — Purpose

The goal is not to build a mileage app.

The goal is to build a **platform** that can expand into the complete operating system for business travel, field work, and expense management.

| Horizon | Platform state |
|---------|----------------|
| V1 | Focused SaaS — prove core loops |
| V2–3 | Integrated platform — teams, APIs |
| V5+ | Multi-product OS — shared services |

> Every Version 1 decision should **preserve that future**.

---

## Chapter 2 — Platform Principles

The platform must be:

| Principle | V1 manifestation |
|-----------|------------------|
| **Modular** | `packages/*` domain modules |
| **API-first** | Volume 12 envelope; no UI-only logic |
| **AI-native** | ENG layer; suggestions not prerequisites |
| **Mobile-first** | Volume 18 canonical |
| **Offline-capable** | SM-SYNC, IndexedDB |
| **Secure by default** | RLS, Volume 8 |
| **Observable** | EVT, OPS-MON, audit |
| **Extensible** | Plugin hooks, feature flags |

Every capability **plugs in** — never forces redesign.

---

# Part II — Platform Architecture

## Chapter 3 — Platform Layers

**PLT-LAYER-*** — independent evolution per layer.

```
┌─────────────────────────────────────────┐
│  PLT-LAYER-EXP   Experience             │  Web · Mobile PWA · Tablet
├─────────────────────────────────────────┤
│  PLT-LAYER-BIZ   Business Logic         │  Trips · Expenses · Receipts · Reports
├─────────────────────────────────────────┤
│  PLT-LAYER-INTEL Intelligence           │  OCR · AI · Recommendations · Memory
├─────────────────────────────────────────┤
│  PLT-LAYER-INT   Integration            │  APIs · Webhooks · Third-party adapters
├─────────────────────────────────────────┤
│  PLT-LAYER-DATA  Data                   │  Postgres · Storage · Analytics · Audit
└─────────────────────────────────────────┘
```

**Rule:** Upper layers call lower through **defined contracts** — never skip layers (e.g. UI → raw OpenAI).

| Layer | Package path (target) |
|-------|----------------------|
| Experience | `apps/web/` |
| Business | `packages/domain/*` |
| Intelligence | `supabase/functions/_shared/ai/` |
| Integration | `packages/integrations/` |
| Data | `supabase/migrations/`, Storage |

---

## Chapter 4 — Domain Architecture

**PLT-DOM-*** — each domain owns its bounded context.

| PLT-DOM-ID | Domain | Tables | API prefix | Owner artifact |
|------------|--------|--------|------------|----------------|
| PLT-DOM-AUTH | Authentication | profiles, auth | API-AUTH-* | `packages/domain/auth` |
| PLT-DOM-USER | Users | profiles | API-AUTH-008+ | shared |
| PLT-DOM-BIZ | Businesses | businesses | API-BIZ-* | `business` |
| PLT-DOM-VEH | Vehicles | vehicles, odometer | API-VEH-* | `vehicle` |
| PLT-DOM-TRIP | Trips | trips, trip_notes | API-TRIP-* | `trip` |
| PLT-DOM-RCP | Receipts | receipts, ocr_results | API-RCP-* | `receipt` |
| PLT-DOM-EXP | Expenses | expenses, categories | API-EXP-* | `expense` |
| PLT-DOM-RPT | Reports | reports | API-RPT-* | `report` |
| PLT-DOM-BILL | Billing | subscriptions, usage | API-SUB-* | `billing` |
| PLT-DOM-AI | AI | ai_suggestions, ocr | functions | `ai` |
| PLT-DOM-NOTIF | Notifications | notifications | — | `notification` |
| PLT-DOM-ANALYTICS | Analytics | business_events | EVT-* | `analytics` |
| PLT-DOM-ADMIN | Admin | admin_audit_logs | API-ADM-* | `admin` |

Each domain owns: **schema · APIs · business rules · tests · docs**.

Cross-domain: **events** (`business_events`) not direct table writes.

---

# Part III — Modular Design

## Chapter 5 — Module Registry

### V1 modules (**PLT-MOD-***)

| PLT-MOD-ID | Module | WAVE | Status V1 |
|------------|--------|------|-----------|
| PLT-MOD-AUTH | Authentication | WAVE-001 | ✓ |
| PLT-MOD-DASH | Dashboard | WAVE-001 | ✓ |
| PLT-MOD-TRIP | Trips | WAVE-003 | ✓ |
| PLT-MOD-RCP | Receipts | WAVE-004 | ✓ |
| PLT-MOD-EXP | Expenses | WAVE-005 | ✓ |
| PLT-MOD-RPT | Reports | WAVE-006 | ✓ |
| PLT-MOD-BILL | Billing | WAVE-007 | ✓ |
| PLT-MOD-SET | Settings | WAVE-002 | ✓ |
| PLT-MOD-AI | AI | WAVE-004/008 | ✓ |
| PLT-MOD-ADMIN | Admin | WAVE-009 | ✓ |

### Future modules (architecture hooks only)

| PLT-MOD-ID | Module | ROAD version |
|------------|--------|--------------|
| PLT-MOD-FLEET | Fleet | V3 |
| PLT-MOD-SCHED | Scheduling | V3 |
| PLT-MOD-MAINT | Maintenance | V3 |
| PLT-MOD-CRM | CRM | V2.5 |
| PLT-MOD-INV | Invoicing | V2.5 |
| PLT-MOD-COMP | Compliance | V3 |
| PLT-MOD-TIME | Time Tracking | V2 |
| PLT-MOD-TEAM | Team Management | V1.5 |

Modules communicate via **stable contracts** (API envelope, events, shared types in `packages/shared`).

---

## Chapter 6 — Plugin Architecture

**PLT-PLUGIN-*** — future installable capabilities.

| Plugin type | Example | Integration point |
|-------------|---------|-------------------|
| PLT-PLUGIN-RPT | Advanced reporting | Report generator adapter |
| PLT-PLUGIN-IND | Industry templates | `expense_categories` seed |
| PLT-PLUGIN-ENT | Enterprise approvals | SM extension + webhooks |
| PLT-PLUGIN-L10N | Localization packs | i18n resource bundles |
| PLT-PLUGIN-INT | Custom integrations | `packages/integrations/` |

**V1 hooks:**

* `feature_flags` — enable plugins per tenant
* `packages/shared/src/contracts/` — interface definitions
* Event bus (`business_events`) — plugin reactions

Core app stays **lean** — plugins add, never bloat core.

---

# Part IV — Data Architecture

## Chapter 7 — Canonical Data Model

Every platform object conforms to **PLT-DATA-001**:

| Property | Requirement |
|----------|-------------|
| Single source of truth | One owning domain table |
| Stable identifier | UUID `id`; `local_uuid` offline only |
| Ownership | `user_id` / `business_id` + RLS |
| Audit history | `audit_logs` on financial fields |
| Version history | Where needed: `vehicle_odometer_history`, report snapshots |
| Soft delete | `deleted_at` — never hard-delete financial records |

Avoid duplicate business logic — **domain services** compute; DB stores.

---

## Chapter 8 — Data Relationships

Canonical entity graph (Volume 4 complement):

```
profiles ──► businesses ──► vehicles
                │              │
                ├── clients ───┼──► trips ──► trip_notes
                │              │       │
                └── projects     │       ├── expenses
                                 │       └── receipts ──► ocr_results
                                 │
                                 └── reports (aggregates)
```

| Relationship | Rule |
|--------------|------|
| User → Business | 1:n; default business on profile |
| Trip → Receipt | n:1 optional; attach/detach audited |
| Trip → Expense | 1:n; totals denormalized via trigger |
| Receipt → Expense | 1:1 optional |
| Report → Trip/Expense | Snapshot at generation — immutable |

Referential integrity via FK + soft-delete policy (Volume 4 Ch. 12).

---

# Part V — Integration Ecosystem

## Chapter 9 — External Integration Strategy

**PLT-INT-*** — all optional; adapter pattern.

| PLT-INT-ID | Integration | Version | Adapter |
|------------|-------------|---------|---------|
| PLT-INT-ACCT | QuickBooks / Xero | V2 | `integrations/accounting` |
| PLT-INT-CAL | Google / Outlook Calendar | V2 | `integrations/calendar` |
| PLT-INT-STO | Drive / Dropbox export | V2 | `integrations/storage` |
| PLT-INT-IDP | SAML / OIDC | V2.5 | Supabase SSO |
| PLT-INT-FLEET | Fleet management | V3 | Partner API |
| PLT-INT-TRAVEL | Travel booking | V3+ | Evaluate demand |

No integration blocks core offline trip capture.

---

## Chapter 10 — Integration Standards

**PLT-INT-STD-001** — every integration defines:

| Concern | Standard |
|---------|----------|
| Authentication | OAuth 2.0 / API key in secrets vault |
| Permissions | Scoped tokens; user consent UI |
| Rate limits | Respect provider; internal queue |
| Error handling | Volume 12 envelope; retry with backoff |
| Retry policy | Idempotent keys; max 5 retries |
| Monitoring | OPS-MON + integration health dashboard |
| Version compatibility | Pin API version; deprecation window |

**Never bypass** RLS or store third-party tokens in client bundle.

---

# Part VI — AI Ecosystem

## Chapter 11 — AI Service Layer

**PLT-AI-SVC-*** — separate services (Volume 16 ENG alignment):

| Service | ENG | Swappable |
|---------|-----|-----------|
| OCR | ENG-OCR | Provider adapter |
| Classification | ENG-CAT | Model version |
| Search | ENG-SRCH | Embedding provider |
| Recommendations | ENG-REM, ENG-TRIP | Rules + model |
| Forecasting | future | — |
| Conversational | future | — |

Interface: `packages/shared/src/ai/contracts.ts` — input/output types stable across providers.

---

## Chapter 12 — AI Model Independence

**PLT-AI-RULE-001**

| Belongs to application | Belongs to AI |
|------------------------|---------------|
| Mileage calculation | OCR text extraction |
| Tax categorization rules (user confirm) | Suggested category |
| Duplicate thresholds (user confirm) | Similarity score |
| Report totals | Narrative summary |

> Never couple business logic to a specific model.  
> Business rules → application. AI → **suggestions**.

Protects against OpenAI pricing, model deprecation, on-device future.

PRM files are **configuration**, not code paths.

---

# Part VII — Developer Platform

## Chapter 13 — SDK Strategy

**PLT-SDK-*** — future; wrap public API only.

| SDK | Language | Priority |
|-----|----------|----------|
| PLT-SDK-TS | TypeScript / JavaScript | V2.5 |
| PLT-SDK-SWIFT | Swift | V3 |
| PLT-SDK-KOTLIN | Kotlin | V3 |
| PLT-SDK-PY | Python | V3 (integrations) |

SDKs expose **API-IDs** — never internal `supabase` client patterns.

---

## Chapter 14 — Developer Portal

**PLT-DEV-PORTAL** — future (ROAD-API V2.5):

* OpenAPI spec generated from API-INDEX
* Interactive explorer
* Sample apps (trip + receipt flow)
* Tutorials · Changelog · Status page

Developers are **customers** of the platform.

---

# Part VIII — Marketplace

## Chapter 15 — Template Marketplace

**PLT-MKT-TPL** — downloadable assets:

| Asset | Format |
|-------|--------|
| Report templates | JSON + Handlebars |
| Expense category packs | SQL seed / JSON |
| Industry presets | Feature flag bundle |
| Workflow templates | SM definitions |

Users adopt best practices without blank-slate setup.

---

## Chapter 16 — Extension Marketplace

**PLT-MKT-EXT** — vertical extensions on same core:

| Extension | Base modules |
|-----------|--------------|
| Construction Copilot | Trips + receipts + job sites |
| Sales Travel Copilot | CRM + trips + clients |
| Healthcare field visits | Compliance + trips |
| Consulting engagements | Projects + time |

Each extension = **PLT-MOD-*** pack + templates — not forked codebase.

---

# Part IX — Enterprise Evolution

## Chapter 17 — Multi-Tenant Architecture

**PLT-TENANT-*** — V1 single-user behavior; schema anticipates orgs.

| Concept | V1 hook | V2+ implementation |
|---------|---------|---------------------|
| Organization | `organizations` table stub optional | Parent of businesses |
| Department | `department_id` nullable | Hierarchy |
| Team | `employees` table | Roles |
| Regional admin | `app_metadata.role` | Scoped RLS |
| Delegated mgmt | Volume 17 Ch. 28 | Org admin UI |

RLS pattern: `organization_id` → `business_id` → `user_id` chain.

---

## Chapter 18 — Enterprise Governance

**PLT-GOV-ENT-*** future:

| Capability | Mechanism |
|------------|-----------|
| Approval workflows | SM extension + notifications |
| Policy enforcement | Rules engine (Ch. 20) |
| Expense limits | `policy_rules` table |
| Audit exports | ADM-AUDIT bulk |
| Compliance reporting | PLT-MOD-COMP |

Governance **configurable** — not hardcoded per customer in code.

---

# Part X — Global Expansion

## Chapter 19 — Internationalization

**PLT-I18N-*** — Volume 20 Ch. 18 hooks:

| Dimension | Implementation |
|-----------|----------------|
| Currencies | `currency` ISO code on amounts |
| Languages | `next-intl` or i18n keys |
| Time zones | `timestamptz` + user preference |
| Regional formats | `Intl` APIs |
| Mileage standards | `mileage_rates` per region |
| Tax terminology | Copy keys |

Localization = **resource packs**, not duplicated business logic.

---

## Chapter 20 — Regional Rules Engine

**PLT-RULES-*** — future configurable rules:

| Rule type | Example |
|-----------|---------|
| Mileage reimbursement | IRS vs UK HMRC |
| Expense policies | Per diem caps |
| Holiday calendars | Locale-aware |
| Country reporting | VAT vs sales tax |

Storage: `policy_rules` JSON schema — evaluated in domain layer, not UI.

---

# Part XI — Platform Operations

## Chapter 21 — Platform Monitoring

Extend Volume 19 OPS-MON per **module**:

| Signal | PLT-MOD |
|--------|---------|
| API latency by domain | All PLT-DOM-* |
| Integration health | PLT-INT-* |
| AI service P95 | PLT-AI-SVC-* |
| Queue depth by type | OCR, sync, reports |
| Storage by bucket | receipts |

Dashboard: ADM-INFRA + future `PLT-OPS-DASH`.

---

## Chapter 22 — Platform Governance

**PLT-GOV-NEW-MOD-001** — every new module requires:

| Review | Owner |
|--------|-------|
| Architecture | Platform Council |
| Security | Volume 8 checklist |
| API | Volume 12 constitution |
| Documentation | PLT-INDEX + API-INDEX |
| Test plan | Volume 9 pyramid |
| Migration strategy | Supabase migration ADR |

Platform consistency = competitive advantage.

---

# Part XII — Future Products

## Chapter 23 — Product Family

**PLT-PROD-*** — shared platform core:

| Product | PLT-PROD-ID | Differentiator |
|---------|-------------|----------------|
| Mileage & Expense Copilot | PLT-PROD-MEC | V1 — core |
| Fleet Copilot | PLT-PROD-FLEET | Vehicles + maintenance |
| Field Operations Copilot | PLT-PROD-FIELD | Jobs + scheduling |
| Consultant Copilot | PLT-PROD-CONSULT | Projects + billing |
| Construction Copilot | PLT-PROD-CONST | Sites + compliance |
| Sales Travel Copilot | PLT-PROD-SALES | CRM + routes |

Same auth, billing, AI, storage — different **module bundles**.

---

## Chapter 24 — Shared Services

**PLT-SVC-*** — build once, reuse everywhere:

| PLT-SVC-ID | Service | Never duplicate |
|------------|---------|-----------------|
| PLT-SVC-AUTH | Authentication | ✓ |
| PLT-SVC-BILL | Billing / Stripe | ✓ |
| PLT-SVC-NOTIF | Notifications | ✓ |
| PLT-SVC-AI | AI orchestration | ✓ |
| PLT-SVC-ANALYTICS | EVT pipeline | ✓ |
| PLT-SVC-RPT | Report engine | ✓ |
| PLT-SVC-AUDIT | Audit + events | ✓ |
| PLT-SVC-STO | Object storage | ✓ |

New products **compose** shared services — never rebuild Stripe integration.

---

# Part XIII — Technical Evolution

## Chapter 25 — Architecture Review Cycle

**PLT-REVIEW-6MO** — every six months (align Volume 20 Ch. 25):

* Scalability · Maintainability · Performance · Security · DX

Output: `docs/platform/reviews/YYYY-H.md`

Refactor **before** debt forces rewrite.

---

## Chapter 26 — Deprecation Policy

**PLT-DEPRECATE-001** (align Volume 20 Ch. 30):

1. Announce (90 days minimum)
2. Migration path + tooling
3. Compatibility shim period
4. Remove after documented timeline
5. CHANGELOG + API version bump

Predictability builds trust.

---

# Part XIV — Innovation Strategy

## Chapter 27 — Research Pipeline

**PLT-RESEARCH-*** backlog separate from ROAD committed work:

| Source | Bucket |
|--------|--------|
| Emerging AI | `docs/platform/research/ai/` |
| Mobile / hardware | MOB-FF-* evaluation |
| Integrations | Partner inquiries |
| Customer requests | ROAD admission queue |
| Industry trends | Competitive review |

Research → experiment (Ch. 28) → roadmap — never skip gates.

---

## Chapter 28 — Experimentation Framework

Align Volume 20 ROAD-EXP-001 + Volume 21 Wave discipline:

| Property | Requirement |
|----------|-------------|
| Opt-in | Feature flag |
| Measured | EVT + success criteria |
| Time-boxed | Max 8 weeks |
| Reversible | Flag off = instant rollback |

Success → standard roadmap. Failure → documented learning.

---

# Part XV — Platform Success

## Chapter 29 — Platform KPIs

Measure **platform health**, not just app usage:

| KPI | Source |
|-----|--------|
| Module adoption | EVT per PLT-MOD |
| Integration usage | PLT-INT-* counters |
| API reliability | OPS-SLO-API |
| Platform stability | Incident rate by domain |
| Extension adoption | Marketplace downloads |
| Enterprise growth | Org count |
| Customer retention | Cohort (Volume 20) |

Feed Volume 17 ADM-EXEC.

---

## Chapter 30 — Platform Maturity Model

| Level | Name | Characteristics | Target |
|-------|------|-----------------|--------|
| 1 | Standalone SaaS | Single product, no public API | V1 launch |
| 2 | Integrated SaaS | Calendar, accounting export | V2 |
| 3 | Extensible platform | Plugins, templates | V2.5 |
| 4 | Partner ecosystem | SDK, marketplace | V3 |
| 5 | Multi-product OS | PLT-PROD-* family | V4+ |

Current target: **Level 1 at launch**, Level 2 within 18 months.

---

# Part XVI — Strategic Governance

## Chapter 31 — Platform Council

Before major architectural changes, **Platform Council** reviews:

| Factor | Question |
|--------|----------|
| Customer impact | Who benefits / harmed? |
| Engineering complexity | Worth the debt? |
| Security | Volume 8 implications? |
| Operational cost | OPS impact? |
| Maintainability | 5-year view? |

Council: founder + lead eng (+ product when staffed).  
Decisions → ADR in `docs/architecture/decisions/`.

---

## Chapter 32 — Platform Constitution

Every architectural decision preserves:

| Value | Test |
|-------|------|
| Modularity | Can module ship independently? |
| Simplicity | V1 scope guarded? |
| Reliability | SLO impact? |
| Security | RLS + audit intact? |
| Extensibility | Plugin point exists? |

> **The platform is more valuable than any individual feature.**

---

# Part XVII — Version 1 Readiness

## Chapter 33 — Platform Checklist

Before V1 launch:

| # | Item |
|---|------|
| 1 | [ ] PLT-INDEX module boundaries documented |
| 2 | [ ] PLT-SVC-* shared services identified in code layout |
| 3 | [ ] PLT-INT-STD integration adapter pattern stubbed |
| 4 | [ ] AI separated from business logic (PLT-AI-RULE-001) |
| 5 | [ ] Plugin extension points in `packages/shared/contracts` |
| 6 | [ ] PLT-GOV-NEW-MOD process documented |
| 7 | [ ] Scalability review (Volume 19 capacity) |
| 8 | [ ] Technical roadmap through V2 in ROAD-INDEX |

---

## Chapter 34 — Platform Non-Negotiables

| # | Rule |
|---|------|
| 1 | Never tightly couple modules |
| 2 | Never hardcode rules that should be configurable |
| 3 | Never embed integrations in core workflows |
| 4 | Never make AI prerequisite for basic functionality |
| 5 | Never duplicate shared services |
| 6 | Never sacrifice maintainability for shortcuts |
| 7 | Never cross domain boundaries without events/API |
| 8 | Never expose internal types in public API |
| 9 | Never skip Platform Council for new PLT-MOD |
| 10 | Never fork codebase for vertical products |

---

## Chapter 35 — The Platform Standard

> **Build today's product as though it will become tomorrow's platform.**

Version 1 should be **intentionally focused**, but every architectural decision should leave room for future products, integrations, and capabilities **without forcing a rewrite**.

---

## Blueprint Complete

When Volumes **0–22** are complete, you have:

| Layer | Volumes |
|-------|---------|
| Product | 0–16 |
| Company & field | 17–18 |
| Operations | 19 |
| Evolution | 20 |
| Construction | 21 |
| **Platform** | **22** |

Plus **[Master Build Index](../MASTER-BUILD-INDEX.md)** as control tower.

> From this point forward: **execute, validate, and improve** a well-defined vision.

**Begin:** Sign off → [Volume 21](21-construction-manual.md) WAVE-001 → STEP-027.

---

*Previous: [Volume 21 — Construction Manual](21-construction-manual.md) | [Master Build Index](../MASTER-BUILD-INDEX.md) | [Blueprint Index](README.md)*
