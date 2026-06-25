# Communication Message Registry — MSG-INDEX

Canonical spec: [Volume 15 — Communication Engine](../blueprint/15-communication-engine.md)

PR convention: `MSG-IDs: MSG-WF-001, MSG-BIL-003`

## Workflow (in-app + optional push)

| MSG-ID | Title | Trigger | SCR CTA | Channels |
|--------|-------|---------|---------|----------|
| MSG-WF-001 | Trip Started | TripStarted | SCR-016 | in-app, push |
| MSG-WF-002 | Trip Complete | TripCompleted | SCR-018 | in-app |
| MSG-WF-003 | Receipt Saved | ReceiptUploaded | SCR-025 | in-app |
| MSG-WF-004 | Receipt Ready | OCR complete | SCR-024 | in-app |
| MSG-WF-005 | Report Ready | ReportGenerated | SCR-032 | in-app, email |

## Reminders

| MSG-ID | Summary | Trigger |
|--------|---------|---------|
| MSG-RM-001 | Active trip idle 3h+ | cron |
| MSG-RM-002 | Trip ended, no receipts | 24h post-complete |
| MSG-RM-003 | Free limit 80% | usage counter |
| MSG-RM-004 | Free limit reached | API-LIM-001 |
| MSG-RM-005 | Monthly report available | 1st business day |
| MSG-RM-010 | First trip encouragement | 48h no trip |
| MSG-RM-011 | First receipt guidance | after first trip |

## AI (in-app)

| MSG-ID | Summary |
|--------|---------|
| MSG-AI-001 | Category suggestion + reason |
| MSG-AI-002 | Duplicate receipt warning |
| MSG-AI-003 | Missing receipt hint |

## Email — lifecycle

| MSG-ID | Subject area |
|--------|--------------|
| MSG-EMAIL-001 | Welcome |
| MSG-EMAIL-002 | Verify email |
| MSG-EMAIL-010 | Monthly summary |
| MSG-EMAIL-011 | Report ready |
| MSG-EMAIL-012 | Year-end summary |

## Email — billing

| MSG-ID | Subject area |
|--------|--------------|
| MSG-BIL-001 | Trial ending |
| MSG-BIL-002 | Payment received |
| MSG-BIL-003 | Payment failed |
| MSG-BIL-004 | Plan upgraded |
| MSG-BIL-005 | Plan downgraded |
| MSG-BIL-006 | Renewal reminder |

## Email — security

| MSG-ID | Subject area |
|--------|--------------|
| MSG-EMAIL-030 | New login |
| MSG-EMAIL-031 | Password changed |
| MSG-EMAIL-032 | New device |
| MSG-EMAIL-033 | Export requested |

## Milestones

| MSG-ID | Milestone |
|--------|-----------|
| MSG-MS-001 | First trip |
| MSG-MS-002 | First report |
| MSG-MS-003 | 100 trips |
| MSG-MS-004 | One year |

## Push (V1.1)

| MSG-ID | Maps to |
|--------|---------|
| MSG-PUSH-001 | MSG-RM-001 |
| MSG-PUSH-002 | MSG-RM-002 |
| MSG-PUSH-003 | MSG-WF-005 |
| MSG-PUSH-004 | MSG-BIL-003 |

## Template fields (every row)

Title · Body · CTA · Priority · Type · Trigger · EVT · Version · Status (☐/☑)

Code: `packages/shared/src/communications/templates/`
