# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 9 — Quality Assurance, Testing, Validation & Release Engineering

**Version 1.0**

---

## Who This Document Is For

Volume 9 is the **final gate before Version 1 ships**. Most teams stop at feature completion; production software requires proving that every feature works correctly, consistently, and under real-world conditions.

| Role | Use this volume to… |
|------|---------------------|
| **Engineers** | Write tests, CI gates, release automation |
| **QA** | Test matrices, exploratory sessions, sign-off |
| **Product** | Definition of Done, exit criteria, beta program |
| **Design** | UX validation, accessibility gates |
| **Operations** | Observability, DR validation, post-launch monitoring |
| **Leadership** | Launch certification (Ch. 31), scorecard (Ch. 30) |

**Related:** [Volume 3 — Functional Requirements](03-functional-requirements.md) · [Volume 6 — Technical Architecture](06-technical-architecture.md) · [Volume 8 — Security](08-security.md)

---

## Core Thesis

> **Working once is not enough. It must work every time.**

Volumes 0–8 define what the product is and how it protects users. Volume 9 defines **when it is ready to launch**.

---

# Chapter 1 — Purpose

Volume 9 establishes the quality standards that **every feature must meet before release**.

## Goals

| Goal | Why it matters |
|------|----------------|
| Prevent regressions | Financial apps cannot break silently |
| Ensure calculations are correct | Mileage and reimbursement errors erode trust |
| Verify reliability | Offline, sync, and billing must be dependable |
| Validate user experience | Speed and clarity are product features |
| Confirm production readiness | Ops, monitoring, backups verified |
| Protect customer trust | Aligns with Volume 8 Trust Promise |

**No feature is complete until it passes the quality standards defined here.**

Each Volume 3 functional requirement (FR) maps to at least one test in this volume.

---

# Chapter 2 — Quality Philosophy

> **Working once is not enough. It must work every time.**

Every release should be:

| Property | Meaning |
|----------|---------|
| **Predictable** | Same inputs → same outputs; no surprise deploys |
| **Repeatable** | Tests run in CI identically on every machine |
| **Testable** | Behavior verifiable by automation or structured manual QA |
| **Observable** | Failures visible in logs, metrics, and alerts before users report them |
| **Recoverable** | Backups, rollbacks, and DR procedures validated (Ch. 24) |

Quality is not a phase at the end of development — it is a **continuous constraint** from the first commit.

---

# Chapter 3 — Definition of Done

A feature is considered **complete** only when **all** criteria pass:

| # | Criterion | Owner |
|---|-----------|-------|
| 1 | Functional requirements implemented (Volume 3) | Engineering |
| 2 | UI matches approved designs (Volume 2) | Design + Engineering |
| 3 | Accessibility requirements met (Ch. 11) | Engineering + QA |
| 4 | Security review passes (Volume 8 Ch. 26) | Engineering |
| 5 | Automated tests pass (Ch. 4–21) | Engineering |
| 6 | Manual QA passes functional matrix (Ch. 5) | QA |
| 7 | Documentation updated (Ch. 26) | Engineering + Product |
| 8 | No critical or unresolved high-severity bugs (Ch. 19) | QA |
| 9 | Product owner accepts the feature | Product |

**Code alone is never considered "done."**

Pull requests that add user-facing behavior without corresponding tests are blocked unless explicitly exempted (copy-only, styling with no logic change).

---

# Chapter 4 — Testing Pyramid

Testing follows a pyramid — **many fast unit tests, fewer integration tests, selective E2E, plus human exploratory testing**.

```
        ┌─────────────┐
        │     E2E     │  Playwright — critical user journeys
        ├─────────────┤
        │ Integration │  Supabase, Edge Functions, Stripe webhooks
        ├─────────────┤
        │    Unit     │  Calculations, schemas, utils (Vitest)
        └─────────────┘
              +
        Exploratory manual QA
```

## Unit Tests

Verify individual functions in isolation. **Largest category of tests.**

