export const AppConfig = {
  appName: 'FitSync',
  databaseName: 'FitTrackPro.db',
  backupVersion: '1.0',
  defaultRestTimeSeconds: 90,
  unitSystem: {
    default: 'metric' as const,
  },
} as const;
