import { execSync } from 'node:child_process';
import { integrationEnabled, repoRootFromWebPackage, verifyDatabaseConnection } from './helpers';

export default async function globalSetup() {
  if (!integrationEnabled()) {
    process.env.INTEGRATION_DB_READY = 'false';
    return;
  }

  const connected = await verifyDatabaseConnection();
  if (!connected) {
    process.env.INTEGRATION_DB_READY = 'false';
    return;
  }

  const root = repoRootFromWebPackage();
  try {
    execSync('pnpm db:migrate:deploy', {
      cwd: root,
      stdio: 'pipe',
      env: process.env,
    });
    process.env.INTEGRATION_DB_READY = 'true';
  } catch (error) {
    console.warn('Integration test migrate skipped:', error);
    process.env.INTEGRATION_DB_READY = 'false';
  }
}
