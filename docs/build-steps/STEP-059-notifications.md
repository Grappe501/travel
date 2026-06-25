# STEP-059 — In-app notifications (MEC-V1-S027)

**Version:** 1.4.0

## Scope

- `notifications` table + `profiles.notification_prefs`
- API-NOT-001 List · API-NOT-002 Mark read · API-NOT-003 Preferences
- SCR-042 `/notifications` notification center
- `/settings/notifications` preference toggles
- Sync engine: active trip expenses, forgot-to-end (24h), receipt review pending, post-trip checklist
- Notification bell (desktop top nav + mobile shell)

## Migration

```bash
pnpm db:migrate:deploy:local
# or production session pooler
pnpm db:migrate:deploy
```

## Verification

- [ ] `/notifications` lists synced reminders
- [ ] Mark read / mark all read works
- [ ] End trip with no expenses creates checklist notification
- [ ] Active trip >24h creates forgot-to-end reminder
- [ ] Preferences disable category sync
