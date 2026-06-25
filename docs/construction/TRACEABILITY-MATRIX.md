# Traceability Matrix (Starter)

**Master Build Index** · Volume 21

Expand rows as features ship. Full matrix lives here; [MASTER-BUILD-INDEX.md](../MASTER-BUILD-INDEX.md) links registries.

| FR-ID | SCR-ID | API-ID | Table(s) | SM-ID | EVT-ID | WAVE |
|-------|--------|--------|----------|-------|--------|------|
| FR-001 | SCR-003–007 | API-AUTH-* | profiles | — | EVT-001 | WAVE-001 |
| FR-100 | SCR-010 | API-BIZ-* | businesses | — | — | WAVE-002 |
| FR-200 | SCR-011 | API-VEH-* | vehicles | — | — | WAVE-002 |
| FR-300 | SCR-019–020 | API-TRIP-* | trips | SM-TRIP | EVT-010+ | WAVE-003 |
| FR-500 | SCR-031–033 | API-RCP-* | receipts, ocr_results | SM-RCP, SM-OCR | EVT-MOB-002 | WAVE-004 |
| FR-400 | SCR-035+ | API-EXP-* | expenses | SM-EXP | — | WAVE-005 |
| FR-800 | SCR-040–041 | API-RPT-* | reports | SM-RPT | — | WAVE-006 |
| FR-012 | SCR-009 | API-SUB-* | subscriptions | SM-SUB | — | WAVE-007 |

Add rows per feature. PRs must not merge without matrix impact considered.
