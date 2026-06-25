# STEP-074 — Help center (MEC-V2-S001) · V1.14.0

**Target version:** 1.14.0 · **Slice:** MEC-V2-S001 · **ROAD:** ROAD-CAT-UX, ROAD-VER-1.5

## Scope

SCR-051 help center — searchable public articles for field testers and GA users.

### Routes

- `/help` — index with search and category grouping
- `/help/[slug]` — eight launch articles (static generation)

### Articles

1. getting-started
2. start-and-end-trips
3. gps-tracking
4. scan-receipts
5. generate-reports
6. billing-and-plans
7. privacy-and-data
8. field-test-faq

### Integration

- Settings → Support → Help center
- Contextual links on `/trips/start` and `/receipts/upload`
- Route catalog + nav audit
- E2E smoke: `/help`, `/help/getting-started`

## Verification

- [x] Eight articles render
- [x] Search filters index
- [x] Settings link wired
- [x] Route audit passes
- [x] Full sandbox: lint, typecheck, test, integration, e2e smoke, build
- [x] `APP_RELEASE` → 1.14.0 / STEP-074
