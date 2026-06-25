# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 18 — Mobile Experience, Offline Operations & Field Productivity

**Version 1.0**

---

## Who This Document Is For

Volume 18 is the **canonical mobile and field-work specification**. Most software is designed for desktops and squeezed onto phones. Mileage & Expense Copilot is used **in parking lots, airports, customer driveways, construction sites, restaurants, gas stations, and hotel lobbies**. The mobile experience is not a feature — it **is** the product.

| Role | Use this volume to… |
|------|---------------------|
| **Designers** | Thumb zones, outdoor contrast, field workflows |
| **Engineers** | PWA, offline queue, state restoration, camera pipeline |
| **QA** | Device matrix, field testing, interruption scenarios |
| **Product** | Mobile launch checklist and non-negotiables |

**Related:** [Volume 2 — Journeys](02-user-experience.md) · [Volume 10 — Components](10-design-system.md) · [Volume 11 — SCR-IDs](11-screen-bible.md) · [Volume 13 — SM-SYNC](13-state-machines.md) · [Volume 6 — PWA stack](06-technical-architecture.md)

**Volume 18 supersedes** Volume 2 and Volume 11 for mobile navigation, offline behavior, camera UX, and field workflow timing targets.

---

## Mobile Module Catalog

Permanent **MOB-IDs** for workflows, offline states, and field patterns.

Tracker: [`docs/mobile/MOB-INDEX.md`](../mobile/MOB-INDEX.md)

**Implementation:** `apps/web/src/lib/offline/` · `apps/web/src/components/mobile/` · Service Worker (PWA shell)

---

# Part I — Mobile Philosophy

## Chapter 1 — Purpose

This volume defines how the application behaves on:

| Platform | V1 | Future |
|----------|-----|--------|
| Android phones | ✓ | — |
| iPhones | ✓ | — |
| Android tablets | ✓ | — |
| iPads | ✓ | — |
| Foldable devices | — | layout hooks |
| Rugged enterprise devices | — | MOB-ENT-* |
| Desktop companion | — | responsive web |
| Wearables | — | Ch. 33 |

The application is designed around **field work**, not office work.

---

## Chapter 2 — Mobile Design Philosophy

The app must work when the user is:

| Context | Design implication |
|---------|-------------------|
| Standing beside a vehicle | One-handed, large targets |
| Holding a coffee | Primary actions low on screen |
| Wearing gloves (where practical) | 48px+ touch targets, minimal precision |
| Walking into a customer meeting | Interruptible flows, auto-save |
| Boarding an airplane | Offline queue, no blocking |
| Standing in a gas station | Camera-first, < 10s capture |
| Sitting in traffic (passenger only) | Quick trip start/end — no driving UI complexity |
| Poor cellular coverage | Offline-first writes |

> Every design decision assumes the user is **busy**.

---

## Chapter 3 — Mobile Design Principles

Every mobile screen must be:

| Principle | Requirement |
|-----------|-------------|
| **Reachable** | One-hand thumb zone (Ch. 7) |
| **Readable outdoors** | Contrast ≥ 4.5:1; sun-mode option (Ch. 21) |
| **Fast** | Perceived load < 1s for shell; see Ch. 17 |
| **Interruptible** | Draft persistence on every form field |
| **Recoverable** | State restore after call/background (Ch. 19–20) |
| **Offline-capable** | Queue writes; never block capture (Ch. 8–10) |
| **Camera-first** | Receipt path ≤ 3 taps from any main screen |
| **Battery-conscious** | No constant GPS; batch sync (Ch. 18) |

**Field Productivity Standard (Ch. 39)** gates every decision.

---

# Part II — Device Support

## Chapter 4 — Supported Devices

### Version 1 minimum

| OS | Minimum version | Notes |
|----|-----------------|-------|
| iOS Safari | 16.4+ | PWA Add to Home Screen |
| Android Chrome | 110+ | PWA install prompt |
| iPadOS | 16.4+ | Tablet layouts |
| Desktop browsers | Secondary | Sidebar nav; not field-optimized |

### Future (architecture hooks only)

* Foldables — `MOB-SC-FOLD` breakpoint
* Rugged devices — larger default typography
* Smartwatch — trip status glance (Ch. 33)
* CarPlay / Android Auto — post-V2

---

## Chapter 5 — Screen Classes

