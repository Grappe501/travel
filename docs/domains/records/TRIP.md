# TRIP — Trip Engine Domain

**Super-domain:** Travel · **DRS:** [DRS-INDEX](../DRS-INDEX.md#2--travel)

---

## Identity

| Field | Value |
|-------|-------|
| **Code** | TRIP |
| **Name** | Trip Engine |
| **Version** | v0.0.0 (blueprint) |
| **Target V1** | v1.0.0 |
| **MRID allocation** | 000336–000585 (250 est.) |
| **Bootstrap MRIDs** | 000004–000006 |

---

## Ownership

| Role | Owner |
|------|-------|
| Technical | Engineering |
| Product | Product |
| QA | QA |
| Documentation | Engineering |
| AI | N/A (consumes LOC/MILE) |
| Analytics | Product |
| Support | Ops |

---

## Scope

Owns the complete trip lifecycle: start, active, end, edit, history, mileage attachment, and trip state machine. All trip screens, APIs, database objects, events, and tests use the `TRIP-` prefix.

---

## Dependencies

| Requires | Provides |
|----------|----------|
| AUTH, BUS, VEH, DB, SYNC, LOC, MILE | REC (attach), EXP, RPT, AN, NOTIFY, AI context |

Graph: [DRS-DEPENDENCIES.md](../DRS-DEPENDENCIES.md)

---

## Artifacts (bootstrap)

| TYPE | Count | Next # | Legacy catalog |
|------|------:|-------:|----------------|
| MRID | 3 | 007 | MRID-000004–006 |
| SCREEN | 3 | 004 | SCR-017–020 |
| API | 2 | 003 | API-TRIP-001–002 |
| DB | 1 | 002 | TBL TRP |
| TEST | 1 | 002 | E2E-TRIP-001 |
| EVENT | 2 | 003 | EVT-010–011 |
| AI | 0 | 001 | — |
| DOC | 2 | 003 | Vol 3 FR-300, 302 |
| SM | 1 | 002 | SM-TRIP |

Map: [DRS-LEGACY-MAP.md](../DRS-LEGACY-MAP.md)

---

## Roadmap

| Version | Target | Features |
|---------|--------|----------|
| v1.0.0 | V1 GA | Start, end, history, edit, one active trip/user |
| v1.1.0 | ROAD-VER-1.1 | Fleet: one active trip/vehicle |
| v1.2.0 | | Route suggestions (ROUTE domain) |

### Technical debt

| TD-ID | Description | Fix version |
|-------|-------------|-------------|
| — | — | — |

### KPIs

| KPI | Target |
|-----|--------|
| Trip start completion rate | >95% |
| Avg time to start trip | <30s |
| OCR attach rate per trip | >60% |

### Risks

| Risk | Mitigation |
|------|------------|
| Offline sync conflicts | SM-TRIP + SYNC domain |
| GPS inaccuracy | MILE domain; odometer authoritative |

---

## Health (blueprint phase)

| Doc | Test | Coverage | Security | Perf | Overall |
|-----|------|----------|----------|------|---------|
| 100% | 0% | 0% | — | — | — |

Target at V1 GA: **97% overall** (per MRMS-2 exemplar).

---

## Blueprint

| Volume | Chapters |
|--------|----------|
| 3 | FR-300–399 |
| 11 | SCR-017–020 |
| 12 | API-TRIP-* |
| 13 | SM-TRIP |
| 14 | EVT-010–011 |
| 18 | MOB offline trip |

---

## Exemplar Chain

[chains/TRIP-MRID-000004.md](../chains/TRIP-MRID-000004.md) — Start Trip full traceability

---

## Change History

| Date | Change | Author |
|------|--------|--------|
| 2026-06-24 | Domain registered STEP-031 | Agent |
