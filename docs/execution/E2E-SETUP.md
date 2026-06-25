# E2E test setup (MEC-V1-S015 / STEP-047)

Playwright end-to-end tests live in `apps/web/e2e/` and cover Volume 9 journeys **E2E-01** through **E2E-07**.

## Prerequisites

1. **Postgres** with migrations applied (`pnpm db:migrate:deploy`)
2. **Supabase project** (dev/staging only — never production)
3. **Pre-seeded E2E user** for authenticated flows, or enable signup for E2E-01
4. For **E2E-04**: Supabase Storage bucket configured (`STORAGE_BUCKET`, service role key)

## Quick start

```bash
cp .env.test.example .env.test
# Edit .env.test with your Supabase + DB credentials

pnpm install
pnpm exec playwright install chromium --with-deps   # first run only
pnpm db:migrate:deploy

pnpm test:e2e          # full suite (skips when E2E_TEST is unset)
E2E_TEST=1 pnpm test:e2e

pnpm test:e2e:smoke    # E2E-01 + E2E-03 only (@smoke tag)
pnpm test:e2e:a11y     # axe scans on primary authenticated pages (@a11y tag)
```

Playwright loads env from `.env.test`, then `.env.local`, then `.env` (first wins for each key).

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `E2E_TEST=1` | Yes | Enables web server + test execution |
| `DATABASE_URL` | Yes | App database |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Auth |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Auth |
| `E2E_USER_EMAIL` / `E2E_USER_PASSWORD` | E2E-02–07 | Pre-seeded login user |
| `E2E_SIGNUP_ENABLED=1` | E2E-01 | Signup journey (auto-confirm required) |
| `E2E_STORAGE_READY=1` | E2E-04 | Receipt upload to Supabase Storage |
| `PLAYWRIGHT_BASE_URL` | No | Default `http://localhost:3000` |

## Journey map

| ID | Spec | Viewport | Notes |
|----|------|----------|-------|
| E2E-01 | `e2e-01-signup.spec.ts` | 390×844 | Signup → onboarding → dashboard |
| E2E-02 | `e2e-02-business-vehicle.spec.ts` | 390×844 | Create business + vehicle |
| E2E-03 | `e2e-03-trip-expense.spec.ts` | 390×844 | Trip + expense + summary |
| E2E-04 | `e2e-04-receipt-approve.spec.ts` | 390×844 | Mock OCR intercept |
| E2E-05 | `e2e-05-report-download.spec.ts` | Desktop | CSV download |
| E2E-06 | `e2e-06-billing-upgrade.spec.ts` | Desktop | Mock Stripe checkout |
| E2E-07 | `e2e-07-trip-limit.spec.ts` | Desktop | Free tier 6th trip blocked |

## Mocks

- **OCR (E2E-04):** `POST **/api/receipts/*/ocr` intercepted; OpenAI blocked
- **Stripe (E2E-06):** `POST **/api/stripe/checkout` returns redirect to `/billing?checkout=success`

## CI

The `e2e` job runs smoke tests (`@smoke`) on PR when repository secrets are configured. Until secrets exist, the job uses `continue-on-error: true`.

Required GitHub secrets: `E2E_DATABASE_URL`, `E2E_SUPABASE_URL`, `E2E_SUPABASE_ANON_KEY`, `E2E_USER_EMAIL`, `E2E_USER_PASSWORD`, optional `E2E_SUPABASE_SERVICE_ROLE_KEY`.

## Auth storage

Login state is saved to `apps/web/e2e/.auth/user.json` (gitignored) by `auth.setup.ts`.
