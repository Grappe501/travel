# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 11 — Complete Screen Bible & Application Experience Atlas

**Version 1.0**

---

## Who This Document Is For

Volume 11 is the **Screen Bible** — where the application comes to life before a single feature route is coded. Volumes 0–10 define philosophy, architecture, and components. Volume 11 defines **every screen** so development becomes **assembling a finished blueprint**, not inventing interfaces on the fly.

| Role | Use this volume to… |
|------|---------------------|
| **Engineers** | Implement routes from SCR specs — no design guessing |
| **Designers** | Wireframe against locked screen definitions |
| **QA** | Test matrices per SCR-ID (Volume 9) |
| **Product** | Track implementation via inventory matrix (Ch. 23) |
| **AI agents** | Build screens by SCR-ID + Volume 10 components |

**Related:** [Volume 2 — Journeys](02-user-experience.md) · [Volume 3 — FRs](03-functional-requirements.md) · [Volume 10 — Components](10-design-system.md)

Volume 2 owns **journeys and navigation**; Volume 11 owns **per-screen specifications**. Volume 10 owns **component definitions**.

---

## Screen ID Catalog

Every screen has a permanent **SCR-ID** referenced across requirements, tests, analytics, and commits.

| SCR-ID | Screen | Route | Wave |
|--------|--------|-------|------|
| SCR-001 | Splash | `/` | 1 |
| SCR-002 | Welcome | `/welcome` | 1 |
| SCR-003 | Sign In | `/auth/login` | 1 |
| SCR-004 | Create Account | `/auth/signup` | 1 |
| SCR-005 | Verify Email | `/auth/verify` | 1 |
| SCR-006 | Forgot Password | `/auth/forgot` | 1 |
| SCR-007 | Reset Password | `/auth/reset` | 1 |
| SCR-008 | Welcome Tour | `/onboarding` | 1 |
| SCR-009 | Subscription Selection | `/onboarding/plan` | 1 |
| SCR-010 | Create Business | `/onboarding/business` | 1 |
| SCR-011 | Add Vehicle | `/onboarding/vehicle` | 1 |
| SCR-012 | Mileage Rate Setup | `/onboarding/rate` | 1 |
| SCR-013 | Permissions | `/onboarding/permissions` | 1 |
| SCR-014 | First Trip Tutorial | `/onboarding/first-trip` | 1 |
| SCR-015 | Dashboard Home | `/dashboard` | 2 |
| SCR-016 | Active Trip Dashboard | `/trips/[id]/active` | 3 |
| SCR-017 | Trip List | `/trips` | 3 |
| SCR-018 | Trip Details | `/trips/[id]` | 3 |
| SCR-019 | Start Trip | `/trips/start` | 3 |
| SCR-020 | End Trip | `/trips/[id]/end` | 3 |
| SCR-021 | Edit Trip | `/trips/[id]/edit` | 3 |
| SCR-022 | Duplicate Trip | `/trips/duplicate/[id]` | 3 |
| SCR-023 | Receipt Capture | `/expenses/scan` | 4 |
| SCR-024 | Receipt Review | `/expenses/scan/review` | 4 |
| SCR-025 | Receipt Details | `/expenses/receipts/[id]` | 4 |
| SCR-026 | Receipt Gallery | `/expenses/receipts` | 4 |
| SCR-027 | Expense List | `/expenses` | 4 |
| SCR-028 | Expense Detail | `/expenses/[id]` | 4 |
| SCR-029 | Attach Receipt to Trip | `/expenses/attach` | 4 |
| SCR-030 | Reports Home | `/reports` | 5 |
| SCR-031 | Report Builder | `/reports/build` | 5 |
| SCR-032 | Report Viewer | `/reports/[id]` | 5 |
| SCR-033 | Business List | `/business` | 2 |
| SCR-034 | Business Profile | `/business/[id]` | 2 |
| SCR-035 | Vehicle List | `/vehicles` | 2 |
| SCR-036 | Vehicle Details | `/vehicles/[id]` | 2 |
| SCR-037 | Client Directory | `/clients` | 2 |
| SCR-038 | Client Detail | `/clients/[id]` | 2 |
| SCR-039 | Project Detail | `/clients/[id]/projects/[pid]` | 2 |
| SCR-040 | AI Suggestions | `/ai/suggestions` | 4 |
| SCR-041 | AI History | `/ai/history` | 4 |
| SCR-042 | Notification Center | `/notifications` | 7 |
| SCR-043 | Global Search | `/search` | 3 |
| SCR-044 | Subscription | `/settings/billing` | 6 |
| SCR-045 | Usage Dashboard | `/settings/usage` | 6 |
| SCR-046 | Settings Home | `/settings` | 7 |
| SCR-047 | Account | `/settings/account` | 7 |
| SCR-048 | Appearance | `/settings/appearance` | 7 |
| SCR-049 | Security | `/settings/security` | 7 |
| SCR-050 | Data & Privacy | `/settings/privacy` | 7 |
| SCR-051 | Help Center | `/help` | 7 |
| SCR-052 | Contact Support | `/help/contact` | 7 |
| SCR-053 | Admin Dashboard | `/admin` | 7 |
| SCR-054 | User Detail (Admin) | `/admin/users/[id]` | 7 |
| SCR-055 | System Health | `/admin/health` | 7 |
| SCR-056 | Add Sheet | modal | 2 |
| SCR-057 | Delete Confirmation | modal | 3 |
| SCR-058 | Upgrade Modal | modal | 6 |
| SCR-059 | Expense Categories | `/settings/categories` | 7 |
| SCR-060 | Mileage Rates | `/settings/mileage-rates` | 2 |

**Total V1 screens + modals:** 60 SCR-IDs

