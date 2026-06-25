# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 19 — Production Operations, DevOps & Site Reliability Engineering (SRE)

**Version 1.0**

---

## Who This Document Is For

Volume 19 is the **Operations Bible** — the bridge between engineering and running a real SaaS business. Most startups build the application first and scramble to figure out backups, outages, deployments, monitoring, and scaling. This volume reverses that: **the entire operations model is designed before the first production deployment.**

| Role | Use this volume to… |
|------|---------------------|
| **Engineering** | Deploy safely, meet SLOs, respond to incidents |
| **DevOps / SRE** | Environments, monitoring, backups, capacity |
| **Founders** | Production readiness, error budgets, maturity roadmap |
| **AdminOS operators** | Ops dashboard complements Volume 17 ADM-INFRA |

**Related:** [Volume 6 — Technical Architecture](06-technical-architecture.md) · [Volume 9 — QA & Release](09-testing-quality.md) · [Volume 17 — AdminOS](17-admin-operating-system.md) · [Volume 8 — Security](08-security.md)

**Volume 19 is canonical** for environments, deployment pipeline, SLOs, backups, DR, runbooks, and operational metrics. Volume 6 defines stack; Volume 9 defines test gates; Volume 17 defines admin UI for ops visibility.

---

## Operations Catalog

Permanent **OPS-IDs** for environments, services, SLOs, jobs, and runbooks.

Tracker: [`docs/ops/OPS-INDEX.md`](../ops/OPS-INDEX.md) · Runbooks: [`docs/runbooks/`](../runbooks/)

---

# Part I — Operations Philosophy

## Chapter 1 — Purpose

This volume defines how the platform is **deployed, monitored, maintained, recovered, and continuously improved** in production.

| Goal | Outcome |
|------|---------|
| Keep the service available | Meet SLOs (Ch. 14) |
| Protect customer data | Backups + RLS + encryption |
| Recover quickly | Tested runbooks (Ch. 16–19) |
| Minimize downtime | Rollback + error budgets |
| Standardize operations | OPS-IDs, checklists |
| Enable confident deployments | Pipeline gates (Ch. 7) |

> The objective is **operational excellence**, not simply uptime.

---

## Chapter 2 — Operations Doctrine

Every production decision must satisfy five principles:

| Principle | Meaning |
|-----------|---------|
| **Reliability before speed** | No shortcut that risks data or availability |
| **Automation before manual work** | Repeatable pipelines, not heroics |
| **Visibility before assumptions** | Monitor first; dashboards before guesses |
| **Recovery before perfection** | Rollback beats debugging in prod |
| **Documentation before memory** | Runbooks, OPS-INDEX, BUILD-LOG |

---

# Part II — Environment Strategy

## Chapter 3 — Environment Architecture

**OPS-ENV-IDs** — isolated data, credentials, and pipelines per environment.

| OPS-ENV-ID | Name | Purpose | Deploy target |
|------------|------|---------|---------------|
| OPS-ENV-LOCAL | Local Development | Developer workstations | `localhost:3000` |
| OPS-ENV-INT | Integration | Automated CI tests | GitHub Actions |
| OPS-ENV-QA | QA | Manual exploratory testing | Netlify preview / QA project |
| OPS-ENV-STG | Staging | Production-like validation | Netlify staging + Supabase staging |
| OPS-ENV-PRD | Production | Customer-facing | Netlify prod + Supabase prod |

**Rules:**

* No production data in lower environments — ever
* Stripe test mode below PRD
* OpenAI rate-limited in STG; mocked in INT
* Migrations: INT → QA → STG → PRD (Volume 9 Ch. 22)

---

## Chapter 4 — Environment Configuration

Each environment defines (document in `docs/ops/environments/` per env):

