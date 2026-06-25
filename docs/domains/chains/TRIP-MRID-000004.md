# Traceability Chain — TRIP-MRID-000004 (Start Trip)

**MRMS-2 Part XIII** · Complete lifecycle map.

---

## Requirement

| Field | Value |
|-------|-------|
| **DRS** | `TRIP-MRID-000004` |
| **Global** | `MRID-000004` |
| **Name** | User can start a trip |
| **Status** | Approved |
| **Domain record** | [records/TRIP.md](../records/TRIP.md) |
| **Full record** | [requirements/records/TRIP-MRID-000004.md](../../requirements/records/TRIP-MRID-000004.md) |

---

## Implementation Map

```
TRIP-MRID-000004  Start Trip requirement
       │
       ├── TRIP-SCREEN-002  →  SCR-019  /trips/start
       ├── TRIP-API-001     →  API-TRIP-001  POST start
       ├── TRIP-DB-001      →  trips table (TBL TRP)
       │     ├── TRIP-FIELD-001  started_at
       │     └── TRIP-FIELD-002  start_odometer
       ├── TRIP-SM-001      →  SM-TRIP active transition
       ├── TRIP-EVENT-001   →  EVT-010 trip_started
       ├── TRIP-TEST-001    →  E2E-TRIP-001
       ├── TRIP-DOC-001     →  Vol 3 FR-300
       └── (no TRIP-AI-* at V1)
```

---

## Cross-Domain Dependencies

| Domain | Artifact | Role |
|--------|----------|------|
| AUTH | AUTH-MRID-000001 | Session required |
| BUS | BUS-MRID-000002 | Business selection |
| VEH | VEH-MRID-000003 | Vehicle selection |
| SUB | SUB-MRID-000015 | Trip quota check |
| MOB | MOB-MRID-000016 | Offline variant |
| AN | TRIP-EVENT-001 | Funnel analytics |

---

## Lifecycle

| Phase | Status | Date | Notes |
|-------|--------|------|-------|
| Specified | ☑ | 2026-06-24 | FR-300, MRID record |
| Designed | ☑ | Blueprint | SCR-019, API-TRIP-001 |
| Built | ☐ | — | BUILD-005 |
| Tested | ☐ | — | TRIP-TEST-001 |
| Verified | ☐ | — | QA acceptance |
| Released | ☐ | — | v1.0.0 |
| Maintained | — | — | |
| Deprecated | — | — | |
| Retired | — | — | |

---

## Release History

| Version | Change |
|---------|--------|
| — | Not yet shipped |

---

## Bug / Enhancement Log

| ID | Type | Linked test |
|----|------|-------------|
| — | — | — |

---

*Template for all MRID chains — copy to `chains/{DOMAIN}-MRID-NNNNNN.md`*
