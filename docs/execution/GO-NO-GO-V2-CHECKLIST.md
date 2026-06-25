# Go / No-Go — Version 2 Program Start

**Gate before MEC-V2-S001 (STEP-074).**  
All **Core** items must be ☑. **Production** items required before MEC-V2-S006 (V2.0-alpha).

---

## A. V1 foundation (core)

| # | Item | Owner | Status |
|---|------|-------|--------|
| A1 | V1.13.0 deployed to production (`travel-mileage.netlify.app`) | Eng | ☐ |
| A2 | GPS migration applied (`trip_gps_points`, DIRECT_URL migrate) | Eng | ☐ |
| A3 | Field test beta live (`BETA_MODE`, shared access code) | Product | ☐ |
| A4 | ≥10 active field testers with ≥1 trip each | Product | ☐ |
| A5 | Admin field-test dashboard operational | Eng | ☐ |
| A6 | Core health gates green (`/health`, Sentry receiving events) | Eng | ☐ |
| A7 | DEC-004 scope lock signed off | Product | ☐ |
| A8 | STEP-073 execution packet merged | Eng | ☐ |

---

## B. Field-test baselines (required before S006)

Measure from `/admin/field-test` + analytics (after S004). Record in `docs/roadmap/v2-baseline-metrics.md`.

| # | Metric | Minimum sample | Baseline captured |
|---|--------|----------------|-------------------|
| B1 | D7 retention (tester cohort) | ≥10 testers, 7 days | ☐ |
| B2 | Median time-to-first-trip | ≥10 new testers | ☐ |
| B3 | Trip completion rate (started → ended) | ≥20 trips | ☐ |
| B4 | GPS opt-in rate (of completed trips) | ≥10 trips | ☐ |
| B5 | OCR user correction rate | ≥20 receipts | ☐ |
| B6 | Receipts linked to trip (%) | ≥20 receipts | ☐ |
| B7 | Top 5 support / feedback themes documented | Qualitative | ☐ |

**No-go:** If B2 median > 8 minutes, complete onboarding slice (SCR-013–014) before S006.

---

## C. Bridge wave exit (before S006 · V2.0-alpha)

| # | Item | Status |
|---|------|--------|
| C1 | Help center live with ≥8 articles | ☐ |
| C2 | Custom expense categories (SCR-059) | ☐ |
| C3 | Team invite + accountant read-only (≥1 dogfood team) | ☐ |
| C4 | Feature flags service operational | ☐ |
| C5 | Product analytics receiving page views + key events | ☐ |
| C6 | `packages/integrations/` scaffold merged | ☐ |

---

## D. V2.0-alpha exit (before S009 · auto detection)

| # | Item | Status |
|---|------|--------|
| D1 | ENG-TRIP suggestions shown on ≥50% of ended trips (beta flag) | ☐ |
| D2 | Calendar OAuth connected by ≥20% of beta users | ☐ |
| D3 | Suggestion accept rate ≥40% (trip intelligence) | ☐ |
| D4 | No P0 bugs in trip/calendar flows for 14 days | ☐ |

---

## E. V2.0 GA exit (2.2.0 release)

| # | Item | Status |
|---|------|--------|
| E1 | D7 retention improved ≥15% vs baseline (B1) | ☐ |
| E2 | OCR correction rate reduced ≥25% vs baseline (B5) | ☐ |
| E3 | Support tickets / 100 MAU reduced ≥30% vs baseline | ☐ |
| E4 | QuickBooks or Xero export validated with ≥3 real users | ☐ |
| E5 | Security review on partner API + OAuth tokens | ☐ |
| E6 | CHANGELOG + BUILD-LOG complete for 2.0.x series | ☐ |

---

## Sign-off

| Role | Name | Date | Go / No-Go |
|------|------|------|------------|
| Product | | | |
| Engineering | | | |

**If No-Go:** Document blockers in BUILD-LOG STEP-073 notes; remain on bridge slices only.
