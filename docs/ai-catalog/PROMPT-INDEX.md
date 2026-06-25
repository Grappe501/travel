# AI Prompt Registry — PROMPT-INDEX

Canonical spec: [Volume 16 — AI Operating System](../blueprint/16-ai-operating-system.md)

**No prompt in application code only.** Files: `supabase/functions/_shared/prompts/`

PR convention: `PRM-IDs: PRM-OCR-001`

| PRM-ID | Version | ENG-ID | Name | Model | Status |
|--------|---------|--------|------|-------|--------|
| PRM-OCR-001 | 1.0.0 | ENG-OCR | Receipt field extraction | gpt-4o | ☑ spec |
| PRM-MERCH-001 | 1.0.0 | ENG-MERCH | Merchant normalization | gpt-4o-mini | ☑ spec |
| PRM-CAT-001 | 1.0.0 | ENG-CAT | Expense categorization | gpt-4o-mini | ☑ spec |
| PRM-DUP-001 | 1.0.0 | ENG-DUP | Duplicate detection | gpt-4o-mini | ☑ spec |
| PRM-REM-001 | 1.0.0 | ENG-REM | Missing receipt analysis | gpt-4o-mini | ☑ spec |
| PRM-RPT-001 | 1.0.0 | ENG-RPT | Report narrative summary | gpt-4o-mini | ☑ spec |
| PRM-EXPL-001 | 1.0.0 | ENG-CAT | Category explanation one-liner | gpt-4o-mini | ☑ spec |
| PRM-SRCH-001 | 1.0.0 | ENG-SRCH | NL → filters (V1.1) | gpt-4o-mini | ☐ |
| PRM-TRIP-001 | 1.0.0 | ENG-TRIP | Trip nudge copy | gpt-4o-mini | ☑ spec |

## YAML template fields

id · version · engine · model · purpose · inputs · outputs · safety_rules · test_cases · changelog

## Golden test linkage

Each PRM row links to fixtures in `tests/fixtures/receipts/golden/README.md`

## Version history

| PRM-ID | Date | Change | Author |
|--------|------|--------|--------|
| PRM-OCR-001 | 2026-06-24 | Initial canonical spec | blueprint |

Legacy IDs (Volume 5): `ocr-receipt-v1` → **PRM-OCR-001**
