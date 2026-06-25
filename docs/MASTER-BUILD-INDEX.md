# Mileage & Expense Copilot

# Master Build Index

## The Constitution

**Version 1.0** | Pre-implementation execution guide

---

## Purpose

This document is the **single table of contents** for the entire product. Volumes 0–20 define *what* to build and *how* it operates and evolves. The Master Build Index defines **how to execute** — cross-references, registries, dependencies, implementation order, and build status.

> **When this index is signed off, development shifts from invention to execution.**

**Owner:** Product + Engineering  
**Update cadence:** Every STEP completion during implementation  
**Traceability:** [BUILD-LOG.md](../BUILD-LOG.md) · [BUILD-TRACEABILITY.md](BUILD-TRACEABILITY.md)

---

## Blueprint Status

| Status | Value |
|--------|-------|
| Planning volumes | **0–20 complete** |
| Master Build Index | **v1.0** |
| Application code | **Not started** |
| Next step | **STEP-025 — Phase A: Repo scaffold** |

### Sign-off

| Gate | Owner | Date | ✓ |
|------|-------|------|---|
| Blueprint Volumes 0–20 | Product | | ☐ |
| Master Build Index | Engineering | | ☐ |
| Begin Phase A | Both | | ☐ |

---

# Part I — Volume Map

## All 21 planning documents

| Vol | Document | Domain | Canonical for |
|-----|----------|--------|---------------|
| **0** | [Product Doctrine](blueprint/00-product-doctrine.md) | Mission | Values, scope boundaries |
| **1** | [Product Vision](blueprint/01-product-vision.md) | Strategy | Pillars, metrics |
| **2** | [Experience Architecture](blueprint/02-user-experience.md) | UX | Journeys (mobile → Vol 18) |
| **3** | [Functional Requirements](blueprint/03-functional-requirements.md) | FR | Business logic contract |
| **4** | [Data Architecture](blueprint/04-database-architecture.md) | Data | Schema, RLS, entities |
| **5** | [AI Architecture](blueprint/05-ai-design.md) | AI summary | → Volume 16 canonical |
| **6** | [Technical Architecture](blueprint/06-technical-architecture.md) | Stack | Next.js, Supabase, CI |
| **7** | [Business Operations](blueprint/07-business-operations.md) | GTM | Pricing, launch |
| **8** | [Security](blueprint/08-security.md) | Trust | Auth, RLS, compliance |
| **9** | [QA & Release](blueprint/09-testing-quality.md) | Quality | Test gates, launch cert |
| **10** | [Design System](blueprint/10-design-system.md) | UI | Components, tokens |
| **11** | [Screen Bible](blueprint/11-screen-bible.md) | Screens | 60 SCR-IDs |
| **12** | [API Architecture](blueprint/12-api-architecture.md) | API | 70+ API-IDs |
| **13** | [State Machines](blueprint/13-state-machines.md) | Workflows | 10 SM-IDs |
| **14** | [Analytics](blueprint/14-analytics.md) | BI | EVT registry |
| **15** | [Communication Engine](blueprint/15-communication-engine.md) | Comms | MSG registry |
| **16** | [AI Operating System](blueprint/16-ai-operating-system.md) | AI ops | ENG/PRM catalogs |
| **17** | [AdminOS](blueprint/17-admin-operating-system.md) | Company ops | ADM-IDs |
| **18** | [Mobile Field Experience](blueprint/18-mobile-field-experience.md) | Mobile | MOB-IDs, offline |
| **19** | [Production SRE](blueprint/19-production-sre.md) | Platform ops | OPS-IDs, runbooks |
| **20** | [Product Evolution](blueprint/20-product-evolution-roadmap.md) | Roadmap | ROAD-IDs, versions |
| — | **This document** | Execution | Build order, status |

---

# Part II — ID Registries

Every implementable artifact has an ID. **Update tracker status as work ships.**

| Registry | Path | IDs | Volume |
|----------|------|-----|--------|
| Screens | [screen-catalog/SCR-INDEX.md](screen-catalog/SCR-INDEX.md) | SCR-001–060 | 11 |
| APIs | [api-catalog/API-INDEX.md](api-catalog/API-INDEX.md) | API-* | 12 |
| Error codes | [api-catalog/ERROR-CODES.md](api-catalog/ERROR-CODES.md) | ERR-* | 12 |
| State machines | [state-machines/SM-INDEX.md](state-machines/SM-INDEX.md) | SM-* | 13 |
| Analytics | [analytics/EVENT-REGISTRY.md](analytics/EVENT-REGISTRY.md) | EVT-* | 14 |
| Messages | [communications/MSG-INDEX.md](communications/MSG-INDEX.md) | MSG-* | 15 |
| AI engines | [ai-catalog/ENGINE-INDEX.md](ai-catalog/ENGINE-INDEX.md) | ENG-* | 16 |
| AI prompts | [ai-catalog/PROMPT-INDEX.md](ai-catalog/PROMPT-INDEX.md) | PRM-* | 16 |
| Admin modules | [admin-os/ADM-INDEX.md](admin-os/ADM-INDEX.md) | ADM-* | 17 |
| Mobile workflows | [mobile/MOB-INDEX.md](mobile/MOB-INDEX.md) | MOB-* | 18 |
| Device matrix | [mobile/DEVICE-MATRIX.md](mobile/DEVICE-MATRIX.md) | MOB-QA-* | 18 |
| Operations | [ops/OPS-INDEX.md](ops/OPS-INDEX.md) | OPS-* | 19 |
| Runbooks | [runbooks/README.md](runbooks/README.md) | OPS-RB-* | 19 |
| Roadmap | [roadmap/ROAD-INDEX.md](roadmap/ROAD-INDEX.md) | ROAD-* | 20 |

