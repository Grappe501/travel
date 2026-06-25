# Volume 9 — Testing & Quality

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

Test strategy, quality gates, accessibility, and release checklist.

---

## Quality Goals (from Volume 0)

| Action | Target | Test type |
|--------|--------|-----------|
| Record a trip | < 1 min | E2E timing |
| Capture receipt | < 10 sec | E2E (excl. OCR latency) |
| Generate report | < 30 sec | Integration + perf |
| Find receipt | < 5 sec | E2E search |
| Learn without tutorial | Qualitative | User testing |

---

## Test Pyramid

```
        ┌─────────┐
        │   E2E   │  Playwright — critical paths
        ├─────────┤
        │ Integr. │  Supabase + Edge Functions (local/staging)
        ├─────────┤
        │  Unit   │  calculations, schemas, utils (Vitest)
        └─────────┘
```

**Coverage targets (V1):**
- `packages/shared/calculations`: 95%+ line coverage
- `packages/shared/schemas`: 90%+
- UI components: critical paths only — not 100%

---

## Unit Tests

### `packages/shared/calculations`

| Function | Cases |
|----------|-------|
| `calculateMiles(start, end)` | Normal, equal, decimal, invalid (end < start) |
| `calculateReimbursement(miles, rate)` | IRS rate, custom rate, zero miles |
| `resolveMileageRate(user, business, vehicle)` | Priority order |
| `aggregateTripTotals(expenses)` | Empty, single, multiple |
| `aggregateDashboardMetrics(trips, expenses, tz)` | Timezone boundaries, month rollover |

### `packages/shared/schemas`

- Zod schemas reject invalid trip start (missing purpose)
- Expense amount precision (2 decimals)
- Receipt date not in future

**Runner:** Vitest  
**Location:** `packages/shared/**/*.test.ts`

---

## Integration Tests

### Supabase (local or staging)

| Scenario | Assert |
|----------|--------|
| Create trip as user A | Row exists with user_id |
| User B reads user A trip | Empty / permission denied |
| Complete trip | miles, totals computed correctly |
| Upload receipt | Storage object + receipts row |
| Increment usage counter | Free tier blocks 6th trip |
| Stripe webhook (mock) | subscriptions updated |

**Runner:** Vitest + Supabase local  
**Location:** `supabase/tests/` or `apps/web/tests/integration/`

---

## E2E Tests (Playwright)

Install browsers to `H:\Travel-Expense\.cache\playwright` via env var.

### Critical paths (must pass before deploy)

| ID | Flow |
|----|------|
| E2E-01 | Sign up → onboarding → dashboard |
| E2E-02 | Start trip → add manual expense → end trip → see summary |
| E2E-03 | Scan receipt (mock OCR response) → confirm → expense on trip |
| E2E-04 | Generate mileage PDF report → download succeeds |
| E2E-05 | Free tier: 6th trip blocked with upgrade prompt |
| E2E-06 | Edit trip → audit log entry created |
| E2E-07 | Delete account → cannot login, data inaccessible |

### Mobile viewport

Run E2E-01 through E2E-03 at 390×844 (iPhone 14).

**Mock OCR in E2E:** Intercept Edge Function response — do not call OpenAI in CI.

---

## OCR Accuracy Testing

Separate from CI — manual + semi-automated suite.

| Dataset | Size | Purpose |
|---------|------|---------|
| Golden receipts | 50 images | Regression on OCR fields |
| Edge cases | 20 images | Faded, crumpled, handwritten, non-US |

**Metrics per run:**
- Field extraction accuracy (total, merchant, date)
- Category suggestion acceptance (human label)

Run before each prompt version bump.

---

## Mileage Calculation Verification

| Case | start_odo | end_odo | Expected miles |
|------|-----------|---------|----------------|
| Standard | 10000.0 | 10045.5 | 45.5 |
| Same | 5000 | 5000 | 0 |
| Invalid | 100 | 50 | Error |

