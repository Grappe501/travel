# Implementation Wave Registry — WAVE-INDEX

Canonical spec: [Volume 21 — Construction Manual](../blueprint/21-construction-manual.md)

| WAVE-ID | Name | BLD-LAYER | Exit criteria |
|---------|------|-----------|---------------|
| WAVE-001 | Infrastructure | FOUNDATION | Users can log in |
| WAVE-002 | Core entities | CORE | Workspace configured |
| WAVE-003 | Trips | WORKFLOW | Complete trip recorded |
| WAVE-004 | Receipts | WORKFLOW | Capture + OCR review |
| WAVE-005 | Expenses | WORKFLOW | Financial records linked |
| WAVE-006 | Reports | WORKFLOW | Production-quality exports |
| WAVE-007 | Billing | — | Paying customers |
| WAVE-008 | AI (advanced) | AI | Measurable effort savings |
| WAVE-009 | AdminOS | — | Company can operate |
| WAVE-010 | Launch hardening | — | Public launch ready |

## Build layers

| BLD-ID | Layer |
|--------|-------|
| BLD-LAYER-FOUNDATION | Ch. 5 |
| BLD-LAYER-CORE | Ch. 6 |
| BLD-LAYER-WORKFLOW | Ch. 7 |
| BLD-LAYER-AI | Ch. 8 |

## Protocols

| BLD-ID | Name |
|--------|------|
| BLD-DOD-001 | Definition of Done |
| BLD-AI-HANDOFF-001 | AI handoff protocol |
| BLD-GATE-MERGE | Merge gates |
| BLD-GATE-RELEASE | Release gates |
| BLD-RITUAL-WEEKLY | Weekly build review |

## Wave ↔ Phase mapping

| WAVE | Master Build Phase |
|------|-------------------|
| WAVE-001 | A + B (start) |
| WAVE-002 | B + G (onboarding) |
| WAVE-003 | C |
| WAVE-004 | D |
| WAVE-005 | C/D |
| WAVE-006 | E |
| WAVE-007 | F |
| WAVE-008 | D/G (AI polish) |
| WAVE-009 | G |
| WAVE-010 | H |

PR convention: `WAVE-IDs: WAVE-003` · `Step: STEP-NNN`
