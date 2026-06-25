# STEP-043 — MEC-V1-S011 Expense Engine (BUILD-009)

| Field | Value |
|-------|-------|
| **Step ID** | STEP-043 |
| **Phase** | A |
| **Slice** | MEC-V1-S011 |
| **BUILD-ID** | BUILD-009 |
| **WAVE** | WAVE-005 |
| **Date** | 2026-06-25 |
| **Commit** | — |
| **Status** | complete |

## Objective

Complete **WAVE-005 — Expense engine**: manual expense CRUD, receipt-to-trip association, expense list/detail UI, and trip `expense_total` recalculation.

## Changes

- `packages/shared/src/schemas/expense.ts` — create/update/list/attach schemas
- `apps/web/src/server/services/expense.service.ts` — CRUD, `createExpenseFromReceipt`, `attachReceiptToTrip`, `recalculateTripExpenseTotal`
- API: `GET/POST /api/expenses`, `GET/PATCH/DELETE /api/expenses/[id]`, `POST /api/receipts/[id]/attach`
- `apps/web/src/components/expenses/ExpenseManager.tsx` — list with filters, manual form, detail, attach flow, trip expense list
- Pages: `/expenses`, `/expenses/new`, `/expenses/[id]`, `/expenses/[id]/edit`
- Refactored `ocr.service.ts` approve path to delegate to `expense.service`
- Trip and receipt detail pages — expense totals and cross-links
- Health: `/health` → `MEC-V1-S011` / `STEP-043`

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

Manual acceptance:

1. Create manual expense → appears in list and expense/combined reports
2. Attach receipt to trip → trip detail shows expense total updated
3. Edit expense amount → trip total recalculates
4. Soft-delete expense → removed from list; trip total decrements
5. OCR approve still creates expense via shared service

## Traceability

- **BUILD-009** · **WAVE-005**
- **MRID-000010** · **MRID-000011**
- **REC-MRID-000010** · **EXP-MRID-000011**

## Next step

**STEP-044** — [MEC-V1-S012 Onboarding & auth polish](../execution/slices/MEC-V1-S012-onboarding-auth.md)

GA roadmap: [ROADMAP-043-052.md](../execution/ROADMAP-043-052.md)
