# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 24 — Product Constitution, Design Language & Experience DNA

**Version 1.0**

---

## Who This Document Is For

Volume 24 is the **Product Constitution** — the permanent identity of Mileage & Expense Copilot. Volumes 0–23 define product, platform, company, and factory. Volume 24 defines **design language and product DNA** so that in ten years, with 50 designers and 200 engineers, everything still *feels* like this product.

| Reader | Use this volume to… |
|--------|---------------------|
| **Designers** | Personality, visual language, interaction DNA |
| **Writers** | Voice, errors, success copy |
| **Engineers** | Speed, trust, navigation rules in implementation |
| **Product** | Feature scorecard, amendment process |
| **Future leadership** | Stewardship without identity drift |

**Related:** [Volume 0 — Doctrine](00-product-doctrine.md) (mission anchor) · [Volume 10 — Design System](10-design-system.md) (components) · [Volume 18 — Mobile](18-mobile-field-experience.md) (field DNA)

| Volume | Scope |
|--------|-------|
| **0** | Mission, values, scope — *read first* |
| **24** | Permanent identity, feel, language — *never expires* |
| **10** | Tokens, components — *implements* Vol 24 |

Technology changes. **This Constitution does not.**

---

## DNA Catalog

Permanent **DNA-IDs** and **CON-IDs** for principles and review gates.

Tracker: [`docs/constitution/DNA-INDEX.md`](../constitution/DNA-INDEX.md)

---

# Part I — The Constitution

## Chapter 1 — Purpose

This document defines the **permanent identity** of the product.

| Changes | Constitution |
|---------|--------------|
| Technology | ✗ |
| Frameworks | ✗ |
| Languages | ✗ |
| Design trends | ✗ |
| Mission, feel, trust, language | ✓ |

Every future version must preserve these principles.

Amendments: rare, documented (Ch. 33).

---

## Chapter 2 — Mission

> **Remove the administrative burden of business travel so professionals can spend more time doing the work that matters.**

Every feature reinforces this mission — or it does not ship (Volume 20 FCT-QUALIFY-001).

Align [Volume 0 Mission](00-product-doctrine.md).

---

## Chapter 3 — Vision

Become the:

| Superlative | Meaning |
|-------------|---------|
| **Easiest** | Field Standard (Volume 18) |
| **Fastest** | One-Minute Rule (Volume 0) |
| **Most trusted** | Transparency, reliability (Ch. 17–18) |
| **Most intelligent** | AI assists; people decide (Volume 16) |

System for documenting business travel and expenses.

---

# Part II — Product Identity

## Chapter 4 — Personality

**DNA-PERSONALITY-001** — the product should feel:

| Always | Never |
|--------|-------|
| Calm | Cute |
| Professional | Loud |
| Organized | Distracting |
| Intelligent | Gimmicky |
| Helpful | Overly playful |
| Predictable | |
| Trustworthy | |

Tone in copy, color restraint, motion subtlety (Volume 10).

---

## Chapter 5 — Emotional Goal

When someone finishes using the app:

> **"Good. That's done."**

Not: *"Wow, cool software."*

The software **disappears behind the work** (Volume 0 "Time Is the Product").

Measure: task completion without delight-seeking UI patterns.

---

# Part III — Design DNA

## Chapter 6 — Visual Language

**DNA-VISUAL-001** — communicate in order:

```
Clarity → Confidence → Order → Completion
```

Visual noise is a **defect** — not decoration.

| Signal | Implementation |
|--------|----------------|
| Clarity | Typography hierarchy (Volume 10) |
| Confidence | Consistent patterns (Ch. 25) |
| Order | White space (Ch. 8) |
| Completion | Success states (Ch. 14) |

---

## Chapter 7 — Design Hierarchy

Every screen answers immediately:

| Question | UI element |
|----------|------------|
| Where am I? | TopBar, breadcrumbs |
| What is happening? | Status, ActiveTripBanner |
| What should I do next? | Primary CTA (thumb zone) |
| What is finished? | Checkmarks, muted completed items |

Volume 11 SCR specs must address all four.

---

## Chapter 8 — White Space

**DNA-SPACE-001** — empty space is **functional**.

| Benefit | |
|---------|--|
| Comprehension | |
| Reduced stress | |
| Scan speed | |

Do not fill space because it exists. Density ≠ power.

---

# Part IV — Interaction DNA

## Chapter 9 — Workflow First

**DNA-WORKFLOW-001**

> Never design screens. **Design workflows.**

A screen exists only to advance a workflow (Volume 2 journeys, Volume 13 SM).

SCR-ID assignment requires workflow statement in spec.

---

## Chapter 10 — Friction

**DNA-FRICTION-001**

| Action | Friction |
|--------|----------|
| Delete receipt / trip | Confirm |
| View receipt | None |
| End trip | Minimal + optional notes |
| Change financial data | Confirm + audit |
| Export data | Confirm destination |

Remove unnecessary friction. Preserve necessary confirmation.

