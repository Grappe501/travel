# STEP-072 — Field test beta login & admin dashboard (MEC-V1-S040)

**Version:** 1.13.0 · **Slice:** MEC-V1-S040

## Scope

Closed field test program: shared access code, individual email accounts, admin activity dashboard.

### Beta login (`/beta/login`)

- Tester enters **their email** + optional name + **shared access code**
- First visit auto-creates a Supabase account (service role, email confirmed)
- Return visits sign in normally; data stays per-user
- Open `/signup` disabled when `BETA_MODE=1`

### Admin field test dashboard (`/admin/field-test`)

- Wide desktop table: all beta testers
- Per-tester: trips, GPS trips, miles, receipts, expenses, onboarding, last login
- Aggregate stat cards + **Export CSV**

### Environment

| Variable | Purpose |
|----------|---------|
| `BETA_MODE=1` | Enable beta login; block open signup |
| `BETA_SHARED_PASSWORD` | Shared access code (server-only) |
| `NEXT_PUBLIC_BETA_MODE=1` | Home/login CTAs point to field test |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-provision confirmed tester accounts |
| `ADMIN_EMAIL_ALLOWLIST` | Who can view `/admin/field-test` |

## Verification

- [x] `/beta/login` with valid code creates/signs in tester
- [x] Invalid code rejected without leaking config
- [x] Admin dashboard lists testers with aggregates
- [x] CSV export downloads
- [x] `APP_RELEASE` → 1.13.0 / STEP-072
