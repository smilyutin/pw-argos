// playwright.argos.config.ts
import base from './playwright.config';
import { defineConfig, type ReporterDescription } from '@playwright/test';

const reporter: ReporterDescription[] = [
  ['line'],
  ['@argos-ci/playwright/reporter', { token: process.env.ARGOS_TOKEN }],
];

export default defineConfig({
  ...base,
  reporter,
  use: {
    ...base.use,
    baseURL: process.env.QA_URL || 'http://127.0.0.1:4200',
  },
  webServer: {
    command: 'npx http-server dist -p 4200 -s -c-1',
    url: process.env.QA_URL || 'http://127.0.0.1:4200',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});