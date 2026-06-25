# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 17 — Administration, Operations & Company Operating System (AdminOS)

**Version 1.0**

---

## Who This Document Is For

Volume 17 designs the **internal operating system** that runs the company behind the product. Volumes 0–16 design what customers see; AdminOS is what **employees, support, engineers, AI agents, and future leadership** follow.

| Role | Use this volume to… |
|------|---------------------|
| **Founders** | Executive dashboard, KPIs, incident response |
| **Support** | Customer lookup, timeline, escalation (Ch. 5–7) |
| **Engineering** | Health, queues, releases, feature flags |
| **Security** | Audit explorer, access reviews (Volume 8 complement) |
| **AI ops** | Prompt management, OCR queue (Volume 16 complement) |

**Related:** [Volume 8 — Admin security](08-security.md) · [Volume 11 — SCR-053–055](11-screen-bible.md) · [Volume 12 — API-ADM-*](12-api-architecture.md) · [Volume 14 — Dashboards](14-analytics.md)

---

## AdminOS Module Catalog

Permanent **ADM-IDs** for tools, dashboards, and workflows.

Tracker: [`docs/admin-os/ADM-INDEX.md`](../admin-os/ADM-INDEX.md)

**Routes:** `apps/web/src/app/admin/` · **API:** `API-ADM-*` · **Auth:** `app_metadata.role` + RLS service role (Volume 8 Ch. 29)

---

# Part I — Philosophy

## Chapter 1 — Purpose

AdminOS exists to:

| Function | Outcome |
|----------|---------|
| Operate the SaaS | Uptime, deployments, queues |
| Support customers | < 2 min problem resolution |
| Monitor product health | Real-time or labeled-delay metrics |
| Manage billing | Stripe alignment, refunds |
| Manage AI | Prompt versions, OCR quality |
| Monitor infrastructure | API, DB, storage, sync |
| Coordinate releases | Traceable, reversible |
| Measure business health | MRR, activation, churn |

> The public application serves **customers**. AdminOS serves the **company**.

---

## Chapter 2 — Administration Philosophy

Every admin tool answers:

> **"Can someone solve the customer's problem in under two minutes?"**

| Principle | Implementation |
|-----------|----------------|
| Minimize clicks | Customer lookup → timeline → action in 3 screens max |
| Minimize searching | Universal search by email, ID, business |
| Minimize guesswork | Pre-built workflows, runbooks linked inline |
| Audit everything | `admin_audit_logs` on every write |
| Least privilege | Role-based tool visibility (Ch. 3) |

Internal tools are **production software** — same QA discipline as customer app (Ch. 31).

---

# Part II — Admin Architecture

## Chapter 3 — Role-Based Administration

Roles map to `app_metadata.role` (extend Volume 8 RBAC).

| Role | Code | Access |
|------|------|--------|
| **Founder** | `founder` | Full AdminOS |
| **Product Manager** | `product` | Analytics, feature flags, roadmaps |
| **Customer Success** | `support` | Customer lookup, subscriptions, assist |
| **Billing** | `billing` | Payments, refunds, invoices |
| **Technical Support** | `tech_support` | OCR, sync, AI, reports |
| **Engineering** | `engineering` | Logs, infra, queues, deploys, flags |
| **Security** | `security` | Audit, alerts, access reviews |

| ADM-ID | Tool | founder | product | support | billing | tech | eng | security |
|--------|------|---------|---------|---------|---------|------|-----|----------|
| ADM-DASH | Admin Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ADM-CUST | Customer Lookup | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| ADM-BILL | Billing Ops | ✓ | — | ✓ | ✓ | — | — | — |
| ADM-AI | AI Health | ✓ | ✓ | — | — | ✓ | ✓ | — |
| ADM-INFRA | System Health | ✓ | — | — | — | ✓ | ✓ | ✓ |
| ADM-AUDIT | Audit Explorer | ✓ | — | — | — | — | ✓ | ✓ |
| ADM-FLAGS | Feature Flags | ✓ | ✓ | — | — | — | ✓ | — |
| ADM-REL | Release Center | ✓ | ✓ | — | — | — | ✓ | — |

