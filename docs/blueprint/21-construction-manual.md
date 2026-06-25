# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 21 — Construction Manual, Implementation Roadmap & AI Build Protocol

**Version 1.0**

---

## Who This Document Is For

Volume 21 is the **crown jewel of the blueprint** — the Construction Manual. Volumes 0–20 define *the product*. Volume 21 defines **how it gets built**. This is not another requirements document; it is what Burt, any future AI agent, engineer, or team follows to build with minimal ambiguity.

| Reader | Use this volume to… |
|--------|---------------------|
| **AI agents (Cursor)** | Wave order, handoff protocol, forbidden shortcuts |
| **Engineers** | Dependencies, parallel workstreams, Definition of Done |
| **QA** | Testing order, release gates, UAT scenarios |
| **Product** | Weekly build review, launch phases |

**Control tower:** [Master Build Index](../MASTER-BUILD-INDEX.md) — status, registries, traceability.  
**This volume:** construction sequence, protocols, gates.

> Done correctly, this turns a 2-year project into a **6–9 month** build.

---

## Construction Catalog

Permanent **WAVE-IDs** and **BLD-IDs** for implementation waves and layers.

Tracker: [`docs/construction/WAVE-INDEX.md`](../construction/WAVE-INDEX.md)  
AI handoff template: [`docs/construction/AI-HANDOFF-TEMPLATE.md`](../construction/AI-HANDOFF-TEMPLATE.md)

**Supersedes** ad-hoc build order in Volume 6 Phase checklists for implementation sequencing. Volume 6 Ch. 31 rules remain binding; Volume 21 adds **order and coordination**.

---

# Part I — Purpose

## Chapter 1 — Mission

This volume converts every previous blueprint into an **executable construction plan**.

| Question | Answer location |
|----------|-----------------|
| What gets built first? | Ch. 5–8 layers, Ch. 9–18 waves |
| What depends on what? | Ch. 5–8, Master Build Index Part V |
| What order minimizes rework? | Build Philosophy Ch. 2 |
| What must never build simultaneously? | Ch. 23 |
| How do AI agents coordinate? | Ch. 19–20 |

---

## Chapter 2 — Build Philosophy

Never build randomly. Never jump ahead.

Every completed layer makes the next layer easier.

```
Architecture
    ↓
Foundation
    ↓
Infrastructure
    ↓
Core Features
    ↓
Automation
    ↓
AI (enhancement, not substitute)
    ↓
Optimization
    ↓
Scale
```

**BLD-LAYER-*** IDs map to Ch. 5–8.

---

# Part II — Development Doctrine

## Chapter 3 — Golden Rules

Every build slice must:

| Rule | Verification |
|------|--------------|
| Compile successfully | `pnpm build` |
| Pass automated tests | CI green |
| Preserve V1 backward compatibility | No breaking migration without ADR |
| Update documentation | STEP doc + affected INDEX rows |
| Include rollback where applicable | OPS-RB-004 for deploys |
| Leave repo deployable | `main` always shippable |

**No half-finished production commits.**

---

## Chapter 4 — Definition of Done

**BLD-DOD-001** — a feature is complete only when:

| # | Criterion |
|---|-----------|
| 1 | Code written |
| 2 | Tests passing (unit + integration for logic) |
| 3 | Documentation updated (STEP, INDEX, CHANGELOG if user-visible) |
| 4 | UI complete per SCR spec + Volume 10 |
| 5 | Mobile verified (Volume 18 Field Standard spot-check) |
| 6 | Accessibility reviewed (keyboard, labels, contrast) |
| 7 | Analytics connected (EVT-IDs registered) |
| 8 | AI integrated if applicable (ENG/PRM, golden set) |
| 9 | Security reviewed (RLS, permissions, no secrets) |
| 10 | Deployment validated (preview smoke) |

Align Volume 9 Definition of Done.

---

# Part III — Master Dependency Map

## Chapter 5 — Foundation Layer

**BLD-LAYER-FOUNDATION** — build first. Everything depends on this.

| Deliverable | Volumes | STEP phase |
|-------------|---------|------------|
| Repository monorepo | 6, PROJECT-STRUCTURE | A |
| Authentication | 8, 12 API-AUTH-* | B |
| Database + migrations | 4 | B |
| Design system shell | 10 | A–B |
| API framework (envelope, errors) | 12 | B |
| Navigation shell | 11, 18 | A |
| Configuration (.env.example) | 6, 19 | A |
| Logging + error handling | 6, 12 ERR-* | B |

