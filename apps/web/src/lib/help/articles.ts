export type HelpSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
};

export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  category: 'Basics' | 'Trips' | 'Receipts' | 'Reports' | 'Account' | 'Field test';
  sections: HelpSection[];
};

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    summary: 'Create your account, complete onboarding, and log your first trip in minutes.',
    category: 'Basics',
    sections: [
      {
        paragraphs: [
          'Mileage & Expense Copilot helps you capture business trips, receipts, and expenses, then generate reimbursement-ready reports.',
        ],
      },
      {
        heading: 'First-time setup',
        list: [
          'Sign in or use the field test login if your coordinator provided an access code.',
          'Complete onboarding: add a business, vehicle, and mileage rate.',
          'Start a trip from the dashboard or Trips tab.',
          'Upload receipts during or after the trip.',
          'End the trip and generate a report when you are ready.',
        ],
      },
      {
        heading: 'Tips',
        paragraphs: [
          'Install the app to your home screen (Settings → Install app) for faster access in the field.',
          'You can record trips offline; they sync when you reconnect.',
        ],
      },
    ],
  },
  {
    slug: 'start-and-end-trips',
    title: 'Start and end trips',
    summary: 'How to start a trip, track mileage, attach receipts, and close the loop.',
    category: 'Trips',
    sections: [
      {
        paragraphs: [
          'A trip is the container for mileage and expenses for one business purpose — a client visit, showing, or job site run.',
        ],
      },
      {
        heading: 'Start a trip',
        list: [
          'Tap Start trip from the dashboard or Trips list.',
          'Choose business, vehicle, and purpose (required).',
          'Optionally enter a starting odometer reading.',
          'Enable GPS tracking if you want route history while the app is open.',
        ],
      },
      {
        heading: 'During the trip',
        paragraphs: [
          'Only one active trip is allowed at a time. Upload receipts from the trip detail screen or the Receipts tab.',
        ],
      },
      {
        heading: 'End a trip',
        list: [
          'Open the active trip and tap End trip.',
          'Enter ending odometer if you use odometer-based mileage.',
          'Review the end-trip checklist for missing receipts.',
          'Confirm to save — mileage is calculated from odometer or GPS per your settings.',
        ],
      },
    ],
  },
  {
    slug: 'gps-tracking',
    title: 'GPS trip tracking',
    summary: 'Opt-in GPS capture, route history, and how GPS mileage relates to odometer readings.',
    category: 'Trips',
    sections: [
      {
        paragraphs: [
          'GPS tracking is optional. When enabled, the app records location points while your trip is active and the app is in the foreground.',
        ],
      },
      {
        heading: 'Best results',
        list: [
          'Keep the app open while driving (installed PWA recommended).',
          'Grant location permission when prompted.',
          'Use high-accuracy mode in Settings → Data & privacy if roads are not captured well.',
        ],
      },
      {
        heading: 'Mileage precedence',
        paragraphs: [
          'When you provide odometer start and end readings, those values are authoritative for reimbursement mileage.',
          'If odometer is missing, GPS distance may be used as a fallback. Large differences may be flagged for your review.',
        ],
      },
      {
        heading: 'Limitations',
        paragraphs: [
          'Background GPS while the phone is locked is not reliable in the browser app. Install to home screen and keep the app visible for best coverage.',
        ],
      },
    ],
  },
  {
    slug: 'scan-receipts',
    title: 'Scan and review receipts',
    summary: 'Upload photos, run AI OCR, and approve amounts before they become expenses.',
    category: 'Receipts',
    sections: [
      {
        paragraphs: [
          'Receipts are reviewed before they affect your records. AI suggests merchant, date, and amount — you confirm every field.',
        ],
      },
      {
        heading: 'Upload',
        list: [
          'Use Upload receipt from the dashboard or attach from an active trip.',
          'Choose business and optionally link to a trip.',
          'Select a clear photo or PDF.',
        ],
      },
      {
        heading: 'Review',
        list: [
          'Open the receipt and run OCR if it has not run automatically.',
          'Correct any misread fields on the review screen.',
          'Approve to create an expense, or reject if the scan is unusable.',
        ],
      },
      {
        heading: 'Duplicates',
        paragraphs: [
          'The app may warn if a receipt looks similar to one you already uploaded. Review carefully before approving.',
        ],
      },
    ],
  },
  {
    slug: 'generate-reports',
    title: 'Generate reports',
    summary: 'Build PDF, CSV, or Excel mileage and expense reports for employers or accountants.',
    category: 'Reports',
    sections: [
      {
        paragraphs: [
          'Reports combine completed trips, mileage, and approved expenses for a date range and business.',
        ],
      },
      {
        heading: 'Create a report',
        list: [
          'Open Reports from the navigation menu.',
          'Select business and date range.',
          'Choose format: PDF for submission, CSV or Excel for spreadsheets.',
          'Generate and download from the report detail page.',
        ],
      },
      {
        heading: 'Quality check',
        paragraphs: [
          'End trips and approve receipts before generating so totals are complete. You can export account data anytime from Settings → Data & privacy.',
        ],
      },
    ],
  },
  {
    slug: 'billing-and-plans',
    title: 'Billing and plans',
    summary: 'Free tier limits, Pro subscription, and managing your plan.',
    category: 'Account',
    sections: [
      {
        paragraphs: [
          'Free accounts include monthly limits on trips and receipts. Pro unlocks unlimited personal use.',
        ],
      },
      {
        heading: 'Manage billing',
        list: [
          'Open Settings → Billing & plan or the Billing page.',
          'View current usage for the month.',
          'Upgrade via Stripe Checkout or manage subscription in the customer portal.',
        ],
      },
      {
        heading: 'Receipts and OCR',
        paragraphs: [
          'OCR runs count toward usage on free plans. Approved receipts stay in your account even if you downgrade.',
        ],
      },
    ],
  },
  {
    slug: 'privacy-and-data',
    title: 'Privacy and your data',
    summary: 'Export, location data, and how receipt images are processed.',
    category: 'Account',
    sections: [
      {
        paragraphs: [
          'You own your data. Export and account controls live under Settings → Data & privacy.',
        ],
      },
      {
        heading: 'Receipt OCR',
        paragraphs: [
          'Receipt images are stored privately and may be sent to an AI provider for text extraction. Extracted values are not finalized until you approve them.',
        ],
      },
      {
        heading: 'Location',
        paragraphs: [
          'GPS points are stored only for trips where you opt in to tracking. You can disable location defaults in settings.',
        ],
      },
      {
        heading: 'Legal',
        paragraphs: [
          'See Privacy Policy and Terms from the footer of any public page or Settings → Data & privacy.',
        ],
      },
    ],
  },
  {
    slug: 'field-test-faq',
    title: 'Field test FAQ',
    summary: 'Shared access code login, individual accounts, and what admins can see.',
    category: 'Field test',
    sections: [
      {
        paragraphs: [
          'During field testing, use the field test login page with your own email and the shared access code from your coordinator.',
        ],
      },
      {
        heading: 'Your account',
        list: [
          'Each tester uses a unique email — your trips and receipts stay separate.',
          'First visit creates your account automatically; return visits sign you in normally.',
          'Optional name helps admins identify you in the field test dashboard.',
        ],
      },
      {
        heading: 'What to try',
        list: [
          'Complete onboarding and start at least one trip.',
          'Try GPS tracking on a short drive with the app open.',
          'Upload and approve a receipt.',
          'Generate a report for your test date range.',
        ],
      },
      {
        heading: 'Feedback',
        paragraphs: [
          'Report bugs or UX issues to your coordinator. Include steps to reproduce and screenshots when possible.',
        ],
      },
    ],
  },
];

export const HELP_SLUGS = HELP_ARTICLES.map((article) => article.slug);

export function getHelpArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((article) => article.slug === slug);
}

export function searchHelpArticles(query: string): HelpArticle[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return HELP_ARTICLES;
  }

  return HELP_ARTICLES.filter((article) => {
    const haystack = [
      article.title,
      article.summary,
      article.category,
      ...article.sections.flatMap((section) => [
        section.heading ?? '',
        ...(section.paragraphs ?? []),
        ...(section.list ?? []),
      ]),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
