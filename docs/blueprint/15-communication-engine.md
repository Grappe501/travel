# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 15 — Communication, Notification & Engagement Engine

**Version 1.0**

---

## Who This Document Is For

Volume 15 defines the **Communication & Engagement Engine** — not an afterthought, but a **communication operating system**. Every notification has a purpose, timing, audience, and measurable outcome.

| Role | Use this volume to… |
|------|---------------------|
| **Product** | Message library, lifecycle sequences, engagement |
| **Engineering** | Triggers, delivery, preferences, `MSG-IDs` |
| **Design** | In-app, email, push copy and components |
| **Legal / marketing** | Compliance, opt-in, approval workflow |
| **Support** | Internal alert routing |

**Related:** [Volume 7 — Email & retention](07-business-operations.md) · [Volume 11 — SCR-042](11-screen-bible.md) · [Volume 12 — API-NOT-*](12-api-architecture.md) · [Volume 14 — Notification metrics](14-analytics.md)

---

## Message ID Catalog

Permanent **MSG-IDs** for every template — referenced in code, tests, and analytics.

Full library: [`docs/communications/MSG-INDEX.md`](../communications/MSG-INDEX.md)

**Stack:** In-app (`notifications` table) · Email (Resend) · Push (PWA V1.1) · SMS (future)

---

# Part I — Communication Philosophy

## Chapter 1 — Purpose

The Communication Engine exists to:

| Goal | Outcome |
|------|---------|
| Keep users informed | Status without opening every screen |
| Help complete important tasks | Actionable CTAs |
| Prevent lost work | Reminders before data gaps |
| Reinforce trust | Security + billing transparency |
| Increase retention | Value summaries, not guilt |
| Encourage productive habits | Trip/report rhythms |
| Never become spam | Frequency caps + preferences |

> Notifications should always make the user's day **easier**.

---

## Chapter 2 — Communication Doctrine

Every communication must answer **at least one**:

| Question | Example |
|----------|---------|
| What happened? | "Trip complete — 126.4 miles recorded" |
| What needs attention? | "Review receipt details" |
| What should happen next? | "Download monthly report" |
| What value did the app provide? | "58 receipts organized this month" |
| How can we save the user time? | "Duplicate receipt detected" |

**If a message doesn't answer one of these — don't send it.**

---

## Chapter 3 — Communication Principles

Every message is:

| Principle | Rule |
|-----------|------|
| **Useful** | Tied to user data or account state |
| **Timely** | Ch. 12 timing rules |
| **Clear** | Grade 8 reading level; no jargon |
| **Actionable** | One primary CTA |
| **Respectful** | Quiet hours, preferences |
| **Short** | Title ≤ 50 chars; body ≤ 140 in-app |
| **Optional** | Marketing always opt-in |

Never send notifications simply to increase engagement metrics.

---

# Part II — Notification Architecture

## Chapter 4 — Notification Types

| Type | Code | Priority default | Examples |
|------|------|------------------|----------|
| **System** | `system` | low | Sync finished, maintenance |
| **Workflow** | `workflow` | medium | Trip ended, report ready |
| **Reminder** | `reminder` | medium | Active trip, missing receipt |
| **Billing** | `billing` | high | Payment failed, limit reached |
| **Security** | `security` | critical | New login, password changed |
| **AI** | `ai` | medium | Duplicate receipt, category suggestion |
| **Marketing** | `marketing` | low | New feature — **opt-in only** |

### Type rules

| Type | In-app | Email | Push | Bypass quiet hours |
|------|--------|-------|------|-------------------|
| system | ✓ | optional | ✗ | ✗ |
| workflow | ✓ | optional | ✓ | ✗ |
| reminder | ✓ | optional | ✓ | ✗ |
| billing | ✓ | ✓ | ✓ | payment failed only |
| security | ✓ | ✓ | optional | ✓ (critical) |
| ai | ✓ | ✗ | ✗ | ✗ |
| marketing | ✓ | ✓ | ✗ | ✗ |

Stored on `notifications.type` (Volume 4). User prefs per type (Ch. 14).

---

# Part III — Delivery Channels

## Chapter 5 — In-App Notifications

**SCR:** SCR-042 Notification Center  
**API:** API-NOT-001, API-NOT-002  
**Components:** Volume 10 Ch. 34 — `NotificationBell`, `NotificationCenter`, `NotificationListItem`

