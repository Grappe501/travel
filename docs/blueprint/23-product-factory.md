# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 23 — Product Factory, Continuous Development & Engineering Excellence

**Version 1.0**

---

## Who This Document Is For

Volume 23 is the **Product Factory Operating System** — the difference between a blueprint and a factory. Volumes 0–22 define *what* to build. Volume 23 defines **how every future feature** is designed, reviewed, built, tested, documented, released, and improved.

| Role | Use this volume to… |
|------|---------------------|
| **Product** | Feature intake, qualification, change control |
| **Engineering** | Build standards, testing factory, release pipeline |
| **AI agents** | Coding + documentation protocols (with human review) |
| **Leadership** | Metrics, maturity model, annual review |

**Related:** [Volume 9 — QA](09-testing-quality.md) · [Volume 20 — Roadmap](20-product-evolution-roadmap.md) · [Volume 21 — Construction](21-construction-manual.md) · [Volume 22 — Platform](22-platform-architecture.md)

| Volume | Role |
|--------|------|
| **21** | Construction Manual — *first build* waves |
| **23** | Product Factory — *every feature forever* |

> Build Version 2, 3, and 20 with the same quality as Version 1.

---

## Factory Catalog

Permanent **FCT-IDs** for lifecycle stages, gates, and protocols.

Tracker: [`docs/factory/FCT-INDEX.md`](../factory/FCT-INDEX.md)  
Feature proposal: [`docs/factory/FEATURE-PROPOSAL-TEMPLATE.md`](../factory/FEATURE-PROPOSAL-TEMPLATE.md)

---

# Part I — Product Factory Philosophy

## Chapter 1 — Purpose

This document defines the **repeatable process** from idea to production.

Every feature follows the same lifecycle:

```
Idea → Research → Specification → Architecture → UX → API →
Database → AI → Testing → Documentation → Release → Analytics → Improvement
```

> The factory produces **software**. It does **not** produce code.

**FCT-LIFECYCLE-001** governs all features — including V1 waves (Volume 21) and post-launch (Volume 20).

---

## Chapter 2 — Engineering Philosophy

The goal is not fast coding.

| Goal | Mechanism |
|------|-----------|
| Predictable delivery | FCT-LIFECYCLE + WAVE discipline |
| Low defects | Testing factory (Ch. 13–14) |
| High confidence | Gates (Ch. 21–22) |
| Continuous improvement | Post-release review (Ch. 17) |

**Velocity comes from removing uncertainty** — not skipping steps.

---

# Part II — Feature Lifecycle

## Chapter 3 — Feature Intake

**FCT-INTAKE-001** — every feature begins with a [Feature Proposal](../factory/FEATURE-PROPOSAL-TEMPLATE.md).

| Field | Required |
|-------|----------|
| Feature name | Yes |
| Problem being solved | Yes |
| Who benefits | Persona |
| Business value | Revenue / retention / ops |
| Customer value | Time saved / trust |
| Engineering complexity | S / M / L / XL |
| Dependencies | SCR/API/PLT-DOM IDs |
| Success metrics | EVT or KPI |
| Version target | ROAD-VER-* |

**Nothing enters development without this proposal.**

Store approved proposals in `docs/factory/proposals/`.

---

## Chapter 4 — Feature Qualification

**FCT-QUALIFY-001** — align Volume 20 Ch. 3–4.

Approve only if **at least one** yes:

| Criterion | |
|-----------|--|
| Saves time? | |
| Increases trust? | |
| Improves reporting? | |
| Reduces manual work? | |
| Fits vision (Vol 1/22)? | |

Reject → log in `docs/roadmap/declined.md` with reason.

Platform Council (Volume 22 Ch. 31) reviews L/XL complexity.

---

# Part III — Design Phase

## Chapter 5 — UX Requirements

**FCT-DESIGN-UX-001** — every feature specifies:

