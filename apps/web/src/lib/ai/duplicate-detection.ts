export type DuplicateReason = 'exact_hash' | 'merchant_total_date' | 'amount_same_day';

export type DuplicateCandidateInput = {
  id: string;
  fileHash?: string | null;
  merchant?: string | null;
  total?: number | null;
  receiptDate?: Date | string | null;
  createdAt: Date | string;
};

export type DuplicateMatch = {
  receiptId: string;
  merchant: string | null;
  receiptDate: string | null;
  total: number | null;
  score: number;
  reason: DuplicateReason;
  createdAt: string;
};

export const DUPLICATE_SCORE_THRESHOLD = 0.85;

function normalizeMerchant(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function parseDateOnly(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const parsed = new Date(`${value.slice(0, 10)}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(a.getTime() - b.getTime());
  return ms / (1000 * 60 * 60 * 24);
}

function amountsClose(a: number, b: number, tolerance = 0.01): boolean {
  return Math.abs(a - b) <= tolerance;
}

export function scoreDuplicateReceipt(
  source: Omit<DuplicateCandidateInput, 'id' | 'createdAt'>,
  candidate: DuplicateCandidateInput
): DuplicateMatch | null {
  if (source.fileHash && candidate.fileHash && source.fileHash === candidate.fileHash) {
    return buildMatch(candidate, 1, 'exact_hash');
  }

  const sourceMerchant = normalizeMerchant(source.merchant);
  const candidateMerchant = normalizeMerchant(candidate.merchant);
  const sourceTotal = source.total ?? null;
  const candidateTotal = candidate.total ?? null;
  const sourceDate = parseDateOnly(source.receiptDate);
  const candidateDate = parseDateOnly(candidate.receiptDate);

  if (
    sourceMerchant &&
    candidateMerchant &&
    sourceMerchant === candidateMerchant &&
    sourceTotal !== null &&
    candidateTotal !== null &&
    amountsClose(sourceTotal, candidateTotal) &&
    sourceDate &&
    candidateDate &&
    daysBetween(sourceDate, candidateDate) <= 1
  ) {
    return buildMatch(candidate, 0.9, 'merchant_total_date');
  }

  if (
    sourceTotal !== null &&
    candidateTotal !== null &&
    amountsClose(sourceTotal, candidateTotal) &&
    sourceDate &&
    candidateDate &&
    sourceDate.toISOString().slice(0, 10) === candidateDate.toISOString().slice(0, 10)
  ) {
    return buildMatch(candidate, 0.7, 'amount_same_day');
  }

  return null;
}

function buildMatch(
  candidate: DuplicateCandidateInput,
  score: number,
  reason: DuplicateReason
): DuplicateMatch {
  const date = parseDateOnly(candidate.receiptDate);
  return {
    receiptId: candidate.id,
    merchant: candidate.merchant ?? null,
    receiptDate: date ? date.toISOString().slice(0, 10) : null,
    total: candidate.total ?? null,
    score,
    reason,
    createdAt:
      candidate.createdAt instanceof Date
        ? candidate.createdAt.toISOString()
        : new Date(candidate.createdAt).toISOString(),
  };
}

export function pickDuplicateMatches(
  source: Omit<DuplicateCandidateInput, 'id' | 'createdAt'>,
  candidates: DuplicateCandidateInput[]
): DuplicateMatch[] {
  const matches = candidates
    .map((candidate) => scoreDuplicateReceipt(source, candidate))
    .filter((match): match is DuplicateMatch => match !== null)
    .filter((match) => match.score >= DUPLICATE_SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  return matches.filter((match) => {
    if (seen.has(match.receiptId)) return false;
    seen.add(match.receiptId);
    return true;
  });
}

export function formatDuplicateMessage(match: DuplicateMatch): string {
  const dateLabel = match.receiptDate
    ? new Date(`${match.receiptDate}T12:00:00.000Z`).toLocaleDateString()
    : 'unknown date';
  const merchant = match.merchant ?? 'Unknown merchant';
  const total =
    match.total !== null && match.total !== undefined ? `$${match.total.toFixed(2)}` : 'unknown total';
  return `This looks like a receipt from ${dateLabel} — ${merchant} ${total}.`;
}