| Characteristic | Spec |
|----------------|------|
| Non-intrusive | Badge + center — no modal for medium/low |
| Actionable | Tap → deep link to SCR |
| Dismissible | Swipe or mark read |
| Persistent when important | Billing/security until acknowledged |

**Unread badge** on bell; max 99+ display.

---

## Chapter 6 — Email

**Provider:** Resend (Volume 6)  
**Templates:** `apps/web/emails/` or `supabase/functions/_shared/emails/`

| Category | MSG examples |
|----------|--------------|
| Welcome | MSG-EMAIL-001 |
| Verification | Supabase Auth + MSG-EMAIL-002 |
| Monthly summary | MSG-EMAIL-010 |
| Report ready | MSG-EMAIL-011 |
| Billing | MSG-EMAIL-020–025 |
| Security | MSG-EMAIL-030–033 |

Email **reinforces** in-app — never the only channel for critical billing/security.

**Rules:** Plain-language subject lines · single CTA · unsubscribe on marketing only · no receipt images in email body (link to app).

---

## Chapter 7 — Push Notifications

**V1.1** for PWA push (Web Push API). Architecture ready in V1.

| Use case | MSG-ID |
|----------|--------|
| Active trip reminder | MSG-PUSH-001 |
| Receipt reminder | MSG-PUSH-002 |
| Report complete | MSG-PUSH-003 |
| Billing issue | MSG-PUSH-004 |

Fine-grained category toggles in SCR-046 settings (Ch. 14). Default: workflow + billing on; marketing off.

---

## Chapter 8 — SMS (Future)

Reserved for:

* Account recovery (enterprise)
* Critical security alerts (optional)
* Enterprise admin workflows

**Never** routine product messaging over SMS. Cost and trust too high for mileage reminders.

---

# Part IV — Notification Library

## Chapter 9 — Workflow Notifications

### MSG-WF-001 — Trip Started

| Field | Value |
|-------|-------|
| Title | Trip Started |
| Body | You're now tracking your business travel. |
| CTA | View Active Trip → SCR-016 |
| Trigger | SM-TRIP → active · `TripStarted` |
| Channels | in-app, push (if enabled) |
| EVT | `trip_started` |

### MSG-WF-002 — Trip Completed

| Title | Trip Complete |
| Body | {miles} business miles recorded. |
| CTA | View Summary → SCR-018 |
| Trigger | SM-TRIP → completed |

### MSG-WF-003 — Receipt Uploaded

| Title | Receipt Saved |
| Body | We're reading your receipt now. |
| CTA | View Receipt → SCR-025 |
| Trigger | SM-RCP → uploaded |

### MSG-WF-004 — OCR Complete

| Title | Receipt Ready |
| Body | Please review the extracted details. |
| CTA | Review → SCR-024 |
| Trigger | SM-OCR → completed / needs_review |

### MSG-WF-005 — Report Generated

| Title | Report Ready |
| Body | Your {period} report is ready for download. |
| CTA | Download → SCR-032 |
| Trigger | SM-RPT → generated |

Full workflow library: MSG-INDEX § Workflow.

---

## Chapter 10 — Reminder Library

Helpful, not nagging. Max **1 reminder per issue per 24h**.

| MSG-ID | Body pattern | Trigger |
|--------|--------------|---------|
| MSG-RM-001 | "You started a trip {hours} ago. Ready to end it?" | Active trip > 3h idle |
| MSG-RM-002 | "This trip has no receipts yet. Add fuel or parking?" | Trip completed, 0 receipts, 24h |
| MSG-RM-003 | "You're approaching your free trip limit ({n} of 5)." | usage ≥ 80% |
| MSG-RM-004 | "You've reached your free monthly trip limit." | API-LIM-001 block |
| MSG-RM-005 | "Your monthly report is ready to generate." | 1st business day of month |

Snooze: 24h per reminder type.

---

## Chapter 11 — AI Messaging

AI communication **always explains itself** (Volume 5, Volume 8).

### MSG-AI-001 — Category Suggestion (in-app)

| Field | Value |
|-------|-------|
| Body | We categorized this as **{category}** because {reason}. |
| Meta | `confidence: 0.82` |
| CTA | Accept · Change |
| Example reason | "Merchant is commonly recognized as a gas station." |