Companion tracker (implementation status): `docs/screen-catalog/SCR-INDEX.md` (create Phase A).

---

# Chapter 1 — Purpose

This document defines **every screen** in the application.

Every screen specification includes:

| Field | Description |
|-------|-------------|
| Purpose | Why the screen exists |
| Audience | Who sees it |
| Route / URL | Next.js path |
| Primary action | One main CTA |
| Secondary actions | Supporting actions |
| Components | Volume 10 component list |
| Data required | API / Supabase queries |
| Empty state | Component + copy |
| Loading state | Skeleton / spinner |
| Error state | Recovery path |
| Mobile layout | Phone behavior |
| Tablet layout | 768px+ behavior |
| Desktop layout | 1024px+ behavior |
| Accessibility | A11y requirements |
| Analytics events | Entry, exit, completion |
| AI interactions | If applicable |
| Related screens | Navigation graph |
| FR references | Volume 3 IDs |

**No screen is built without first being documented here.**

---

# Chapter 2 — Global Screen Standards

Every screen follows:

| Standard | Rule |
|----------|------|
| Header | `TopBar` — back button on sub-screens; business selector on Dashboard/Trips |
| Navigation | `BottomNav` (mobile) / `SidebarNav` (≥768px) except auth & onboarding |
| Spacing | Volume 10 spacing scale only |
| Primary action | **One** per screen; bottom-fixed on mobile forms |
| Responsive | Document all three layouts per screen |
| Offline | `OfflineBanner` when disconnected; queue writes |
| Themes | Light + dark — no screen ships in one theme only |
| Keyboard | Web: full tab order; `/` opens search where applicable |
| Labels | Accessible names on all controls |
| Loading | Skeleton for content; spinner for actions < 2s |
| Error | Explain + recover — never dead end |
| Active trip | `ActiveTripBanner` on all authenticated main screens when trip in progress |

---

# Chapter 3 — Authentication Experience

## SCR-001 — Splash Screen

| Field | Specification |
|-------|---------------|
| **Purpose** | Brand moment while auth session resolves |
| **Audience** | All visitors |
| **Route** | `/` |
| **Primary action** | None — auto-transition |
| **Secondary** | None |
| **Components** | Logo, `Spinner`, tagline text |
| **Data** | `supabase.auth.getSession()` |
| **Empty** | N/A |
| **Loading** | Centered logo + indeterminate spinner |
| **Error** | After 5s timeout → SCR-002 Welcome |
| **Mobile** | Full viewport centered |
| **Tablet/Desktop** | Same, max-width logo 200px |
| **A11y** | `role="status"` "Loading application" |
| **Analytics** | `screen_view` { scr: SCR-001 } |
| **AI** | None |
| **Related** | → SCR-015 (session) · SCR-002 (no session) · SCR-005 (unverified) |
| **FR** | FR-002 |

**Transition:** Session valid + verified → Dashboard. Session valid + unverified → SCR-005. No session → SCR-002. Max display 2s.

---

## SCR-002 — Welcome

| Field | Specification |
|-------|---------------|
| **Purpose** | Value proposition; entry to auth |
| **Audience** | Unauthenticated visitors |
| **Route** | `/welcome` |
| **Primary action** | Create Account → SCR-004 |
| **Secondary** | Sign In → SCR-003 · Learn More → external/marketing |
| **Components** | Hero illustration, `PrimaryButton`, `SecondaryButton`, `GhostButton` |
| **Data** | None |
| **Empty** | N/A |
| **Loading** | N/A |
| **Error** | N/A |
| **Mobile** | Stacked CTAs, full-width buttons |
| **Tablet** | Split: illustration left, CTAs right |
| **Desktop** | Centered card max 480px |
| **A11y** | Headings hierarchy h1 → h2 |
| **Analytics** | `welcome_view` · `cta_signup_tap` · `cta_signin_tap` |
| **Related** | SCR-003, SCR-004 |

**Copy:** "Document every mile. Capture every receipt. Export in seconds."

---

## SCR-003 — Sign In

| Field | Specification |
|-------|---------------|
| **Purpose** | Authenticate returning users |
| **Route** | `/auth/login` |
| **Primary action** | Sign In |
| **Secondary** | Forgot password → SCR-006 · Create account link → SCR-004 |
| **Components** | `TextInput` (email), `TextInput` (password), `Checkbox` (remember me), `PrimaryButton`, `FormField` |
| **Data** | `supabase.auth.signInWithPassword` |
| **Validation** | Email format; password required; inline on blur |
| **Empty** | Default form |
| **Loading** | `LoadingButton` on submit |
| **Error** | Invalid credentials — inline `AlertError`; rate limit — banner |
| **Mobile** | Full-width; keyboard-safe scroll |
| **Tablet/Desktop** | Centered card 480px |
| **A11y** | Labels linked; error announced |
| **Analytics** | `signin_start` · `signin_success` · `signin_failure` { reason } |
| **FR** | FR-002 |
| **Related** | → SCR-015 on success · SCR-008 if onboarding incomplete |

---

## SCR-004 — Create Account

| Field | Specification |
|-------|---------------|
| **Purpose** | Register new user with minimal friction |
| **Route** | `/auth/signup` |
| **Primary action** | Create Account |
| **Secondary** | Sign In link → SCR-003 |
| **Components** | `TextInput` name, email, password, `Checkbox` terms, `PrimaryButton` |
| **Data** | `signUp` + create `profiles` row via trigger |
| **Validation** | Email unique; password ≥ 8 chars; terms required |
| **Loading** | Button spinner |
| **Error** | Email taken; weak password — inline |
| **Mobile/Desktop** | Same as SCR-003 |
| **Analytics** | `signup_start` · `signup_complete` |
| **FR** | FR-001 |
| **Related** | → SCR-005 Verify Email |