**PR convention:** Every PR lists affected IDs: `SCR-IDs: … API-IDs: … SM-IDs: …`

---

# Part III — Database Tables (V1)

Canonical: Volume 4. Migration order in Phase B.

| Table | Phase | FR / SM | Status |
|-------|-------|---------|--------|
| `auth.users` | B | FR-001 | ☐ |
| `profiles` | B | FR-001 | ☐ |
| `subscriptions` | B/F | FR-012 | ☐ |
| `usage_counters` | B/F | FR-012 | ☐ |
| `businesses` | B | FR-100 | ☐ |
| `employees` | B | V1.5 hook | ☐ |
| `vehicles` | B | FR-200 | ☐ |
| `vehicle_odometer_history` | B | FR-201 | ☐ |
| `clients` | B | FR-1000 | ☐ |
| `projects` | B | FR-700 | ☐ |
| `trips` | B/C | FR-300, SM-TRIP | ☐ |
| `trip_notes` | B/C | FR-305 | ☐ |
| `receipts` | B/D | FR-500, SM-RCP | ☐ |
| `expenses` | B/C | FR-400, SM-EXP | ☐ |
| `expense_categories` | B | FR-250 | ☐ |
| `mileage_rates` | B | FR-210 | ☐ |
| `mileage_rates_reference` | B | IRS seed | ☐ |
| `reports` | B/E | FR-800, SM-RPT | ☐ |
| `notifications` | B | MSG-* | ☐ |
| `audit_logs` | B | Volume 8 | ☐ |
| `ocr_results` | B/D | SM-OCR | ☐ |
| `ai_suggestions` | B/D | ENG-* | ☐ |
| `search_documents` | B | FR-search | ☐ |
| `business_events` | B | Volume 4 Ch. 20 | ☐ |
| `sync_queue` (server) | B | SM-SYNC | ☐ |
| `feature_flags` | B/G | ADM-FLAGS | ☐ |
| `admin_audit_logs` | G | ADM-* | ☐ |

---

# Part IV — Implementation Order

## Phase overview

| Phase | STEP | Scope | Key volumes | Status |
|-------|------|-------|-------------|--------|
| **Blueprint** | 001–024 | Volumes 0–20 + this index | All | ☑ |
| **A** | 025+ | Repo scaffold, CI, Netlify | 6, 19 | ☐ |
| **B** | | Supabase schema, auth, RLS | 4, 8, 12 | ☐ |
| **C** | | Core trip flow | 3, 11, 13, 18 | ☐ |
| **D** | | Receipt OCR pipeline | 5, 16, 13 | ☐ |
| **E** | | Reports + exports | 3, 11, 12 | ☐ |
| **F** | | Stripe + tier limits | 3, 7, 13 | ☐ |
| **G** | | Polish, PWA, admin, onboarding | 10, 17, 18 | ☐ |
| **H** | | Beta launch | 7, 9, 19, 20 | ☐ |

## Screen waves (Volume 11)

| Wave | SCR range | Phase | Theme |
|------|-----------|-------|-------|
| 1 | SCR-001–014 | G (partial B auth) | Auth + onboarding |
| 2 | SCR-015 | C | Dashboard |
| 3 | SCR-016–029 | C | Trips |
| 4 | SCR-030–039 | D | Receipts |
| 5 | SCR-040–041 | E | Reports |
| 6 | SCR-042–052 | G | Settings, help, sync |
| 7 | SCR-053–055, 059 | G | Admin |
| — | SCR-056–058 | V1.1 | Deferred per ROAD-INDEX |

## Recommended build sequence (first 10 implementation steps)

| Order | Deliverable | Depends on | IDs |
|-------|-------------|------------|-----|
| 1 | Monorepo + CI + Netlify skeleton | — | Phase A |
| 2 | Supabase project + migrations (auth, profiles) | 1 | API-AUTH-* |
| 3 | RLS policies + businesses + vehicles | 2 | API-BIZ-*, API-VEH-* |
| 4 | Design system shell (BottomNav, TopBar) | 1 | Volume 10 |
| 5 | Auth screens + session | 2, 4 | SCR-003–007 |
| 6 | Start / active / end trip | 3, 4 | SCR-016–020, SM-TRIP |
| 7 | Offline queue foundation | 6 | SM-SYNC, MOB-OFF-* |
| 8 | Receipt capture + storage | 6, 7 | SCR-031, SM-RCP |
| 9 | OCR Edge Function + review UI | 8 | ENG-OCR, SM-OCR |
| 10 | Mileage report + PDF export | 6, 9 | SCR-040, SM-RPT |

