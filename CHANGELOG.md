# Changelog

All notable changes to **Mileage & Expense Copilot** are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Build steps are traceable via [BUILD-LOG.md](BUILD-LOG.md).

---

## [Unreleased]

### Added
- Post-V1.2 backlog: notifications, global search

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
