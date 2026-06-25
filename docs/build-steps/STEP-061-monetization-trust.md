# STEP-061 — Monetization & trust (MEC-V1-S029)

**Version:** 1.6.0 · **API:** API-EXP-010 · **Screens:** SCR-050, legal pages

## Scope

- Legal pages: `/legal/privacy`, `/legal/terms`, `/legal/refunds` + app footer links
- Usage UX: progress meters on dashboard/billing, upgrade CTA when free limits hit
- Account export: `POST /api/export/account` JSON bundle (GDPR-style)
- Settings: `/settings/privacy` data export + legal links
- Email (Resend): trip-ended summary + receipt-processed notifications (pref-controlled)
- Production readiness notes for Stripe live + Resend domain verification

## Environment

```bash
# Stripe (existing)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_SMALL_BUSINESS_MONTHLY=

# Email (new)
RESEND_API_KEY=
RESEND_FROM_EMAIL="Mileage & Expense Copilot <noreply@yourdomain.com>"
```

Webhook URL: `https://<site>/api/stripe/webhook`

## Verification

- [x] Legal pages render without auth
- [x] Free tier limit shows upgrade link on trip start / receipt upload
- [x] Dashboard shows usage meters at 80%+ warning
- [x] Account export downloads JSON from settings/privacy
- [x] Trip end + OCR completion send email when Resend configured and prefs enabled
