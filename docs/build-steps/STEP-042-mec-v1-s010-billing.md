# STEP-042 — MEC-V1-S010 Billing & Limits

| Field | Value |
|-------|-------|
| **Step ID** | STEP-042 |
| **Phase** | A |
| **Slice** | MEC-V1-S010 |
| **Date** | 2026-06-25 |
| **Commit** | `6edc398` |
| **Status** | complete |

## Objective

Enforce free-tier limits (5 trips, 10 receipts per month), Stripe Checkout for Pro and Small Business, Customer Portal, and webhook sync to `subscriptions`.

## Changes

- `packages/shared/src/schemas/billing.ts` — checkout plan schema
- `apps/web/src/lib/billing/config.ts` — limits, plan display, Stripe price IDs
- `apps/web/src/lib/billing/stripe.ts` — Stripe client singleton
- `apps/web/src/lib/billing/subscription-access.ts` — ensure subscription row, unlimited check
- `apps/web/src/server/services/usage.service.ts` — monthly counters, limit assertions, increments
- `apps/web/src/server/services/subscription.service.ts` — checkout, portal, webhook handlers
- API: `GET /api/usage`, `POST /api/stripe/checkout`, `POST /api/stripe/portal`, `POST /api/stripe/webhook`
- Trip/receipt services — block at limit, increment on success
- `auth.service` — create free `Subscription` on profile upsert
- UI: `/billing`, `BillingManager` — plan, usage, upgrade, portal
- Health: `/health` → `MEC-V1-S010` / `STEP-042`

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

Requires `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_SMALL_BUSINESS_MONTHLY`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` for checkout. Forward webhooks to `/api/stripe/webhook` (Stripe CLI or Netlify).

## Traceability

- **BUILD-011** · **MRID-000014** · **MRID-000015** · **SUB-MRID-000014** · **SUB-MRID-000015**

## Next step

**STEP-043** — [MEC-V1-S011 Expense Engine](../execution/slices/MEC-V1-S011-expense-engine.md) (BUILD-009)

GA roadmap: [ROADMAP-043-052.md](../execution/ROADMAP-043-052.md)
