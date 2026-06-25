# STEP-063 — Navigation IA v2 (MEC-V1-S031)

**Version:** 1.8.0 · **Slice:** MEC-V1-S031 · **Screens:** SCR-056 (partial), shell nav

## Scope

- **Five-tab bottom nav** — Home · Trips · **Add** · Reports · **More** (no horizontal scroll)
- **Add sheet** — Start trip, upload receipt, add expense (SCR-056 partial)
- **More drawer** — Receipts, expenses, clients, **search**, **notifications**, settings, billing
- **Desktop top nav** — Primary links + Search + Add/More sheets + notification bell
- **Contextual mobile quick actions** — Trip-focused shortcuts replace duplicated tab strip
- **CI fix** — E2E smoke step skips when `E2E_USER_EMAIL` is unset (secrets not allowed in `if:`)

## Files

- `apps/web/src/lib/navigation/app-nav.ts` — nav config + helpers
- `apps/web/src/components/layout/BottomNav.tsx` — 5-tab bar + sheets
- `apps/web/src/components/layout/AppTopNav.tsx` — desktop IA
- `apps/web/src/components/layout/NavSheet.tsx` — bottom sheet primitive
- `apps/web/src/components/layout/NavMenuSheets.tsx` — Add + More menus
- `.github/workflows/ci.yml` — valid E2E conditional

## Verification

- [x] Bottom nav shows 5 items without overflow scroll
- [x] Add sheet links to trip start, receipt upload, new expense
- [x] More sheet includes search and notifications
- [x] Desktop top nav includes Search; bell for notifications
- [x] Trip detail shows contextual quick actions on mobile
- [x] `app-nav.test.ts` covers active-state helpers
- [x] CI workflow validates (no secrets in `if:`)