---

## SCR-005 — Verify Email

| Field | Specification |
|-------|---------------|
| **Purpose** | Explain verification requirement |
| **Route** | `/auth/verify` |
| **Primary action** | Resend verification email |
| **Secondary** | Change email → SCR-047 · Sign out |
| **Components** | `AlertInfo`, `PrimaryButton`, `GhostButton` |
| **Data** | Auth user email; resend via Supabase |
| **Error** | Resend rate limit — toast |
| **Analytics** | `verify_email_view` · `verify_resend` |
| **FR** | FR-001 |
| **Related** | → SCR-008 after verified + first login |

---

## SCR-006 — Forgot Password

| Field | Specification |
|-------|---------------|
| **Purpose** | Initiate password reset |
| **Route** | `/auth/forgot` |
| **Primary action** | Send reset link |
| **Secondary** | Back to Sign In |
| **Components** | `TextInput` email, `PrimaryButton`, `AlertInfo` (next steps) |
| **Data** | `resetPasswordForEmail` |
| **Success** | Confirmation message — same screen, no account enumeration |
| **Analytics** | `password_reset_request` |
| **FR** | FR-002 |
| **Related** | Email link → SCR-007 |

---

## SCR-007 — Reset Password

| Field | Specification |
|-------|---------------|
| **Purpose** | Set new password from email token |
| **Route** | `/auth/reset?token=…` |
| **Primary action** | Update Password |
| **Components** | Password + confirm fields, `PrimaryButton` |
| **Validation** | Match confirm; min length |
| **Error** | Expired token → link to SCR-006 |
| **Related** | → SCR-003 on success |

---

# Chapter 4 — First-Time User Experience

## SCR-008 — Welcome Tour

| Field | Specification |
|-------|---------------|
| **Purpose** | Introduce trips, receipts, reports, AI in ≤ 4 panels |
| **Route** | `/onboarding` |
| **Primary action** | Next / Get Started (final panel) |
| **Secondary** | Skip → SCR-010 |
| **Components** | Carousel dots, illustration per panel, `PrimaryButton`, `GhostButton` Skip |
| **Panels** | 1 Trips · 2 Receipts · 3 Reports · 4 AI Copilot |
| **Analytics** | `onboarding_tour_step` { step } · `onboarding_tour_skip` |
| **Related** | → SCR-009 or SCR-010 |

---

## SCR-009 — Subscription Selection

| Field | Specification |
|-------|---------------|
| **Purpose** | Present Free vs Pro; skip allowed |
| **Route** | `/onboarding/plan` |
| **Primary action** | Continue with Free (default) |
| **Secondary** | Upgrade to Pro (Stripe checkout) · Skip |
| **Components** | Plan cards, `PrimaryButton`, feature comparison list |
| **Data** | Stripe prices (test/prod) |
| **FR** | FR-003 |
| **Related** | → SCR-010 |

---

## SCR-010 — Create Business

| Field | Specification |
|-------|---------------|
| **Purpose** | Minimum viable business setup |
| **Route** | `/onboarding/business` |
| **Primary action** | Continue |
| **Fields** | Business name * only (EIN optional collapsed) |
| **Components** | `TextInput`, `PrimaryButton`, progress indicator |
| **Data** | INSERT `businesses` |
| **Analytics** | `onboarding_business_complete` |
| **FR** | FR-100 |
| **Related** | → SCR-011 · Skip allowed after this screen (Volume 2) |

---

## SCR-011 — Add Vehicle

| Field | Specification |
|-------|---------------|
| **Purpose** | Register default vehicle |
| **Route** | `/onboarding/vehicle` |
| **Primary action** | Continue |
| **Fields** | Nickname * · Make · Model · Starting odometer (optional, collapsed) |
| **Components** | `TextInput`, `MileageInput`, `PrimaryButton` |
| **Data** | INSERT `vehicles` |
| **FR** | FR-200 |
| **Related** | → SCR-012 |

---

## SCR-012 — Mileage Rate Setup

| Field | Specification |
|-------|---------------|
| **Purpose** | Select IRS default or custom rate |
| **Route** | `/onboarding/rate` |
| **Primary action** | Continue |
| **Components** | `RadioGroup`, IRS rate pre-selected, `PrimaryButton` |
| **Data** | `mileage_rates` or business default |
| **FR** | FR-501 |
| **Related** | → SCR-013 |

---

## SCR-013 — Permissions

| Field | Specification |
|-------|---------------|
| **Purpose** | Request camera, notifications, optional location with benefit copy |
| **Route** | `/onboarding/permissions` |
| **Primary action** | Enable Camera (recommended) |
| **Secondary** | Skip each · Continue |
| **Components** | Permission cards with icon + explanation, `PrimaryButton` |
| **Analytics** | `permission_granted` { type } · `permission_denied` |
| **Related** | → SCR-014 or SCR-015 |

---

## SCR-014 — First Trip Tutorial

| Field | Specification |
|-------|---------------|
| **Purpose** | Optional guided practice trip |
| **Route** | `/onboarding/first-trip` |
| **Primary action** | Start Practice Trip → SCR-019 (prefilled hints) |
| **Secondary** | Skip → SCR-015 |
| **Components** | Step hints overlay, `PrimaryButton`, `GhostButton` |
| **Analytics** | `first_trip_tutorial_start` · `first_trip_tutorial_skip` |
| **Related** | → SCR-019 → SCR-016 |

---

# Chapter 5 — Dashboard

## SCR-015 — Dashboard Home

