import { LegalPage } from '@/components/legal/LegalPage';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-caption text-muted">Last updated: June 25, 2026</p>

      <section className="space-y-3">
        <h2 className="text-section-title">Overview</h2>
        <p>
          Mileage &amp; Expense Copilot (&ldquo;we,&rdquo; &ldquo;us&rdquo;) collects information you
          provide when using the app: account details, trip and expense records, receipt images, and
          usage data needed to operate the service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">What we collect</h2>
        <ul className="list-inside list-disc space-y-1 text-muted">
          <li>Account email and profile preferences</li>
          <li>Business, vehicle, client, and project records you create</li>
          <li>Trip mileage, expenses, and receipt uploads</li>
          <li>Payment status via Stripe (we do not store full card numbers)</li>
          <li>Device and error logs when monitoring is enabled</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">How we use data</h2>
        <p>
          We use your data to provide mileage tracking, receipt OCR, reports, billing, and
          in-app notifications. Receipt images may be processed by AI providers to extract merchant
          and amount fields — you review and approve extracted data before it affects your records.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Sharing</h2>
        <p>
          We share data with service providers that help us run the product (hosting, database,
          payments, email, AI). We do not sell your personal information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Your choices</h2>
        <p>
          You can export your account data from Settings → Data &amp; privacy. You may cancel your
          subscription at any time through the Stripe Customer Portal. Contact support to request
          account deletion.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Contact</h2>
        <p>
          Questions about this policy: use the contact option in the app or email your support
          address configured for your deployment.
        </p>
      </section>
    </LegalPage>
  );
}
