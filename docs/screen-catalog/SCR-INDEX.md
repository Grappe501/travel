# Screen ID Catalog — SCR-INDEX

**Source of truth for implementation tracking.**  
Canonical specs: [Volume 11 — Screen Bible](../blueprint/11-screen-bible.md)

Update **Dev Status** and **QA Status** columns as screens ship.

**Audit date:** STEP-052 (2026-06-25) — Dev ☑ = route shipped in `apps/web`. QA ◐ = covered by Playwright E2E or axe scan; QA ✓ = formal sign-off (post-GA).

| SCR-ID | Screen | Route (catalog) | App route | Wave | Dev | QA |
|--------|--------|-----------------|-----------|------|-----|-----|
| SCR-001 | Splash | `/` | `/` | 1 | ☑ | ◐ |
| SCR-002 | Welcome | `/welcome` | — | 1 | ☐ | ☐ |
| SCR-003 | Sign In | `/auth/login` | `/login` | 1 | ☑ | ◐ |
| SCR-004 | Create Account | `/auth/signup` | `/signup` | 1 | ☑ | ◐ |
| SCR-005 | Verify Email | `/auth/verify` | `/auth/verify-email` | 1 | ☑ | ☐ |
| SCR-006 | Forgot Password | `/auth/forgot` | `/auth/forgot-password` | 1 | ☑ | ☐ |
| SCR-007 | Reset Password | `/auth/reset` | `/auth/reset-password` | 1 | ☑ | ☐ |
| SCR-008 | Welcome Tour | `/onboarding` | `/onboarding` | 1 | ☑ | ◐ |
| SCR-009 | Subscription Selection | `/onboarding/plan` | — | 1 | ☐ | ☐ |
| SCR-010 | Create Business | `/onboarding/business` | `/onboarding` (step) | 1 | ☑ | ◐ |
| SCR-011 | Add Vehicle | `/onboarding/vehicle` | `/onboarding` (step) | 1 | ☑ | ◐ |
| SCR-012 | Mileage Rate Setup | `/onboarding/rate` | `/settings/mileage` | 1 | ☑ | ☐ |
| SCR-013 | Permissions | `/onboarding/permissions` | — | 1 | ☐ | ☐ |
| SCR-014 | First Trip Tutorial | `/onboarding/first-trip` | — | 1 | ☐ | ☐ |
| SCR-015 | Dashboard Home | `/dashboard` | `/dashboard` | 2 | ☑ | ◐ |
| SCR-016 | Active Trip Dashboard | `/trips/[id]/active` | `/trips/[id]` | 3 | ☑ | ◐ |
| SCR-017 | Trip List | `/trips` | `/trips` | 3 | ☑ | ◐ |
| SCR-018 | Trip Details | `/trips/[id]` | `/trips/[id]` | 3 | ☑ | ◐ |
| SCR-019 | Start Trip | `/trips/start` | `/trips/start` | 3 | ☑ | ◐ |
| SCR-020 | End Trip | `/trips/[id]/end` | `/trips/[id]/end` | 3 | ☑ | ◐ |
| SCR-021 | Edit Trip | `/trips/[id]/edit` | `/trips/[id]/edit` | 3 | ☑ | ☐ |
| SCR-022 | Duplicate Trip | `/trips/duplicate/[id]` | — | 3 | ☐ | ☐ |
| SCR-023 | Receipt Capture | `/expenses/scan` | `/receipts/upload` | 4 | ☑ | ◐ |
| SCR-024 | Receipt Review | `/expenses/scan/review` | `/receipts/[id]/review` | 4 | ☑ | ◐ |
| SCR-025 | Receipt Details | `/expenses/receipts/[id]` | `/receipts/[id]` | 4 | ☑ | ◐ |
| SCR-026 | Receipt Gallery | `/expenses/receipts` | `/receipts` | 4 | ☑ | ◐ |
| SCR-027 | Expense List | `/expenses` | `/expenses` | 4 | ☑ | ◐ |
| SCR-028 | Expense Detail | `/expenses/[id]` | `/expenses/[id]` | 4 | ☑ | ◐ |
| SCR-029 | Attach Receipt to Trip | `/expenses/attach` | API-only (`/api/receipts/[id]/attach`) | 4 | ◐ | ☐ |
| SCR-030 | Reports Home | `/reports` | `/reports` | 5 | ☑ | ◐ |
| SCR-031 | Report Builder | `/reports/build` | `/reports` (inline) | 5 | ☑ | ◐ |
| SCR-032 | Report Viewer | `/reports/[id]` | `/reports/[id]` | 5 | ☑ | ◐ |
| SCR-033 | Business List | `/business` | `/businesses` | 2 | ☑ | ◐ |
| SCR-034 | Business Profile | `/business/[id]` | `/businesses/[id]` | 2 | ☑ | ☐ |
| SCR-035 | Vehicle List | `/vehicles` | `/vehicles` | 2 | ☑ | ◐ |
| SCR-036 | Vehicle Details | `/vehicles/[id]` | `/vehicles/[id]` | 2 | ☑ | ☐ |
| SCR-037 | Client Directory | `/clients` | `/clients` | 2 | ☑ | ◐ |
| SCR-038 | Client Detail | `/clients/[id]` | `/clients/[id]` | 2 | ☑ | ◐ |
| SCR-039 | Project Detail | `/clients/[id]/projects/[pid]` | `/clients/[id]/projects/[pid]` | 2 | ☑ | ◐ |
| SCR-040 | AI Suggestions | `/ai/suggestions` | — | 4 | ☐ | ☐ |
| SCR-041 | AI History | `/ai/history` | `/ai/history` | 4 | ☑ | ◐ |
| SCR-042 | Notification Center | `/notifications` | — | 7 | ☐ | ☐ |
| SCR-043 | Global Search | `/search` | — | 3 | ☐ | ☐ |
| SCR-044 | Subscription | `/settings/billing` | `/billing` | 6 | ☑ | ◐ |
| SCR-045 | Usage Dashboard | `/settings/usage` | `/billing` (combined) | 6 | ☑ | ◐ |
| SCR-046 | Settings Home | `/settings` | `/settings` | 7 | ☑ | ☐ |
| SCR-047 | Account | `/settings/account` | — | 7 | ☐ | ☐ |
| SCR-048 | Appearance | `/settings/appearance` | — | 7 | ☐ | ☐ |
| SCR-049 | Security | `/settings/security` | — | 7 | ☐ | ☐ |
| SCR-050 | Data & Privacy | `/settings/privacy` | — | 7 | ☐ | ☐ |
| SCR-051 | Help Center | `/help` | — | 7 | ☐ | ☐ |
| SCR-052 | Contact Support | `/help/contact` | — | 7 | ☐ | ☐ |
| SCR-053 | Admin Dashboard | `/admin` | `/admin` | 7 | ☑ | ☐ |
| SCR-054 | User Detail (Admin) | `/admin/users/[id]` | `/admin/users/[id]` | 7 | ☑ | ☐ |
| SCR-055 | System Health | `/admin/health` | `/admin/health` | 7 | ☑ | ☐ |
| SCR-056 | Add Sheet | modal | partial (BottomNav) | 2 | ◐ | ☐ |
| SCR-057 | Delete Confirmation | modal | partial (components) | 3 | ◐ | ☐ |
| SCR-058 | Upgrade Modal | modal | `/billing` limit UX | 6 | ◐ | ◐ |
| SCR-059 | Expense Categories | `/settings/categories` | — | 7 | ☐ | ☐ |
| SCR-060 | Mileage Rates | `/settings/mileage-rates` | `/settings/mileage` | 2 | ☑ | ☐ |

**V1 summary:** 38 Dev ☑ · 4 Dev ◐ · 18 not started · 21 QA ◐ (E2E/axe) · 0 formal QA ✓

## PR convention

```
SCR-IDs: SCR-019, SCR-021
```

## Status legend

| Symbol | Meaning |
|--------|---------|
| ☐ | Not started |
| ◐ | In progress / partial / automated QA only |
| ☑ | Dev complete |
| ✓ | QA passed (formal sign-off) |
