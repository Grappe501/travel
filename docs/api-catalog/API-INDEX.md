# API ID Catalog — API-INDEX

**Source of truth for API implementation tracking.**  
Canonical specs: [Volume 12 — API Architecture](../blueprint/12-api-architecture.md)

PR convention: `API-IDs: API-TRIP-001, API-TRIP-002`

| API-ID | Name | Method | Path / Resource | Module | Auth | Dev | Tests | Docs |
|--------|------|--------|-----------------|--------|------|-----|-------|------|
| API-AUTH-001 | Register | POST | auth.signUp | auth | anon | ☐ | ☐ | ☑ |
| API-AUTH-002 | Login | POST | auth.signIn | auth | anon | ☐ | ☐ | ☑ |
| API-AUTH-003 | Logout | POST | auth.signOut | auth | user | ☐ | ☐ | ☑ |
| API-AUTH-004 | Refresh Session | POST | auth.refresh | auth | user | ☐ | ☐ | ☑ |
| API-AUTH-005 | Verify Email | POST | auth.resend | auth | user | ☐ | ☐ | ☑ |
| API-AUTH-006 | Forgot Password | POST | auth.resetEmail | auth | anon | ☐ | ☐ | ☑ |
| API-AUTH-007 | Reset Password | POST | auth.updateUser | auth | user | ☐ | ☐ | ☑ |
| API-AUTH-008 | Current User | GET | profiles | auth | user | ☐ | ☐ | ☑ |
| API-AUTH-009 | Update Profile | PATCH | profiles | auth | user | ☐ | ☐ | ☑ |
| API-SUB-001 | Current Plan | GET | subscriptions | billing | user | ☐ | ☐ | ☑ |
| API-SUB-002 | Usage | GET | usage_counters | billing | user | ☐ | ☐ | ☑ |
| API-SUB-003 | Checkout | POST | /functions/v1/create-checkout | billing | user | ☐ | ☐ | ☑ |
| API-SUB-004 | Billing Portal | POST | /functions/v1/billing-portal | billing | user | ☐ | ☐ | ☑ |
| API-SUB-005 | Stripe Webhook | POST | /functions/v1/stripe-webhook | billing | stripe | ☐ | ☐ | ☑ |
| API-LIM-001 | Check Limits | GET | /functions/v1/check-limits | billing | user | ☐ | ☐ | ☑ |
| API-BIZ-001 | List Businesses | GET | businesses | business | user | ☐ | ☐ | ☑ |
| API-BIZ-002 | Create Business | POST | businesses | business | user | ☐ | ☐ | ☑ |
| API-BIZ-003 | Update Business | PATCH | businesses | business | user | ☐ | ☐ | ☑ |
| API-VEH-001 | List Vehicles | GET | vehicles | vehicle | user | ☐ | ☐ | ☑ |
| API-VEH-002 | Create Vehicle | POST | vehicles | vehicle | user | ☐ | ☐ | ☑ |
| API-VEH-003 | Update Vehicle | PATCH | vehicles | vehicle | user | ☐ | ☐ | ☑ |
| API-VEH-004 | Odometer History | GET | vehicle_odometer_history | vehicle | user | ☐ | ☐ | ☑ |
| API-CLI-001 | List Clients | GET | clients | client | user | ☐ | ☐ | ☑ |
| API-CLI-002 | Create Client | POST | clients | client | user | ☐ | ☐ | ☑ |
| API-CLI-003 | Update Client | PATCH | clients | client | user | ☐ | ☐ | ☑ |
| API-PRJ-001 | List Projects | GET | projects | project | user | ☐ | ☐ | ☑ |
| API-PRJ-002 | Create Project | POST | projects | project | user | ☐ | ☐ | ☑ |
| API-TRIP-001 | Start Trip | POST | trips | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-002 | End Trip | PATCH | complete_trip RPC | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-003 | Edit Trip | PATCH | trips | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-004 | Delete Trip | PATCH | trips soft-delete | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-005 | Duplicate Trip | POST | duplicate_trip RPC | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-006 | Trip Details | GET | trips+embed | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-007 | List Trips | GET | trips | trip | user | ☐ | ☐ | ☑ |
| API-TRIP-008 | Trip Timeline | GET | business_events | trip | user | ☐ | ☐ | ☑ |
| API-RCP-001 | Upload Receipt | POST | storage+receipts | receipt | user | ☐ | ☐ | ☑ |
| API-RCP-002 | OCR Process | POST | /functions/v1/process-receipt | receipt | user | ☐ | ☐ | ☑ |
| API-RCP-003 | OCR Status | GET | ocr_results | receipt | user | ☐ | ☐ | ☑ |
| API-RCP-004 | OCR Retry | POST | /functions/v1/process-receipt | receipt | user | ☐ | ☐ | ☑ |
| API-RCP-005 | Review Receipt | PATCH | receipts+expenses | receipt | user | ☐ | ☐ | ☑ |
| API-RCP-006 | List Receipts | GET | receipts | receipt | user | ☐ | ☐ | ☑ |
| API-RCP-007 | Link to Trip | PATCH | expenses | receipt | user | ☐ | ☐ | ☑ |
| API-EXP-001 | Add Expense | POST | expenses | expense | user | ☐ | ☐ | ☑ |
| API-EXP-002 | Edit Expense | PATCH | expenses | expense | user | ☐ | ☐ | ☑ |
| API-EXP-003 | Delete Expense | PATCH | expenses | expense | user | ☐ | ☐ | ☑ |
| API-EXP-004 | List Expenses | GET | expenses | expense | user | ☐ | ☐ | ☑ |
| API-MLG-001 | Current Rate | GET | mileage_rates | mileage | user | ☐ | ☐ | ☑ |
| API-MLG-002 | Update Rate | POST | mileage_rates | mileage | user | ☐ | ☐ | ☑ |
| API-MLG-003 | Calculate Reimbursement | POST | verify RPC | mileage | user | ☐ | ☐ | ☑ |
| API-RPT-001 | Generate Report | POST | /functions/v1/generate-report | report | user | ☐ | ☐ | ☑ |
| API-RPT-002 | Report Status | GET | reports | report | user | ☐ | ☐ | ☑ |
| API-RPT-003 | Download Report | GET | signed URL | report | user | ☐ | ☐ | ☑ |
| API-RPT-004 | List Reports | GET | reports | report | user | ☐ | ☐ | ☑ |
| API-DSH-001 | Dashboard Summary | GET | dashboard_summary RPC | dashboard | user | ☐ | ☐ | ☑ |
| API-DSH-002 | Recent Activity | GET | business_events | dashboard | user | ☐ | ☐ | ☑ |
| API-DSH-003 | AI Insights | GET | /functions/v1/ai-suggestions | dashboard | user | ☐ | ☐ | ☑ |
| API-NOT-001 | List Notifications | GET | notifications | notification | user | ☐ | ☐ | ☑ |
| API-NOT-002 | Mark Read | PATCH | notifications | notification | user | ☐ | ☐ | ☑ |
| API-NOT-003 | Preferences | PATCH | profiles | notification | user | ☐ | ☐ | ☑ |
| API-SRH-001 | Unified Search | GET | /functions/v1/search | search | user | ☐ | ☐ | ☑ |
| API-AI-001 | Category Suggestion | POST | /functions/v1/suggest-category | ai | user | ☐ | ☐ | ☑ |
| API-AI-002 | Duplicate Detection | POST | /functions/v1/check-duplicate | ai | user | ☐ | ☐ | ☑ |
| API-AI-003 | AI Feedback | POST | ai_interaction_log | ai | user | ☐ | ☐ | ☑ |
| API-EXP-010 | Account Export | POST | /functions/v1/export-account | export | user | ☐ | ☐ | ☑ |
| API-FIL-001 | Signed URL | POST | storage | file | user | ☐ | ☐ | ☑ |
| API-FIL-002 | Delete File | DELETE | storage | file | user | ☐ | ☐ | ☑ |
| API-ADM-001 | User Lookup | GET | admin RPC | admin | admin | ☐ | ☐ | ☑ |
| API-ADM-002 | System Health | GET | /functions/v1/health | admin | admin | ☐ | ☐ | ☑ |
| API-HLT-001 | App Health | GET | /functions/v1/health | health | internal | ☐ | ☐ | ☑ |
