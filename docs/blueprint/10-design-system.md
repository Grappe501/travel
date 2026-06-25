# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 10 — Universal Design System & UI Component Library

**Version 1.0**

---

## Who This Document Is For

Volume 10 is the **authoritative visual and interaction system** for Mileage & Expense Copilot. After Volume 0 (doctrine), it may be the most referenced document in the codebase — every developer, designer, and AI agent builds the application **the same way**.

| Role | Use this volume to… |
|------|---------------------|
| **Designers** | Tokens, components, Figma library parity |
| **Engineers** | Implement `apps/web/src/components/` from specs — no one-offs |
| **QA** | Visual regression, accessibility per component (Ch. 30, 40) |
| **AI agents** | Component naming, token usage, screen assembly rules |

**Related:** [Volume 2 — Experience Architecture](02-user-experience.md) (screens & journeys) · [Volume 6 — Technical Architecture](06-technical-architecture.md) (file paths, shadcn) · [Volume 9 — QA](09-testing-quality.md) (accessibility gates)

Volume 2 Chapter 13 is a **summary**; **Volume 10 is canonical** for all design system decisions.

---

## Core Thesis

> **Nothing should be designed twice. Every screen is assembled from reusable components.**

You don't build 200 screens — you build a **system** of ~50 reusable components composed into ~45 V1 screens (Volume 2 Ch. 3).

---

# Chapter 1 — Purpose

The Design System defines every visual and interactive element used throughout the application.

## Goals

| Goal | Outcome |
|------|---------|
| **Consistency** | Same button, same behavior everywhere |
| **Speed of development** | Compose screens; don't reinvent |
| **Accessibility** | Built into every component definition |
| **Reusability** | 40–60 components serve 150+ composed views |
| **Predictability** | Users learn once, apply everywhere |
| **Professional polish** | Trust through visual calm |

**Rule:** No screen ships with bespoke UI that bypasses this system without design review and documented exception.

---

# Chapter 2 — Design Philosophy

The application should feel like:

* **Apple Notes** — quiet, content-first
* **Stripe Dashboard** — professional, trustworthy
* **Linear** — fast, minimal chrome
* **Notion** — structured without clutter

| Attribute | Meaning |
|-----------|---------|
| Simple | One primary action per screen |
| Fast | No decorative animation blocking work |
| Quiet | Neutral palette; data is the hero |
| Professional | Field-worker tool, not consumer toy |

**The UI should disappear** so the user's work — trips, receipts, reports — becomes the focus.

Aligns with Volume 0 One-Minute Rule and Volume 2 thumb-first design.

---

# Chapter 3 — Visual Identity

## Brand Characteristics

| ✓ Always | ✗ Never |
|----------|---------|
| Professional | Cartoonish |
| Calm | Corporate-heavy (stock photo dashboards) |
| Intelligent | Over-designed |
| Reliable | Loud gradients and neon |
| Modern | Busy layouts |
| Minimal | Flashy marketing chrome inside app |

## Logo & Wordmark

* App icon: simple route/mile marker motif — monochrome-friendly
* Wordmark: system font stack in product; custom logo only in marketing
* Minimum clear space: 8px (2 spacing units)

## Voice in UI Copy

* Direct, verb-led: "Start Trip," not "Initiate Journey"
* Errors explain recovery: what happened + what to do next
* AI copy: collaborative ("We suggest…") not authoritative ("This is…")

---

# Chapter 4 — Color System

**Semantic colors only.** No hardcoded hex in components — use design tokens (Ch. 37).

## Token Map

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--color-primary` | `hsl(220 70% 45%)` | `hsl(220 70% 58%)` | Primary actions, active nav, links |
| `--color-primary-hover` | `hsl(220 70% 40%)` | `hsl(220 70% 63%)` | Button hover |
| `--color-primary-active` | `hsl(220 70% 35%)` | `hsl(220 70% 68%)` | Button pressed |
| `--color-success` | `hsl(152 60% 38%)` | `hsl(152 55% 48%)` | Confirmations, completed trip |
| `--color-warning` | `hsl(38 92% 45%)` | `hsl(38 90% 55%)` | Low OCR confidence, incomplete |
| `--color-danger` | `hsl(0 72% 48%)` | `hsl(0 65% 58%)` | Errors, destructive actions |
| `--color-info` | `hsl(200 80% 45%)` | `hsl(200 75% 55%)` | Informational banners |
| `--color-background` | `hsl(0 0% 98%)` | `hsl(222 47% 6%)` | Page background |
| `--color-surface` | `hsl(0 0% 100%)` | `hsl(222 47% 9%)` | Cards, sheets, inputs |
| `--color-surface-elevated` | `hsl(0 0% 100%)` | `hsl(222 47% 11%)` | Modals, dropdowns |
| `--color-border` | `hsl(220 13% 88%)` | `hsl(217 19% 18%)` | Dividers, input borders |
| `--color-text-primary` | `hsl(222 47% 11%)` | `hsl(210 40% 98%)` | Body text |
| `--color-text-muted` | `hsl(215 16% 47%)` | `hsl(215 20% 65%)` | Secondary labels |
| `--color-text-disabled` | `hsl(215 16% 65%)` | `hsl(215 15% 40%)` | Disabled controls |
| `--color-selected` | `hsl(220 70% 95%)` | `hsl(220 40% 18%)` | List selection, nav active bg |
| `--color-hover` | `hsl(220 14% 96%)` | `hsl(217 19% 14%)` | Row hover, ghost button |

## State Requirements

Every semantic color defines: **default · hover · active · disabled · foreground-on-color** (text/icon on filled backgrounds).

## Contrast Validation

| Pair | Minimum ratio |
|------|---------------|
| `--color-text-primary` on `--color-background` | 4.5:1 (AA) |
| `--color-text-primary` on `--color-surface` | 4.5:1 |
| Primary button label on `--color-primary` | 4.5:1 |
| Caption / micro on surface | 4.5:1 |

Validate with automated contrast check in CI (Ch. 40). Volume 2 outdoor visibility prefers **7:1** for small labels where practical.

**Implementation:** `apps/web/src/styles/tokens.css` + Tailwind theme extension. shadcn CSS variables map to these tokens.

---

# Chapter 5 — Typography

**Font stack:** System UI for speed and native feel.

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif;
```