**MOB-SC-IDs** — components adapt; no separate products.

| MOB-SC-ID | Width | Columns | Nav |
|-----------|-------|---------|-----|
| MOB-SC-XS | < 360px | 1 | Bottom + FAB |
| MOB-SC-SM | 360–414px | 1 | Bottom + FAB |
| MOB-SC-MD | 415–767px | 1–2 | Bottom + FAB |
| MOB-SC-TB-S | 768–1023px | 2 | Bottom or side |
| MOB-SC-TB-L | ≥ 1024px | 2–3 | Sidebar (Volume 10) |

Use CSS container queries + Tailwind breakpoints (`sm`, `md`, `lg`). Test all five classes.

---

# Part III — Navigation

## Chapter 6 — Mobile Navigation

**MOB-NAV-001** — Bottom navigation (authenticated main shell)

| Tab | Route | Icon | SCR |
|-----|-------|------|-----|
| Dashboard | `/dashboard` | home | SCR-020 |
| Trips | `/trips` | route | SCR-021+ |
| Receipts | `/receipts` | camera/receipt | SCR-030+ |
| Reports | `/reports` | document | SCR-040+ |
| Settings | `/settings` | gear | SCR-042+ |

**MOB-NAV-FAB** — Floating Action Button

| Action | Label | Route / behavior |
|--------|-------|------------------|
| **Start Trip** | Primary FAB | Opens `StartTripSheet` (MOB-WF-START) |
| Long-press FAB (future) | Quick actions menu | Ch. 27 |

FAB position: bottom-right, 16px above bottom nav safe area. Hidden during active camera capture.

Context-sensitive actions (End Trip, Scan Receipt) appear in **thumb zone** on relevant screens — not only in FAB.

> **Canonical:** Volume 18 bottom nav replaces Volume 10 `Add` / `More` tabs for mobile. Tablet/desktop retain `SidebarNav`.

---

## Chapter 7 — Thumb-Zone Design

```
┌─────────────────────────┐
│  Secondary / status     │  ← avoid sole placement of primary actions
│                         │
│      Content            │
│                         │
│  ┌─────────────────┐    │
│  │ Primary CTA     │    │  ← thumb zone (bottom 40%)
│  └─────────────────┘    │
│ [Nav]            [FAB]  │
└─────────────────────────┘
```

| Rule | Spec |
|------|------|
| Primary CTA | Bottom-fixed on forms; min height 48px |
| Destructive actions | Never sole control in top corner |
| Touch targets | Min 44×44px (48px preferred) |
| Spacing between targets | Min 8px |
| Camera shutter | 72px, bottom center (Volume 10) |
| Swipe-back | iOS gesture respected; Android system back |

---

# Part IV — Offline Experience

## Chapter 8 — Offline Philosophy

> The application must **never** prevent a user from recording work because of poor connectivity.

**Offline-first priorities (ordered):**

| Priority | Action | MOB-OFF-ID |
|----------|--------|------------|
| 1 | Start trip | MOB-OFF-TRIP-START |
| 2 | End trip | MOB-OFF-TRIP-END |
| 3 | Capture receipt | MOB-OFF-RECEIPT |
| 4 | Edit notes / expenses | MOB-OFF-EDIT |
| 5 | Queue report request | MOB-OFF-REPORT |
| 6 | Profile edits (non-billing) | MOB-OFF-PROFILE |

**Read-only when offline:** subscription changes, password reset, new device linking.

**State machine:** SM-SYNC (Volume 13) is authoritative.

---

## Chapter 9 — Offline Indicators

**MOB-OFF-UI** — users must never wonder if work was saved.

| State | UI | Copy |
|-------|-----|------|
| **Online** | No banner (or subtle cloud ✓) | — |
| **Offline** | `OfflineBanner` amber | "You're offline — changes save on this device" |
| **Sync pending** | Badge on tab + count | "3 items waiting to sync" |
| **Syncing** | Progress in banner | "Syncing…" |
| **Synced** | Toast 2s | "All changes saved" |
| **Conflict** | `ConflictSheet` | "We found a conflict — tap to resolve" |

Show **last synced** timestamp in Settings → Sync status.

Analytics: EVT-062 `offline_save`, EVT-060 `sync_failed`, EVT-061 `sync_conflict_shown`.

---

## Chapter 10 — Offline Queue