**Parallel-safe:** Design system + DB schema (Ch. 23) once interfaces agreed.

---

## Chapter 6 — Core Business Layer

**BLD-LAYER-CORE** — shared dependencies for all modules.

| Deliverable | APIs | SCR |
|-------------|------|-----|
| Businesses | API-BIZ-* | SCR-010+ |
| Vehicles | API-VEH-* | SCR-011+ |
| Users / profiles | API-AUTH-008/009 | Settings |
| Subscription logic (read) | API-SUB-001/002 | SCR-009 |
| Settings | — | SCR-042+ |

Exit: user can configure workspace (business + vehicle + rate).

---

## Chapter 7 — Workflow Layer

**BLD-LAYER-WORKFLOW** — core user value.

| Module | SM | MOB |
|--------|-----|-----|
| Trips | SM-TRIP | MOB-WF-START/END |
| Receipts | SM-RCP, SM-OCR | MOB-WF-CAPTURE |
| Expenses | SM-EXP | — |
| Reports | SM-RPT | — |

**Order within layer:** Trips → Receipts → Expenses → Reports (expenses link receipts; reports aggregate both).

---

## Chapter 8 — Intelligence Layer

**BLD-LAYER-AI** — only after workflows exist.

| Capability | ENG | When |
|------------|-----|------|
| OCR extraction | ENG-OCR | Wave 4 (pipeline) |
| AI categorization | ENG-CAT | Wave 8 |
| Suggestions | ENG-TRIP, ENG-REM | Wave 8 |
| Duplicate detection | ENG-DUP | Wave 8 |
| Search intelligence | ENG-SRCH | V1.1 |

> AI **enhances** completed workflows — never compensates for missing ones.

Basic OCR in Wave 4; advanced intelligence in Wave 8.

---

# Part IV — Implementation Waves

## Chapter 9 — Wave 1: Infrastructure

**WAVE-001** · **BLD-LAYER-FOUNDATION**

| Deliverable | SCR | Exit |
|-------------|-----|------|
| Monorepo + CI + Netlify | — | Preview deploy works |
| Auth (signup, login, session) | SCR-003–007 | Users log in |
| DB schema (profiles, auth) | — | Migrations apply |
| Design tokens + BottomNav shell | SCR-015 skeleton | Shell renders |
| API response envelope | — | Shared types in `packages/shared` |
| Empty dashboard | SCR-015 | Authenticated landing |

**Exit criteria:** Users can log in successfully.

**STEP mapping:** Phase A + start Phase B.

---

## Chapter 10 — Wave 2: Core Entities

**WAVE-002** · **BLD-LAYER-CORE**

| Deliverable | SCR |
|-------------|-----|
| Business CRUD | SCR-010, settings |
| Vehicle CRUD | SCR-011, settings |
| Mileage rate setup | SCR-012 |
| Onboarding flow | SCR-008–014 |
| Settings foundation | SCR-042 |

**Exit criteria:** Users can configure their workspace.

---

## Chapter 11 — Wave 3: Trips

**WAVE-003** · **BLD-LAYER-WORKFLOW**

| Deliverable | SCR | SM |
|-------------|-----|-----|
| Start trip | SCR-019 | SM-TRIP |
| Active trip | SCR-016 | SM-TRIP |
| End trip | SCR-020 | SM-TRIP |
| Trip list + detail | SCR-017–018 | — |
| Edit / duplicate | SCR-021 | — |
| Offline trip queue | — | SM-SYNC |

**Exit criteria:** A complete trip can be recorded (including offline).

**MOB:** MOB-WF-START/END timing targets.

---

## Chapter 12 — Wave 4: Receipts

**WAVE-004**

| Deliverable | SCR | SM |
|-------------|-----|-----|
| Camera capture | SCR-031 | SM-RCP |
| Gallery upload | SCR-032 | SM-RCP |
| Storage + thumbnails | — | — |
| OCR pipeline (basic) | — | SM-OCR |
| OCR review UI | SCR-033 | SM-SCR-REVIEW |
| Attach to trip | SCR-034 | — |

**Exit criteria:** Users can capture and review receipts.

**Note:** OCR **runs** here; advanced AI features wait for Wave 8.

---

## Chapter 13 — Wave 5: Expenses

**WAVE-005**