| Field | Specification |
|-------|---------------|
| **Purpose** | Heart of app — summary + quick actions |
| **Audience** | Authenticated users |
| **Route** | `/dashboard` |
| **Primary action** | Start Trip → SCR-019 |
| **Secondary** | Scan Receipt · View Reports · period toggle (day/week/month) |
| **Components** | `TopBar`, `ActiveTripBanner`, `MileageWidget`, `ExpenseWidget`, `MonthlyTotalsWidget`, `RecentTripsWidget` (`TripCard`×5), `PendingReceiptsWidget`, `AIInsightsWidget`, `QuickActionsWidget`, `UpgradeBanner` (Free), `BottomNav` |
| **Data** | Aggregates FR-800; active trip; recent trips; pending receipts; AI suggestions |
| **Empty** | `EmptyTrips` if no history — CTA Start Trip |
| **Loading** | `SkeletonDashboard` |
| **Error** | `NetworkErrorState` + retry |
| **Offline** | Cached aggregates + `OfflineBanner`; stale timestamp shown |
| **Mobile** | Single column widgets |
| **Tablet** | 2-column widget grid |
| **Desktop** | 3-column; sidebar nav |
| **A11y** | Landmark regions; live region for active trip |
| **Analytics** | `dashboard_view` · `dashboard_start_trip_tap` · `period_change` { period } |
| **AI** | `AISuggestionCard` dismissible |
| **FR** | FR-800, FR-1300 |
| **Related** | SCR-016, SCR-017, SCR-019, SCR-030, SCR-056 |

---

## SCR-016 — Active Trip Dashboard

| Field | Specification |
|-------|---------------|
| **Purpose** | Hub for in-progress trip — always easy to resume |
| **Route** | `/trips/[id]/active` |
| **Primary action** | End Trip → SCR-020 |
| **Secondary** | Scan Receipt · Add Expense · Add Note |
| **Components** | Timer display, `VehicleCard` compact, odometer readout, `QuickActionsWidget`, `StickyFooterAction` End Trip, `ReceiptCard` list for trip |
| **Data** | Trip by id; expenses; elapsed time computed client-side |
| **Loading** | Skeleton |
| **Error** | Trip not found / not active → redirect SCR-017 |
| **Mobile** | Full screen; End Trip fixed bottom |
| **Tablet/Desktop** | Two-column: details left, receipts right |
| **Analytics** | `active_trip_view` · `active_trip_end_tap` |
| **AI** | Missing receipt reminder chip |
| **FR** | FR-301 |
| **Related** | SCR-020, SCR-023, SCR-015 |

---

# Chapter 6 — Trips

## SCR-017 — Trip List

| Field | Specification |
|-------|---------------|
| **Purpose** | Searchable timeline of all trips |
| **Route** | `/trips` |
| **Primary action** | Start Trip (header or FAB) |
| **Secondary** | Filter · Search → SCR-043 |
| **Components** | `SearchBar`, filter chips, date section headers, `TripCard` list, swipe actions (edit/archive), `EmptyTrips` |
| **Data** | Trips paginated; filters query params |
| **Loading** | `SkeletonCard`×5 |
| **Offline** | Cached list + sync badge |
| **Mobile** | Swipe left: Edit, Archive |
| **Desktop** | `TripTable` with sort |
| **Analytics** | `trip_list_view` · `trip_filter_applied` |
| **FR** | FR-300+ |
| **Related** | SCR-018, SCR-019, SCR-043 |

---

## SCR-018 — Trip Details

| Field | Specification |
|-------|---------------|
| **Purpose** | Complete record for completed trip |
| **Route** | `/trips/[id]` |
| **Primary action** | Export (trip subset) |
| **Secondary** | Edit · Duplicate · Delete |
| **Components** | Mileage summary header, `ReceiptCard` list, expense breakdown, timeline, notes, `PrimaryButton`, `IconButton` actions |
| **Data** | Trip + expenses + receipts + audit flag if edited |
| **Empty sections** | "No receipts" inline empty |
| **Analytics** | `trip_detail_view` · `trip_export_tap` |
| **FR** | FR-302, FR-303 |
| **Related** | SCR-021, SCR-025, SCR-031 |

---

## SCR-019 — Start Trip

| Field | Specification |
|-------|---------------|
| **Purpose** | Begin new trip — minimal inputs |
| **Route** | `/trips/start` |
| **Primary action** | Start Trip |
| **Fields** | Vehicle * (default) · Starting odometer · Purpose * · Client (optional) |
| **Components** | `SelectDropdown`, `MileageInput`, `TextInput`, `AutocompleteInput`, `StickyFooterAction`, `PrimaryButton` |
| **Validation** | Purpose required; active trip exists → modal; Free tier limit → SCR-058 |
| **Success** | Toast + haptic → SCR-016 |
| **Mobile** | Large Start button bottom |
| **Analytics** | `start_trip_view` · `start_trip_success` { vehicle_id } |
| **AI** | Client autocomplete from history |
| **FR** | FR-300, FR-003, FR-1400 |
| **Related** | SCR-016, SCR-058 |

---

## SCR-020 — End Trip

| Field | Specification |
|-------|---------------|
| **Purpose** | Close trip with mileage calculation and checklist |
| **Route** | `/trips/[id]/end` |
| **Primary action** | Complete Trip (step 3) |
| **Wizard steps** | 1 Closure (odometer, notes) · 2 "Forgot Something?" checklist · 3 Summary |
| **Components** | `EndTripWizard`, `Checkbox` checklist, mileage preview, `PrimaryButton` |
| **Validation** | end odometer ≥ start; show calculated miles before save |
| **Success** | → SCR-018 + toast |
| **Analytics** | `end_trip_step` { step } · `end_trip_complete` { miles } |
| **AI** | Checklist shortcuts to SCR-023 with category preset |
| **FR** | FR-302 |
| **Related** | SCR-016, SCR-018, SCR-023 |

