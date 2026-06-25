# DEC-001 — V1 Tech Stack (Execution Lock)

| Field | Value |
|-------|-------|
| **DEC-ID** | DEC-001 (amended for V1 execution) |
| **Date** | 2026-06-24 |
| **Status** | **LOCKED** |
| **Supersedes** | Blueprint DEC-001 (Supabase migrations only) for implementation |

---

## Decision

Version 1 implementation uses:

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 + TypeScript |
| Styling | Tailwind CSS |
| Database | **Neon Postgres** |
| ORM | **Prisma** |
| Auth | **Supabase Auth** (`@supabase/ssr`) |
| Storage | **Supabase Storage** (private buckets) |
| Payments | Stripe |
| OCR | OpenAI Vision (server-side API routes) |
| Email | Resend |
| Hosting | **Netlify** |
| Validation | Zod |
| Testing | Vitest + Playwright |
| Monitoring | Sentry |

---

## Rationale

| Choice | Why |
|--------|-----|
| Prisma + Neon | Type-safe schema, migration workflow, serverless Postgres scale |
| Supabase Auth (not Clerk) | Keeps auth + storage under one vendor; blueprint MRIDs assume Supabase session model |
| Supabase Storage (not raw S3) | RLS-aligned paths; receipt privacy |
| Netlify (not Vercel) | Existing deploy config; project history on Netlify |
| OpenAI Vision | Volume 16 PRM-OCR-001; human review required (DNA) |

---

## Rejected for V1

| Alternative | Reason deferred |
|-------------|-----------------|
| Prisma + Neon only (no Supabase) | Auth + storage integration |
| Clerk | Extra vendor; revisit if enterprise SSO needed |
| Supabase SQL migrations only | Execution packet locks Prisma for app layer |
| GPS auto-tracking | Out of V1 scope |

---

## Consequences

- Volume 4 entity model maps to Prisma models (not `supabase/migrations/` as source of truth)
- Authorization: application layer + Prisma middleware + Postgres row policies as needed
- Edge Functions replaced by Next.js API routes / server actions for OCR and Stripe webhooks
- Blueprint Volume 6 remains valid for architecture patterns; stack table amended here for build

---

## References

- [VERSION_1_EXECUTION_PACKAGE.md](../execution/VERSION_1_EXECUTION_PACKAGE.md)
- Volume 6 — Technical Architecture
- Volume 16 — AI Operating System
