import { ocrExtractedFieldsSchema, type OcrExtractedFields } from '@mileage-copilot/shared';
import { getOpenAiConfig } from '@/lib/ai/config';

const RECEIPT_OCR_PROMPT = `You are a receipt OCR assistant. Extract structured data from the receipt image.

Return JSON only with these keys:
- merchant (string or null)
- receipt_date (YYYY-MM-DD or null)
- subtotal (number or null)
- tax (number or null)
- total (number or null)
- category_slug (one of: meals, fuel, parking, lodging, supplies, travel, other — or null)
- confidence (object with 0-1 scores for merchant, receipt_date, subtotal, tax, total, category_slug)

Use null when a field cannot be read. Do not invent values.`;

export async function extractReceiptFieldsFromImage(imageUrl: string): Promise<OcrExtractedFields> {
  const { apiKey, model, isConfigured } = getOpenAiConfig();

  if (!isConfigured || !apiKey) {
    throw new Error('OpenAI is not configured. Set OPENAI_API_KEY on the server.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: RECEIPT_OCR_PROMPT },
            { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI Vision request failed (${response.status}): ${body.slice(0, 200)}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned an empty response');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('OpenAI returned invalid JSON');
  }

  return ocrExtractedFieldsSchema.parse(parsed);
}