| Domain | Examples |
|--------|----------|
| Mileage | `calculateMiles`, odometer validation, GPS fallback |
| Reimbursement | Rate resolution, IRS vs custom, rounding |
| Validation | Zod schemas, date bounds, currency precision |
| OCR helpers | Response parsing, field normalization |
| Formatting | Currency, dates, timezone boundaries |

**Location:** `packages/shared/**/*.test.ts`  
**Runner:** Vitest  
**Coverage targets (V1):**

| Package / area | Target |
|----------------|--------|
| `packages/shared/calculations` | 95%+ line coverage |
| `packages/shared/schemas` | 90%+ |
| UI components | Critical paths only — not 100% |

## Integration Tests

Verify interaction between components.

| Scenario | Assert |
|----------|--------|
| Database CRUD | Row created with correct `user_id`, RLS enforced |
| Authentication | Session valid; expired session rejected |
| Receipt upload | Storage object + `receipts` row linked |
| AI pipeline | Edge Function returns structured fields; errors handled |
| Report generation | PDF/CSV bytes valid; totals match DB |
| Stripe webhooks | Subscription state updated idempotently |
| Storage access | Signed URLs expire; private bucket enforced |

**Location:** `supabase/tests/` or `apps/web/tests/integration/`  
**Runner:** Vitest + Supabase local (or staging)

## End-to-End Tests

Simulate real user behavior in browser.

| ID | Flow |
|----|------|
| E2E-01 | Sign up → onboarding → dashboard |
| E2E-02 | Create business → add vehicle |
| E2E-03 | Start trip → add manual expense → end trip → summary |
| E2E-04 | Upload receipt (mock OCR) → confirm → expense on trip |
| E2E-05 | Generate mileage PDF → download succeeds |
| E2E-06 | Upgrade subscription (Stripe test mode) |
| E2E-07 | Free tier: 6th trip blocked with upgrade prompt |
| E2E-08 | Edit trip → audit log entry created |
| E2E-09 | Delete account → cannot login; data inaccessible |

**Runner:** Playwright  
**Browsers:** Install to `H:\Travel-Expense\.cache\playwright` via env var (Volume 6)  
**CI rule:** Mock OCR — never call OpenAI in CI (intercept Edge Function response)

Run E2E-01 through E2E-04 at mobile viewport **390×844** (iPhone 14).

## Manual Exploratory Testing

Humans intentionally probe for unexpected behavior.

| Technique | Examples |
|-----------|----------|
| Rapid interaction | Double-tap start trip, spam save |
| Network stress | Slow 3G, offline mid-upload, reconnect |
| Device | Rotation, background/foreground, low battery mode |
| Navigation | Back button during wizard, deep links |
| Session | Long-running session, token refresh edge |

Exploratory findings are logged with severity (Ch. 19) and reproduction steps.

---

# Chapter 5 — Functional Test Matrix

Every feature gets a checklist derived from Volume 3 acceptance criteria. **All checks must pass before the feature advances.**

## Example: Start Trip

| Check | Verified |
|-------|----------|
| Vehicle selected (or default applied) | ☐ |
| Purpose saved (required field) | ☐ |
| Odometer validated (if entered) | ☐ |
| Active trip created in DB | ☐ |
| Dashboard updated (active indicator) | ☐ |
| Audit log / business event written | ☐ |
| Offline behavior: queued locally | ☐ |
| Sync after reconnect: single server record | ☐ |

## Matrix Coverage (V1)

| Feature area | Matrix ID | Volume 3 ref |
|--------------|-----------|--------------|
| Auth & onboarding | QA-AUTH | FR-001–010 |
| Businesses & vehicles | QA-ENT | FR-011–020 |
| Start / active / end trip | QA-TRIP | FR-021–035 |
| Expenses (manual) | QA-EXP | FR-036–045 |
| Receipt capture & OCR | QA-RCP | FR-046–060 |
| Reports & export | QA-RPT | FR-061–075 |
| Dashboard & search | QA-DSH | FR-076–085 |
| Settings & preferences | QA-SET | FR-086–095 |
| Billing & tiers | QA-BIL | FR-096–105 |
| Offline & sync | QA-SYN | FR-106–110 |
| Account export / deletion | QA-DEL | FR-111–115 |

