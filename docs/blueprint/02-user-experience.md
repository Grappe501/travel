# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 2 — Experience Architecture (UX/UI Master Blueprint)

**Version 1.0**

---

## Who This Document Is For

Volume 2 is the **complete interaction blueprint** for Mileage & Expense Copilot. No production UI code is written until every screen, journey, state, and micro-interaction in this document is reviewed.

| Role | Use this volume to… |
|------|---------------------|
| **Designers** | Wireframe, prototype, and build the design system (Chapter 13) |
| **Engineers** | Implement routes, components, validation, and offline behavior exactly as specified |
| **QA** | Test against journeys (Chapter 4), success checklist (Chapter 15), and UX metrics (Chapter 14) |
| **Support** | Understand error copy, notifications, and expected user flows |
| **Product** | Gate V1 completion against the success checklist and non-negotiables (Volume 1, Ch. 18) |

**Related:** [Volume 1 — Strategy](01-product-vision.md) · [Volume 3 — Functional Requirements](03-functional-requirements.md)

---

# Chapter 1 — User Experience Philosophy

## The One-Minute Rule

The average business trip should be **completely documented in under one minute**.

Every screen, field, and default exists to serve that goal. If a screen adds time without adding capture value, remove or defer it.

| Workflow | Target | Volume 1 ref |
|----------|--------|--------------|
| Routine trip (start → end) | < 1 min | N2 |
| Receipt capture (camera → save) | < 10 sec | Volume 0 |
| First trip after install | < 5 min incl. onboarding | N1 |
| Report generation | < 3 taps to export | Ch. 15 |

---

## Thumb-First Design

Assume the user is:

* Standing at a gas pump
* Walking to their vehicle
* Carrying equipment
* Holding a cup of coffee

**Rules:**

* Primary actions in the **bottom third** of the screen
* Minimum touch target: **44 × 44 pt** (48 × 48 pt for primary CTAs)
* **One-handed reach** — critical actions within thumb arc on 6.1″ phones
* No required two-hand gestures in core flows

---

## Outdoor Visibility

The interface must remain readable:

* In bright sunlight
* At night
* In rain
* In a parked vehicle

**Rules:**

* Body text minimum **16px** (17px preferred on iOS)
* Contrast ratio **≥ 4.5:1** for text (WCAG AA); **≥ 7:1** for small labels
* No low-contrast gray-on-white for primary content
* Minimal reliance on color alone for status
* Reduce glassmorphism, gradients, and decorative shadows on data screens

---

## Zero Training Required

A new user should understand the app **without tutorials or documentation**.

If a feature requires explanation, **redesign it**.

* Labels are verbs where possible: "Start Trip," not "Create"
* Icons always paired with text in navigation and primary actions
* Progressive disclosure — advanced fields collapsed by default

---

# Chapter 2 — Navigation Architecture

## Mobile (Primary Platform)

Bottom navigation bar — **5 tabs:**

| # | Tab | Icon | Role |
|---|-----|------|------|
| 1 | **Dashboard** | Home | Summary, quick actions, active trip |
| 2 | **Trips** | Route | Timeline, search, trip history |
| 3 | **Add (+)** | Plus (elevated) | **Fastest path to record anything** |
| 4 | **Reports** | Chart | Generate and export |
| 5 | **More** | Menu | Settings, business, vehicles, help, billing |

The **"+" tab** is visually elevated (center, larger, brand color). Tapping opens the **Add Sheet** — not a blank page.

### Add Sheet (modal bottom sheet)

| Option | Action |
|--------|--------|
| **Start Trip** | → Start Trip flow |
| **Scan Receipt** | → Camera / OCR flow |
| **Add Expense** | → Manual expense (attach to active trip if exists) |
| **Manual Trip** | → Retroactive trip entry |

If a trip is **active**, sheet highlights "Scan Receipt" and "Add Expense" first.

### Global Chrome

| Element | Behavior |
|---------|----------|
| **Active trip banner** | Sticky top when trip in progress — shows purpose, elapsed time, tap → Active Trip |
| **Offline badge** | Subtle icon in header when offline; tap for sync status |
| **Business selector** | Header on Dashboard and Trips — switch active business context |

### Desktop / Tablet (Secondary)

* **≥ 768px:** Left sidebar replaces bottom nav (Dashboard · Trips · Reports · More)
* **Add (+)** remains a prominent header button opening the same Add Sheet
* **≥ 1024px:** Master-detail layout on Trips (list + detail pane)

