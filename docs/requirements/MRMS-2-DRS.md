# Mileage & Expense Copilot

# Master Requirements Management System

# Volume MRMS-2 — MRID Domain Registration System (DRS)

**Version 1.0**

---

| Document | Role |
|----------|------|
| [MRMS v1](MRMS.md) | Requirements constitution — MRIDs |
| **MRMS-2 (this document)** | **Domain namespace** — every artifact has a home |
| [DRS-INDEX](../domains/DRS-INDEX.md) | Permanent domain registry |
| [MEI](../MASTER-EXECUTION-INDEX.md) | Construction schedule |

**Owner:** Architecture · **Co-owners:** Product, Engineering  
**Principle:** *If someone joins five years from now, they locate any artifact in minutes.*

---

# PART I — PURPOSE

## Chapter 1 — Why Domains Exist

Domains create **ownership** and **instant context**.

| ID alone | With domain |
|----------|-------------|
| `MRID-001287` | `TRIP-MRID-001287` |
| Tells us nothing | Trip Engine · Trip team · Trip DB · Trip APIs · Trip tests |

Everything groups naturally. NASA-level traceability requires a **hierarchical namespace**, not flat numbers.

---

## Chapter 2 — Relationship to MRMS v1

| Layer | System | Question answered |
|-------|--------|-------------------|
| MRMS v1 | MRID registry | *What* is the requirement? |
| **MRMS-2 DRS** | Domain namespace | *Where* does it live? *Who* owns it? |
| MEI | Execution index | *When* do we build it? |

Every MRID has a domain prefix. Every screen, API, table, prompt, event, test, and document belongs to **exactly one primary domain**.

---

# PART II — DOMAIN CONSTITUTION

Every permanent area of the application receives a **registered domain code**.

**Rules:**

1. Domain codes are **permanent** — never renamed
2. Domain codes are **unique** — 2–6 uppercase letters
3. New domains require [governance approval](../domains/DRS-GOVERNANCE.md)
4. One primary domain per artifact — secondary relationships allowed

`TRIP` will always mean **Trip Engine**.

Full registry: [DRS-INDEX.md](../domains/DRS-INDEX.md)

---

# PART III — DOMAIN REGISTRY

Domains are organized by **super-domain** (namespace group):

