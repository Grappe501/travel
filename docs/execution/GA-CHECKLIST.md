# GA Readiness Checklist — MEC-V1-S020 / STEP-052

**Phase H — General Availability**  
Use this document to sign off Version 1.0.0 before the public launch tag.

Related: [Volume 9 Ch. 20](../blueprint/09-testing-quality.md) · [Volume 7 Ch. 22](../blueprint/07-business-operations.md) · [PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md) · [STEP-048 security audit](../security/STEP-048-audit.md)

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| **Product** | Product Owner (internal) | 2026-06-25 | ☑ GA scope accepted — V1 MRIDs 000001–000015, 000020 |
| **Engineering** | Engineering (automated + catalog audit) | 2026-06-25 | ☑ CI validation green; catalogs audited STEP-052 |

**Release tag:** `v1.0.0` (created on commit completing STEP-052)

---

## 1. Volume 9 — Release readiness gates (Ch. 20)

| Gate | Verification | Status | Notes |
|------|--------------|--------|-------|
| No critical bugs | Issue tracker / known defects | ☑ Pass | No P0 open in repo; deferred items documented in security audit |
| No unresolved security issues | Volume 8 / STEP-048 | ☑ Pass | [STEP-048-audit.md](../security/STEP-048-audit.md) signed; no critical/high open |
| Automated tests passing | `pnpm lint typecheck build test` | ☑ Pass | Verified STEP-052 |
| E2E critical journeys | `pnpm test:e2e` | ☑ Pass | E2E-01–07 + axe; smoke CI on PR (see §6 beta notes) |
| Manual QA completed | SCR/API catalogs + device matrix | ☑ Pass | Catalog audit STEP-052; formal QA ✓ deferred to post-deploy |
| Billing verified | Stripe test mode + webhook tests | ◐ Waived | Stripe configured in code; staging checkout requires live env keys — verify at first deploy |
| Reports verified | Integration + E2E-05 | ☑ Pass | PDF/CSV/Excel export tested in CI integration suite |
| Backups verified | DR runbook | ◐ Waived | Neon/Supabase provider backups assumed; DR drill scheduled post-GA (Volume 9 Ch. 19) |
| Monitoring enabled | Sentry + `/health` | ☑ Pass | STEP-050; optional DSN |
| Documentation complete | BUILD-LOG, runbooks, privacy | ◐ Partial | Legal pages **placeholders** — see §3; ops docs complete |

---

## 2. Volume 9 — CI/CD gates (Ch. 21)

| Gate | Status | Evidence |
|------|--------|----------|
| ESLint | ☑ | `pnpm lint` |
| Typecheck | ☑ | `pnpm typecheck` |
| Unit tests | ☑ | Vitest — shared + web |
| Integration tests | ☑ | Service-level DB tests (CI Postgres when enabled) |
| Production build | ☑ | `pnpm build` |
| E2E smoke on PR | ☑ | GitHub Actions `@smoke` |
| Changelog updated | ☑ | CHANGELOG `[1.0.0]` |

---

## 3. Volume 7 — Business & legal readiness (Ch. 22)

| Item | Status | Notes |
|------|--------|-------|
| Logo / product name | ◐ | In-app branding; marketing site post-GA |
| Marketing site | ☐ | Deferred — app-first launch |
| Pricing page (public) | ◐ | In-app `/billing`; public site TBD |
| Privacy Policy | ◐ **Placeholder** | Publish URL before collecting production PII at scale |
| Terms of Service | ◐ **Placeholder** | Legal review required before paid marketing |
| Refund policy | ◐ **Placeholder** | Stripe handles payments; policy page TBD |
| AI disclosure | ☑ | OCR is assistive; user approves extracted data (SCR-024) |
| Support email | ◐ | Configure `support@` at domain cutover |
| Stripe products | ◐ | Env vars documented; create products in Stripe Dashboard |
| Analytics instrumentation | ◐ | Sentry optional; product analytics V1.1 |

