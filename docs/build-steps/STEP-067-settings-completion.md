# STEP-067 — Settings completion (MEC-V1-S035)

**Version:** 1.9.1 · **Slice:** MEC-V1-S035

## Scope

Complete deferred settings sub-screens from SCR-047–SCR-049: account profile, appearance theme, and security controls.

### Account (`/settings/account`)

- Display name, first/last name, timezone, currency, tax year
- Read-only email with verification badge
- `GET/PATCH /api/settings/account`

### Appearance (`/settings/appearance`)

- Light · Dark · System theme selector
- Local storage preference with `data-theme` on `<html>`
- FOUC prevention via inline boot script

### Security (`/settings/security`)

- Change password (verify current via Supabase, then update)
- Email verification status + resend
- Sign out
- `POST /api/settings/password`

### Settings hub

- Grouped navigation: Account & security · Preferences · Workspace
- `SettingsNavList` component with v2 tile styling

## Verification

- [x] Shared schemas: `accountSettingsSchema`, `changePasswordSchema`, `appearancePreferenceSchema`
- [x] Account PATCH persists to `UserProfile`
- [x] Password change rejects wrong current password
- [x] Theme applies immediately and survives reload
- [x] Settings hub links to all sub-pages

## Screens

| SCR | Route | Status |
|-----|-------|--------|
| SCR-047 | `/settings/account` | ☑ |
| SCR-048 | `/settings/appearance` | ☑ |
| SCR-049 | `/settings/security` | ☑ |
| SCR-046 | `/settings` | ☑ enhanced |