| Config domain | Local | Staging | Production |
|---------------|-------|---------|------------|
| Database | Supabase local / branch | Staging project | Production project |
| Storage | Local / staging bucket | Staging bucket | Production bucket |
| Auth | Local keys | Staging keys | Production keys |
| AI (OpenAI) | Dev key / mock | Staging key, limits | Production key |
| Payments (Stripe) | Test mode | Test mode | Live mode |
| Email (Resend) | Sandbox / log | Staging domain | Production domain |
| Logging | Console | Sentry staging | Sentry prod |
| Monitoring | Optional | Full | Full + paging |

**Secret management:** Netlify env vars + Supabase secrets. No production secrets in lower envs. See `docs/runbooks/secret-rotation.md`.

---

# Part III — Infrastructure

## Chapter 5 — Infrastructure Inventory

**OPS-INF-IDs** — every production dependency has an owner.

| OPS-INF-ID | Service | Provider | Owner | Purpose |
|------------|---------|----------|-------|---------|
| OPS-INF-WEB | Web application | Netlify | Engineering | Next.js PWA |
| OPS-INF-API | API / Edge Functions | Supabase | Engineering | Business logic |
| OPS-INF-DB | Database | Supabase Postgres | Engineering | Primary data store |
| OPS-INF-STO | Object storage | Supabase Storage | Engineering | Receipt images |
| OPS-INF-AUTH | Authentication | Supabase Auth | Engineering | Sessions, JWT |
| OPS-INF-EMAIL | Transactional email | Resend | Engineering | MSG delivery |
| OPS-INF-AI | OCR / AI | OpenAI | Engineering | Receipt intelligence |
| OPS-INF-PAY | Payments | Stripe | Billing + Eng | Subscriptions |
| OPS-INF-MON | Error monitoring | Sentry | Engineering | Crashes, exceptions |
| OPS-INF-ANALYTICS | Product analytics | PostHog | Product | EVT pipeline |
| OPS-INF-BKP | Backup storage | Supabase managed | Engineering | DB backups |
| OPS-INF-DNS | DNS / TLS | Netlify | Engineering | Domain, HTTPS |

Status page (future): `status.domain.com` — OPS-INF-STATUS.

---

## Chapter 6 — Infrastructure as Code

Infrastructure must be **reproducible**.

| Artifact | Location | Scope |
|----------|----------|-------|
| Supabase schema | `supabase/migrations/` | DB, RLS, functions |
| Edge Functions | `supabase/functions/` | API, webhooks |
| Web app | `apps/web/` | Frontend |
| CI pipeline | `.github/workflows/` | Build, test, deploy |
| Netlify config | `netlify.toml` | Build, redirects, headers |
| Environment template | `.env.example` | Non-secret variable names |

**Avoid manual infra changes.** Document exceptions in BUILD-LOG step docs.

Secrets: referenced by name only in repo; values in provider consoles.

---

# Part IV — Deployment

## Chapter 7 — Deployment Pipeline

**OPS-DEPLOY-001** — no production deploy skips validation.

```
Developer commit
    ↓
Automated build (GitHub Actions)
    ↓
Lint (ESLint)
    ↓
Type check (tsc)
    ↓
Unit tests
    ↓
Integration tests
    ↓
Security scan (dependency audit)
    ↓
Package (Next.js build)
    ↓
Staging deployment (Netlify preview / staging)
    ↓
Acceptance validation (smoke + Volume 9 gates)
    ↓
Production approval (founder or eng lead)
    ↓
Production deployment (`main` → Netlify)
    ↓
Health verification (API-HLT-001, smoke)
```

| Gate | Blocks merge | Blocks prod |
|------|--------------|-------------|
| Lint / typecheck | ✓ | — |
| Unit + integration | ✓ | — |
| Security scan (critical) | ✓ | ✓ |
| Staging smoke | — | ✓ |
| Migration applied STG | — | ✓ |
| Rollback plan documented | — | ✓ |

Align Volume 9 Ch. 28 PR merge gates and Ch. 29 release process.

---

## Chapter 8 — Release Strategy

