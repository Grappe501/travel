# DRS Artifact Type Registry

**MRMS-2 Part IV** · Universal format: `{DOMAIN}-{TYPE}-{NUMBER}`

---

## Core Types

| TYPE | Artifact | NUMBER format | Example | Legacy equivalent |
|------|----------|---------------|---------|-------------------|
| **MRID** | Requirement | 6 digits | `TRIP-MRID-000421` | `MRID-000421` |
| **SCREEN** | Screen / route | 3 digits | `TRIP-SCREEN-004` | `SCR-019` |
| **API** | HTTP endpoint | 3 digits | `TRIP-API-012` | `API-TRIP-001` |
| **DB** | Table, view, index | 3 digits | `TRIP-DB-006` | `TBL TRP` |
| **TEST** | Test case | 3 digits | `TRIP-TEST-018` | `E2E-TRIP-001` |
| **EVENT** | Analytics event | 3 digits | `TRIP-EVENT-011` | `EVT-010` |
| **AI** | Prompt / engine | 3 digits | `TRIP-AI-003` | `PRM-OCR-001` |
| **DOC** | Documentation anchor | 3 digits | `TRIP-DOC-007` | Vol 3 Ch. FR-300 |

---

## Extension Types

| TYPE | Artifact | Example | Legacy |
|------|----------|---------|--------|
| **SM** | State machine | `TRIP-SM-001` | `SM-TRIP` |
| **MSG** | Message template | `NOTIFY-MSG-001` | `MSG-*` |
| **ENG** | AI engine | `OCR-ENG-001` | `ENG-OCR` |
| **WAVE** | Build wave | `CORE-WAVE-001` | `WAVE-001` |
| **BUILD** | Build slice | `TRIP-BUILD-005` | `BUILD-005` |
| **FIELD** | DB column | `TRIP-FIELD-012` | `trips.start_odometer` |

---

## Numbering Rules

1. **Per domain, per type** — independent sequences
2. **Zero-padded** — MRID 6 digits; others 3 digits
3. **Never reuse** — retired artifacts keep IDs
4. **One primary TYPE** — a screen is SCREEN, not API

---

## PR / Commit Conventions

```
DRS-IDs: TRIP-MRID-000004, TRIP-API-001, TRIP-SCREEN-002
MRID-IDs: MRID-000004
Legacy: SCR-019, API-TRIP-001
```

Include DRS-IDs when touching domain artifacts. Include legacy IDs during transition.

---

## Type Selection Guide

| You are registering… | TYPE | Domain of… |
|---------------------|------|------------|
| User story / acceptance criteria | MRID | The capability |
| Next.js page / route | SCREEN | Primary workflow |
| REST/RPC handler | API | Resource entity |
| Postgres table | DB | Entity owner |
| Playwright / Vitest case | TEST | Feature under test |
| PostHog / internal event | EVENT | User action |
| OpenAI prompt version | AI | Feature served |
| Blueprint chapter link | DOC | Topic |
