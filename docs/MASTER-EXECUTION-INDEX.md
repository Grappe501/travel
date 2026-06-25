# Mileage & Expense Copilot

# MASTER EXECUTION INDEX (MEI)

## The Construction Constitution

**Version 2.0** | *If you only open one document while building, open this.*

---

> **The 25 volumes are the library. The MEI is the construction schedule.**

| Document | Role |
|----------|------|
| Volumes 0–24 | **Library** — what, why, how it should feel |
| **This document (MEI)** | **Schedule** — what to build, in what order, status |
| [MRMS](requirements/MRMS.md) | **Requirements** — every MRID, test, release |
| [BUILD-LOG.md](../BUILD-LOG.md) | **Ledger** — every STEP with commit SHA |

**Owner:** Product + Engineering · **Update:** Every BUILD slice + every STEP  
**Traceability:** [BUILD-TRACEABILITY.md](BUILD-TRACEABILITY.md)

---

# SECTION 1 — PURPOSE

The Master Execution Index answers five questions:

| # | Question | MEI section |
|---|----------|-------------|
| 1 | What are we building? | §2, §6–11, [MRMS](requirements/MRMS.md) · [MRID-REGISTRY](requirements/MRID-REGISTRY.md) |
| 2 | What depends on what? | §5, §4 |
| 3 | What has been completed? | §3, §25 |
| 4 | What is currently being built? | §21 [Kanban](mei/MEI-KANBAN.md) |
| 5 | What comes next? | §4, [BUILD-INDEX](mei/BUILD-INDEX.md) |

**Every task traces back to the MEI.**

---

# SECTION 2 — MASTER PRODUCT VISION

**Mission** — Remove the administrative burden of documenting business travel.

**Vision** — Operating system for business mileage and expense management.

**Primary user** — The professional in the field who needs reliable records with minimal effort.

**Constitution** — [Volume 24](blueprint/24-product-constitution.md) · **Doctrine** — [Volume 0](blueprint/00-product-doctrine.md)

---

# SECTION 3 — MASTER BUILD STATUS

Executive progress dashboard. Update after every BUILD slice.

| Layer | MEI Phase | WAVE | Status | % |
|-------|-----------|------|--------|---|
| Product Constitution (blueprint) | 0 | — | ☑ | 100% |
| UX Foundation (blueprint) | 0 | — | ☑ | 100% |
| Design System | 4 | WAVE-001 | ⬜ | 0% |
| Database | 3 | WAVE-001–002 | ⬜ | 0% |
| Authentication | 2 | WAVE-001 | ⬜ | 0% |
| Core Business Objects | 5 | WAVE-002 | ⬜ | 0% |
| Trips | 6 | WAVE-003 | ⬜ | 0% |
| Receipts | 7 | WAVE-004 | ⬜ | 0% |
| OCR | 7 | WAVE-004 | ⬜ | 0% |
| Expense Engine | 8 | WAVE-005 | ⬜ | 0% |
| Reports | 9 | WAVE-006 | ⬜ | 0% |
| Billing | 10 | WAVE-007 | ⬜ | 0% |
| AI Layer | 11 | WAVE-008 | ⬜ | 0% |
| AdminOS | 12 | WAVE-009 | ⬜ | 0% |
| Analytics | 12 | WAVE-008+ | ⬜ | 0% |
| Notifications | 12 | WAVE-007+ | ⬜ | 0% |
| Testing | 13 | WAVE-010 | ⬜ | 0% |
| Launch Hardening | 14 | WAVE-010 | ⬜ | 0% |

**Overall V1 implementation:** 0% · **Blueprint:** 100% (Volumes 0–24)

---

# SECTION 4 — BUILD ORDER

Nothing out of sequence. Maps to [WAVE-INDEX](construction/WAVE-INDEX.md).