---

# Chapter 3 — Complete Screen Inventory

Every screen is listed with **route**, **purpose**, and **V1 status**. Routes are implementation targets — finalize during Phase A scaffold.

## Authentication

| Screen | Route | Purpose | V1 |
|--------|-------|---------|-----|
| Splash | `/` | Brand moment while auth resolves (< 2s) | ✓ |
| Welcome | `/welcome` | Value prop + Sign In / Sign Up | ✓ |
| Sign In | `/auth/login` | Email + password | ✓ |
| Sign Up | `/auth/signup` | Create account | ✓ |
| Forgot Password | `/auth/forgot` | Send reset email | ✓ |
| Reset Password | `/auth/reset` | New password (token from email) | ✓ |
| Email Verification | `/auth/verify` | Confirm email before full access | ✓ |
| Two-Factor Authentication | `/auth/2fa` | TOTP entry | Future-ready UI stub |

## Onboarding

| Screen | Route | Purpose | V1 |
|--------|-------|---------|-----|
| Welcome Tour | `/onboarding` (step 1) | 3 slides max — problem/solution/promise | ✓ |
| Subscription Selection | `/onboarding/plan` | Free vs Pro — skip allowed | ✓ |
| Create Business | `/onboarding/business` | Name required; EIN optional | ✓ |
| Add Vehicle | `/onboarding/vehicle` | Name required; odometer optional | ✓ |
| Mileage Rate Setup | `/onboarding/rate` | IRS default pre-selected | ✓ |
| Permissions | `/onboarding/permissions` | Camera, location, notifications — each skippable | ✓ |
| First Trip Walkthrough | `/onboarding/first-trip` | Optional guided start trip | ✓ |

Skip allowed after **Create Business**. Incomplete onboarding resumes on next launch.

## Dashboard

| Screen | Route | Purpose | V1 |
|--------|-------|---------|-----|
| Daily Summary | `/dashboard` (default) | Today miles, expenses, active trip | ✓ |
| Weekly Summary | `/dashboard?period=week` | Week totals toggle | ✓ |
| Monthly Summary | `/dashboard?period=month` | Month totals toggle | ✓ |
| Recent Trips | `/dashboard` (section) | Last 5 trip cards | ✓ |
| Outstanding Receipts | `/dashboard` (section) | Receipts needing review | ✓ |
| Quick Actions | `/dashboard` (section) | Start Trip, Scan, Reports shortcuts | ✓ |
| AI Suggestions | `/dashboard` (section) | Dismissible suggestion cards | ✓ |
| Subscription Status | `/dashboard` (banner) | Usage meters on Free tier | ✓ |

## Trips

| Screen | Route | Purpose | V1 |
|--------|-------|---------|-----|
| Trip List | `/trips` | Timeline, filters, search | ✓ |
| Active Trip | `/trips/[id]/active` | In-progress trip hub | ✓ |
| Start Trip | `/trips/start` | Begin new trip | ✓ |
| End Trip | `/trips/[id]/end` | Close trip + checklist + summary | ✓ |
| Trip Details | `/trips/[id]` | Completed trip record | ✓ |
| Edit Trip | `/trips/[id]/edit` | Modify metadata and odometer | ✓ |
| Duplicate Trip | `/trips/duplicate/[id]` | Copy metadata to new draft | ✓ |
| Delete Confirmation | modal | Soft-delete with undo window | ✓ |

## Expenses

| Screen | Route | Purpose | V1 |
|--------|-------|---------|-----|
| Receipt Camera | `/expenses/scan` | Capture or upload image | ✓ |
| OCR Review | `/expenses/scan/review` | Confirm AI-extracted fields | ✓ |
| Expense Details | `/expenses/[id]` | View/edit line item | ✓ |
| Attach Receipt to Trip | `/expenses/attach` | Pick trip when none active | ✓ |
| Expense Categories | `/settings/categories` | System + custom categories | ✓ |
| Expense Search | `/trips?search=` | Unified search (see Ch. 10) | ✓ |

## Reports

