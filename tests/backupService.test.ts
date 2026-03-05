import { beforeEach, describe, expect, it } from 'vitest';
import { AppConfig } from '../src/constants/config';
import { BackupService } from '../src/services/backup/BackupService';
import { AppSettingsRepository } from '../src/database/repositories/AppSettingsRepository';
import { WorkoutRepository } from '../src/database/repositories/WorkoutRepository';
import { BodyMeasurementRepository } from '../src/database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';
import { UserRepository } from '../src/database/repositories/UserRepository';

function buildValidPayload() {
  return {
    version: AppConfig.backupVersion,
    exportDate: new Date().toISOString(),
    user: null,
    workouts: [],
    measurements: [],
    records: [],
    appSettings: {},
  };
}

describe('BackupService.validateImportPayload', () => {
  it('accepts current payload with appSettings', () => {
    expect(BackupService.validateImportPayload(buildValidPayload())).toBe(true);
  });

  it('accepts legacy payload without appSettings', () => {
    const payload = buildValidPayload();
    const { appSettings: _removed, ...legacyPayload } = payload;
    expect(BackupService.validateImportPayload(legacyPayload)).toBe(true);
  });

  it('rejects invalid exportDate', () => {
    const payload = buildValidPayload();
    payload.exportDate = 'not-a-date';
    expect(BackupService.validateImportPayload(payload)).toBe(false);
  });

  it('rejects arrays containing non-object entries', () => {
    const payload = buildValidPayload();
    payload.workouts = [123 as never];
    expect(BackupService.validateImportPayload(payload)).toBe(false);
  });

  it('rejects malformed appSettings values', () => {
    const payload = buildValidPayload();
    payload.appSettings = { theme: 42 as never };
    expect(BackupService.validateImportPayload(payload)).toBe(false);
  });
});

describe('BackupService.importData', () => {
  beforeEach(async () => {
    await UserRepository.clear();
    await WorkoutRepository.replaceAll([]);
    await BodyMeasurementRepository.replaceAll([]);
    await PersonalRecordRepository.replaceAll([]);
    await AppSettingsRepository.replaceAll({});
  });

  it('imports legacy payloads and defaults appSettings to empty object', async () => {
    const payload = buildValidPayload();
    const { appSettings: _removed, ...legacyPayload } = payload;

    await expect(BackupService.importData(legacyPayload)).resolves.toBe(true);
    await expect(AppSettingsRepository.getAll()).resolves.toEqual({});
  });

  it('throws on malformed payload during import', async () => {
    const malformed = {
      ...buildValidPayload(),
      exportDate: 'bad-date',
    };

    await expect(BackupService.importData(malformed)).rejects.toThrow('Invalid backup payload');
  });

  it('imports full payload and exportData returns persisted snapshot', async () => {
    const payload = {
      ...buildValidPayload(),
      user: {
        id: 'user-1',
        age: 29,
        gender: 'male' as const,
        heightCm: 180,
        weightKg: 82,
        activityLevel: 'moderate' as const,
        bmr: 1800,
        tdee: 2790,
        unitSystem: 'metric' as const,
      },
      workouts: [
        {
          id: 'w1',
          date: '2026-01-10',
          startTime: '2026-01-10T08:00:00.000Z',
          endTime: '2026-01-10T09:00:00.000Z',
          name: 'Morning Workout',
          workoutType: 'push' as const,
          exercises: [],
          totalCaloriesBurned: 350,
          totalVolumeKg: 1200,
          totalDurationSeconds: 3600,
        },
      ],
      measurements: [{ id: 'm1', userId: 'user-1', date: '2026-01-10', weightKg: 82 }],
      records: [
        {
          id: 'r1',
          userId: 'user-1',
          exerciseId: 'bench',
          exerciseName: 'Bench Press',
          recordType: 'weight' as const,
          value: 100,
          date: '2026-01-10',
          workoutId: 'w1',
          isActive: true,
        },
      ],
      appSettings: {
        user_preferences:
          '{"theme":"dark","unitSystem":"metric","restTimerSoundEnabled":true}',
      },
    };

    await expect(BackupService.importData(payload)).resolves.toBe(true);

    const exported = await BackupService.exportData();

    expect(exported.user?.id).toBe('user-1');
    expect(exported.workouts).toHaveLength(1);
    expect(exported.measurements).toHaveLength(1);
    expect(exported.records).toHaveLength(1);
    expect(exported.appSettings).toEqual(payload.appSettings);
  });
});