| Super-domain | Domains | Registry section |
|--------------|---------|------------------|
| Core Platform | CORE, AUTH, USER, ORG, BUS, TEAM, ROLE | [DRS-INDEX §1](../domains/DRS-INDEX.md#1--core-platform) |
| Travel | TRIP, VEH, ROUTE, LOC, MILE, MOB | [DRS-INDEX §2](../domains/DRS-INDEX.md#2--travel) |
| Receipts | REC, OCR, MERCH, CAT, EXP | [DRS-INDEX §3](../domains/DRS-INDEX.md#3--receipts) |
| Reporting | RPT, PDF, EXPORT, PRINT | [DRS-INDEX §4](../domains/DRS-INDEX.md#4--reporting) |
| AI | AI, PROMPT, MEM, SEARCH, DUP, PRED | [DRS-INDEX §5](../domains/DRS-INDEX.md#5--ai) |
| Platform | API, DB, FILE, CACHE, QUEUE, SYNC | [DRS-INDEX §6](../domains/DRS-INDEX.md#6--platform-infrastructure) |
| Billing | SUB, PAY, INV, TAX | [DRS-INDEX §7](../domains/DRS-INDEX.md#7--billing) |
| Admin | ADMIN, OPS, SUP, MON | [DRS-INDEX §8](../domains/DRS-INDEX.md#8--admin) |
| Analytics | AN, BI, FUNNEL, EVENT | [DRS-INDEX §9](../domains/DRS-INDEX.md#9--analytics) |
| Communication | NOTIFY, EMAIL, PUSH, SMS | [DRS-INDEX §10](../domains/DRS-INDEX.md#10--communication) |
| UX | UX, UI, COMP, NAV | [DRS-INDEX §11](../domains/DRS-INDEX.md#11--ux) |
| Testing | UNIT, INT, E2E, ACC, PERF, SEC | [DRS-INDEX §12](../domains/DRS-INDEX.md#12--testing) |
| Documentation | DOC, ARCH, GUIDE, KB | [DRS-INDEX §13](../domains/DRS-INDEX.md#13--documentation) |

**MOB** (Mobile & Offline) is registered under Travel — field productivity is inseparable from trip/receipt workflows (Volume 18).

---

# PART IV — UNIVERSAL IDENTIFIER FORMAT

Every artifact:

```
{DOMAIN}-{TYPE}-{NUMBER}
```

| TYPE | Artifact | Example |
|------|----------|---------|
| MRID | Requirement | `TRIP-MRID-000421` |
| SCREEN | Screen | `TRIP-SCREEN-004` |
| API | Endpoint | `TRIP-API-012` |
| DB | Table / schema object | `TRIP-DB-006` |
| TEST | Test case | `TRIP-TEST-018` |
| EVENT | Analytics event | `TRIP-EVENT-011` |
| AI | Prompt / engine | `TRIP-AI-003` |
| DOC | Documentation | `TRIP-DOC-007` |
| SM | State machine | `TRIP-SM-001` |
| MSG | Message template | `NOTIFY-MSG-001` |

Full type registry: [DRS-TYPE-REGISTRY.md](../domains/DRS-TYPE-REGISTRY.md)

**Legacy IDs** (SCR-###, API-TRIP-###, EVT-###) remain valid. Each maps to a DRS ID: [DRS-LEGACY-MAP.md](../domains/DRS-LEGACY-MAP.md)

---

# PART V — CROSS REFERENCES

One requirement maps to all implementations.

**Example — Start Trip:**

| DRS ID | Legacy | Role |
|--------|--------|------|
| TRIP-MRID-000004 | MRID-000004 | Requirement |
| TRIP-SCREEN-002 | SCR-019 | Screen |
| TRIP-API-001 | API-TRIP-001 | API |
| TRIP-DB-001 | TBL TRP | Database |
| TRIP-EVENT-001 | EVT-010 | Analytics |
| TRIP-TEST-001 | E2E-TRIP-001 | Test |
| TRIP-SM-001 | SM-TRIP | State machine |
| TRIP-DOC-001 | Vol 3 FR-300 | Documentation |

Full chain: [chains/TRIP-MRID-000004.md](../domains/chains/TRIP-MRID-000004.md)

---

# PART VI — DOMAIN OWNERSHIP

Every domain has assigned owners. Nobody asks *"Who owns Trips?"*

| Role | Responsibility |
|------|----------------|
| Technical Owner | Architecture, APIs, DB, implementation |
| Product Owner | Requirements, priority, acceptance |
| QA Owner | Test strategy, coverage |
| Documentation Owner | Blueprint + user docs |
| AI Owner | Prompts, models (if applicable) |
| Analytics Owner | Events, dashboards |
| Support Owner | Runbooks, escalations |

Per-domain records: [domains/records/](../domains/records/)

---

# PART VII — DOMAIN HEALTH

Each domain receives a health scorecard: [DRS-HEALTH.md](../domains/DRS-HEALTH.md)

| Dimension | Measures |
|-----------|----------|
| Documentation | % MRIDs with full records |
| Testing | % MRIDs with mapped tests passing |
| Coverage | Acceptance criteria test coverage |
| Security | SEC tests, RLS audit |
| Performance | PERF baselines met |
| Accessibility | ACC compliance |
| Technical debt | Open TD items |
| **Overall** | Weighted composite |

---

# PART VIII — DOMAIN DEPENDENCIES

Each domain documents **Requires** and **Provides**.

**Example — TRIP:**

| Direction | Domains |
|-----------|---------|
| **Requires** | AUTH, BUS, VEH, DB, SYNC |
| **Provides** | RPT, EXP, AI, AN, NOTIFY |

Dependency graph: [DRS-DEPENDENCIES.md](../domains/DRS-DEPENDENCIES.md)

---

# PART IX — DOMAIN VERSIONING

Domains version **independently** of product semver.

| Domain | Version | Notes |
|--------|---------|-------|
| TRIP | v0.0.0 | Blueprint only |
| REC | v0.0.0 | Blueprint only |
| AI | v0.0.0 | Blueprint only |

Product may ship **v1.0.0** while TRIP is internally **v1.3.2** and AI is **v2.1.0** — compatible internal releases.

---

# PART X — DOMAIN ROADMAPS

Each domain maintains in its record:

- Current version
- Target version
- Technical debt
- Planned features (MRID batches)
- Known risks
- KPIs
- Release targets

Template: [DRS-DOMAIN-TEMPLATE.md](../domains/DRS-DOMAIN-TEMPLATE.md)  
Exemplar: [records/TRIP.md](../domains/records/TRIP.md)

---

# PART XI — DOMAIN GOVERNANCE

No new domain without:

1. Clearly distinct responsibility
2. Proof existing domains cannot own it
3. Assigned ownership (all roles)
4. Documentation created
5. Naming follows registry
6. Cross-domain dependencies documented

Process: [DRS-GOVERNANCE.md](../domains/DRS-GOVERNANCE.md)

**Prevent domain sprawl.**

---

# PART XII — THE DOMAIN CONSTITUTION

Every artifact must belong to **exactly one primary domain**.

| Artifact | Primary domain rule |
|----------|---------------------|
| Requirement (MRID) | Domain of the capability |
| Screen | Domain of the primary workflow |
| API | Domain of the resource |
| Database table | Domain of the entity |
| AI prompt | Domain of the feature served |
| Analytics event | Domain of the user action |
| Test | Domain under test |
| Document | Domain documented |

Secondary cross-domain links are allowed. Primary ownership is **mandatory**.

---

# PART XIII — COMPLETE TRACEABILITY

Lifecycle chain for any requirement:

```
TRIP-MRID-000421
      ↓
TRIP-SCREEN-004
      ↓
TRIP-API-012
      ↓
TRIP-DB-006
      ↓
TRIP-AI-003
      ↓
TRIP-EVENT-011
      ↓
TRIP-TEST-018
      ↓
TRIP-DOC-007
      ↓
Release 1.0
      ↓
Bug fixes · Enhancements
      ↓
Retirement
```

One chain. Complete story. From requirement to retirement.

---

# PART XIV — THE DOMAIN STANDARD

The DRS exists so every artifact has:

| Property | Guaranteed |
|----------|------------|
| Permanent identity | `{DOMAIN}-{TYPE}-{NUMBER}` |
| Permanent owner | Domain record |
| Permanent place | Super-domain group |
| Permanent relationships | Cross-ref + dependency graph |

Combined with **MEI** (schedule) and **MRMS** (requirements), this forms a true **engineering knowledge graph**.

> If someone joins the project five years from now, they locate any requirement, screen, API, test, database object, AI prompt, or document in **minutes** — not hours.

---

# INTEGRATION

| System | DRS integration |
|--------|-----------------|
| MRMS v1 | All MRIDs use `{DOMAIN}-MRID-NNNNNN` |
| MEI §22 | Traceability flows through DRS chains |
| Volume catalogs | SCR/API/EVT map via [DRS-LEGACY-MAP](../domains/DRS-LEGACY-MAP.md) |
| BUILD slices | List domain + MRID-IDs |
| PRs | `DRS-IDs:` and `MRID-IDs:` |

**Next:** Expand domain records → decompose FRs → **STEP-032** WAVE-001

---

*MRMS-2 DRS v1.0 — STEP-031 — NASA-level traceability*