---

## SCR-021 — Edit Trip

| Field | Specification |
|-------|---------------|
| **Purpose** | Modify trip metadata with audit transparency |
| **Route** | `/trips/[id]/edit` |
| **Primary action** | Save Changes |
| **Components** | Same fields as start + `AlertInfo` "Edits are logged" |
| **Data** | UPDATE trip + audit_logs |
| **FR** | FR-303 |
| **Related** | SCR-018, SCR-057 |

---

## SCR-022 — Duplicate Trip

| Field | Specification |
|-------|---------------|
| **Purpose** | Copy metadata to new trip draft |
| **Route** | `/trips/duplicate/[id]` |
| **Primary action** | Create Duplicate Trip |
| **FR** | FR-305 |
| **Related** | → SCR-016 or SCR-019 |

---

# Chapter 7 — Receipts

## SCR-023 — Receipt Capture

| Field | Specification |
|-------|---------------|
| **Purpose** | Launch camera / gallery for receipt image |
| **Route** | `/expenses/scan` |
| **Primary action** | Capture shutter |
| **Secondary** | Gallery pick · Cancel |
| **Components** | `CameraCaptureScreen`, `ReceiptCropOverlay`, flash toggle |
| **Data** | Local blob → Storage on upload |
| **Error** | Permission denied → settings prompt |
| **Offline** | Queue image locally |
| **Analytics** | `receipt_capture_start` · `receipt_capture_success` |
| **FR** | FR-400, FR-1400 |
| **Related** | → SCR-024 |

---

## SCR-024 — Receipt Review

| Field | Specification |
|-------|---------------|
| **Purpose** | Confirm OCR results before save |
| **Route** | `/expenses/scan/review` |
| **Primary action** | Save |
| **Components** | `ReceiptReviewSheet`, `AIReviewPanel`, `ConfidenceBadge`, `CurrencyInput`, category selector, image preview |
| **Fields** | Merchant, date, total *, category *, trip link |
| **Loading** | `OCRProcessingOverlay` |
| **Error** | `OCRErrorState` → manual entry path |
| **AI** | Low confidence highlighted; never auto-save |
| **Analytics** | `ocr_review_view` · `ocr_field_edited` { field } · `ocr_save` |
| **FR** | FR-401, FR-402 |
| **Related** | SCR-016, SCR-025 |

---

## SCR-025 — Receipt Details

| Field | Specification |
|-------|---------------|
| **Purpose** | View/edit saved receipt |
| **Route** | `/expenses/receipts/[id]` |
| **Primary action** | Save (if editing) |
| **Secondary** | View linked trip · Delete |
| **Components** | Image viewer, metadata fields, `AIExplanationTooltip` if AI categorized |
| **FR** | FR-402 |
| **Related** | SCR-018, SCR-028 |

---

## SCR-026 — Receipt Gallery

| Field | Specification |
|-------|---------------|
| **Purpose** | Searchable list of all receipts |
| **Route** | `/expenses/receipts` |
| **Primary action** | Scan Receipt |
| **Filters** | Merchant · Date · Category · Trip |
| **Components** | `SearchBar`, `SearchFilters`, `ReceiptCard` grid/list, `EmptyReceipts` |
| **Mobile** | 2-column grid |
| **Desktop** | `ReceiptTable` |
| **FR** | FR-400 |
| **Related** | SCR-023, SCR-025, SCR-043 |

---

# Chapter 8 — Expenses

## SCR-027 — Expense List

| Field | Specification |
|-------|---------------|
| **Purpose** | All expenses grouped by date/category/trip |
| **Route** | `/expenses` |
| **Primary action** | Add Expense |
| **Components** | Group headers, expense rows, filter toggle |
| **Data** | Expenses with joins |
| **Related** | SCR-028, SCR-029 |

---

## SCR-028 — Expense Detail

| Field | Specification |
|-------|---------------|
| **Purpose** | Edit expense line item |
| **Route** | `/expenses/[id]` |
| **Fields** | Category, amount, notes, linked receipt, trip |
| **Components** | `ExpenseForm`, `CurrencyInput`, receipt link card |
| **FR** | FR-600 |
| **Related** | SCR-025, SCR-018 |

---

## SCR-029 — Attach Receipt to Trip

| Field | Specification |
|-------|---------------|
| **Purpose** | Pick trip when no active trip |
| **Route** | `/expenses/attach` |
| **Components** | `TripCard` selectable list, `PrimaryButton` Attach |
| **FR** | FR-403 |
| **Related** | SCR-024, SCR-017 |

---

# Chapter 9 — Reports

## SCR-030 — Reports Home

| Field | Specification |
|-------|---------------|
| **Purpose** | Report type selection |
| **Route** | `/reports` |
| **Primary action** | Select report type → SCR-031 |
| **Components** | `ReportCard`×5: Mileage, Expense, Combined, Monthly, Annual |
| **Analytics** | `reports_home_view` · `report_type_selected` { type } |
| **FR** | FR-700 |
| **Related** | SCR-031 |

---

## SCR-031 — Report Builder

| Field | Specification |
|-------|---------------|
| **Purpose** | Configure report parameters |
| **Route** | `/reports/build?type=` |
| **Primary action** | Generate Report |
| **Options** | Date range · Vehicle · Business · Client · Employee (V1.1) |
| **Components** | `DateInput` range, `SelectDropdown` filters, preview count estimate |
| **Loading** | Estimate query spinner |
| **Analytics** | `report_build` { type, filters } |
| **FR** | FR-700 |
| **Related** | → SCR-032 |

---

## SCR-032 — Report Viewer

