# MEC-V1-S004 — Design System v1

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S004 — Design System v1

Mission:
Build reusable UI components per Volume 10 — no one-off patterns on primary screens.

Context:
- Prior: MEC-V1-S003 complete
- Volume 10 design system
- Volume 24 DNA vocabulary

Allowed paths:
apps/web/src/components/ui/**
apps/web/src/components/layout/**
apps/web/tailwind.config.ts
apps/web/src/styles/**

Components (minimum):
Button, Card, Input, Select, Modal, Badge, Alert,
EmptyState, LoadingState, PageHeader, BottomNav, DashboardShell

Forbidden:
- Trip/receipt business logic
- New features — components only
- Inline styles bypassing Tailwind tokens

Deliverables:
1. All components above with variants
2. DashboardShell wraps /dashboard
3. Mobile-first BottomNav stub

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] Primary screens can compose from shared components
- [ ] No duplicate button/card patterns in app routes
- [ ] Accessible focus states on interactive elements

Commit:
feat(ui): MEC-V1-S004 design system v1 components

Step: STEP-036
BUILD-IDs: BUILD-003
Slice: MEC-V1-S004
DRS-IDs: UX-COMP-001 through UX-COMP-011
```
