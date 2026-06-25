# MEC-V1-S011 — Expense Engine

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S011 — Expense Engine

Mission:
Complete WAVE-005 — expense list/detail, manual expense CRUD, receipt-to-trip linking, and trip expense_total recalculation. Closes the gap left when BUILD-009 was deferred from the original S001–S010 packet.

Context:
- Prior: MEC-V1-S010 (STEP-042) complete
- BUILD-ID: BUILD-009 · WAVE-005
- MRIDs: REC-MRID-000010, EXP-MRID-000011
- FR: FR-403 (receipt association), FR-600 (expense record), FR-610 (categories — use existing slugs)
- Partial baseline: S008 approve creates one Expense per receipt; no list UI, no manual add, no attach flow, trip totals not recalculated
- DEC-002: Expenses are V1 in-scope; this slice completes that commitment

Allowed paths:
apps/web/src/app/expenses/**
apps/web/src/app/api/expenses/**
apps/web/src/lib/expenses/**
apps/web/src/server/services/expense.service.ts
packages/shared/src/schemas/expense.ts
apps/web/src/server/services/receipt.service.ts   (attach/link only)
apps/web/src/server/services/trip.service.ts      (expense_total recalc only)
apps/web/src/server/services/ocr.service.ts     (delegate to expense.service if needed)
apps/web/src/components/expenses/**

Rules:
- One receipt → one expense (V1); block duplicate expense rows for same receipt
- amount > 0 · category from EXPENSE_CATEGORY_SLUGS · expense_date not > today + 1 day
- Linking receipt/trip recalculates trip.expense_total and grand_total
- Soft-delete expenses (record_status); never hard-delete financial history
- Manual expenses require businessId; tripId and receiptId optional
- Audit log on create/update/delete/attach

Forbidden:
- Expense splits (one receipt → multiple expenses)
- Custom expense_categories table / CRUD (use seeded slugs only for V1)
- QuickBooks / tax export
- Bypassing auth on expense routes
- Client-side financial writes without server validation

Deliverables:
1. expense.service.ts — list, get, create, update, soft-delete, attachReceiptToTrip, recalculateTripExpenseTotal
2. Shared Zod schemas — expenseCreate, expenseUpdate, receiptAttachSchema
3. API: GET/POST /api/expenses, GET/PATCH/DELETE /api/expenses/[id], PATCH /api/receipts/[id]/attach (or POST /api/expenses/attach)
4. UI: /expenses list, /expenses/new, /expenses/[id] detail/edit, attach action from receipt detail
5. Replace /expenses shell with DashboardShell + ExpenseManager
6. Trip detail shows linked expenses; receipt detail shows link status + attach control
7. Refactor OCR approve to use expense.service for create + trip recalc (no duplicate logic)
8. Health → MEC-V1-S011 / STEP-043 when implemented

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] User adds manual expense without a receipt
- [ ] User views expense list filtered by date/category
- [ ] User edits and soft-deletes an expense
- [ ] User attaches existing receipt to a trip (MRID-000010)
- [ ] Trip expense_total updates when expenses link/unlink/change amount
- [ ] OCR approve path still works; uses shared expense service
- [ ] Reports include manually added expenses in expense/combined exports

Commit:
feat(expenses): MEC-V1-S011 expense engine attach and manual CRUD

Step: STEP-043
BUILD-IDs: BUILD-009
MRID-IDs: MRID-000010, MRID-000011
DRS-IDs: REC-MRID-000010, EXP-MRID-000011
```
