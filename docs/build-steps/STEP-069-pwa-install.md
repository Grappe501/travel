# STEP-069 — PWA install & offline app (MEC-V1-S037)

**Version:** 1.10.0 · **Slice:** MEC-V1-S037

## Scope

Installable Progressive Web App with custom icon, home-screen launch, and offline shell caching — building on the existing IndexedDB offline sync engine (STEP-053).

### PWA manifest & icons

- `manifest.webmanifest` — standalone display, teal theme, start URL `/dashboard`
- Custom app icons (192, 512, maskable, Apple touch) in `public/icons/`

### Service worker

- `public/sw.js` — precaches offline fallback + icons; caches static assets and visited pages
- `ServiceWorkerRegister` — registers in production with version cache-bust query
- Branded `offline.html` fallback when navigation fails offline

### Install UX

- **Home page** — Install banner with app icon and offline pitch
- **Dashboard** — Install banner for returning users
- **Settings → Install app** — `/settings/install` with Android/iOS instructions
- Chrome `beforeinstallprompt` + iOS Safari “Add to Home Screen” guidance

### Security

- CSP `worker-src 'self'` and `manifest-src 'self'` in headers + Netlify

## Verification

- [x] Manifest linked from root layout metadata
- [x] Route audit includes `/settings/install`
- [x] Offline queue (trips/receipts) unchanged — works in installed PWA
- [x] `pnpm lint && pnpm test && pnpm build`

## User flow

1. Visit site on phone → tap **Install app**
2. App appears on home screen with MEC icon
3. Open without network → cached shell + offline page; queued actions sync on reconnect
