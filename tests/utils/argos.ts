// tests/utils/argos.ts
import type { Page } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';

// Try to load the official helper, but don't crash locally if missing.
let upstream: ((page: Page, name: string) => Promise<unknown>) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  upstream = require('@argos-ci/playwright').argosScreenshot;
} catch {
  upstream = null;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Always saves a PNG into ./.argos-screenshots for the CLI upload step.
 * If @argos-ci/playwright is available and ARGOS_TOKEN is set, also call the
 * official argosScreenshot to capture extra metadata (harmless if it fails).
 */
export async function argosScreenshot(page: Page, name: string) {
  const outDir = path.resolve('.argos-screenshots');
  await fs.mkdir(outDir, { recursive: true });

  const file = path.join(outDir, `${slugify(name)}.png`);
  await page.screenshot({ path: file, fullPage: true });

  if (upstream && process.env.ARGOS_TOKEN) {
    try {
      await upstream(page, name);
    } catch (e) {
      // Don’t fail the test if the upstream helper has issues — we still have the PNG.
      console.warn('[argos] upstream argosScreenshot failed:', (e as Error).message);
    }
  }
}