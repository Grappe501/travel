# Changelog

All notable changes to **Mileage & Expense Copilot** are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Build steps are traceable via [BUILD-LOG.md](BUILD-LOG.md).

---

## [Unreleased]

---

## [1.12.0] — 2026-06-25

**Mileage & Expense Copilot — V1.12.0 (STEP-071)**

Design & UX v3 — depth, motion, and layout polish.

### Added
- **Design tokens v3** — Mesh gradients, glow shadows, surface-muted palette
- **Card variants** — `elevated`, `soft`, `highlight` for hierarchy
- **SectionHeader** — Consistent section titles across dashboard and settings
- **Motion** — slide-up and scale-in animations

### Changed
- **Shell layout** — Wider content area (`max-w-4xl`), refined glass navigation
- **Home hero** — Elevated marketing card with feature list including GPS
- **Stat cards & quick actions** — Ring borders, hover lift, chevron affordance
- **Alerts** — Left-accent border styling
- **Active trip banner** — Highlight card treatment

---

## [1.11.0] — 2026-06-25

**Mileage & Expense Copilot — V1.11.0 (STEP-070)**

GPS trip tracking — foreground mileage capture, route history, and FR-500 mileage precedence.

### Added
- **GPS tracking** — Opt-in “Track mileage with GPS” on trip start and active trips
- **`trip_gps_points`** — Batch API, route summary, SVG polyline map, timeline
- **FR-500 mileage** — Odometer authoritative; GPS fallback; >10% divergence review flag
- **Offline GPS queue** — Buffered point uploads sync with existing offline engine
- **Settings → Data & privacy** — Location defaults and high-accuracy toggle
- **Health** — `gpsTrackingReady` schema flag

### Changed
- **End trip** — Odometer optional when GPS tracking provides mileage
- **Trip detail** — Route section for completed trips with GPS data

---

**Mileage & Expense Copilot — V1.10.0 (STEP-069)**

PWA install — home screen app with custom icon and offline shell.

### Added
- **Web app manifest** — Installable standalone app with teal MEC icon
- **Service worker** — Offline fallback, static asset cache, visited-page cache
- **Install prompts** — Home, dashboard, and Settings → Install app
- **iOS guidance** — Add to Home Screen instructions for Safari

### Changed
- **CSP** — `worker-src` and `manifest-src` for service worker support
- **Offline UX** — Branded offline page when network unavailable

---

## [1.9.2] — 2026-06-25

**Mileage & Expense Copilot — V1.9.2 (STEP-068)**

Sandbox audit — route/link validation, auth middleware gaps, and deploy hardening.

### Added
- **Route catalog** — Automated audit that every nav/settings link resolves to a page
- **Public smoke E2E** — Health check JSON, public pages, and protected-route redirects

### Fixed
- **Auth middleware** — `/search` and `/notifications` now protected with session refresh
- **Netlify build** — `corepack enable`, pnpm 9.15.0 aligned with packageManager
- **Lint** — Unused param in notifications PATCH handler

---

## [1.9.1] — 2026-06-25

**Mileage & Expense Copilot — V1.9.1 (STEP-067)**

Settings completion — account, appearance, and security sub-screens.

### Added
- **Account settings** — `/settings/account` with profile fields and `PATCH /api/settings/account`
- **Appearance** — `/settings/appearance` with light/dark/system theme (local storage)
- **Security** — `/settings/security` with password change and email verification
- **Settings hub** — Grouped navigation tiles for account, preferences, and workspace

### Changed
- **Theme system** — `data-theme` override with boot script to prevent flash
- **SCR-047–049** — Account, appearance, and security screens marked complete

---

## [1.9.0] — 2026-06-25

**Mileage & Expense Copilot — V1.9.0 (STEP-066)**

Design & UX v2 — visual refresh, typography, and shell polish.

