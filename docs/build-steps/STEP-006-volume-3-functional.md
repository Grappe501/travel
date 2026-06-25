# STEP-006 — Volume 3 Functional Requirements Rewrite

| Field | Value |
|-------|-------|
| **Step ID** | STEP-006 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | *(pending)* |
| **Status** | complete |

## Objective

Rewrite Volume 3 as **Functional Requirements & Business Logic Specification** — 21 chapters, unified FR template, full engine specs, acceptance criteria, and feature dependency matrix.

## Changes

- `docs/blueprint/03-functional-requirements.md` — full rewrite
- `docs/blueprint/README.md` — updated Volume 3 title

## Decisions

| Decision | Rationale |
|----------|-----------|
| FR ID namespaces (001, 100, 200, 300…) | Group by domain; room to insert |
| 10-field requirement template | No interpretation gap between teams |
| V1 one active trip per user | UX Volume 2; schema ready for per-vehicle V1.1 |
| 9 expense categories incl. airfare, equipment | User spec + report mapping |
| Chapter 21 mermaid dependency graph | Phases B–G build order |

## Verification

- [x] 21 chapters complete
- [x] All major FRs use full template
- [x] Acceptance criteria for critical path (Ch. 20)
- [x] Dependency matrix + build order (Ch. 21)
- [x] Aligned with Volume 2 journeys and Volume 4 entities

## Next step

Volume 4 database alignment review or STEP-003 Phase A scaffold