| Screen | Route | Purpose | V1 |
|--------|-------|---------|-----|
| Mileage Report | `/reports/mileage` | IRS-style log | ✓ |
| Expense Report | `/reports/expense` | By category | ✓ |
| Combined Report | `/reports/combined` | Trip + expenses | ✓ |
| Monthly Summary | `/reports?period=month` | Preset filter | ✓ |
| Annual Summary | `/reports?period=year` | Preset filter | ✓ |
| Client Report | `/reports/client` | Group by client/project | ✓ |
| Reimbursement Report | `/reports/reimbursement` | Employer-ready | ✓ |
| Export Screen | `/reports/export` | Format + download/share | ✓ |

## Business

| Screen | Route | Purpose | V1 |
|--------|-------|---------|-----|
| Business List | `/business` | All businesses | ✓ |
| Business Profile | `/business/[id]` | Edit name, EIN, rate override | ✓ |
| Employees | `/business/[id]/employees` | Team management | V1.1 stub |
| Vehicles | `/vehicles` | CRUD, default vehicle | ✓ |
| Mileage Rates | `/settings/mileage-rates` | IRS / custom | ✓ |
| Clients/Projects | `/clients` | Frequent clients autocomplete source | ✓ |

## Settings (More tab)

| Screen | Route | Purpose | V1 |
|--------|-------|---------|-----|
| Account | `/settings/account` | Name, email, password | ✓ |
| Subscription | `/settings/billing` | Plan, usage, upgrade | ✓ |
| Notifications | `/settings/notifications` | Granular toggles | ✓ |
| Privacy | `/settings/privacy` | Policy link, data controls | ✓ |
| Data Export | `/settings/export` | Download all data | ✓ |
| Help | `/help` | FAQ | ✓ |
| About | `/about` | Version, licenses | ✓ |
| Contact Support | `/help/contact` | Email form | ✓ |

**Total V1 screens:** ~45 (excluding modals and sheets)

---

# Chapter 4 — Every User Journey

Each journey documents **every tap**, **validation**, and **branch**. Engineering implements these as acceptance tests.

---

## Journey A — Start Trip

```
Dashboard (or Trips)
    ↓ tap Add (+)
Add Sheet
    ↓ tap "Start Trip"
Start Trip screen
    ↓ auto-filled: Business (last used), Vehicle (default)
    ↓ enter Purpose * — required, 1–500 chars
    ↓ optional: Client (autocomplete), Destination
    ↓ optional: Starting odometer OR "Use location" (GPS)
    ↓ tap "Start Trip" (primary, bottom-fixed)
Validation:
    • Purpose empty → inline error, shake field
    • Vehicle not selected → block submit
    • Active trip exists → modal: "End current trip first?" [Go to Active] [Cancel]
    • Free tier limit → Upgrade modal (FR-012)
    ↓ success
Trip Active screen + global active banner
Toast: "Trip started"
Haptic: light success
```

**Tap count (minimal path):** 3 (Add → Start Trip → Start Trip confirm)

---

## Journey B — Scan Receipt (active trip)

```
Any screen (active trip banner visible)
    ↓ tap Add (+)
Add Sheet
    ↓ tap "Scan Receipt"
Camera viewfinder
    ↓ capture photo OR upload from gallery
Loading: "Reading receipt…" (Ch. 6)
    ↓ OCR complete
OCR Review screen
    ↓ fields pre-filled; low-confidence fields highlighted amber
    ↓ user confirms Total * and Category *
    ↓ trip pre-selected: active trip
    ↓ tap "Save Expense"
Validation:
    • OCR failed → "Enter manually" path, no dead end
    • Offline → save locally, queue upload (N3)
    ↓ success
Toast: "Fuel · Shell · $63.42 saved to today's trip"
Optional: summary card (One-Tap Expense Intelligence — Volume 1)
Return to previous screen or Active Trip
```

**Tap count:** 4 (Add → Scan → Capture → Save)

---

## Journey C — End Trip

```
Active Trip screen (or tap banner)
    ↓ tap "End Trip"
End Trip — Step 1: Closure
    ↓ enter Ending odometer * (if start odometer used)
    ↓ optional: ending location, notes
    ↓ tap "Continue"
Validation:
    • end < start → inline error with explanation
    ↓
End Trip — Step 2: "Forgot Something?" checklist
    ☐ Fuel  ☐ Parking  ☐ Toll  ☐ Supplies  ☐ Meal  ☐ Receipts to photo
    ↓ checked items → shortcut to Scan with category pre-set
    ↓ tap "Continue"
End Trip — Step 3: Summary
    ↓ display: Miles · Reimbursement · Expenses · Grand total · Est. deduction
    ↓ tap "Complete Trip"
    ↓ success
Trip Details screen
Delight: first-trip celebration if applicable (Ch. 12)
Toast: "Trip complete — 42.5 mi documented"
```

