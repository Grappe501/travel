# STEP-036 — MEC-V1-S004 Design System v1

| Field | Value |
|-------|-------|
| **Step ID** | STEP-036 |
| **Phase** | A |
| **Slice** | MEC-V1-S004 |
| **Date** | 2026-06-24 |
| **Commit** | _(pending)_ |
| **Status** | complete |

## Objective

Reusable UI component library per Volume 10 — tokens, primitives, layout shells; no one-off patterns on primary screens.

## Changes

- `apps/web/src/styles/tokens.css` — semantic color, radius, shadow tokens (light + dark)
- `apps/web/tailwind.config.ts` — typography scale, semantic colors, spacing
- `apps/web/src/components/ui/` — Button, Card, Input, Select, Modal, Badge, Alert, EmptyState, LoadingState, PageHeader
- `apps/web/src/components/layout/` — BottomNav (mobile stub), DashboardShell
- Refactored auth forms, home, dashboard, and route shells to compose from shared components

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

## Traceability

- **BUILD-003** · **UX-COMP-001** through **UX-COMP-011**

## Next step

**STEP-037** — [MEC-V1-S005 Business & vehicle](../execution/slices/MEC-V1-S005-business-vehicle.md)