| Field | Specification |
|-------|---------------|
| **Purpose** | Preview and export generated report |
| **Route** | `/reports/[id]` |
| **Primary action** | Download |
| **Secondary** | Share · Print · Email (future) |
| **Components** | `ReportPreview`, `ExportFormatPicker`, `DownloadButton`, `ShareSheet` |
| **Loading** | `ReportGeneratingOverlay` |
| **Error** | Regenerate option |
| **Mobile** | Full-width preview; actions bottom sheet |
| **Desktop** | Preview + action sidebar |
| **Analytics** | `report_view` · `report_download` { format } |
| **FR** | FR-700 |
| **Related** | SCR-030, SCR-018 |

---

# Chapter 10 — Businesses

## SCR-033 — Business List

| Field | Specification |
|-------|---------------|
| **Purpose** | All businesses + active switcher |
| **Route** | `/business` |
| **Primary action** | Add Business |
| **Components** | `BusinessCard` list, active indicator, `PrimaryButton` |
| **FR** | FR-100 |
| **Related** | SCR-034, SCR-015 (context switch) |

---

## SCR-034 — Business Profile

| Field | Specification |
|-------|---------------|
| **Purpose** | Manage business details |
| **Route** | `/business/[id]` |
| **Fields** | Name, address, tax info (optional), default mileage rate |
| **Components** | `TextInput`, `CurrencyInput` rate, `PrimaryButton` Save |
| **FR** | FR-100, FR-501 |
| **Related** | SCR-060, SCR-033 |

---

# Chapter 11 — Vehicles

## SCR-035 — Vehicle List

| Field | Specification |
|-------|---------------|
| **Purpose** | All vehicles with odometer summary |
| **Route** | `/vehicles` |
| **Components** | `VehicleCard`: nickname, current odometer, total miles |
| **FR** | FR-200 |
| **Related** | SCR-036 |

---

## SCR-036 — Vehicle Details

| Field | Specification |
|-------|---------------|
| **Purpose** | Vehicle history and assigned trips |
| **Route** | `/vehicles/[id]` |
| **Components** | Odometer history chart (simple list V1), trip list subset, edit form |
| **Related** | SCR-018, SCR-035 |

---

# Chapter 12 — Clients & Projects

## SCR-037 — Client Directory

| Field | Specification |
|-------|---------------|
| **Purpose** | Searchable client list |
| **Route** | `/clients` |
| **Components** | `SearchBar`, client rows, `EmptyClients` |
| **Related** | SCR-038, SCR-019 autocomplete source |

---

## SCR-038 — Client Detail

| Field | Specification |
|-------|---------------|
| **Purpose** | Client trips, expenses, reports |
| **Route** | `/clients/[id]` |
| **Components** | Contact fields, `TripCard` list, expense summary, generate report CTA |
| **Related** | SCR-031, SCR-039 |

---

## SCR-039 — Project Detail

| Field | Specification |
|-------|---------------|
| **Purpose** | Project-scoped travel summary |
| **Route** | `/clients/[id]/projects/[pid]` |
| **V1** | Basic — trips + expenses grouped |
| **Related** | SCR-038, SCR-032 |

---

# Chapter 13 — AI Copilot

## SCR-040 — AI Suggestions

| Field | Specification |
|-------|---------------|
| **Purpose** | Actionable AI suggestions hub |
| **Route** | `/ai/suggestions` |
| **Primary action** | Accept suggestion (contextual) |
| **Suggestion types** | Unlinked receipt · Active trip reminder · Duplicate warning · Missing receipt |
| **Components** | `AISuggestionPanel`, `ConfidenceBadge`, action buttons |
| **AI** | Each includes brief explanation + clear action |
| **Analytics** | `ai_suggestion_view` · `ai_suggestion_accept` · `ai_suggestion_dismiss` |
| **FR** | FR-1300 |
| **Related** | SCR-015, SCR-024, SCR-041 |

---

## SCR-041 — AI History

| Field | Specification |
|-------|---------------|
| **Purpose** | Review past suggestions and outcomes |
| **Route** | `/ai/history` |
| **Components** | Timeline list: suggestion, accepted/dismissed, timestamp |
| **Data** | `ai_suggestions` + `ai_interaction_log` |
| **FR** | FR-1300 |
| **Related** | SCR-040 |

---

# Chapter 14 — Notifications

## SCR-042 — Notification Center

| Field | Specification |
|-------|---------------|
| **Purpose** | In-app notification hub |
| **Route** | `/notifications` |
| **Categories** | Trips · Receipts · Reports · Billing · System |
| **Components** | `NotificationCenter`, `NotificationListItem`, filter tabs, mark all read |
| **FR** | FR-900 |
| **Related** | SCR-015, SCR-044 |

---

# Chapter 15 — Search

## SCR-043 — Global Search

| Field | Specification |
|-------|---------------|
| **Purpose** | Search across all entities |
| **Route** | `/search?q=` |
| **Scope** | Trips · Receipts · Businesses · Vehicles · Clients · Reports |
| **Components** | `SearchBar`, `RecentSearchList`, `SearchFilters`, `SearchResultsLayout` |
| **Analytics** | `search_query` · `search_result_click` { type } |
| **FR** | FR-1000 |
| **Related** | SCR-017, SCR-026, Volume 2 unified search |

---

# Chapter 16 — Billing

## SCR-044 — Subscription

| Field | Specification |
|-------|---------------|
| **Purpose** | Plan management and upgrade |
| **Route** | `/settings/billing` |
| **Display** | Current plan · renewal · upgrade options |
| **Components** | Plan cards, Stripe portal link, `PrimaryButton` Upgrade |
| **FR** | FR-003 |
| **Related** | SCR-045, SCR-058 |

---