**Storage:** IndexedDB via `apps/web/src/lib/offline/`

| Entity | Local ID | Server reconcile |
|--------|----------|------------------|
| Trips | `local_uuid` | API-TRIP-* |
| Receipts | `local_uuid` + blob | API-RCP-* |
| Expenses | `local_uuid` | API-EXP-* |
| Report jobs | `job_id` | API-RPT-* |
| Profile edits | `patch_queue` | API-PRF-* |

**Sync rules:**

1. Auto-resume on `online` event + app foreground
2. Exponential backoff on failure (max 5 min)
3. Idempotency keys on every upload (Volume 12)
4. Original receipt blob retained until server confirms + OCR complete
5. FIFO per entity type; trips before dependent receipts

**Conflict policy:** Last-write-wins for notes; merge UI for trip mileage conflicts; receipt duplicates flagged (SM-DUP).

---

# Part V — Camera Experience

## Chapter 11 — Receipt Capture

**MOB-WF-CAPTURE** · **SCR-031** Camera Capture

| Requirement | Spec |
|-------------|------|
| Launch time | Camera preview < 500ms after permission granted |
| Framing guide | Dashed receipt outline overlay |
| Auto-focus | Tap-to-focus + continuous AF |
| Flash | Auto / on / off toggle |
| Retake | Discard local blob, stay in camera |
| Preview | Confirm before queue/upload |
| Gallery fallback | Pick from camera roll |

**Future (post-V1):** edge detection, auto-capture, perspective correction — feature-flagged `MOB-FF-CAM-ADV`.

**Permissions:** SCR-012 Permissions — skippable with manual entry path.

---

## Chapter 12 — Image Processing

**MOB-WF-IMG** pipeline (immediate, non-blocking):

```
capture → save original (IndexedDB) → compress (WebP, max 2048px) →
queue upload → OCR when online → delete local blob after confirm
```

| Stage | User feedback |
|-------|---------------|
| Saved locally | Thumbnail + "Saved on device" |
| Uploading | Progress ring on receipt card |
| Processing | "Reading receipt…" |
| Complete | Navigate to review or toast |

Never delete original until: server ACK + thumbnail available OR user deletes draft.

---

# Part VI — Field Workflows

## Chapter 13 — Start Trip Flow

**MOB-WF-START** · Target: **< 10 seconds**

```
Vehicle (default pre-selected)
    ↓
Odometer (numeric keypad, last reading shown)
    ↓
Purpose (chips: Customer, Office, Other — last used default)
    ↓
Start
```

| Optimization | Detail |
|--------------|--------|
| Default vehicle | Last used or only vehicle |
| Odometer | Pre-fill last end reading |
| Purpose | Single-tap chips, not free text V1 |
| Offline | Full flow works; sync later |

**SCR:** Start Trip sheet / SCR-022. **SM:** SM-TRIP.

---

## Chapter 14 — End Trip Flow

**MOB-WF-END** · Target: **< 15 seconds**

```
Active trip summary (miles calculated)
    ↓
Receipt reminder ("2 receipts from this trip?")
    ↓
Notes (optional, voice-to-text future)
    ↓
Save / End Trip
```

Show calculated mileage prominently. "Forgot Something?" checklist (Volume 3) — dismissible chips, not blocking modal.

---

## Chapter 15 — Fuel Stop Workflow

**MOB-WF-FUEL** · Target: **< 20 seconds** stopped

```
Stop vehicle (optional pause — future)
    ↓
FAB or Quick Action → Scan Receipt
    ↓
Auto-attach to active trip
    ↓
Save → return to previous screen
```

Minimize interaction: category pre-set **Fuel** when launched from active trip context.

---

## Chapter 16 — Hotel Workflow

**MOB-WF-HOTEL** · multi-receipt same trip

Support in one trip session:

| Receipt type | Default category |
|--------------|------------------|
| Hotel folio | Lodging |
| Parking | Parking |
| Meal | Meals |

**UI:** After first hotel receipt, show "Add another expense for this trip?" chip row. Batch attach to active trip without re-navigation.

---

# Part VII — Mobile Performance

## Chapter 17 — Startup Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Cold start (PWA installed) | < 2s to interactive shell | Lighthouse |
| Warm start | < 800ms | RUM |
| Dashboard first paint | < 1.5s on 4G | EVT mobile |
| Session restore | < 500ms | local benchmark |

