# MEC-V2-S015 — Partner API + webhooks

**STEP:** STEP-088 · **Target:** 2.3.0 · **ROAD:** ROAD-API

---

## Prompt

```txt
Build Slice: MEC-V2-S015 — Partner API v1 + webhooks

Mission:
Scoped API keys, /api/v1/partner routes, webhook subscriptions for trip.ended and report.generated.

Deliverables:
1. api_keys + webhook_subscriptions tables
2. /settings/api key management UI
3. Routes: GET trips, receipts, reports (scoped)
4. Webhook delivery with HMAC signature + retry
5. Rate limiting 100 req/min
6. Security review checklist
7. APP_RELEASE 2.3.0

Exit criteria:
- [ ] API key with trips:read only cannot read receipts
- [ ] Webhook fires on trip end in staging
- [ ] GO-NO-GO E5 security review complete
```

## Kanban

☐ Planned
