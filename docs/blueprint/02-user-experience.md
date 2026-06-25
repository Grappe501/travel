# Volume 2 — User Experience

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

Every screen, flow, and state defined before implementation.

---

## Navigation Architecture

### Mobile (primary)

Bottom tab bar — 5 tabs:

| Tab | Icon | Primary action |
|-----|------|----------------|
| **Home** | House | Dashboard |
| **Trips** | Route | Trip timeline + Start Trip FAB |
| **Scan** | Camera | Receipt scanner (center, elevated) |
| **Reports** | Chart | Report hub |
| **More** | Menu | Settings, vehicles, businesses, billing, help |

**Floating action button (FAB):** "Start Trip" on Home and Trips tabs when no active trip.

**Active trip banner:** Persistent top banner when trip in progress — tap to return to active trip.

### Desktop (secondary)

Left sidebar: Home · Trips · Reports · Settings  
Top bar: Business selector · Profile · Notifications

---

## Screen Inventory

### Authentication

| Screen | Route | Purpose |
|--------|-------|---------|
| Welcome | `/` | Marketing hook + sign up / log in |
| Sign up | `/auth/signup` | Email + password or OAuth |
| Log in | `/auth/login` | Email + password or OAuth |
| Forgot password | `/auth/forgot` | Reset email flow |
| Reset password | `/auth/reset` | New password entry |
| Email verification | `/auth/verify` | Confirm email |

### Onboarding (first launch)

| Step | Content |
|------|---------|
| 1 | Welcome — value prop (30 sec) |
| 2 | Create first business (name, optional EIN) |
| 3 | Add first vehicle (name, optional odometer) |
| 4 | Set mileage rate (IRS default pre-selected) |
| 5 | Optional: start first trip or explore dashboard |

Skip allowed after step 2 (business required).

### Dashboard — `/home`

**Sections (top to bottom):**

1. **Greeting** — "Good morning, {firstName}"
2. **Active trip card** (if applicable) — elapsed time, miles so far, "Add Expense" + "End Trip"
3. **Quick stats row** — Today miles · Month miles · Month expenses · Est. deduction
4. **Action cards** — Incomplete trips (count) · Receipts to review (count)
5. **Recent activity** — Last 5 events (trip started, receipt scanned, trip completed)
6. **Start Trip CTA** — Large button if no active trip

**Empty state (new user):** Illustration + "Start your first trip" + brief tip.

### Start Trip — `/trips/start`

**Form fields:**

| Field | Required | Default / behavior |
|-------|----------|-------------------|
| Business | Yes | Last used |
| Vehicle | Yes | Default vehicle |
| Purpose | Yes | Free text + recent suggestions |
| Client / project | No | Autocomplete from history |
| Destination | No | Text + optional map pin |
| Starting location | No | GPS detect (permission prompt) |
| Starting odometer | No* | Last ending odometer for vehicle |

*Required if user disables GPS and wants manual miles.

**Primary button:** Start Trip (large, bottom-fixed)

**Auto-save:** Draft every 30 seconds to local storage + sync when online.

### Active Trip — `/trips/[id]/active`

- Map (if locations available)
- Elapsed time
- Purpose, client, vehicle summary
- **Add Expense** button
- **End Trip** button
- Expense list (this trip only)
- Edit trip details (overflow menu)

### End Trip — `/trips/[id]/end`

**Step 1 — Trip closure**

| Field | Required |
|-------|----------|
| Ending odometer | Yes (if start odometer used) |
| Ending location | No (GPS) |
| Notes | No |

**Step 2 — "Forgot Something?" checklist**

```
☐ Did you buy fuel?
☐ Did you pay for parking?
☐ Did you pay a toll?
☐ Did you buy supplies?
☐ Did you have a business meal?
☐ Do you have receipts to photograph?
```

Each checked item → shortcut to Scan with category pre-selected.

**Step 3 — Summary**

- Total miles · Reimbursement · Expenses · Grand total · Est. deduction
- **Complete Trip** button

### Receipt Scanner — `/scan`

**Flow:**

1. Camera viewfinder (or file upload on desktop)
2. Capture → upload → loading ("Reading receipt…")
3. **Review screen** — extracted fields with confidence indicators
4. Assign to: Active trip (default) / Select trip / No trip (unassigned)
5. Save

**Review fields:** Merchant · Date · Subtotal · Tax · Total · Category · Payment method · Notes

Low-confidence fields highlighted amber; user must confirm before save.

### Trip Detail — `/trips/[id]`