### MSG-AI-002 — Duplicate Receipt

"We found a similar receipt from {date}. Review before saving?"

### MSG-AI-003 — Missing Receipt

"Your trip to {destination} often includes fuel. Add a receipt?"

**Rules:** Include confidence + reason + ability to change. Never authoritative tone.

---

# Part V — Notification Timing

## Chapter 12 — Timing Rules

| Notification | Rule |
|--------------|------|
| Trip reminder (MSG-RM-001) | ≥ 3h after start; no reminder if user active in app < 15m |
| Receipt reminder (MSG-RM-002) | ≥ 24h after trip complete |
| Monthly report (MSG-RM-005) | 1st business day 9:00 AM **user timezone** |
| Free limit warning (MSG-RM-003) | At 80% and 100% |
| OCR complete (MSG-WF-004) | Immediate on success |
| Payment failed | Immediate + retry schedule per Stripe |

**Timezone:** Store `profiles.timezone` (IANA). Cron via Edge Function + `pg_cron` (V1.1).

**Quiet hours:** Defer non-critical to next allowed window (Ch. 15).

---

## Chapter 13 — Frequency Controls

| Rule | Implementation |
|------|----------------|
| No duplicate reminders < 24h | `notifications` dedupe key |
| Group similar | Batch "3 receipts need review" |
| Suppress during active workflow | No receipt reminder while on SCR-024 |
| Snooze / disable | Per category in preferences |
| Global cap | Max 5 push/day; max 10 in-app/day (excluding security) |

**Digest mode (V1.1):** Daily summary email instead of individual pings.

---

# Part VI — User Preferences

## Chapter 14 — Notification Settings

**SCR:** SCR-046 Settings · API-NOT-003  
**Storage:** `profiles.notification_prefs` JSON

```json
{
  "channels": { "email": true, "push": true, "in_app": true },
  "categories": {
    "workflow": "all",
    "reminder": "important_only",
    "billing": "all",
    "security": "all",
    "ai": "all",
    "reports": "all",
    "marketing": "off"
  },
  "preset": "important_only"
}
```

**Presets:**

| Preset | Behavior |
|--------|----------|
| **All** | Everything except marketing (marketing separate opt-in) |
| **Important only** | billing + security + workflow completions |
| **Custom** | Per-category toggles |

Security notifications cannot be fully disabled — only channel choice (email vs in-app).

---

## Chapter 15 — Quiet Hours

| Setting | Default |
|---------|---------|
| Sleep start | 22:00 local |
| Sleep end | 07:00 local |
| Weekends | Same (user can disable reminders Sat–Sun) |
| Work schedule | Optional — suppress non-urgent during off-hours |

**Bypass:** `security` type with `priority=critical` (new login from new device, password change).

Deferred messages queue until quiet hours end.

---

# Part VII — Engagement

## Chapter 16 — Monthly Summary

**MSG-EMAIL-010** — value, not promotion.

```
This month:
• 1,842 miles
• 41 trips
• 58 receipts
• 3 reports generated

[Download Full Report]
```

Trigger: 1st of month · users with `reports` preset ≠ off · requires ≥1 trip in prior month.

EVT: `monthly_summary_sent`

---

## Chapter 17 — Year-End Summary

**MSG-EMAIL-012** — celebrate productivity (January send).

```
In the past year:
• {miles} business miles recorded
• {receipts} receipts organized
• {reports} reports generated
• Estimated {hours} hours saved vs. manual tracking*
```

*Disclaimer: estimate based on industry averages; not a tax or financial claim.

**Avoid:** Implied tax savings or deduction outcomes (Volume 0, Volume 7 legal).

---

## Chapter 18 — Milestones

Subtle, professional — in-app toast or single email, not confetti spam.

| Milestone | MSG-ID | Channel |
|-----------|--------|---------|
| First trip | MSG-MS-001 | in-app |
| First report | MSG-MS-002 | in-app + email |
| 100 trips | MSG-MS-003 | in-app |
| One year | MSG-MS-004 | email |

One-time per user per milestone. Dismissible.

---

# Part VIII — Customer Lifecycle

## Chapter 19 — Onboarding Communications

Activation sequence (not marketing):

