# DEC-002 — Version 1 Scope Lock

| Field | Value |
|-------|-------|
| **DEC-ID** | DEC-002 |
| **Date** | 2026-06-24 |
| **Status** | **LOCKED** |

---

## In scope (V1)

User accounts · Business · Vehicle · Mileage rates · Trip lifecycle · Receipt upload · OCR review · Expenses · Reports (PDF/CSV/Excel) · Free/Pro/Small Business billing.

---

## Out of scope (cannot add mid-build)

| Feature | Target |
|---------|--------|
| GPS auto-tracking | V1.1+ |
| Bank sync | V2+ |
| QuickBooks / Xero | V2+ |
| Native mobile app | V2+ (PWA is V1) |
| SMS notifications | V2+ |
| Enterprise SSO | V2+ |
| Public API | V2+ |
| Full accounting / tax / payroll | Never V1 |
| Advanced fleet management | V1.1+ |
| Offline sync queue | V1.1 (BUILD-006) |
| AI duplicate detection | V1.1 (BUILD-012) |
| Full AdminOS | V1.1 (BUILD-013) |

---

## Mid-build change process

1. Feature request → [FEATURE-PROPOSAL](../factory/FEATURE-PROPOSAL-TEMPLATE.md)
2. Product sign-off
3. New MRID(s) + BUILD slice **after** S010
4. Never insert slices between S001–S010

---

## Pricing lock

| Tier | Price | Trips | Receipts |
|------|-------|------:|---------:|
| Free | $0 | 5/mo | 10/mo |
| Pro | $4.99/mo | ∞ | ∞ |
| Small Business | $19.99/mo | ∞ | ∞ (5 seats) |

---

## Trip rule (V1)

**One active trip per user** (MRID-000004 / TRIP-MRID-000004). Fleet per-vehicle active trips → V1.1.
