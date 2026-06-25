# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 7 — Business Operations, Monetization & Go-to-Market

**Version 1.0**

---

## Who This Document Is For

Volume 7 defines how Mileage & Expense Copilot becomes a **sellable, operable business** — not just working software.

| Role | Use this volume to… |
|------|---------------------|
| **Founders / product** | Pricing, launch stages, metrics, growth loops |
| **Marketing** | Site structure, voice, channels, assets |
| **Support** | SLAs, knowledge base, ticket categories |
| **Legal / compliance** | Required documents, disclaimers, data policy |
| **Engineering** | Upgrade triggers, Stripe products, analytics events |
| **Investors** | Segments, revenue milestones, differentiation |

**Related:** [Volume 1 — Strategy](01-product-vision.md) · [Volume 3 — FR-003](03-functional-requirements.md) · [Volume 6 — Billing](06-technical-architecture.md)

---

## Operating Goal

> Build a product people understand quickly, trust immediately, and are willing to pay for monthly.

**Final principle (Chapter 30):** The business succeeds if users believe *"This app saves me more than it costs me."*

---

# Chapter 1 — Purpose of Volume 7

This volume covers:

* Pricing · Free tier limits · Subscription rules
* Customer segments · Launch strategy · Marketing site · Sales funnels
* Support operations · Refunds · Legal documents
* App store readiness · Customer onboarding · Growth loops · Business metrics

Volume 6 builds the machine. **Volume 7 runs the business.**

---

# Chapter 2 — Product Positioning

**Not** accounting software.

**Is:**

> **The easiest way to track business miles, receipts, and travel expenses.**

| Element | Copy |
|---------|------|
| Core promise | Every mile. Every receipt. Every deduction. |
| Primary emotional message | Stop losing money because you forgot to track the trip. |
| Alternative headline | Never lose another tax deduction. |
| Category | AI travel expense assistant · Mileage & expense copilot |

**Never claim:** tax preparation, bookkeeping, legal advice, guaranteed deductions.

---

# Chapter 3 — Target Customers

## Primary Individual Users

Contractors · Realtors · Insurance agents · Salespeople · Consultants · Freelancers · Home healthcare workers · Inspectors · Clergy · Small nonprofit staff · Delivery-adjacent independent workers

**Job to be done:** Capture trips and receipts in the moment; produce clean reports later.

## Small Business Users (V1.1 tier)

Companies with 2–5 field workers · Cleaning · Lawn care · Repair · Sales teams · Churches · Small nonprofits · Home services

**Job to be done:** Employee mileage + receipts → reimbursement-ready reports.

## Future Enterprise

Regional sales orgs · Franchises · Healthcare agencies · Corporate reimbursement departments

**V1 focus:** Individuals and sole operators. Enterprise is inbound-only until Product-Market Fit.

---

# Chapter 4 — Pricing Model

## Free Plan — $0/month

| Limit | Value |
|-------|-------|
| Trips | 5 / month |
| Receipts (OCR) | 10 / month |
| Users | 1 |
| Businesses | 1 |
| Vehicles | 1 |
| Reports | PDF only |

**Purpose:** Experience full workflow (~1 trip/week) before paying.

## Pro Plan — $4.99/month

For individual power users.

| Included |
|----------|
| Unlimited trips & receipts |
| Unlimited PDF reports |
| CSV + Excel exports |
| Multiple vehicles & businesses |
| AI receipt scanning |
| Mileage calculations |
| Cloud backup · Search · Monthly summaries |

**Annual:** **$49/year** (~2 months free, improves cash flow)

## Small Business — $19.99/month (V1.1 launch)

Up to **5 employees**.

| Included |
|----------|
| Everything in Pro |
| Employee trip & receipt logs |
| Admin dashboard |
| Approval workflows |
| Company mileage rate |
| Export by employee |
| Monthly reimbursement reports |
| Team usage summaries |

**Annual:** **$199/year** (optional at launch)

## Business Plus — Future (6–25 employees)

**$49–99/month** — manager roles, department filters, client profitability, accounting exports.

## Enterprise — Custom

Unlimited employees · SSO · API · dedicated onboarding · custom billing · advanced audit · custom exports · priority support.

---

# Chapter 5 — Pricing Rules

