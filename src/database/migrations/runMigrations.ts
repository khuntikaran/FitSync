import { DatabaseService } from '../connection';

export async function runMigrations(): Promise<void> {
  await DatabaseService.initialize();

  await DatabaseService.execute(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await DatabaseService.execute(
    `INSERT OR REPLACE INTO app_settings (key, value) VALUES ('schema_version', ?);`,
    [String(DatabaseService.config.version)]
  );
}