---

# Part V — Dependency Graph

```
Volume 0 (Doctrine)
    └── Volume 1 (Vision)
            ├── Volume 2 (UX) ──► Volume 11 (Screens) ──► Volume 10 (Design)
            ├── Volume 3 (FR) ──► Volume 12 (API) ──► Volume 13 (SM)
            │                           │
            └── Volume 4 (Data) ◄───────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Volume 5    Volume 6    Volume 8
   (AI sum)    (Tech)      (Security)
        │           │           │
        └──► Volume 16 (AI OS)
                    │
    Volume 7 (GTM)  │  Volume 9 (QA)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Volume 14   Volume 15   Volume 18 (Mobile)
   (Analytics) (Comms)          │
        │           │           │
        └─────► Volume 17 (AdminOS) ◄── Volume 19 (SRE)
                        │
                  Volume 20 (Roadmap)
                        │
              MASTER BUILD INDEX (execution)
```

**Rule:** Never implement a child before its dependency row in Volume 3 dependency matrix is satisfied.

---

# Part VI — Build Status Dashboard

Update this section at each STEP during implementation.

## Overall

| Metric | Count | Done |
|--------|-------|------|
| Blueprint volumes | 21 | 21 |
| Screens (SCR) | 60 | 0 |
| APIs documented | 70+ | 0 impl |
| State machines | 10 | 0 |
| DB tables (V1) | 27 | 0 |
| ENG engines (V1) | 9 | 0 |
| Admin modules (V1) | 12 | 0 |
| Runbooks (stub→live) | 10 | 0 tested |

## Phase gates

| Gate | Requirement | Status |
|------|-------------|--------|
| Blueprint sign-off | Volumes 0–20 + this index | ☐ |
| Phase A complete | Repo, CI, Netlify deploy | ☐ |
| Phase B complete | Schema + RLS + auth | ☐ |
| Phase C complete | Trip flow E2E | ☐ |
| Phase D complete | OCR E2E | ☐ |
| Phase E complete | Reports E2E | ☐ |
| Phase F complete | Stripe E2E | ☐ |
| Phase G complete | PWA + admin smoke | ☐ |
| Phase H complete | Volume 9 + 19 launch gates | ☐ |
| V1 expansion (1.1+) | Volume 20 Ch. 33 signals | ☐ |

---

# Part VII — Non-Negotiables (Consolidated)

Sourced from volume non-negotiables chapters — **never waive without ADR**.

| # | Rule | Source |
|---|------|--------|
| 1 | User approves every financial record | Vol 0, 16 |
| 2 | RLS on every user data table | Vol 4, 8 |
| 3 | Every admin action audited | Vol 17 |
| 4 | Offline capture never blocked | Vol 18 |
| 5 | No prod deploy without validation | Vol 19 |
| 6 | Untested backups invalid | Vol 19 |
| 7 | Feature admission criteria | Vol 20 |
| 8 | Simplicity before complexity | Vol 20 |
| 9 | SCR-ID before screen code | Vol 11 |
| 10 | API-ID before endpoint code | Vol 12 |

---

# Part VIII — Quick Links for Builders

| I need to… | Go to |
|------------|-------|
| Start coding | Phase A → `PROJECT-STRUCTURE.md` |
| Add a screen | SCR-INDEX → Volume 11 spec → Volume 10 components |
| Add an API | API-INDEX → Volume 12 → SM if workflow |
| Add AI behavior | PROMPT-INDEX → Volume 16 → golden set |
| Handle offline | MOB-INDEX → SM-SYNC → `apps/web/src/lib/offline/` |
| Deploy | `docs/runbooks/deployment.md` |
| Respond to incident | `docs/runbooks/incident-response.md` |
| Propose a feature | ROAD-ADMIT-001 → `docs/roadmap/proposals/` |
| Log a build step | `docs/BUILD-TRACEABILITY.md` |

---

# Part IX — Version Scope (V1 Boundary)

**In ROAD-VER-1.0** — see [ROAD-INDEX](roadmap/ROAD-INDEX.md)

**Explicitly out of V1:**

* Automatic trip detection
* Team / multi-user businesses
* Public / partner API
* Native iOS/Android apps (PWA only)
* Enterprise SSO
* International / multi-currency UI
* Hardware integrations

When tempted to add V2 scope to V1 → re-read Volume 20 Ch. 4 and Ch. 34.

---

*Blueprint: [README](blueprint/README.md) · Roadmap: [Volume 20](blueprint/20-product-evolution-roadmap.md) · Build log: [BUILD-LOG.md](../BUILD-LOG.md)*

*Last updated: STEP-024 — Master Build Index v1.0*