| Artifact | Volume ref |
|----------|------------|
| User story | Volume 3 FR format |
| Workflow | Volume 2 / SM-ID |
| Wireframe | Volume 10 |
| Mobile layout | Volume 18 |
| Tablet layout | Volume 18 Ch. 29 |
| Desktop layout | Volume 11 |
| Accessibility review | Volume 18 Ch. 22 |
| Empty state | SCR spec |
| Error state | ERR-* codes |
| Offline behavior | MOB-OFF-* / SM-SYNC |

Assign **SCR-ID** before UI implementation (Volume 11 rule).

---

## Chapter 6 — Technical Specification

**FCT-DESIGN-TECH-001** — nothing invented during implementation.

| Domain | Deliverable |
|--------|-------------|
| Database | Migration + Volume 4 update |
| API | API-ID in Volume 12 |
| Permissions | Volume 8 + RLS |
| Analytics | EVT-ID registered |
| AI | ENG/PRM if applicable |
| Notifications | MSG-ID if applicable |
| Testing | Test plan (Ch. 13) |
| Documentation | INDEX updates |
| Rollback | Feature flag or migration down plan |

Technical spec lives in `docs/factory/specs/FCT-NNN-*.md` or STEP doc.

---

# Part IV — Architecture Review

## Chapter 7 — Dependency Analysis

**FCT-ARCH-DEPS-001**

| Relation | Document |
|----------|----------|
| **Requires** | Must ship first |
| **Blocks** | Others waiting on this |
| **Optional** | Enhances but not required |
| **Future expansion** | PLT-MOD / ROAD hook |

Update [TRACEABILITY-MATRIX](../construction/TRACEABILITY-MATRIX.md).

Avoid hidden coupling across PLT-DOM boundaries.

---

## Chapter 8 — Impact Review

**FCT-ARCH-IMPACT-001** — assess before approval:

| Area | Question |
|------|----------|
| Performance | OPS-PERF regression? |
| Security | New attack surface? |
| AI | Cost / accuracy impact? |
| Billing | Tier limits? |
| Reporting | Snapshot integrity? |
| Analytics | New EVTs? |
| Admin | ADM module needed? |
| Support | New ticket category? |
| Operations | Runbook update? |
| Architecture | PLT-DOM ownership clear? |

Output: checklist in feature spec — surprises are failures of process.

---

# Part V — Development Standards

## Chapter 9 — Build Standards

**FCT-BUILD-001** — every feature includes:

| Layer | Standard |
|-------|----------|
| Backend | API envelope, Zod, RLS |
| Frontend | Volume 10 components only |
| Mobile | Volume 18 Field Standard |
| Tests | Ch. 13 pyramid |
| Documentation | Ch. 11 |
| Analytics | EVT wired |
| Admin tools | If ops-facing |
| Monitoring | Sentry + health |
| Feature flags | ADM-FLAGS for risk > medium |

Use [AI-HANDOFF-TEMPLATE](../construction/AI-HANDOFF-TEMPLATE.md) per Volume 21.

---

## Chapter 10 — Coding Standards

**FCT-CODE-001**

| Rule | Source |
|------|--------|
| Follow architecture | Volume 6, 22 PLT layers |
| Naming conventions | SCR/API/SM/EVT IDs in code comments |
| Documented | STEP doc + inline where non-obvious |
| Testable | Pure functions for business logic |
| Maintainable | No UI+DB+logic in one file (Vol 6 Ch. 31) |

> Readable code over clever code.

---

# Part VI — Documentation

## Chapter 11 — Documentation Requirements

**FCT-DOC-001** — documentation **is** the feature.

| Registry / doc | When updated |
|----------------|--------------|
| Architecture | ADR if structural |
| API-INDEX | New/changed API-ID |
| SCR-INDEX / Volume 11 | New screen |
| Admin docs | ADM-INDEX |
| Test docs | Test plan in spec |
| EVENT-REGISTRY | New EVT |
| PROMPT-INDEX | New/changed PRM |
| CHANGELOG | User-visible |
| BUILD-LOG | Every STEP |
| TRACEABILITY-MATRIX | Cross-links |

