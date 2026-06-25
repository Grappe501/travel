# MEC-V2-S001 — Help center (SCR-051)

**STEP:** STEP-074 · **Target:** 1.14.0 · **ROAD:** ROAD-CAT-UX, ROAD-VER-1.5

---

## Prompt (for build agent)

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V2-S001 — Help center

Mission:
Ship SCR-051 help center with searchable articles so field testers and GA users self-serve support.

Context:
- Execution Packet: docs/execution/VERSION_2_EXECUTION_PACKET.md §8 S001
- Prior: V1.13.0 field test live (STEP-072)
- SCR-051 in docs/screen-catalog/SCR-INDEX.md

Allowed files:
- apps/web/src/app/help/**
- apps/web/src/components/help/**
- content/help/**
- apps/web/src/components/settings/SettingsNavList.tsx
- apps/web/src/lib/navigation/route-catalog.ts
- apps/web/src/lib/app-release.ts
- docs/build-steps/STEP-074-help-center.md
- CHANGELOG.md, BUILD-LOG.md

Forbidden:
- Secrets, unrelated features, silent financial changes

Deliverables:
1. Routes /help (index) and /help/[slug]
2. Minimum 8 articles in content/help/ (MDX or JSON)
3. Search/filter on index page
4. Links from Settings + contextual help on trip start and receipt upload
5. Route catalog + auth: public read
6. APP_RELEASE 1.14.0, STEP-074 doc, tests if trivial

Validation:
pnpm lint && pnpm typecheck && pnpm test && pnpm build

Exit criteria:
- [ ] All 8 launch articles render
- [ ] Mobile-readable layout matches design system v3
- [ ] Settings links to /help
- [ ] V2-SLICE-INDEX S001 → Complete
```

---

## Launch articles (minimum)

1. getting-started
2. start-and-end-trips
3. gps-tracking
4. scan-receipts
5. generate-reports
6. billing-and-plans
7. privacy-and-data
8. field-test-faq

---

## Kanban

☑ Complete
