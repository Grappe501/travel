# Master MRID Registry

**MRMS Part V** · Single source of truth for all requirements.

| MRID | Domain ID | Title | Cat | Priority | Status | Ver | Owner | FR | SCR | API | Tests |
|------|-----------|-------|-----|----------|--------|-----|-------|-----|-----|-----|-------|
| MRID-000001 | AUTH-MRID-000001 | User can register and log in | AUTH | Critical | Approved | 1.0 | Eng | FR-001 | SCR-003–007 | API-AUTH-* | UT, IT, E2E |
| MRID-000002 | BUS-MRID-000002 | User can create and select a business | BUS | Critical | Approved | 1.0 | Eng | FR-100 | SCR-010 | API-BIZ-* | UT, IT |
| MRID-000003 | VEH-MRID-000003 | User can add and select a vehicle | VEH | Critical | Approved | 1.0 | Eng | FR-200 | SCR-011 | API-VEH-* | UT, IT |
| MRID-000004 | TRIP-MRID-000004 | User can start a trip | TRIP | Critical | Approved | 1.0 | Eng | FR-300 | SCR-019 | API-TRIP-001 | UT, IT, E2E |
| MRID-000005 | TRIP-MRID-000005 | User can end a trip | TRIP | Critical | Approved | 1.0 | Eng | FR-302 | SCR-020 | API-TRIP-002 | UT, IT, E2E |
| MRID-000006 | TRIP-MRID-000006 | User can view trip history | TRIP | High | Approved | 1.0 | Eng | FR-303 | SCR-017–018 | API-TRIP-* | IT, E2E |
| MRID-000007 | REC-MRID-000007 | User can capture a receipt (camera) | REC | Critical | Approved | 1.0 | Eng | FR-500 | SCR-031 | API-RCP-* | E2E, ACC |
| MRID-000008 | OCR-MRID-000008 | OCR extracts receipt fields | OCR | Critical | Approved | 1.0 | Eng | FR-501 | SCR-033 | API-RCP-* | IT, golden |
| MRID-000009 | OCR-MRID-000009 | User can correct OCR results | OCR | High | Approved | 1.0 | Eng | FR-502 | SCR-033 | API-RCP-* | E2E |
| MRID-000010 | REC-MRID-000010 | User can attach receipt to trip | REC | High | Approved | 1.0 | Eng | FR-503 | SCR-034 | API-RCP-* | IT |
| MRID-000011 | EXP-MRID-000011 | User can add manual expense | EXP | High | Approved | 1.0 | Eng | FR-400 | SCR-035+ | API-EXP-* | UT, IT |
| MRID-000012 | RPT-MRID-000012 | User can generate mileage report | RPT | High | Approved | 1.0 | Eng | FR-800 | SCR-040 | API-RPT-* | IT, PERF |
| MRID-000013 | RPT-MRID-000013 | User can export PDF/CSV/Excel | RPT | High | Approved | 1.0 | Eng | FR-801 | SCR-041 | API-RPT-* | IT, E2E |
| MRID-000014 | BILL-MRID-000014 | User can subscribe (Stripe) | BILL | Critical | Approved | 1.0 | Eng | FR-012 | SCR-009 | API-SUB-* | IT, SEC |
| MRID-000015 | BILL-MRID-000015 | Tier limits enforced | BILL | Critical | Approved | 1.0 | Eng | FR-003 | — | API-LIM-* | UT, IT |
| MRID-000016 | MOB-MRID-000016 | Offline trip start/end | MOB | High | Approved | 1.0 | Eng | FR-1400 | — | API-TRIP-* | E2E |
| MRID-000017 | MOB-MRID-000017 | Offline receipt capture | MOB | High | Approved | 1.0 | Eng | FR-1500 | SCR-031 | — | E2E |
| MRID-000018 | AI-MRID-000018 | AI suggests expense category | AI | Medium | Approved | 1.0 | Eng | FR-410 | SCR-033 | — | golden |
| MRID-000019 | AI-MRID-000019 | Duplicate receipt detection | AI | Medium | Approved | 1.0 | Eng | FR-504 | SCR-033 | — | golden |
| MRID-000020 | ADM-MRID-000020 | Admin can look up customer | ADM | Medium | Approved | 1.0 | Eng | — | SCR-054 | API-ADM-001 | IT, SEC |

---

## Registry Statistics

| Metric | Value |
|--------|------:|
| Total registered | 20 |
| Approved (ready to build) | 20 |
| Building | 0 |
| Released | 0 |
| Target V1 | ~4,405 |

---

## Expansion Plan

1. Decompose Volume 3 FR-* into MRIDs (batch by domain)
2. Add MRIDs for Volume 8 security controls
3. Add MRIDs for Volume 17 admin workflows
4. Add MRIDs for Volume 18 mobile/offline edge cases

Full records: [records/](records/) · Template: [MRID-TEMPLATE.md](MRID-TEMPLATE.md)
