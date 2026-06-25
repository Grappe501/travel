# Risk Register

**FCT-RISK-001** · Volume 23 Ch. 26

Review monthly. Assign owner and mitigation for each open risk.

| ID | Category | Risk | Likelihood | Impact | Owner | Mitigation | Status |
|----|----------|------|------------|--------|-------|------------|--------|
| RISK-001 | Technical | No application code yet — first deploy untested | M | H | Eng | WAVE-001 + Volume 19 gates | open |
| RISK-002 | Vendor | OpenAI pricing / availability | M | M | Eng | PLT-AI-RULE-001, manual fallback | open |
| RISK-003 | Vendor | Stripe webhook failures | L | H | Eng | OPS-RB-009, reconcile job | open |
| RISK-004 | Operational | Solo founder bus factor | H | H | Founder | Document in factory + runbooks | open |
| RISK-005 | Security | Dependency vulnerabilities | M | M | Eng | FCT-AUTO-001 scanning | open |
| RISK-006 | AI | OCR accuracy below threshold | M | M | Eng | Golden set, Volume 16 | open |

**Categories:** Technical · Operational · Security · Vendor · AI · Business

Add rows as risks are identified. Close with date + resolution note.