---

## Journey D — Generate Reimbursement Report

```
Reports tab
    ↓ tap "Reimbursement Report"
Report config: date range (default: this month), business filter
    ↓ tap "Preview"
Preview screen (scrollable)
    ↓ tap "Export"
Export sheet: PDF (Free+) · CSV (Pro) · Excel (Pro)
    ↓ tap format
Loading: "Generating report…"
    ↓ success
Share sheet / download
Toast: "Report ready"
```

**Tap count:** 4 (Reports → Reimbursement → Preview → Export PDF)

---

## Journey E — First-Time Onboarding → First Trip

```
Sign Up → Email verify → Welcome Tour (3 slides)
    ↓
Create Business → Add Vehicle → Mileage Rate → Permissions
    ↓
First Trip Walkthrough (optional)
    ↓ Start Trip (guided)
Complete first trip OR land on Dashboard
Target: entire path < 5 minutes (N1)
```

---

## Journey F — Sign In (returning user)

```
Welcome → Sign In → credentials → Dashboard
Active trip banner if unfinished trip exists
No onboarding unless profile incomplete
```

---

## Journey G — Offline Trip Capture

```
Start Trip (offline)
    ↓ form saves to IndexedDB
Banner: "Offline — will sync when connected"
End Trip (offline)
    ↓ totals computed locally
Receipt photo stored locally; OCR queued
    ↓ connectivity restored
Background sync; banner clears
Toast: "3 items synced"
Conflict: server wins on timestamp; user notified if manual merge needed
```

---

# Chapter 5 — Empty States

The app never feels abandoned. Every empty screen is an **onboarding opportunity**.

| Screen | Empty message | Primary action |
|--------|---------------|----------------|
| Trip List | "No trips yet." | **+ Record your first business trip** |
| Dashboard (new user) | "Welcome — let's document your first trip." | **Start Trip** |
| Receipts / review queue | "No receipts waiting." | **Scan a receipt** |
| Reports preview (no data) | "No trips in this date range." | **Adjust dates** or **Start Trip** |
| Search (no results) | "Nothing matched '{query}'." | **Clear search** |
| Clients list | "Clients appear from your trips." | **Start Trip** |
| Vehicles | "Add a vehicle to track mileage." | **Add Vehicle** |

**Design rules:**

* Illustration or icon — single color, not cartoonish
* One sentence + one button — no paragraph of help text
* Never show empty tables with no message

---

# Chapter 6 — Loading States

Every wait must **reassure** the user that work is happening and data is safe.

| Operation | Message | Indicator | Max before extra UI |
|-----------|---------|-----------|---------------------|
| OCR processing | "Reading receipt…" | Spinner + progress bar | 5s → "Still working…" |
| Report generation | "Generating report…" | Determinate bar if possible | 10s → cancel option |
| Trip save | "Saving trip…" | Inline on button | 2s |
| Dashboard refresh | — | Skeleton cards | — |
| Initial app load | Logo splash | Branded splash | 2s |
| Sync upload | "Syncing…" | Header spinner | — |

**Rules:**

* Never block entire app except splash (< 2s)
* Buttons show loading state and disable double-submit
* Optimistic UI for trip start (show active immediately; reconcile on error)

---

# Chapter 7 — Error Handling

Every error answers three questions:

1. **What happened?**
2. **Why?** (brief, non-technical)
3. **What should I do next?**

| Situation | Bad | Good |
|-----------|-----|------|
| Upload failed offline | "Error 503" | "We couldn't upload your receipt right now. It's safely stored on your device and will sync when you're back online." [OK] |
| Invalid odometer | "Validation error" | "Ending odometer can't be less than starting (10,245 mi)." [Fix] |
| Free limit | "403 Forbidden" | "You've used 5 of 5 free trips this month." [Upgrade to Pro] [Maybe later] |
| OCR failed | "Processing error" | "We couldn't read this receipt. Try better lighting or enter details manually." [Retry] [Enter manually] |
| Session expired | "401" | "Please sign in again to continue." [Sign In] |
| Network timeout | "Network error" | "Connection timed out. Your changes are saved locally." [Retry] |

**Rules:**

* Human copy — no HTTP codes in user-facing text
* Always offer a **recovery action**
* Destructive errors use modal; field errors use inline
* Log technical detail to monitoring (Sentry) — never show stack traces