Monospace (odometer, report IDs): `ui-monospace, "Cascadia Code", "SF Mono", monospace`

## Type Scale

| Token | Size | Line height | Weight | Use |
|-------|------|-------------|--------|-----|
| `text-display` | 32px / 2rem | 1.2 | 600 | Dashboard hero totals |
| `text-page-title` | 28px / 1.75rem | 1.25 | 600 | Screen titles |
| `text-section-title` | 22px / 1.375rem | 1.3 | 600 | Section headers |
| `text-card-title` | 18px / 1.125rem | 1.35 | 600 | Card headings |
| `text-heading` | 17px / 1.0625rem | 1.4 | 600 | List row primary |
| `text-subheading` | 15px / 0.9375rem | 1.45 | 500 | Secondary headings |
| `text-body-lg` | 17px / 1.0625rem | 1.5 | 400 | Emphasized body (outdoor) |
| `text-body` | 16px / 1rem | 1.5 | 400 | Default body |
| `text-caption` | 13px / 0.8125rem | 1.45 | 400 | Timestamps, hints |
| `text-micro` | 11px / 0.6875rem | 1.4 | 500 | Badges, tab labels (uppercase sparingly) |

## Rules

* Body minimum **16px** on mobile (Volume 2)
* Responsive: `text-display` scales down one step below 390px width
* No more than **3 type sizes** per screen section
* Truncate with ellipsis; expand on tap for long merchant names

---

# Chapter 6 — Spacing System

**One scale only.** Base unit: **4px**.

| Token | Value | Common use |
|-------|-------|------------|
| `space-1` | 4px | Icon-text gap, tight inline |
| `space-2` | 8px | Chip padding, compact lists |
| `space-3` | 12px | Input internal padding (vertical) |
| `space-4` | 16px | Card padding, screen horizontal margin (mobile) |
| `space-6` | 24px | Section gap, tablet horizontal margin |
| `space-8` | 32px | Large section separation |
| `space-12` | 48px | Empty state vertical padding |
| `space-16` | 64px | Hero / onboarding spacing |

**No arbitrary padding.** Tailwind classes must use scale tokens only (`p-4`, not `p-[13px]`).

Exception: safe-area insets (`env(safe-area-inset-*)`) for notched devices.

---

# Chapter 7 — Grid System

## Breakpoints

| Name | Min width | Layout |
|------|-----------|--------|
| `xs` | 0 | Mobile portrait — primary |
| `sm` | 390px | Large phone |
| `md` | 768px | Tablet — sidebar nav |
| `lg` | 1024px | Desktop — master-detail |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide cap |

## Content Widths

| Context | Max width |
|---------|-----------|
| Form / auth screens | 480px centered |
| Dashboard content | 1200px |
| Report tables | 100% with horizontal scroll fallback |
| Modals (desktop) | 560px default; 720px for OCR review |

## Margins & Safe Areas

| Viewport | Horizontal padding |
|----------|-------------------|
| Mobile | `space-4` (16px) + safe-area |
| Tablet | `space-6` (24px) |
| Desktop | `space-6` with sidebar offset |

Cards reflow: **1 column** (mobile) → **2 column** (tablet dashboard) → **3 column** (desktop widgets).

---

# Chapter 8 — Icon Library

