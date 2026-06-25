# MEC-V1-S016 — Security Hardening

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S016 — Security Hardening

Mission:
WAVE-010 security pass — audit auth boundaries, storage privacy, webhook verification, and RLS policies; fix findings before GA.

Context:
- Prior: MEC-V1-S015 (STEP-047) complete
- BUILD-ID: BUILD-014 (security tranche)
- Volumes: 8 (Security), 9 (SEC tests)
- Baseline: Supabase RLS migration exists; service-layer ownership checks in place

Allowed paths:
apps/web/src/app/api/**
apps/web/src/lib/auth/**
apps/web/src/lib/storage/**
apps/web/src/middleware.ts
supabase/migrations/** (RLS policy fixes only)
docs/security/STEP-048-audit.md (findings + remediation log)
apps/web/src/**/*.security.test.ts (auth boundary tests)

Rules:
- Every API route must call requireSessionUser (or explicit webhook/auth exception)
- Receipt files never public; signed URLs only
- Stripe webhook must verify signature; reject unsigned
- Document any admin allowlist env vars
- Fix critical/high findings in same slice; log medium/low for backlog

Forbidden:
- Disabling RLS without ADR
- Public storage buckets for receipts
- Exposing service role key client-side
- scope creep into new features

Deliverables:
1. Security audit checklist completed (Volume 8 summary)
2. API route inventory — auth verified on each handler
3. RLS policy review + migration if gaps found
4. SEC tests: unauthorized API returns 401; cross-user access returns 404
5. Rate-limit or size-limit review on upload/OCR routes
6. CSP / security headers review for Netlify/Next config
7. docs/security/STEP-048-audit.md with sign-off section

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test

Exit criteria:
- [ ] No API route missing auth (except /health, /api/stripe/webhook)
- [ ] Cross-user trip/receipt/expense access blocked in tests
- [ ] Stripe webhook rejects invalid signature
- [ ] Audit doc lists all findings with status fixed/deferred
- [ ] No critical open items remain

Commit:
chore(security): MEC-V1-S016 hardening audit and fixes

Step: STEP-048
BUILD-IDs: BUILD-014 (part 4/5)
MRID-IDs: —
```
