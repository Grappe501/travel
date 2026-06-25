# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 1 — Product Vision & Strategy

**Version 1.0**

---

## Who This Document Is For

Volume 1 is the **shared product definition** for everyone building, selling, and supporting Mileage & Expense Copilot. If you work on this product, this document tells you what we are building, for whom, why it wins, and how we measure success.

| Role | Use this volume to… |
|------|---------------------|
| **Engineers** | Align features to pillars, non-negotiables, and user stories before writing specs (Volume 3) or code |
| **Designers** | Ground UX decisions in personality, philosophy, and emotional outcomes — then detail screens in Volume 2 |
| **Marketers** | Extract positioning, promise, brand voice, and launch narrative |
| **Investors** | Understand market problem, revenue strategy, differentiation, and five-year trajectory |
| **Support** | Learn the customer promise, personas, and what "success" looks like for a user |

Volume 0 (Product Doctrine) is the constitution. **This volume is the strategy.** Volume 2 onward is execution detail.

---

# Chapter 1 — The Vision

## Vision Statement

Mileage & Expense Copilot will become the **easiest, fastest, and most trusted** way for professionals to document business travel and expenses.

Instead of spending hours reconstructing trips from calendars, bank statements, and memory, users capture everything in real time and generate professional, tax-ready documentation in minutes.

The application should feel less like bookkeeping software and more like a **trusted travel assistant**.

## What We Are Building

A mobile-first system of record for **business travel documentation** — trips, mileage, receipts, and reports — with AI that reads and organizes, not decides.

## What We Are Not Building

Accounting software · Bookkeeping platforms · Tax filing tools · General expense management for desk workers

(See Volume 0 for scope boundaries.)

---

# Chapter 2 — The Problem

Millions of people drive for work. Yet most still use:

* Paper notebooks
* Spreadsheets
* Notes apps
* Shoeboxes of receipts
* Manual mileage logs

**The result:**

* Missed deductions
* Lost receipts
* Hours of administrative work
* Poor reimbursement documentation
* Stress at tax time

Our mission is to eliminate all of these.

## Problem by Persona

| Persona | Pain today |
|---------|------------|
| Realtor | 15 showings, one notebook, receipts in cup holder |
| Consultant | Client visits logged "later" — later never comes |
| Sales rep | Employer wants PDF mileage log; has sticky notes |
| Contractor | Job-site runs blur together at invoice time |
| Freelancer | Tax prep means reconstructing six months from memory |

**Marketing headline:** *Never lose another tax deduction.*  
**User feeling:** *I never worry about mileage anymore.*

---

# Chapter 3 — The Solution

Mileage & Expense Copilot provides a single workflow:

1. **Start the trip.**
2. **Photograph receipts.**
3. **End the trip.**
4. **Generate reports.**

That's it. Everything else is automated.

## The Core Loop (Engineering Reference)

```
Start Trip → [ optional: Add Expense / Scan Receipt ] → End Trip → Reports
```

**Automated outputs:** miles · reimbursement · expense totals · grand total · deduction estimate (informational) · trip timeline card · export-ready documents

**Signature V1 capabilities** (detailed in Volumes 2–3):

* **One-Tap Expense Intelligence** — photograph receipt → AI extracts fields → user confirms → expense attached to active trip
* **Trip Timeline** — every trip becomes a searchable card with map, mileage, receipts, and status
* **"Forgot Something?" checklist** — end-trip prompts so users capture fuel, parking, tolls, meals before they forget

---

# Chapter 4 — Customer Promise

Users should feel that they have:

* **Better records** — complete, timestamped, auditable
* **Better organization** — trips, receipts, and clients in one place
* **Better reimbursement documentation** — employer-ready PDFs
* **Better tax preparation** — IRS-style mileage logs and expense summaries
* **Less stress** — no more shoebox panic in March
* **More confidence** — every legitimate mile and receipt captured

The app succeeds when it becomes something users **never want to travel without**.

## Support Standard

If a user asks "Did I capture everything for this trip?" — we should be able to show them a complete trip record with mileage, expenses, receipts, and a clear total. If we cannot, the product failed that promise.

---

# Chapter 5 — Target Customers

## Primary (Version 1)

Individuals who drive for work and pay for their own documentation pain:

* Realtors
* Insurance agents
* Sales representatives
* Consultants
* Freelancers
* Contractors
* Small business owners
* Home healthcare workers
* Clergy
* Inspectors

**V1 ships for individuals and sole operators.** Team features follow in Small Business tier (V1.1+).

## Secondary (Growth)

* Small businesses with field staff
* Churches and nonprofits with travel reimbursement
* Government and municipal reimbursement users
* Teams with employees who drive daily

## Investor Summary

Large, fragmented market of self-employed and field professionals. Low switching cost from notebooks/spreadsheets. Subscription wedge at $4.99/mo after free tier proves habit.

