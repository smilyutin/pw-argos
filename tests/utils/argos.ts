// Safe wrapper: becomes a no-op if the package/token is missing.
import type { Page } from '@playwright/test';

let realFn: ((page: Page, name: string) => Promise<unknown>) | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('@argos-ci/playwright');
  if (mod && typeof mod.argosScreenshot === 'function') {
    realFn = mod.argosScreenshot as typeof realFn;
  }
} catch {
  // package not installed — fine locally
}

export async function argosScreenshot(page: Page, name: string) {
  if (!process.env.ARGOS_TOKEN) return;   // token not present
  if (!realFn) return;                    // reporter not installed
  await realFn(page, name);
}