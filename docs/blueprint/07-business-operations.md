# Volume 7 — Business Operations

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

Pricing, billing, legal, support, marketing, and launch.

---

## Pricing Tiers (Final V1)

### Free — $0/month

| Feature | Limit |
|---------|-------|
| Trips | 5 per month |
| Receipt scans (AI OCR) | 10 per month |
| Vehicles | 1 |
| Businesses | 1 |
| Reports | PDF only |
| Cloud backup | Yes (within limits) |

**Goal:** Enough to experience full workflow once per week — conversion hook.

### Pro — $4.99/month

| Feature | Limit |
|---------|-------|
| Trips | Unlimited |
| Receipt scans | Unlimited |
| Vehicles | Unlimited |
| Businesses | Unlimited |
| AI OCR | Included |
| Reports | PDF, CSV, Excel |
| Cloud backup | Unlimited |
| Priority email support | 48h response |

**Annual option:** $49.99/year (~17% discount) — add at launch or V1.1.

### Small Business — $19.99/month (V1.1)

- Up to 5 employees
- Approval workflow
- Company mileage rates
- Shared dashboard
- Export by employee
- Admin controls

### Enterprise — Custom

- Unlimited employees, SSO, API, integrations, custom branding, SLA

**V1 ships:** Free + Pro only. Small Business stub in billing UI ("Coming soon").

---

## Stripe Product Configuration

| Stripe Product | Price ID | Metadata |
|----------------|----------|----------|
| Copilot Pro Monthly | price_xxx | plan=pro, interval=month |
| Copilot Pro Annual | price_yyy | plan=pro, interval=year |

**Customer flow:**
1. User clicks Upgrade → Stripe Checkout Session
2. Success → webhook updates `subscriptions`
3. Manage billing → Stripe Customer Portal

**Free tier:** No Stripe customer until first upgrade attempt (create on checkout).

---

## Refund Policy (Draft)

- **Pro monthly:** Full refund within 7 days of first charge if < 5 trips logged
- **Pro annual:** Pro-rata refund within 14 days
- **After window:** Cancel at period end, no refund
- **Abuse:** Duplicate accounts to bypass limits → account suspension

Publish final policy on marketing site before launch.

---

## Terms of Service — Key Points

1. **Not tax advice** — deduction estimates are informational
2. **User responsibility** — accuracy of submitted records
3. **AI limitations** — OCR may contain errors; user verifies
4. **Acceptable use** — no automated scraping, no reselling OCR API
5. **Termination** — user can delete account anytime
6. **Limitation of liability** — standard SaaS caps

Engage legal review before public launch.

---

## Privacy Policy — Key Points

**Data collected:**
- Account info (email, name)
- Trip and expense data (locations, amounts, purposes)
- Receipt images
- Device/browser metadata
- Payment info (via Stripe — not stored by us)

**Data use:**
- Provide service
- Improve OCR (only with explicit opt-in for anonymized training data)
- Support communications

**Data sharing:**
- Processors: Supabase, Stripe, OpenAI (OCR), Netlify, email provider
- No sale of personal data

**Retention:**
- Active account: indefinite until deletion
- Deleted account: 30-day purge
- Receipt images: deleted with account

**Rights:** Access, export, delete — in-app (FR-016)

---

## Support Model (V1)

| Channel | Availability |
|---------|--------------|
| In-app FAQ / Help | 24/7 |
| Email support | Pro: 48h SLA; Free: best effort 5 business days |
| Live chat | Not V1 |

**Support email:** support@mileagecopilot.com (domain TBD)

---

## Knowledge Base Articles (Launch Minimum)

1. How to start and end a trip
2. Scanning receipts — tips for best OCR results
3. Understanding mileage rates (IRS vs custom)
4. Generating an IRS mileage log
5. Exporting data for your accountant
6. Upgrading and managing billing
7. What counts as a business trip (informational, not advice)
8. Deleting your account

---

## Marketing Site (Pre-Launch)

**Domain:** mileagecopilot.com (or similar — verify availability)

**Pages:**
- Home — hero, problem/solution, pricing, CTA
- Features
- Pricing
- FAQ
- Privacy · Terms
- Sign up → app subdomain

**Hero message:** *Never lose another tax deduction.*

**CTA:** Start free — no credit card

Can live in same Next.js repo under `/marketing` route group or separate Netlify site.

---

## Analytics

| Event | Tool |
|-------|------|
| Page views, funnel | Plausible or PostHog (privacy-friendly) |
| Signup, first trip, first receipt | Product analytics |
| Conversion free → Pro | Stripe + internal |
| OCR correction rate | Internal (Volume 5) |

**No Google Analytics V1** unless user prefers — privacy alignment.

---

## Launch Checklist

### Pre-launch (2 weeks)

- [ ] Legal: Terms + Privacy published
- [ ] Stripe live mode products created
- [ ] Supabase production hardened (RLS audit)
- [ ] Netlify custom domain + SSL
- [ ] Error monitoring (Sentry) live
- [ ] Backup verification
- [ ] Load test report generation
- [ ] Accessibility audit (WCAG spot check)
- [ ] Beta users (5–10) complete full trip flow

### Launch day

- [ ] Remove beta flags
- [ ] Monitor Supabase + Netlify dashboards
- [ ] Support inbox staffed
- [ ] Social / email announcement

### Post-launch (30 days)

- [ ] Review conversion metrics
- [ ] OCR correction rate analysis
- [ ] First prompt iteration if correction rate > 15%
- [ ] Collect NPS from Pro users

---

## App Store Strategy (Post-V1)

V1 = **PWA** — no store submission delay.

V1.2+: Capacitor wrapper or React Native for:
- Google Play
- Apple App Store

Requires: app icons, screenshots, store listings, in-app purchase vs Stripe web (Apple 30% consideration — may keep billing web-only).

---

## Roadmap Communication

Public roadmap (Notion or embedded page):

**Now:** V1 core — trips, receipts, reports  
**Next:** Small Business tier, OAuth login  
**Later:** QuickBooks, auto trip detection, native apps

---

## Financial Projections (Internal — Illustrative)

| Metric | Month 3 | Month 12 |
|--------|---------|----------|
| Signups | 500 | 5,000 |
| Pro conversion | 5% | 8% |
| MRR | $125 | $2,000 |

Assumptions for planning only — not commitments.

---

*Previous: [Volume 6 — Technical Architecture](06-technical-architecture.md) | Next: [Volume 8 — Security](08-security.md)*