| Phase | Name | BUILD-IDs | Status |
|-------|------|-----------|--------|
| **0** | Planning — all blueprint volumes | STEP-001–028 | ☑ |
| **1** | Repository · CI/CD · env | BUILD-001 | ☐ |
| **2** | Authentication · users · permissions | BUILD-002 | ☐ |
| **3** | Database · tables · indexes · RLS | BUILD-002+ | ☐ |
| **4** | Design system · tokens · components | BUILD-003 | ☐ |
| **5** | Core objects — business, vehicle, client, project | BUILD-004 | ☐ |
| **6** | Trip engine — start, end, history, edit | BUILD-005 | ☐ |
| **7** | Receipt engine — camera, upload, storage, OCR, review | BUILD-007–008 | ☐ |
| **8** | Expense engine — categories, manual, linking | BUILD-009 | ☐ |
| **9** | Reports — PDF, CSV, Excel | BUILD-010 | ☐ |
| **10** | Billing — Stripe, plans, usage, limits | BUILD-011 | ☐ |
| **11** | AI — categorization, suggestions, memory | BUILD-012 | ☐ |
| **12** | AdminOS — support, monitoring, analytics | BUILD-013 | ☐ |
| **13** | Testing — full pyramid + UAT | BUILD-014 | ☐ |
| **14** | Launch — Alpha → GA | BUILD-014 | ☐ |

**Next:** BUILD-001 → **STEP-031** (Phase 1 / WAVE-001)

---

# SECTION 5 — MASTER DEPENDENCY GRAPH

| Module | Depends on | Required by | MRIDs |
|--------|------------|-------------|-------|
| **Trip Engine** | Auth, DB, Vehicles, Business | Reports, Expenses, AI, Analytics | 000004–000006 |
| **Receipt Engine** | Auth, DB, Storage, Trips (attach) | Expenses, OCR, Reports | 000007–000010 |
| **OCR** | Receipt storage, Edge Functions | Review UI, AI | 000008–000009 |
| **Expense Engine** | Trips, Receipts, Categories | Reports | 000011 |
| **Reports** | Trips, Expenses | Billing context, Admin | 000012–000013 |
| **Billing** | Auth, DB, Stripe | Limits on all write paths | 000014–000015 |
| **AI Layer** | OCR results, user corrections | Suggestions only — not prerequisites | 000018–000019 |
| **AdminOS** | All core APIs | Operations | 000020 |
| **Offline/Sync** | Trip + Receipt engines | Mobile (Vol 18) | 000016–000017 |

Full platform graph: [PLT-INDEX](platform/PLT-INDEX.md) · Rule: **no circular dependencies**.

---

# SECTION 6 — SCREEN REGISTRY

**Canonical IDs: SCR-###** (Volume 11). Do not create duplicate DASH/TRIP codes.

| User label | SCR-ID | Route | MRID | Dev | QA |
|------------|--------|-------|------|-----|-----|
| Dashboard | SCR-015 | `/dashboard` | — | ☐ | ☐ |
| Start Trip | SCR-019 | `/trips/start` | MRID-000004 | ☐ | ☐ |
| End Trip | SCR-020 | `/trips/[id]/end` | MRID-000005 | ☐ | ☐ |
| Trip History | SCR-017 | `/trips` | MRID-000006 | ☐ | ☐ |
| Receipt Scanner | SCR-031 | `/receipts/capture` | MRID-000007 | ☐ | ☐ |
| OCR Review | SCR-033 | `/receipts/[id]/review` | MRID-000008–000009 | ☐ | ☐ |
| Reports | SCR-040–041 | `/reports` | MRID-000012–000013 | ☐ | ☐ |
| Admin Dashboard | SCR-053 | `/admin` | MRID-000020 | ☐ | ☐ |

**Full catalog:** [screen-catalog/SCR-INDEX.md](screen-catalog/SCR-INDEX.md) (60 screens)

---

# SECTION 7 — COMPONENT REGISTRY

**Canonical: Volume 10** — use design system IDs in code, not duplicate registries.

| Component | Volume 10 | Usage |
|-----------|-----------|-------|
| Primary Button | `PrimaryButton` | CTAs |
| Dashboard Card | `TripCard`, `MileageWidget` | SCR-015 |
| Input Form | `TextField`, `SelectDropdown` | All forms |
| Data Table | Report tables | SCR-040+ |
| Confirmation Dialog | `Dialog` / `Sheet` | Deletes |
| Status Badge | Trip/receipt status chips | Lists |

**Rule:** No one-off components — extend Volume 10 only.

---

# SECTION 8 — DATABASE REGISTRY

