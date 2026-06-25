# Stripe Outage Runbook

**OPS-RB-009** · OPS-INF-PAY · OPS-INC-P2

## Detection

* Stripe status degraded
* Webhook failure spike
* Checkout errors

## Customer impact

* Existing subscribers: no immediate impact if already subscribed
* New upgrades / checkout: blocked temporarily

## Procedure

1. Confirm status.stripe.com
2. Display billing maintenance message (MSG-BIL-*)
3. Queue webhook events — Stripe retries 72h
4. Nightly OPS-JOB-004 reconcile after recovery
5. Manual reconciliation if gap > 24h

## Do not

* Double-charge during recovery — verify idempotency keys
