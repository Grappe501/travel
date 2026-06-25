import { EXPENSE_CATEGORY_SLUGS, type ExpenseCategorySlug } from '@mileage-copilot/shared';
import { getOpenAiConfig } from '@/lib/ai/config';

const CATEGORY_CLASSIFY_PROMPT = `You classify business expense receipts into one category slug.

Return JSON only:
{
  "slug": one of: meals, fuel, parking, lodging, supplies, travel, other,
  "confidence": number 0-1,
  "explanation": one short sentence for the user
}

Use merchant name and any receipt text provided. Prefer specific categories over "other".`;

export async function classifyCategoryWithLlm(input: {
  merchant: string;
  rawText?: string;
  amount?: number;
}): Promise<{ slug: ExpenseCategorySlug; confidence: number; explanation: string } | null> {
  const { apiKey, model, isConfigured } = getOpenAiConfig();
  if (!isConfigured || !apiKey) return null;

  const context = [
    `Merchant: ${input.merchant}`,
    input.amount != null ? `Amount: $${input.amount.toFixed(2)}` : null,
    input.rawText ? `Receipt text: ${input.rawText.slice(0, 800)}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      max_tokens: 200,
      messages: [
        { role: 'system', content: CATEGORY_CLASSIFY_PROMPT },
        { role: 'user', content: context },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) return null;

  let parsed: { slug?: string; confidence?: number; explanation?: string };
  try {
    parsed = JSON.parse(content) as { slug?: string; confidence?: number; explanation?: string };
  } catch {
    return null;
  }

  const slug = parsed.slug;
  if (!slug || !(EXPENSE_CATEGORY_SLUGS as readonly string[]).includes(slug)) {
    return null;
  }

  const confidence =
    typeof parsed.confidence === 'number'
      ? Math.min(1, Math.max(0, parsed.confidence))
      : 0.75;

  return {
    slug: slug as ExpenseCategorySlug,
    confidence,
    explanation: parsed.explanation?.trim() || `Classified as ${slug} from receipt details`,
  };
}
