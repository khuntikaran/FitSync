import { AppSettingsRepository } from '../../database/repositories/AppSettingsRepository';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  unitSystem: 'metric' | 'imperial';
  restTimerSoundEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  unitSystem: 'metric',
  restTimerSoundEnabled: true,
};

export class SettingsService {
  static async getPreferences(): Promise<UserPreferences> {
    const raw = await AppSettingsRepository.get('user_preferences');
    if (!raw) return DEFAULT_PREFERENCES;

    try {
      const parsed = JSON.parse(raw) as Partial<UserPreferences>;
      return {
        theme: parsed.theme ?? DEFAULT_PREFERENCES.theme,
        unitSystem: parsed.unitSystem ?? DEFAULT_PREFERENCES.unitSystem,
        restTimerSoundEnabled:
          parsed.restTimerSoundEnabled ?? DEFAULT_PREFERENCES.restTimerSoundEnabled,
      };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  static async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await SettingsService.getPreferences();
    const merged: UserPreferences = { ...current, ...updates };
    await AppSettingsRepository.set('user_preferences', JSON.stringify(merged));
    return merged;
  }
}