| Rule | Detail |
|------|--------|
| Free tier resets | Calendar month (user timezone) |
| Pro | Unlimited personal usage |
| Small Business | Up to 5 seats included; additional seats V1.2 |
| Enterprise | Manual approval + custom contract |
| Cancel | Reverts to Free at **end of billing period** |
| Downgrade | Preserve all data; lock premium **actions** only |
| Upgrade | Immediate unlock; prorate via Stripe |

### Critical Rule

> **Billing changes may restrict new actions, but they must never delete old records.**

Maps to FR-003, Volume 6 Ch. 9, Volume 1 N7.

---

# Chapter 6 — Upgrade Moments

Show upgrade UI when user attempts:

| Trigger | Blocked action |
|---------|----------------|
| 6th trip in month | Start trip |
| 11th receipt in month | OCR / upload |
| CSV/Excel export | Report format |
| 2nd vehicle | Add vehicle |
| 2nd business | Add business |
| Invite employee | Team feature |
| Advanced automation | V1.1 features |

**Copy template (calm, value-based):**

> You've reached your free monthly trip limit. Upgrade to Pro to keep tracking unlimited trips and receipts.

**Avoid:** shame, countdown timers, dark patterns, hiding cancel path.

**UI:** Volume 2 subscription upgrade modal · usage meters on dashboard at 80% and 100%.

---

# Chapter 7 — Marketing Site Requirements

## Required Pages

Home · Pricing · Features · Mileage Tracking · Receipt Scanner · Expense Reports · Small Business · FAQ · Privacy · Terms · Contact · Login · Sign Up

**Hosting:** Same Next.js repo `(marketing)` route group or `www` subdomain on Netlify.

## Homepage Structure

1. Hero  
2. Problem  
3. Simple workflow (Start → Scan → End → Report)  
4. Key benefits  
5. Who it's for  
6. Screenshots / demo video  
7. Pricing teaser  
8. Trust / security  
9. FAQ  
10. CTA — **Start free — no credit card**

## Hero

**Headline:** Track business miles and receipts in less than a minute.

**Supporting line:** Mileage & Expense Copilot turns trips, odometer readings, and receipts into clean reports for reimbursement, records, and tax season.

**Primary CTA:** Start free  
**Secondary CTA:** Watch 60-second demo

---

# Chapter 8 — Launch Strategy

## Stage 1 — Private Alpha

| | |
|---|---|
| **Audience** | 5–10 trusted users (mixed personas) |
| **Goal** | Find workflow breaks |
| **Test** | Start/end trip · receipt · report · upgrade UI |
| **Paid ads** | None |

## Stage 2 — Closed Beta

| | |
|---|---|
| **Audience** | 25–50 users (waitlist) |
| **Goal** | Validate willingness to pay |
| **Offer** | Extended trial · founding member annual discount |
| **Collect** | UX confusion · OCR failures · report needs · pricing feedback |

## Stage 3 — Paid Public Beta

| | |
|---|---|
| **Audience** | Broader public |
| **Goal** | First real revenue |
| **Pricing** | Free · Pro $4.99 · SB $19.99 when ready |
| **Success** | ≥ 20 paying users |

## Stage 4 — Version 1 Launch

Requirements: stable billing · reliable reports · support workflow · marketing site live · legal published · exports · Sentry · backups · analytics

Aligns with Volume 1 Ch. 16 · Volume 6 Ch. 28.

---

# Chapter 9 — Sales Channels

## Primary Channels (V1)

| Channel | Motion |
|---------|--------|
| Direct website | SEO + CTA |
| Demo video | YouTube, TikTok, embedded on site |
| Facebook / Reddit / contractor groups | Problem-aware posts + demo link |
| Realtor / field worker communities | Persona-specific landing pages |
| Bookkeeper / accountant referrals | Referral page (Ch. 18) |
| Local chambers / small business forums | Partnership intros |

**Best initial motion:**

> 60-second demo: start trip → photograph receipt → end trip → generate report.

**Not V1:** Paid ads at scale until activation metrics prove funnel.

## App Store

Post-V1 PWA wrapper (Volume 6 Ch. 30) — billing may stay web-based to avoid 30% IAP where policy allows.

---

# Chapter 10 — Customer Onboarding

**First-time setup only:**

* Business name  
* Vehicle nickname  
* Starting odometer (optional)  
* Mileage rate (IRS default pre-selected)  
* Camera permission (skippable)  
* Notifications (skippable)

**First goal is not "complete profile."**

**First goal:**

> **Log your first trip.**

Target: < 5 minutes to first trip (Volume 1 N1). Volume 2 onboarding flow.

---

# Chapter 11 — Customer Support Model

