import { DatabaseService } from '../connection';

export type AppSettingValue = string;

export class AppSettingsRepository {
  private static settings: Record<string, AppSettingValue> = {};

  static async set(key: string, value: AppSettingValue): Promise<void> {
    AppSettingsRepository.settings[key] = value;

    await DatabaseService.execute(
      `INSERT OR REPLACE INTO app_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP);`,
      [key, value]
    );
  }

  static async get(key: string): Promise<AppSettingValue | null> {
    return AppSettingsRepository.settings[key] ?? null;
  }

  static async getAll(): Promise<Record<string, AppSettingValue>> {
    return { ...AppSettingsRepository.settings };
  }

  static async replaceAll(settings: Record<string, AppSettingValue>): Promise<void> {
    AppSettingsRepository.settings = { ...settings };
    await DatabaseService.execute('DELETE FROM app_settings;');

    for (const [key, value] of Object.entries(settings)) {
      await AppSettingsRepository.set(key, value);
    }
  }
}
