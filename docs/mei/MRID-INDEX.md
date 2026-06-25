# Master Requirement ID Registry — MRID-INDEX

**MEI Section 22** · Summary view. **Canonical registry:** [requirements/MRID-REGISTRY.md](../requirements/MRID-REGISTRY.md) · **Constitution:** [requirements/MRMS.md](../requirements/MRMS.md)

Every requirement gets a permanent **MRID** (`MRID-NNNNNN`) and domain ID (`{DOMAIN}-MRID-NNNNNN`). All artifacts reference one or more MRIDs.

| MRID | Domain ID | Requirement | FR | SCR | API | TBL | EVT | PRM | Status |
|------|-----------|-------------|-----|-----|-----|-----|-----|-----|--------|
| MRID-000001 | AUTH-MRID-000001 | User can register and log in | FR-001 | SCR-003–007 | API-AUTH-* | profiles | EVT-001 | — | Approved |
| MRID-000002 | BUS-MRID-000002 | User can create and select a business | FR-100 | SCR-010 | API-BIZ-* | businesses | — | — | Approved |
| MRID-000003 | VEH-MRID-000003 | User can add and select a vehicle | FR-200 | SCR-011 | API-VEH-* | vehicles | — | — | Approved |
| MRID-000004 | TRIP-MRID-000004 | User can start a trip | FR-300 | SCR-019 | API-TRIP-001 | trips | EVT-010 | — | Approved |
| MRID-000005 | TRIP-MRID-000005 | User can end a trip | FR-302 | SCR-020 | API-TRIP-002 | trips | EVT-011 | — | Approved |
| MRID-000006 | TRIP-MRID-000006 | User can view trip history | FR-303 | SCR-017–018 | API-TRIP-* | trips | — | — | Approved |
| MRID-000007 | REC-MRID-000007 | User can capture a receipt (camera) | FR-500 | SCR-031 | API-RCP-* | receipts | EVT-MOB-002 | — | Approved |
| MRID-000008 | OCR-MRID-000008 | OCR extracts receipt fields | FR-501 | SCR-033 | API-RCP-* | ocr_results | EVT-052 | PRM-OCR-001 | Approved |
| MRID-000009 | OCR-MRID-000009 | User can correct OCR results | FR-502 | SCR-033 | API-RCP-* | receipts | EVT-054 | — | Approved |
| MRID-000010 | REC-MRID-000010 | User can attach receipt to trip | FR-503 | SCR-034 | API-RCP-* | receipts | — | — | Approved |
| MRID-000011 | EXP-MRID-000011 | User can add manual expense | FR-400 | SCR-035+ | API-EXP-* | expenses | — | — | Approved |
| MRID-000012 | RPT-MRID-000012 | User can generate mileage report | FR-800 | SCR-040 | API-RPT-* | reports | — | — | Approved |
| MRID-000013 | RPT-MRID-000013 | User can export PDF/CSV/Excel | FR-801 | SCR-041 | API-RPT-* | reports | — | — | Approved |
| MRID-000014 | BILL-MRID-000014 | User can subscribe (Stripe) | FR-012 | SCR-009 | API-SUB-* | subscriptions | — | — | Approved |
| MRID-000015 | BILL-MRID-000015 | Tier limits enforced | FR-003 | — | API-LIM-* | usage_counters | — | — | Approved |
| MRID-000016 | MOB-MRID-000016 | Offline trip start/end | FR-1400 | — | API-TRIP-* | sync_queue | EVT-062 | — | Approved |
| MRID-000017 | MOB-MRID-000017 | Offline receipt capture | FR-1500 | SCR-031 | — | IndexedDB | EVT-062 | — | Approved |
| MRID-000018 | AI-MRID-000018 | AI suggests expense category | FR-410 | SCR-033 | — | ai_suggestions | EVT-052 | PRM-CAT-001 | Approved |
| MRID-000019 | AI-MRID-000019 | Duplicate receipt detection | FR-504 | SCR-033 | — | — | EVT-053 | PRM-DUP-001 | Approved |
| MRID-000020 | ADM-MRID-000020 | Admin can look up customer | — | SCR-054 | API-ADM-001 | profiles | — | — | Approved |

Full records: [requirements/records/](../requirements/records/) · Expand per [DOMAIN-INDEX](../requirements/DOMAIN-INDEX.md)

PRs must list `MRID-IDs:` affected. Matrix: [MEI-TRACEABILITY.md](MEI-TRACEABILITY.md)
