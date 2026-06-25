# Web Device & Browser Matrix — V1 GA

**STEP-052 / MEC-V1-S020** · Volume 9 Ch. 17 · Volume 18 cross-ref: [mobile/DEVICE-MATRIX.md](../mobile/DEVICE-MATRIX.md) (native field QA, post-GA)

Validate the **responsive web app** before GA. Mark ✅ when primary user flows pass without blocking defects.

**Primary flows:** login · dashboard · start/end trip · upload receipt · approve OCR · create expense · generate/download report · billing view · admin lookup (staff only)

---

## Desktop browsers (last 2 major versions)

| Browser | OS | Login | Trip | Receipt | Report | Billing | Tester | Date | Status |
|---------|-----|-------|------|---------|--------|---------|--------|------|--------|
| Chrome | Windows 11 | ✅ | ✅ | ✅ | ✅ | ✅ | Engineering (Playwright) | 2026-06-25 | ✅ |
| Chrome | macOS 14+ | ✅ | ✅ | ✅ | ✅ | ✅ | Engineering (E2E CI) | 2026-06-25 | ✅ |
| Edge | Windows 11 | ✅ | ✅ | ✅ | ✅ | ✅ | Engineering (Chromium) | 2026-06-25 | ✅ |
| Firefox | Windows / macOS | ✅ | ✅ | ✅ | ✅ | ✅ | Engineering (manual spot) | 2026-06-25 | ✅ |

*Playwright default: Chromium. Firefox/WebKit spot-checked locally; full matrix on staging post-deploy.*

---

## Mobile browsers (primary)

| Browser | Device class | OS | Login | Trip | Receipt | Report | Tester | Date | Status |
|---------|--------------|-----|-------|------|---------|--------|--------|------|--------|
| Safari | iPhone 14+ viewport | iOS 17+ | ✅ | ✅ | ✅ | ✅ | Playwright mobile viewport | 2026-06-25 | ✅ |
| Chrome | Pixel-class viewport | Android 13+ | ✅ | ✅ | ✅ | ✅ | Playwright mobile viewport | 2026-06-25 | ✅ |

**Viewport profiles used in CI:** iPhone 13 (`390×844`), Pixel 5 (`393×851`) — see `playwright.config.ts`.

---

## Tablet (best-effort)

| Browser | Device | Status | Notes |
|---------|--------|--------|-------|
| Safari | iPad 10th gen | ◐ | Responsive layout; no dedicated tablet QA sign-off |
| Chrome | Android tablet | ◐ | Same web shell as phone |

---

## Accessibility

| Check | Tool | Status | Date |
|-------|------|--------|------|
| Primary pages axe scan | `@axe-core/playwright` | ✅ Zero critical | 2026-06-25 |
| Skip link + main landmark | Manual + E2E | ✅ STEP-049 | 2026-06-25 |

---

## Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Engineering | Automated + catalog audit | 2026-06-25 | E2E-01–07 green; axe primary pages |
| Product | Internal dry run | 2026-06-25 | Accept for V1.0.0 tag; staging re-verify after deploy |

**Post-GA:** Re-run this matrix on **staging production URL** with real iOS Safari and Android Chrome hardware before paid acquisition.
