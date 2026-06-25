# Screen ID Catalog — SCR-INDEX

**Source of truth for implementation tracking.**  
Canonical specs: [Volume 11 — Screen Bible](../blueprint/11-screen-bible.md)

Update **Dev Status** and **QA Status** columns as screens ship.

| SCR-ID | Screen | Route | Wave | Dev | QA |
|--------|--------|-------|------|-----|-----|
| SCR-001 | Splash | `/` | 1 | ☐ | ☐ |
| SCR-002 | Welcome | `/welcome` | 1 | ☐ | ☐ |
| SCR-003 | Sign In | `/auth/login` | 1 | ☐ | ☐ |
| SCR-004 | Create Account | `/auth/signup` | 1 | ☐ | ☐ |
| SCR-005 | Verify Email | `/auth/verify` | 1 | ☐ | ☐ |
| SCR-006 | Forgot Password | `/auth/forgot` | 1 | ☐ | ☐ |
| SCR-007 | Reset Password | `/auth/reset` | 1 | ☐ | ☐ |
| SCR-008 | Welcome Tour | `/onboarding` | 1 | ☐ | ☐ |
| SCR-009 | Subscription Selection | `/onboarding/plan` | 1 | ☐ | ☐ |
| SCR-010 | Create Business | `/onboarding/business` | 1 | ☐ | ☐ |
| SCR-011 | Add Vehicle | `/onboarding/vehicle` | 1 | ☐ | ☐ |
| SCR-012 | Mileage Rate Setup | `/onboarding/rate` | 1 | ☐ | ☐ |
| SCR-013 | Permissions | `/onboarding/permissions` | 1 | ☐ | ☐ |
| SCR-014 | First Trip Tutorial | `/onboarding/first-trip` | 1 | ☐ | ☐ |
| SCR-015 | Dashboard Home | `/dashboard` | 2 | ☐ | ☐ |
| SCR-016 | Active Trip Dashboard | `/trips/[id]/active` | 3 | ☐ | ☐ |
| SCR-017 | Trip List | `/trips` | 3 | ☐ | ☐ |
| SCR-018 | Trip Details | `/trips/[id]` | 3 | ☐ | ☐ |
| SCR-019 | Start Trip | `/trips/start` | 3 | ☐ | ☐ |
| SCR-020 | End Trip | `/trips/[id]/end` | 3 | ☐ | ☐ |
| SCR-021 | Edit Trip | `/trips/[id]/edit` | 3 | ☐ | ☐ |
| SCR-022 | Duplicate Trip | `/trips/duplicate/[id]` | 3 | ☐ | ☐ |
| SCR-023 | Receipt Capture | `/expenses/scan` | 4 | ☐ | ☐ |
| SCR-024 | Receipt Review | `/expenses/scan/review` | 4 | ☐ | ☐ |
| SCR-025 | Receipt Details | `/expenses/receipts/[id]` | 4 | ☐ | ☐ |
| SCR-026 | Receipt Gallery | `/expenses/receipts` | 4 | ☐ | ☐ |
| SCR-027 | Expense List | `/expenses` | 4 | ☐ | ☐ |
| SCR-028 | Expense Detail | `/expenses/[id]` | 4 | ☐ | ☐ |
| SCR-029 | Attach Receipt to Trip | `/expenses/attach` | 4 | ☐ | ☐ |
| SCR-030 | Reports Home | `/reports` | 5 | ☐ | ☐ |
| SCR-031 | Report Builder | `/reports/build` | 5 | ☐ | ☐ |
| SCR-032 | Report Viewer | `/reports/[id]` | 5 | ☐ | ☐ |
| SCR-033 | Business List | `/business` | 2 | ☐ | ☐ |
| SCR-034 | Business Profile | `/business/[id]` | 2 | ☐ | ☐ |
| SCR-035 | Vehicle List | `/vehicles` | 2 | ☐ | ☐ |
| SCR-036 | Vehicle Details | `/vehicles/[id]` | 2 | ☐ | ☐ |
| SCR-037 | Client Directory | `/clients` | 2 | ☐ | ☐ |
| SCR-038 | Client Detail | `/clients/[id]` | 2 | ☐ | ☐ |
| SCR-039 | Project Detail | `/clients/[id]/projects/[pid]` | 2 | ☐ | ☐ |
| SCR-040 | AI Suggestions | `/ai/suggestions` | 4 | ☐ | ☐ |
| SCR-041 | AI History | `/ai/history` | 4 | ☐ | ☐ |
| SCR-042 | Notification Center | `/notifications` | 7 | ☐ | ☐ |
| SCR-043 | Global Search | `/search` | 3 | ☐ | ☐ |
| SCR-044 | Subscription | `/settings/billing` | 6 | ☐ | ☐ |
| SCR-045 | Usage Dashboard | `/settings/usage` | 6 | ☐ | ☐ |
| SCR-046 | Settings Home | `/settings` | 7 | ☐ | ☐ |
| SCR-047 | Account | `/settings/account` | 7 | ☐ | ☐ |
| SCR-048 | Appearance | `/settings/appearance` | 7 | ☐ | ☐ |
| SCR-049 | Security | `/settings/security` | 7 | ☐ | ☐ |
| SCR-050 | Data & Privacy | `/settings/privacy` | 7 | ☐ | ☐ |
| SCR-051 | Help Center | `/help` | 7 | ☐ | ☐ |
| SCR-052 | Contact Support | `/help/contact` | 7 | ☐ | ☐ |
| SCR-053 | Admin Dashboard | `/admin` | 7 | ☐ | ☐ |
| SCR-054 | User Detail (Admin) | `/admin/users/[id]` | 7 | ☐ | ☐ |
| SCR-055 | System Health | `/admin/health` | 7 | ☐ | ☐ |
| SCR-056 | Add Sheet | modal | 2 | ☐ | ☐ |
| SCR-057 | Delete Confirmation | modal | 3 | ☐ | ☐ |
| SCR-058 | Upgrade Modal | modal | 6 | ☐ | ☐ |
| SCR-059 | Expense Categories | `/settings/categories` | 7 | ☐ | ☐ |
| SCR-060 | Mileage Rates | `/settings/mileage-rates` | 2 | ☐ | ☐ |

## PR convention

```
SCR-IDs: SCR-019, SCR-021
```

## Status legend

| Symbol | Meaning |
|--------|---------|
| ☐ | Not started |
| ◐ | In progress |
| ☑ | Dev complete |
| ✓ | QA passed |