**Perceived performance:**

* Show skeleton dashboard immediately
* Hydrate trips/receipts progressively
* Never blank white screen > 300ms

**MOB-PERF-START** tracked in Volume 14 mobile metrics (Ch. 31).

---

## Chapter 18 — Battery Efficiency

| Avoid | Use instead |
|-------|-------------|
| Constant GPS polling | Manual odometer V1; optional location on start/end only (future) |
| Background sync every minute | Sync on foreground + connectivity change |
| Uncompressed image upload | WebP compression before queue |
| Polling OCR status | WebSocket or push (V1.1); exponential poll max 30s V1 |
| Animated loaders everywhere | CSS-only; respect `prefers-reduced-motion` |

**Target:** < 5% battery per 8-hour field day (measure on device matrix).

---

# Part VIII — Interruptions

## Chapter 19 — Phone Calls

**MOB-INT-CALL** — if interrupted mid-flow:

| Flow | Behavior |
|------|----------|
| Start trip form | Draft saved to sessionStorage + IndexedDB |
| Camera capture | Blob saved before interrupt if shutter pressed |
| OCR review | Form state persisted per field |
| End trip | Same as start trip |

On resume: **exact screen, exact scroll, exact field values**. No duplicate trips (idempotency key on start).

Test: simulate `visibilitychange` + `pagehide` events.

---

## Chapter 20 — App Backgrounding

**MOB-INT-BG** — restore on foreground:

| State | Restore |
|-------|---------|
| Active trip | `ActiveTripBanner` + trip ID |
| Draft receipt | Camera preview or review screen |
| OCR review | Partial form |
| Report config | Date range + format selections |
| Sync in progress | Resume upload from byte offset if supported |

Use `beforeunload` + `visibilitychange` + React state persistence layer (`usePersistedState`).

**SM-SCREEN** (Volume 13) documents dashboard overlay states.

---

# Part IX — Mobile Accessibility

## Chapter 21 — Outdoor Visibility

**MOB-A11Y-OUTDOOR**

| Feature | Implementation |
|---------|----------------|
| High contrast | WCAG AA minimum; AAA for primary text outdoors |
| Sun mode (optional) | Increased contrast + darker text on light bg |
| Large touch targets | 48px primary actions |
| Status indicators | Icon + text, not color alone |
| Typography | Body 16px min; headings scale with dynamic type |

Test at **10,000+ lux** (outdoor shade and direct sun).

---

## Chapter 22 — Accessibility

| Requirement | Standard |
|-------------|----------|
| Screen readers | VoiceOver, TalkBack — all CTAs labeled |
| Dynamic text | iOS Dynamic Type / Android font scale to 200% |
| Reduced motion | `prefers-reduced-motion` disables parallax |
| High contrast themes | System + in-app toggle |
| Voice control | Standard OS voice control paths |

Accessibility is part of the **field experience**, not a compliance checkbox.

---

# Part X — Mobile Security

## Chapter 23 — Device Security

Align Volume 8 with mobile specifics:

| Control | V1 |
|---------|-----|
| Biometric unlock | Optional app re-auth after 15 min background (PWA limitation: OS-level) |
| Secure local storage | IndexedDB encrypted at rest where OS provides; no secrets in localStorage |
| Session expiration | Supabase refresh token rotation |
| Device logout | Settings → Sign out all devices |

Offline data: receipt images encrypted on device where platform supports; clear on logout.

---

## Chapter 24 — Lost Device Recovery

| User action | System response |
|-------------|-----------------|
| Sign out remotely | Revoke refresh tokens (API-AUTH-*) |
| Revoke sessions | List in Settings → Security |
| New device install | Sign in → sync pulls server state; local-only unsynced data lost — warn in offline UI |

MSG security notifications per Volume 15.

---

# Part XI — Notifications

## Chapter 25 — Mobile Notification Rules

**MOB-NOTIF-*** — V1 in-app; push V1.1 (Volume 15)

| Notification | Trigger | Deep link |
|--------------|---------|-----------|
| Active trip reminder | 4h no end | `/trips/active` |
| OCR complete | processing done | `/receipts/[id]/review` |
| Report ready | job complete | `/reports/[id]` |
| Sync complete | queue empty after offline | `/dashboard` |
| Billing issue | Stripe webhook | `/settings/billing` |

