# DRS Domain Governance

**MRMS-2 Part XI**

---

## New Domain Proposal

Submit via issue or `docs/domains/proposals/DOMAIN-PROPOSAL-{CODE}.md`:

| Field | Required |
|-------|----------|
| Proposed code | 2–6 uppercase letters |
| Name | Human-readable |
| Super-domain | Which group in DRS-INDEX |
| Responsibility | What it owns exclusively |
| Why existing domains fail | Proof of distinctness |
| Requires / Provides | Dependency edges |
| Owners | All seven roles (or N/A) |
| MRID estimate | V1 count |

---

## Approval Gate

| Approver | Signs off |
|----------|-----------|
| Architecture | Naming, dependencies |
| Product | Scope distinctness |
| Engineering | Feasibility |

After approval:

1. Add row to [DRS-INDEX.md](DRS-INDEX.md)
2. Create [DRS-DOMAIN-TEMPLATE.md](DRS-DOMAIN-TEMPLATE.md) record
3. Allocate MRID range in [DOMAIN-INDEX.md](../requirements/DOMAIN-INDEX.md)
4. Update [DRS-DEPENDENCIES.md](DRS-DEPENDENCIES.md)
5. Announce in BUILD-LOG if meta-layer change

---

## Forbidden

- Renaming registered domains
- Recycling domain codes
- Creating domains for single features (use MRID under existing domain)
- Duplicate ownership (two primary domains for one artifact)

---

## Reserved Codes

Codes marked ☐ in DRS-INDEX are **reserved** — do not use until formally registered.

---

## Emergency Domain

Only **CORE** may host cross-cutting artifacts with Architecture approval. Prefer the most specific domain.
