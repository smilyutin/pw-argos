// tests/argos.smoke.spec.ts
import { test } from '@playwright/test';

test.skip('argos smoke', async ({ page }) => {
  await page.goto(process.env.QA_URL || 'http://localhost:4200');
  // lazy import so it doesn’t crash locally if package missing
  let snap: ((p:any, n:string)=>Promise<any>) | null = null;
  try {
    ({ argosScreenshot: snap } = require('@argos-ci/playwright'));
  } catch {}
  if (snap && process.env.ARGOS_TOKEN) {
    await snap(page, 'Argos smoke @ root');
  }
});