## Channels

Help center · Email · In-app contact · Bug report form · Feature request form

**Email:** support@mileagecopilot.com (domain TBD at launch)

## SLA (initial)

| Plan | Response target |
|------|-----------------|
| Free | Best effort (≤ 5 business days) |
| Pro | 2 business days |
| Small Business | 1 business day |
| Enterprise | Custom SLA |

## Ticket Categories

Billing · Login · Receipt scanning · Reports · Data export · Subscription change · Bug · Feature request

**Tool V1:** Shared inbox + labels; help desk (Intercom/Zendesk) V1.1 if volume warrants.

---

# Chapter 12 — Knowledge Base

Required articles at launch:

1. How to log your first trip  
2. How to add a receipt  
3. How to generate a mileage report  
4. How to change mileage rate  
5. How to export data  
6. How Free limits work  
7. How to upgrade or cancel  
8. How to delete account and data  
9. How to invite employees (when SB live)  
10. What AI receipt scanning does  
11. What AI does **not** do  
12. How data privacy works  

Host: `/help` in app or docs subdomain · searchable.

---

# Chapter 13 — Legal & Compliance Documents

## Required Before Public Launch

| Document | Status |
|----------|--------|
| Terms of Service | Required |
| Privacy Policy | Required |
| Cookie Policy | If analytics cookies used |
| Refund Policy | Required |
| AI Use Disclosure | Required |
| Data Deletion Policy | Required (or section in Privacy) |
| Support Policy | Required |
| Acceptable Use Policy | Required (or section in Terms) |

## Standard Disclaimer

> Mileage & Expense Copilot helps organize travel and expense records. It does not provide tax, legal, or accounting advice. Users should consult a qualified professional for guidance specific to their situation.

## Terms — Key Clauses

Not tax advice · User accuracy responsibility · AI/OCR limitations · Acceptable use · Termination rights · Liability caps · Dispute resolution

**Engage legal review** before live payments.

## Privacy — Key Points

Collect: account, trip/expense data, receipt images, device metadata, payment via Stripe  
Use: service delivery · optional anonymized OCR improvement (opt-in)  
Share: Supabase, Stripe, OpenAI, Netlify, Resend — **never sold**  
Rights: export, delete (FR-1600, FR-1701)

---

# Chapter 14 — Refund Policy

**Suggested simple policy (publish on site):**

| Case | Policy |
|------|--------|
| Monthly subscription | No prorated refunds after billing date |
| Annual subscription | Full refund within **first 14 days** |
| Duplicate charges | Prompt correction + refund |
| Billing errors | Case-by-case |
| First-time Pro monthly | Optional goodwill: refund within 7 days if < 5 trips (support discretion) |

Cancel always available via Stripe Customer Portal — no retention dark patterns.

---

# Chapter 15 — Customer Data Policy

User data must be:

* **Exportable** — JSON/CSV bundle (FR-1600)  
* **Deletable** — account deletion with 30-day grace  
* **Portable** — no lock-in  
* **Protected** — Volume 8  
* **Never sold**

Export includes: trips · expenses · receipts metadata · reports list · businesses · vehicles · categories

**V1.1:** Receipt images as ZIP in full export.

---

# Chapter 16 — Analytics & Business Metrics

## Tooling

| Layer | Tool |
|-------|------|
| Marketing site | Plausible or PostHog (privacy-friendly) |
| Product events | PostHog or internal + `business_events` |
| Revenue | Stripe Dashboard + internal MRR query |
| OCR quality | Volume 5 telemetry |

## Funnel Metrics

Website visitors · Signups · Activation · First trip · First receipt · First report · Free limit hit · Upgrade conversion · Paid churn · MRR · ARPU · Support tickets/user · OCR correction rate · Report frequency

## Key Definitions

| Metric | Definition |
|--------|------------|
| **Activation** | One trip + one receipt within first 24 hours |
| **North Star (business)** | Paid users who generate ≥ 1 report per month |
| **Product North Star** | Completed business trips documented per week (Volume 1) |

## Event Names (implement in analytics)

```
signup_completed
onboarding_completed
trip_started_first
receipt_scanned_first
report_generated_first
free_limit_reached_trips | receipts
upgrade_started
upgrade_completed
subscription_canceled
```

---

# Chapter 17 — Retention Strategy

## Product Retention Features

Monthly summary email · Report-ready reminder · Unfinished trip nudge · Receipt review reminder · Mileage milestones · Year-end report prompt · Reimbursement archive

