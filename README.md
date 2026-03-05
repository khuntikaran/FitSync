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
- PR/measurement form handlers and progress chart pipeline in `src/screens/progress/formsAndCharts.ts`
- Comprehensive Vitest unit/integration test suite with coverage and CI script (`test`, `test:coverage`, `test:ci`)

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

1. Build React Native visual screen components and connect them to screen controllers.
3. Add richer progress chart data sources and deeper analytics visualizations.
4. Add iOS/Android app shell assets and release prep (icons, splash, permissions polishing).