Rules: max 3 push/day; respect quiet hours (Volume 15); never notify for marketing during active trip.

---

## Chapter 26 — Deep Linking

Every notification opens **directly** to relevant content.

**URL scheme:** `https://app.domain/{path}` — universal links / app links when wrapped.

| MSG / event | Target SCR |
|-------------|------------|
| Receipt ready | SCR-033 Review |
| Report ready | SCR-041 Viewer |
| Trip reminder | SCR-024 Active Trip |
| Sync conflict | SCR-052 Sync Status |

Test deep links from cold start and background.

---

# Part XII — Mobile Productivity

## Chapter 27 — Quick Actions

**MOB-QA-SHORTCUT** — long-press app icon (PWA / installed):

| Shortcut | Action |
|----------|--------|
| Start Trip | MOB-WF-START |
| Scan Receipt | MOB-WF-CAPTURE |
| Active Trip | `/trips/active` |
| Generate Report | `/reports/new` |

In-app: pull-down quick actions on Dashboard (optional V1.1).

---

## Chapter 28 — Widgets (Future)

**MOB-FF-WIDGET** — post-V1; architecture notes:

| Widget | Data shown | Privacy |
|--------|------------|---------|
| Active trip | Miles today, duration | No amounts |
| Today's mileage | Total miles | Aggregate only |
| Recent receipts | Count pending review | No merchant names on lock screen |
| Monthly totals | Miles + expense count | User opt-in |

Never expose full financial detail on lock screen.

---

# Part XIII — Tablet Experience

## Chapter 29 — Tablet Layout

**MOB-SC-TB-*** — do not scale phone UI.

| Pattern | Use |
|---------|-----|
| Split view | Trip list + trip detail |
| Master-detail | Receipts list + review panel |
| Side panel | Filters on reports |
| Multi-column dashboard | Widgets 2×2 |

Components: same Volume 10 tokens; layout grids differ.

---

## Chapter 30 — Landscape Mode

Optimize landscape for:

| Screen | Enhancement |
|--------|-------------|
| Receipt review | Image left, form right |
| Report viewer | TOC sidebar + content |
| Data entry | Wider numeric keypad |
| Dashboard | 3-column metrics |

Landscape provides **additional context**, not merely wider spacing.

---

# Part XIV — Mobile Analytics

## Chapter 31 — Mobile Metrics

Add to EVENT-REGISTRY (Volume 14):

| EVT-ID | Event | Purpose |
|--------|-------|---------|
| EVT-MOB-001 | `camera_launch_ms` | Capture perf |
| EVT-MOB-002 | `receipt_capture_complete` | Funnel |
| EVT-MOB-003 | `offline_session_start` | Offline usage |
| EVT-MOB-004 | `resume_after_interrupt` | Reliability |
| EVT-MOB-005 | `start_trip_duration_ms` | MOB-WF-START |
| EVT-MOB-006 | `sync_queue_depth` | Ops |

North Star contribution: faster capture → more complete records.

---

## Chapter 32 — Device Compatibility Dashboard

**ADM-MOB** (Volume 17 extension) tracks:

| Dimension | Source |
|-----------|--------|
| OS versions | `device_type` + UA parsed |
| Device models | anonymized model class |
| Screen size class | MOB-SC-ID |
| Performance tier | TTFB, capture time P95 |
| Crash rate | Sentry by device class |

Prioritize fixes for top 80% of field users.

---

# Part XV — Future Mobile Roadmap

## Chapter 33 — Planned Enhancements

**Optional** — never V1 dependencies:

| Feature | MOB-FF-ID |
|---------|-----------|
| Automatic trip detection | MOB-FF-AUTO-TRIP |
| Calendar integration | MOB-FF-CAL |
| Voice trip logging | MOB-FF-VOICE |
| Smartwatch companion | MOB-FF-WATCH |
| Bluetooth odometer | MOB-FF-BT-OBD |
| Wireless receipt printer | MOB-FF-PRINT |
| Car dashboard (CarPlay) | MOB-FF-CAR |

Feature-flagged with owner + retirement date (Volume 17 ADM-FLAGS).

---

## Chapter 34 — Enterprise Mobile

Future **MOB-ENT-*** hooks:

| Capability | Design note |
|------------|-------------|
| Shared devices | Fast user switch + mandatory logout |
| MDM policies | Disable screenshots on receipt screen |
| Org enrollment | Managed app config URL |
| Fleet deployments | Bulk device provisioning |

