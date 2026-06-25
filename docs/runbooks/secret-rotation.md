# Secret Rotation Runbook

**Volume 17 Ch. 26** · Volume 8

## Secrets inventory

| Secret | Location | Rotation cadence |
|--------|----------|------------------|
| Supabase service role | Netlify env | 90 days |
| Stripe webhook secret | Netlify env | on compromise |
| OpenAI API key | Supabase secrets | 90 days |
| Resend API key | Netlify / Supabase | 90 days |

## Procedure

1. Generate new secret in provider console
2. Deploy to staging; verify health checks
3. Deploy to production
4. Revoke old secret after 24h soak
5. Log rotation in `admin_audit_logs`

Never commit secrets to git.