Incomplete documentation = feature **not done** (BLD-DOD-001).

---

## Chapter 12 — Decision Log

**FCT-ADR-001** — significant decisions → `docs/architecture/decisions/ADR-NNN.md`:

| Field | Content |
|-------|---------|
| Problem | What forced a decision? |
| Alternatives | Options considered |
| Decision | What we chose |
| Reason | Why |
| Tradeoffs | What we accept |
| Owner | Who |
| Date | When |

Preserves knowledge beyond individuals. Volume 20 Ch. 32 aligned.

---

# Part VII — Testing Factory

## Chapter 13 — Testing Pipeline

**FCT-TEST-001** — mandatory sequence:

```
Unit tests → Integration tests → UI tests → Accessibility →
Performance → Security → Manual QA → User acceptance
```

| Stage | Volume ref |
|-------|------------|
| Unit | Volume 9 pyramid |
| Integration | API + RLS |
| UI | Component + E2E |
| Accessibility | Volume 18, axe |
| Performance | OPS-PERF baselines |
| Security | Volume 8 checklist |
| Manual QA | SCR acceptance criteria |
| UAT | Ch. 26 scenarios |

No stage skipping for **high-risk** features (billing, auth, financial calc).

---

## Chapter 14 — Regression Protection

**FCT-REGRESS-001** — growing suite must verify no breakage:

| Core path | Minimum tests |
|-----------|---------------|
| Trips | SM-TRIP E2E |
| Receipts | SM-RCP + OCR |
| Reports | PDF totals match DB |
| Billing | Webhook + limits |
| AI | Golden set (Volume 16) |
| Authentication | Session + RLS |
| Admin | Role matrix smoke |

Add regression case **with every feature** touching that domain.

---

# Part VIII — Release Factory

## Chapter 15 — Release Pipeline

**FCT-RELEASE-001** — every release includes:

| Item | Owner |
|------|-------|
| Release notes | CHANGELOG |
| Migration review | DBA / eng lead |
| Rollback plan | OPS-RB-004 |
| Monitoring updates | Dashboards / alerts |
| Documentation updates | INDEX files |
| Customer communication | MSG if user-visible |
| Support briefing | Volume 17 KB |

Align Volume 19 Ch. 8 + Volume 21 BLD-GATE-RELEASE.

---

## Chapter 16 — Feature Flags

**FCT-FLAG-ROLLOUT-001** — release sequence:

```
Internal → Beta → 10% → 25% → 50% → 100%
```

| Stage | Audience |
|-------|----------|
| Internal | Team + ADM-FLAGS |
| Beta | Opt-in users |
| 10–50% | Percentage rollout |
| 100% | GA; flag retirement date set |

Feature flags reduce deployment risk (Volume 17 ADM-FLAGS).

---

# Part IX — Continuous Improvement

## Chapter 17 — Post-Release Review

**FCT-POST-001** — within 30 days of GA, review:

| Measure | Source |
|---------|--------|
| Usage | EVT adoption |
| Errors | Sentry |
| Support | Ticket tags |
| Performance | OPS-PERF |
| Revenue impact | Stripe / conversion |
| Customer satisfaction | CSAT / feedback |

Document lessons in `docs/factory/retros/FCT-NNN-retro.md`.

---

## Chapter 18 — Technical Debt

**FCT-DEBT-001** — every release allocates **15–20%** capacity (Volume 20 Ch. 26):

* Refactoring · Performance · Accessibility · Documentation · Tests

Debt records: `docs/tech-debt/TD-NNN.md` (Volume 6 Ch. 33).

Debt reduction is **continuous** — not a someday sprint.

---

# Part X — AI-Assisted Development

## Chapter 19 — AI Coding Protocol