**TBL codes** → Postgres tables. Full list: [mei/TBL-INDEX.md](mei/TBL-INDEX.md)

| TBL | Table | Volume 4 | Status |
|-----|-------|----------|--------|
| USR | profiles | Ch. profiles | ☐ |
| BUS | businesses | Ch. businesses | ☐ |
| VEH | vehicles | Ch. vehicles | ☐ |
| TRP | trips | Ch. trips | ☐ |
| REC | receipts | Ch. receipts | ☐ |
| EXP | expenses | Ch. expenses | ☐ |
| RPT | reports | Ch. reports | ☐ |
| SUB | subscriptions | Ch. subscriptions | ☐ |
| AUD | audit_logs | Ch. audit | ☐ |

MEI Section 3 tracks migration completion per layer.

---

# SECTION 9 — API REGISTRY

**Canonical IDs: API-###** (Volume 12).

| Capability | API-ID | MRID | Dev | Tests |
|------------|--------|------|-----|-------|
| Login | API-AUTH-002 | MRID-000001 | ☐ | ☐ |
| Current user | API-AUTH-008 | MRID-000001 | ☐ | ☐ |
| Start trip | API-TRIP-001 | MRID-000004 | ☐ | ☐ |
| End trip | API-TRIP-002 | MRID-000005 | ☐ | ☐ |
| Upload receipt | API-RCP-* | MRID-000007 | ☐ | ☐ |
| Generate report | API-RPT-* | MRID-000012 | ☐ | ☐ |
| Billing | API-SUB-* | MRID-000014 | ☐ | ☐ |
| AI suggestion | via Edge Fn | MRID-000018 | ☐ | ☐ |
| Admin lookup | API-ADM-001 | MRID-000020 | ☐ | ☐ |

**Full catalog:** [api-catalog/API-INDEX.md](api-catalog/API-INDEX.md) — each entry: volume, tests, permissions.

---

# SECTION 10 — AI REGISTRY

**Canonical: ENG-### / PRM-###** (Volume 16).

| Capability | ENG | PRM | MRID | V1 |
|------------|-----|-----|------|-----|
| Receipt OCR | ENG-OCR | PRM-OCR-001 | MRID-000008 | ✓ |
| Merchant | ENG-MERCH | PRM-MERCH-001 | — | ✓ |
| Category | ENG-CAT | PRM-CAT-001 | MRID-000018 | ✓ |
| Duplicate | ENG-DUP | PRM-DUP-001 | MRID-000019 | ✓ |
| Search | ENG-SRCH | — | — | V1.1 |

**Catalogs:** [ENGINE-INDEX](ai-catalog/ENGINE-INDEX.md) · [PROMPT-INDEX](ai-catalog/PROMPT-INDEX.md)

---

# SECTION 11 — TEST REGISTRY

| Prefix | Type | Volume 9 | Required for |
|--------|------|----------|--------------|
| **UT** | Unit | Pyramid base | Calculations, validators, SM logic |
| **IT** | Integration | API + DB + RLS | Every API-ID |
| **E2E** | End-to-end | Critical paths | MRID acceptance |
| **SEC** | Security | Vol 8 | RLS, auth boundaries |
| **ACC** | Accessibility | Vol 18 | SCR user-facing |
| **PERF** | Performance | OPS-PERF | Reports, dashboard |

**Rule:** No feature complete without mapped tests (FCT-TEST-001).

---

# SECTION 12 — BUILD SLICES

One slice = one Cursor session. **Catalog:** [mei/BUILD-INDEX.md](mei/BUILD-INDEX.md)

**Example — BUILD-005 Trip Engine**

| Field | Value |
|-------|-------|
| Scope | Start, end, edit, list |
| MRIDs | 000004–000006 |
| SCR | 017–020 |
| SM | SM-TRIP |
| Allowed | `packages/domain/trip`, `apps/web/.../trips` |
| Exit | E2E trip flow passes |

**Template:** [BUILD-SLICE-TEMPLATE.md](mei/BUILD-SLICE-TEMPLATE.md)

---

# SECTION 13 — CURSOR EXECUTION TEMPLATE

Every AI session: [mei/CURSOR-EXECUTION-TEMPLATE.md](mei/CURSOR-EXECUTION-TEMPLATE.md)