| Deliverable | SCR |
|-------------|-----|
| Expense categories | Settings |
| Manual expenses | SCR-035+ |
| Receipt ↔ expense linkage | SCR-034 |
| Trip expense totals | SCR-018 |

**Exit criteria:** Trips and receipts become financial records.

---

## Chapter 14 — Wave 6: Reports

**WAVE-006**

| Deliverable | SCR | SM |
|-------------|-----|-----|
| Mileage log | SCR-040 | SM-RPT |
| Expense report | SCR-040 | SM-RPT |
| Combined report | SCR-041 | SM-RPT |
| PDF export | — | — |
| CSV / Excel | — | — |

**Exit criteria:** Users receive production-quality reports.

---

## Chapter 15 — Wave 7: Billing

**WAVE-007**

| Deliverable | API | SM |
|-------------|-----|-----|
| Plans + limits | API-SUB-*, API-LIM-* | SM-SUB |
| Stripe checkout | API-SUB-003 | — |
| Billing portal | API-SUB-004 | — |
| Webhook handler | API-SUB-005 | — |
| Usage counters | API-SUB-002 | — |

**Exit criteria:** Product can accept paying customers.

**Test mode only** until launch gate.

---

## Chapter 16 — Wave 8: AI

**WAVE-008** · **BLD-LAYER-AI**

| Deliverable | ENG |
|-------------|-----|
| Auto-categorization (suggest) | ENG-CAT |
| Trip / missing receipt suggestions | ENG-REM, ENG-TRIP |
| Duplicate detection | ENG-DUP |
| Merchant intelligence | ENG-MERCH |
| Personal memory | ENG-MEM |
| Golden set regression | Volume 16 |

**Exit criteria:** AI saves measurable user effort (correction rate baseline).

---

## Chapter 17 — Wave 9: AdminOS

**WAVE-009**

| Deliverable | ADM | SCR |
|-------------|-----|-----|
| Admin dashboard | ADM-DASH | SCR-053 |
| User lookup | ADM-CUST | SCR-054 |
| System health | ADM-INFRA | SCR-055 |
| AI health | ADM-AI | — |
| Billing admin | ADM-BILL | — |
| Audit explorer | ADM-AUDIT | — |

**Exit criteria:** Company can operate the product (Volume 17 checklist).

---

## Chapter 18 — Wave 10: Launch Hardening

**WAVE-010**

| Deliverable | Volume |
|-------------|--------|
| Security review | 8, 9 |
| Performance optimization | 18, 19 OPS-PERF |
| Accessibility verification | 18 Ch. 22 |
| DR validation | 19 Ch. 17 |
| Documentation audit | All INDEX files |
| Device matrix sign-off | DEVICE-MATRIX |
| Production readiness | 19 Ch. 34, 9 launch gates |

**Exit criteria:** Ready for public launch (Phase H).

---

# Part V — AI Build Protocol

## Chapter 19 — AI Responsibilities

### AI should

| Action | Output |
|--------|--------|
| Generate code | Per SCR/API/SM spec |
| Generate tests | Calculation, webhook, SM transitions |
| Update documentation | STEP doc, INDEX status |
| Explain decisions | ADR when architectural |
| Suggest improvements | PR comments — not scope creep |

### AI should not

| Forbidden | Why |
|-----------|-----|
| Invent undocumented requirements | Volume 20 admission criteria |
| Skip validation | Golden rules Ch. 3 |
| Bypass security reviews | Volume 8 |
| Merge unfinished work | Deployable `main` |
| Change stack (Prisma, etc.) | Volume 6 locked |
| Auto-accept financial data | Volume 16 Constitution |

Volume 6 Ch. 31 + this chapter = **AI Build Constitution**.

---

## Chapter 20 — AI Handoff Protocol

**BLD-AI-HANDOFF-001** — every AI task uses [`AI-HANDOFF-TEMPLATE.md`](../construction/AI-HANDOFF-TEMPLATE.md):

| Field | Purpose |
|-------|---------|
| Objective | One sentence outcome |
| STEP-ID | Traceability |
| Inputs | SCR/API/SM/FR IDs |
| Allowed files | Scope boundary |
| Restricted files | No-touch list |
| Dependencies | Prior waves complete |
| Exit criteria | Testable |
| Validation commands | `pnpm lint`, `test`, `build` |
| Rollback | Revert plan |

Keeps parallel workstreams coordinated.

---

# Part VI — Quality Gates

## Chapter 21 — Mandatory Gates (Merge)

**BLD-GATE-MERGE** — no exceptions:

| Gate | Command / check |
|------|-----------------|
| Build success | `pnpm build` |
| Type checking | `pnpm typecheck` |
| Linting | `pnpm lint` |
| Unit tests | `pnpm test` |
| Integration tests | `pnpm test:integration` |
| Security checks | `npm audit`, secret scan |
| Documentation | STEP doc + INDEX updates |

Volume 9 Ch. 28 PR gates.

---

## Chapter 22 — Release Gates (Production)

**BLD-GATE-RELEASE**

| Gate | Evidence |
|------|----------|
| Staging approval | Smoke checklist signed |
| Performance review | OPS-PERF baselines |
| Monitoring verification | Sentry, health checks live |
| Rollback validation | OPS-RB-004 tested |
| Backup verification | Restore drill log |

Volume 19 Ch. 7 pipeline.

---

# Part VII — Parallel Development

## Chapter 23 — Workstream Rules

Independent teams may parallelize **only** when dependencies permit.

| Phase | Parallel streams | Merge when |
|-------|------------------|------------|
| Foundation | A: Auth · B: Design system · C: DB migrations | All three + envelope types |
| Post-foundation | Trips ‖ Receipts prep (storage only) | **Not** trips ‖ receipts UI until trips done |
| Reports | After trips + expenses | — |
| Billing | After core entities | Can parallel late reports |
| AI Wave 8 | After Wave 4–6 | Never before workflows |
| AdminOS | After APIs stable | Wave 9 |

**Never simultaneously:** schema migration + production deploy; two waves touching same SM without coordination.

---

## Chapter 24 — Branch Strategy

| Branch type | Pattern | Lifetime |
|-------------|---------|----------|
| Feature | `feat/STEP-NNN-short-name` | < 3 days |
| Bugfix | `fix/STEP-NNN-issue` | < 1 day |
| Hotfix | `hotfix/description` | Hours |
| Release | `release/vX.Y.Z` | Release week |
| Documentation | `docs/STEP-NNN` | < 1 day |
| Experiment | `exp/flag-name` | Flag retirement |

Prefer `step/NNN-*` per BUILD-TRACEABILITY. Keep branches short; rebase on `main` daily.

---

# Part VIII — Testing Roadmap

## Chapter 25 — Testing Order

Build confidence in layers:

1. **Unit tests** — calculations, validators, pure SM logic
2. **Component tests** — forms, widgets (Volume 10)
3. **Integration tests** — API + DB + RLS
4. **E2E tests** — critical paths (auth, trip, receipt, report)
5. **Mobile validation** — DEVICE-MATRIX subset
6. **Accessibility review** — axe + manual VoiceOver/TalkBack
7. **Performance testing** — Lighthouse CI, OPS-PERF
8. **Security testing** — RLS penetration, auth boundaries

Do not skip layers to rush E2E.

---

## Chapter 26 — User Acceptance

Before public launch, representative users complete:

| Scenario | SCR / MOB |
|----------|-----------|
| First trip | MOB-WF-START |
| Receipt capture | MOB-WF-CAPTURE |
| Expense review | SCR-033 |
| Report generation | SCR-040–041 |
| Upgrade flow | SCR-009, billing |

Log findings in `docs/construction/uat-log.md`.

---

# Part IX — Launch Strategy

## Chapter 27 — Internal Alpha

| | |
|---|---|
| **Users** | Founder + dev team |
| **Objectives** | Stability, core workflows, logging |
| **Waves required** | 1–6 minimum |
| **Duration** | 2–4 weeks |

---

## Chapter 28 — Private Beta

| | |
|---|---|
| **Users** | 5–20 trusted businesses |
| **Objectives** | Usability, report accuracy, support readiness |
| **Waves required** | 1–8 |
| **Support** | Volume 17 SOPs draft |

---

## Chapter 29 — Public Beta

| | |
|---|---|
| **Objectives** | Scale, performance, onboarding, billing |
| **Waves required** | 1–9 |
| **Rule** | Feature development **slows**; ops issues priority |

---

## Chapter 30 — General Availability

| Requirement | Source |
|-------------|--------|
| Stable infrastructure | Volume 19 SLOs |
| Reliable support | Volume 17 |
| Healthy analytics | Volume 14 |
| Strong documentation | All INDEX files current |
| Predictable deployments | OPS-DEPLOY-001 |

Launch is a beginning, not the finish line (Volume 20 Ch. 33).

---

