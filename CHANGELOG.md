# Changelog

All notable changes to **Mileage & Expense Copilot** are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Build steps are traceable via [BUILD-LOG.md](BUILD-LOG.md).

---

## [Unreleased]

### Added
- Post-GA backlog: category AI suggestions (MRID-000018), client/project modules

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

[Unreleased]: https://github.com/Grappe501/travel/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Grappe501/travel/compare/v0.0.0...v1.0.0
[0.0.0]: https://github.com/Grappe501/travel/releases/tag/v0.0.0