Mission · Context · Dependencies · Allowed/Forbidden files · Deliverables · Validation · Success · Commit · MEI update

Also: [AI-HANDOFF-TEMPLATE.md](construction/AI-HANDOFF-TEMPLATE.md) (Volume 21)

---

# SECTION 14 — MASTER RISK REGISTER

**Living doc:** [factory/RISK-REGISTER.md](factory/RISK-REGISTER.md) (FCT-RISK-001)

Categories: Technical · Business · Security · AI · Legal · Scaling

Each risk: likelihood · impact · mitigation · owner · review date

---

# SECTION 15 — MASTER DECISION LOG

**[mei/MEI-DECISION-LOG.md](mei/MEI-DECISION-LOG.md)** — DEC-001 through DEC-006 locked at blueprint.

New: ADR in `docs/architecture/decisions/` + DEC row.

---

# SECTION 16 — TECHNICAL DEBT REGISTER

**[mei/MEI-TECH-DEBT.md](mei/MEI-TECH-DEBT.md)** · Format: Volume 6 TD-NNN

Visible debt — not accidental debt.

---

# SECTION 17 — BUG REGISTRY

Track in GitHub Issues with labels: `BUG-###` · priority · module · status · fix version · regression test ID

| BUG-ID | Priority | Module | Status | Regression |
|--------|----------|--------|--------|------------|
| — | — | — | — | — |

---

# SECTION 18 — FEATURE REGISTRY

Features = approved [Feature Proposals](factory/FEATURE-PROPOSAL-TEMPLATE.md) + MRID groups.

| Feature ID | MRIDs | Version | Status | Owner |
|------------|-------|---------|--------|-------|
| FTR-V1-CORE | MRID-000001–000020 | ROAD-VER-1.0 | planned | — |

No hidden work — if it's not in MEI, it's not being built.

---

# SECTION 19 — RELEASE REGISTRY

| Version | Features | Migrations | Rollback | Date | STEP |
|---------|----------|------------|----------|------|------|
| v0.0.0 | Blueprint only | — | — | 2026-06-24 | STEP-001–028 |
| v1.0.0 | V1 core | TBD | OPS-RB-004 | TBD | TBD |

Release notes: [CHANGELOG.md](../CHANGELOG.md) · Deploy: [runbooks/deployment.md](runbooks/deployment.md)

---

# SECTION 20 — PRODUCT SCOREBOARD

CEO / founder dashboard — update weekly.

| Metric | Current | Target V1 |
|--------|---------|-----------|
| Features complete (MRID) | 0 / 20 bootstrap (~4,405 V1) | Critical path |
| Tests passing | — | 100% CI |
| Documentation (INDEX rows) | Blueprint only | 100% shipped |
| Coverage (critical paths) | — | ≥80% |
| Performance (OPS-PERF) | — | Baselines met |
| Accessibility | — | DNA-SCORE ≥7 |
| Security findings open | — | 0 critical |
| AI correction rate | — | <15% |
| MRR | $0 | Launch |
| Active users | 0 | Beta cohort |

---

# SECTION 21 — EXECUTION KANBAN

**[mei/MEI-KANBAN.md](mei/MEI-KANBAN.md)** — Backlog · Ready · Building · Testing · Complete

Current: All BUILD slices in **Backlog** until STEP-031.

---

# SECTION 22 — MASTER TRACEABILITY MATRIX

**MRID system** — end-to-end proof every requirement was designed, built, tested, documented, released.

| Artifact | Registry |
|----------|----------|
| **MRMS Constitution** | [requirements/MRMS.md](requirements/MRMS.md) |
| Master registry | [requirements/MRID-REGISTRY.md](requirements/MRID-REGISTRY.md) |
| MEI summary | [mei/MRID-INDEX.md](mei/MRID-INDEX.md) |
| Full matrix | [mei/MEI-TRACEABILITY.md](mei/MEI-TRACEABILITY.md) |
| Coverage gaps | [requirements/MRID-COVERAGE.md](requirements/MRID-COVERAGE.md) |
| FR ↔ SCR ↔ API | [construction/TRACEABILITY-MATRIX.md](construction/TRACEABILITY-MATRIX.md) |

