import { getEmailConfig } from '@/lib/email/config';

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean; id?: string }> {
  const config = getEmailConfig();
  if (!config.isConfigured) {
    return { sent: false };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email send failed (${response.status}): ${body.slice(0, 200)}`);
  }

  const payload = (await response.json()) as { id?: string };
  return { sent: true, id: payload.id };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function emailLayout(title: string, bodyHtml: string) {
  const config = getEmailConfig();
  return `<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
  <h1 style="font-size: 1.25rem;">${escapeHtml(title)}</h1>
  ${bodyHtml}
  <p style="margin-top: 2rem; font-size: 0.875rem; color: #666;">
    <a href="${config.appUrl}">${escapeHtml(config.appName)}</a>
  </p>
</body>
</html>`;
}