| Release type | When | Approval |
|--------------|------|----------|
| **Scheduled** | Weekly/biweekly | Standard checklist |
| **Emergency patch** | P1/P2 fix | Founder + eng; abbreviated STG if justified |
| **Hotfix** | Critical bug, service up | STG smoke minimum |
| **Rollback** | Post-deploy failure | Automatic trigger if health check fails |

Every release records:

| Field | Source |
|-------|--------|
| Version number | `package.json` / git tag |
| Changelog | `CHANGELOG.md` |
| Deployment timestamp | Netlify deploy log |
| STEP-ID | `BUILD-LOG.md` |
| Rollback instructions | `docs/runbooks/deployment-rollback.md` |
| Migration list | `supabase/migrations/` applied |

**ADM-REL** (Volume 17) surfaces release history in AdminOS.

---

# Part V — Monitoring

## Chapter 9 — System Monitoring

**OPS-MON-SYS** — infrastructure metrics (Supabase dashboard + Netlify analytics).

| Metric | Alert threshold |
|--------|-----------------|
| CPU / connection pool | > 80% sustained 5m |
| Memory | Provider limits |
| DB query P95 | > 500ms |
| Storage usage | > 80% quota |
| Network latency | Region degradation |
| Queue depth (OCR, sync) | Volume 17 ADM-QUEUE |
| AI processing backlog | > 200 jobs |
| Background job failures | > 3 in 1h |

Display **trends** — 24h, 7d, 30d in ADM-INFRA.

---

## Chapter 10 — Application Monitoring

**OPS-MON-APP** — Sentry + custom metrics.

| Signal | Source |
|--------|--------|
| API response times | Edge function logs |
| Request volume | Supabase / Netlify |
| Error rates | Sentry by release |
| Auth failures | Supabase Auth logs |
| Report generation failures | `report_jobs` status |
| Receipt upload failures | `receipts` + SM-OCR |
| Sync operations | EVT-060, SM-SYNC |

Real-time view: SCR-055 / ADM-INFRA.

---

## Chapter 11 — User Experience Monitoring

**OPS-MON-UX** — customer experience, not just servers.

| Metric | Target | Tool |
|--------|--------|------|
| Page load (LCP) | < 2.5s | Lighthouse CI, RUM |
| Time to interactive | < 3.5s | Web Vitals |
| Mobile responsiveness | MOB-PERF-* | Volume 18 |
| Crash rate | < 0.1% sessions | Sentry |
| Start trip completion | < 10s P95 | EVT-MOB-005 |
| Receipt capture completion | EVT-MOB-002 funnel | PostHog |

North Star and funnel metrics: Volume 14.

---

# Part VI — Incident Management

## Chapter 12 — Incident Classification

**OPS-INC-*** severity — aligns Volume 17 Ch. 22.

| Level | OPS-ID | Definition | Response |
|-------|--------|------------|----------|
| **P1 — Critical** | OPS-INC-P1 | Service unavailable or major data integrity | Immediate; all-hands |
| **P2 — High** | OPS-INC-P2 | Major feature unavailable (OCR, auth, payments) | < 1 hour |
| **P3 — Medium** | OPS-INC-P3 | Reduced functionality | < 4 hours |
| **P4 — Low** | OPS-INC-P4 | Minor / cosmetic | Backlog |

Examples:

| Incident | Severity |
|----------|----------|
| Auth down | P1 |
| Database corruption suspected | P1 |
| OCR > 50% failure | P2 |
| Report gen slow | P3 |
| UI typo | P4 |

---

## Chapter 13 — Incident Response Workflow

**Runbook:** [`docs/runbooks/incident-response.md`](../runbooks/incident-response.md)

```
Detect → Classify → Assign owner → Contain → Resolve →
Communicate → Verify → Post-incident review (PIR)
```

