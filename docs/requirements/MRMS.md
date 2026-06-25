# Mileage & Expense Copilot

# Master Requirements Management System (MRMS)

## Master Requirement ID (MRID) Constitution

**Version 1.0**

---

| Document | Role |
|----------|------|
| Volumes 0–24 | **Library** — product design |
| [MEI](../MASTER-EXECUTION-INDEX.md) | **Schedule** — what to build next |
| **MRMS (this document)** | **Requirements backbone** — every decision, test, release |
| [MRMS-2 DRS](MRMS-2-DRS.md) | **Domain namespace** — hierarchical artifact IDs |
| [DRS-INDEX](../domains/DRS-INDEX.md) | Permanent domain registry |
| [BUILD-LOG](../../BUILD-LOG.md) | **Ledger** — every STEP |

**Owner:** Product · **Co-owner:** Engineering, QA  
**Update:** On every requirement create/change/release

---

# PART I — PURPOSE

## Chapter 1 — Why MRIDs Exist

Every requirement exists **exactly once**.

It has:

- one permanent ID
- one owner
- one description
- one status
- one history

Everything else references that requirement. Nothing is duplicated.

Most companies have requirements scattered across tickets, docs, and memory. **MRMS** is the permanent Requirements Management System — the layer that takes this project from startup quality to enterprise-grade engineering.

---

## Chapter 2 — The Golden Rule

A requirement is never simply "implemented."

It progresses through:

**Specified** → Designed → Built → Tested → Verified → Released → Maintained

The MRID follows that requirement forever.

| MEI asks | MRMS answers |
|----------|--------------|
| What are we building? | Which MRIDs in this BUILD slice? |
| How do we know it's done? | MRID status = Accepted + tests mapped |
| What shipped in v1.0? | Release MRID list |

---

# PART II — MRID FORMAT

## Global ID (canonical)

```
MRID-NNNNNN
```

- Six digits — supports 4,000–4,500+ V1 requirements
- **Never reuse** numbers
- **Never renumber**
- **Never recycle** deleted IDs — mark **Retired**

## Domain ID (searchable display)

```
{DOMAIN}-MRID-NNNNNN
```

The `NNNNNN` is the **same** global number. The domain prefix indicates primary category.

| Example | Meaning |
|---------|---------|
| `MRID-000004` | Canonical global ID |
| `TRIP-MRID-000004` | Same requirement — Trip domain |
| `REC-MRID-000812` | Receipt requirement #812 globally |
| `RPT-MRID-001156` | Report requirement #1156 globally |

**Rule:** In code, commits, and databases use `MRID-NNNNNN`. In human workflow use `{DOMAIN}-MRID-NNNNNN`.

Full domain list and allocation: [DOMAIN-INDEX.md](DOMAIN-INDEX.md)

---

# PART III — REQUIREMENT CATEGORIES

Each MRID has exactly one **primary** category (domain prefix).

| Code | Domain | V1 est. |
|------|--------|--------:|
| AUTH | Authentication | 75 |
| USER | Users & profiles | 60 |
| BUS | Businesses | 120 |
| VEH | Vehicles | 80 |
| TRIP | Trips | 250 |
| REC | Receipts | 300 |
| OCR | OCR | 150 |
| EXP | Expenses | 220 |
| RPT | Reports | 250 |
| BILL | Billing | 140 |
| AI | Artificial intelligence | 250 |
| SRCH | Search | 80 |
| ADM | Administration | 300 |
| AN | Analytics | 250 |
| NOTIF | Notifications | 180 |
| SEC | Security | 250 |
| OPS | Operations | 300 |
| MOB | Mobile & offline | 250 |
| API | API contracts | 150 |
| UX | Experience | 120 |
| PERF | Performance | 80 |
| DOC | Documentation | 150 |
| TEST | Testing meta | 400 |

**Estimated V1 total:** ~4,000–4,500 MRIDs. See [DOMAIN-INDEX.md](DOMAIN-INDEX.md) for numeric allocation guidance.

---