Full matrices live in `docs/qa/test-matrices/` (create during Phase G).

---

# Chapter 6 — Mileage Calculation Testing

Financial accuracy is non-negotiable. All cases have **known expected outputs**.

| Case | start_odo | end_odo | rate | Expected |
|------|-----------|---------|------|----------|
| Standard | 10000.0 | 10045.5 | 0.70 | 45.5 mi · $31.85 |
| Zero-mile trip | 5000 | 5000 | 0.70 | 0 mi · $0.00 |
| Long distance | 100000 | 103500.5 | 0.70 | 3500.5 mi |
| Decimal precision | 10000.1 | 10000.9 | 0.70 | 0.8 mi |
| Large odometer | 999990 | 1000045 | 0.70 | 55 mi |
| Invalid order | 100 | 50 | — | Error; no save |
| Custom rate | 10000 | 10050 | 0.55 | 50 mi · $27.50 |
| Historical rate | trip in 2024 | — | 2024 IRS rate | Rate at trip date |
| Rate change mid-trip | rate updated after start | — | — | Rate locked at trip end or per FR rule |

**GPS fallback:** Mock haversine with known coordinate pairs; verify distance when odometer omitted.

**Regression:** Any change to `packages/shared/calculations` requires full mileage test suite green before merge.

---

# Chapter 7 — Receipt Testing

Receipt images vary widely. Test capture, upload, OCR, and correction flows.

## Upload Sources

| Source | Test |
|--------|------|
| Camera (mobile PWA) | Capture → preview → confirm |
| Gallery | JPEG, PNG, HEIC (if supported) |
| PDF | Multi-page PDF; first page used |

## Image Conditions

| Condition | Purpose |
|-----------|---------|
| Small receipt | Minimum readable size |
| Large receipt | Size limit enforcement |
| Wrinkled / folded | OCR resilience |
| Dark / low contrast | Exposure handling |
| Blurry | Confidence score low → user corrects |
| Foreign currency | Symbol detection; user confirms |
| Duplicate | Same merchant + amount + date flagged |

## OCR Accuracy Program

Separate from CI — manual + semi-automated golden set.

| Dataset | Size | Purpose |
|---------|------|---------|
| Golden receipts | 50 images | Regression on total, merchant, date |
| Edge cases | 20 images | Faded, crumpled, handwritten, non-US |

**Metrics per run:**

| Metric | Target (V1 beta) |
|--------|------------------|
| Total amount extraction | ≥ 90% within $0.01 |
| Date extraction | ≥ 85% correct day |
| Merchant name | ≥ 80% usable without edit |
| Category suggestion acceptance | ≥ 70% accepted or edited once |

Run golden set before each prompt version bump (Volume 5).

---

# Chapter 8 — AI Validation

AI assists; **users confirm**. AI must never silently alter financial records (Volume 8 Ch. 33).

| Dimension | How measured |
|-----------|--------------|
| Merchant recognition | Golden set + user correction rate |
| Category suggestion | Acceptance vs override rate |
| Duplicate detection | True/false positive rate on labeled set |
| Reminder quality | End-trip checklist relevance (qualitative beta) |
| Confidence scoring | Low confidence → UI prompts review |
| Processing time | P95 < 5s staging (Ch. 12) |

**Safety tests:**

- OCR returns malformed JSON → graceful error, manual entry available
- AI suggests amount different from image → user must confirm
- AI offline → capture still works; OCR queued

---

# Chapter 9 — Report Validation

Every report type verified for accuracy and format.

## Report Types (V1)

| Report | Formats |
|--------|---------|
| Mileage log (IRS-style) | PDF, CSV |
| Expense report | PDF, CSV, Excel |
| Combined travel report | PDF, CSV, Excel |

