import { LegalPage } from '@/components/legal/LegalPage';

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p className="text-caption text-muted">Last updated: June 25, 2026</p>

      <section className="space-y-3">
        <h2 className="text-section-title">Agreement</h2>
        <p>
          By creating an account or using Mileage &amp; Expense Copilot, you agree to these terms.
          If you do not agree, do not use the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Service description</h2>
        <p>
          The app helps you organize business mileage, expenses, and receipts. It is an organizational
          tool — not tax preparation, bookkeeping, legal, or accounting advice. Consult a qualified
          professional for guidance specific to your situation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Your responsibilities</h2>
        <ul className="list-inside list-disc space-y-1 text-muted">
          <li>Provide accurate information and keep your credentials secure</li>
          <li>Review AI-extracted receipt fields before relying on them</li>
          <li>Comply with applicable laws for your business records</li>
          <li>Use the service only for lawful purposes</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Subscriptions</h2>
        <p>
          Paid plans renew according to the billing cycle shown at checkout. Free-tier limits apply
          as described on the billing page. Stripe processes payments; subscription management is
          available through the Customer Portal.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Limitation of liability</h2>
        <p>
          The service is provided &ldquo;as is.&rdquo; We are not liable for indirect or consequential
          damages, or for tax or financial outcomes based on records you maintain in the app.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Changes</h2>
        <p>
          We may update these terms. Continued use after changes constitutes acceptance. Material
          changes will be noted in the app or by email when appropriate.
        </p>
      </section>
    </LegalPage>
  );
}