# PART IV — REQUIREMENT TEMPLATE

Every requirement is documented using [MRID-TEMPLATE.md](MRID-TEMPLATE.md).

**Exemplar records:**

- [TRIP-MRID-000004](records/TRIP-MRID-000004.md) — Start Trip
- [REC-MRID-000007](records/REC-MRID-000007.md) — Receipt capture

---

# PART V — MASTER REGISTRY

All MRIDs live in one master registry: **[MRID-REGISTRY.md](MRID-REGISTRY.md)**

Columns: MRID · Domain ID · Title · Status · Priority · Version · Owner · Dependencies · Testing · Release · Completion

Summary index (MEI): [mei/MRID-INDEX.md](../mei/MRID-INDEX.md)

---

# PART VI — REQUIREMENT HIERARCHY

```
Epic
  └── Feature
        └── Requirement (MRID)
              └── Acceptance criteria (checklist in MRID record)
```

| Level | ID pattern | Example |
|-------|------------|---------|
| Epic | `EPIC-{DOMAIN}-NNN` | EPIC-TRIP-001 Trip Management |
| Feature | `FTR-{DOMAIN}-NNN` | FTR-TRIP-001 Start Trip |
| Requirement | `MRID-NNNNNN` | TRIP-MRID-000004 |

Hierarchy map: [MRID-HIERARCHY.md](MRID-HIERARCHY.md)

---

# PART VII — TRACEABILITY

Every MRID connects to:

```
Blueprint (FR / Volume)
      ↓
Screen (SCR-ID)
      ↓
Database (TBL / field)
      ↓
API (API-ID)
      ↓
Analytics (EVT-ID)
      ↓
Tests (UT / IT / E2E)
      ↓
Documentation (Volume · Chapter)
      ↓
Release (version)
```

**Matrix:** [mei/MEI-TRACEABILITY.md](../mei/MEI-TRACEABILITY.md) · [construction/TRACEABILITY-MATRIX.md](../construction/TRACEABILITY-MATRIX.md)

**PR rule:** `MRID-IDs: MRID-000004, MRID-000005` on every implementation PR.

---

# PART VIII — STATUS LIFECYCLE

```
Draft → Review → Approved → Building → Implemented → Testing → Accepted → Released → Maintained → Deprecated → Retired
```

| Status | Meaning |
|--------|---------|
| Draft | Written, not reviewed |
| Review | In product/eng review |
| Approved | Ready for BUILD slice assignment |
| Building | Active Cursor session / PR open |
| Implemented | Code merged; tests pending |
| Testing | QA in progress |
| Accepted | All acceptance criteria + tests pass |
| Released | Shipped in a tagged version |
| Maintained | Live; may receive fixes |
| Deprecated | Superseded; still documented |
| Retired | Removed from product; history preserved |

---

# PART IX — DEPENDENCY GRAPH

Each MRID record lists:

| Relation | Meaning |
|----------|---------|
| **Requires** | Must be Accepted before this MRID can build |
| **Blocks** | This MRID blocks others until complete |
| **Related** | Logical association, not hard dependency |

Example — `TRIP-MRID-000004` (Start Trip):

- **Requires:** AUTH-MRID-000001, BUS-MRID-000002, VEH-MRID-000003
- **Provides:** trip entity for REC, EXP, RPT, AN
- **Related:** TRIP-MRID-000005 (End Trip), TRIP-MRID-000006 (History)

---

# PART X — CHANGE HISTORY

Every MRID modification appends to its record's **Change History** table:

| Date | Author | Change | Reason | Impact | Approval |
|------|--------|--------|--------|--------|----------|

Nothing changes silently. Breaking changes require Product + Engineering approval.

---

# PART XI — APPROVALS

Before status moves to **Approved** → **Building**:

| Role | Approves |
|------|----------|
| Product | Business reason, priority, acceptance criteria |
| Engineering | Feasibility, dependencies, API/DB impact |
| UX | Screen mapping, accessibility (if user-facing) |
| QA | Test mapping completeness |
| Security | If SEC-tagged or handles PII/payment |

