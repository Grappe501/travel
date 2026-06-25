# DEC-004 — Version 2 Scope Lock (ROAD-VER-2.0)

| Field | Value |
|-------|-------|
| **DEC-ID** | DEC-004 |
| **Date** | 2026-06-25 |
| **Status** | **LOCKED** (planning) |
| **Supersedes** | Partial deferrals in [DEC-002](DEC-002-v1-scope-lock.md) for V2 items |
| **Execution packet** | [VERSION_2_EXECUTION_PACKET.md](../execution/VERSION_2_EXECUTION_PACKET.md) |

---

## V2 product lock

| Field | Value |
|-------|-------|
| **Theme** | Intelligent Field Operations |
| **ROAD-ID** | ROAD-VER-2.0 |
| **Planning STEP** | STEP-073 |
| **First implementation STEP** | STEP-074 (MEC-V2-S001) |
| **Target GA** | 2.2.0 |

**V2 promise:** The app detects, suggests, and packages field work — user confirms every financial decision (N6).

---

## In scope (V2 program)

### Bridge (V1.14–V1.18 · ROAD-VER-1.5)

- Help center (`SCR-051`)
- Custom expense categories (`SCR-059`, FR-610)
- Team invites via existing `BusinessMember` model
- Accountant read-only role + bulk export
- Product analytics (cohorts, funnels)
- Feature flags (`ADM-FLAGS`)
- In-app feedback tied to field-test learnings
- `packages/integrations/` scaffold + `BusinessEvent` wiring

### V2.0 core (ROAD-VER-2.0)

- Trip intelligence engine (ENG-TRIP) — missing receipts, fuel prompts, trip packaging
- Reminder intelligence L3 (ENG-REM) — predictive end-trip / receipt nudges
- Calendar read integration (Google / Microsoft OAuth)
- Auto trip detection (opt-in, activity-based drafts — user confirms)
- Capacitor native shell for background GPS opt-in (MOB-FF-AUTO-TRIP)
- On-device OCR preview (offline draft; server remains source of truth)
- AI eval pipeline (golden receipt set, release gate)
- QuickBooks / Xero export adapters (not live sync-first)
- Client profitability view (trips + expenses by client/project)
- Manager approval queue (opt-in, Small Business tier)
- Partner API v1 + webhooks (scoped, rate-limited)

---

## Out of scope (cannot add mid-V2 without scope change)

| Feature | Target | Reason |
|---------|--------|--------|
| Full accounting / GL | Never | Product doctrine |
| Tax filing / advice | Never | Legal boundary |
| Bank feed sync | V2.5+ | Compliance + partner risk |
| Enterprise SSO (SAML) | V2.5 | ROAD-INT roadmap |
| Public full API | V3 | ROAD-API-003 |
| CarPlay / Android Auto | V3 | ROAD-HW-* |
| Bluetooth OBD | V2.5+ | Hardware partner-first |
| Auto-commit financial records | Never | N6 non-negotiable |
| Chat-first monolithic Copilot | Never | Volume 5 doctrine |
| International tax rules | V3 | i18n hooks only in V2 |
| Team scheduling / job tracking | V3 | ROAD-VER-3.0 |

---

## Mid-build change process

1. Proposal → `docs/roadmap/proposals/` using ROAD-ADMIT-001 criteria
2. Product sign-off against [GO-NO-GO-V2-CHECKLIST.md](../execution/GO-NO-GO-V2-CHECKLIST.md) metrics
3. New MRID(s) + MEC-V2-S slice appended — **never insert between S001–S005** (bridge order locked)
4. DEC-004 amendment if scope category changes (in ↔ out)

---

## Pricing (V2 amendments)

| Tier | Price | V2 change |
|------|-------|-----------|
| Free | $0 | Unchanged limits |
| Pro | $4.99/mo | + calendar link, trip intelligence |
| Small Business | $19.99/mo | + team invites (5 seats), approvals, accountant role |

Per-seat expansion above 5 → V2.3 billing update (Stripe metered or seat SKU).

---

## Architecture lock (V2)

| Layer | V1 (locked DEC-001) | V2 amendment |
|-------|---------------------|--------------|
| App shell | Next.js 15 PWA | + Capacitor wrapper (optional install track) |
| Offline | IndexedDB queue | Evaluate PowerSync spike in S016; queue remains until proven |
| AI | OpenAI Vision server | + on-device preview, eval harness, orchestrator module |
| Analytics | Admin CSV only | PostHog (or equivalent) + ENG-PROD dashboard |
| Integrations | None | `packages/integrations/` adapter pattern |
| API | Internal only | `/api/v1/partner/*` scoped surface in S015 |

DEC-001 stack remains; V2 **extends** rather than replaces.

---

## References

- [Volume 20 — ROAD-VER-2.0](../blueprint/20-product-evolution-roadmap.md)
- [STEP-073 — V2 execution packet](../build-steps/STEP-073-v2-execution-packet.md)
- [V2 Slice Index](../execution/V2-SLICE-INDEX.md)
