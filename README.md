# FitSync

Offline-first fitness tracking architecture for React Native (iOS + Android), focused on accurate calorie math, structured training splits, and robust local persistence.

## Implemented foundation in this repository

- TypeScript project scaffolding (`package.json`, `tsconfig.json`)
- Domain model types in `src/types`
- Scientific calculation service in `src/services/calculations/CalorieCalculator.ts`
- Unit conversion helpers in `src/utils/unitConversion.ts`
- Theming constants in `src/constants/colors.ts`
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

1. Add React Native app bootstrap and navigation shell.
2. Wire SQLite connection + migration runner around `CREATE_TABLES`.
3. Implement repository layer and seed script for 150+ exercises.
4. Build onboarding screens and connect BMR/TDEE flow.
5. Build active workout tracking screen with rest timer integration.
