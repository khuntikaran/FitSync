import { beforeEach, describe, expect, it } from 'vitest';
import { AppSettingsRepository } from '../src/database/repositories/AppSettingsRepository';
import { SettingsService } from '../src/services/settings/SettingsService';

describe('SettingsService', () => {
  beforeEach(async () => {
    await AppSettingsRepository.replaceAll({});
  });

  it('returns defaults when no preferences are saved', async () => {
    const prefs = await SettingsService.getPreferences();

    expect(prefs).toEqual({
      theme: 'system',
      unitSystem: 'metric',
      restTimerSoundEnabled: true,
    });
  });

  it('sanitizes malformed stored JSON fields', async () => {
    await AppSettingsRepository.set(
      'user_preferences',
      JSON.stringify({
        theme: 'neon',
        unitSystem: 'stones',
        restTimerSoundEnabled: 'yes',
      })
    );

    const prefs = await SettingsService.getPreferences();

    expect(prefs).toEqual({
      theme: 'system',
      unitSystem: 'metric',
      restTimerSoundEnabled: true,
    });
  });


  it('returns defaults when stored preferences JSON is invalid', async () => {
    await AppSettingsRepository.set('user_preferences', '{invalid-json');

    const prefs = await SettingsService.getPreferences();
    expect(prefs).toEqual({
      theme: 'system',
      unitSystem: 'metric',
      restTimerSoundEnabled: true,
    });
  });

  it('preserves current values when update includes invalid fields', async () => {
    await SettingsService.updatePreferences({
      theme: 'dark',
      unitSystem: 'imperial',
      restTimerSoundEnabled: false,
    });

    const updated = await SettingsService.updatePreferences({
      theme: 'bad-value' as never,
      unitSystem: 'metric',
      restTimerSoundEnabled: 'no' as never,
    });

    expect(updated).toEqual({
      theme: 'dark',
      unitSystem: 'metric',
      restTimerSoundEnabled: false,
    });
  });
});