### Added
- **Design system v2** — Teal primary palette, gradient backgrounds, glass navigation, Plus Jakarta Sans
- **StatCard & QuickActionGrid** — Dashboard metrics and action tiles with icons
- **Auth panel** — Elevated card layout for login and signup

### Changed
- **UI components** — Button, Card, Input, PageHeader, EmptyState restyled with v2 tokens
- **Navigation** — Bottom nav FAB, active tab pills, desktop logo mark
- **Home page** — Marketing hero with feature bullets and CTAs
- **Dashboard** — Stat grid, quick actions, live version badge from `APP_RELEASE`

---

## [1.8.2] — 2026-06-25

**Mileage & Expense Copilot — V1.8.2 (STEP-065)**

Production hardening — readiness gates, migration runbook, and deploy tooling.

### Added
- **Production readiness** — `/health` `readiness.gates[]` with core vs production tiers and hints
- **Stripe mode** — `readiness.stripeMode` (`live` / `test` / `off`) on health endpoint
- **Migration runbook** — `docs/runbooks/database-migrations.md` (OPS-RB-011)
- **Env checker** — `pnpm prod:check-env -- --tier=production`
- **Sentry releases** — commit SHA wired as `release` on server and client

### Changed
- **Admin health** — production readiness checklist with gate hints
- **CI** — `db:verify-schema` after migrate; concurrency group; manual dispatch
- **Stripe / email flags** — publishable key and verified sender required for `dependencies.*Configured`

---

## [1.8.1] — 2026-06-25

**Mileage & Expense Copilot — V1.8.1 (STEP-064)**

Delete UX v2 — modal confirmation and undo toast across all remove flows.

### Added
- **ConfirmDeleteDialog** — accessible remove confirmation modal (SCR-057)
- **Undo toast** — 5-second undo after delete via `POST /api/restore`
- **Report delete** — `DELETE /api/reports/[id]` with list and detail remove actions
- **Restore service** — soft-undelete for trips, expenses, receipts, reports, clients, projects, businesses, vehicles

### Changed
- **RemoveEntryButton** — modal + undo replaces `window.confirm` everywhere
- **Receipt delete** — defers storage file removal so undo can restore

---

## [1.8.0] — 2026-06-25

**Mileage & Expense Copilot — V1.8 (STEP-063)**

Navigation information architecture v2 — five-tab mobile shell with Add/More sheets.

### Added
- **Five-tab bottom nav** — Home, Trips, Add (FAB), Reports, More (drawer)
- **Add sheet** — Start trip, upload receipt, add expense quick actions
- **More drawer** — Receipts, expenses, clients, search, notifications, settings, billing
- **Desktop nav** — Search in primary bar; Add/More sheets; notification bell retained
- **Contextual quick actions** — Trip-focused mobile shortcuts on detail and list flows

### Fixed
- **CI workflow** — E2E smoke tests skip when secrets are unset (GitHub Actions `if:` restriction)

---

## [1.7.0] — 2026-06-25

**Mileage & Expense Copilot — V1.7 (STEP-062)**

Search filters for date, amount, type, and category.

### Added
- **Search filters** — `from`/`to` dates, `amountMin`/`amountMax`, `kind`, `category` on API-SRH-001
- **Filter-only search** — browse by date or amount without a text query
- **Search UI** — collapsible Filters panel on `/search` with URL-synced params

---

## [1.6.0] — 2026-06-25

**Mileage & Expense Copilot — V1.6 (STEP-061)**

Monetization polish, legal trust pages, account export, and transactional email.

### Added
- **Legal** — Privacy, Terms, and Refund policies at `/legal/*` with footer links
- **Usage UX** — Dashboard/billing usage meters with 80% warnings; upgrade CTA when limits hit
- **API-EXP-010** — `POST /api/export/account` JSON data export
- **SCR-050** — `/settings/privacy` export panel and legal links
- **Email** — Resend trip-ended and receipt-processed emails (notification prefs)

---

## [1.5.0] — 2026-06-25

**Mileage & Expense Copilot — V1.5 (STEP-060)**