## SCR-045 — Usage Dashboard

| Field | Specification |
|-------|---------------|
| **Purpose** | Visualize Free tier consumption |
| **Route** | `/settings/usage` |
| **Display** | Trips used · Receipts used · remaining allowance |
| **Components** | Progress bars, `UsageMeter`, upgrade CTA |
| **FR** | FR-003 |
| **Related** | SCR-044, SCR-058 |

---

# Chapter 17 — Settings

## SCR-046 — Settings Home

| Field | Specification |
|-------|---------------|
| **Purpose** | Settings category hub |
| **Route** | `/settings` |
| **Categories** | Account · Businesses · Vehicles · Notifications · Appearance · Security · Data · Help |
| **Components** | Grouped list rows with chevrons |
| **Related** | SCR-047–SCR-052, SCR-059, SCR-060 |

---

## SCR-047 — Account

| Field | Specification |
|-------|---------------|
| **Route** | `/settings/account` |
| **Fields** | Name, email, password change |
| **FR** | FR-1700 |
| **Related** | SCR-049 |

---

## SCR-048 — Appearance

| Field | Specification |
|-------|---------------|
| **Route** | `/settings/appearance` |
| **Options** | Light · Dark · System |
| **Components** | `RadioGroup` |
| **Related** | Volume 10 Ch. 31 |

---

## SCR-049 — Security

| Field | Specification |
|-------|---------------|
| **Route** | `/settings/security` |
| **Display** | Active devices · login history · password management |
| **Components** | Session list, revoke buttons |
| **FR** | Volume 8 Ch. 6, 24 |
| **Related** | SCR-047 |

---

## SCR-050 — Data & Privacy

| Field | Specification |
|-------|---------------|
| **Route** | `/settings/privacy` |
| **Actions** | Export data · Request deletion · Privacy settings |
| **Components** | `PrimaryButton` Export, `DangerButton` Delete Account |
| **FR** | FR-1600, FR-1701 |
| **Related** | Export flow modal |

---

# Chapter 18 — Help

## SCR-051 — Help Center

| Field | Specification |
|-------|---------------|
| **Route** | `/help` |
| **Components** | FAQ search, categorized questions, links |
| **Related** | SCR-052 |

---

## SCR-052 — Contact Support

| Field | Specification |
|-------|---------------|
| **Route** | `/help/contact` |
| **Components** | Simple form, optional attachment, `PrimaryButton` Send |
| **Related** | SCR-051 |

---

# Chapter 19 — Administrative Screens

## SCR-053 — Admin Dashboard

| Field | Specification |
|-------|---------------|
| **Purpose** | Internal operations summary |
| **Route** | `/admin` |
| **Audience** | Support / admin role only |
| **Display** | Users · revenue · OCR health · AI health · billing · support queue |
| **Components** | Metric cards, charts (simple) |
| **Security** | RBAC + audit (Volume 8 Ch. 29) |
| **Related** | SCR-054, SCR-055 |

---

## SCR-054 — User Detail (Admin)

| Field | Specification |
|-------|---------------|
| **Route** | `/admin/users/[id]` |
| **Display** | Account status · subscription · usage · audit history |
| **Security** | Break-glass access logged |
| **Related** | SCR-053 |

---

## SCR-055 — System Health

| Field | Specification |
|-------|---------------|
| **Route** | `/admin/health` |
| **Monitor** | Database · AI · OCR queue · Storage · Payments |
| **Related** | Volume 9 Ch. 23 |

---

# Chapter 20 — Universal Screen States

Every SCR spec must define these five states:

| State | Pattern | Component |
|-------|---------|-----------|
| **Loading** | Content areas | `SkeletonCard`, `SkeletonDashboard` |
| **Empty** | First-use / no data | `EmptyTrips`, `EmptyReceipts`, etc. |
| **Error** | Recoverable failure | `NetworkErrorState`, `AlertError` + retry |
| **Offline** | No connectivity | `OfflineBanner` + queued ops indicator |
| **Success** | Action complete | `Toast` — non-blocking; avoid modal |

Reference: Volume 10 Ch. 18–19, 32–33.

---

# Chapter 21 — Navigation Map

```
SCR-001 Splash
  ├─ session → SCR-015 Dashboard
  └─ none → SCR-002 Welcome
       ├─ SCR-003 Sign In → SCR-015
       └─ SCR-004 Sign Up → SCR-005 → SCR-008 Tour
            → SCR-010 Business → SCR-011 Vehicle → SCR-013 Permissions
            → SCR-015 Dashboard

SCR-015 Dashboard
  ├─ SCR-056 Add Sheet
  │    ├─ Start Trip → SCR-019 → SCR-016 Active
  │    ├─ Scan → SCR-023 → SCR-024 Review
  │    └─ Add Expense → SCR-028
  ├─ SCR-017 Trip List → SCR-018 Detail
  │    ├─ SCR-021 Edit
  │    └─ SCR-020 End (from SCR-016)
  ├─ SCR-030 Reports → SCR-031 Builder → SCR-032 Viewer
  ├─ SCR-043 Search
  └─ SCR-046 Settings → (account, billing, help…)

SCR-016 Active Trip
  ├─ SCR-023 Scan
  ├─ SCR-020 End → SCR-018 Detail
  └─ SCR-015 Dashboard (banner always reachable)
```

**Rule:** No dead ends — every screen has back navigation or tab bar escape.

Full diagram: `docs/screen-catalog/navigation-map.md` (create Phase A).

---

# Chapter 22 — Screen Analytics

Each screen defines:

| Event | When |
|-------|------|
| `{scr}_view` | Screen entry (include scr_id) |
| `{scr}_exit` | Screen leave (duration computed) |
| `{scr}_primary_action` | Primary CTA tap |
| `{scr}_complete` | Successful flow completion |
| `{scr}_error` | Error surfaced { code } |