```
Welcome (MSG-EMAIL-001)
    ↓
Email verification (Auth + MSG-EMAIL-002)
    ↓
First trip encouragement (MSG-RM-010) — if no trip in 48h
    ↓
First receipt guidance (MSG-RM-011) — after first trip
    ↓
First report congratulations (MSG-MS-002) — after first report
```

Goal: Volume 14 activation definition (trip + receipt in 24h).

Stop sequence on activation complete.

---

## Chapter 20 — Subscription Communications

| Event | MSG-ID | Channels |
|-------|--------|----------|
| Trial ending | MSG-BIL-001 | email + in-app |
| Payment received | MSG-BIL-002 | email |
| Payment failed | MSG-BIL-003 | email + in-app + push |
| Plan upgraded | MSG-BIL-004 | email + in-app |
| Plan downgraded | MSG-BIL-005 | email — data safe message |
| Renewal reminder | MSG-BIL-006 | email 7d before |

Billing copy: **clear and factual** — amount, date, action link to SCR-044.

---

## Chapter 21 — Retention Communications

| Type | Example | Tone |
|------|---------|------|
| Monthly report ready | MSG-RM-005 | Helpful |
| Unused premium feature | "You haven't generated a report this month" | Neutral |
| Return after inactivity | "Your records are waiting" | Warm, not guilt |
| Product improvements | Changelog digest | Opt-in marketing |

**Avoid:** "We miss you" guilt · fake urgency · countdown timers on non-billing items.

---

# Part IX — Internal Communications

## Chapter 22 — Administrative Alerts

**Audience:** admin role · SCR-053, SCR-055  
**Channels:** email + Slack/webhook (V1.1)

| Alert | Trigger | Priority |
|-------|---------|----------|
| OCR queue failure rate > 10% | monitoring | critical |
| Stripe webhook failures | any failure | critical |
| Storage errors | sustained | high |
| API outage | health check | critical |
| Sync failure spike | SM-SYNC | high |
| Security event | audit | critical |

Distinguish **critical** (page on-call) vs **routine** (daily digest).

---

## Chapter 23 — Support Notifications

Support staff alerts:

| Trigger | Channel |
|---------|---------|
| High-priority ticket | email + admin UI |
| Escalation | same |
| Billing dispute | tagged urgent |
| Repeated AI failures per user | review queue |

Integrate with help desk (Volume 7) — V1: email to support@ alias.

---

# Part X — Analytics

## Chapter 24 — Notification Metrics

Track usefulness, not volume (Volume 14 extension):

| Metric | EVT suffix |
|--------|------------|
| Delivered | `notification_delivered` |
| Opened | `notification_opened` |
| Clicked (CTA) | `notification_clicked` |
| Dismissed | `notification_dismissed` |
| Ignored (no action 7d) | computed |
| Action completed | link to workflow EVT |
| Unsubscribed | `notification_unsubscribed` { category } |

Payload: `msg_id`, `channel`, `type` — no message body in analytics.

---

## Chapter 25 — Engagement Dashboard

Product + ops views:

| Widget | Use |
|--------|-----|
| Most effective reminders | click / complete rate by MSG-ID |
| Most ignored reminders | candidates to remove |
| Conversion after reminder | e.g. MSG-RM-001 → trip_completed |
| Fatigue indicators | dismiss rate spike, unsubscribe rate |

Review monthly; retire MSG-IDs with < 5% action rate over 90 days.

---

# Part XI — Templates

## Chapter 26 — Template Standards

Every MSG-ID documents:

| Field | Required |
|-------|----------|
| MSG-ID | Unique |
| Title | ≤ 50 chars |
| Body | Template with `{variables}` |
| CTA label + deep link | SCR route |
| Priority | low / medium / high / critical |
| Channel(s) | in-app, email, push |
| Trigger | SM / API / cron condition |
| Type | Ch. 4 category |
| Localization | i18n keys — `msg.{id}.title` |
| Accessibility | screen reader text if icon-only |
| Version | semver in MSG-INDEX |

**Location:** `packages/shared/src/communications/templates/`  
**Renderer:** single `renderMessage(msgId, context)` function.

---

## Chapter 27 — Localization

Design for future translation:

| ✓ Do | ✗ Avoid |
|------|---------|
| Full sentences in i18n files | Idioms ("hit the road") |
| `{miles}` numeric placeholders | Ambiguous "12/1" dates |
| Neutral professional tone | Culture-specific holidays in system msgs |

