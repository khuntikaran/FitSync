import fs from 'node:fs';

const required = [
  '.env.example',
  'babel.config.js',
  'metro.config.js',
  'android/AndroidManifest.xml',
  'ios/Info.plist',
  'docs/release-prep.md',
  'docs/publishing-checklist.md',
  'src/assets/app/icon.svg',
  'src/assets/app/splash.svg',
];

const missing = required.filter((file) => !fs.existsSync(file));

if (missing.length > 0) {
  console.error('Missing publish-readiness artifacts:');
  missing.forEach((file) => console.error(` - ${file}`));
  process.exit(1);
}

console.log('Release readiness file checks passed.');
