# Master Requirement ID Registry — MRID-INDEX

**MEI Section 22** · End-to-end traceability backbone.

Every requirement gets a permanent **MRID**. All artifacts reference one or more MRIDs.

| MRID | Requirement | FR | SCR | API | TBL | EVT | PRM | Status |
|------|-------------|-----|-----|-----|-----|-----|-----|--------|
| MRID-000001 | User can register and log in | FR-001 | SCR-003–007 | API-AUTH-* | profiles | EVT-001 | — | ☐ |
| MRID-000002 | User can create and select a business | FR-100 | SCR-010 | API-BIZ-* | businesses | — | — | ☐ |
| MRID-000003 | User can add and select a vehicle | FR-200 | SCR-011 | API-VEH-* | vehicles | — | — | ☐ |
| MRID-000004 | User can start a trip | FR-300 | SCR-019 | API-TRIP-001 | trips | EVT-010 | — | ☐ |
| MRID-000005 | User can end a trip | FR-302 | SCR-020 | API-TRIP-002 | trips | EVT-011 | — | ☐ |
| MRID-000006 | User can view trip history | FR-303 | SCR-017–018 | API-TRIP-* | trips | — | — | ☐ |
| MRID-000007 | User can capture a receipt (camera) | FR-500 | SCR-031 | API-RCP-* | receipts | EVT-MOB-002 | — | ☐ |
| MRID-000008 | OCR extracts receipt fields | FR-501 | SCR-033 | API-RCP-* | ocr_results | EVT-052 | PRM-OCR-001 | ☐ |
| MRID-000009 | User can correct OCR results | FR-502 | SCR-033 | API-RCP-* | receipts | EVT-054 | — | ☐ |
| MRID-000010 | User can attach receipt to trip | FR-503 | SCR-034 | API-RCP-* | receipts | — | — | ☐ |
| MRID-000011 | User can add manual expense | FR-400 | SCR-035+ | API-EXP-* | expenses | — | — | ☐ |
| MRID-000012 | User can generate mileage report | FR-800 | SCR-040 | API-RPT-* | reports | — | — | ☐ |
| MRID-000013 | User can export PDF/CSV/Excel | FR-801 | SCR-041 | API-RPT-* | reports | — | — | ☐ |
| MRID-000014 | User can subscribe (Stripe) | FR-012 | SCR-009 | API-SUB-* | subscriptions | — | — | ☐ |
| MRID-000015 | Tier limits enforced | FR-012 | — | API-LIM-* | usage_counters | — | — | ☐ |
| MRID-000016 | Offline trip start/end | FR-1400 | — | API-TRIP-* | sync_queue | EVT-062 | — | ☐ |
| MRID-000017 | Offline receipt capture | FR-1500 | SCR-031 | — | IndexedDB | EVT-062 | — | ☐ |
| MRID-000018 | AI suggests expense category | FR-410 | SCR-033 | — | ai_suggestions | EVT-052 | PRM-CAT-001 | ☐ |
| MRID-000019 | Duplicate receipt detection | FR-504 | SCR-033 | — | — | EVT-053 | PRM-DUP-001 | ☐ |
| MRID-000020 | Admin can look up customer | — | SCR-054 | API-ADM-001 | profiles | — | — | ☐ |

Expand as features ship. PRs must list `MRID-IDs:` affected.

Full matrix: [MEI-TRACEABILITY.md](MEI-TRACEABILITY.md)