## Validation Checklist (per report)

| Check | Method |
|-------|--------|
| Correct totals | Compare to DB aggregate queries |
| Correct mileage | Match trip records |
| Date range filter | Boundary dates inclusive/exclusive per FR |
| Currency formatting | 2 decimal places; symbol per settings |
| PDF layout | Readable on print; page breaks sane |
| CSV structure | Headers, escaping, row count |
| Excel compatibility | Opens in Excel + Google Sheets without error |

**PDF test:** Valid magic bytes; snapshot **text content** (not binary snapshot).  
**Cross-device:** Generate and review on desktop (1920×1080) and mobile (390×844).

---

# Chapter 10 — User Experience Testing

Evaluate whether the product delivers on Volume 0 speed targets and Volume 2 journey design.

## Metrics

| Metric | Target (Volume 0) | Measurement |
|--------|-------------------|-------------|
| Onboarding completion | ≥ 80% beta users | Analytics funnel |
| Time to first trip | < 5 min from signup | Timed E2E + beta |
| Time to upload receipt | < 10 sec (excl. OCR) | E2E timer |
| Time to generate report | < 30 sec | Integration timer |
| Taps to start trip | ≤ 3 from dashboard | UX audit |
| Error comprehension | User can recover without support | Beta observation |

## Success Statement

> A new user should complete their first trip **without assistance**.

Beta program (Ch. 22) validates this with real users from target personas (realtors, contractors, field sales).

---

# Chapter 11 — Accessibility Testing

**Target:** WCAG 2.1 Level AA (Volume 2 Ch. 15).

| Check | Tool / method |
|-------|---------------|
| Automated scan | axe-core in Playwright on all V1 screens |
| Screen reader | VoiceOver (iOS) + NVDA (Windows) spot checks |
| Keyboard navigation | Tab order, focus trap in modals, escape to close |
| High contrast | System high-contrast mode |
| Dynamic text sizes | 200% zoom without horizontal scroll |
| Focus indicators | Visible on all interactive elements |
| Color-independent messaging | Errors not color-only (icon + text) |
| Touch targets | ≥ 44×44 px on mobile |

**Gate:** axe-core **zero critical violations** on V1 screens before release. Document known minor exceptions with remediation plan.

Validate on **real devices**, not emulators alone.

---

# Chapter 12 — Performance Testing

Define thresholds; measure in CI (where possible) and staging.

| Scenario | Target | Tool |
|----------|--------|------|
| App launch (PWA) | LCP < 2.5s | Lighthouse CI |
| Dashboard load | LCP < 2.5s | Lighthouse CI |
| Trip list (100 trips) | Render < 1s | Playwright trace |
| Receipt upload (5 MB) | Complete < 10s on 4G | Staging manual |
| OCR processing | P95 < 5s | Staging monitor |
| Report gen (100 trips) | < 10s | Integration timer |
| Search response | < 500ms P95 | Staging monitor |
| Offline sync (10 queued ops) | < 5s on reconnect | E2E timer |

**Optional pre-launch load test:** k6 — 50 concurrent report requests; no error rate > 1%.

Performance regressions block release if they exceed threshold by > 20%.

---

# Chapter 13 — Offline Testing

Offline-first behavior is a V1 requirement (Volume 3 FR-106+).

| Scenario | Expected |
|----------|----------|
| Start trip offline | Saved to IndexedDB; syncs on reconnect |
| End trip offline | Miles computed locally; sync merges |
| Capture receipt offline | Image queued; OCR runs when online |
| Edit trip offline | Last-write-wins or conflict UI per FR |
| Queue synchronization | All queued ops applied; no duplicates |
| Conflict resolution | User notified if server state diverged |
| Offline banner | Visible when network unavailable |

**Playwright:** `context.setOffline(true)` for automated cases.  
**Principle:** User must **never lose captured information** due to temporary connectivity loss.

**Idempotency test:** Same offline action synced twice → one server record.