---

## Chapter 11 — Progressive Disclosure

**DNA-DISCLOSURE-001**

Show **only what is needed, when it is needed.**

| Level | Audience |
|-------|----------|
| Default | New user — core path |
| Expanded | Power user — settings, advanced |
| Admin | Volume 17 — separate surface |

Advanced options available without overwhelming defaults.

---

# Part V — Language

## Chapter 12 — Writing Style

**DNA-COPY-001**

| Do | Don't |
|----|-------|
| Plain English | Jargon |
| Short sentences | Paragraphs in UI |
| Active voice | Passive |
| Direct verbs | "Utilize", "leverage" |

**Labels:** Start Trip · Attach Receipt · Generate Report

MSG templates (Volume 15) follow this voice.

---

## Chapter 13 — Error Messages

**DNA-ERROR-001** — every error includes:

1. **What happened**
2. **Why** (if known)
3. **How to fix it**

Example:

> "Your receipt was saved locally. We'll upload it automatically when you're back online."

Never: "Error 500" or stack traces (Volume 2). ERR-* codes map to user copy.

---

## Chapter 14 — Success Messages

**DNA-SUCCESS-001** — celebrate completion **briefly**.

| Good | Avoid |
|------|-------|
| Trip saved. | 🎉 Amazing job!!! |
| Receipt attached. | Excessive animation |
| Report generated. | Gamification for tax work |

Acknowledge completion; respect professionalism.

---

# Part VI — Speed

## Chapter 15 — Performance Principles

**DNA-SPEED-001** — fast software feels trustworthy.

| Optimize | Target ref |
|----------|------------|
| Startup | MOB-PERF-START |
| Scrolling | 60fps |
| Searching | < 500ms |
| Saving | Immediate local ACK |
| Receipt capture | < 500ms camera |
| Report generation | Progress UI |

Perceived performance = measured (Volume 18, 19).

---

## Chapter 16 — Waiting

**DNA-WAIT-001** — if users must wait:

| Rule | |
|------|--|
| Explain why | |
| Show progress | |
| Never blank screen | Skeleton/spinner |

SM states must include `processing` with user-visible feedback.

---

# Part VII — Trust

## Chapter 17 — User Trust

**DNA-TRUST-001** — built by:

| Pillar | Implementation |
|--------|----------------|
| Consistency | Patterns Ch. 25, naming Ch. 26 |
| Transparency | Billing, AI, offline state visible |
| Reliability | Volume 19 SLOs |
| Recoverability | Offline queue, undo where safe |

Never surprise with hidden behavior.

---

## Chapter 18 — AI Trust

**DNA-AI-TRUST-001** — AI communicates:

| Element | UI |
|---------|-----|
| Confidence | Score / label |
| Reasoning | "Why we suggest this" |
| Alternatives | Dismiss + manual entry |
| Uncertainty | "We're not sure — please verify" |

Volume 16 AI Constitution. AI earns trust through **accuracy and honesty** — not authority.

---

# Part VIII — Information Architecture

## Chapter 19 — Navigation Rules

**DNA-NAV-001**

| Rule | Spec |
|------|------|
| ≤ 3 interactions to any major function | From dashboard |
| Navigation stable over time | Volume 18 bottom nav |
| Deep links restore context | Volume 18 Ch. 26 |

Major functions: start trip, capture receipt, view reports, settings.

---

## Chapter 20 — Screen Ownership

**DNA-SCREEN-001** — one screen, **one primary purpose**.

Avoid kitchen-sink pages. SCR specs declare single primary action (Volume 11).

Secondary actions: overflow menu, not competing CTAs.

---

# Part IX — Accessibility

## Chapter 21 — Inclusive Design

**DNA-A11Y-001** — design for:

* Vision · Motor · Hearing · Cognitive differences  
* Temporary: bright sun, one hand, gloves (Volume 18)

Accessibility is **first design**, not retrofit (Volume 9, 18).

---

## Chapter 22 — Readability

**DNA-READ-001**

| Priority | Standard |
|----------|----------|
| Typography | 16px body min mobile |
| Spacing | Volume 10 scale |
| Grouping | Logical sections |
| Contrast | WCAG AA; outdoor sun mode |

Understandable in parking lots and offices alike.

---

# Part X — Product Ethics

## Chapter 23 — Respect for Users

**DNA-ETHICS-001** — never:

| Forbidden | |
|-----------|--|
| Dark patterns | |
| Hidden cancellation | |
| Misrepresented AI certainty | |
| Manufactured urgency | |
| Exploitative data use | |

Respect visible in every interaction (Volume 8 privacy).

---

## Chapter 24 — Honest Design

**DNA-HONEST-001**

* Don't pretend to know what you don't  
* Ask when confirmation required  
* Label delayed/synced data clearly  
* Show AI as suggestion, not fact  

Honesty > cleverness.

---

# Part XI — Product Consistency

## Chapter 25 — Reusable Patterns