GPS distance fallback: mock haversine tests with known coordinates.

---

## PDF / Export Generation Tests

| Format | Assert |
|--------|--------|
| PDF | Valid PDF magic bytes, contains trip count text |
| CSV | Correct headers, row count matches filter |
| Excel | Opens without error, sheet names correct |

Snapshot test PDF text content (not binary snapshot).

---

## Offline Mode Tests

| Scenario | Expected |
|----------|----------|
| Start trip offline | Saved to IndexedDB, syncs on reconnect |
| Duplicate sync | Idempotent — one trip on server |
| Offline banner visible | UI indicator |

Playwright: `context.setOffline(true)`

---

## Security Tests

| Test | Method |
|------|--------|
| RLS isolation | Integration tests two users |
| IDOR on trip URL | E2E user B gets 404 on user A trip |
| XSS in purpose field | Stored string escaped in render |
| Unauthenticated API | Edge Function returns 401 |

Annual: OWASP ZAP scan on staging.

---

## Performance Tests

| Scenario | Target | Tool |
|----------|--------|------|
| Dashboard load | LCP < 2.5s | Lighthouse CI |
| Trip list (100 trips) | TTFB + render < 1s | Playwright trace |
| Report gen (100 trips) | < 10s | Integration timer |
| OCR pipeline | P95 < 5s | Staging monitor |

Load test (optional pre-launch): k6 script — 50 concurrent report requests.

---

## Accessibility Tests

| Check | Tool |
|-------|------|
| Automated | axe-core in Playwright |
| Keyboard nav | Manual checklist on 5 core screens |
| Screen reader | VoiceOver spot check (start trip, scan, report) |
| Color contrast | axe + manual sunlight simulation |

**WCAG 2.1 AA** — document known exceptions if any.

---

## Device Compatibility

| Platform | Browsers |
|----------|----------|
| iOS | Safari 16+, Chrome |
| Android | Chrome, Samsung Internet |
| Desktop | Chrome, Firefox, Safari, Edge (last 2 versions) |

PWA install tested on iOS Safari + Android Chrome.

---

## CI Pipeline Quality Gates

```yaml
# All must pass to merge PR
- lint (ESLint)
- typecheck (tsc --noEmit)
- unit tests
- integration tests (if Supabase available in CI)
- E2E (smoke subset on PR; full on main)
- Lighthouse performance budget (optional warn)
```

---

## Regression Testing

Before each release tag:

1. Full E2E suite
2. OCR golden set (if prompt changed)
3. Manual smoke on Netlify preview (mobile + desktop)
4. Stripe test mode checkout flow

---

## Release Checklist

### Version bump

- [ ] CHANGELOG updated
- [ ] Migration applied to staging
- [ ] E2E green on staging
- [ ] No critical Dependabot alerts

### Production deploy

- [ ] Migration applied to production
- [ ] Edge Functions deployed
- [ ] Netlify env vars verified
- [ ] Smoke test production (login, trip, scan mock, report)
- [ ] Monitor Sentry for 30 min post-deploy

### Rollback plan

- Netlify: instant rollback to previous deploy
- Database: forward-only migrations — write reverse migration if risky
- Edge Functions: redeploy previous version tag

---

## Beta Testing Program

**Phase:** 2 weeks before public launch

- 5–10 users from target personas
- Feedback form: task completion, confusion points, OCR accuracy
- Success: 8/10 users complete trip + receipt without assistance

---

## Definition of Done (Feature)

A feature is done when:

1. Matches Volume 3 functional requirements
2. UI matches Volume 2 screen spec
3. RLS policies in place (Volume 4, 8)
4. Unit tests for business logic
5. E2E if critical path
6. Accessible (axe clean on new screens)
7. Documented in changelog if user-facing

---

*Previous: [Volume 8 — Security](08-security.md) | Return to [Blueprint Index](README.md)*
