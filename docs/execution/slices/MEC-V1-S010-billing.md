# MEC-V1-S010 — Billing & Limits

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S010 — Billing & Limits

Mission:
Enforce free tier limits (5 trips, 10 receipts/month), Stripe checkout for Pro and Small Business, billing portal, webhooks.

Context:
- Prior: MEC-V1-S009 complete
- MRIDs: SUB-MRID-000014, SUB-MRID-000015
- DEC-002 pricing lock
- Requires Stripe account + webhook endpoint

Allowed paths:
apps/web/src/app/billing/**
apps/web/src/lib/billing/**
apps/web/src/server/services/subscription.service.ts
apps/web/src/server/services/usage.service.ts
apps/web/src/app/api/stripe/**
apps/web/src/app/api/usage/**

Rules:
- Limit hit → block new trip start / receipt upload (cloud)
- Never delete user data on downgrade
- Paid plans unlock unlimited usage
- UsageCounter resets monthly

Forbidden:
- Custom payment forms (use Stripe Checkout)
- Deleting trips/receipts when over limit
- Enterprise SSO

Deliverables:
1. UsageCounter increment on trip start + receipt upload
2. Limit check middleware/service
3. Stripe Checkout + Customer Portal links
4. Webhook: subscription created/updated/canceled
5. /billing page with current plan

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] Free user blocked at 6th trip (same month)
- [ ] Free user blocked at 11th receipt
- [ ] Stripe test checkout completes
- [ ] Webhook updates Subscription row
- [ ] Pro user unlimited

Commit:
feat(billing): MEC-V1-S010 Stripe subscriptions and usage limits

Step: STEP-042
BUILD-IDs: BUILD-011
MRID-IDs: MRID-000014, MRID-000015
DRS-IDs: SUB-MRID-000014, SUB-MRID-000015
```
