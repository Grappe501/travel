# Deployment Rollback Runbook

**OPS-RB-004** · Volume 19 Ch. 8

## When to rollback

* Health check fails after deploy (API-HLT-001)
* Error rate spike > 5× baseline in 15 minutes
* Critical user flow broken (auth, trip start, receipt upload)
* Founder or eng lead decision

## Procedure

1. Identify last known good deploy in Netlify deploy history
2. Click **Publish deploy** on previous production deploy
3. If migration was applied: assess whether down-migration needed (avoid if possible)
4. Verify health checks and smoke suite
5. Log incident + rollback in BUILD-LOG / admin audit
6. Post-mortem within 48h if P1–P2

## Prevention

* Staging validation mandatory
* Feature flags for risky changes
* Database migrations backward-compatible when possible
