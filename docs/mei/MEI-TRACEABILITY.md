# Master Traceability Matrix

**MEI Section 22** · Blueprint → implementation.

| MRID | Blueprint | Screen | API | Table | SM | AI | EVT | Test | Doc |
|------|-----------|--------|-----|-------|-----|-----|-----|------|-----|
| MRID-000004 | Vol 3 FR-300 | SCR-019 | API-TRIP-001 | trips | SM-TRIP | — | EVT-010 | E2E-trip | Vol 11 |
| MRID-000007 | Vol 3 FR-500 | SCR-031 | API-RCP-* | receipts | SM-RCP | — | EVT-MOB-002 | E2E-rcp | Vol 11 |
| MRID-000008 | Vol 5/16 | SCR-033 | API-RCP-* | ocr_results | SM-OCR | PRM-OCR-001 | EVT-052 | golden | PROMPT-INDEX |

Full MRID list: [MRID-INDEX.md](MRID-INDEX.md)  
FR starter: [TRACEABILITY-MATRIX.md](../construction/TRACEABILITY-MATRIX.md)

**Rule:** No orphan artifacts — every SCR/API/EVT links to ≥1 MRID.
