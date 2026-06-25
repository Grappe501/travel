import fs from 'node:fs';
import path from 'node:path';
import { e2eEnvConfigured } from './helpers/env';

const authDir = path.join(__dirname, '.auth');
const stateFile = path.join(authDir, 'e2e-state.json');

export default async function globalSetup() {
  fs.mkdirSync(authDir, { recursive: true });

  const ready = e2eEnvConfigured();
  fs.writeFileSync(stateFile, JSON.stringify({ ready }, null, 2));

  if (!ready) {
    console.warn(
      '[e2e] Skipping server startup — set E2E_TEST=1 with DATABASE_URL and Supabase keys to run E2E locally.'
    );
  }
}