- Timeline card header (map, dates, status badge)
- Mileage summary
- Purpose, client, notes
- Expense list with receipt thumbnails
- Totals breakdown
- Actions: Edit · Duplicate · Delete · Export trip PDF
- Status toggles: Reimbursement (pending/submitted/paid) · Invoiced · Paid

### Trip Timeline — `/trips`

- Filter: Date range · Business · Vehicle · Client · Status
- Sort: Newest · Oldest · Highest value
- Cards: Date · Route summary · Miles · Expenses · Receipt count · Status chips
- Search by purpose, client, merchant
- Infinite scroll pagination

### Reports Hub — `/reports`

**Report types:**

| Report | Description |
|--------|-------------|
| Mileage log | IRS-style: date, destination, business purpose, miles |
| Expense report | Itemized by category |
| Combined travel | Mileage + expenses per trip |
| Client summary | Totals grouped by client/project |
| Reimbursement | Ready for employer submission |

**Filters:** Daily · Weekly · Monthly · Quarterly · Annual · Custom range  
**Export:** PDF · CSV · Excel

**Preview** before download.

### Settings — `/settings`

| Section | Items |
|---------|-------|
| Profile | Name, email, password, avatar |
| Businesses | List, add, edit, set default |
| Vehicles | List, add, edit, set default, odometer |
| Mileage rates | IRS standard (auto-update annually), custom per business/vehicle |
| Categories | Default list + custom add/edit/hide |
| Preferences | Currency, tax year, dark mode, units (miles/km) |
| Notifications | Email reminders, incomplete trip nudges |
| Data | Export all data, delete account |
| Billing | Current plan, upgrade, payment method, invoices |
| Help | FAQ, contact support, privacy, terms |

### Billing — `/settings/billing`

- Current plan badge
- Usage meters (free tier: trips/receipts this month)
- Upgrade cards (Pro, Small Business)
- Stripe customer portal link
- Billing history

### Empty States

| Context | Message | Action |
|---------|---------|--------|
| No trips | "No trips yet" | Start Trip |
| No receipts | "Scan your first receipt" | Open camera |
| No vehicles | "Add a vehicle to track mileage" | Add vehicle |
| No businesses | "Create a business profile" | Add business |
| Offline | "You're offline — changes saved locally" | — |
| OCR failed | "Couldn't read this receipt" | Retry or enter manually |

### Loading States

- Skeleton cards on dashboard
- Progress bar on OCR ("Analyzing receipt…")
- Spinner on report generation with cancel option

### Error States

| Error | User message | Recovery |
|-------|--------------|----------|
| Network | "Connection lost" | Retry + offline queue indicator |
| Auth expired | "Please sign in again" | Redirect to login |
| Limit reached | "Free plan: 5 trips this month" | Upgrade CTA |
| OCR timeout | "Taking longer than usual" | Wait or manual entry |
| Validation | Inline field errors | Fix and resubmit |

---

## Key User Flows

### Flow A — Complete trip with fuel receipt (< 2 min)

```
Dashboard → Start Trip → [drive] → Add Expense → Scan receipt → Confirm → End Trip → Checklist → Summary → Done
```

### Flow B — Retroactive trip entry

```
Trips → + Manual Trip → Enter start/end date, odometer, details → Add receipts → Save
```

### Flow C — Monthly report for accountant

```
Reports → Combined travel → Monthly → Preview → Export PDF → Share
```

### Flow D — Free tier hits limit

```
Start Trip → Blocked modal → "5 of 5 trips used" → Upgrade to Pro → Stripe checkout → Return → Start Trip
```

---

## Visual Design Direction

- **Palette:** Calm blues and greens, high contrast for outdoor readability
- **Typography:** System font stack for speed; large numerals for mileage/expense totals
- **Dark mode:** Full support, respects system preference
- **Touch targets:** Minimum 44×44 px
- **Receipt photos:** Rounded corners, pinch-to-zoom in detail view

---

## Accessibility (V1)

- WCAG 2.1 AA target
- Screen reader labels on all interactive elements
- Focus order matches visual order
- Color not sole indicator of status (icons + text)
- Reduced motion preference respected

---

## Offline Mode (V1)

- Start/end trip queued locally
- Receipt photos stored in IndexedDB until upload
- Sync indicator in header
- Conflict resolution: server wins on timestamp tie; user notified

---

*Previous: [Volume 1 — Product Vision](01-product-vision.md) | Next: [Volume 3 — Functional Requirements](03-functional-requirements.md)*
