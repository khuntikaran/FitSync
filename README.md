# FitSync

Offline-first fitness tracking architecture for React Native (iOS + Android), focused on accurate calorie math, structured training splits, and robust local persistence.

## Implemented foundation in this repository

- TypeScript project scaffolding (`package.json`, `tsconfig.json`)
- Domain model types in `src/types`
- Scientific calculation service in `src/services/calculations/CalorieCalculator.ts`
- Unit conversion helpers plus shared ID/date utilities in `src/utils`
- Theming constants and app config in `src/constants`
- SQLite schema string in `src/database/schema.ts`
- Zustand stores for user/workout workflows in `src/store`

## Completed next steps

- App bootstrap entrypoint `bootstrapApp()` in `src/App.ts`
- Database adapter service + transaction wrapper in `src/database/connection.ts`
- Migration runner in `src/database/migrations/runMigrations.ts`
- Repositories for users, workouts, exercises, personal records, and body measurements in `src/database/repositories`
- Database seed flow in `src/services/seed/seedDatabase.ts`
- Onboarding profile assembly + validation + persistence in `src/services/onboarding/OnboardingService.ts`
- Workout analytics/finalization/history/progress helpers in `src/services/analytics`, `src/services/workout`, and `src/services/progress`
- Measurement and PR domain services in `src/services/measurements/MeasurementService.ts` and `src/services/records/PersonalRecordService.ts`
- Dashboard summary aggregation in `src/services/dashboard/DashboardService.ts`
- Expanded exercise library to 150+ entries with 12-split starter templates in `src/constants/exercises.ts`
- Exercise image asset mapping and category placeholders in `src/assets/images/exercises/categories`
- Backup export/import payload helpers + app settings support in `src/services/backup/BackupService.ts`
- React Native adapter boundaries and runtime wiring for SQLite, notifications, and file/share
- Screen controllers for onboarding, home, workout, history, progress, and settings connected to stores/services
- Visual screen view-model builders connected to screen controllers in `src/screens/*/*View.ts`
- Local app API facade for screen/view/form orchestration in `src/api/localAppApi.ts`
- App shell navigation controller hook for route/tab rendering in `src/hooks/useAppShell.ts`
- PR/measurement form handlers and progress chart pipeline in `src/screens/progress/formsAndCharts.ts`
- Richer progress analytics data sources (muscle-group volume + workout frequency) for charts in `src/services/progress/ProgressService.ts`
- Comprehensive Vitest unit/integration test suite with coverage and CI script (`test`, `test:coverage`, `test:ci`)
- iOS/Android native project scaffolding (`ios/FitSync.xcodeproj`, `android/*`) with release prep checklist in `docs/release-prep.md`
- Publish readiness artifacts (`.env.example`, `babel.config.js`, `metro.config.js`, release check script, and store checklists)


## Run locally (developer quickstart)

1. Install dependencies: `npm install`
2. Run type checks: `npm run typecheck`
3. Run test suite: `npm test`
4. Run release scaffold checks: `npm run release:check`
5. Install CocoaPods deps: `npm run ios:pods` (macOS only)
6. For Android runtime: `npm run android` (requires Android SDK, adb, and emulator/device)
7. For iOS runtime: `npm run ios` (requires macOS + Xcode + simulator/device)
8. Build release AAB: `npm run android:bundle`

## Planned architecture (target)

```txt
/src
  /api
  /assets
  /components
  /constants
  /database
  /hooks
  /navigation
  /screens
  /services
  /store
  /types
  /utils
```

## Next steps

1. Replace placeholder assets/metadata with final brand and legal content, then run `npm run release:check`.
2. Execute device-level smoke tests and submit Android AAB + iOS TestFlight build.