V1: English only; strings externalized from day one.

---

# Part XII — Governance

## Chapter 28 — Approval Workflow

New MSG-ID requires sign-off:

| Role | Reviews |
|------|---------|
| Product | Purpose, timing, frequency |
| UX | Copy, CTA, SCR target |
| Engineering | Trigger, dedupe, prefs |
| Legal | billing, marketing, disclaimers |
| Marketing | promotional only |

Template PR must include MSG-INDEX row + sample rendered output.

---

## Chapter 29 — Notification Testing

| Test | Method |
|------|--------|
| Trigger conditions | Unit test trigger functions |
| Delivery timing | Staging cron with mocked clock |
| Correct audience | RLS — user A never sees user B |
| Localization | snapshot tests |
| Accessibility | axe on notification components |
| Duplicate suppression | send twice → one delivery |
| Retry behavior | email bounce handling |

Volume 9: include notification paths in regression suite.

---

## Chapter 30 — Compliance

| Requirement | Implementation |
|-------------|----------------|
| User preferences | Ch. 14 — honor before send |
| CAN-SPAM / similar | physical address in marketing email footer |
| Privacy | no PII in push payload |
| GDPR | marketing opt-in; transactional allowed |
| Unsubscribe | one-click marketing only |

Volume 8 + Volume 7 legal docs reference this volume.

---

## Chapter 31 — Future Expansion

Engine supports new channels without redesign:

| Channel | Interface |
|---------|-----------|
| Voice assistants | `send(msgId, channel: 'voice')` adapter |
| Smartwatch | condensed MSG template |
| Calendar | ICS attachment on trip complete |
| Team collaboration | @mention on shared business |
| Enterprise policy | admin-mandated security msgs |

`NotificationService` interface in `packages/shared/src/communications/`.

---

## Chapter 32 — Version 1 Readiness Checklist

Before launch:

| # | Item |
|---|------|
| 1 | [ ] MSG-INDEX workflow + billing + security templates complete |
| 2 | [ ] User preferences (API-NOT-003) implemented |
| 3 | [ ] Quiet hours logic in send pipeline |
| 4 | [ ] Security notifications tested (MSG-EMAIL-030+) |
| 5 | [ ] Billing notifications verified with Stripe test mode |
| 6 | [ ] AI explanations reviewed (Ch. 11) |
| 7 | [ ] Templates versioned in repo |
| 8 | [ ] Analytics EVTs for delivery/open/click |
| 9 | [ ] Accessibility on SCR-042 |
| 10 | [ ] Marketing opt-in separate from transactional |

---

## Chapter 33 — Communication Non-Negotiables

| # | Rule |
|---|------|
| 1 | Never send marketing disguised as system alerts |
| 2 | Never over-notify (Ch. 13 caps) |
| 3 | Never hide important billing/security information |
| 4 | Never send AI recommendations without explanation |
| 5 | Never interrupt active workflows unnecessarily |
| 6 | Always respect user preferences |
| 7 | Always provide a meaningful next action |
| 8 | Never include receipt images or amounts in email subject lines |
| 9 | Never guilt-based retention copy |
| 10 | Every MSG-ID in registry before production send |

---

## Chapter 34 — The Communication Standard

Every notification should leave the user feeling:

> **"I'm glad the app told me that."**

If a message doesn't save time, prevent a mistake, increase confidence, or help accomplish work — **it shouldn't exist**.

This guides every email, push, in-app alert, reminder, and AI message the product ever sends.

---

## Cross-Reference Index

| Volume | Link |
|--------|------|
| Volume 4 | `notifications` table schema |
| Volume 6 | Resend, delivery architecture |
| Volume 11 | SCR-042, notification screens |
| Volume 12 | API-NOT-001–003 |
| Volume 13 | SM triggers for workflow msgs |
| Volume 14 | EVT notification metrics |
| Volume 10 | Notification UI components |

---

## Document Map

| Need | Go to |
|------|-------|
| Message templates | [MSG-INDEX.md](../communications/MSG-INDEX.md) |
| In-app UI | [Volume 10 Ch. 34](10-design-system.md) |
| FR-900 | [Volume 3](03-functional-requirements.md) |

---

*Previous: [Volume 14 — Analytics](14-analytics.md) | Next: [Volume 16 — AI Operating System](16-ai-operating-system.md)*