---

# Chapter 8 — Notifications

Notifications must be **helpful, not noisy**. Granular user control in Settings.

## Push / Email Categories (V1)

| Category | Example | Default |
|----------|---------|---------|
| **Active trip reminder** | "Trip still active — end when you're done?" | On |
| **Receipt reminder** | "Don't forget to photograph your receipt." | On |
| **Monthly summary** | "Your March travel summary is ready." | Off |
| **Subscription** | "Your Pro plan renews in 3 days." | On |
| **Sync complete** | "Cloud backup complete." | Off |
| **AI suggestion** | "We found a possible duplicate receipt." | On |

## Rules

* Max **1 push per day** unless user initiates action
* Quiet hours respected (device local time, 10pm–7am) — no marketing pushes
* Every notification deep-links to the relevant screen
* In-app notification center mirrors push history (More → Notifications)

---

# Chapter 9 — Accessibility

Accessibility is **core design**, not an afterthought. Target **WCAG 2.1 AA**.

| Requirement | Specification |
|-------------|---------------|
| Touch targets | Min 44 × 44 pt; 8pt spacing between targets |
| Screen readers | All buttons labeled; images have alt text; receipt photos described as "Receipt from {merchant}" |
| Focus order | Logical tab order matches visual order (web) |
| Color | Status uses icon + text, not color alone |
| High contrast mode | Respects `prefers-contrast: more`; test both themes |
| Dynamic type | Supports 100%–200% text scaling without clipping |
| Keyboard (web) | All flows operable without mouse; visible focus ring |
| Motion | Respects `prefers-reduced-motion: reduce` — disable celebrations |

**QA gate:** axe-core scan clean on all V1 screens before release (Volume 9).

---

# Chapter 10 — Search Experience

One search box — feels like **asking a question**, not querying a database.

**Entry points:** Trips tab header · Dashboard (optional expand)

**Query examples:**

* `Shell` → merchants, fuel expenses
* `Dallas` → destinations, locations
* `March` → date-scoped trips
* `Fuel` → category filter
* `Client ABC` → client/project field
* `$42.18` → amount match

**Results grouped:**

1. **Trips** (title, date, miles, client)
2. **Expenses** (merchant, amount, trip link)
3. **Reports** (quick link: "Generate report for this search")

**Behavior:**

* Debounce 300ms
* Recent searches stored locally (clearable)
* Empty → see Chapter 5
* Fuzzy match on purpose, client, destination, merchant, notes

---

# Chapter 11 — AI Experience

The AI appears as a **subtle assistant** — informative, dismissible, never intrusive.

## Presentation

* **Suggestion cards** on Dashboard — not modals
* **Inline hints** on OCR Review — confidence badges, not popups
* **End-trip checklist** — rule-based prompts (not LLM) for reliability

## Example Copy

| Trigger | Message | Actions |
|---------|---------|---------|
| Fuel receipt detected | "We found what looks like a fuel receipt. Attach to today's trip?" | [Attach] [Dismiss] |
| Daily summary | "You drove 126 business miles today." | [View trips] |
| Active trip 24h | "Looks like you forgot to end your trip." | [End trip] [Still driving] |
| Duplicate receipt | "This may be a duplicate of a receipt from Mar 12." | [View] [Save anyway] |
| Low OCR confidence | "Please double-check the total — we're not fully confident." | (inline on field) |

## Rules (Volume 1, N6)

* AI **never** auto-saves financial fields
* Every suggestion has **Dismiss** — never blocks workflow
* No fake "typing" animations or anthropomorphic chat in V1
* AI panel collapses after action taken

---

# Chapter 12 — Delight Moments

Small details build confidence without distracting from capture.

| Moment | Treatment | Reduced motion |
|--------|-----------|----------------|
| **First completed trip** | Confetti-lite animation + "First trip documented!" | Static badge only |
| **Monthly milestone** | Dashboard card: "You documented 42 trips in March" | Text only |
| **Report ready** | Smooth checkmark animation on export complete | Instant checkmark |
| **Expense saved** | Brief success toast with merchant + amount | Toast only |
| **Streak (V1.1)** | "4 weeks of complete records" | Optional |

**Rules:**

* Delight **never** adds mandatory taps
* Skippable / auto-dismiss ≤ 3 seconds
* No sound effects in V1

---

# Chapter 13 — Design System

