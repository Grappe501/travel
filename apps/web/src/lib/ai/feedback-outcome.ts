import type { AIInteractionOutcome } from '@mileage-copilot/shared';

export function resolveFeedbackOutcome(
  accepted: boolean,
  hasCorrection?: boolean
): AIInteractionOutcome {
  if (accepted) return 'accepted';
  if (hasCorrection) return 'corrected';
  return 'dismissed';
}
