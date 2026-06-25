# Volume 0 — Product Doctrine & Design Constitution

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

---

## Mission Statement

Mileage & Expense Copilot exists to eliminate the frustration of tracking business travel and expenses.

The product helps users capture every legitimate business mile and expense with as little effort as possible, transforming a task most people dread into something fast, intuitive, and dependable.

**Goal:** Reduce time spent on recordkeeping while increasing accuracy and completeness of business travel documentation.

---

## Product Promise

> Every mile. Every receipt. Every deduction.  
> Captured with confidence.

**Marketing north star:** *Never lose another tax deduction.*

People don't wake up wanting to log mileage — they want to save time and keep more of what they've earned.

---

## Core Philosophy

We are **not** building:

- Accounting software
- Bookkeeping software
- Tax preparation software

We **are** building the world's easiest **business travel documentation system**.

If a feature doesn't support that mission, it belongs in a future release — or not at all.

---

## Product Values

### 1. Simplicity Wins

If two paths accomplish the same task, choose the simpler one.

Every screen answers one question: *"What does the user need to do right now?"*

### 2. Time Is the Product

We are selling time. Every feature saves time. Every click must justify its existence.

Ten taps today → three taps tomorrow.

### 3. AI Is an Assistant, Not the Decision-Maker

AI **should:** read, suggest, organize, remind.

AI **must never silently change:** dollar amounts, mileage, categories, or financial records.

The user remains in control.

### 4. Trust Is Everything

- No hidden calculations
- No unexplained changes
- Every calculation visible
- Every edit traceable
- Every report reproducible

### 5. Mobile First

Built for people standing at a gas pump, in a parking lot, on a job site, or in an airport.

Primary actions comfortable with one hand.

### 6. Capture Now, Organize Later

Favor quick capture over perfect organization. Users refine details later.

### 7. Never Enter Information Twice

Reuse: frequent destinations, vehicles, clients, mileage rates, categories.

### 8. Every Screen Must Reduce Stress

Calm, reassuring interface. Clear language. Obvious actions. No clutter.

### 9. Data Belongs to the User

Export, download, move, delete — no vendor lock-in.

### 10. Fast Beats Fancy

Launch quickly. Save quickly. Reports without delay.

### 11. Capture Once. Benefit Forever

Every piece of information entered continues providing value: reports, deductions, reimbursements, searches, insights. Features reuse existing data intelligently instead of asking for repeated work.

---

## Version 1 Success Criteria

| Action | Target time |
|--------|-------------|
| Record a trip | < 1 minute |
| Capture a receipt | < 10 seconds |
| Generate reimbursement report | < 30 seconds |
| Find any receipt | < 5 seconds |
| Learn the app | No tutorial required |

---

## User Personas (Primary)

- Independent contractors and consultants
- Sales professionals and real estate agents
- Insurance agents and field technicians
- Freelancers and small business owners
- Home healthcare providers
- Clergy and nonprofit staff who travel for work

**V1 audience:** Individuals and very small teams (not enterprise).

---

## Version 1 Scope

### Included

Trip logging · Mileage calculation · Receipt capture · Expense categorization · AI-assisted OCR · Reporting · PDF/CSV/Excel export · Multiple vehicles · Multiple businesses · Subscription management · Trip timeline · "Forgot Something?" end-trip checklist

### Excluded (Future)

Full accounting · Payroll · Tax filing · Bank/credit card sync · Advanced bookkeeping · Project management · Calendar integration · Auto trip detection · Accounting integrations (QuickBooks, Xero)

---

## Design Principles

- One primary action per screen
- Large touch targets
- Minimal typing
- Clear progress indicators
- Consistent navigation
- Readable in bright sunlight and low light
- Accessibility from day one

---

## AI Principles

- Read receipts accurately
- Suggest categories with explanation
- Detect duplicates
- Identify incomplete trips
- Offer reminders — always confirmable by user

---

## Performance Goals

| Metric | Target |
|--------|--------|
| App launch | < 2 s |
| Receipt OCR | < 5 s typical |
| Report generation | < 10 s |
| Dashboard refresh | < 2 s |

---

## Security Principles

- Encrypt sensitive data in transit and at rest
- Biometric login where available
- Minimize unnecessary PII collection
- Straightforward account and data deletion
- Clear privacy communication

---

## Product Personality

**Feels:** Professional · Dependable · Efficient · Friendly · Calm · Helpful

**Never feels:** Pushy · Flashy · Confusing · Overly technical

---

## The North Star Metric

If a user finishes a business trip and thinks:

> *"That was easier than keeping notes in my phone."*

— the product is succeeding.

---

## Doctrine Enforcement

Every feature request, UI change, AI behavior change, and pricing decision is evaluated against this document.

**Reject or defer** anything that:

- Adds complexity without clear time savings
- Silently modifies financial data
- Requires duplicate data entry
- Expands scope beyond travel documentation
- Breaks trust or exportability

---

*Next: [Volume 1 — Product Vision & Strategy](01-product-vision.md)*