## Rhythm Goal

User opens app **weekly** during active travel season; **monthly** minimum for report check-in.

## Churn Prevention

Payment failed emails · Win-back on cancel ("Your data remains safe") · Usage digest showing value captured

---

# Chapter 18 — Growth Loops

## Report Sharing Loop

Optional footer on PDF exports:

> Generated by Mileage & Expense Copilot — mileagecopilot.com

Exposure when sent to employers, accountants, clients.

## Accountant Referral Loop

Landing page: *Invite your clients to track mileage correctly* — referral link or partner program V1.2.

## Small Business Team Loop

Pro user hits team need → invite employee → upgrade to Small Business.

## Year-End Stress Loop

Marketing **January–April:**

> Stop reconstructing last year's mileage from memory.

## Founding Member Loop (Beta)

Limited annual discount for beta users who provide feedback — builds early advocates.

---

# Chapter 19 — Brand Voice

| Do | Don't |
|----|-------|
| Clear, helpful, professional, calm | Overpromise deductions |
| Plainspoken | Tax loophole language |
| Trustworthy | Pushy urgency |
| | Accounting jargon without explanation |

**Good phrases:** Clean records · Ready when you need them · Track it before you forget it · Turn trips and receipts into reports · Built for people who work on the road

**AI voice:** Assistant, not authority (Volume 5).

---

# Chapter 20 — App Store Readiness

When native wrapper ships (V1.2+):

| Asset | Required |
|-------|----------|
| App icon | 1024×1024 |
| Screenshots | Phone + tablet |
| Short / full description | |
| Privacy nutrition labels | |
| Support URL · Marketing URL · Terms · Privacy | |

**Store positioning:**

> Track mileage, scan receipts, and generate travel expense reports.

**Billing note:** Research Apple/Google IAP rules — may link to web checkout for Pro where permitted.

---

# Chapter 21 — Business Operations Dashboard

Internal admin (Volume 6 Ch. 19) should surface:

Active users · New signups · Paid users · MRR · Churn · Free users near limit (80%+) · OCR failure rate · Report failures · Open support tickets · Stripe webhook health · Failed payments · Feature usage top 10

**Source:** Stripe API · Supabase aggregates · Sentry · support inbox

Refresh: daily email digest to founders V1; live dashboard V1.1.

---

# Chapter 22 — Launch Assets Checklist

Before public launch:

- [ ] Logo · product name · tagline  
- [ ] Marketing site (Ch. 7 pages)  
- [ ] Pricing page · demo video (60–90 sec)  
- [ ] FAQ · help center (Ch. 12)  
- [ ] Privacy · Terms · Refund · AI disclosure  
- [ ] Stripe products (monthly + annual Pro)  
- [ ] Support email configured  
- [ ] Lifecycle emails (Ch. 23)  
- [ ] Social launch posts (3–5 drafted)  
- [ ] Analytics instrumentation (Ch. 16)  

---

# Chapter 23 — Email Lifecycle

| Email | Trigger |
|-------|---------|
| Welcome | Signup |
| Verify email | Supabase Auth |
| First trip completed | `trip.ended` first time |
| First report generated | `report.generated` first time |
| Free limit reached | 80% and 100% usage |
| Payment failed | Stripe webhook |
| Subscription canceled | Stripe webhook |
| Monthly summary | Opt-in, 1st of month |
| Year-end reminder | January |

**Provider:** Resend · templates in repo `emails/` · useful not spammy · unsubscribe on marketing only

---

# Chapter 24 — Customer Feedback Loop

In-app prompts:

| When | Questions |
|------|-----------|
| After first report | What confused you? What saved time? |
| After first OCR | Was scanning accurate enough? |
| Day 7 | NPS-style 1–5 + optional comment |
| On cancel | Why did you cancel? |

Store in `feedback_responses` table (V1.1) or Typeform link V1.

**Feed roadmap:** Review weekly in beta; monthly post-launch.

---

# Chapter 25 — Competitive Differentiation

| vs. | We win by |
|-----|-----------|
| Spreadsheets | Speed, mobile capture, calculations |
| Bookkeeping apps | Focus — travel only, not full accounting |
| Mileage-only apps | Receipts + trips unified |
| Receipt-only apps | Mileage + IRS log |
| Expensive field service tools | $4.99 impulse price |

**Core advantage:**

> Focused simplicity plus AI-assisted capture.

---

