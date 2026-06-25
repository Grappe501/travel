# STEP-060 — Global search (MEC-V1-S028)

**Version:** 1.5.0 · **API:** API-SRH-001 · **Screen:** SCR-043

## Scope

- Unified search across trips, expenses, receipts, clients, businesses, vehicles
- `GET /api/search?q=` with `$amount` exact match for expenses/receipts
- `/search` page with debounced live results (300ms)
- Global search bar in app shell + dashboard quick action
- `/` keyboard shortcut on search page

## Verification

- [x] Text search returns grouped results with deep links
- [x] `$25.00` finds matching expense/receipt amounts
- [x] Shell search bar navigates to `/search?q=`
- [x] Empty query shows validation error from API
