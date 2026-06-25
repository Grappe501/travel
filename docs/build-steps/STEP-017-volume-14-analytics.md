# STEP-017 — Volume 14 Analytics & BI

| Field | Value |
|-------|-------|
| **Step ID** | STEP-017 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | `d88ea72` |
| **Status** | complete |

## Objective

Add **Volume 14 — Analytics, Metrics & Business Intelligence** — North Star, funnels, EVT-ID registry, dashboards, privacy rules, and weekly review rhythm.

## Changes

- `docs/blueprint/14-analytics.md` — 21 sections + Final Standard
- `docs/analytics/EVENT-REGISTRY.md` — EVT-001–EVT-901 catalog
- Blueprint README, Volume 7 Ch. 16, Volume 13 cross-links

## Decisions

| Decision | Rationale |
|----------|-----------|
| North Star: paid users with ≥1 report/month | User spec; core product promise |
| Activation: trip + receipt in 24h | Aligns with Volume 7 |
| EVT-ID registry | Parallel to SCR/API/SM IDs |
| PostHog + Stripe + internal SQL | Volume 7 tooling |
| Privacy: no financial content in 3rd party analytics | Volume 8 alignment |

## Verification

- [x] 21 sections complete
- [x] Revenue, usage, retention, AI, report, billing, support, reliability metrics
- [x] 4 funnels documented
- [x] 4 dashboards specified
- [x] V1 analytics checklist + non-negotiables
- [x] EVENT-REGISTRY with 40+ events

## Next step

Blueprint sign-off → **STEP-019 Phase A: Repo scaffold**