| Step | Action |
|------|--------|
| Detect | Monitoring alert, AdminOS, customer report |
| Classify | OPS-INC-P* assignment |
| Assign | On-call rotation (document contacts at launch) |
| Contain | Disable feature flag, scale, failover |
| Resolve | Fix + deploy via pipeline |
| Communicate | Status page + MSG templates (Volume 15) |
| Verify | Health checks + smoke |
| PIR | Within 48h for P1–P2; action items in BUILD-LOG |

Every significant incident → documented improvements.

---

# Part VII — Reliability

## Chapter 14 — Availability Targets

**OPS-SLO-IDs** — service level objectives for V1.

| OPS-SLO-ID | Service | Target (30d) | Measurement |
|------------|---------|--------------|-------------|
| OPS-SLO-API | API availability | 99.5% | Successful health + core API |
| OPS-SLO-DASH | Dashboard availability | 99.5% | HTTP 200 on `/dashboard` |
| OPS-SLO-UPLOAD | Receipt upload | 99.0% | Upload ACK within 30s |
| OPS-SLO-RPT | Report generation | 98.0% | Job complete within 5m |
| OPS-SLO-AUTH | Authentication | 99.9% | Login success rate |

Review monthly in executive ops review (Volume 17 ADM-EXEC).

---

## Chapter 15 — Error Budgets

**Error budget** = 100% − SLO target.

| SLO | Monthly budget (99.5%) | ~downtime allowed |
|-----|------------------------|-------------------|
| API | 0.5% | ~3.6 hours |

**When budget exhausted:**

1. Slow feature releases (freeze non-critical deploys)
2. Prioritize stability work on roadmap
3. Resolve operational debt before new features
4. Founder sign-off required for exceptions

Reliability influences roadmap — not just engineering backlog.

---

# Part VIII — Backups

## Chapter 16 — Backup Strategy

**OPS-BKP-001**

| Asset | Frequency | Retention | Encryption |
|-------|-----------|-----------|------------|
| Database (full) | Daily | 30 days | At rest (Supabase) |
| Database (PITR) | Continuous | 7 days | Provider |
| Receipt metadata | With DB | Same | Same |
| Receipt blobs | Storage replication | Same | Same |
| Configuration | Git + env export | Indefinite | Secrets excluded |
| Audit logs | With DB | 7 years policy | Volume 4 |

**Verification:** AUTO-005 (Volume 17) — backup success alert daily.

> Backups that cannot be restored are not valid backups.

---

## Chapter 17 — Restore Procedures

**Runbook:** [`docs/runbooks/database-restore.md`](../runbooks/database-restore.md)

Practice **quarterly:**

| Drill | RTO target | RPO |
|-------|------------|-----|
| Full database restore | 4 hours | 24h |
| Single-record recovery | 1 hour | Point-in-time |
| Configuration recovery | 30 min | Last commit |

Document results in `docs/ops/restore-drill-log.md`.

Failed drill **blocks production release** (Volume 9 Ch. 24).

---

# Part IX — Disaster Recovery

## Chapter 18 — Disaster Scenarios

**Runbook library** — each scenario: recovery steps + comms plan.

| Scenario | Runbook | Priority |
|----------|---------|----------|
| Database corruption | `database-restore.md` | P1 |
| Cloud outage (Supabase/Netlify) | `disaster-recovery.md` | P1 |
| Storage failure | `storage-failure.md` | P1 |
| AI provider outage | `ai-provider-outage.md` | P2 |
| Payment provider outage | `stripe-outage.md` | P2 |
| Email provider outage | Degrade gracefully | P3 |

Customer comms: Volume 15 incident MSG templates.

---

## Chapter 19 — Business Continuity

**Critical services (restore order):**

1. Authentication — users must access accounts
2. Database + trip/receipt write path
3. Receipt storage read path
4. OCR (degraded: manual entry)
5. Reports (delayed acceptable)
6. Billing (Stripe status page)