---

# Chapter 14 — Cross-Platform Testing

## Desktop Browsers (last 2 major versions)

| Browser | OS |
|---------|-----|
| Chrome | Windows, macOS |
| Edge | Windows |
| Firefox | Windows, macOS |
| Safari | macOS |

## Mobile

| Platform | Browsers |
|----------|----------|
| iPhone | Safari 16+, Chrome |
| Android | Chrome, Samsung Internet |

## Tablet

| Device | Verify |
|--------|--------|
| iPad | Responsive layout; touch targets |
| Android tablet | Same |

## PWA

- Install flow on iOS Safari + Android Chrome
- Standalone mode navigation
- App icon and splash

Responsive layouts must remain usable from **320px** to **1920px** width.

---

# Chapter 15 — Security Testing

Complements Volume 8 Ch. 26. Security tests are **release blockers**.

| Test | Method |
|------|--------|
| Authentication | Invalid credentials rejected; lockout after N attempts |
| Authorization / RLS | User B cannot read User A trips (integration) |
| Session expiration | Expired token → re-auth required |
| IDOR | Direct URL to another user's trip → 404 |
| File upload validation | Reject executable, oversize, wrong MIME |
| Rate limiting | Login, OCR, API endpoints throttled |
| API access controls | Unauthenticated Edge Function → 401 |
| Input validation | XSS in purpose field escaped in render |
| Audit logging | Financial actions create audit entries |

**Misuse scenarios:** Attempt API calls with forged IDs, replay webhooks, upload `.exe` renamed to `.jpg`.

**Annual (post-V1):** OWASP ZAP scan on staging.

---

# Chapter 16 — Billing Testing

Stripe test mode only in non-production environments.

| Scenario | Assert |
|----------|--------|
| Free signup | Default tier; limits enforced |
| Upgrade to Pro | Checkout completes; features unlock |
| Downgrade | Limits apply; **data not deleted** |
| Cancellation | Access until period end |
| Failed payment | Grace period; user notified |
| Payment recovery | Retry succeeds; access restored |
| Usage limits | 6th trip blocked on Free |
| Annual billing | Correct period and price |
| Team upgrade (V1.1) | Seat limits enforced |

**Data integrity rule:** Billing changes must **never corrupt or delete** user trips, receipts, or reports.

Webhook idempotency: duplicate Stripe events → single subscription update.

---

# Chapter 17 — Data Integrity Testing

Financial history must remain consistent over time.

| Check | Method |
|-------|--------|
| No orphaned records | FK constraints + integration cleanup tests |
| Correct foreign keys | Trip → business, expense → trip, receipt → expense |
| Soft delete behavior | Deleted trips hidden but recoverable per policy |
| Backup restoration | Restore staging DB; row counts match |
| Export accuracy | Export bundle matches DB query totals |
| Historical mileage | Rate change does not retroactively alter closed trips |
| Audit trail | Delete/edit leaves append-only audit entries |

Run after every migration in staging before production apply.

---

# Chapter 18 — Regression Testing

Every release reruns the **core regression suite**:

| Area | Scope |
|------|-------|
| Authentication | Login, logout, password reset |
| Trips | Start, active, end, edit, delete |
| Receipts | Upload, OCR mock, attach |
| OCR | Golden set (if prompt changed) |
| Reports | PDF, CSV, Excel generation |
| Billing | Checkout, limits, webhooks |
| Search | Find trip, find receipt |
| Notifications | End-trip reminders (if enabled) |
| Export | GDPR bundle download |
| Offline sync | Queue + reconnect |

**Previously working features must continue working.**

Before each release tag:

1. Full E2E suite green
2. OCR golden set (if AI prompt changed)
3. Manual smoke on Netlify preview (mobile + desktop)
4. Stripe test mode checkout flow

---

# Chapter 19 — Bug Classification

All bugs receive severity, owner, and target fix window.

