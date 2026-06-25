'use client';

import { useEffect } from 'react';
import { initSentryClient } from '@/lib/monitoring/sentry-client';

export function SentryInit() {
  useEffect(() => {
    initSentryClient();
  }, []);

  return null;
}