**Flow:** Blueprint chapter → MRID → SCR → API → TBL → AI → EVT → Test → Doc

**PR rule:** `MRID-IDs: MRID-000004` on every implementation PR.

---

# SECTION 23 — BUILD CALENDAR

| Milestone | Target | Gate |
|-----------|--------|------|
| Blueprint + MEI + MRMS complete | ☑ 2026-06-24 | Volumes 0–24 + MEI v2 + MRMS v1 |
| Implementation start | STEP-031 | Sign-off |
| Internal Alpha | TBD | WAVE-001–006 |
| Private Beta | TBD | WAVE-001–008 |
| Public Beta | TBD | WAVE-001–009 |
| Production V1 | TBD | WAVE-010 |
| Version 1.1 | ROAD-VER-1.1 | Vol 20 signals |
| Version 1.5 | ROAD-VER-1.5 | |
| Version 2.0 | ROAD-VER-2.0 | |

---

# SECTION 24 — DAILY BUILD RHYTHM

**Morning**

1. Review MEI §3 dashboard + §21 Kanban  
2. Select BUILD slice (dependencies verified)  
3. Open [CURSOR-EXECUTION-TEMPLATE](mei/CURSOR-EXECUTION-TEMPLATE.md)  
4. Build → validate → commit → update INDEX rows  

**Evening**

1. Update MEI §3 % and BUILD-INDEX status  
2. BUILD-LOG if STEP completed  
3. Plan tomorrow's slice  

Predictable momentum beats heroic sessions.

---

# SECTION 25 — PROJECT COMPLETION INDEX

| Area | % | Blocking | Owner | Next milestone | Updated |
|------|---|----------|-------|----------------|---------|
| Architecture | 100% blueprint | — | Eng | BUILD-001 | 2026-06-24 |
| UI / SCR | 0% | BUILD-003 | Eng | SCR-015 | |
| Mobile | 0% | Trips+Receipts | Eng | MOB-WF-START | |
| Database | 0% | BUILD-001 | Eng | TBL-USR,BUS | |
| API | 0% | Schema | Eng | API-AUTH | |
| AI | 0% | Receipts | Eng | PRM-OCR-001 | |
| Analytics | 0% | Core events | Eng | EVT-010 | |
| Billing | 0% | Core | Eng | API-SUB | |
| Reports | 0% | Trips | Eng | MRID-000012 | |
| Testing | 0% | Features | QA | UT pyramid | |
| Documentation | 100% blueprint | — | All | MEI live | |
| Security | 0% impl | RLS | Eng | Auth+RLS | |
| Accessibility | 0% | UI | Design | DNA-REVIEW | |
| Operations | 0% live | Deploy | Ops | OPS-RB | |
| Launch | 0% | All above | Founder | Alpha | |

**Single source of truth for status.**

---

# THE LIBRARY (Volumes 0–24)

| Vol | Document |
|-----|----------|
| 0–24 | [blueprint/README.md](blueprint/README.md) |

| Registry | Path |
|----------|------|
| All ID catalogs | See §6–11 above |
| Waves | [construction/WAVE-INDEX.md](construction/WAVE-INDEX.md) |
| Factory | [factory/FCT-INDEX.md](factory/FCT-INDEX.md) |
| Platform | [platform/PLT-INDEX.md](platform/PLT-INDEX.md) |
| Constitution DNA | [constitution/DNA-INDEX.md](constitution/DNA-INDEX.md) |

---

# THE FINAL PRINCIPLE

The MEI eliminates uncertainty. Any engineer or AI agent can answer within minutes:

| Question | Answer location |
|----------|-----------------|
| What am I building? | BUILD-INDEX · MRID |
| Why? | Blueprint vol · MRID text |
| What does it depend on? | §5 |
| How will I know it's finished? | BLD-DOD-001 · MRID status ☑ |
| What comes next? | §4 · Kanban |

**Sign-off** → **STEP-031** → **BUILD-001** → WAVE-001

---

*Build ledger: [BUILD-LOG.md](../BUILD-LOG.md) · Legacy alias: [MASTER-BUILD-INDEX.md](MASTER-BUILD-INDEX.md)*

*MEI v2.0 — STEP-029 — Blueprint complete; implementation ready*
