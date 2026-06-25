# MEC-V1-S017 — Performance & Accessibility

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S017 — Performance & Accessibility

Mission:
WAVE-010 performance and accessibility pass — meet Volume 9 perf budgets and Volume 18 a11y checklist on primary user flows.

Context:
- Prior: MEC-V1-S016 (STEP-048) complete
- BUILD-ID: BUILD-014 (perf/a11y tranche)
- Volumes: 18 Ch. 22, 19 OPS-PERF, Volume 9 perf table
- Targets: LCP < 2.5s dashboard; report gen P95 reasonable; keyboard nav on forms

Allowed paths:
apps/web/src/app/** (a11y fixes only)
apps/web/src/components/** (a11y fixes only)
apps/web/next.config.ts (headers, bundle tweaks)
.lighthouserc.json or docs/perf/baseline.json
apps/web/e2e/a11y/** (optional axe checks)
docs/perf/STEP-049-baseline.md

Rules:
- Fix regressions only on touched flows — no redesign
- All form fields need labels; buttons need accessible names
- Focus visible on interactive elements
- Report PDF generation — document max date range perf smoke
- Lighthouse run on /dashboard, /trips, /receipts/upload — record baseline

Forbidden:
- Large refactors or new features
- Disabling eslint a11y rules globally without fixes
- Perf optimizations that weaken security

Deliverables:
1. axe or eslint-jsx-a11y pass on primary pages
2. Keyboard navigation works on trip start, receipt upload, expense form, report builder
3. Lighthouse CI config or documented manual baseline (JSON)
4. next.config optimizations if needed (images, serverExternalPackages already set)
5. docs/perf/STEP-049-baseline.md with LCP/FCP scores and known gaps
6. Skip links or landmark roles on DashboardShell if missing

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [x] No critical axe violations on dashboard, trips, receipts, expenses, reports, billing
- [x] Tab order logical on main forms
- [x] Lighthouse baseline documented for 3 key routes
- [x] Report generation completes within documented timeout for 30-day range

Commit:
perf(a11y): MEC-V1-S017 performance and accessibility pass

Step: STEP-049
BUILD-IDs: BUILD-014 (part 5/5)
MRID-IDs: —
```
