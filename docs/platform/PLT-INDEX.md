# Platform Registry — PLT-INDEX

Canonical spec: [Volume 22 — Platform Architecture](../blueprint/22-platform-architecture.md)

## Platform layers

| PLT-ID | Layer |
|--------|-------|
| PLT-LAYER-EXP | Experience |
| PLT-LAYER-BIZ | Business logic |
| PLT-LAYER-INTEL | Intelligence |
| PLT-LAYER-INT | Integration |
| PLT-LAYER-DATA | Data |

## Domains (V1)

| PLT-ID | Domain | API |
|--------|--------|-----|
| PLT-DOM-AUTH | Authentication | API-AUTH-* |
| PLT-DOM-BIZ | Businesses | API-BIZ-* |
| PLT-DOM-VEH | Vehicles | API-VEH-* |
| PLT-DOM-TRIP | Trips | API-TRIP-* |
| PLT-DOM-RCP | Receipts | API-RCP-* |
| PLT-DOM-EXP | Expenses | API-EXP-* |
| PLT-DOM-RPT | Reports | API-RPT-* |
| PLT-DOM-BILL | Billing | API-SUB-* |
| PLT-DOM-AI | AI | ENG-* |
| PLT-DOM-ADMIN | Admin | API-ADM-* |

## V1 modules

| PLT-ID | Module | WAVE |
|--------|--------|------|
| PLT-MOD-AUTH | Authentication | WAVE-001 |
| PLT-MOD-DASH | Dashboard | WAVE-001 |
| PLT-MOD-TRIP | Trips | WAVE-003 |
| PLT-MOD-RCP | Receipts | WAVE-004 |
| PLT-MOD-EXP | Expenses | WAVE-005 |
| PLT-MOD-RPT | Reports | WAVE-006 |
| PLT-MOD-BILL | Billing | WAVE-007 |
| PLT-MOD-SET | Settings | WAVE-002 |
| PLT-MOD-AI | AI | WAVE-004/008 |
| PLT-MOD-ADMIN | Admin | WAVE-009 |

## Shared services (never duplicate)

| PLT-ID | Service |
|--------|---------|
| PLT-SVC-AUTH | Authentication |
| PLT-SVC-BILL | Billing |
| PLT-SVC-NOTIF | Notifications |
| PLT-SVC-AI | AI orchestration |
| PLT-SVC-ANALYTICS | Analytics |
| PLT-SVC-RPT | Reporting |
| PLT-SVC-AUDIT | Audit |
| PLT-SVC-STO | Storage |

## Maturity

| Level | Name |
|-------|------|
| 1 | Standalone SaaS (V1 target) |
| 2 | Integrated SaaS |
| 3 | Extensible platform |
| 4 | Partner ecosystem |
| 5 | Multi-product OS |

PR convention: `PLT-IDs: PLT-DOM-TRIP, PLT-MOD-TRIP`
