# Domain Dependency Graph

**MRMS-2 Part VIII**

---

## Core Platform

```
CORE
 ├── AUTH ──requires──► DB
 ├── USER ──requires──► AUTH, DB
 ├── BUS  ──requires──► AUTH, USER, SUB (limits)
 ├── ROLE ──requires──► AUTH, USER
 └── TEAM ──requires──► ORG (V1.1+)
```

---

## Travel

```
TRIP ──requires──► AUTH, BUS, VEH, DB, SYNC, LOC, MILE
  ├── provides ──► REC, EXP, RPT, AN, NOTIFY, AI
  └── MOB extends offline paths

VEH ──requires──► AUTH, BUS, DB
  └── provides ──► TRIP

LOC, MILE ──requires──► TRIP (calculation)
```

---

## Receipts

```
REC ──requires──► AUTH, FILE, DB, TRIP (attach)
  ├── provides ──► OCR, EXP, RPT, AI
  └── QUEUE ──► OCR jobs

OCR ──requires──► REC, FILE, AI, QUEUE
MERCH, CAT ──requires──► OCR, AI
EXP ──requires──► TRIP, REC, CAT
```

---

## Reporting

```
RPT ──requires──► TRIP, EXP, DB
PDF, EXPORT ──requires──► RPT
```

---

## AI

```
AI ──requires──► REC, OCR (inputs)
PROMPT, DUP, SEARCH, MEM ──under──► AI
  └── provides suggestions to EXP, REC (non-blocking)
```

---

## Billing

```
SUB ──requires──► AUTH, DB, PAY
  └── limits enforced on TRIP, REC, EXP, RPT writes
PAY ──requires──► SUB (Stripe)
```

---

## Admin & Ops

```
ADMIN ──requires──► all core read APIs
OPS, MON ──requires──► CORE, DB
SUP ──requires──► ADMIN, NOTIFY
```

---

## Analytics & Communication

```
AN, EVENT ──consumes──► all domain EVENT types
NOTIFY, EMAIL, PUSH ──triggered by──► TRIP, REC, SUB, OPS
```

---

## Bootstrap Critical Path

```
AUTH → BUS → VEH → TRIP → REC → OCR → EXP → RPT → SUB
                      ↓
                     MOB (parallel)
                      ↓
                     AI (enhancement)
                      ↓
                    ADMIN
```

Update when new domains register. Visual: MEI §5 + this document.
