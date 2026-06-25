# STEP-005 — Volume 2 Experience Architecture Rewrite

| Field | Value |
|-------|-------|
| **Step ID** | STEP-005 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | [`d8926fd`](https://github.com/Grappe501/travel/commit/d8926fd) |
| **Status** | complete |

## Objective

Rewrite Volume 2 as **Experience Architecture (UX/UI Master Blueprint)** — 16 chapters covering philosophy, navigation, full screen inventory, documented user journeys, states, design system, UX metrics, success checklist, and interaction micro-specifications.

## Changes

- `docs/blueprint/02-user-experience.md` — full rewrite
- `docs/blueprint/README.md` — updated Volume 2 title and summary

## Decisions

| Decision | Rationale |
|----------|-----------|
| Center **Add (+)** nav tab replaces dedicated Scan tab | User spec: fastest path to record anything |
| Add Sheet with 4 actions | Start trip, scan, manual expense, retroactive trip |
| 7 documented journeys (A–G) | Every tap and validation point for QA/engineering |
| Chapter 16 micro-specs | Animation, haptics, undo, offline — prevent dev inconsistency |
| ~45 V1 screens inventoried | Gate before production UI code |

## Verification

- [x] 16 chapters complete
- [x] Journeys A–G with validation branches
- [x] Aligns with Volume 1 Non-Negotiables N1–N3, N8
- [x] Design system component inventory (Ch. 13)
- [x] V1 UX success checklist (Ch. 15)

## Next step

Blueprint review of Volume 3 (Functional Requirements) or STEP-003 Phase A scaffold
