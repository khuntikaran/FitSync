# FitSync Release Prep

## App shell assets
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