| Workaround | When |
|------------|------|
| Manual receipt entry | AI down |
| Offline queue | Network partial |
| Stripe hosted portal | Billing UI down |

**Focus:** preserve customer data first; restore core trip/receipt capture second.

---

# Part X — Operations Center

## Chapter 20 — Operations Dashboard

**OPS-DASH-001** — primary operational console. Implemented as AdminOS aggregation:

| Widget | ADM / OPS source |
|--------|------------------|
| System health | ADM-INFRA, SCR-055 |
| Active incidents | Pager / manual log |
| Queue status | ADM-QUEUE |
| Error rates | Sentry |
| Deployments | ADM-REL |
| Backup status | OPS-BKP-001 |
| Revenue health | ADM-BILL |
| AI health | ADM-AI |

Single pane: `/admin/ops` (extends ADM-DASH) — V1 minimum: SCR-053 + SCR-055.

---

## Chapter 21 — Daily Operations Checklist

**OPS-DAILY-001** — review each morning (~15 min):

| # | Check |
|---|-------|
| 1 | Overnight incidents (Sentry, support) |
| 2 | Backup completion (AUTO-005) |
| 3 | Failed scheduled jobs |
| 4 | Queue health (OCR, sync, export) |
| 5 | Payment issues (Stripe dashboard) |
| 6 | Security alerts (ADM-SEC) |
| 7 | Support ticket trends (ADM-SUPPORT) |

Routine discipline prevents larger failures. Automate digest where possible (AUTO-001).

---

# Part XI — Scheduled Operations

## Chapter 22 — Scheduled Jobs

**OPS-JOB-IDs** — inventory in [`OPS-INDEX.md`](../ops/OPS-INDEX.md).

| OPS-JOB-ID | Job | Frequency | Timeout | Retry |
|------------|-----|-----------|---------|-------|
| OPS-JOB-001 | Temp file cleanup | Daily | 30m | 3× |
| OPS-JOB-002 | Analytics aggregation | Hourly | 15m | 3× |
| OPS-JOB-003 | Report cleanup | Weekly | 1h | 2× |
| OPS-JOB-004 | Stripe subscription sync | Nightly | 30m | 3× |
| OPS-JOB-005 | Reminder generation | Daily | 15m | 3× |
| OPS-JOB-006 | Backup verification | Daily | 10m | 1× |

Each job: monitor failure → alert → runbook link.

Implementation: `pg_cron` + Edge Function schedulers (Volume 6).

---

## Chapter 23 — Maintenance Windows

| Policy | V1 |
|--------|-----|
| Preferred window | Sunday 02:00–06:00 UTC |
| Customer notice | 48h email for planned downtime |
| Rollback criteria | Health check fail × 3 |
| Verification | Smoke suite post-maintenance |

Minimize disruption — prefer zero-downtime deploys (Netlify atomic).

---

# Part XII — Security Operations

## Chapter 24 — Secret Rotation

**Runbook:** [`docs/runbooks/secret-rotation.md`](../runbooks/secret-rotation.md)

| Secret class | Cadence |
|--------------|---------|
| API keys (OpenAI, Resend) | 90 days |
| Supabase service role | 90 days |
| Stripe webhook secret | On compromise |
| Admin credentials | 90 days + MFA |

Rotation never blocks deploy pipeline — dual-key window where supported.

Volume 8 security ops complement.

---

## Chapter 25 — Vulnerability Management

| Activity | Frequency |
|----------|-----------|
| `npm audit` / Dependabot | Every PR |
| Advisory review | Weekly |
| Critical patch | < 72 hours |
| Remediation verification | Post-deploy scan |

Track open risks in `docs/ops/vulnerability-log.md` — transparent backlog.

---

# Part XIII — Performance

## Chapter 26 — Performance Baselines

**OPS-PERF-IDs** — compare releases against baselines.

