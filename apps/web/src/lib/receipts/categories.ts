import { EXPENSE_CATEGORY_SLUGS } from '@mileage-copilot/shared';

const CATEGORY_LABELS: Record<(typeof EXPENSE_CATEGORY_SLUGS)[number], string> = {
  meals: 'Meals & dining',
  fuel: 'Fuel',
  parking: 'Parking & tolls',
  lodging: 'Lodging',
  supplies: 'Office supplies',
  travel: 'Travel',
  other: 'Other',
};

export function getExpenseCategoryOptions() {
  return EXPENSE_CATEGORY_SLUGS.map((slug) => ({
    value: slug,
    label: CATEGORY_LABELS[slug],
  }));
}

export function formatCategoryLabel(slug: string) {
  return CATEGORY_LABELS[slug as keyof typeof CATEGORY_LABELS] ?? slug;
}