Unified global search across core entities.

### Added
- **API-SRH-001** — `GET /api/search?q=` grouped results
- **Search page** — `/search` with 300ms debounced live results (SCR-043)
- **Amount search** — prefix query with `$` for exact expense/receipt amounts
- **Search bar** — in app shell on every page; dashboard quick action
- **Keyboard** — `/` focuses search on the search page

---

## [1.4.0] — 2026-06-25

**Mileage & Expense Copilot — V1.4 (STEP-059)**

In-app notification center with trip and receipt reminders.

### Added
- **Notifications table** — deduplicated in-app reminders with read state
- **Notification center** — `/notifications` with mark read and deep links
- **Preferences** — `/settings/notifications` (trip, receipt, checklist toggles)
- **Sync rules** — active trip expenses, forgot-to-end (24h), receipt review pending, post-trip checklist
- **Notification bell** — unread badge in app shell

### Database
- Run `pnpm db:migrate:deploy` for `notifications` and `profiles.notification_prefs`

---

## [1.3.0] — 2026-06-25

**Mileage & Expense Copilot — V1.3 (STEP-058)**

Trip loop polish and dashboard summary upgrade.

### Added
- **End-trip checklist** — "Forgot something?" prompts for unlinked receipts/expenses before completing a trip
- **Dashboard v1.3** — Today's miles, month mileage/expenses/reimbursement, needs-attention items
- **Navigation** — Expenses and Clients in primary app nav (top + bottom)
- **Trip actions** — Duplicate completed trip; delete/cancel trip (soft delete, unlinks expenses)

---

## [1.2.0] — 2026-06-25

**Mileage & Expense Copilot — V1.2 (STEP-053–057)**

Post-GA release: offline sync, AI intelligence on receipts, client/project modules, and AI feedback loop.

### Added
- **Offline sync (MEC-V1-S021)** — IndexedDB queue, offline trip/receipt capture — STEP-053
- **AI duplicate detection (MEC-V1-S022)** — Hash + fuzzy duplicate warnings on receipt review — STEP-054
- **AI category suggestions (MEC-V1-S023)** — Layered category intelligence on receipt review — STEP-055
- **Client & project modules (MEC-V1-S024)** — CRUD, trip tagging, SCR-037–039 — STEP-056
- **AI feedback & history (MEC-V1-S025)** — `ai_interaction_log`, API-AI-003, SCR-041 — STEP-057

### Database
- Run `pnpm db:migrate:deploy` for `clients`/`projects` and `ai_interaction_log` migrations

---

## [1.0.0] — 2026-06-25

**Mileage & Expense Copilot — V1 General Availability (Phase H, STEP-052)**

First production-ready release. All MEC-V1-S001–S020 build slices complete.

### Added
- Full V1 application: auth, onboarding, trips, receipts/OCR, expenses, reports, billing, admin minimum
- Test pyramid: unit, integration, E2E (E2E-01–07), security, accessibility
- Production ops: Sentry (optional), enhanced `/health`, runbooks, production checklist
- GA artifacts: SCR/API catalog audit, device matrix, [GA-CHECKLIST.md](docs/execution/GA-CHECKLIST.md)

### Security
- CSP/HSTS, rate limits, magic-byte upload validation, IDOR tests (STEP-048)

### Known limitations (V1.1 backlog)
- No offline sync · No client/project modules · No AI categorization/duplicate UI
- Legal/marketing pages placeholders — publish before paid acquisition

---

## [0.0.0] — 2026-06-24

### Added
- Master blueprint (Volumes 0–24), MEI, MRMS, V1 execution package, and repository scaffolding (STEP-001–032)

[Unreleased]: https://github.com/Grappe501/travel/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/Grappe501/travel/compare/v1.0.0...v1.2.0
[1.0.0]: https://github.com/Grappe501/travel/compare/v0.0.0...v1.0.0
[0.0.0]: https://github.com/Grappe501/travel/releases/tag/v0.0.0
