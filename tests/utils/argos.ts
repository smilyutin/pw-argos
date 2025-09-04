// tests/utils/argos.ts
type ArgosFn = (page: any, name: string) => Promise<any>;

let argosScreenshotImpl: ArgosFn | null = null;

try {
  // Loaded only when package is installed (CI)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('@argos-ci/playwright');
  if (mod && typeof mod.argosScreenshot === 'function') {
    argosScreenshotImpl = mod.argosScreenshot as ArgosFn;
  }
} catch { /* ignore - not installed locally */ }

// Call this from tests; safe no-op if not available
export async function argosSnap(page: any, name: string) {
  if (!process.env.ARGOS_TOKEN) return;
  if (!argosScreenshotImpl) return;
  await argosScreenshotImpl(page, name);
}