| OPS-PERF-ID | Workflow | Baseline (P95) |
|-------------|----------|----------------|
| OPS-PERF-DASH | Dashboard load | < 1.5s |
| OPS-PERF-UPLOAD | Receipt upload | < 5s |
| OPS-PERF-OCR | OCR completion | < 15s |
| OPS-PERF-RPT | Report generation | < 60s |
| OPS-PERF-SEARCH | Search | < 500ms |

Regression > 20% from baseline → investigate before prod promote.

Volume 18 mobile perf; Volume 9 Lighthouse CI gates.

---

## Chapter 27 — Capacity Planning

Forecast quarterly:

| Dimension | Trigger to scale |
|-----------|------------------|
| Storage | > 70% quota |
| AI requests | > 80% rate limit |
| Database size | > 70% plan limit |
| MAU growth | 2× in 90 days |
| Report generation | Queue P95 > 5m |

Scale **before** capacity becomes customer-visible problem.

Supabase tier upgrades documented in BUILD-LOG step.

---

# Part XIV — Operational Documentation

## Chapter 28 — Runbook Library

**OPS-RB-IDs** — concise, tested runbooks in `docs/runbooks/`.

| OPS-RB-ID | Runbook | Status |
|-----------|---------|--------|
| OPS-RB-001 | `incident-response.md` | stub |
| OPS-RB-002 | `disaster-recovery.md` | stub |
| OPS-RB-003 | `secret-rotation.md` | stub |
| OPS-RB-004 | `deployment-rollback.md` | stub |
| OPS-RB-005 | `database-restore.md` | stub |
| OPS-RB-006 | `queue-recovery.md` | stub |
| OPS-RB-007 | `ai-provider-outage.md` | stub |
| OPS-RB-008 | `storage-failure.md` | stub |
| OPS-RB-009 | `stripe-outage.md` | stub |
| OPS-RB-010 | `deployment.md` | stub |

Index: [`docs/runbooks/README.md`](../runbooks/README.md)

Test quarterly — tag results in restore-drill-log.

---

## Chapter 29 — Operational Knowledge Base

`docs/ops/kb/` — institutional knowledge:

| Topic | Content |
|-------|---------|
| Common incidents | Symptom → cause → fix |
| Troubleshooting | DB slow, OCR fail, sync stuck |
| Diagnostics | Log locations, SQL queries |
| Contacts | On-call, vendor support |
| Escalation | Volume 17 Ch. 23 paths |

Knowledge must not live only in people's heads.

---

# Part XV — Operational Automation

## Chapter 30 — Automated Recovery

Automate where **safe, observable, reversible:**

| Automation | Behavior |
|------------|----------|
| Queue retries | Exponential backoff; idempotent |
| Health check restart | Netlify / function cold-start |
| Failed job alert | Pager / email |
| Temp cleanup | OPS-JOB-001 |
| Auto-rollback | Health check fail post-deploy (optional V1.1) |

Never auto-execute: data deletion, refunds, schema migrations.

---

## Chapter 31 — Operational AI

Future **OPS-AI-*** (assist only — no autonomous prod changes):

| Capability | Human approval |
|------------|----------------|
| Summarize incident timeline | Read-only |
| Suggest root cause | Operator validates |
| Recommend runbook | Operator executes |
| Highlight recurring risks | Weekly digest |

ENG-PROD (Volume 16) may power summaries — feature-flagged.

---

# Part XVI — Production Governance

## Chapter 32 — Change Management

Every production change includes:

| Requirement | Evidence |
|-------------|----------|
| Purpose | PR description + STEP doc |
| Risk assessment | Low / medium / high |
| Testing evidence | CI green + STG smoke |
| Rollback plan | OPS-RB-004 |
| Approval | Eng lead or founder for high risk |
| Post-deploy verification | Health + 30m Sentry watch |

History: git log + BUILD-LOG + Netlify deploy log.

---

## Chapter 33 — Operational Metrics

**DORA-style + SaaS ops:**

