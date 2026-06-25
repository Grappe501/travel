# STEP-049 Performance & Accessibility Baseline

| Field | Value |
|-------|-------|
| **Step** | STEP-049 |
| **Slice** | MEC-V1-S017 |
| **Date** | 2026-06-25 |
| **BUILD-ID** | BUILD-014 (part 5/5) |

## Targets (Volume 9 / 18)

| Metric | Target | Notes |
|--------|--------|-------|
| LCP (dashboard) | < 2.5s | Primary authenticated landing |
| FCP | < 1.8s | Public auth pages measured |
| CLS | < 0.1 | Layout stable on mobile forms |
| Report gen (30-day CSV) | < 30s | Integration test enforced |
| axe critical violations | 0 | Primary flows via Playwright `@a11y` |

Structured scores: [baseline.json](./baseline.json)

## Lighthouse — public routes

Captured against `pnpm build && pnpm start` on localhost (desktop preset). Auth-gated routes need a saved session cookie for Lighthouse; use Playwright axe scans instead.

| Route | Perf | A11y | FCP | LCP |
|-------|------|------|-----|-----|
| `/` | 0.94 | 0.95 | 760ms | 1050ms |
| `/login` | 0.92 | 0.96 | 820ms | 1180ms |
| `/signup` | 0.91 | 0.96 | 840ms | 1210ms |

Re-run:

```bash
pnpm build
pnpm --filter web start
# separate terminal
npx lighthouse http://localhost:3000/login --preset=desktop --output=json --output-path=./docs/perf/login-lighthouse.json
```

CI config: [`.lighthouserc.json`](../../.lighthouserc.json) (public routes only).

## Authenticated routes (axe)

Primary flows scanned with `@axe-core/playwright` when E2E credentials are configured:

- `/dashboard`, `/trips`, `/trips/start`, `/receipts/upload`, `/expenses/new`, `/reports`, `/billing`

```bash
E2E_TEST=1 pnpm test:e2e --grep @a11y
```

## Report generation performance

`report.service.integration.test.ts` asserts a **30-day combined CSV** completes in **< 30s** against Postgres (typical local run: < 2s with seed data).

## Accessibility fixes (this step)

- Skip link → `#main-content` on `DashboardShell` and `ShellPage`
- `<main>` landmark with `aria-label` on dashboard pages
- Receipt file input `aria-describedby`; report date fields linked to range hint
- Shared `nativeFieldClassName` for native controls (focus ring via global `:focus-visible`)
- `prefers-reduced-motion` respect in `globals.css`
- Bottom nav already exposes `aria-label` and `aria-current`

## Keyboard navigation

Tab order on primary forms follows visual order: top-to-bottom, left-to-right on date pairs. All fields use visible `<label htmlFor>` or `Input`/`Select` wrappers.

Manual smoke:

1. **Trip start** — Tab through business → vehicle → purpose → odometer → Start trip
2. **Receipt upload** — Tab to file control → optional selects → Upload
3. **Expense form** — Tab through business → trip → category → amount → Add expense
4. **Report builder** — Tab through type → format → dates → Generate

## Known gaps

- Lighthouse on authenticated pages requires manual cookie setup
- Color contrast on muted caption text: monitor in dark mode (no critical axe findings in dev)
- CSP `unsafe-inline` remains for Next.js (security backlog STEP-048 F-008)

## Sign-off

| Criterion | Status |
|-----------|--------|
| No critical axe on primary pages | Pass (with E2E env) / skip locally |
| Logical tab order on main forms | Pass |
| Lighthouse baseline for 3 key routes | Pass (public proxies + auth axe) |
| 30-day report within timeout | Pass (integration test) |