---

# Chapter 6 — User Stories

Every major feature must trace to a real user story. Examples:

### "I just bought gas."

Take photo → AI reads receipt → confirm → done.

**Requires:** receipt scanner, OCR, categorization, trip attachment

---

### "I finished my client visit."

End trip → checklist → summary → done.

**Requires:** end trip flow, mileage calculation, "Forgot Something?" prompts

---

### "My accountant needs my mileage."

Reports → Mileage log → export PDF/CSV → done.

**Requires:** IRS-style report, date filters, professional formatting

---

### "My employer needs reimbursement."

Reports → Reimbursement report → export PDF → done.

**Requires:** combined trip + expense totals, reimbursement status

---

### "What did I spend visiting the Henderson account this quarter?"

Trips → filter by client → export → done.

**Requires:** trip timeline search, client field, client summary report

---

### "I forgot to log yesterday's trip."

Trips → manual / retroactive entry → add receipts → done.

**Requires:** manual trip creation, edit trip, attach receipts post-hoc

**Engineering rule:** If a feature cannot be linked to at least one story in this chapter, defer it from V1.

---

# Chapter 7 — Value Proposition

Functional claims are table stakes. **Emotional outcomes win retention.**

| Instead of thinking… | Users should feel… |
|----------------------|-------------------|
| "I track mileage." | "I never worry about mileage anymore." |
| "I save receipts." | "I never lose receipts." |
| "I have an expense app." | "My travel paperwork handles itself." |
| "I need to do my logs." | "That took one minute — I'm done." |

## Positioning Statement

For **professionals who drive for work**, Mileage & Expense Copilot is the **AI travel expense assistant** that captures every mile and receipt in real time — unlike spreadsheets or generic receipt apps, it unifies **trips + mileage + receipts + reports** in one mobile workflow.

**Tagline options:**

> Every mile. Every receipt. Every deduction.

> Your AI travel expense assistant.

---

# Chapter 8 — Competitive Positioning

The product differentiates by being:

| Attribute | Our approach |
|-----------|--------------|
| **Faster** | Start trip in one tap; receipt capture under 10 seconds |
| **Simpler** | One workflow, not accounting complexity |
| **AI-assisted** | Reads receipts; suggests categories; never silently edits totals |
| **Mobile-first** | Built for gas pumps and job sites, not desks |
| **Travel-native** | Trips are the organizing unit — not categories or accounts |

## Competitive Landscape

| Alternative | Weakness we exploit |
|-------------|---------------------|
| Mileage-only apps | No receipt capture |
| Receipt-only apps | No trip/mileage model |
| Spreadsheets | High friction, no mobile capture |
| QuickBooks / accounting | Overkill; wrong mental model |
| Notes app | No calculations, no reports |

**Strategic guardrail:** Avoid becoming a general accounting package. Depth in travel documentation beats breadth in bookkeeping.

## Moat (Over Time)

* Unified trip timeline (hard to replicate piecemeal)
* Travel-specific OCR and categorization
* Client/project profitability from trip data
* Habit-forming end-trip checklist
* Reports trusted by accountants without rework

---

# Chapter 9 — Product Pillars

Every feature must support **one or more pillars**. Use this in design reviews and sprint planning.

### Capture

Quick recording of trips and expenses — at the pump, in the parking lot, on the job site.

*Start trip · Scan receipt · Voice notes (future)*

### Organize

Everything automatically sorted and searchable — by date, client, vehicle, business.

*Trip timeline · filters · client grouping*

### Calculate

Mileage, reimbursement, totals, and deductions computed automatically — visible and explainable.

*Mileage rate resolution · trip totals · dashboard metrics*

### Report

Professional documentation ready for reimbursement or tax preparation — no manual reformatting.

*Mileage log · expense report · PDF/CSV/Excel*

### Remember

The app acts as the user's memory — surfacing incomplete trips, missing receipts, duplicates.

*End-trip checklist · AI reminders · trip history*

---

# Chapter 10 — Product Personality

If the product were a person, it would be:

* Organized
* Calm
* Helpful
* Dependable
* Professional
* Intelligent
* Quietly efficient

It would **never** be:

* Flashy
* Overly complicated
* Judgmental
* Distracting
* Pushy about upgrades

## Voice & Tone (Marketing + In-App Copy)

* Clear, plain language — no accounting jargon unless the user expects it (reports)
* Reassuring, not alarming — "Review this receipt" not "ERROR: OCR FAILED"
* Confident, not boastful — show the numbers, don't oversell AI

---

# Chapter 11 — Design Philosophy

The interface prioritizes:

* **Large buttons** — thumb-friendly, one-handed use
* **Clear typography** — readable in sunlight and low light
* **Minimal forms** — smart defaults, autocomplete, reuse prior entries
* **One primary action per screen** — see Volume 2 wireflow
* **Fast capture** — capture now, refine later
* **High visibility outdoors** — contrast-first palette
* **Accessibility from the start** — WCAG 2.1 AA target (Volume 9)

Designers: Volume 2 defines every screen. This chapter defines the **why** behind those screens.

---

# Chapter 12 — The AI Copilot

The AI behaves like an **experienced administrative assistant** — not an accountant, not an autopilot.

## It Should

* Read receipts (merchant, date, amount, tax)
* Suggest categories with visible confidence
* Detect missing information (no fuel receipt on long trip)
* Warn about possible mistakes (duplicate receipt)
* Surface useful insights (future: spending trends)

## It Must Never

* Invent dollar amounts or mileage
* Silently alter financial records
* Auto-save OCR results without user confirmation

**Engineering reference:** Volume 5 (AI Design) · **Doctrine reference:** Volume 0, Principle 3

## V1 AI Scope

OCR · auto-categorization (suggest) · duplicate detection · missing-receipt reminders · merchant type recognition (gas, hotel, restaurant)

## Post-V1 AI

Trip splitting · spending insights · auto trip detection · voice notes · client profitability

---

# Chapter 13 — Revenue Strategy

## Tier Structure

### Free — $0/month

| Limit | Value |
|-------|-------|
| Trips | 5 / month |
| Receipts (OCR) | 10 / month |
| Vehicles | 1 |
| Businesses | 1 |
| Reports | PDF only |

**Purpose:** Let users experience the full core workflow before upgrading. Enough for ~1 trip per week.

### Pro — $4.99/month

Unlimited: trips · receipts · vehicles · businesses · reports (PDF, CSV, Excel) · OCR · cloud backup · AI assistance

**Purpose:** Impulse-priced subscription for anyone who drives weekly for work. Primary revenue driver at launch.

**Annual option (recommended V1.1):** ~$49.99/year (~17% discount)

### Small Business — $19.99/month (V1.1)

Up to 5 employees. Adds: employee management · shared reporting · approval workflows · company dashboards · admin controls · company mileage rates

**Purpose:** Expand ARPU without rebuilding core product.

### Enterprise — Custom pricing

Unlimited users · advanced permissions · APIs · accounting integrations · SSO · custom branding · premium support

**Purpose:** Land large field-service organizations after product-market fit.

## V1 Launch Scope

Ship **Free + Pro** only. Stub Small Business in billing UI ("Coming soon") or hide until V1.1.

## Investor Metrics

* Free → Pro conversion (target: 5–8% at maturity)
* Monthly churn (Pro target: < 5%)
* ARPU · LTV · CAC (once marketing spend begins)

---

# Chapter 14 — Success Metrics

The product measures outcomes across acquisition, activation, engagement, revenue, and quality.

## Acquisition

| Metric | Definition |
|--------|------------|
| Signups | New accounts per week |
| Landing → signup conversion | Marketing funnel |
| Referral rate | Invites / organic mentions (post-launch) |

## Activation

| Metric | Target |
|--------|--------|
| First trip within 7 days | > 60% of signups |
| First receipt scan within 7 days | > 40% of signups |
| Time to first trip from signup | < 5 minutes |
| Onboarding completion | > 80% |

## Engagement

| Metric | Notes |
|--------|-------|
| Trips logged per active user / month | Core habit signal |
| Receipts captured per trip | Attach rate |
| WAU / MAU | Stickiness |
| Report generation frequency | Value realization |

## Revenue

| Metric | Notes |
|--------|-------|
| Free → Pro conversion | Primary monetization |
| Monthly churn (Pro) | Retention health |
| ARPU | Blended across tiers |

## Quality

| Metric | Target |
|--------|--------|
| OCR field correction rate | < 15% on total amount |
| Report generation success | > 99% |
| Support tickets / 100 users | Decreasing over time |
| CSAT / NPS | Baseline at beta, improve post-launch |

## North Star Metric

**Completed business trips documented per week** — proxy for deductions captured, reimbursements supported, and time saved.

## Retention

| Metric | Target |
|--------|--------|
| Day 7 retention | > 40% |
| Day 30 retention | > 25% |
| Day 90 retention | > 15% |

---

# Chapter 15 — Brand Positioning

The brand communicates:

* **Confidence** — your records are complete
* **Reliability** — works every trip, every receipt
* **Professionalism** — reports you'd send to an employer or accountant
* **Simplicity** — no training required
* **Efficiency** — minutes, not hours

## Master Message

> **We handle the paperwork so you can focus on your work.**

## Audience-Specific Messages