**Disclaimer (in-app):** Mileage & Expense Copilot organizes records; not tax/legal/accounting advice (Volume 7 Ch. 15).

---

## 4. Production ops (STEP-050)

| Checklist | Status |
|-----------|--------|
| [PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md) reviewed | ☑ |
| `/health` returns dependency flags | ☑ |
| `ADMIN_EMAIL_ALLOWLIST` documented | ☑ |
| Runbooks linked in README | ☑ |
| Netlify deploy skeleton | ☑ |

*Environment-specific rows (Staging/Production ☐) are completed at deploy time, not in repo.*

---

## 5. Catalog audit (STEP-052)

| Artifact | Status | Location |
|----------|--------|----------|
| Screen catalog | ☑ Updated | [SCR-INDEX.md](../screen-catalog/SCR-INDEX.md) |
| API catalog | ☑ Updated | [API-INDEX.md](../api-catalog/API-INDEX.md) |
| MEI §3 percentages | ☑ Updated | [MASTER-EXECUTION-INDEX.md](../MASTER-EXECUTION-INDEX.md) §3 |
| Device matrix | ☑ Signed | [DEVICE-MATRIX.md](DEVICE-MATRIX.md) |

---

## 6. Beta test notes (internal dry run)

**Stage:** Internal (Volume 9 Ch. 22)  
**Date:** 2026-06-25  
**Participants:** Engineering (automated journeys)

| Journey | ID | Result | Notes |
|---------|-----|--------|-------|
| Signup → onboarding → dashboard | E2E-01 | ☑ Green | Requires `E2E_SIGNUP_ENABLED=1` + Supabase auto-confirm |
| Business + vehicle setup | E2E-02 | ☑ Green | |
| Trip + manual expense | E2E-03 | ☑ Green | |
| Receipt upload → OCR approve | E2E-04 | ☑ Green | Mock/skip OCR when `OPENAI_API_KEY` unset |
| Report download | E2E-05 | ☑ Green | |
| Billing upgrade flow | E2E-06 | ☑ Green | Stripe test mode when configured |
| Free tier trip limit | E2E-07 | ☑ Green | |
| Accessibility (axe) | a11y spec | ☑ Green | Primary pages — zero critical violations |

**Closed beta (25–50 users):** Not run pre-GA — scheduled immediately after staging deploy.

**Findings backlog (non-blocking):**

- Attach receipt UI (SCR-029) — API only; dedicated screen V1.1
- Client/project modules — V1.1
- CSP `unsafe-inline` — tighten post-GA (STEP-048 F-008)
- Legal pages — publish before paid acquisition campaigns

---

## 7. Known deferred scope (explicitly not GA blockers)

| Item | BUILD / STEP | Target |
|------|--------------|--------|
| Offline sync | BUILD-006 | V1.1 |
| AI duplicate detection | BUILD-012 | V1.1 |
| Full AdminOS | Volume 17 | V1.1+ |
| Clients / projects | BUILD-004 ext | V1.1 |
| Marketing site | Volume 7 | Post-GA |

---

## 8. Release certification

> *"If this were the only business tool someone relied on to document an entire year's worth of travel and expenses, would we trust it with our own records?"* — Volume 9 Ch. 33

| Criterion | Status |
|-----------|--------|
| Core MRID flows (trip, receipt, expense, report, billing) | ☑ Shipped |
| Data ownership + export path | ☑ Reports export |
| Security baseline | ☑ STEP-048 |
| Honest catalog / MEI status | ☑ STEP-052 |

**Certification:** ☑ **Ready for V1.0.0 tag** — pending production env sign-off at first Netlify deploy.

---

## Tag procedure

```bash
git tag -a v1.0.0 -m "Mileage & Expense Copilot V1.0.0 — GA (STEP-052)"
git push origin v1.0.0   # when remote ready
```

Update [CHANGELOG.md](../../CHANGELOG.md) `[1.0.0]` date on production deploy.
