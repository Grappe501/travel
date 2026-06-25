# Changelog

All notable changes to **Mileage & Expense Copilot** are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Build steps are traceable via [BUILD-LOG.md](BUILD-LOG.md).

---

## [Unreleased]

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