# Part X — Build Governance

## Chapter 31 — Weekly Build Review

**BLD-RITUAL-WEEKLY** (~30 min):

| Review | Action |
|--------|--------|
| Completed work | Update BUILD-LOG, INDEX statuses |
| Open risks | Tech debt, blockers |
| Test results | Coverage trend |
| Technical debt | TD-* review |
| Roadmap alignment | ROAD-VER-1.0 scope guard |

---

## Chapter 32 — Monthly Architecture Review

Align Volume 20 Ch. 25 + Volume 19:

* Performance · Scalability · Security · Maintainability · AI quality

Output: `docs/architecture/reviews/YYYY-MM.md`

---

# Part XI — Success Metrics

## Chapter 33 — Build Metrics

Track engineering health (not vanity velocity):

| Metric | Target guidance |
|--------|-----------------|
| Waves completed | On schedule |
| Test coverage | ↑ on critical paths |
| Documentation completeness | INDEX rows match code |
| Build success rate | > 95% |
| Deployment frequency | Weekly+ post-launch |
| Bug escape rate | ↓ per wave |
| Mean time to fix P1 | < 4 hours |

Dashboard in BUILD-LOG + optional ADM-EXEC widget.

---

## Chapter 34 — Construction Non-Negotiables

| # | Rule |
|---|------|
| 1 | Never skip testing |
| 2 | Never merge undocumented features |
| 3 | Never postpone security indefinitely |
| 4 | Never treat documentation as optional |
| 5 | Never build AI before underlying workflow exists |
| 6 | Never sacrifice maintainability for short-term speed |
| 7 | Never ship features operators cannot support |
| 8 | Never break deployable `main` |
| 9 | Never implement without SCR/API ID |
| 10 | Never waive gates without ADR + founder approval |

---

# Part XII — The Construction Standard

## Chapter 35 — The Final Principle

The entire 21-volume blueprint exists to **eliminate uncertainty**.

Every feature should be:

| Stage | Artifact |
|-------|----------|
| Specified | Volume 3/11/12 + IDs |
| Built | After dependencies (Ch. 5–8) |
| Verified | BLD-DOD-001 |
| Measured | EVT-IDs post-launch |
| Improved | Volume 20 feedback pipeline |

> **A new engineer—or a new AI build agent—should join, read the blueprint, and produce production-quality work without rediscovering how the system functions.**

---

# Appendix A — Master Implementation Sequence

| # | Sequence step | WAVE | BLD-LAYER |
|---|---------------|------|-----------|
| 1 | Foundation | WAVE-001 | FOUNDATION |
| 2 | Authentication | WAVE-001 | FOUNDATION |
| 3 | Database | WAVE-001 | FOUNDATION |
| 4 | Design System | WAVE-001 | FOUNDATION |
| 5 | API Layer | WAVE-001 | FOUNDATION |
| 6 | Core Business Objects | WAVE-002 | CORE |
| 7 | Trips | WAVE-003 | WORKFLOW |
| 8 | Receipts | WAVE-004 | WORKFLOW |
| 9 | Expenses | WAVE-005 | WORKFLOW |
| 10 | Reports | WAVE-006 | WORKFLOW |
| 11 | Billing | WAVE-007 | — |
| 12 | Notifications | WAVE-007–008 | MSG-* |
| 13 | Analytics | Parallel WAVE-003+ | EVT-* |
| 14 | AI (advanced) | WAVE-008 | AI |
| 15 | AdminOS | WAVE-009 | — |
| 16 | Security Hardening | WAVE-010 | — |
| 17 | Performance Optimization | WAVE-010 | — |
| 18 | Beta Testing | Alpha → Public β | — |
| 19 | Launch | GA | Phase H |
| 20 | Continuous Improvement | ROAD-VER-1.1+ | Volume 20 |

---

## Blueprint + Constitution Complete

| Document | Role |
|----------|------|
| Volumes 0–20 | **What** to build and operate |
| **Volume 21** (this) | **How** to build |
| [Master Build Index](../MASTER-BUILD-INDEX.md) | **Control tower** — status, traceability, registries |

**Begin implementation:** Sign off → **STEP-027** WAVE-001.

---

*Previous: [Volume 20 — Product Evolution](20-product-evolution-roadmap.md) | Next: [Volume 22 — Platform](22-platform-architecture.md) | [Master Build Index](../MASTER-BUILD-INDEX.md) | [Blueprint Index](README.md)*