> **Canonical specification:** [Volume 10 — Universal Design System & UI Component Library](10-design-system.md)

Volume 10 defines tokens, every component variant, accessibility requirements, and the V1 component inventory. This chapter summarizes **UX constraints** that inform the design system.

Define components **before implementation**. Figma (or equivalent) library mirrors Volume 10.

## Color Tokens (semantic)

| Token | Use |
|-------|-----|
| `--color-primary` | Primary actions, active nav |
| `--color-success` | Confirmations, completed trip |
| `--color-warning` | Low OCR confidence, incomplete |
| `--color-error` | Validation failures |
| `--color-surface` | Cards, sheets |
| `--color-text-primary` | Body |
| `--color-text-muted` | Secondary labels |

Light and dark themes required day one.

## Typography

| Scale | Size | Use |
|-------|------|-----|
| Display | 28–32px | Dashboard totals |
| Title | 22px | Screen titles |
| Body | 16–17px | Default |
| Caption | 13px | Timestamps, hints |

Font stack: system UI (`-apple-system`, `Segoe UI`, `Roboto`, sans-serif) for speed.

## Buttons

| Variant | Use | Style |
|---------|-----|-------|
| **Primary** | One per screen — main action | Filled, brand color, full-width on mobile |
| **Secondary** | Alternative path | Outline |
| **Destructive** | Delete trip, account | Red outline or fill |
| **FAB / Add** | Center nav + | 56dp circle, elevated shadow |
| **Ghost** | Tertiary, inline | Text only |

Disabled state: 40% opacity, no pointer events.

## Cards

| Card | Contents |
|------|----------|
| **Trip** | Date, route snippet, miles, expense total, status chips, chevron |
| **Receipt** | Thumbnail, merchant, amount, review badge |
| **Report** | Type icon, title, last generated date |
| **Dashboard Summary** | Metric label + large number + period toggle |
| **AI Suggestion** | Icon, message, primary + dismiss actions |

Radius: 12px. Shadow: subtle (light mode only).

## Inputs

| Type | Notes |
|------|-------|
| Text | Purpose, client, destination |
| Number | Odometer — large numeric keypad |
| Currency | Amount — `$` prefix, 2 decimal |
| Date | Native date picker |
| Time | Trip timestamps (edit mode) |
| Vehicle Selector | Bottom sheet list, default flagged |
| Client Selector | Autocomplete from history |
| Category Selector | Icon grid + labels |

## Modals & Sheets

| Type | Use |
|------|-----|
| **Confirmation** | Delete, discard draft |
| **Success** | Rare — prefer toast |
| **Error** | Recoverable failures |
| **AI Review** | OCR confirm (full-screen on mobile) |
| **Subscription Upgrade** | Free limit hit |
| **Add Sheet** | Center nav action menu |

Sheet snap points: 50% and 90% on mobile.

## Spacing & Grid

* Base unit: **4px**
* Screen horizontal padding: **16px** (mobile), **24px** (tablet)
* Section gap: **24px**
* Card internal padding: **16px**

---

# Chapter 14 — User Experience Metrics

Measure continuously post-launch. Instrument in analytics (Volume 7).

| Metric | Definition | Target |
|--------|------------|--------|
| Time to first trip | Install → first completed trip | < 5 min |
| Time to complete routine trip | Start → end (median) | < 1 min |
| Time to add receipt | Camera open → save | < 10 sec |
| OCR correction rate | Fields user edits / total fields | < 15% |
| Report generation time | Tap export → file ready | < 10 sec |
| Taps per core workflow | Count in Journey A–D | ≤ 4 each |
| Onboarding drop-off | Step funnel | < 20% per step |
| Search success rate | Clicks on results / searches | > 80% |

**Review cadence:** Weekly in beta; monthly post-launch.

---

# Chapter 15 — Version 1 UX Success Checklist

Version 1 UX is **complete only if** all items pass:

- [ ] New user installs and records first trip in **under 5 minutes**
- [ ] Returning user logs routine trip in **under 1 minute**
- [ ] Receipt capture takes **under 10 seconds** (excl. OCR wait)
- [ ] Reports generated in **fewer than 3 taps** from Reports tab
- [ ] Interface **consistent** on mobile, tablet, and web
- [ ] **No screen** requires user to guess the next action
- [ ] **Offline trip capture** works without connectivity (N3)
- [ ] **Active trip banner** visible from every tab while trip in progress
- [ ] All empty states have **actionable CTAs** (Chapter 5)
- [ ] axe-core **zero critical** violations on core flows
- [ ] Error copy follows **What / Why / Next** pattern (Chapter 7)

