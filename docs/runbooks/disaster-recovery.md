# Disaster Recovery Runbook

**Volume 17 Ch. 26** · Volume 9 · Volume 8

## Objectives

| Metric | Target |
|--------|--------|
| RPO | 24 hours (daily backups) |
| RTO | 4 hours (P1) |

## Recovery order

1. Verify incident scope (auth, DB, storage, Stripe)
2. Restore Postgres from latest Supabase backup
3. Verify RLS policies and migrations
4. Restore Storage buckets if affected
5. Replay or reconcile Stripe webhooks
6. Smoke test customer + admin paths
7. Customer communication per Volume 15

Expand with environment-specific steps before production launch.
