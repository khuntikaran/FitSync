import { AppSettingsRepository } from '../../database/repositories/AppSettingsRepository';
import { AppConfig } from '../../constants/config';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  unitSystem: 'metric' | 'imperial';
  restTimerSoundEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  unitSystem: AppConfig.unitSystem.default,
  restTimerSoundEnabled: true,
};

function isTheme(value: unknown): value is UserPreferences['theme'] {
  return value === 'light' || value === 'dark' || value === 'system';
}

function isUnitSystem(value: unknown): value is UserPreferences['unitSystem'] {
  return value === 'metric' || value === 'imperial';
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function sanitizePreferences(
  input: Partial<UserPreferences> | undefined,
  fallback: UserPreferences
): UserPreferences {
  return {
    theme: isTheme(input?.theme) ? input.theme : fallback.theme,
    unitSystem: isUnitSystem(input?.unitSystem) ? input.unitSystem : fallback.unitSystem,
    restTimerSoundEnabled: isBoolean(input?.restTimerSoundEnabled)
      ? input.restTimerSoundEnabled
      : fallback.restTimerSoundEnabled,
  };
}

export class SettingsService {
  static async getPreferences(): Promise<UserPreferences> {
    const raw = await AppSettingsRepository.get('user_preferences');
    if (!raw) return DEFAULT_PREFERENCES;

    try {
      const parsed = JSON.parse(raw) as Partial<UserPreferences>;
      return sanitizePreferences(parsed, DEFAULT_PREFERENCES);
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  static async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await SettingsService.getPreferences();
    const merged = sanitizePreferences(updates, current);

    await AppSettingsRepository.set('user_preferences', JSON.stringify(merged));
    return merged;
  }
}
