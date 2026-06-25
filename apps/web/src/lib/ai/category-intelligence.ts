import {
  EXPENSE_CATEGORY_SLUGS,
  type CategorySuggestionAlternative,
  type CategorySuggestionResult,
  type ExpenseCategorySlug,
} from '@mileage-copilot/shared';
import { formatCategoryLabel } from '@/lib/receipts/categories';

export type CategoryScoreSource =
  | 'merchant_kb'
  | 'keyword'
  | 'user_history'
  | 'ocr_hint'
  | 'llm';

export type CategoryScore = {
  slug: ExpenseCategorySlug;
  score: number;
  source: CategoryScoreSource;
  explanation: string;
};

export const CATEGORY_CONFIDENCE_THRESHOLD = 0.85;

const MERCHANT_PATTERNS: Array<{ pattern: RegExp; slug: ExpenseCategorySlug; explanation: string }> = [
  { pattern: /\b(shell|chevron|exxon|mobil|bp|marathon|sunoco|76|arco|pilot|love'?s|ta travel)\b/i, slug: 'fuel', explanation: 'recognized as a gas station' },
  { pattern: /\b(marriott|hilton|hyatt|holiday inn|best western|motel|airbnb|lodging|inn\b)/i, slug: 'lodging', explanation: 'recognized as lodging' },
  { pattern: /\b(park(ing)?|garage|toll|ez\s?pass|fastrak)\b/i, slug: 'parking', explanation: 'looks like parking or tolls' },
  { pattern: /\b(restaurant|cafe|coffee|starbucks|mcdonald|subway|chipotle|dining|grill|pizza|burger)\b/i, slug: 'meals', explanation: 'recognized as dining' },
  { pattern: /\b(staples|office depot|officemax|supply)\b/i, slug: 'supplies', explanation: 'recognized as office supplies' },
  { pattern: /\b(uber|lyft|airline|delta|united|southwest|american airlines|amtrak|rental car|hertz|avis)\b/i, slug: 'travel', explanation: 'recognized as travel' },
];

const KEYWORD_PATTERNS: Array<{ pattern: RegExp; slug: ExpenseCategorySlug; explanation: string }> = [
  { pattern: /\b(fuel|gasoline|diesel|unleaded)\b/i, slug: 'fuel', explanation: 'receipt mentions fuel' },
  { pattern: /\b(parking|toll|meter)\b/i, slug: 'parking', explanation: 'receipt mentions parking or tolls' },
  { pattern: /\b(hotel|lodging|room charge)\b/i, slug: 'lodging', explanation: 'receipt mentions lodging' },
  { pattern: /\b(meal|lunch|dinner|breakfast|food)\b/i, slug: 'meals', explanation: 'receipt mentions meals' },
  { pattern: /\b(supplies|stationery|paper)\b/i, slug: 'supplies', explanation: 'receipt mentions supplies' },
  { pattern: /\b(flight|airfare|baggage|train|taxi)\b/i, slug: 'travel', explanation: 'receipt mentions travel' },
];

export function normalizeMerchant(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/\s+/g, ' ');
  return normalized.length > 0 ? normalized : null;
}

function scoreFromMerchantKb(merchant: string): CategoryScore | null {
  for (const entry of MERCHANT_PATTERNS) {
    if (entry.pattern.test(merchant)) {
      return {
        slug: entry.slug,
        score: 0.95,
        source: 'merchant_kb',
        explanation: `${merchant} is ${entry.explanation}`,
      };
    }
  }
  return null;
}

function scoreFromKeywords(text: string): CategoryScore | null {
  for (const entry of KEYWORD_PATTERNS) {
    if (entry.pattern.test(text)) {
      return {
        slug: entry.slug,
        score: 0.88,
        source: 'keyword',
        explanation: `This receipt ${entry.explanation}`,
      };
    }
  }
  return null;
}

export function scoreFromUserHistory(
  merchant: string,
  history: Array<{ merchant: string | null; categorySlug: string }>
): CategoryScore | null {
  const normalized = normalizeMerchant(merchant);
  if (!normalized) return null;

  const counts = new Map<ExpenseCategorySlug, number>();
  for (const row of history) {
    if (normalizeMerchant(row.merchant) !== normalized) continue;
    const slug = row.categorySlug as ExpenseCategorySlug;
    if (!(EXPENSE_CATEGORY_SLUGS as readonly string[]).includes(slug)) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  if (counts.size === 0) return null;

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [topSlug, topCount] = sorted[0];
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  const ratio = topCount / total;

  return {
    slug: topSlug,
    score: Math.min(0.92, 0.7 + ratio * 0.22),
    source: 'user_history',
    explanation: `You usually categorize ${merchant} as ${formatCategoryLabel(topSlug)}`,
  };
}

function scoreFromOcrHint(
  slug: ExpenseCategorySlug,
  confidence: number | undefined
): CategoryScore {
  const score = confidence != null ? Math.min(0.9, Math.max(0.5, confidence)) : 0.72;
  return {
    slug,
    score,
    source: 'ocr_hint',
    explanation: `OCR suggested ${formatCategoryLabel(slug)}`,
  };
}

export type CategorySuggestInput = {
  merchant?: string | null;
  rawText?: string | null;
  ocrCategorySlug?: ExpenseCategorySlug | null;
  ocrCategoryConfidence?: number | null;
  userHistory?: Array<{ merchant: string | null; categorySlug: string }>;
  llmSuggestion?: { slug: ExpenseCategorySlug; confidence: number; explanation: string } | null;
};

export function buildCategorySuggestion(input: CategorySuggestInput): CategorySuggestionResult {
  const merchant = input.merchant?.trim() ?? '';
  const rawText = [merchant, input.rawText?.trim() ?? ''].filter(Boolean).join(' ');
  const scores: CategoryScore[] = [];

  if (merchant) {
    const kb = scoreFromMerchantKb(merchant);
    if (kb) scores.push(kb);

    const history = scoreFromUserHistory(merchant, input.userHistory ?? []);
    if (history) scores.push(history);
  }

  if (rawText) {
    const keyword = scoreFromKeywords(rawText);
    if (keyword) scores.push(keyword);
  }

  if (input.ocrCategorySlug) {
    scores.push(scoreFromOcrHint(input.ocrCategorySlug, input.ocrCategoryConfidence ?? undefined));
  }

  if (input.llmSuggestion) {
    scores.push({
      slug: input.llmSuggestion.slug,
      score: input.llmSuggestion.confidence,
      source: 'llm',
      explanation: input.llmSuggestion.explanation,
    });
  }

  const merged = mergeCategoryScores(scores);
  return toCategorySuggestionResult(merged);
}

function mergeCategoryScores(scores: CategoryScore[]): CategoryScore[] {
  const bySlug = new Map<ExpenseCategorySlug, CategoryScore>();

  for (const score of scores) {
    const existing = bySlug.get(score.slug);
    if (!existing || score.score > existing.score) {
      bySlug.set(score.slug, score);
    }
  }

  return [...bySlug.values()].sort((a, b) => b.score - a.score);
}

function toCategorySuggestionResult(scores: CategoryScore[]): CategorySuggestionResult {
  if (scores.length === 0) {
    return {
      primary: {
        slug: 'other',
        confidence: 0.35,
        explanation: 'No strong category signal — review and pick the best fit',
        source: 'default',
      },
      alternatives: EXPENSE_CATEGORY_SLUGS.filter((slug) => slug !== 'other')
        .slice(0, 3)
        .map((slug) => ({ slug, confidence: 0.1 })),
    };
  }

  const [top, ...rest] = scores;
  const alternatives: CategorySuggestionAlternative[] = rest
    .slice(0, 3)
    .map((score) => ({ slug: score.slug, confidence: score.score }));

  return {
    primary: {
      slug: top.slug,
      confidence: top.score,
      explanation: top.explanation,
      source: top.source,
    },
    alternatives,
  };
}

export function shouldShowCategoryAlternatives(result: CategorySuggestionResult): boolean {
  return result.primary.confidence < CATEGORY_CONFIDENCE_THRESHOLD;
}

export function formatCategorySuggestionMessage(result: CategorySuggestionResult): string {
  const label = formatCategoryLabel(result.primary.slug);
  return `Suggested category: ${label} — ${result.primary.explanation}`;
}