**DNA-PATTERN-001** — standard patterns only (Volume 10):

Forms · Tables · Search · Filters · Dialogs · Buttons · Notifications · Cards · Lists

New patterns require design review + Volume 10 addition — not one-off screens.

---

## Chapter 26 — Naming Standards

**DNA-VOCAB-001** — one vocabulary:

| Always | Never alternate |
|--------|-----------------|
| Trip | Journey, Drive, Travel event |
| Receipt | Ticket (unless type) |
| Report | Export (verb OK) |
| Business | Company (UI — pick one: **Business**) |
| Mileage | Miles traveled (labels: **Miles**) |

Glossary: `docs/constitution/VOCABULARY.md` (maintain as product grows).

---

# Part XII — Long-Term Evolution

## Chapter 27 — Protecting Simplicity

**DNA-SIMPLE-001** — every feature asks:

> Does this **simplify** the product, or merely add capability?

Simplify → consider. Complexity without value → reject (Volume 20).

---

## Chapter 28 — Removing Features

**DNA-SUNSET-001** — deleting is acceptable when:

* Reduces confusion  
* Improves maintainability  
* Does not significantly reduce value  

Volume 20 ROAD-SUNSET-001 process. Maturity ≠ accumulation.

---

# Part XIII — Company Culture

## Chapter 29 — Internal Principles

Every team member understands:

| We… |
|-----|
| Build trust |
| Solve administrative problems |
| Respect customer time |
| Document our work |
| Leave the system better than we found it |

Align Volume 17 AdminOS philosophy, Volume 23 factory.

---

## Chapter 30 — Product Stewardship

Future leaders **improve without compromising identity**.

This Constitution prevents drift from mission.

New leaders: read Volume 0 + **this volume** before first PR.

---

# Part XIV — Experience Quality

## Chapter 31 — Experience Checklist

**DNA-REVIEW-001** — evaluate every feature:

| # | Question |
|---|----------|
| 1 | Understandable within seconds? |
| 2 | First-time user without training? |
| 3 | Reduces effort? |
| 4 | Respects user's time? |
| 5 | Builds confidence? |
| 6 | Consistent with product? |
| 7 | Recovers gracefully from failure? |

Gate in FCT-DESIGN-UX-001 and design review.

---

## Chapter 32 — Product Scorecard

**DNA-SCORE-001** — rate major features 1–10:

| Dimension | Minimum to ship |
|-----------|-----------------|
| Simplicity | ≥ 7 |
| Speed | ≥ 7 |
| Reliability | ≥ 8 |
| Learnability | ≥ 7 |
| Accessibility | ≥ 7 |
| Mobile usability | ≥ 8 |
| Trustworthiness | ≥ 8 |
| AI quality | ≥ 7 (if AI) |
| Operational maintainability | ≥ 7 |

Document scores in feature spec. Below threshold → iterate.

---

# Part XV — Living Constitution

## Chapter 33 — Amendment Process

**CON-AMEND-001** — changes are **rare**.

| Field | Required |
|-------|----------|
| Reason | Why now? |
| Expected benefits | |
| Risks | |
| Impact assessment | SCR/API/copy affected |
| Approval | Founder + product |
| Effective version | Semver bump |

Log: `docs/constitution/amendments/CON-AMEND-NNN.md`

---

## Chapter 34 — Constitutional Principles

**CON-PRINCIPLE-*** — never compromised:

| ID | Principle |
|----|-----------|
| CON-P1 | User's time is valuable |
| CON-P2 | Simplicity is competitive advantage |
| CON-P3 | Reliability builds trust |
| CON-P4 | Transparency beats cleverness |
| CON-P5 | AI assists; people decide |
| CON-P6 | Documentation is part of the product |
| CON-P7 | Every feature must earn its place |

---

# Part XVI — The Final Standard

## Chapter 35 — The Constitution Statement

At every design review, architecture review, and release review:

> **"Does this make Mileage & Expense Copilot more trustworthy, more useful, and easier to use than it was yesterday?"**

| Answer | Action |
|--------|--------|
| **Yes** | Proceed |
| **No** | Reconsider — technical impressiveness irrelevant |

---

# Epilogue — The North Star

Volumes **0–24** document:

| Layer | Volumes |
|-------|---------|
| Product & data | 0–6 |
| Business & quality | 7–9 |
| Design & specs | 10–16 |
| Company & field | 17–19 |
| Evolution | 20 |
| Build & platform & factory | 21–23 |
| **Identity** | **24** |

You are defining a **software company with a durable operating system**.

**Execution:** [Master Build Index](../MASTER-BUILD-INDEX.md) — links every requirement, screen, API, workflow, test, and milestone. **Begin building:** [Volume 21](21-construction-manual.md) WAVE-001 after sign-off.

No further blueprint volumes required — shift to **production**.

---

*Previous: [Volume 23 — Product Factory](23-product-factory.md) | [Master Build Index](../MASTER-BUILD-INDEX.md) | [Blueprint Index](README.md)*