V1 bootstrap MRIDs (000001–000020) pre-approved from Volume 3 FRs.

---

# PART XII — ACCEPTANCE CRITERIA

Every MRID must have **measurable** acceptance criteria — no vague requirements.

Example — Receipt upload (`REC-MRID-000007`):

- [ ] Upload succeeds (HTTP 2xx)
- [ ] Image stored in Supabase Storage
- [ ] Thumbnail generated
- [ ] Metadata row in `receipts`
- [ ] Audit log entry
- [ ] OCR job queued

---

# PART XIII — TEST MAPPING

Every MRID maps to at least:

| Type | When required |
|------|---------------|
| **UT** | Business logic, validators, calculations |
| **IT** | API + DB + RLS |
| **E2E** | User-facing critical paths |
| **ACC** | All SCR-mapped MRIDs |
| **SEC** | Auth, RLS, payment, PII |
| **PERF** | Report generation, bulk operations |

No orphaned requirements. Gap scan: [MRID-COVERAGE.md](MRID-COVERAGE.md)

---

# PART XIV — SCREEN MAPPING

Every SCR references supporting MRIDs. Every user-facing MRID references ≥1 SCR.

Use canonical **SCR-###** IDs (Volume 11) — not duplicate TRIP-001 codes.

| Screen | MRIDs |
|--------|-------|
| SCR-019 Start Trip | TRIP-MRID-000004 |
| SCR-031 Receipt Capture | REC-MRID-000007 |
| SCR-015 Dashboard | (aggregate — multiple MRIDs) |

Catalog: [screen-catalog/SCR-INDEX.md](../screen-catalog/SCR-INDEX.md)

---

# PART XV — API MAPPING

Every API endpoint lists supporting MRIDs.

| API | Method | MRIDs |
|-----|--------|-------|
| API-TRIP-001 | POST | TRIP-MRID-000004 |
| API-RCP-* | POST | REC-MRID-000007, OCR-MRID-000008 |

Catalog: [api-catalog/API-INDEX.md](../api-catalog/API-INDEX.md)

---

# PART XVI — DATABASE MAPPING

Every schema field exists because of an MRID (or is infrastructure).

| Field | MRID | Table |
|-------|------|-------|
| `trips.started_at` | TRIP-MRID-000004 | TRP |
| `trips.start_odometer` | TRIP-MRID-000004 | TRP |
| `receipts.storage_path` | REC-MRID-000007 | REC |

Prevents schema drift. Volume 4 chapters reference MRIDs as registry expands.

---

# PART XVII — AI MAPPING

Every PRM/ENG references MRIDs:

| Prompt | MRIDs |
|--------|-------|
| PRM-OCR-001 | OCR-MRID-000008 |
| PRM-CAT-001 | AI-MRID-000018 |
| PRM-DUP-001 | AI-MRID-000019 |

Catalog: [ai-catalog/PROMPT-INDEX.md](../ai-catalog/PROMPT-INDEX.md)

---

# PART XVIII — ANALYTICS MAPPING

Every EVT exists because of an MRID:

| Event | MRID |
|-------|------|
| EVT-010 `trip_started` | TRIP-MRID-000004 |
| EVT-011 `trip_ended` | TRIP-MRID-000005 |
| EVT-MOB-002 `receipt_captured` | REC-MRID-000007 |

Catalog: [analytics/EVENT-REGISTRY.md](../analytics/EVENT-REGISTRY.md)

---

# PART XIX — RELEASE MAPPING

Every release documents:

- **New MRIDs** — first time Accepted/Released
- **Changed MRIDs** — acceptance criteria or behavior change
- **Retired MRIDs** — deprecated/removed

Format in [CHANGELOG.md](../../CHANGELOG.md) and MEI §19.

---

# PART XX — REQUIREMENT DASHBOARD

Live dashboard: **[MRID-DASHBOARD.md](MRID-DASHBOARD.md)**

Tracks: total · specified · building · testing · released · blocked · critical · debt · coverage %

