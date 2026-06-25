# STEP-071 — Design & UX v3 (MEC-V1-S039)

**Version:** 1.12.0 · **Slice:** MEC-V1-S039

## Scope

Third visual refresh — depth, motion, and layout polish building on v2 (STEP-066) and GPS trip UI (STEP-070).

### Design system v3

- **Tokens** — Mesh gradient, glow shadows, `surface-muted`, 2xl radius
- **Surfaces** — `elevated`, `soft`, `highlight` card variants; stronger glass nav
- **Motion** — `slide-up`, `scale-in` animations; interactive card lift on hover
- **Components** — `SectionHeader`, gradient primary buttons, accent-left alerts

### Shell & navigation

- **DashboardShell** — Wider `max-w-4xl` content area
- **AppTopNav / BottomNav** — Gradient logo mark, `nav-link-active` pill glow
- **ShellPage** — Hero mesh background for auth flows

### Pages

- **Home** — Marketing hero card with mesh backdrop and GPS feature bullet
- **Dashboard** — SectionHeader sections, elevated stat cards with ring borders
- **Settings / Trips** — Consistent section headers; elevated list cards
- **Active trip banner** — `highlight` card variant

## Verification

- [x] Tokens v3 and Tailwind extensions
- [x] Core UI components updated
- [x] Dashboard, home, settings, trips reflect v3
- [x] `APP_RELEASE` → 1.12.0 / STEP-071 / MEC-V1-S039