**Examples:**

| SCR-ID | Entry | Primary action | Complete |
|--------|-------|----------------|----------|
| SCR-015 | `dashboard_view` | `dashboard_start_trip_tap` | — |
| SCR-019 | `start_trip_view` | `start_trip_submit` | `start_trip_success` |
| SCR-024 | `ocr_review_view` | `ocr_save` | `ocr_save_success` |
| SCR-032 | `report_view` | `report_download` | `report_download_success` |

Drop-off tracked at wizard steps (SCR-020, onboarding). Volume 7 analytics stack.

---

# Chapter 23 — Screen Inventory Matrix

Master tracking table — update per implementation PR.

| SCR-ID | Name | Route | Wave | Components | APIs | Permissions | Dev Status | QA Status |
|--------|------|-------|------|------------|------|-------------|------------|-----------|
| SCR-001 | Splash | `/` | 1 | Logo, Spinner | auth.getSession | public | ☐ | ☐ |
| SCR-002 | Welcome | `/welcome` | 1 | Buttons | — | public | ☐ | ☐ |
| SCR-003 | Sign In | `/auth/login` | 1 | Form | auth.signIn | public | ☐ | ☐ |
| … | … | … | … | … | … | … | ☐ | ☐ |
| SCR-015 | Dashboard | `/dashboard` | 2 | Widgets | aggregates | auth | ☐ | ☐ |
| SCR-019 | Start Trip | `/trips/start` | 3 | Form | trips.insert | auth | ☐ | ☐ |
| SCR-024 | Receipt Review | `/expenses/scan/review` | 4 | AIReview | ocr edge fn | auth | ☐ | ☐ |
| SCR-032 | Report Viewer | `/reports/[id]` | 5 | ReportPreview | reports | auth | ☐ | ☐ |
| SCR-053 | Admin Dashboard | `/admin` | 7 | Metrics | admin RPC | admin | ☐ | ☐ |

Full CSV: `docs/screen-catalog/SCR-INDEX.md` — **source of truth for build tracking**.

PR template requirement: `SCR-IDs: SCR-019, SCR-021`

---

# Chapter 24 — Screen Review Checklist

Before a screen enters development:

| # | Check |
|---|-------|
| 1 | UX reviewed against Volume 2 journey |
| 2 | Accessibility spec complete (Ch. 2, Volume 10 Ch. 30) |
| 3 | Responsive layouts documented (mobile/tablet/desktop) |
| 4 | Light + dark themes specified |
| 5 | Offline behavior documented |
| 6 | Analytics events defined (Ch. 22) |
| 7 | AI interactions reviewed (Volume 5) |
| 8 | Copy finalized |
| 9 | FR references linked (Volume 3) |
| 10 | Components exist or flagged for Volume 10 build |

Only then does SCR status move to **Ready for Dev**.

---

# Chapter 25 — Version 1 Screen Roadmap

Implementation waves align with functional dependencies:

| Wave | SCR-IDs | Scope | Depends on |
|------|---------|-------|------------|
| **1** | SCR-001–014 | Auth & onboarding | Phase B auth |
| **2** | SCR-015, SCR-033–037, SCR-056, SCR-060 | Dashboard, entities, Add Sheet | Wave 1, schema |
| **3** | SCR-016–022, SCR-043 | Trips, search | Wave 2 |
| **4** | SCR-023–029, SCR-040–041 | Receipts, expenses, AI | Wave 3, OCR |
| **5** | SCR-030–032 | Reports | Wave 3 |
| **6** | SCR-044–045, SCR-058 | Billing | Wave 2, Stripe |
| **7** | SCR-042, SCR-046–052, SCR-053–055, SCR-059 | Settings, help, admin | Waves 1–6 |

Maps to blueprint README implementation Phases A–H.

---

# Chapter 26 — The Screen Bible Standard

> **Any engineer should be able to build any screen without asking what it should look like, what it should do, or how it should behave.**

If questions remain after reading an SCR specification, **the screen definition is incomplete** — update Volume 11 before coding.

---

## Modal & Sheet Specifications (Summary)

| SCR-ID | Name | Trigger | Components |
|--------|------|---------|------------|
| SCR-056 | Add Sheet | Add (+) tab | `AddSheet` — Start, Scan, Expense, Manual Trip |
| SCR-057 | Delete Confirmation | Delete actions | `DeleteDialog` |
| SCR-058 | Upgrade Modal | Free tier limit | `UpgradeModal` |

Each modal inherits global standards (Ch. 2) and Volume 10 Ch. 16.

---

## Cross-Reference Index

| Volume | References SCR-IDs in… |
|--------|------------------------|
| Volume 3 | FR acceptance criteria → SCR mapping |
| Volume 9 | E2E tests, QA matrices per SCR |
| Volume 10 | Component → SCR usage in Ch. 42 |
| Volume 2 | Journeys → SCR sequence |

When Volume 13+ are added (analytics), they **must** use SCR-IDs and API-IDs.

---

## Document Map

| Need | Go to |
|------|-------|
| User journeys | [Volume 2 Ch. 4](02-user-experience.md) |
| Components | [Volume 10](10-design-system.md) |
| Functional rules | [Volume 3](03-functional-requirements.md) |
| Implementation tracker | `docs/screen-catalog/SCR-INDEX.md` |
| QA per screen | [Volume 9](09-testing-quality.md) |
| API per screen | [Volume 12](12-api-architecture.md) |

---

*Previous: [Volume 10 — Universal Design System](10-design-system.md) | Next: [Volume 12 — API Architecture](12-api-architecture.md)*
