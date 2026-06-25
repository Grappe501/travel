import { LegalPage } from '@/components/legal/LegalPage';

export const metadata = {
  title: 'Refund Policy',
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy">
      <p className="text-caption text-muted">Last updated: June 25, 2026</p>

      <section className="space-y-3">
        <h2 className="text-section-title">Subscriptions</h2>
        <p>
          Pro and Small Business subscriptions are billed monthly through Stripe. You can cancel
          anytime from Settings → Billing → Manage subscription. Cancellation stops future charges;
          access continues through the end of the current billing period.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Refunds</h2>
        <p>
          We generally do not offer partial refunds for unused time in a billing period. If you
          believe you were charged in error, contact support within 14 days of the charge with your
          account email and invoice details. Approved refunds are processed through Stripe to your
          original payment method.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-section-title">Free tier</h2>
        <p>
          The free plan includes limited trips and receipts per month at no charge. No payment
          information is required for the free tier.
        </p>
      </section>
    </LegalPage>
  );
}