Sign-off required from **Design + Product + Engineering** before Phase C feature work begins.

---

# Chapter 16 — Interaction Micro-Specifications

Seemingly small details — defined once, implemented everywhere.

## Animation Durations

| Animation | Duration | Easing |
|-----------|----------|--------|
| Page transition | 250ms | ease-out |
| Sheet open/close | 300ms | cubic-bezier(0.32, 0.72, 0, 1) |
| Toast enter/exit | 200ms | ease |
| Skeleton shimmer | 1.2s loop | linear |
| Success checkmark | 400ms | ease-out |
| Button press scale | 100ms | scale(0.97) |

Respect `prefers-reduced-motion`: set all to **0ms** except opacity fades (150ms max).

## Haptic Feedback (mobile PWA where supported)

| Event | Haptic |
|-------|--------|
| Trip started | Light |
| Expense saved | Light |
| Trip completed | Success (medium) |
| Error / validation | Warning (notification) |
| Delete confirmed | Heavy |

No haptic on navigation taps or scroll.

## Swipe Gestures

| Context | Gesture | Action |
|---------|---------|--------|
| Trip list item | Swipe left (short) | Archive / delete reveal |
| Trip list item | Swipe right | Duplicate trip |
| Receipt in list | Swipe left | Delete (with undo) |
| Dashboard cards | None | Scroll only — no hidden actions |

Swipe reveals **icons + labels**, not swipe-only mystery actions.

## Pull-to-Refresh

| Screen | Enabled |
|--------|---------|
| Dashboard | Yes — refresh metrics |
| Trip list | Yes |
| Reports list | No — explicit generate |
| Settings | No |

Refresh indicator: brand color, releases at 80px pull.

## Offline Indicators

| State | UI |
|-------|-----|
| Offline | Gray cloud icon in header + "Offline" on tap → sync queue detail |
| Syncing | Rotating sync icon |
| Sync failed | Amber badge + retry in sheet |
| Pending items | Count badge on sync icon: "3 pending" |

Queued items: trips, expenses, receipt images. Never block capture.

## Auto-Save

| Context | Interval | Storage |
|---------|----------|---------|
| Start Trip draft (incomplete) | Every 30s | Local + server if online |
| Edit Trip form | On field blur + 30s | Server |
| OCR Review | On field change | Local until Save |

"Draft saved" — subtle caption, not toast (avoid noise).

## Camera Shutter Flow

1. Open camera → viewfinder full screen
2. Capture button: bottom center, 72dp
3. Flash toggle / gallery upload: top corners
4. After capture → preview strip with **Retake** | **Use Photo**
5. Upload begins on **Use Photo** — never on capture alone

## Confirmation Messages

| Action | Pattern |
|--------|---------|
| Trip saved | Toast, 3s |
| Expense saved | Toast with amount, 3s |
| Trip deleted | Toast with **Undo** (5s window) |
| Report exported | Toast + share sheet |
| Settings saved | Inline checkmark, no toast |

## Undo Behavior

| Action | Undo window | Method |
|--------|-------------|--------|
| Delete trip | 5s | Toast undo → restore soft-deleted row |
| Delete expense | 5s | Toast undo |
| Dismiss AI suggestion | Permanent | "Recent" list in settings (V1.1) |
| Edit field | Immediate | Native field undo / revert button on screen |

## Focus & Keyboard (Web)

* Enter submits single-page forms
* Escape closes sheets and modals
* Trap focus inside modals
* First field auto-focus on Start Trip (purpose) — keyboard only; not on mobile (avoids keyboard jump)

---

## Document Map

| Need | Go to |
|------|-------|
| Strategy & non-negotiables | [Volume 1](01-product-vision.md) |
| Feature rules & validation | [Volume 3](03-functional-requirements.md) |
| AI / OCR behavior | [Volume 5](05-ai-design.md) |
| Test plan | [Volume 9](09-testing-quality.md) |
| Design system | [Volume 10](10-design-system.md) |

---

*Previous: [Volume 1 — Product Vision & Strategy](01-product-vision.md) | Next: [Volume 3 — Functional Requirements](03-functional-requirements.md)*

*Design system:* [Volume 10](10-design-system.md)
