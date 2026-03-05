# FitSync Publishing Checklist

## 1) Build and quality gates
- [ ] `npm run typecheck`
- [ ] `npm run test:ci`
- [ ] `npm run release:check`
- [ ] Run smoke tests on one Android and one iOS device.

## 2) Android publishing
- [ ] Replace placeholder launcher icons with production assets.
- [ ] Configure release signing keystore and CI secrets.
- [ ] Verify `POST_NOTIFICATIONS` runtime flow (Android 13+).
- [ ] Build release AAB and run internal test track rollout.

## 3) iOS publishing
- [ ] Replace placeholder app icon / launch assets.
- [ ] Configure bundle id, signing certificates and provisioning profiles.
- [ ] Verify notification permissions and copy.
- [ ] Archive in Xcode and validate with TestFlight.

## 4) Store listing
- [ ] Screenshots for all required device classes.
- [ ] Privacy policy URL and support URL.
- [ ] Metadata: title, subtitle, keywords, category.
- [ ] App review notes describing offline behavior and local backups.

## 5) Final release checks
- [ ] Backup export/import verified with real files.
- [ ] Rest-timer notification delivery verified background/foreground.
- [ ] Migration from existing local DB verified.
- [ ] Crash-free smoke run > 30 minutes on both platforms.
