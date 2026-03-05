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
- Expanded exercise list and full 12-split starter workout templates in `src/constants/exercises.ts`
- Backup export/import payload helpers in `src/services/backup/BackupService.ts`
- Notification service abstraction with pluggable adapter in `src/services/notifications/NotificationService.ts`
- React Native SQLite adapter boundary scaffold in `src/database/adapters/reactNativeSQLiteAdapter.ts`
- Navigation route ordering config and main screen placeholders

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

1. Wire real React Native adapters (`react-native-sqlite-storage`, push notifications, file/share).
2. Build React Native screen components and connect to stores/services.
3. Expand exercise seed data to full 150+ library and add images.
4. Add unit tests once package registry access allows installing dependencies.
5. Build PR/measurement UI forms and chart rendering pipeline.
