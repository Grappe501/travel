# API ID Catalog — API-INDEX

**Source of truth for API implementation tracking.**  
Canonical specs: [Volume 12 — API Architecture](../blueprint/12-api-architecture.md)

PR convention: `API-IDs: API-TRIP-001, API-TRIP-002`

**Audit date:** STEP-052 (2026-06-25) — V1 implements Next.js Route Handlers under `apps/web/src/app/api/**` (not Supabase Edge Functions). Paths below note the **V1 app route** where it differs from the Volume 12 catalog.

| API-ID | Name | Method | Path / Resource | V1 app route | Module | Auth | Dev | Tests | Docs |
|--------|------|--------|-----------------|--------------|--------|------|-----|-------|------|
| API-AUTH-001 | Register | POST | auth.signUp | Supabase client `/signup` | auth | anon | ☑ | ◐ | ☑ |
| API-AUTH-002 | Login | POST | auth.signIn | Supabase client `/login` | auth | anon | ☑ | ◐ | ☑ |
| API-AUTH-003 | Logout | POST | auth.signOut | Supabase client | auth | user | ☑ | ☐ | ☑ |
| API-AUTH-004 | Refresh Session | POST | auth.refresh | middleware SSR | auth | user | ☑ | ☐ | ☑ |
| API-AUTH-005 | Verify Email | POST | auth.resend | `/auth/verify-email` | auth | user | ☑ | ☐ | ☑ |
| API-AUTH-006 | Forgot Password | POST | auth.resetEmail | `/auth/forgot-password` | auth | anon | ☑ | ☐ | ☑ |
| API-AUTH-007 | Reset Password | POST | auth.updateUser | `/auth/reset-password` | auth | user | ☑ | ☐ | ☑ |
| API-AUTH-008 | Current User | GET | profiles | `ensureUserProfile` + session | auth | user | ☑ | ◐ | ☑ |
| API-AUTH-009 | Update Profile | PATCH | profiles | — | auth | user | ☐ | ☐ | ☑ |
| API-SUB-001 | Current Plan | GET | subscriptions | billing page + services | billing | user | ☑ | ☑ | ☑ |
| API-SUB-002 | Usage | GET | usage_counters | `GET /api/usage` | billing | user | ☑ | ☑ | ☑ |
| API-SUB-003 | Checkout | POST | create-checkout | `POST /api/stripe/checkout` | billing | user | ☑ | ◐ | ☑ |
| API-SUB-004 | Billing Portal | POST | billing-portal | `POST /api/stripe/portal` | billing | user | ☑ | ◐ | ☑ |
| API-SUB-005 | Stripe Webhook | POST | stripe-webhook | `POST /api/stripe/webhook` | billing | stripe | ☑ | ☑ | ☑ |
| API-LIM-001 | Check Limits | GET | check-limits | service-layer on write paths | billing | user | ☑ | ☑ | ☑ |
| API-BIZ-001 | List Businesses | GET | businesses | `GET /api/businesses` | business | user | ☑ | ◐ | ☑ |
| API-BIZ-002 | Create Business | POST | businesses | `POST /api/businesses` | business | user | ☑ | ◐ | ☑ |
| API-BIZ-003 | Update Business | PATCH | businesses | `PATCH /api/businesses/[id]` | business | user | ☑ | ☐ | ☑ |
| API-VEH-001 | List Vehicles | GET | vehicles | `GET /api/vehicles` | vehicle | user | ☑ | ◐ | ☑ |
| API-VEH-002 | Create Vehicle | POST | vehicles | `POST /api/vehicles` | vehicle | user | ☑ | ◐ | ☑ |
| API-VEH-003 | Update Vehicle | PATCH | vehicles | `PATCH /api/vehicles/[id]` | vehicle | user | ☑ | ☐ | ☑ |
| API-VEH-004 | Odometer History | GET | vehicle_odometer_history | — | vehicle | user | ☐ | ☐ | ☑ |
| API-CLI-001 | List Clients | GET | clients | `GET /api/clients` | client | user | ☑ | ☑ | ☑ |
| API-CLI-002 | Create Client | POST | clients | `POST /api/clients` | client | user | ☑ | ☑ | ☑ |
| API-CLI-003 | Update Client | PATCH | clients | `PATCH /api/clients/[id]` | client | user | ☑ | ☐ | ☑ |
| API-PRJ-001 | List Projects | GET | projects | `GET /api/projects` | project | user | ☑ | ☑ | ☑ |
| API-PRJ-002 | Create Project | POST | projects | `POST /api/projects` | project | user | ☑ | ☑ | ☑ |
| API-TRIP-001 | Start Trip | POST | trips | `POST /api/trips/start` | trip | user | ☑ | ☑ | ☑ |
| API-TRIP-002 | End Trip | PATCH | complete_trip RPC | `POST /api/trips/[id]/end` | trip | user | ☑ | ☑ | ☑ |
| API-TRIP-003 | Edit Trip | PATCH | trips | `PATCH /api/trips/[id]` | trip | user | ☑ | ☑ | ☑ |
| API-TRIP-004 | Delete Trip | PATCH | trips soft-delete | — | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-005 | Duplicate Trip | POST | duplicate_trip RPC | — | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-006 | Trip Details | GET | trips+embed | `GET /api/trips/[id]` | trip | user | ☑ | ☑ | ☑ |
| API-TRIP-007 | List Trips | GET | trips | `GET /api/trips` | trip | user | ☑ | ☑ | ☑ |
| API-TRIP-008 | Trip Timeline | GET | business_events | — | trip | user | ☐ | ☐ | ☑ |
| API-RCP-001 | Upload Receipt | POST | storage+receipts | `POST /api/receipts/upload` | receipt | user | ☑ | ☑ | ☑ |
| API-RCP-002 | OCR Process | POST | process-receipt | `POST /api/receipts/[id]/ocr` | receipt | user | ☑ | ◐ | ☑ |
| API-RCP-003 | OCR Status | GET | ocr_results | `GET /api/receipts/[id]/ocr` | receipt | user | ☑ | ◐ | ☑ |
| API-RCP-004 | OCR Retry | POST | process-receipt | `POST /api/receipts/[id]/ocr` | receipt | user | ☑ | ◐ | ☑ |
| API-RCP-005 | Review Receipt | PATCH | receipts+expenses | `POST /api/receipts/[id]/approve` | receipt | user | ☑ | ◐ | ☑ |
| API-RCP-006 | List Receipts | GET | receipts | `GET /api/receipts` | receipt | user | ☑ | ◐ | ☑ |
| API-RCP-007 | Link to Trip | PATCH | expenses | `POST /api/receipts/[id]/attach` | receipt | user | ☑ | ☑ | ☑ |
| API-EXP-001 | Add Expense | POST | expenses | `POST /api/expenses` | expense | user | ☑ | ☑ | ☑ |
| API-EXP-002 | Edit Expense | PATCH | expenses | `PATCH /api/expenses/[id]` | expense | user | ☑ | ☑ | ☑ |
| API-EXP-003 | Delete Expense | PATCH | expenses | `DELETE /api/expenses/[id]` | expense | user | ☑ | ☑ | ☑ |
| API-EXP-004 | List Expenses | GET | expenses | `GET /api/expenses` | expense | user | ☑ | ☑ | ☑ |
| API-MLG-001 | Current Rate | GET | mileage_rates | `GET /api/settings/mileage` | mileage | user | ☑ | ☐ | ☑ |
| API-MLG-002 | Update Rate | POST | mileage_rates | `PATCH /api/settings/mileage` | mileage | user | ☑ | ☐ | ☑ |
| API-MLG-003 | Calculate Reimbursement | POST | verify RPC | trip service | mileage | user | ☑ | ☑ | ☑ |
| API-RPT-001 | Generate Report | POST | generate-report | `POST /api/reports` | report | user | ☑ | ☑ | ☑ |
| API-RPT-002 | Report Status | GET | reports | `GET /api/reports/[id]` | report | user | ☑ | ☑ | ☑ |
| API-RPT-003 | Download Report | GET | signed URL | `GET /api/reports/[id]/download` | report | user | ☑ | ☑ | ☑ |
| API-RPT-004 | List Reports | GET | reports | `GET /api/reports` (via POST list) | report | user | ☑ | ☑ | ☑ |
| API-DSH-001 | Dashboard Summary | GET | dashboard_summary RPC | `/dashboard` server page | dashboard | user | ☑ | ◐ | ☑ |
| API-DSH-002 | Recent Activity | GET | business_events | — | dashboard | user | ☐ | ☐ | ☑ |
| API-DSH-003 | AI Insights | GET | ai-suggestions | `GET /api/ai/history` | dashboard | user | ☑ | ☐ | ☑ |
| API-NOT-001 | List Notifications | GET | notifications | — | notification | user | ☐ | ☐ | ☑ |
| API-NOT-002 | Mark Read | PATCH | notifications | — | notification | user | ☐ | ☐ | ☑ |
| API-NOT-003 | Preferences | PATCH | profiles | — | notification | user | ☐ | ☐ | ☑ |
| API-SRH-001 | Unified Search | GET | search | `GET /api/search` | search | user | ☑ | ☐ | ☑ |
| API-AI-001 | Category Suggestion | POST | suggest-category | `POST /api/receipts/[id]/suggest-category` | ai | user | ☑ | ☑ | ☑ |
| API-AI-002 | Duplicate Detection | POST | check-duplicate | `POST /api/receipts/[id]/check-duplicate` | ai | user | ☑ | ☑ | ☑ |
| API-AI-003 | AI Feedback | POST | ai_interaction_log | `POST /api/ai/feedback` | ai | user | ☑ | ☑ | ☑ |
| API-EXP-010 | Account Export | POST | export-account | `POST /api/export/account` | export | user | ☑ | ☐ | ☑ |
| API-FIL-001 | Signed URL | POST | storage | `GET /api/receipts/[id]/file` | file | user | ☑ | ◐ | ☑ |
| API-FIL-002 | Delete File | DELETE | storage | — | file | user | ☐ | ☐ | ☑ |
| API-ADM-001 | User Lookup | GET | admin RPC | `GET /api/admin/users?email=` | admin | admin | ☑ | ☑ | ☑ |
| API-ADM-002 | System Health | GET | health | `GET /api/admin/health` | admin | admin | ☑ | ☐ | ☑ |
| API-HLT-001 | App Health | GET | health | `GET /health` | health | internal | ☑ | ☑ | ☑ |

**Onboarding (V1):** `GET/POST /api/onboarding/status|complete|skip` — not in Volume 12 catalog; covered by SCR-008.

**V1 summary:** 52 Dev ☑ · 34 Tests ☑ · 28 Tests ◐ · 19 not implemented (post-V1.2)

**Tests legend:** ☑ = unit, integration, or SEC test; ◐ = E2E or partial coverage.
