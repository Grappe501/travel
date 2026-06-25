# STEP-048 — MEC-V1-S016 Security Hardening

| Field | Value |
|-------|-------|
| **Step ID** | STEP-048 |
| **Phase** | B |
| **Slice** | MEC-V1-S016 |
| **BUILD-ID** | BUILD-014 (part 4/5) |
| **Date** | 2026-06-25 |
| **Commit** | `23b1895` |
| **Status** | complete |

## Objective

Security audit and remediation — auth boundaries, RLS, storage privacy, Stripe webhook verification (Volumes 8–9).

## Changes

- `docs/security/STEP-048-audit.md` — findings log + sign-off
- `lib/security/rate-limit.ts` — upload 20/min, OCR 10/min per user
- `lib/receipts/magic-bytes.ts` — content sniffing on receipt upload
- `lib/security/headers.ts` + `next.config.ts` + `netlify.toml` — CSP, HSTS, security headers
- `*.security.test.ts` — API auth inventory, 401, IDOR 404, webhook signature
- Stripe webhook returns 400 on invalid signature (not 500)
- `/health` omits config flags in production
- Health: `/health` → `MEC-V1-S016` / `STEP-048`

## Verification

```bash
pnpm lint            # pass
pnpm typecheck       # pass
pnpm build           # pass
pnpm test            # pass (17 web + 41 shared; IDOR tests run with integration DB)
```

## Traceability

- **BUILD-014** (part 4/5) · Volume 8 security checklist

## Next step

**STEP-049** — [MEC-V1-S017 Performance & a11y](../execution/slices/MEC-V1-S017-perf-a11y.md)

GA roadmap: [ROADMAP-043-052.md](../execution/ROADMAP-043-052.md)
