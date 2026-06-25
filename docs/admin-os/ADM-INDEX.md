# AdminOS Module Registry — ADM-INDEX

Canonical spec: [Volume 17 — Admin Operating System](../blueprint/17-admin-operating-system.md)

| ADM-ID | Module | SCR | Route | V1 | Owner |
|--------|--------|-----|-------|-----|-------|
| ADM-DASH | Admin Dashboard | SCR-053 | `/admin` | ✓ | |
| ADM-CUST | Customer Lookup | SCR-054 | `/admin/users` | ✓ | |
| ADM-TIMELINE | Customer Timeline | SCR-054 | `/admin/users/[id]` | ✓ | |
| ADM-ACCT | Account Management | SCR-054 | actions | ✓ | |
| ADM-BILL | Subscription Dashboard | — | `/admin/billing` | ✓ | |
| ADM-REFUND | Refund Workflow | — | `/admin/billing/refund` | ✓ | |
| ADM-AI | AI Health Dashboard | — | `/admin/ai` | ✓ | |
| ADM-PROMPT | Prompt Management | — | `/admin/ai/prompts` | read | |
| ADM-INFRA | System Health | SCR-055 | `/admin/health` | ✓ | |
| ADM-QUEUE | Queue Management | SCR-055 | `/admin/queues` | ✓ | |
| ADM-FLAGS | Feature Flags | — | `/admin/flags` | ✓ | |
| ADM-REL | Release Center | — | `/admin/releases` | ✓ | |
| ADM-SUPPORT | Support Dashboard | — | `/admin/support` | V1.1 | |
| ADM-KB | Knowledge Base | — | docs | ✓ | |
| ADM-SEC | Security Dashboard | — | `/admin/security` | ✓ | |
| ADM-AUDIT | Audit Explorer | — | `/admin/audit` | ✓ | |
| ADM-EXEC | Executive Dashboard | — | `/admin/executive` | ✓ | |
| ADM-PRODUCT | Product Dashboard | — | `/admin/product` | ✓ | |

## Automations

| AUTO-ID | Name | Schedule |
|---------|------|----------|
| AUTO-001 | Daily health report | daily |
| AUTO-002 | Weekly revenue summary | weekly |
| AUTO-003 | AI quality report | weekly |
| AUTO-004 | Queue depth alert | continuous |
| AUTO-005 | Backup verification | daily |

## Role matrix

See Volume 17 Ch. 3.

PR convention: `ADM-IDs: ADM-DASH, ADM-CUST`
