# STEP-049 — MEC-V1-S017 Performance & Accessibility

| Field | Value |
|-------|-------|
| **Step ID** | STEP-049 |
| **Phase** | B |
| **Slice** | MEC-V1-S017 |
| **BUILD-ID** | BUILD-014 (part 5/5) |
| **Date** | 2026-06-25 |
| **Commit** | — |
| **Status** | complete |

## Objective

Lighthouse baselines, keyboard navigation, and axe/eslint a11y pass on primary flows (Volumes 18–19).

## Changes

- Skip link + `<main>` landmarks on `DashboardShell` / `ShellPage`
- Form a11y: `aria-describedby` on receipt upload and report date fields; shared native field styles
- `prefers-reduced-motion` in global CSS; `poweredByHeader: false`
- `.lighthouserc.json`, `docs/perf/baseline.json`, `docs/perf/STEP-049-baseline.md`
- Playwright `@a11y` axe scans on 7 primary authenticated routes
- Report 30-day CSV generation perf assertion (< 30s) in integration tests
- Health: `/health` → `MEC-V1-S017` / `STEP-049`

## Verification

```bash
pnpm lint            # pass
pnpm typecheck       # pass
pnpm build           # pass
pnpm test            # pass
E2E_TEST=1 pnpm test:e2e:a11y  # optional — axe on primary pages
```

## Traceability

- **BUILD-014** (part 5/5) · Volume 9 perf table · Volume 18 a11y checklist

## Next step

**STEP-050** — [MEC-V1-S018 Production ops](../execution/slices/MEC-V1-S018-production-ops.md)

GA roadmap: [ROADMAP-043-052.md](../execution/ROADMAP-043-052.md)
