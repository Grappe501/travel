# STEP-016 — Volume 13 State Machines

| Field | Value |
|-------|-------|
| **Step ID** | STEP-016 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | `0ea6a9a` |
| **Status** | complete |

## Objective

Add **Volume 13 — Component State Machines & Workflow Logic** — explicit SM-IDs for trips, receipts, OCR, expenses, reports, subscriptions, offline sync, and screen-level states.

## Changes

- `docs/blueprint/13-state-machines.md` — 12 sections + Final Standard
- `docs/state-machines/SM-INDEX.md` — tracker
- Blueprint README, Volume 12 footer cross-link

## Decisions

| Decision | Rationale |
|----------|-----------|
| SM-ID catalog (10 machines) | Parallel to SCR/API IDs |
| DB status enums documented | Aligns with Volume 4 columns |
| No boolean soup rule | Ch. 11 developer enforcement |
| Mermaid transition diagrams | Visual clarity for complex flows |
| Shared package location | `packages/shared/src/state-machines/` |

## Verification

- [x] 7 core V1 state machines (trip, receipt, OCR, expense, report, sub, sync)
- [x] 3 screen-level machines (dashboard, start trip, receipt review)
- [x] Button states, error recovery, events, analytics
- [x] QA matrix requirements + non-negotiables
- [x] Cross-refs to Volumes 4, 11, 12

## Next step

Blueprint sign-off → **STEP-017 Phase A: Repo scaffold**