| Metric | Target (mature) |
|--------|-----------------|
| Deployment frequency | Weekly+ |
| Change success rate | > 95% |
| Mean time to detect (MTTD) | < 5 min |
| Mean time to acknowledge (MTTA) | < 15 min P1 |
| Mean time to recover (MTTR) | < 1h P1 |
| Incident count | Decreasing trend |
| Customer impact minutes | Tracked per incident |
| Backup success rate | 100% |

Review monthly; feed Volume 17 administrative KPIs.

---

# Part XVII — Launch Readiness

## Chapter 34 — Production Readiness Checklist

Before first production deploy:

| # | Gate |
|---|------|
| 1 | [ ] Infrastructure inventory complete (Ch. 5) |
| 2 | [ ] All environments configured (Ch. 3–4) |
| 3 | [ ] Monitoring operational (Ch. 9–11) |
| 4 | [ ] Backups verified + restore drill passed |
| 5 | [ ] Incident response documented + contacts set |
| 6 | [ ] Runbook library complete (Ch. 28) |
| 7 | [ ] Alerting configured (Sentry, backup, queue) |
| 8 | [ ] Deployment pipeline validated E2E |
| 9 | [ ] Rollback tested on staging |
| 10 | [ ] Capacity reviewed for launch load |
| 11 | [ ] Volume 9 launch gates passed |
| 12 | [ ] Volume 17 AdminOS ops widgets live |

---

## Chapter 35 — Operational Non-Negotiables

| # | Rule |
|---|------|
| 1 | Never deploy to production without validation |
| 2 | Never release without rollback capability |
| 3 | Never rely on untested backups |
| 4 | Never ignore monitoring alerts |
| 5 | Never perform undocumented production changes |
| 6 | Never allow single-person operational bus factor |
| 7 | Never prioritize features over data integrity |
| 8 | Never use production secrets in lower environments |
| 9 | Never skip post-deploy health verification |
| 10 | Never ship without incident response path |

---

## Chapter 36 — Operations Maturity Roadmap

| Level | Characteristics | Target |
|-------|-----------------|--------|
| **1 — Manual** | Heroics, tribal knowledge | Pre-launch |
| **2 — Automated** | CI/CD, basic monitoring | V1 launch |
| **3 — Standardized** | Runbooks, incident process, SLOs | V1 + 3 months |
| **4 — Predictive** | Error budgets, capacity planning | V1 + 12 months |
| **5 — Resilient** | Auto-recovery, continuous improvement | Scale phase |

Current target: **Level 2 at launch**, Level 3 within 90 days.

---

## Chapter 37 — The Reliability Standard

Customers should rarely think about infrastructure.

Success means the platform quietly does its job:

* Trips are recorded
* Receipts are preserved
* Reports are available
* Data is protected
* Work continues when parts of the system struggle

> **The best operations team is measured not by how often it responds to crises, but by how rarely customers notice that there was ever a problem.**

---

## Cross-Reference Index

| Volume | Link |
|--------|------|
| Volume 6 | Stack, CI/CD gates, environments overview |
| Volume 8 | Security ops, secret policy |
| Volume 9 | Test gates, DR validation, release process |
| Volume 14 | UX monitoring metrics |
| Volume 15 | Incident customer communications |
| Volume 17 | AdminOS dashboards, daily automations |
| Volume 18 | Mobile performance baselines |

---

## Document Map

| Need | Go to |
|------|-------|
| OPS catalog | [OPS-INDEX.md](../ops/OPS-INDEX.md) |
| Runbooks | [docs/runbooks/README.md](../runbooks/README.md) |
| CI/CD | `.github/workflows/` |
| Deploy config | `netlify.toml` |
| Restore drills | `docs/ops/restore-drill-log.md` |

---

*Previous: [Volume 18 — Mobile Field Experience](18-mobile-field-experience.md) | Next: [Volume 20 — Product Evolution](20-product-evolution-roadmap.md) | [Blueprint Index](README.md)*
