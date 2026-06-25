'use client';

/** Full navigation so auth cookies from server actions are applied reliably on Netlify. */
export function navigateAfterAuth(path: string) {
  window.location.assign(path);
}
