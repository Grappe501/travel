import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { e2eAuthConfigured, e2eEnvConfigured } from './e2e/helpers/env';

const webRoot = __dirname;
const repoRoot = path.resolve(webRoot, '../..');

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(repoRoot, '.env.test'));
loadEnvFile(path.join(repoRoot, '.env.local'));
loadEnvFile(path.join(repoRoot, '.env'));

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const mobileViewport = { width: 390, height: 844 };
const authFile = path.join(webRoot, 'e2e/.auth/user.json');
const authConfigured = e2eAuthConfigured();
const envConfigured = e2eEnvConfigured();

const projects: NonNullable<Parameters<typeof defineConfig>[0]['projects']> = [];

if (authConfigured) {
  projects.push({
    name: 'setup',
    testMatch: /auth\.setup\.ts/,
  });
}

projects.push({
  name: 'signup-mobile',
  testMatch: /e2e-01-signup\.spec\.ts/,
  use: {
    ...devices['Pixel 5'],
    viewport: mobileViewport,
  },
});

const authenticatedUse = authConfigured ? { storageState: authFile } : {};

projects.push({
  name: 'mobile-authenticated',
  testMatch: /e2e-0[234]-.*\.spec\.ts/,
  use: {
    ...devices['Pixel 5'],
    viewport: mobileViewport,
    ...authenticatedUse,
  },
  ...(authConfigured ? { dependencies: ['setup'] } : {}),
});

projects.push({
  name: 'desktop-authenticated',
  testMatch: /e2e-0[567]-.*\.spec\.ts/,
  use: {
    ...authenticatedUse,
  },
  ...(authConfigured ? { dependencies: ['setup'] } : {}),
});

if (authConfigured) {
  projects.push({
    name: 'a11y-authenticated',
    testMatch: /a11y\/.*\.spec\.ts/,
    use: {
      ...authenticatedUse,
    },
    dependencies: ['setup'],
  });
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: envConfigured
    ? {
        command: process.env.CI ? 'pnpm start' : 'pnpm dev',
        url: `${baseURL}/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        cwd: webRoot,
        env: {
          ...process.env,
          E2E_TEST: '1',
        },
      }
    : undefined,
  projects,
});
