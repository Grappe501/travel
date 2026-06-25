# STEP-018 — Volume 15 Communication Engine

| Field | Value |
|-------|-------|
| **Step ID** | STEP-018 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | `46a931c` |
| **Status** | complete |

## Objective

Add **Volume 15 — Communication, Notification & Engagement Engine** — MSG-ID registry, 7 notification types, 4 channels, timing, preferences, lifecycle, and Communication Standard.

## Changes

- `docs/blueprint/15-communication-engine.md` — 34 chapters in 12 parts
- `docs/communications/MSG-INDEX.md` — template registry
- Blueprint README, Volume 7 Ch. 23, Volume 14 footer

## Decisions

| Decision | Rationale |
|----------|-----------|
| MSG-ID catalog | Parallel to SCR/API/SM/EVT IDs |
| 7 notification types | User spec + priority matrix |
| Resend + notifications table | Volume 6 stack |
| Push V1.1, SMS future | Phased delivery |
| Quiet hours + frequency caps | Anti-spam by design |
| Marketing opt-in only | Compliance + non-negotiables |

## Verification

- [x] 34 chapters complete (12 parts)
- [x] Workflow, reminder, AI, billing, security message library
- [x] Onboarding + retention sequences
- [x] Internal admin + support alerts
- [x] Analytics + engagement dashboard specs
- [x] V1 readiness checklist + non-negotiables

## Next step

Blueprint sign-off → **STEP-020 Phase A: Repo scaffold**
