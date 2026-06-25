# Runbook Library

**Volume 19 Ch. 28** · Volume 17 Ch. 26

Concise, tested procedures. Expand before production launch.

## Production readiness

| Document | Purpose |
|----------|---------|
| [PRODUCTION-CHECKLIST.md](../execution/PRODUCTION-CHECKLIST.md) | **Env vars & deploy sign-off** (STEP-050 / STEP-065) |
| [deployment.md](deployment.md) | Netlify deploy + 30m Sentry watch |
| [database-migrations.md](database-migrations.md) | **Prisma migrate deploy** (STEP-065) |
| [E2E-SETUP.md](../execution/E2E-SETUP.md) | Playwright smoke / axe |

**Health:** `GET /health` — `readiness.coreReady` / `readiness.productionReady` + per-gate hints.

**Sentry test (staging):** set `SENTRY_TEST_ENABLED=1`, then `POST /health/sentry-test`.

---

## On-call basics (Volume 19)

| Priority | Target response | Examples |
|----------|-----------------|----------|
| P1 | 15 minutes | Database unreachable, auth down, data loss |
| P2 | 1 hour | Stripe webhooks failing, OCR provider outage, storage errors |
| P3 | Next business day | Single-user export issue, non-blocking UI bug |

**Escalation:** Engineering lead → founder. Log all incidents per [incident-response.md](incident-response.md).

**Post-deploy:** Health check → smoke → **30 minutes Sentry** ([deployment.md](deployment.md)).

---

## Runbooks

| OPS-RB-ID | Runbook | Severity |
|-----------|---------|----------|
| OPS-RB-001 | [incident-response.md](incident-response.md) | All |
| OPS-RB-002 | [disaster-recovery.md](disaster-recovery.md) | P1 |
| OPS-RB-003 | [secret-rotation.md](secret-rotation.md) | Security |
| OPS-RB-004 | [deployment-rollback.md](deployment-rollback.md) | Deploy |
| OPS-RB-005 | [database-restore.md](database-restore.md) | P1 |
| OPS-RB-006 | [queue-recovery.md](queue-recovery.md) | P2 |
| OPS-RB-007 | [ai-provider-outage.md](ai-provider-outage.md) | P2 |
| OPS-RB-008 | [storage-failure.md](storage-failure.md) | P1 |
| OPS-RB-009 | [stripe-outage.md](stripe-outage.md) | P2 |
| OPS-RB-010 | [deployment.md](deployment.md) | Deploy |
| OPS-RB-011 | [database-migrations.md](database-migrations.md) | Deploy |

**Testing:** Quarterly restore drill — log in `docs/ops/restore-drill-log.md`.
