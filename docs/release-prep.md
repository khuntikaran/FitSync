# FitSync Release Prep

## App shell assets
- App icon placeholder source: `src/assets/app/icon.svg`
- Splash placeholder source: `src/assets/app/splash.svg`
- Generate native launcher/icon sets from these sources before release.

## Platform config templates
- Android app manifest + metadata: `android/app/src/main/AndroidManifest.xml`
- Android gradle/app identifiers: `android/app/build.gradle`
- iOS plist + launch metadata: `ios/FitSync/Info.plist`
- iOS signing/export template: `ios/ExportOptions.plist`

## Manual release checklist
- Replace placeholder icon/splash with final brand assets.
- Configure Android keystore/signing and verify release build variant.
- Configure iOS team, bundle identifier, certificates, and provisioning profile.
- Validate Android 13+ notification permission flow on device.
- Run device smoke test for onboarding, workout timer, progress charts, and backup export/import.


## Binary artifact regeneration
- Gradle wrapper jar is excluded from git for PR-tool compatibility; regenerate with `cd android && gradle wrapper` (or `./gradlew wrapper` after bootstrap).
- Android launcher PNG assets are excluded from git; regenerate from `src/assets/app/icon.svg` before release.
- `android/app/debug.keystore` is excluded from git; local debug builds can recreate it automatically via Android tooling.
- App icon placeholder: `src/assets/app/icon.svg`
- Splash placeholder: `src/assets/app/splash.svg`

## Platform config templates
- Android manifest permissions and app metadata: `android/AndroidManifest.xml`
- iOS plist base metadata + notification usage text: `ios/Info.plist`

## Manual release checklist
- Replace placeholder icon/splash with final brand assets.
- Generate Android adaptive icons from app icon source.
- Configure iOS launch storyboard and app icon set.
- Validate Android 13+ notification permission flow.
- Run device smoke test for backup export/import and rest notifications.