Each role sees **only** permitted ADM modules in nav.

---

## Chapter 4 — Admin Dashboard

**ADM-ID:** ADM-DASH · **SCR:** SCR-053 · **Route:** `/admin`

### Widgets — answer "Is the business healthy today?"

| Section | Metrics | Source |
|---------|---------|--------|
| **Product Health** | Active users, trips/receipts/reports today | `business_events`, aggregates |
| **Revenue** | MRR, new subs, failed payments | Stripe + DB |
| **AI** | OCR queue depth, accuracy, P95 time | `ai_interaction_log`, ENG-PROD |
| **Infrastructure** | API health, storage, DB, sync queues | API-HLT-001 |
| **Support** | Open tickets, P1 count | help desk integration |

**Status colors:** green / yellow / red per threshold (Ch. 12).

Refresh: 60s auto; stale badge if > 5 min delayed.

---

# Part III — Customer Operations

## Chapter 5 — Customer Lookup

**ADM-ID:** ADM-CUST · **SCR:** SCR-054 (detail) · **API:** API-ADM-001

### Search

| By | Index |
|----|-------|
| Email | `profiles.email` |
| Business name | `businesses.name` |
| Subscription ID | Stripe |
| Receipt / Trip / Report ID | UUID |

### Result panel

| Field | Display |
|-------|---------|
| Plan | free / pro / business + status |
| Usage | trips/receipts this period |
| Recent activity | last 10 `business_events` |
| Support history | ticket links |
| Security alerts | failed logins, export requests |

**Target:** find any customer in **< 10 seconds**.

---

## Chapter 6 — Customer Timeline

**ADM-ID:** ADM-TIMELINE · part of SCR-054

Chronological unified view:

```
account_created → business_created → first_trip → first_payment →
support_tickets → recent_reports → recent_ai_suggestions
```

Data: `business_events` + `audit_logs` + support API.

**Support team's first stop** after lookup.

---

## Chapter 7 — Account Management

**ADM-ID:** ADM-ACCT · **API:** admin RPCs (audited)

| Action | Roles | Audit |
|--------|-------|-------|
| Suspend account | support, security | `admin_action` + reason |
| Reactivate | support, security | same |
| Reset usage counters | billing, founder | documented exception only |
| View plan details | support, billing | read — logged |
| Assist data export | support | triggers export job; user notified |

**Break-glass:** Volume 8 Ch. 29 — customer data access requires reason code + ticket ID.

Never expose receipt **images** in admin without explicit break-glass.

---

# Part IV — Billing Operations

## Chapter 8 — Subscription Dashboard

**ADM-ID:** ADM-BILL · **SCR:** extension of SCR-053 or `/admin/billing`

| View | Filters |
|------|---------|
| Active subscriptions | plan, status |
| Expiring | next 30 days |
| Failed payments | past_due |
| Cancellations | period end |
| Annual renewals | month |

Stripe Dashboard deep-link for payment detail; internal view for context + user link.

---

## Chapter 9 — Refund Workflow

**ADM-ID:** ADM-REFUND

```
refund_request → review → approval → Stripe action → audit_log → customer MSG
```

| Step | Owner | System |
|------|-------|--------|
| Request | support | ticket + ADM form |
| Review | billing | policy checklist (Volume 7) |
| Approval | billing or founder | dual approval > $50 |
| Execute | billing | Stripe API |
| Notify | auto | MSG-BIL-* (Volume 15) |

All steps in `admin_audit_logs`. Policy doc: Volume 7 refund rules.

---

# Part V — AI Operations

## Chapter 10 — AI Health Dashboard

**ADM-ID:** ADM-AI · links Volume 16 ENG-PROD

| Metric | Alert threshold |
|--------|-----------------|
| OCR queue depth | > 50 yellow, > 200 red |
| Average confidence | < 0.80 yellow |
| Failed requests / hour | > 5% red |
| Cost today / MTD | budget line |
| P95 processing time | > 8s yellow |
| Active PRM versions | compare A/B |

