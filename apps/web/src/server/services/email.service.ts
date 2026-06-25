import { getEmailConfig } from '@/lib/email/config';
import { emailLayout, sendEmail } from '@/lib/email/resend';
import { getNotificationPreferences } from '@/server/services/notification.service';
import { getUserProfile } from '@/server/services/auth.service';

async function recipientEmail(userId: string): Promise<string | null> {
  const profile = await getUserProfile(userId);
  return profile?.email ?? null;
}

export async function sendTripEndedSummaryEmail(
  userId: string,
  input: {
    tripId: string;
    purpose: string;
    miles: number | null;
    reimbursementAmount: number | null;
  }
) {
  const prefs = await getNotificationPreferences(userId);
  if (!prefs.emailTripSummary) return { sent: false as const, reason: 'disabled' as const };

  const email = await recipientEmail(userId);
  if (!email) return { sent: false as const, reason: 'no_email' as const };

  const config = getEmailConfig();
  const milesLabel =
    input.miles !== null ? `${input.miles.toLocaleString()} miles` : 'Trip completed';
  const reimbursementLabel =
    input.reimbursementAmount !== null
      ? `$${input.reimbursementAmount.toFixed(2)} mileage reimbursement`
      : null;

  const tripUrl = `${config.appUrl}/trips/${input.tripId}`;
  const body = `
    <p>Your trip <strong>${input.purpose}</strong> is complete.</p>
    <ul>
      <li>${milesLabel}</li>
      ${reimbursementLabel ? `<li>${reimbursementLabel}</li>` : ''}
    </ul>
    <p><a href="${tripUrl}">View trip details</a> to link any remaining receipts or expenses.</p>
  `;

  return sendEmail({
    to: email,
    subject: `Trip completed: ${input.purpose}`,
    html: emailLayout('Trip completed', body),
    text: `Trip completed: ${input.purpose}. ${milesLabel}. View: ${tripUrl}`,
  });
}

export async function sendReceiptProcessedEmail(
  userId: string,
  input: {
    receiptId: string;
    merchant: string | null;
    total: number | null;
  }
) {
  const prefs = await getNotificationPreferences(userId);
  if (!prefs.emailReceiptProcessed) return { sent: false as const, reason: 'disabled' as const };

  const email = await recipientEmail(userId);
  if (!email) return { sent: false as const, reason: 'no_email' as const };

  const config = getEmailConfig();
  const label = input.merchant ?? 'Receipt';
  const amount = input.total !== null ? `$${input.total.toFixed(2)}` : null;
  const reviewUrl = `${config.appUrl}/receipts/${input.receiptId}/review`;

  const body = `
    <p>We finished scanning your receipt${amount ? ` (${amount})` : ''}.</p>
    <p><strong>${label}</strong> is ready for your review.</p>
    <p><a href="${reviewUrl}">Review and confirm</a> before it is added to your records.</p>
  `;

  return sendEmail({
    to: email,
    subject: `Receipt ready for review${input.merchant ? `: ${input.merchant}` : ''}`,
    html: emailLayout('Receipt processed', body),
    text: `Receipt ready for review: ${label}. Review: ${reviewUrl}`,
  });
}
