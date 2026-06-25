# Volume 8 — Security

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

Authentication, authorization, encryption, privacy, and compliance roadmap.

---

## Security Principles

1. **Defense in depth** — RLS + app validation + network TLS
2. **Least privilege** — service role only in Edge Functions
3. **Zero trust client** — never trust browser for authorization
4. **Financial data integrity** — audit logs, no silent AI changes
5. **Privacy by design** — collect minimum, delete completely

---

## Authentication

| Method | V1 | Notes |
|--------|-----|-------|
| Email + password | Yes | Supabase Auth, bcrypt |
| Magic link | Optional | Lower friction alternative |
| Google OAuth | V1.1 | |
| Apple OAuth | V1.1 | Required if iOS native later |
| MFA (TOTP) | V1.1 | Recommended for Pro |

**Session management:**
- HTTP-only cookies via `@supabase/ssr` in Next.js middleware
- Refresh token rotation enabled
- JWT expiry: 1 hour
- Logout invalidates session server-side

**Password policy:** Min 8 characters; breach check via Have I Been Pwned (Supabase or custom).

---

## Authorization

### Row Level Security (mandatory)

Every table in `public` schema:

```sql
-- Pattern for user-owned rows
CREATE POLICY "Users manage own trips"
  ON trips FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Never use `user_metadata` in RLS policies** — use `auth.uid()` only.

### Role model (V1)

| Role | Scope |
|------|-------|
| anonymous | Public marketing pages only |
| authenticated | Own data via RLS |
| service_role | Edge Functions, webhooks only — never in client |

### Small Business tier (V1.1)

Add `team_members` table with role enum: owner, admin, employee.  
RLS policies extend to team business_id scope.

---

## API Key Management

| Key | Where stored | Exposure |
|-----|--------------|----------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Netlify env | Public — safe with RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Edge secrets only | Never client |
| `STRIPE_SECRET_KEY` | Edge Function secrets | Never client |
| `OPENAI_API_KEY` | Edge Function secrets | Never client |
| `STRIPE_WEBHOOK_SECRET` | Edge Function secrets | Verify signatures |

Rotate keys on compromise; document rotation in runbook.

---

## Encryption

| Data | In transit | At rest |
|------|------------|---------|
| All HTTP | TLS 1.2+ | — |
| Database | TLS to Supabase | AES-256 (Supabase managed) |
| Receipt images | TLS upload | Supabase Storage encryption |
| EIN (optional field) | TLS | App-level encrypt before insert (V1.1) |
| Backups | Encrypted | Supabase managed |

---

## Receipt & Financial Data Privacy

- Receipt bucket **private** — signed URLs only, 60s TTL
- No receipt images in logs, error reports, or analytics
- OCR sent to OpenAI — disclose in privacy policy; DPA with OpenAI
- Option: opt out of OCR (manual entry only) for privacy-sensitive users

---

## Location Data

- GPS optional — never required
- Coordinates stored only if user starts/ends trip with location enabled
- Not shared with third parties except map tile provider (client-side)
- User can delete all location history via account deletion

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Auth login | 5/min per IP (Supabase built-in) |
| OCR process-receipt | 10/min per user |
| Report generation | 5/min per user |
| API general | Supabase plan limits |

Add Cloudflare or Netlify rate limiting if abuse detected.

---

## Input Validation

- All inputs validated with Zod schemas in `packages/shared`
- Server-side re-validation in Edge Functions
- SQL injection: prevented via Supabase parameterized queries
- XSS: React escaping + CSP headers on Netlify
- File upload: MIME sniff, max 10MB, image/PDF only

---

## Content Security Policy (Netlify headers)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com;
img-src 'self' data: blob: https://*.supabase.co;
frame-src https://js.stripe.com https://hooks.stripe.com;
```

Tighten `unsafe-inline` / `unsafe-eval` during implementation.

---

## Audit & Compliance

### Audit logging

Financial entity changes → `audit_logs` table (Volume 4).

Fields: who, what, old/new values, timestamp.

### GDPR Readiness

| Requirement | Implementation |
|-------------|----------------|
| Lawful basis | Contract (service delivery) |
| Right to access | Data export (FR-016) |
| Right to erasure | Account deletion flow |
| Data portability | JSON/CSV export |
| Privacy policy | Published, linked in app |
| DPA with processors | Supabase, Stripe, OpenAI, Netlify |

### CCPA Readiness

- Do not sell personal information
- Delete on request
- Disclose categories collected in privacy policy

### SOC 2

Not V1 — roadmap when enterprise tier gains traction.  
Supabase and Stripe are SOC 2 compliant processors.

---

## Penetration Testing

- Pre-launch: OWASP ZAP automated scan on staging
- Before enterprise tier: third-party pentest budgeted
- Bug bounty: consider after 1K paying users

---

## Incident Response

| Severity | Example | Response |
|----------|---------|----------|
| P1 | Data breach, service role key leak | Rotate keys, notify users within 72h, postmortem |
| P2 | RLS misconfiguration | Disable affected endpoint, patch migration, audit access logs |
| P3 | OCR provider outage | Fail to manual entry, status page update |

**Runbook location:** `docs/runbooks/incident-response.md` (create at launch)

---

## Dependency Security

- GitHub Dependabot enabled
- `npm audit` in CI — fail on critical
- Pin major versions; review monthly

---

## Security Checklist (Pre-Launch)

- [ ] RLS enabled and tested on every table
- [ ] Storage policies tested (user A cannot access user B receipts)
- [ ] Service role key not in repo or client bundle
- [ ] Stripe webhook signature verification
- [ ] CSP headers configured
- [ ] HTTPS enforced (Netlify default)
- [ ] Account deletion purges Storage files
- [ ] Error tracking scrubs PII
- [ ] Supabase advisors run clean (security lints)

---

*Previous: [Volume 7 — Business Operations & Go-to-Market](07-business-operations.md) | Next: [Volume 9 — Testing & Quality](09-testing-quality.md)*