**FCT-AI-CODE-001** — AI may assist:

| Task | Human review required |
|------|----------------------|
| Boilerplate | Yes — before merge |
| Tests | Yes — assert meaningful behavior |
| Documentation | Yes — accuracy |
| Refactoring suggestions | Yes — no scope creep |
| Migration planning | Yes — RLS impact |

AI must **not**: invent requirements, skip tests, bypass security, merge unfinished work.

Extends Volume 21 Ch. 19 + Volume 6 Ch. 31.

---

## Chapter 20 — AI Documentation Protocol

**FCT-AI-DOC-001** — every AI-generated artifact states:

| Field | |
|-------|--|
| Purpose | |
| Inputs | Blueprint IDs |
| Outputs | Files changed |
| Limitations | What it did not verify |
| Review status | Human reviewer + date |

Traceable AI contributions — not anonymous diffs.

---

# Part XI — Engineering Metrics

## Chapter 21 — Delivery Metrics

**FCT-METRIC-DELIVERY**

| Metric | Use |
|--------|-----|
| Lead time | Idea → production |
| Cycle time | Dev start → merge |
| Deployment frequency | Volume 19 DORA |
| Failed deployments | Quality gate health |
| Rollback frequency | Release risk |
| Bug escape rate | Test factory gaps |
| Documentation completion | INDEX row coverage |

Track in BUILD-LOG + optional dashboard.

---

## Chapter 22 — Quality Metrics

**FCT-METRIC-QUALITY**

| Metric | Target trend |
|--------|--------------|
| Code coverage (critical paths) | ↑ |
| Accessibility compliance | No regressions |
| Performance regressions | 0 per release |
| Security findings open | ↓ |
| Documentation completeness | 100% for shipped IDs |
| Support incidents / feature | ↓ over time |

Quality improves **release over release**.

---

# Part XII — Team Operations

## Chapter 23 — Sprint Structure

**FCT-SPRINT-001** — each cycle (1–2 weeks):

```
Planning → Architecture review → Implementation → Testing →
Documentation → Release → Retrospective
```

| Ceremony | Output |
|----------|--------|
| Planning | Approved proposals + WAVE alignment |
| Arch review | FCT-ARCH-* checklists signed |
| Implementation | PRs with IDs |
| Testing | CI green + QA sign-off |
| Documentation | INDEX updates merged |
| Release | FCT-RELEASE-001 |
| Retro | Process improvements |

Consistency > speed.

---

## Chapter 24 — Knowledge Sharing

Maintain:

| Activity | Cadence |
|----------|---------|
| Architecture reviews | Per L/XL feature |
| Design reviews | Per new SCR |
| Postmortems | P1–P2 incidents |
| Tech demos | Monthly |
| Internal documentation | Continuous |

Goal: **no single point of failure** in knowledge.

---

# Part XIII — Product Governance

## Chapter 25 — Change Control

**FCT-CHANGE-001** — significant changes require:

| Approval | When |
|----------|------|
| Business | Customer-facing / pricing |
| Architecture | New PLT-DOM or cross-domain |
| Security | Auth, RLS, data export |
| Testing evidence | CI + manual for high risk |
| Documentation | Always |
| Release planning | Production deploy |

Major changes are **deliberate** — not Friday afternoon merges.

---

## Chapter 26 — Risk Register

**FCT-RISK-001** — living register: [`docs/factory/RISK-REGISTER.md`](../factory/RISK-REGISTER.md)

| Category | Examples |
|----------|----------|
| Technical | Schema migration risk |
| Operational | Single-person bus factor |
| Security | Dependency CVE |
| Vendor | OpenAI / Stripe outage |
| AI | Model drift, cost overrun |
| Business | Churn, support load |

Review **monthly**; assign owner + mitigation.

---

# Part XIV — Scaling the Factory

## Chapter 27 — Multi-Team Development

As team grows:

| Practice | Volume ref |
|----------|------------|
| Ownership by PLT-DOM | Volume 22 Ch. 4 |
| Standardized interfaces | API envelope, events |
| Shared services coordination | PLT-SVC-* |
| Architectural consistency | Platform Council |

Throughput scales; quality does not dilute.

---

## Chapter 28 — Build Automation

**FCT-AUTO-001** — automate repetitive work:

| Automation | Tool |
|------------|------|
| Linting | ESLint CI |
| Testing | GitHub Actions |
| Documentation checks | PR template ID validation |
| Dependency scanning | npm audit / Dependabot |
| Versioning | CHANGELOG + git tags |
| Release packaging | Netlify + migration scripts |

Engineers solve problems — not copy-paste release steps.

---

# Part XV — Long-Term Excellence

## Chapter 29 — Engineering Maturity

**FCT-MATURITY-***

| Level | State | Target |
|-------|-------|--------|
| 1 | Manual development | Pre-factory |
| 2 | Automated testing | V1 launch |
| 3 | Continuous delivery | V1 + 6 months |
| 4 | Predictive quality + observability | V2 |
| 5 | Optimized org + continuous learning | Scale |

Factory checklist (Ch. 31) operationalizes Level 2 at launch.

---

## Chapter 30 — Annual Engineering Review

Evaluate each year:

* Development process · Architecture health · Technical debt  
* Team effectiveness · Tooling · Documentation · Customer outcomes

**Improve the factory** — not just the product.

Output: `docs/factory/reviews/YYYY-engineering.md`

---

# Part XVI — Version 1 Readiness

## Chapter 31 — Factory Checklist

Before factory declared operational:

| # | Item |
|---|------|
| 1 | [ ] FEATURE-PROPOSAL-TEMPLATE in use |
| 2 | [ ] FCT-LIFECYCLE documented (this volume) |
| 3 | [ ] CI testing pipeline (Volume 9 + Ch. 13) |
| 4 | [ ] Documentation standards in PR template |
| 5 | [ ] Release process validated (staging → prod) |
| 6 | [ ] Metrics tracked in BUILD-LOG |
| 7 | [ ] RISK-REGISTER active |
| 8 | [ ] Architecture review process (FCT-ARCH-*) defined |
| 9 | [ ] ADR template available |
| 10 | [ ] AI protocols (Ch. 19–20) in Cursor rules |

---

## Chapter 32 — Product Factory Non-Negotiables

| # | Rule |
|---|------|
| 1 | No feature without specification |
| 2 | No code without tests |
| 3 | No release without documentation |
| 4 | No deployment without rollback |
| 5 | No roadmap item without success metrics |
| 6 | No architectural shortcut without ADR |
| 7 | No technical debt ignored indefinitely |
| 8 | No merge without blueprint ID traceability |
| 9 | No AI merge without human review |
| 10 | No production change outside FCT-RELEASE-001 |

---

## Chapter 33 — The Product Factory Standard

> **The goal is not to build one great application. The goal is to build a system that can repeatedly produce great software with consistent quality.**

When Volume 23 is implemented, Mileage & Expense Copilot has a documented engineering operating model that delivers new features, onboards developers, incorporates AI assistance, and evolves for years **without losing consistency, quality, or strategic focus**.

---

## Blueprint Stack Complete

| Layer | Volume |
|-------|--------|
| Product | 0–16 |
| Company / field / ops | 17–19 |
| Evolution | 20 |
| First build | 21 |
| Platform | 22 |
| **Factory** | **23** |

**Execute:** [Master Build Index](../MASTER-BUILD-INDEX.md) · **Build:** [Volume 21](21-construction-manual.md) WAVE-001 · **Every feature after:** this volume.

---

*Previous: [Volume 22 — Platform](22-platform-architecture.md) | [Master Build Index](../MASTER-BUILD-INDEX.md) | [Blueprint Index](README.md)*
