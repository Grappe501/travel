# Operations Registry — OPS-INDEX

Canonical spec: [Volume 19 — Production SRE](../blueprint/19-production-sre.md)

## Environments

| OPS-ENV-ID | Name |
|------------|------|
| OPS-ENV-LOCAL | Local Development |
| OPS-ENV-INT | Integration (CI) |
| OPS-ENV-QA | QA |
| OPS-ENV-STG | Staging |
| OPS-ENV-PRD | Production |

## Infrastructure services

| OPS-INF-ID | Service |
|------------|---------|
| OPS-INF-WEB | Netlify web app |
| OPS-INF-API | Supabase Edge Functions |
| OPS-INF-DB | Supabase Postgres |
| OPS-INF-STO | Supabase Storage |
| OPS-INF-AUTH | Supabase Auth |
| OPS-INF-EMAIL | Resend |
| OPS-INF-AI | OpenAI |
| OPS-INF-PAY | Stripe |
| OPS-INF-MON | Sentry |
| OPS-INF-ANALYTICS | PostHog |
| OPS-INF-BKP | Backup storage |
| OPS-INF-DNS | DNS / TLS |

## Service level objectives

| OPS-SLO-ID | Target |
|------------|--------|
| OPS-SLO-API | 99.5% |
| OPS-SLO-DASH | 99.5% |
| OPS-SLO-UPLOAD | 99.0% |
| OPS-SLO-RPT | 98.0% |
| OPS-SLO-AUTH | 99.9% |

## Incident severity

| OPS-ID | Level |
|--------|-------|
| OPS-INC-P1 | Critical |
| OPS-INC-P2 | High |
| OPS-INC-P3 | Medium |
| OPS-INC-P4 | Low |

## Scheduled jobs

| OPS-JOB-ID | Job |
|------------|-----|
| OPS-JOB-001 | Temp file cleanup |
| OPS-JOB-002 | Analytics aggregation |
| OPS-JOB-003 | Report cleanup |
| OPS-JOB-004 | Stripe subscription sync |
| OPS-JOB-005 | Reminder generation |
| OPS-JOB-006 | Backup verification |

## Performance baselines

| OPS-PERF-ID | Workflow |
|-------------|----------|
| OPS-PERF-DASH | Dashboard load |
| OPS-PERF-UPLOAD | Receipt upload |
| OPS-PERF-OCR | OCR completion |
| OPS-PERF-RPT | Report generation |
| OPS-PERF-SEARCH | Search |

## Runbooks (OPS-RB-*)

See [docs/runbooks/README.md](../runbooks/README.md).

PR convention: `OPS-IDs: OPS-SLO-API, OPS-RB-004`