`packages/shared/src/permissions/mobile.ts` — extensibility point.

---

# Part XVI — Mobile QA

## Chapter 35 — Field Testing

**MOB-QA-FIELD** — mandatory before launch:

| Environment | Test |
|-------------|------|
| Bright sunlight | Readable UI, camera glare |
| Rain (device permitting) | Touch with damp fingers |
| Weak network (3G throttle) | Offline queue |
| Airplane mode | Full trip + receipt cycle |
| Parking lot | One-handed start trip |
| Hotel lobby | Wi-Fi captive portal recovery |
| Airport | Intermittent connectivity |
| Rural road | Sync resume |
| Urban canyon | Delayed sync |

> Real-world testing reveals issues office testing misses.

---

## Chapter 36 — Device Matrix

**MOB-QA-DEVICE** — maintain in `docs/mobile/DEVICE-MATRIX.md`

| Tier | Examples | OS |
|------|----------|-----|
| iOS flagship | iPhone 14+ | iOS 17–18 |
| iOS budget | iPhone SE 3 | iOS 16+ |
| Android flagship | Pixel 8, Galaxy S24 | Android 13+ |
| Android mid | Galaxy A series | Android 12+ |
| iPad | iPad 10th gen | iPadOS 17 |
| Android tablet | Galaxy Tab | Android 13 |

Validate: start trip, capture, offline sync, resume, end trip on **each tier** before release.

---

# Part XVII — Mobile Launch

## Chapter 37 — Version 1 Readiness

| # | Gate |
|---|------|
| 1 | [ ] One-handed workflows verified (MOB-WF-*) |
| 2 | [ ] Offline queue E2E tested |
| 3 | [ ] Camera flow < 500ms launch |
| 4 | [ ] Resume after call/background |
| 5 | [ ] Battery review on 2 devices |
| 6 | [ ] Notification deep links (in-app V1) |
| 7 | [ ] Accessibility audit (VoiceOver + TalkBack) |
| 8 | [ ] Tablet layouts reviewed |
| 9 | [ ] Performance targets met (Ch. 17) |
| 10 | [ ] Device matrix signed off |

---

## Chapter 38 — Mobile Non-Negotiables

| # | Rule |
|---|------|
| 1 | App works without continuous connectivity |
| 2 | Users never lose captured data |
| 3 | Camera workflows fast and reliable |
| 4 | Primary actions reachable with one hand |
| 5 | Interruptions do not corrupt work |
| 6 | Mobile performance is a feature |
| 7 | Field usability over visual complexity |
| 8 | Offline state always visible when disconnected |
| 9 | Sync conflicts surfaced, not silently merged |
| 10 | PWA install path documented for iOS and Android |

---

## Chapter 39 — The Field Productivity Standard

Every mobile design decision answers:

> **"If a user is standing beside their vehicle in the rain, with one free hand and only thirty seconds before their next appointment, can they complete this task confidently?"**

| Answer | Action |
|--------|--------|
| **Yes** | Ship |
| **No** | Simplify until yes |

This standard guides every mobile screen, workflow, and interaction for the life of the product.

---

## Cross-Reference Index

| Volume | Link |
|--------|------|
| Volume 2 | Journeys — mobile detail in Vol 18 |
| Volume 3 | FR-1400/1500 offline |
| Volume 6 | PWA, IndexedDB, service worker |
| Volume 8 | Mobile security |
| Volume 10 | Components — thumb, camera, BottomNav |
| Volume 11 | SCR mobile columns |
| Volume 13 | SM-SYNC, SM-SCREEN |
| Volume 14 | EVT mobile events |
| Volume 15 | Push, deep links |
| Volume 17 | Device compatibility dashboard |

---

## Document Map

| Need | Go to |
|------|-------|
| MOB workflows | [MOB-INDEX.md](../mobile/MOB-INDEX.md) |
| Device matrix | [DEVICE-MATRIX.md](../mobile/DEVICE-MATRIX.md) |
| Offline code | `apps/web/src/lib/offline/` |
| Sync state machine | [Volume 13 SM-SYNC](13-state-machines.md) |

---

*Previous: [Volume 17 — AdminOS](17-admin-operating-system.md) | Return to [Blueprint Index](README.md)*
