# FitSync Publishing Checklist

## 1) Build and quality gates
- [ ] Regenerate Gradle wrapper jar if missing from checkout (`cd android && gradle wrapper`).
- [ ] `npm run typecheck`
- [ ] `npm run test:ci`
- [ ] `npm run release:check`
- [ ] `npm run android:bundle`
- [ ] `npm run ios:pods`
- [ ] `npm run typecheck`
- [ ] `npm run test:ci`
- [ ] `npm run release:check`
- [ ] Run smoke tests on one Android and one iOS device.

## 2) Android publishing
- [ ] Replace placeholder launcher icons with production assets.
- [ ] Regenerate Android launcher PNGs from final icon source (PNG files are not stored in git).
- [ ] Configure release signing keystore and CI secrets (`android/keystore.properties`).
- [ ] Verify `POST_NOTIFICATIONS` runtime flow (Android 13+).
- [ ] Upload release AAB from `android/app/build/outputs/bundle/release/` to Play internal testing.

## 3) iOS publishing
- [ ] Replace placeholder app icon / launch assets in Xcode asset catalog.
- [ ] Run `npm run ios:pods` and open `ios/FitSync.xcworkspace`.
- [ ] Configure bundle id, signing certificates and provisioning profiles.
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