| Severity | Definition | Release rule |
|----------|------------|----------------|
| **Critical** | Application unusable; data loss; security breach | **Block release.** Immediate fix |
| **High** | Major workflow broken; no reasonable workaround | **Block release** until fixed or explicitly waived by Product + Engineering |
| **Medium** | Feature works with workaround | Evaluate before release; document known issue |
| **Low** | Cosmetic or minor usability | Schedule post-release |

Bug reports include: steps to reproduce, environment, screenshots, expected vs actual, severity, FR reference.

Track in issue tracker with `qa/` label.

---

# Chapter 20 — Release Readiness Gates

**Version 1 cannot ship** unless all gates pass:

| Gate | Verification |
|------|--------------|
| No critical bugs | Issue tracker clean |
| No unresolved security issues | Volume 8 Ch. 32 checklist |
| Automated tests passing | CI green on release branch |
| Manual QA completed | All Ch. 5 matrices signed |
| Billing verified | Ch. 16 complete in staging |
| Reports verified | Ch. 9 complete |
| Backups verified | Ch. 24 DR test within 30 days |
| Monitoring enabled | Ch. 23 dashboards + alerts live |
| Documentation complete | Ch. 26 + privacy docs published |

Shipping is based on **readiness**, not calendar dates.

---

# Chapter 21 — CI/CD Quality Gates

Every merge to `main` requires:

```yaml
# PR merge gates (GitHub Actions)
- lint (ESLint)
- typecheck (tsc --noEmit)
- unit tests (Vitest)
- integration tests (Supabase local if available)
- build verification (Next.js production build)
- dependency audit (npm audit / Dependabot review)
```

| Branch event | E2E scope |
|--------------|-----------|
| Pull request | Smoke subset (E2E-01, E2E-03) |
| Merge to main | Full E2E suite |
| Pre-production deploy | Full suite + manual smoke on preview |
| Production deploy | Smoke on production post-deploy |

**Production deployments** require:

- [ ] Migration applied to staging and verified
- [ ] E2E green on staging
- [ ] No critical Dependabot alerts
- [ ] Changelog updated
- [ ] Rollback plan documented (Netlify instant rollback; forward-only DB migrations)

---

# Chapter 22 — Beta Testing Program

Structured phases before general availability.

| Stage | Audience | Duration | Goal |
|-------|----------|----------|------|
| **Internal** | Development team | Ongoing | Catch obvious breaks |
| **Alpha** | 5–10 trusted users | 1 week | Core flows on real devices |
| **Closed Beta** | 25–50 customers | 2 weeks | Persona validation |
| **Open Beta** | Public with support | Optional | Scale feedback |

## Collect

- Bugs (with severity)
- Feature requests (backlog, not blockers)
- UX confusion points
- Performance feedback on real networks
- OCR accuracy on real receipts

## Success Criteria (Closed Beta)

- ≥ 8/10 users complete trip + receipt without assistance
- Zero critical bugs open
- Net Promoter or satisfaction survey ≥ target (Volume 7)

Findings tracked in structured backlog with links to FR IDs.

---

# Chapter 23 — Observability

Monitor production to surface trends **before users report problems**.

| Signal | Alert threshold (initial) |
|--------|---------------------------|
| Error rate (5xx) | > 1% over 5 min |
| API latency P95 | > 2s sustained |
| OCR failures | > 10% over 1 hour |
| Report generation failures | Any sustained > 5% |
| Login failures | Spike > 3× baseline |
| Sync failures | > 5% of sync attempts |
| Billing webhook failures | Any failure → page on-call |

**Dashboards:** Error rate, latency, OCR success, active trips, signups, upgrades.

Tools: Supabase logs, Netlify analytics, Sentry (or equivalent), Stripe dashboard.

Post-deploy: monitor Sentry for **30 minutes** minimum after production release.

---

# Chapter 24 — Disaster Recovery Validation

Recovery procedures are **practiced**, not assumed.

