# STEP-062 — Search filters (MEC-V1-S030)

**Version:** 1.7.0 · **API:** API-SRH-001 (extended) · **Screen:** SCR-043

## Scope

- Date range filters (`from`, `to`) on trips, expenses, receipts
- Amount range filters (`amountMin`, `amountMax`) on expenses and receipts
- Type filter (`kind`) — limit to one entity group
- Category filter (`category`) — expenses only
- Filter-only search (no text query required)
- Search page UI: collapsible Filters panel + URL-synced params

## API

`GET /api/search?q=&from=&to=&amountMin=&amountMax=&kind=&category=`

## Verification

- [x] Date range returns trips/expenses/receipts in range without text query
- [x] Amount range narrows expense/receipt results
- [x] `$25.00` exact match still works alongside filters
- [x] Filters persist in URL and live search (300ms debounce)
- [x] Invalid date/amount ranges return validation errors
