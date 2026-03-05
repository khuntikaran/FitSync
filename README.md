# FitSync

Offline-first fitness tracking architecture for React Native (iOS + Android), focused on accurate calorie math, structured training splits, and robust local persistence.

## Implemented foundation in this repository

- TypeScript project scaffolding (`package.json`, `tsconfig.json`)
- Domain model types in `src/types`
- Scientific calculation service in `src/services/calculations/CalorieCalculator.ts`
- Unit conversion helpers in `src/utils/unitConversion.ts`
- Theming constants in `src/constants/colors.ts`
- SQLite schema string in `src/database/schema.ts`
- Zustand stores for user/workout workflows in `src/store`

## Completed next steps

- App bootstrap entrypoint `bootstrapApp()` in `src/App.ts`
- Database adapter service + transaction wrapper in `src/database/connection.ts`
- Migration runner in `src/database/migrations/runMigrations.ts`
- Repositories for users, workouts, and exercises in `src/database/repositories`
- Database seed flow in `src/services/seed/seedDatabase.ts`
- Onboarding profile assembly + validation + persistence in `src/services/onboarding/OnboardingService.ts`
- Workout analytics helpers in `src/services/analytics/WorkoutAnalyticsService.ts`
- Expanded exercise list and full 12-split starter workout templates in `src/constants/exercises.ts`
- Workout finalization service in `src/services/workout/WorkoutSessionService.ts`
- Progress summarization service in `src/services/progress/ProgressService.ts`
- Backup export payload builder and validator in `src/services/backup/BackupService.ts`
- Notification service abstraction with pluggable adapter in `src/services/notifications/NotificationService.ts`
- React Native SQLite adapter boundary scaffold in `src/database/adapters/reactNativeSQLiteAdapter.ts`
- Navigation route ordering config and main screen placeholders
- Seed exercise/template constants in `src/constants/exercises.ts`
- SQLite schema string in `src/database/schema.ts`
- Initial Zustand stores for user/workout workflows in `src/store`

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
5. Add body measurements/PR repositories and richer progress chart data sources.
1. Add React Native app bootstrap and navigation shell.
2. Wire SQLite connection + migration runner around `CREATE_TABLES`.
3. Implement repository layer and seed script for 150+ exercises.
4. Build onboarding screens and connect BMR/TDEE flow.
5. Build active workout tracking screen with rest timer integration.