| Test | Frequency | Pass criteria |
|------|-----------|---------------|
| Database restore | Quarterly | Row counts match; app connects |
| File / receipt restore | Quarterly | Sample images accessible |
| Report regeneration | After major report change | Totals match pre-incident |
| Backup integrity | Monthly | Backup checksum valid |
| Failover procedures | Annually | Documented RTO/RPO met (Volume 8 Ch. 18) |

Document results in `docs/runbooks/disaster-recovery.md` (create Phase H).

Failed DR test **blocks production release** until remediated.

---

# Chapter 25 — Customer Acceptance Testing

Select real users representing target audiences (Volume 1 personas).

## Tasks (unscripted observation)

1. Sign up and complete onboarding
2. Log a week of trips
3. Capture and categorize receipts
4. Generate a monthly report
5. Upgrade to Pro (test mode or comped account)

## Observe

- Where users hesitate
- Where they ask for help
- Where they mistrust AI suggestions
- Where they abandon flows

Findings feed UX refinements (Volume 2) and backlog prioritization — not silent scope creep.

---

# Chapter 26 — Documentation Validation

Documentation is a **quality artifact**. Outdated docs are treated as defects.

| Document | Validated when |
|----------|----------------|
| User help / FAQ | Feature ships |
| Privacy Policy, ToS | Matches Volume 7 + 8 behavior |
| AI Usage Notice | Matches Volume 5 processing |
| CHANGELOG | Every user-facing release |
| API / internal runbooks | Infra or deploy change |
| Blueprint cross-links | Blueprint amendment |

Review checklist: current, accurate, consistent, reviewed after feature changes.

---

# Chapter 27 — Version 1 Exit Criteria

Version 1 is ready **only when all are true**:

| Criterion | Evidence |
|-----------|----------|
| Core workflows stable | Ch. 18 regression green |
| Quality metrics meet targets | Ch. 6–12 metrics hit |
| Customer testing positive | Ch. 22 beta success criteria |
| Support materials complete | Help docs, contact, status page |
| Security checks pass | Volume 8 Ch. 32 |
| Business operations prepared | Volume 7 launch checklist |
| Launch certification signed | Ch. 31 all disciplines ☐ → ☑ |

**Shipping based on readiness, not deadlines.**

---

# Chapter 28 — Post-Launch Monitoring

**First 30 days** after public release — daily review:

| Metric | Action if abnormal |
|--------|-------------------|
| Signups | Investigate funnel breaks |
| Upgrades | Verify billing flow |
| Errors / crashes | Triage by severity |
| OCR accuracy | Prompt or UX adjustment |
| Support requests | Pattern → bug or doc fix |
| Billing issues | Stripe + webhook investigation |

Respond quickly while **preserving stability** — prefer hotfix over rushed features.

Weekly post-launch summary shared with Product + Engineering.

---

# Chapter 29 — Continuous Improvement

Quality does not end at launch.

| Activity | Cadence |
|----------|---------|
| Review customer feedback | Weekly |
| Measure feature usage | Monthly |
| Prioritize improvements by evidence | Sprint planning |
| Retire low-value complexity | Quarterly review |
| Update golden receipt set | When OCR prompt changes |
| Dependency updates | Monthly security patch review |

Volume 6 tech debt policy applies — quality debt is tracked like feature debt.

---

# Chapter 30 — Product Excellence Scorecard

Track release quality across categories with **measurable targets** so releases compare objectively over time.

| Category | V1 target | Measurement |
|----------|-----------|-------------|
| Functionality | 100% V1 FR matrices pass | QA sign-off |
| Reliability | < 0.1% error rate week 1 | Observability |
| Performance | All Ch. 12 thresholds met | Lighthouse + staging |
| Security | Volume 8 checklist complete | Security sign-off |
| Accessibility | Zero critical axe violations | Automated + manual |
| User Experience | 80% first-trip unassisted | Beta metric |
| AI Accuracy | Golden set thresholds (Ch. 7) | OCR suite |
| Billing | Zero data corruption incidents | Integration tests |
| Documentation | All Ch. 26 items current | Doc review |
| Support Readiness | < 24h first response | Volume 7 SLA |