---

# PART XXI — COVERAGE REPORT

Weekly gap scan: **[MRID-COVERAGE.md](MRID-COVERAGE.md)**

Questions:

- Requirements without tests?
- Requirements without documentation?
- Requirements without analytics?
- Requirements without APIs?
- Requirements without screens?

Identify gaps **before** release.

---

# PART XXII — REQUIREMENT HEALTH

Each MRID can be scored (0–10) on:

| Dimension | Question |
|-----------|----------|
| Documentation | Full record + blueprint link? |
| Testing | UT/IT/E2E mapped and passing? |
| Coverage | All acceptance criteria have tests? |
| Dependencies | Requires all Accepted? |
| Complexity | Risk score from factory |
| Risk | Security/compliance flags |
| Priority | Aligned with roadmap |
| Completion | % of acceptance criteria met |

Health rollup feeds MEI §20 scoreboard.

---

# PART XXIII — TECHNICAL DEBT

Requirements may create debt. Link MRID → [mei/MEI-TECH-DEBT.md](../mei/MEI-TECH-DEBT.md) (TD-NNN).

Track: reason · risk · cost · fix version. Never hide debt.

---

# PART XXIV — RETIREMENT

Requirements never disappear.

```
Deprecated → Retired
```

History, change log, and release notes remain forever. Retired MRIDs stay in registry with status **Retired**.

---

# PART XXV — MASTER REQUIREMENT MATRIX

Scale projection for V1:

| Category | Approx. MRIDs | Global ID guidance |
|----------|--------------:|-------------------|
| Authentication | 75 | 000001–000075 |
| Users | 60 | 000076–000135 |
| Businesses | 120 | 000136–000255 |
| Vehicles | 80 | 000256–000335 |
| Trips | 250 | 000336–000585 |
| Receipts | 300 | 000586–000885 |
| OCR | 150 | 000886–001035 |
| Expenses | 220 | 001036–001255 |
| Reports | 250 | 001256–001505 |
| Billing | 140 | 001506–001645 |
| AI | 250 | 001646–001895 |
| Search | 80 | 001896–001975 |
| Admin | 300 | 001976–002275 |
| Analytics | 250 | 002276–002525 |
| Notifications | 180 | 002526–002705 |
| Security | 250 | 002706–002955 |
| Operations | 300 | 002956–003255 |
| Mobile | 250 | 003256–003505 |
| API | 150 | 003506–003655 |
| UX | 120 | 003656–003775 |
| Performance | 80 | 003776–003855 |
| Documentation | 150 | 003856–004005 |
| Testing | 400 | 004006–004405 |

**Bootstrap block:** MRID-000001–000020 are V1 critical-path seeds (pre-mapped to domains). New IDs in each category should allocate from guidance ranges above.

Full registry: [MRID-REGISTRY.md](MRID-REGISTRY.md)

---

# THE MASTER REQUIREMENT CONSTITUTION

Every MRID must answer:

| # | Question |
|---|----------|
| 1 | Why does this exist? |
| 2 | Who requested it? |
| 3 | What problem does it solve? |
| 4 | What depends on it? |
| 5 | How is it tested? |
| 6 | How is it measured? |
| 7 | When was it released? |
| 8 | Can it be safely changed? |
| 9 | What would break if it disappeared? |
| 10 | Who owns it today? |

If every MRID answers these ten questions, the project has complete traceability from idea to production.

---

# INTEGRATION

| System | How MRMS connects |
|--------|-------------------|
| Volume 3 FR-* | Source material → decomposed into MRIDs |
| MEI BUILD slices | Each BUILD lists MRID-IDs |
| Factory FCT | Feature proposals spawn MRID batches |
| QA Volume 9 | Test IDs map to MRIDs |
| Releases | CHANGELOG lists MRID deltas |

**Next:** Expand registry from FR catalog → assign MRIDs → **STEP-031** WAVE-001 implementation.

---

*MRMS v1.0 — STEP-030 — Requirements backbone for enterprise-grade engineering*
