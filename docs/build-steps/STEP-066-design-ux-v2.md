# STEP-066 — Design & UX v2 (MEC-V1-S034)

**Version:** 1.9.0 · **Slice:** MEC-V1-S034

## Scope

Visual refresh and interaction polish across the authenticated app shell, marketing home, and auth flows.

### Design system v2

- **Palette** — Teal primary, sky accent, refined light/dark semantic tokens
- **Typography** — Plus Jakarta Sans via `next/font/google`
- **Surfaces** — Gradient app background, glass navigation, elevated cards
- **Components** — Button, Card, Input, PageHeader, EmptyState, StatCard, QuickActionGrid

### Shell & navigation

- **DashboardShell** — `app-shell-bg` gradient, updated page header with eyebrow accent
- **BottomNav** — Floating FAB Add button, active tab pill backgrounds
- **AppTopNav** — Logo mark, refined link states
- **GlobalSearchBar** — Unified `input-field` styling with search icon

### Pages

- **Home** — Marketing hero with feature bullets and login/signup CTAs
- **Login / Signup** — Auth card panel on gradient background
- **Dashboard** — StatCard metrics grid, QuickActionGrid with icons, live version badge

## Verification

- [x] Tokens and Tailwind theme extended (`tokens.css`, `tailwind.config.ts`)
- [x] Plus Jakarta Sans loaded in root layout
- [x] Core UI components updated to v2 styles
- [x] Dashboard, auth, and home pages reflect new design
- [x] `APP_RELEASE` → 1.9.0 / STEP-066 / MEC-V1-S034

## Files (primary)

| Area | Path |
|------|------|
| Tokens | `apps/web/src/styles/tokens.css` |
| Globals | `apps/web/src/app/globals.css` |
| Font | `apps/web/src/lib/fonts.ts` |
| UI | `apps/web/src/components/ui/*` |
| Shell | `apps/web/src/components/layout/*` |
| Pages | `apps/web/src/app/page.tsx`, `dashboard/page.tsx`, `login/page.tsx` |