**One family only:** [Lucide React](https://lucide.dev) (shadcn default).

## Size Scale

| Token | Size | Use |
|-------|------|-----|
| `icon-sm` | 16px | Inline with caption |
| `icon-md` | 20px | Buttons, list rows |
| `icon-lg` | 24px | Navigation, card headers |
| `icon-xl` | 32px | Empty states |

## Category Mapping

| Category | Icons (Lucide names) |
|----------|---------------------|
| Navigation | `Home`, `Route`, `Plus`, `BarChart3`, `Menu` |
| Trips | `MapPin`, `Navigation`, `Clock`, `Flag` |
| Vehicles | `Car`, `Gauge` |
| Businesses | `Building2`, `Briefcase` |
| Reports | `FileText`, `Download`, `Share2`, `Printer` |
| Receipts | `Receipt`, `Camera`, `Image` |
| Settings | `Settings`, `User`, `Bell`, `Shield` |
| Notifications | `Bell`, `BellRing` |
| Billing | `CreditCard`, `Sparkles` |
| Help | `HelpCircle`, `MessageCircle` |
| Status | `CheckCircle2`, `AlertTriangle`, `XCircle`, `Info` |
| Actions | `Pencil`, `Trash2`, `Copy`, `MoreHorizontal` |

**Rules:** Icons in nav and primary actions **always paired with text** (Volume 2). Stroke width 2px default; 1.5px at 16px.

---

# Chapter 9 — Elevation System

Shadow tokens — **subtle in light mode; border emphasis in dark mode** (Volume 2: minimal shadows on data screens).

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `shadow-none` | none | none | Flat lists |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | border only | Cards |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | border + subtle glow | Dropdowns |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | elevated surface | Modals |
| `shadow-floating` | `0 12px 32px rgba(0,0,0,0.15)` | — | FAB, Add (+) nav |
| `shadow-modal` | `0 24px 48px rgba(0,0,0,0.18)` | — | Full-screen sheet backdrop |

No random box-shadow values in components.

---

# Chapter 10 — Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | 6px | Chips, badges, small inputs |
| `radius-md` | 10px | Buttons, inputs |
| `radius-lg` | 12px | Cards (default) |
| `radius-xl` | 16px | Modals, bottom sheets (top corners) |
| `radius-pill` | 9999px | Tags, toggle track |
| `radius-circle` | 50% | FAB, avatars, icon buttons |

---

# Chapter 11 — Buttons

Base primitive: shadcn `Button` wrapped as domain variants in `components/ui/button.tsx`.

## Variants

| Variant | Component | Height (mobile) | Style |
|---------|-----------|-----------------|-------|
| **Primary** | `PrimaryButton` | 48px | Filled `--color-primary`, full-width default on mobile |
| **Secondary** | `SecondaryButton` | 48px | Outline `--color-border` |
| **Outline** | `OutlineButton` | 44px | Transparent + border |
| **Ghost** | `GhostButton` | 44px | Text only, hover `--color-hover` |
| **Danger** | `DangerButton` | 48px | `--color-danger` fill or outline |
| **FAB** | `FloatingActionButton` | 56×56px | Circle, `shadow-floating`, center nav |
| **Icon** | `IconButton` | 44×44px min | Square/circle, `aria-label` required |
| **Split** | `SplitButton` | 48px | Primary + chevron menu (reports export) |
| **Loading** | `LoadingButton` | same as variant | Spinner replaces label; disabled |
| **Disabled** | all | — | 40% opacity, `pointer-events: none`, `aria-disabled` |

## Specs

| Property | Value |
|----------|-------|
| Horizontal padding | `space-4` (primary), `space-3` (compact) |
| Font | `text-body` weight 500 |
| Border radius | `radius-md` |
| Focus ring | 2px `--color-primary` offset 2px |
| Tap animation | scale 0.98, 100ms (Ch. 20) |

**Rule:** One **Primary** per screen. Secondary for alternate path; never two primaries.

---

# Chapter 12 — Inputs

All inputs use shared `FormField` wrapper: label, control, hint, error message.

## Input Types

| Component | Purpose | Notes |
|-----------|---------|-------|
| `TextInput` | Purpose, client, destination | `maxLength`, clear button |
| `CurrencyInput` | Expense amount | `$` prefix, 2 decimal, numeric keypad |
| `MileageInput` | Odometer | Monospace, 1 decimal, large tap target |
| `DateInput` | Receipt date, trip date | Native picker; ISO storage |
| `TimeInput` | Trip timestamps (edit) | Native time picker |
| `SelectDropdown` | Vehicle, business, category | Bottom sheet on mobile |
| `SearchInput` | Global search | Debounced 300ms, clear icon |
| `Toggle` | Settings booleans | shadcn Switch |
| `Checkbox` | End-trip checklist | 44px row tap target |
| `RadioGroup` | Mileage rate type | |
| `Textarea` | Notes | Auto-grow, 500 char max |
| `AutocompleteInput` | Client selector | History from past trips |

## States (every input)

| State | Visual |
|-------|--------|
| Empty | Placeholder `--color-text-muted` |
| Focused | Border `--color-primary`, focus ring |
| Typing | — |
| Valid | Optional subtle check (settings only) |
| Invalid | Border `--color-danger`, error caption below |
| Disabled | `--color-text-disabled`, no interaction |
| Loading | Skeleton or spinner in trailing slot |

Currency and mileage inputs use **inputMode="decimal"** for mobile keypads.

---

# Chapter 13 — Cards

Radius `radius-lg`, padding `space-4`, shadow `shadow-sm` (light) / border (dark).

| Component | Contents | Actions |
|-----------|----------|---------|
| `TripCard` | Date, route snippet, miles, expense total, status chips | Tap → detail; swipe actions (mobile) |
| `ReceiptCard` | Thumbnail, merchant, amount, review badge | Tap → OCR review or detail |
| `VehicleCard` | Name, plate, odometer, default badge | Edit, set default |
| `BusinessCard` | Name, trip count, rate override indicator | Tap → profile |
| `DashboardMetricCard` | Label, large number, period toggle | Tap → filtered list |
| `InsightCard` | AI/monthly insight summary | Dismiss |
| `AISuggestionCard` | Icon, message, confidence, actions | Accept / dismiss |
| `NotificationCard` | Type icon, message, timestamp | Mark read |
| `ReportCard` | Type icon, title, last generated | Generate, download |

## Card States

| State | Behavior |
|-------|----------|
| Default | As above |
| Loading | `SkeletonCard` matching layout |
| Selected | `--color-selected` background |
| Expandable | Chevron; accordion for trip expense list |
| Error | Inline retry on sync failure |

---

# Chapter 14 — Tables

Used in reports, trip lists (desktop), employee lists (V1.1).

| Component | Use |
|-----------|-----|
| `DataTable` | Generic sortable table |
| `TripTable` | Date, purpose, miles, amount columns |
| `ReceiptTable` | Thumbnail, merchant, amount, category |
| `ReportPreviewTable` | Print-optimized styling |

## Responsive Rules

| Viewport | Behavior |
|----------|----------|
| Desktop | Full columns, sticky header |
| Tablet | Hide low-priority columns; horizontal scroll |
| Mobile | **Card collapse** — each row becomes `TripCard` / `ReceiptCard` |

## Features

* Sorting: tap column header; indicator icon
* Filtering: `FilterBar` above table
* Bulk selection: checkbox column (desktop); batch delete (future)
* Sticky header: `position: sticky; top: 0` below app chrome

---

# Chapter 15 — Navigation

| Component | Mobile | Desktop (≥768px) |
|-----------|--------|------------------|
| `BottomNav` | 5 tabs: Dashboard, Trips, Add, Reports, More | Hidden |
| `SidebarNav` | Hidden | Dashboard, Trips, Reports, More |
| `TopBar` | Business selector, offline badge | Same + Add button |
| `ActiveTripBanner` | Sticky below top bar | Same |
| `Breadcrumbs` | Hidden | Trip detail, settings depth |
| `BackButton` | Header left on sub-screens | Same |
| `ContextMenu` | Long-press / `MoreHorizontal` | Right-click (desktop) |
| `NavigationDrawer` | More tab overflow | Sidebar sections |

**Add (+) tab:** visually elevated FAB-style; opens `AddSheet`.

`AddSheet` snap points: 50% and 90% height on mobile.

---

# Chapter 16 — Modals

Never invent a new modal style. Use `Dialog` (desktop) or `Sheet` (mobile) from shadcn.

| Component | Use | Mobile | Desktop |
|-----------|-----|--------|---------|
| `ConfirmDialog` | Delete, discard draft | Sheet | Dialog |
| `DeleteDialog` | Destructive confirm + type name | Sheet | Dialog |
| `UpgradeModal` | Free tier limit | Full sheet | Dialog 560px |
| `SuccessDialog` | Rare — prefer toast | Sheet | Dialog |
| `WarningDialog` | Unsaved changes | Sheet | Dialog |
| `ErrorDialog` | Recoverable failure | Sheet | Dialog |
| `ReceiptReviewSheet` | OCR confirm | **Full screen** | Large dialog 720px |
| `AISuggestionSheet` | AI explain + accept | Sheet 90% | Dialog |
| `ReportCompleteDialog` | Download / share actions | Sheet | Dialog |
| `AddSheet` | Center nav menu | Bottom sheet | Popover |

Backdrop: `rgba(0,0,0,0.5)` light / `rgba(0,0,0,0.7)` dark. Focus trap required.

---

# Chapter 17 — Alerts

| Component | Duration | Use |
|-----------|----------|-----|
| `Toast` | 4s auto-dismiss | Success, neutral info |
| `ToastPersistent` | Manual dismiss | Error requiring action |
| `Banner` | Sticky until dismissed | Offline, subscription expiring |
| `InlineAlert` | Persistent in form | Validation summary |
| `AlertSuccess` | — | Green left border |
| `AlertWarning` | — | Amber left border |
| `AlertInfo` | — | Blue left border |
| `AlertError` | — | Red left border |

**Behavior rules:**

* Success toasts: max 2 stacked
* Errors: never auto-dismiss without user acknowledgment for payment/auth failures
* Icons always paired with text
* `role="alert"` for errors; `role="status"` for success

---

# Chapter 18 — Empty States

| Component | Headline | Primary action |
|-----------|----------|----------------|
| `EmptyTrips` | "No trips yet" | Start Trip |
| `EmptyReceipts` | "No receipts captured" | Scan Receipt |
| `EmptyReports` | "No reports generated" | Create Report |
| `EmptyBusinesses` | "Add your first business" | Add Business |
| `EmptyVehicles` | "Add a vehicle" | Add Vehicle |
| `EmptySearch` | "No results for '{query}'" | Clear search |
| `EmptyClients` | "No clients yet" | Add on next trip |

## Anatomy

1. Illustration (simple line icon, 64px, `--color-text-muted`)
2. Headline (`text-section-title`)
3. Explanation (`text-body`, `--color-text-muted`, max 2 lines)
4. Primary action button

Never leave users staring at a blank screen.

---

# Chapter 19 — Loading States

| Component | Use |
|-----------|-----|
| `SkeletonText` | Single line placeholder |
| `SkeletonCard` | Trip/receipt card shape |
| `SkeletonDashboard` | Full dashboard layout |
| `ProgressBar` | Determinate upload/export |
| `Spinner` | Indeterminate short waits |
| `UploadProgress` | Receipt upload % |
| `OCRProcessingOverlay` | "Reading receipt…" + progress indeterminate |
| `ReportGeneratingOverlay` | "Building report…" + cancel option |
| `SyncIndicator` | Header icon animating during sync |

**Rule:** Loading communicates **what** is happening, not just that something is happening.

Prefer skeleton over spinner for content areas > 300ms expected wait.

---

# Chapter 20 — Animation System

Philosophy: **Quick. Subtle. Purposeful.**

| Token | Value |
|-------|-------|
| `duration-fast` | 100ms |
| `duration-normal` | 200ms |
| `duration-slow` | 300ms |
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |

## Patterns

| Animation | Duration | Use |
|-----------|----------|-----|
| Fade | 150ms | Toast enter/exit |
| Slide up | 250ms | Bottom sheet |
| Expand | 200ms | Accordion, checklist |
| Collapse | 150ms | Dismiss sections |
| Success check | 400ms once | First trip celebration only |
| Page transition | 200ms | Next.js view change (subtle fade) |

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` — disable all except opacity; instant sheet open.

No animation blocks user input > 100ms.

---

# Chapter 21 — Haptic Feedback

Mobile PWA via Vibration API where supported (graceful no-op elsewhere).

| Event | Pattern |
|-------|---------|
| Trip started | 10ms light |
| Trip ended | 20ms medium |
| Receipt saved | 10ms light |
| Report generated | `[10, 50, 10]` success |
| Error | `[30, 50, 30]` |
| Destructive confirm | 20ms before action |

Haptics reinforce important actions — never on every tap. Volume 2: no sound in V1.

---

# Chapter 22 — Gesture Library

| Gesture | Meaning | Context |
|---------|---------|---------|
| Tap | Primary select / activate | Universal |
| Double tap | None in V1 | Reserved |
| Long press | Context menu | Trip/receipt cards |
| Swipe left | Quick actions (edit, delete) | List cards |
| Swipe right | Mark complete / archive | Future |
| Pull to refresh | Sync data | Trip list, dashboard |
| Pinch | Zoom receipt image | OCR review only |

**One meaning per gesture globally** — no swipe-left delete on one screen and archive on another.

---

# Chapter 23 — Dashboard Widgets

Modular widgets compose the dashboard (Volume 2 Ch. 3).

| Widget | Component | Data |
|--------|-----------|------|
| Today's mileage | `MileageWidget` | Sum today |
| Month expenses | `ExpenseWidget` | Sum month |
| Active trip | `ActiveTripWidget` | In-progress trip CTA |
| Recent trips | `RecentTripsWidget` | Last 5 `TripCard` |
| Pending receipts | `PendingReceiptsWidget` | Review queue count |
| AI insights | `AIInsightsWidget` | Top suggestion |
| Monthly totals | `MonthlyTotalsWidget` | Miles + $ + deduction est. |
| Upgrade banner | `UpgradeBanner` | Free tier usage meters |
| Quick actions | `QuickActionsWidget` | Start, Scan, Report shortcuts |

Widgets share `DashboardWidgetShell`: title, optional action link, consistent padding.

---

# Chapter 24 — AI Components

AI UI must feel **transparent and collaborative** (Volume 5, Volume 8).

| Component | Purpose |
|-----------|---------|
| `AISuggestionPanel` | Inline suggestion with rationale |
| `ConfidenceBadge` | High / medium / low — color + text, never color alone |
| `AIReviewPanel` | Side-by-side image + extracted fields |
| `AICorrectionForm` | User edits with diff highlight |
| `AIExplanationTooltip` | "Why we suggested this category" |
| `AIProcessingIndicator` | Step text: Uploading → Reading → Suggesting |
| `DuplicateReceiptBanner` | Possible duplicate with link to original |

**Rules:**

* AI never auto-saves financial fields without explicit confirm
* Low confidence fields: `--color-warning` border + helper text
* "Not AI" fallback copy when offline or provider down

---

# Chapter 25 — Search Components

| Component | Use |
|-----------|-----|
| `SearchBar` | Global header search |
| `SearchFilters` | Date range, business, category chips |
| `SavedSearchChip` | Future — pinned filters |
| `RecentSearchList` | Last 5 queries |
| `SearchSuggestionList` | Autocomplete merchants, clients |
| `SearchResultsLayout` | Grouped: Trips · Receipts · Expenses |

Debounce 300ms. Empty → `EmptySearch`. Consistent across Trips and Reports modules.

---

# Chapter 26 — Camera Experience

**Most important interaction** — document completely.

## Flow Components

| Step | Component |
|------|-----------|
| Open | `CameraCaptureScreen` — viewfinder full bleed |
| Permissions | `CameraPermissionPrompt` — explain why |
| Capture | Shutter button 72px, bottom center (thumb zone) |
| Gallery pick | `GalleryPickerButton` — bottom left |
| Flash | Toggle auto/on/off — top right |
| Auto-capture | Future — edge detection hint overlay |
| Crop | `ReceiptCropOverlay` — 4:3 default guide |
| Retake | Secondary button on preview |
| OCR progress | `OCRProcessingOverlay` |
| Review | `ReceiptReviewSheet` (Ch. 16) |
| Confirm | Primary "Save Expense" |

## Native Feel

* iOS: `capture="environment"`, safe-area padding
* Android: same; test Samsung Internet
* Fallback: file input when `getUserMedia` unavailable

Volume 2 target: camera open → save **< 10 sec** excluding OCR latency.

---

# Chapter 27 — Report Viewer

| Component | Purpose |
|-----------|---------|
| `ReportPreview` | In-app PDF preview (iframe or pdf.js) |
| `ExportFormatPicker` | PDF · CSV · Excel chips |
| `ShareSheet` | Native share API + copy link |
| `DownloadButton` | Direct download with filename pattern |
| `PrintLayout` | `@media print` stylesheet |
| `EmailReportButton` | Future — opens mailto with attachment note |
| `ReportHistoryList` | Future — version history |

Filename pattern: `{business}-{report-type}-{date-range}.{ext}`

Polished export reinforces trust (Volume 8 Trust Promise).

---

# Chapter 28 — Mobile Component Rules

Design for **field use first** (Volume 2).

| Rule | Spec |
|------|------|
| Thumb reach | Primary actions in bottom third |
| One-handed | Critical flows completable one-handed |
| Bottom sheets | Prefer over full modals for choices |
| Safe areas | `padding-bottom: env(safe-area-inset-bottom)` |
| Keyboard avoidance | Scroll focused input above keyboard |
| Offline indicator | `OfflineBanner` in header |
| Tap targets | Minimum 44×44px; primary CTAs 48px |
| Fixed bottom CTA | `StickyFooterAction` with safe-area |

Test on 6.1″ iPhone and mid-size Android annually.

---

# Chapter 29 — Desktop Component Rules

Desktop **enhances productivity** without feeling like a separate product.

| Rule | Implementation |
|------|----------------|
| Responsive layouts | Sidebar + content pane |
| Keyboard shortcuts | `/` search, `n` new trip, `Esc` close modal |
| Resizable tables | Column drag (V1.1); horizontal scroll V1 |
| Hover states | Row highlight, button hover — no hover-only critical actions |
| Multi-column dashboard | 2–3 widget columns at `lg` |
| Printable reports | `@media print` hides chrome |

Same components as mobile — layout differs, not styling.

---

# Chapter 30 — Accessibility Standards

**Accessibility is part of the component definition**, not optional (Volume 9 Ch. 11).

Every component documents:

| Requirement | Standard |
|-------------|----------|
| Screen readers | Semantic HTML, `aria-*`, live regions for toasts |
| Keyboard | Full tab order; Enter/Space activate; Escape dismiss |
| Focus | Visible 2px ring; focus trap in modals |
| Contrast | WCAG 2.1 AA minimum |
| Scalable text | Works at 200% zoom |
| Labels | Every input has `<label>` or `aria-label` |
| Touch | 44px targets (mobile) |
| Motion | `prefers-reduced-motion` respected |

Component checklist in Storybook/docs (Ch. 38) before merge.

---

# Chapter 31 — Dark Mode

**No component ships without both themes.**

| Element | Light | Dark |
|---------|-------|------|
| Background | Off-white | Deep slate |
| Surfaces | White cards | Elevated slate |
| Text | Near-black | Near-white |
| Borders | Light gray | Subtle slate border |
| Images | Normal | Slight brightness reduction optional |
| Icons | `--color-text-primary` | `--color-text-primary` |
| Charts | Palette with contrast | Adjusted luminance |
| Empty states | Muted icons | Same tokens |

Implementation: `class="dark"` on `<html>` + system preference default. User override in Settings.

Test every component in both modes before approval (Ch. 40).

---

# Chapter 32 — Error Components

| Component | Scenario |
|-----------|----------|
| `ValidationError` | Inline field error |
| `FormErrorSummary` | Top of form — list of issues |
| `NetworkErrorState` | Full page retry |
| `OCRErrorState` | "Couldn't read receipt" + manual entry |
| `SyncConflictPanel` | Server vs local diff; user chooses |
| `PaymentErrorBanner` | Stripe failure + update payment CTA |
| `AuthErrorState` | Session expired → re-login |

**Pattern:** What happened → Why (if helpful) → What to do next.

Never expose stack traces or internal error codes to users.

---

# Chapter 33 — Success Components

| Component | Trigger |
|-----------|---------|
| `TripSavedToast` | Trip started / completed |
| `ReceiptProcessedToast` | OCR save success |
| `ReportGeneratedToast` | Export ready + download action |
| `SubscriptionUpdatedBanner` | Plan change confirmed |
| `SyncCompleteIndicator` | Brief header checkmark |
| `FirstTripCelebration` | One-time confetti-free animation (Ch. 20) |

Consistent confirmation patterns — user always knows action succeeded.

---

# Chapter 34 — Notification Components

| Component | Channel |
|-----------|---------|
| `NotificationBell` | Header with unread badge |
| `NotificationCenter` | Sheet listing in-app notifications |
| `NotificationListItem` | Icon, title, body, timestamp |
| `PushPreviewCard` | Settings preview of push copy |
| `EmailTemplateLayout` | Transactional email shell (Volume 7) — logo, body slot, footer |

In-app and email share typography and color tokens for brand consistency.

---

# Chapter 35 — Responsive Rules

Every component documents behavior at each breakpoint:

| Breakpoint | Typical adaptation |
|------------|-------------------|
| Phone (<768px) | Single column, bottom nav, full-width buttons |
| Small tablet | 2-column dashboard |
| Large tablet | Sidebar visible, 2-column forms |
| Laptop | Master-detail trips |
| Desktop | 3-column dashboard, tables full |
| Ultra-wide | Content max-width 1200px centered |

Document in component spec table (Ch. 38 template). No guessing during implementation.

---

# Chapter 36 — Component Naming Convention

## Pattern

`{Domain}{Purpose}{Type}` — PascalCase React components.

| ✓ Good | ✗ Bad |
|--------|-------|
| `TripCard` | `Widget1` |
| `ReceiptUploader` | `HelperComponent` |
| `MileageSummaryCard` | `Card2` |
| `PrimaryButton` | `BlueButton` |
| `CurrencyInput` | `MoneyField` |
| `AISuggestionPanel` | `AIWidget` |

## File Paths

```
apps/web/src/components/
├── ui/              # shadcn primitives (Button, Dialog, …)
├── layout/          # BottomNav, SidebarNav, TopBar
├── dashboard/       # MileageWidget, …
├── trips/           # TripCard, StartTripForm, …
├── receipts/        # CameraCaptureScreen, ReceiptReviewSheet, …
├── reports/         # ReportPreview, ExportFormatPicker, …
├── billing/         # UpgradeModal, UsageMeter, …
├── forms/           # FormField, CurrencyInput, …
├── ai/              # AISuggestionPanel, ConfidenceBadge, …
└── feedback/        # Toast, EmptyTrips, AlertError, …
```

Hooks: `use{Feature}` — e.g. `useActiveTrip`, `useOfflineSync`.

---

# Chapter 37 — Design Tokens

Centralize in **`apps/web/src/styles/tokens.css`** and **`tailwind.config.ts`**.

| Category | Location |
|----------|----------|
| Colors | CSS variables → Tailwind `colors` |
| Typography | Tailwind `fontSize` |
| Spacing | Tailwind `spacing` (4px base) |
| Borders | `borderRadius`, `borderWidth` |
| Shadows | `boxShadow` |
| Animation | `transitionDuration`, `transitionTimingFunction` |
| Icon sizes | Tailwind `width/height` utilities |
| Breakpoints | Tailwind `screens` |

**Rule:** No hex, rgb, or arbitrary px in component files except token definitions.

shadcn theme maps: `--background`, `--foreground`, `--primary`, etc. → Volume 10 semantic tokens.

---

# Chapter 38 — Component Documentation

Every reusable component in `components/` (excluding page files) requires a doc entry.

## Template

```markdown
## ComponentName

**Purpose:** One sentence.
**Props:** | Prop | Type | Default | Description |
**States:** default, loading, error, disabled, …
**Accessibility:** aria roles, keyboard, focus
**Responsive:** phone / tablet / desktop behavior
**Usage:**
  ✓ Do: …
  ✗ Don't: …
**Performance:** memoization, lazy load notes
```

**Location:** `apps/web/src/components/{module}/ComponentName.md` or Storybook stories with MDX.

Becomes the reference for developers, designers, and AI agents.

---

# Chapter 39 — Versioning Strategy

Treat the design system as **its own product**.

| Change type | Version bump | Action |
|-------------|--------------|--------|
| Token value tweak (non-breaking) | Patch | Update changelog |
| New optional prop | Minor | Document |
| Removed prop / changed behavior | Major | Migration guide |
| Renamed component | Major | Codemod or alias period |

Breaking changes require updating all dependent screens intentionally — grep before merge.

Design system changelog: `docs/design-system/CHANGELOG.md` (create Phase A).

---

# Chapter 40 — Design Review Checklist

Before a component enters the official library:

| # | Check |
|---|-------|
| 1 | Matches design language (Ch. 2–3) |
| 2 | Accessible (Ch. 30) — axe clean |
| 3 | Responsive (Ch. 35) — all breakpoints |
| 4 | Light + dark mode (Ch. 31) |
| 5 | Offline behavior where applicable |
| 6 | Uses design tokens only (Ch. 37) |
| 7 | Documented (Ch. 38) |
| 8 | Supports localization (no hardcoded strings — i18n-ready) |
| 9 | Performance acceptable (Ch. 41) |
| 10 | Reviewed by design + engineering |

Only then merged to `main` and listed in component inventory (Ch. 42).

---

# Chapter 41 — UI Performance Standards

Performance is part of the design.

| Standard | Target |
|----------|--------|
| Component render | Avoid unnecessary re-renders — `React.memo` on list items |
| List virtualization | Trip list > 100 items → virtual scroll |
| Images | Receipt thumbnails lazy-loaded; WebP where supported |
| Animations | GPU-friendly transforms only; no layout thrashing |
| Bundle | Route-level code split; heavy pdf.js lazy |
| Battery | No infinite animations; pause off-screen work |

Lighthouse performance budget: LCP < 2.5s (Volume 9 Ch. 12).

---

# Chapter 42 — Version 1 Component Inventory

**Target:** ~50 reusable components · ~45 V1 screens (Volume 2) · composed views ~150 when counting states/modals.

## Foundation (ui + layout) — 14

| Component | Screens using |
|-----------|---------------|
| `PrimaryButton`, `SecondaryButton`, `IconButton`, `FloatingActionButton` | All |
| `FormField`, `TextInput`, `CurrencyInput`, `MileageInput` | Forms |
| `BottomNav`, `SidebarNav`, `TopBar`, `ActiveTripBanner` | Shell |
| `Toast`, `Dialog`, `Sheet` | Global |

## Domain — 36

| Component | Primary screens |
|-----------|-----------------|
| `TripCard`, `TripTable` | Trip List, Dashboard |
| `StartTripForm` | Start Trip |
| `ActiveTripView` | Active Trip |
| `EndTripWizard` | End Trip (3 steps) |
| `ReceiptCard`, `CameraCaptureScreen`, `ReceiptReviewSheet` | Scan flow |
| `ExpenseForm` | Manual expense |
| `DashboardMetricCard`, `MileageWidget`, `QuickActionsWidget` | Dashboard |
| `AISuggestionCard`, `ConfidenceBadge` | Dashboard, OCR |
| `ReportCard`, `ReportPreview`, `ExportFormatPicker` | Reports |
| `UpgradeModal`, `UsageMeter` | Billing limits |
| `EmptyTrips`, `EmptyReceipts`, `EmptyReports`, … | Empty states |
| `OfflineBanner`, `SyncIndicator` | Global |
| `SearchBar`, `SearchResultsLayout` | Trips search |
| `VehicleCard`, `BusinessCard` | Settings, onboarding |
| `ConfirmDialog`, `DeleteDialog` | Delete flows |
| `OCRProcessingOverlay`, `SkeletonCard` | Loading |

## Screen → Component Map (sample)

| Screen (Volume 2) | Components composed |
|-------------------|---------------------|
| Dashboard | `TopBar`, `MileageWidget`, `RecentTripsWidget`, `TripCard`×n, `BottomNav` |
| Start Trip | `StartTripForm`, `StickyFooterAction`, `PrimaryButton` |
| Camera / OCR | `CameraCaptureScreen`, `OCRProcessingOverlay`, `ReceiptReviewSheet` |
| Trip List | `SearchBar`, `TripCard`×n or `TripTable`, `EmptyTrips` |
| Mileage Report | `ReportCard`, `ExportFormatPicker`, `ReportPreview` |

Full mapping spreadsheet: `docs/design-system/v1-screen-map.md` (create Phase A).

---

# Chapter 43 — Design System Non-Negotiables

| # | Rule |
|---|------|
| 1 | Every UI element comes from the design system |
| 2 | No hardcoded colors or spacing |
| 3 | No one-off button styles |
| 4 | No duplicate components with overlapping purposes |
| 5 | Every component supports accessibility |
| 6 | Every component supports light and dark themes |
| 7 | Every component is documented before reuse |
| 8 | Icons from Lucide only — one family |
| 9 | AI UI never auto-commits financial data |
| 10 | Primary actions stay in thumb reach on mobile |

Violations require design review exception logged in PR.

---

# Chapter 44 — The Ultimate Design Principle

The design system should make the product feel **inevitable**.

A user should never stop to think about the interface. They should simply move from task to task with confidence.

> **If you removed every logo from the application, someone who had used it for a week should still recognize it instantly by how it feels to use.**

That is the standard this design system strives to achieve.

---

## Implementation Stack

| Layer | Technology |
|-------|------------|
| Primitives | shadcn/ui (Radix + Tailwind) |
| Icons | Lucide React |
| Tokens | CSS variables + Tailwind config |
| Docs | Storybook (Phase G) or co-located MD |
| Figma | Mirror token page + component library |

Phase A scaffold initializes shadcn with Volume 10 tokens before any feature screens.

---

## Document Map

| Need | Go to |
|------|-------|
| Screens & journeys | [Volume 2](02-user-experience.md) |
| Functional validation | [Volume 3](03-functional-requirements.md) |
| AI behavior | [Volume 5](05-ai-design.md) |
| File structure | [Volume 6 Ch. 4](06-technical-architecture.md) |
| Accessibility QA | [Volume 9 Ch. 11](09-testing-quality.md) |
| V1 screen list | [Volume 11 SCR-INDEX](../screen-catalog/SCR-INDEX.md) |

---

*Previous: [Volume 9 — Quality Assurance & Release Engineering](09-testing-quality.md) | Next: [Volume 11 — Complete Screen Bible](11-screen-bible.md)*
