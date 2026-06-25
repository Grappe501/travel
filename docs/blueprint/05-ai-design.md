# Volume 5 — AI Design

**Mileage & Expense Copilot** | Master Build Blueprint v1.0

The Copilot: OCR, categorization, duplicate detection, and future intelligence.

---

## AI Philosophy (from Volume 0)

- **Suggest, never silently commit** financial data
- **Explain** every suggestion
- **Confidence scores** drive UI highlighting
- **Human review** required below threshold
- **Version prompts** — track model_version on every OCR result

---

## V1 AI Capabilities

| Capability | Priority | User interaction |
|------------|----------|------------------|
| Receipt OCR | P0 | Review screen, confirm fields |
| Auto-categorization | P0 | Pre-selected category, user can change |
| Duplicate receipt detection | P1 | Warning banner, user dismisses or confirms |
| Missing receipt reminders | P1 | End-trip checklist + optional nudges |
| Merchant recognition (gas/hotel/restaurant) | P1 | Improves category confidence |

**Not in V1:** Trip splitting, spending insights, auto trip detection, voice notes, handwritten OCR.

---

## OCR Pipeline Architecture

```
[Client] Capture image
    → Upload to Supabase Storage (receipts bucket)
    → Insert receipts row (status: pending)
    → Invoke Edge Function: process-receipt
        → Resize/optimize image (max 2048px)
        → Call Vision LLM (structured output)
        → Parse + validate response
        → Insert ocr_results
        → Update receipt status: ready
        → Return structured fields + confidence
[Client] Review screen → user confirms → create expense
```

**Target latency:** P95 < 5 seconds for typical receipt photo.

---

## Vision Model Request Design

### Input
- Image URL (signed, short TTL) or base64 for Edge Function
- Context (optional): active trip purpose, client, recent merchants

### Structured output schema (JSON)

```json
{
  "merchant": { "value": "string", "confidence": 0.0-1.0 },
  "date": { "value": "YYYY-MM-DD", "confidence": 0.0-1.0 },
  "subtotal": { "value": number, "confidence": 0.0-1.0 },
  "tax": { "value": number, "confidence": 0.0-1.0 },
  "total": { "value": number, "confidence": 0.0-1.0 },
  "payment_method": { "value": "string|null", "confidence": 0.0-1.0 },
  "suggested_category": { "value": "fuel|meal|hotel|parking|toll|supplies|other", "confidence": 0.0-1.0 },
  "merchant_type": { "value": "gas_station|restaurant|hotel|retail|other", "confidence": 0.0-1.0 },
  "is_likely_business_expense": { "value": boolean, "confidence": 0.0-1.0 }
}
```

### System prompt principles

1. Extract only what is visible — never invent line items
2. If field unreadable, return null with confidence 0
3. Prefer printed text over handwritten (flag low confidence for handwriting)
4. Date format ISO 8601; assume US receipt formats unless currency indicates otherwise
5. Total must match visible "TOTAL" or "AMOUNT DUE" — not subtotal

**Prompt versioning:** Store `prompt_version` in `ocr_results.model_version` (e.g. `receipt-v1.2-gpt4o`).

---

## Confidence Thresholds

| Field | Auto-accept threshold | UI highlight below |
|-------|----------------------|-------------------|
| total | ≥ 0.85 | < 0.85 amber |
| merchant | ≥ 0.80 | < 0.80 |
| date | ≥ 0.80 | < 0.80 |
| category suggestion | ≥ 0.75 | < 0.75 show picker |

**Overall:** If `total.confidence` < 0.60, show "Low confidence — please verify all fields."

User tap on **Save** = explicit confirmation regardless of confidence.

---

## Category Suggestion Logic

**Layer 1 — Merchant type mapping**

| merchant_type | Default category |
|---------------|------------------|
| gas_station | fuel |
| restaurant | meal |
| hotel | hotel |
| retail | supplies |

**Layer 2 — Keyword fallback in merchant name**

Shell, Chevron, BP → fuel  
Marriott, Hilton → hotel  
Parking, ParkWhiz → parking

**Layer 3 — Trip context**

Active trip with prior fuel expense → lower threshold for fuel suggestion.

**Never override** user-selected category on subsequent OCR for same session.

---

## Duplicate Detection

**On receipt upload:**

1. Compute SHA-256 hash of image bytes
2. Query `receipts` where `user_id` match and `file_hash` match within 90 days
3. If match → create `ai_suggestions` type=`duplicate_receipt`
4. UI: "This looks like a receipt you scanned on {date}. Continue anyway?"

**Secondary fuzzy match (V1.1):** Same merchant + same total + same date ± 1 day.

---

## Missing Receipt Intelligence

### End-trip checklist (rule-based, not LLM)

Static prompts — no AI required for V1.

### Post-trip nudge (optional email)

If trip has fuel-category expense without receipt OR checklist indicated fuel but no fuel expense:

> "Your trip to {destination} on {date} may be missing a fuel receipt."

---

## Hallucination Prevention

| Risk | Mitigation |
|------|------------|
| Invented totals | Structured output + confidence; user must confirm |
| Wrong decimal place | Sanity check: total ≥ subtotal when both present |
| Future dates | Reject date > today + 1 day |
| Negative amounts | Reject |
| API failure | Fall back to manual entry; never show fake data |

**Never display** AI-extracted amounts as saved until user confirms.

---

## One-Tap Expense Intelligence (Wow Feature)

After OCR + user confirm in single flow:

1. Auto-attach to active trip (if exists)
2. Auto-fill client from trip
3. Show summary card:

```
Trip #{n} · {category} · {merchant} · ${total}
Assigned to: {client or purpose}
Total business trip value: ${grand_total}
```

4. Update dashboard deduction estimate optimistically

---

## Cost Management

| Operation | Est. cost | Mitigation |
|-----------|-----------|------------|
| OCR per receipt | ~$0.01–0.03 | Pro tier unlimited; rate limit free tier |
| Duplicate hash | negligible | Local SHA before upload |

**Rate limits:**
- Free: 10 OCR/month (hard)
- Pro: 500/month soft cap, then throttle (abuse prevention)

---

## Future AI Features (Post-V1)

Documented for prompt architecture extensibility:

| Feature | Example prompt context |
|---------|------------------------|
| Trip splitting | GPS stops + calendar |
| Spending insights | Aggregate expenses by category/month |
| Missing trip detection | Fuel receipt without active trip |
| Client profitability | Miles + expenses by client |
| Voice notes | Transcribe → extract entities |

**Recommendation engine:** Batch job nightly — not realtime V1.

---

## Monitoring & Quality

| Metric | Target |
|--------|--------|
| OCR success rate | > 92% (any field usable) |
| Total field correction rate | < 15% user edits |
| Category acceptance rate | > 80% keep suggestion |
| P95 latency | < 5s |

Log anonymized correction diffs (old AI value → user value) for prompt improvement — with user consent in privacy policy.

---

## Provider Abstraction

Edge Function interface:

```typescript
interface ReceiptOcrProvider {
  extract(imageUrl: string, context?: OcrContext): Promise<OcrResult>;
}
```

V1 implementation: OpenAI GPT-4o vision (or equivalent).  
Swap provider without client changes — only Edge Function + model_version.

---

*Previous: [Volume 4 — Database Architecture](04-database-architecture.md) | Next: [Volume 6 — Technical Architecture](06-technical-architecture.md)*
