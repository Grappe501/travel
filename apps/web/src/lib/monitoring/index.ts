export {
  captureException,
  captureMessage,
  initSentryServer,
} from '@/lib/monitoring/sentry-server';

export { captureClientException, initSentryClient } from '@/lib/monitoring/sentry-client';

export {
  getBuildMetadata,
  getDependencyFlags,
  getSentryDsn,
  isSentryEnabled,
  type BuildMetadata,
  type DependencyFlags,
} from '@/lib/monitoring/config';