# Chapter 26 — Operational Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| OCR mistakes → distrust | Confidence UI · confirm · Volume 5 gates |
| Users think we're tax software | Disclaimer everywhere · no deductibility promises |
| Free limits wrong | A/B in beta; 80% warning before hard block |
| Stripe webhook failures | Monitoring · alert · grace period |
| Storage costs | Image compression · TTL on exports |
| Support overload | Help center first · improve UX from tickets |
| GPS expectations | Marketing truth — GPS optional V1 |

---

# Chapter 27 — Revenue Milestones

| Milestone | Meaning |
|-----------|---------|
| 10 paying users | First validation |
| 50 paying users | Early traction |
| $500 MRR | ~100 Pro users |
| $1,000 MRR | ~200 Pro or ~50 SB mix |
| 100 Pro users | ~$499 MRR at $4.99 |
| 50 Small Business | ~$999 MRR at $19.99 |
| $5,000 MRR | Sustainable solo/small team ops |
| First enterprise inquiry | Expand roadmap |

## Illustrative Projections (not commitments)

| Metric | Month 3 | Month 12 |
|--------|---------|----------|
| Signups | 500 | 5,000 |
| Pro conversion | 5% | 8% |
| MRR | ~$125 | ~$2,000 |

---

# Chapter 28 — Version 1 Business Readiness Checklist

Business-ready when **all** pass (in addition to Volume 6 Ch. 28 technical):

- [ ] Pricing live in Stripe (Pro monthly + annual)  
- [ ] Free limits enforced with clear UX  
- [ ] Upgrade prompts at all triggers (Ch. 6)  
- [ ] Cancellation via Customer Portal works  
- [ ] Terms + Privacy + Refund + AI disclosure published  
- [ ] Support email monitored  
- [ ] Marketing site live with demo video  
- [ ] Help center core articles (Ch. 12)  
- [ ] Reports meet employer/accountant bar (Volume 1 N4)  
- [ ] Data export works  
- [ ] Analytics events firing (Ch. 16)  
- [ ] Feedback capture on cancel  
- [ ] Launch email list / announcement ready  

---

# Chapter 29 — Volume 7 Non-Negotiables

| # | Rule |
|---|------|
| 1 | Do not sell this as tax advice |
| 2 | Do not delete user data because of billing changes |
| 3 | Do not hide free limits |
| 4 | Do not make cancellation difficult |
| 5 | Do not overbuild enterprise before Pro works |
| 6 | Do not promise GPS automation in V1 unless shipped |
| 7 | Do not let marketing outpace product truth |
| 8 | Do not make users feel trapped |
| 9 | Do not sacrifice trust for conversion |

---

# Chapter 30 — Final Operating Principle

The business succeeds if users believe:

> **"This app saves me more than it costs me."**

At **$4.99/month**, one captured trip, one saved receipt, or one clean reimbursement report clears that bar.

Design every upgrade moment, email, and support interaction to reinforce **value received**, not **fear of loss**.

---

## Stripe Product Configuration (Implementation)

| Product | Price | Stripe metadata |
|---------|-------|-----------------|
| Copilot Pro Monthly | $4.99/mo | `plan=pro`, `interval=month` |
| Copilot Pro Annual | $49/yr | `plan=pro`, `interval=year` |
| Copilot SB Monthly | $19.99/mo | `plan=small_business` (V1.1) |
| Copilot SB Annual | $199/yr | `plan=small_business` (V1.1) |

**Flow:** Upgrade → Checkout Session → webhook → `subscriptions` table (Volume 6 Ch. 8).

---

## Public Roadmap (Communication)

| Horizon | Deliverables |
|---------|--------------|
| **Now (V1)** | Trips, receipts, OCR, reports, Pro billing |
| **Next** | Small Business tier, Google login, receipt ZIP export |
| **Later** | QuickBooks, auto trip detection, native apps, Business Plus |

Publish at `/roadmap` — under-promise, over-deliver.

---

## Document Map

| Need | Go to |
|------|-------|
| Tier limits (engineering) | [Volume 3 — FR-003](03-functional-requirements.md) |
| Stripe webhooks | [Volume 6 — Ch. 8](06-technical-architecture.md) |
| Security / privacy depth | [Volume 8](08-security.md) |
| Launch QA | [Volume 9](09-testing-quality.md) |

---

*Previous: [Volume 6 — Technical Architecture & Production Infrastructure](06-technical-architecture.md) | Next: [Volume 8 — Security](08-security.md)*
