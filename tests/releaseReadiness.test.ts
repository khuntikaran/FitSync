import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const requiredFiles = [
  '.env.example',
  'babel.config.js',
  'metro.config.js',
  'scripts/releaseReadinessCheck.mjs',
  'android/AndroidManifest.xml',
  'android/keystore.properties.example',
  'ios/Info.plist',
  'ios/ExportOptions.plist',
  'docs/release-prep.md',
  'docs/publishing-checklist.md',
  'src/assets/app/icon.svg',
  'src/assets/app/splash.svg',
];

describe('release readiness artifacts', () => {
  it('contains required publishing scaffold files', () => {
    for (const path of requiredFiles) {
      expect(fs.existsSync(path), `missing: ${path}`).toBe(true);
    }
  });
});
