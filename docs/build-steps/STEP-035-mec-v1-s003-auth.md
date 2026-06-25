# STEP-035 — MEC-V1-S003 Authentication

| Field | Value |
|-------|-------|
| **Step ID** | STEP-035 |
| **Phase** | A |
| **Slice** | MEC-V1-S003 |
| **Date** | 2026-06-24 |
| **Commit** | `354de64` |
| **Status** | complete |

## Objective

Supabase Auth with SSR cookies: signup, login, logout, protected routes, and `UserProfile` upsert on first authenticated session.

## Changes

- `@supabase/ssr` + `@supabase/supabase-js` in `apps/web`
- `apps/web/src/lib/supabase/` — browser/server clients, middleware session refresh, public config
- `apps/web/src/middleware.ts` — protects dashboard and app routes; redirects authed users away from `/login`/`/signup`
- `apps/web/src/lib/auth/` — protected route constants, server actions (`syncUserProfileAfterAuth`, `signOut`)
- `apps/web/src/server/services/auth.service.ts` — `ensureUserProfile`, `getUserProfile`
- `apps/web/src/components/auth/` — `LoginForm`, `SignupForm`, `LogoutButton`
- `apps/web/src/app/login`, `signup`, `dashboard`, `auth/callback`
- `packages/shared/src/schemas/auth.ts` — login/signup Zod schemas
- `.env.example` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- CI build env — Supabase placeholders for `pnpm build`

## Local setup

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
DATABASE_URL=postgresql://...   # Neon — required for profile upsert
```

In Supabase Dashboard → Authentication → URL configuration, set site URL and add `http://localhost:3000/auth/callback` as a redirect URL.

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass — /login, /signup, /dashboard (dynamic), /auth/callback
```

## Traceability

- **BUILD-002** · **MRID-000001** · **AUTH-MRID-000001**

## Next step

**STEP-036** — [MEC-V1-S004 Design system](../execution/slices/MEC-V1-S004-design-system.md)
