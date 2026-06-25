# Database Restore Runbook

**OPS-RB-005** · Volume 19 Ch. 16–17

## Full restore

1. Declare incident (OPS-INC-P1)
2. Stop writes if corruption suspected (maintenance mode flag)
3. Open Supabase dashboard → Database → Backups
4. Select restore point (PITR or daily snapshot)
5. Restore to **new** project or branch first when testing
6. Verify RLS policies and migration version
7. Run smoke suite against restored instance
8. Cut over DNS / update connection strings
9. Communicate to customers if data loss window exists

## Single-record recovery

1. Identify record ID and timestamp
2. Query PITR branch or backup export
3. Insert via audited admin RPC — never direct prod SQL without review

## RTO / RPO

| Metric | Target |
|--------|--------|
| RTO | 4 hours |
| RPO | 24 hours (daily); 7 days PITR |

Log drill results in `docs/ops/restore-drill-log.md`.