Prompt version comparison chart: PRM-OCR-001 vs canary.

---

## Chapter 11 — Prompt Management

**ADM-ID:** ADM-PROMPT · **Catalog:** PROMPT-INDEX

| View | Actions |
|------|---------|
| PRM-ID, version, release date | read |
| Performance metrics | correction rate, latency |
| Rollback | founder + engineering — deploy prior YAML |

Controlled release per Volume 16 Ch. 24 — no live edit in production UI V1 (read + rollback only).

---

# Part VI — Infrastructure Operations

## Chapter 12 — System Health

**ADM-ID:** ADM-INFRA · **SCR:** SCR-055 · **API:** API-ADM-002, API-HLT-001

| Component | Indicator |
|-----------|-------------|
| API latency P95 | green < 500ms |
| Database | connection pool, replication lag |
| Storage | usage %, error rate |
| Queue depth | OCR, report, export, notification, sync |
| Email delivery | Resend bounce rate |
| Payment webhooks | failure count |
| AI provider | OpenAI status API |

---

## Chapter 13 — Queue Management

**ADM-ID:** ADM-QUEUE

| Queue | Safe retry | Idempotency |
|-------|------------|-------------|
| OCR | re-queue failed by ID | receipt_id |
| Report generation | retry job | report job id |
| Export | retry | export id |
| Notification | retry dead letter | notification id |
| Sync | force sync user | user_id + op id |

**Rule:** Retries must not create duplicates (Volume 12 Ch. 32).

Engineering role only for manual retry; all actions audited.

---

# Part VII — Product Operations

## Chapter 14 — Feature Flags

**ADM-ID:** ADM-FLAGS · **API:** API-ADM-006

| Capability | V1 |
|------------|-----|
| Enable / disable globally | ✓ |
| Percentage rollout | ✓ |
| Internal testers only | ✓ |
| Beta user list | ✓ |

Each flag records: **owner**, **description**, **retirement date**, **created**.

Storage: `feature_flags` table or LaunchDarkly-style env (V1: DB).

---

## Chapter 15 — Release Center

**ADM-ID:** ADM-REL

| Track | Source |
|-------|--------|
| Production version | Netlify deploy + git tag |
| Staging version | preview branch |
| Deployment history | Netlify API |
| Rollback | one-click previous deploy |
| Release notes | CHANGELOG.md link |

Traceability: STEP-IDs, commit SHA, migration list.

---

# Part VIII — Support Operations

## Chapter 16 — Support Dashboard

**ADM-ID:** ADM-SUPPORT

| Metric | Use |
|--------|-----|
| Ticket volume | staffing |
| Categories | product gaps (Volume 14 Ch. 13) |
| Response / resolution time | SLA |
| Escalations | Ch. 23 paths |

Integrate help desk (Volume 7) — V1: email + simple ticket table.

---

## Chapter 17 — Knowledge Base Management

**ADM-ID:** ADM-KB · internal `docs/support/kb/`

| Article type | Examples |
|--------------|----------|
| Troubleshooting | sync failed, OCR poor quality |
| Billing | refund policy, plan change |
| AI | how suggestions work |
| Workflows | export, delete account |

Version articles in git; review quarterly. Link from AdminOS contextual help.

---

# Part IX — Security Operations

## Chapter 18 — Security Dashboard

**ADM-ID:** ADM-SEC · **Role:** security, founder

| Signal | Source |
|--------|--------|
| Failed logins spike | auth logs |
| Password resets | audit |
| New devices | session table |
| Export requests | `business_events` |
| Account locks | profiles |
| Admin actions | `admin_audit_logs` |

Volume 8 trust dashboard complement.

---

## Chapter 19 — Audit Explorer

**ADM-ID:** ADM-AUDIT · **API:** API-AUD-001–003

### Search

| Filter | |
|--------|--|
| User ID | |
| Date range | |
| Event type | |
| Admin actor | |
| Feature / entity | |

**Immutable** — append-only `audit_logs` + `admin_audit_logs`. No DELETE.

Export for compliance: CSV with access logged.

