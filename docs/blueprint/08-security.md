# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 8 — Security, Privacy, Compliance & Trust Architecture

**Version 1.0**

---

## Who This Document Is For

Volume 8 defines how the product **protects user data, maintains integrity, and earns trust**. For an app handling financial records, receipts, travel history, and business information, security is a **core feature** — not an IT afterthought.

| Role | Use this volume to… |
|------|---------------------|
| **Engineers** | Implement auth, RLS, validation, encryption, audit |
| **Product / legal** | Privacy posture, disclosures, compliance readiness |
| **Support / admin** | Support access rules, incident response |
| **QA** | Security test matrix (Chapter 26) before release |
| **Customers (via UX)** | Trust features (Ch. 24, 31) |

**Related:** [Volume 4 — Data](04-database-architecture.md) · [Volume 6 — Infrastructure](06-technical-architecture.md) · [Volume 7 — Legal](07-business-operations.md)

---

## Core Thesis

> **Trust is our most valuable product feature.**

Volumes 0–7 define what the product is. Volume 8 defines how it protects users.

---

# Chapter 1 — Security Philosophy

## Mission

Protect user data **without making the application difficult to use**.

| When | Security should feel… |
|------|------------------------|
| Normal operation | Invisible |
| Unusual activity | Obvious and actionable |
| Default state | Strong |
| Architecture | Layered — no single point of failure |

Security enables the product promise (Volume 1): users trust us with business records they would otherwise entrust to a shoebox or spreadsheet.

---

# Chapter 2 — Security Principles

Every security decision follows:

| # | Principle |
|---|-----------|
| 1 | **Least privilege** — minimum access for task |
| 2 | **Default deny** — explicit allow only |
| 3 | **Encrypt sensitive data** — transit + rest |
| 4 | **Verify every request** — authN + authZ + validation |
| 5 | **Log every critical action** — audit + events |
| 6 | **Never trust client input** — server/RLS authoritative |
| 7 | **Fail gracefully** — degrade, don't expose |
| 8 | **Build for recovery** — backups, incident playbooks |

Aligns with Volume 0 doctrine, Volume 6 Ch. 32, Volume 7 Ch. 29.

---

# Chapter 3 — Data Classification

Every field and asset has a classification with handling rules.

| Class | Examples | Handling |
|-------|----------|----------|
| **Public** | Marketing pages, help articles (no PII) | CDN cache OK |
| **Internal** | Aggregated analytics, system metrics | Staff only; no PII in logs |
| **Customer Confidential** | Trips, receipts, mileage, business names, clients | RLS · encrypt in transit · private storage |
| **Highly Sensitive** | Auth credentials, payment refs, API secrets, tax_id (optional) | Never client · hash/encrypt · vault storage |

### Handling Matrix

| Control | Public | Internal | Confidential | Highly Sensitive |
|---------|--------|----------|--------------|------------------|
| RLS | N/A | N/A | Required | Required |
| Client exposure | Yes | No | Own user only | Never |
| Audit on change | No | No | Financial fields | Always |
| Export in GDPR bundle | No | Aggregated only | Yes | Metadata only |
| Retention | N/A | 90d–2y | User-controlled | Minimize |

---

# Chapter 4 — Identity & Authentication

## V1 Methods

| Method | Status |
|--------|--------|
| Email + password | Required |
| Email verification | Required before full access |
| Password reset | Secure token, expiry |
| Magic link | Optional alternative |
| Google OAuth | V1.1 |
| Biometric unlock (mobile PWA) | V1.1 — reopens session, no password storage |

## Future-Ready

Passkeys · Enterprise SSO · MFA/TOTP

## Implementation (Supabase Auth)

* Passwords: **never plaintext** — Supabase adaptive hashing (bcrypt)
* Min 8 characters; breach check recommended (HIBP)
* **`user_metadata` never used for authorization** — use `auth.uid()` and `app_metadata` only (Supabase security requirement)

---

# Chapter 5 — Authorization

## RBAC Roles

| Role | Scope | V1 |
|------|-------|-----|
| **Owner** | Full account + businesses | ✓ |
| **Administrator** | Business team management | V1.1 |
| **Employee** | Own trips/expenses | V1.1 |
| **Viewer** | Read-only reports | Enterprise |
| **Support** | Limited, audited, time-boxed | Internal |
| **System** | Edge Functions, webhooks | service_role |

## Centralization

Permissions in `packages/shared/src/permissions/` — **never hardcoded in UI alone**.

## Row Level Security (mandatory)

Every `public` table:

```sql
CREATE POLICY "users_own_trips"
  ON trips FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Rules:**

* Never use `user_metadata` in RLS
* UPDATE requires SELECT policy (Postgres RLS trap)
* Views: `security_invoker = true` (Postgres 15+)
* `service_role` only in Edge Functions — never in browser

Team policies (V1.1): extend via `business_id` + `employees` membership.

---

# Chapter 6 — Session Security

## Web Sessions (`@supabase/ssr`)

| Control | Setting |
|---------|---------|
| Cookie | HTTP-only, Secure, SameSite=Lax |
| Access token TTL | 1 hour |
| Refresh token | Rotation enabled |
| Idle timeout | Optional 30d refresh window |
| Concurrent sessions | Allowed V1; revoke-all supported |

## User Features (Ch. 24)

View active sessions · Revoke device · Log out everywhere

## Mobile PWA

Biometric gate = local device unlock over existing refresh token — not a second auth system.

---

# Chapter 7 — Encryption

## Data in Transit

* **HTTPS/TLS 1.2+** everywhere (Netlify default)
* **HSTS** enabled on production domain
* Supabase client: TLS to Postgres and Storage
* Edge Functions → OpenAI: TLS only

## Data at Rest

| Asset | Protection |
|-------|------------|
| PostgreSQL | AES-256 (Supabase managed) |
| Storage (receipts, exports) | Supabase encryption at rest |
| Backups | Encrypted (Supabase Pro) |
| Audit logs | DB encryption; append-only |
| `tax_id` field | App-layer encrypt before insert (V1.1) |

## Passwords

Strong adaptive hashing via Supabase Auth — **never reversible**, never logged.

---

# Chapter 8 — Secrets Management

## Never

* Commit to source control
* Embed in client bundle (`NEXT_PUBLIC_*` only for anon key)
* Log in plaintext
* Include in screenshots, support tickets, or docs

## Environment Separation

| Env | Secrets location |
|-----|------------------|
| Local | `H:\Travel-Expense\.env.local` (gitignored) |
| Preview/Staging | Netlify + Supabase staging project |
| Production | Netlify + Supabase production vault |

## Secret Inventory

`SUPABASE_SERVICE_ROLE_KEY` · `STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` · `OPENAI_API_KEY` · `RESEND_API_KEY` · `SENTRY_DSN`

## Rotation

* On compromise: immediate
* Scheduled: annual review minimum
* Document in `docs/runbooks/secret-rotation.md`

## CI

* Secret scanning (GitHub) enabled
* Fail build if `service_role` detected in client bundle grep

---

# Chapter 9 — Receipt & File Security

Receipt images = **sensitive business records**.

| Rule | Implementation |
|------|----------------|
| Private storage | `receipts` bucket — no public access |
| Access | Signed URLs, **60s TTL** |
| Path isolation | `{user_id}/{receipt_id}/` — Storage RLS |
| File types | JPEG, PNG, HEIC, WebP, PDF only |
| Size limit | 10 MB |
| Originals | Immutable — new version = new object |
| Malware | MIME validation V1; ClamAV hook V1.1 |
| Public directory | **Never** |

No receipt bytes in application logs, Sentry breadcrumbs, or analytics.

---

# Chapter 10 — API Security

## Surfaces

| Surface | Auth | AuthZ |
|---------|------|-------|
| Supabase Data API | JWT (anon + user) | RLS |
| Edge Functions | JWT or Stripe signature | Function logic + RLS |
| Next.js Route Handlers | Session | Delegate to shared permissions |

## Every Request Includes

Authentication · Authorization · Input validation (Zod) · Rate limiting · Structured errors · Request logging (no PII)

## Error Responses

User-facing: human copy (Volume 2 Ch. 7)  
Never expose: stack traces, SQL, internal IDs beyond user's own resources

---

# Chapter 11 — Input Validation

| Layer | Purpose |
|-------|---------|
| Client (Zod) | UX — immediate feedback |
| Server (Zod + RLS) | **Security — mandatory** |
| Database | Constraints, CHECK, FK |

## Threat Controls

| Threat | Mitigation |
|--------|------------|
| SQL injection | Parameterized queries / Supabase client |
| XSS | React escape + CSP (Ch. below) |
| Malicious uploads | MIME sniff, size cap, extension allowlist |
| Oversized payloads | Body size limits on Edge Functions |
| Invalid mileage | end ≥ start; schema validation |
| Invalid currency | ISO 4217; 2 decimal places |

Schemas: `packages/shared/src/schemas/` (Volume 6 Ch. 24).

---

# Chapter 12 — Rate Limiting

| Action | Limit (V1 target) |
|--------|-------------------|
| Login | 5/min per IP (Supabase Auth) |
| Password reset | 3/hour per email |
| OCR / AI | 10/min per user |
| Receipt upload | 20/min per user |
| Report generation | 5/min per user |
| Anonymous marketing | Netlify/CDN defaults |

Authenticated users get higher thresholds than anonymous.  
Abuse → throttle → captcha (V1.1) → temporary suspend + audit event.

---

# Chapter 13 — Audit Logging

## `audit_logs` (Volume 4)

Append-only · financial and security events

| Field | Purpose |
|-------|---------|
| user_id | Actor |
| entity_type / entity_id | Target |
| action | create, update, delete, restore |
| old_values / new_values | Financial diffs |
| ip_address, user_agent, source | Context |
| created_at | Immutable timestamp |

## Events Requiring Audit

Login (security log) · Password change · Subscription change · Trip/expense/receipt delete · Report generation · Employee invite · Admin support access · Export · Account deletion request

## `business_events` (Volume 4 Ch. 26)

Product timeline — complements audit for debugging and activity feeds.

**Rule:** Never disable audit for financial actions (Ch. 33).

---

# Chapter 14 — Privacy Principles

Users **own** their data.

| Right | Implementation |
|-------|----------------|
| Access | In-app view + export |
| Export | FR-1600 JSON/CSV bundle |
| Delete | FR-1701 — 30-day grace then purge |
| Correct | Edit trip/expense with audit trail |
| Review | Trust dashboard (Ch. 31) |

**Data minimization:** Collect only what FRs require. No selling data. No ads based on receipt content.

Aligns with Volume 7 Ch. 15, Volume 1 N7.

---

# Chapter 15 — Data Retention

| Data type | Retention | User delete |
|-----------|-----------|-------------|
| Active trips/expenses | Until user deletes | Soft → hard 30d |
| Receipt images | With parent record | Storage purge on account delete |
| Generated reports | 7 days default TTL | User can delete early |
| Audit logs | 2 years | Anonymize on account delete |
| Business events | 2 years | Anonymize |
| OCR raw_response | 1 year | Redact with receipt purge |
| Temp uploads | 24 hours | Auto-cron |
| AI interaction logs | 90 days hot | Aggregate then drop PII |

Deleted accounts: documented workflow (Volume 4 Ch. 22) — honor legal holds if required.

---

# Chapter 16 — AI Privacy

Receipt images sent to AI providers must:

* Use **TLS** only
* Process **only** for requested OCR/classification
* Follow provider **data retention / zero-retention** settings (OpenAI API enterprise terms)
* **Never** train proprietary models on user data without **explicit opt-in** (Volume 7 privacy policy)

## Disclosures (required)

* AI Use Notice on marketing site and in app settings
* Which fields are AI-suggested vs user-entered
* User can skip OCR (manual entry)

## Provider DPAs

Maintain Data Processing Agreements with: OpenAI · Supabase · Stripe · Resend · Netlify

---

# Chapter 17 — Billing Security

**Stripe handles all payment credentials.**

| Never store | Store instead |
|-------------|---------------|
| Full PAN | — |
| CVV | — |
| Raw card data | — |
| | `stripe_customer_id`, `stripe_subscription_id`, plan metadata |

Webhooks: **verify signature** (`STRIPE_WEBHOOK_SECRET`) before any state change.

PCI scope: SAQ A (Stripe Checkout hosted) — do not embed custom card forms V1.

---

# Chapter 18 — Backup & Disaster Recovery

| Requirement | Target |
|-------------|--------|
| Automated backups | Supabase daily (Pro plan) |
| Encryption | At rest |
| PITR | Enable on production Pro |
| **RPO** | 24h (daily) or ≤1h with PITR |
| **RTO** | 4 hours |
| Restore testing | **Quarterly** staging drill |

Runbook: `docs/runbooks/disaster-recovery.md`  
Migration rollback: forward-only; emergency down scripts in repo.

---

# Chapter 19 — Monitoring & Incident Response

## Monitor

Failed logins · API abuse · OCR/AI failures · Stripe webhook failures · Sync failures · Storage errors · RLS violations (advisors) · Error rate spikes (Sentry)

## Incident Process

```
1. Detect    → alert / user report / advisor
2. Triage    → severity P1–P3
3. Contain   → rotate keys, disable endpoint, block IP
4. Recover   → restore service, verify data
5. Review    → postmortem within 5 business days (P1)
6. Improve   → patch, test, update runbook
```

| Severity | Example | Notification |
|----------|---------|--------------|
| P1 | Data breach, key leak | Users ≤72h if PII exposed |
| P2 | RLS misconfiguration | Internal immediate |
| P3 | OCR provider outage | Status comms optional |

Runbook: `docs/runbooks/incident-response.md`

---

# Chapter 20 — Secure Development Lifecycle

Every feature passes:

| Gate | When |
|------|------|
| Threat review | Design (blueprint / STEP doc) |
| Code review | PR |
| Unit + integration tests | CI |
| RLS policy for new tables | Migration |
| Dependency scan | CI (`npm audit`) |
| Secret scan | CI / push |
| Supabase security advisors | Pre-deploy |

Security is **part of development**, not a launch-week checklist.

SDL reference: Volume 6 Ch. 31 Cursor rules + this volume.

---

# Chapter 21 — Dependency Management

* GitHub Dependabot enabled
* `npm audit --audit-level=high` fails CI
* Review licenses (MIT/Apache preferred; copyleft awareness)
* Pin major versions; monthly dependency review
* Supabase CLI / Edge runtime updates tested in staging

Document breaking upgrades in BUILD-LOG step notes.

---

# Chapter 22 — Compliance Readiness

**Do not claim certifications until achieved.**

| Area | V1 posture |
|------|------------|
| **GDPR** | Export, delete, DPA with processors, lawful basis = contract |
| **CCPA** | No sale of PI; delete on request; privacy policy disclosure |
| **PCI** | SAQ A via Stripe Checkout |
| **WCAG 2.1 AA** | Volume 2 / 9 accessibility targets |
| **SOC 2** | Roadmap — Supabase/Stripe are SOC 2 processors |
| **HIPAA** | Not targeted V1 — do not market to covered entities |

Enterprise questionnaires: use this volume + processor SOC reports.

---

# Chapter 23 — Business Continuity

| Failure | Degradation mode |
|---------|------------------|
| Netlify outage | Rare; wait or rollback deploy |
| Supabase DB | Read-only mode not available — status page; restore from backup |
| Storage outage | Queue uploads offline; retry sync |
| OpenAI outage | OCR → manual entry path; queue retry |
| Stripe outage | Existing subs honored; block new checkout |

**Graceful degradation:** Offline capture always works (Volume 6 Ch. 16).

---

# Chapter 24 — User Trust Features

Users can:

* View login history / active sessions (V1.1 full UI; V1 logout-all)
* Download all data (export)
* Delete account
* See AI confidence and explanations (Volume 5)
* Review notification and privacy settings
* Opt out of anonymized OCR training

Transparency = confidence. No dark patterns on privacy controls.

---

# Chapter 25 — Fraud & Abuse Prevention

| Pattern | Response |
|---------|----------|
| Automated signups | Email verify required; rate limit IP |
| OCR farming on free tier | Usage counters + hard limits |
| Repeated failed logins | Lockout + notify user |
| API scraping | RLS + rate limits; no bulk anon API |
| Suspicious uploads | Size/type block; account flag |

Proportional response — don't punish legitimate heavy users on Pro.

---

# Chapter 26 — Security Testing

## Before Every Production Release

| Test | Tool / method |
|------|---------------|
| Static analysis | ESLint security rules |
| Dependency scan | npm audit, Dependabot |
| Auth flows | E2E signup/login/reset |
| Authorization | Two-user RLS integration tests |
| IDOR | User B cannot read User A trip |
| File upload | Reject exe, oversize, spoofed MIME |
| Stripe webhooks | Signature rejection test |
| Backup restore | Quarterly drill |
| OWASP ZAP | Staging scan pre-launch |
| Client bundle | No service_role key grep |

Penetration test: budget before Enterprise tier; bug bounty after 1K paying users.

---

# Chapter 27 — Privacy Documentation

Required and must **match actual behavior**:

| Document | Volume 7 ref |
|----------|--------------|
| Privacy Policy | Ch. 13 |
| Terms of Service | Ch. 13 |
| AI Usage Notice | Ch. 13 |
| Data Deletion Policy | Ch. 13 / 15 |
| Cookie Notice | If Plausible/PostHog cookies |
| Security contact | security@mileagecopilot.com (TBD) |

Update docs when data practices change — version date in footer.

---

# Chapter 28 — Customer Security Education

Help center articles:

* Strong passwords · Recognizing phishing (we never ask for password by email)
* Protecting exported PDFs/CSVs
* Shared device best practices
* Managing employee access (SB tier)
* What AI does and does not do

Good security includes **informed users**.

---

# Chapter 29 — Internal Administrative Security

Admin tools (Volume 6 Ch. 19):

| Control | Requirement |
|---------|-------------|
| Authentication | Separate allowlist or MFA |
| Permissions | Fine-grained; least privilege |
| Audit | Every admin action logged |
| Session | Short TTL |
| Customer content | **No receipt view** without user grant + logged break-glass |

Support break-glass flow:

1. User submits ticket consenting to review  
2. Admin opens time-boxed elevated access (1 hour)  
3. `audit_logs` + `business_events` record admin.user_id, target, reason  

---

# Chapter 30 — Security Roadmap

| Enhancement | Target |
|-------------|--------|
| Passkeys / WebAuthn | V1.2 |
| MFA TOTP | V1.1 |
| Enterprise SSO (SAML/OIDC) | Enterprise tier |
| Hardware security keys | Enterprise |
| Anomaly detection (login, OCR) | V1.2 |
| Customer-managed encryption keys | Enterprise eval |
| Org security dashboard | Business Plus |

Architecture must **accommodate without redesign** — RBAC + RLS + modular auth.

---

# Chapter 31 — Trust & Transparency Dashboard

**Settings → Security & Privacy** (V1 core, expand V1.1)

| Widget | Shows |
|--------|-------|
| AI processing | Recent OCR jobs; opt-out link |
| Sync status | Pending queue count |
| Account security | Last login; logout all devices |
| Privacy | Link to policies; analytics opt-out |
| Recent exports | Date, format, download |
| Connected devices | Session list V1.1 |

Reinforces user control — complements Volume 2 UX calm tone.

---

# Chapter 32 — Production Security Readiness Checklist

Before launch — **all** required:

- [ ] Authentication: signup, verify, login, reset, logout tested  
- [ ] Authorization: RLS on every table; two-user IDOR tests pass  
- [ ] Secrets: none in repo; client bundle scan clean  
- [ ] TLS/HSTS enforced on production domain  
- [ ] File uploads: type, size, private bucket validated  
- [ ] Receipt storage: signed URLs only; cross-user access fails  
- [ ] Stripe: webhook signature verified; no card data stored  
- [ ] Audit logging active on financial entities  
- [ ] Backup enabled; restore tested this quarter  
- [ ] Rate limiting configured  
- [ ] Sentry/monitoring active; PII scrubbed  
- [ ] Privacy + Terms + AI notice published  
- [ ] Security contact email live  
- [ ] Incident runbook written  
- [ ] Supabase security advisors: zero critical  

Combines with Volume 6 Ch. 28 and Volume 7 Ch. 28.

---

# Chapter 33 — Security Non-Negotiables

| # | Rule |
|---|------|
| 1 | Never expose receipt images publicly |
| 2 | Never silently alter financial records |
| 3 | Never store passwords in reversible form |
| 4 | Never commit secrets to source control |
| 5 | Never bypass authorization checks |
| 6 | Never disable audit logging for financial actions |
| 7 | Never claim compliance/certification not earned |
| 8 | Never collect data unnecessary for functionality |
| 9 | Never let AI overwrite user financial data without confirmation |
| 10 | Never use `user_metadata` for authorization decisions |

Violations block release until remediated.

---

# Chapter 34 — The Trust Promise

Every design and engineering decision reinforces:

> **Mileage & Expense Copilot is trusted because it treats the user's business records with the same care the user would expect from a professional accountant's office — while remaining clear that it is an organizational tool, not a substitute for professional tax, legal, or accounting advice.**

Trust is built into **every layer** from the first migration forward — not added at launch.

---

## Content Security Policy (Production)

Netlify headers (`netlify.toml`):

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com;
img-src 'self' data: blob: https://*.supabase.co;
frame-src https://js.stripe.com https://hooks.stripe.com;
```

Tighten `unsafe-inline` / `unsafe-eval` during hardening sprint.

---

## Processor Security Posture (Reference)

| Processor | Certification | Our use |
|-----------|---------------|---------|
| Supabase | SOC 2 Type II | DB, Auth, Storage |
| Stripe | PCI DSS Level 1 | Payments |
| Netlify | SOC 2 | Hosting |
| OpenAI | Enterprise DPA available | OCR API |
| Resend | SOC 2 | Email |

Maintain processor list in privacy policy annex.

---

## Document Map

| Need | Go to |
|------|-------|
| RLS schema | [Volume 4](04-database-architecture.md) |
| Billing legal | [Volume 7 Ch. 13–14](07-business-operations.md) |
| AI privacy | [Volume 5 Ch. 17](05-ai-design.md) |
| Security tests | [Volume 9](09-testing-quality.md) |
| Incident runbook | `docs/runbooks/incident-response.md` (create at Phase H) |

---

*Previous: [Volume 7 — Business Operations & Go-to-Market](07-business-operations.md) | Next: [Volume 9 — Testing & Quality](09-testing-quality.md)*