Scorecard completed for each release candidate; stored with release tag notes.

---

# Chapter 31 — Version 1 Launch Certification

Before public launch, **every discipline signs off**:

| Discipline | Sign-off criteria | Approved |
|------------|-------------------|----------|
| **Product** | V1 scope complete per Volume 3 | ☐ |
| **Engineering** | Code stable; CI green; migrations applied | ☐ |
| **Design** | UX approved; accessibility gate passed | ☐ |
| **AI** | Suggestion quality verified; golden set passed | ☐ |
| **Security** | Volume 8 Ch. 32 checklist complete | ☐ |
| **QA** | All test matrices + regression passed | ☐ |
| **Operations** | Monitoring, backups, runbooks active | ☐ |
| **Business** | Billing, legal docs, support ready | ☐ |
| **Support** | Help documentation published | ☐ |

**Only after all sign-offs are complete** is Version 1 launch-ready.

Certification record: date, version tag, signatory names → `docs/releases/v1.0.0-certification.md` (create at launch).

---

# Chapter 32 — Quality Non-Negotiables

These principles **cannot be compromised**:

| # | Rule |
|---|------|
| 1 | Never ship known critical defects |
| 2 | Never compromise financial accuracy for speed |
| 3 | Never skip security validation (Volume 8) |
| 4 | Never release without backup verification |
| 5 | Never ignore customer-reported data integrity issues |
| 6 | Never bypass testing to meet an arbitrary deadline |
| 7 | Never claim reliability that has not been demonstrated |
| 8 | Never deploy without rollback plan |
| 9 | Never call OpenAI in CI E2E tests |
| 10 | Never let AI silently overwrite user financial data |

Violations require explicit Product + Engineering waiver documented in release notes.

---

# Chapter 33 — The Final Product Standard

The defining question before every release:

> **"If this were the only business tool someone relied on to document an entire year's worth of travel and expenses, would we trust it with our own records?"**

If the answer is not an unqualified **yes**, the product is **not ready to ship**.

This benchmark applies to **every version** that follows — growth never comes at the expense of reliability or customer trust.

---

## Release Checklist (Operational)

### Version bump

- [ ] CHANGELOG updated
- [ ] Migration applied to staging
- [ ] E2E green on staging
- [ ] No critical Dependabot alerts
- [ ] Scorecard (Ch. 30) completed

### Production deploy

- [ ] Migration applied to production
- [ ] Edge Functions deployed
- [ ] Netlify env vars verified
- [ ] Smoke test production (login, trip, scan mock, report)
- [ ] Monitor errors for 30 min post-deploy (Ch. 28)
- [ ] Launch certification signed (Ch. 31)

### Rollback plan

- **Netlify:** instant rollback to previous deploy
- **Database:** forward-only migrations — write reverse migration if risky
- **Edge Functions:** redeploy previous version tag

---

## Document Map

| Need | Go to |
|------|-------|
| Functional requirements | [Volume 3](03-functional-requirements.md) |
| UX screens & journeys | [Volume 2](02-user-experience.md) |
| Security test matrix | [Volume 8 Ch. 26](08-security.md) |
| CI / deploy pipeline | [Volume 6](06-technical-architecture.md) |
| Beta & launch GTM | [Volume 7](07-business-operations.md) |
| OCR & AI behavior | [Volume 5](05-ai-design.md) |
| Test matrices (implementation) | `docs/qa/test-matrices/` (Phase G) |
| DR runbook | `docs/runbooks/disaster-recovery.md` (Phase H) |

---

## Blueprint Complete

Volumes 0–10 form the **Master Build Blueprint v1.0**. With Volume 10 signed off, the project may proceed to **Phase A: Repo scaffold** ([Blueprint Index](README.md)).

---

*Previous: [Volume 8 — Security, Privacy & Trust Architecture](08-security.md) | Next: [Volume 10 — Universal Design System](10-design-system.md)*