---

# Part X — Analytics Operations

## Chapter 20 — Executive Dashboard

**ADM-ID:** ADM-EXEC · Volume 14 Ch. 18 Founder Dashboard

| KPI | Cadence |
|-----|---------|
| MRR / churn | weekly |
| Activation / retention | weekly |
| AI accuracy | weekly |
| Support volume | daily |
| Infrastructure uptime | daily |

Designed for **Monday leadership review** (Volume 14 Ch. 19).

---

## Chapter 21 — Product Dashboard

**ADM-ID:** ADM-PRODUCT

| Monitor | Action |
|---------|--------|
| Feature adoption | roadmap input |
| Funnel drop-off | UX fixes |
| Error rates | engineering priority |
| Customer feedback | NPS themes |
| AI correction trends | PRM updates |

---

# Part XI — Operational Workflows

## Chapter 22 — Incident Response

**Runbook:** `docs/runbooks/incident-response.md`

```
issue_detected → severity (P1–P4) → owner → customer_impact →
resolution → post_incident_review (PIR)
```

| Severity | Response | Example |
|----------|----------|---------|
| P1 | 15 min | data loss, auth down |
| P2 | 1 hour | OCR > 50% fail |
| P3 | 4 hours | report gen degraded |
| P4 | next business day | minor UI |

PIR template within 48h for P1–P2. Volume 8 Ch. 19, Volume 9 DR.

---

## Chapter 23 — Customer Escalation

| Path | Owner | Trigger |
|------|-------|---------|
| Billing | billing lead | refund > policy, dispute |
| Security | security | breach suspicion, export abuse |
| Data integrity | engineering + founder | conflicting records |
| AI | tech_support → engineering | systematic OCR failure |
| Infrastructure | engineering | outage |

Clear Slack/email channel per path. Customer comms via Volume 15 templates.

---

# Part XII — Internal Automation

## Chapter 24 — Administrative Automations

| Automation | Schedule | ADM-ID |
|------------|----------|--------|
| Daily health report | 08:00 UTC | AUTO-001 |
| Weekly revenue summary | Monday | AUTO-002 |
| AI quality report | Monday | AUTO-003 |
| Queue depth alert | continuous | AUTO-004 |
| Backup verification | daily | AUTO-005 |

Automation **supports** operators — never auto-refund, auto-suspend, or auto-change user data without human approval.

---

## Chapter 25 — Scheduled Jobs

| Job | Schedule | Monitor |
|-----|----------|---------|
| Database backups | daily | AUTO-005 |
| Analytics aggregation | hourly | EVT pipeline |
| Report cleanup | weekly | storage metrics |
| Temp file cleanup | daily | storage |
| Stripe sync | webhook + nightly reconcile | billing dashboard |

Each job: retry policy, alert on failure, logged in `scheduled_jobs` table.

`pg_cron` or Edge Function schedulers (Volume 6).

---

# Part XIII — Documentation

## Chapter 26 — Operations Runbooks

Maintain in `docs/runbooks/`:

| Runbook | Status |
|---------|--------|
| `incident-response.md` | required V1 |
| `disaster-recovery.md` | required V1 |
| `secret-rotation.md` | required V1 |
| `stripe-outage.md` | V1 |
| `database-restore.md` | V1 |
| `storage-failure.md` | V1 |
| `ai-provider-outage.md` | V1 |
| `deployment-rollback.md` | V1 |
| `queue-recovery.md` | V1 |

**Tested quarterly** — Volume 9 Ch. 24 DR validation.

---

## Chapter 27 — Standard Operating Procedures

| SOP | Audience |
|-----|----------|
| Onboarding support staff | HR + support lead |
| Processing refunds | billing (Ch. 9) |
| Responding to incidents | all on-call |
| Reviewing audit logs | security |
| Deploying releases | engineering (Volume 9) |

SOPs in `docs/admin-os/sop/` — version controlled.

---

# Part XIV — Future Operations

## Chapter 28 — Multi-Tenant Administration

V1.1+ architecture hooks:

| Capability | Design note |
|------------|-------------|
| Organization management | `organizations` parent of businesses |
| Multiple admins per org | org-scoped roles |
| Reseller support | reseller_id on subscription |
| White-label | env-specific branding flags |

AdminOS nav scopes by tenant context — no V1 implementation required.

---

## Chapter 29 — Enterprise Operations

Future:

* Organization hierarchy · department admin
* Compliance reporting exports
* Advanced audit packages for SOC2 customers
* SSO admin (Volume 8 future)

Extensibility: ADM modules plugin pattern; roles in `packages/shared/src/permissions/admin.ts`.

---

# Part XV — Operational Governance

## Chapter 30 — Administrative KPIs

| KPI | Target (V1 launch +90d) |
|-----|-------------------------|
| Avg support resolution | < 24h |
| AI issue resolution | < 48h |
| Billing accuracy | 99.9% |
| Deployment success rate | 100% rollback-capable |
| Infrastructure uptime | 99.5% |
| CSAT | > 4.2/5 |
| Ops efficiency | tickets per 100 MAU decreasing |

Measure **company health**, not just product metrics.

---

## Chapter 31 — Administrative Testing

Before each release verify:

| Area | Test |
|------|------|
| Admin authentication | role required |
| Permissions | role B cannot access ADM-BILL |
| Feature flags | toggle staging only |
| Refund workflow | Stripe test mode E2E |
| Queue controls | retry idempotent |
| Audit logging | action creates row |
| Dashboard accuracy | matches DB sample |

Volume 9 regression includes admin smoke suite.

---

# Part XVI — Version 1 Readiness

## Chapter 32 — AdminOS Launch Checklist

| # | Item |
|---|------|
| 1 | [ ] ADM-DASH (SCR-053) complete |
| 2 | [ ] Customer lookup + timeline (SCR-054) |
| 3 | [ ] Billing dashboard + refund workflow |
| 4 | [ ] AI monitoring (ADM-AI) |
| 5 | [ ] System health (SCR-055) |
| 6 | [ ] Audit explorer |
| 7 | [ ] Feature flags minimum set |
| 8 | [ ] Runbooks written (Ch. 26) |
| 9 | [ ] Support SOPs documented |
| 10 | [ ] Admin RBAC + audit on all writes |

---

## Chapter 33 — AdminOS Non-Negotiables

| # | Rule |
|---|------|
| 1 | Every administrative action is auditable |
| 2 | No support role receives unnecessary privileges |
| 3 | Customer data access is controlled and logged |
| 4 | Feature flags are documented |
| 5 | Dashboards show real-time or clearly labeled delayed data |
| 6 | Incident response procedures exist before launch |
| 7 | Internal tools are production software |
| 8 | No production data in non-production admin |
| 9 | Break-glass requires reason + ticket |
| 10 | Refunds follow documented policy |

---

## Chapter 34 — The Company Operating System

Success depends on how effectively the **company behind the product** operates.

AdminOS scales from **10 → 100,000 customers** without redesigning internal ops.

> **Every operational task should be observable, repeatable, documented, measurable, and continuously improvable.**

When Volume 17 is complete, you've designed not just the software, but the **operating model** that sustains it.

---

## Cross-Reference Index

| Volume | Link |
|--------|------|
| Volume 7 | Support, billing policy, GTM |
| Volume 8 | Admin security, break-glass |
| Volume 11 | SCR-053–055 |
| Volume 12 | API-ADM-*, API-AUD-* |
| Volume 14 | Executive/product dashboards |
| Volume 16 | Prompt management |
| Volume 9 | DR, release gates |

---

## Document Map

| Need | Go to |
|------|-------|
| Admin modules | [ADM-INDEX.md](../admin-os/ADM-INDEX.md) |
| Runbooks | [docs/runbooks/](../runbooks/) |
| SOPs | `docs/admin-os/sop/` |
| Customer admin APIs | [Volume 12](12-api-architecture.md) |

---

*Previous: [Volume 16 — AI Operating System](16-ai-operating-system.md) | Return to [Blueprint Index](README.md)*
