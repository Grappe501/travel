import { describe, expect, it } from 'vitest';
import { resolveFeedbackOutcome } from '@/lib/ai/feedback-outcome';

describe('resolveFeedbackOutcome', () => {
  it('returns accepted when user accepts', () => {
    expect(resolveFeedbackOutcome(true)).toBe('accepted');
  });

  it('returns corrected when rejected with correction', () => {
    expect(resolveFeedbackOutcome(false, true)).toBe('corrected');
  });

  it('returns dismissed when rejected without correction', () => {
    expect(resolveFeedbackOutcome(false, false)).toBe('dismissed');
  });
});