| Audience | Message |
|----------|---------|
| Field professionals | "Log the trip before you leave the driveway." |
| Self-employed | "Never lose another tax deduction." |
| Small business owners | "Your team's travel — documented automatically." |
| Accountants (channel) | "Clean mileage logs and expense summaries from your clients." |

## Working Name

**Mileage & Expense Copilot**

Alternate positioning label: *Travel Expense OS* (room to grow into time tracking, per diem, billing)

---

# Chapter 16 — Launch Strategy

Version 1 targets **individuals and very small businesses**.

## Launch Sequence

| Stage | Audience | Goal |
|-------|----------|------|
| **1. Private alpha** | 5–10 hand-picked users (mixed personas) | Core loop works; OCR acceptable |
| **2. Closed beta** | 50–100 users, waitlist | Retention and conversion signals |
| **3. Public beta** | Open signup, Pro billing live | Scale support and infra |
| **4. Version 1.0** | General availability | Marketing push, press, SEO |
| **5. Small Business release** | Teams up to 5 | V1.1 tier launch |
| **6. Enterprise rollout** | Custom sales | SSO, API, integrations |

Each stage validates **usability and reliability** before expanding. No stage skips load testing or security review (Volumes 8–9).

## V1 Platform

**PWA (web)** first — mobile browser + installable home screen. Native App Store / Google Play in V1.2+ (Capacitor or RN wrapper).

## Go-to-Market (Initial)

* Persona-specific landing pages (realtors, contractors, sales)
* Content: "IRS mileage log in 30 seconds"
* Referral: give a month Pro for successful referral (V1.1)

---

# Chapter 17 — The Five-Year Vision

The long-term goal: Mileage & Expense Copilot becomes the **trusted system of record for business travel**.

## Future Capabilities

* Automatic trip detection (GPS / driving segments)
* Calendar integration
* Voice-first trip logging
* Smart reimbursement suggestions
* Accounting software sync (QuickBooks, Xero, Wave)
* Team fleet management
* AI travel analytics
* Client profitability insights

## Strategic Questions the Product Will Answer (Future)

* "Where is my money going?"
* "How much should I bill this client?"
* "What deductions am I missing?"
* "Which customers cost the most to service?"
* "How profitable are my trips after fuel, tolls, and meals?"

Every future addition must strengthen the original promise: **making business travel documentation effortless.**

V1 lays the data foundation — trips, receipts, categories, clients, vehicles, businesses — that powers this intelligence layer.

---

# Chapter 18 — Non-Negotiables

These rules apply to **every feature, screen, and release**. They cannot be overridden by a single team without cross-functional review and Volume 0 amendment.

| # | Rule | Owner accountability |
|---|------|---------------------|
| **N1** | A new user must log their **first trip within 5 minutes** of installing the app (including onboarding). | Design + Engineering |
| **N2** | A **routine trip** (start → optional receipt → end) must take **less than one minute**. | Design + Engineering |
| **N3** | **No feature may require internet** just to record a trip. Capture works offline; sync happens later. | Engineering |
| **N4** | **Reports must be professional enough** to submit to an employer or accountant **without manual editing**. | Design + Product |
| **N5** | Any feature that **increases complexity** must produce a **clear, measurable reduction in user effort**. | Product (all teams) |
| **N6** | AI **never silently changes** dollar amounts, mileage, or categories. User confirms financial data. | Engineering + AI |
| **N7** | Users **own their data** — export and delete must always be available. | Engineering + Legal |
| **N8** | **One primary action per screen** — no cluttered multi-purpose views in core flows. | Design |

When N1–N8 conflict with a feature request, **the non-negotiable wins** unless the doctrine (Volume 0) is formally revised.

---

## Version 1 Scope Summary

**In:** Trip logging · Mileage calculation · Receipt OCR · Expense categories · Reports (PDF/CSV/Excel on Pro) · Dashboard · Multi-vehicle/business · Subscriptions · Trip timeline · End-trip checklist

**Out:** Accounting integrations · Auto GPS trip detection · Calendar sync · Small Business tier (V1.1) · Native apps · Voice · Handwritten OCR · Tax filing

Full feature specs: [Volume 3 — Functional Requirements & Business Logic](03-functional-requirements.md)

---

## Document Map

| Need | Go to |
|------|-------|
| Values and constitution | [Volume 0](00-product-doctrine.md) |
| Screens and flows | [Volume 2 — Experience Architecture](02-user-experience.md) |
| Feature specs | [Volume 3 — Functional Requirements & Business Logic](03-functional-requirements.md) |
| Database | [Volume 4](04-database-architecture.md) |
| AI / OCR | [Volume 5](05-ai-design.md) |
| Tech stack and deploy | [Volume 6](06-technical-architecture.md) |

---

*Previous: [Volume 0 — Product Doctrine](00-product-doctrine.md) | Next: [Volume 2 — Experience Architecture](02-user-experience.md)*
