import { beforeEach, describe, expect, it } from 'vitest';
import { AppSettingsRepository } from '../src/database/repositories/AppSettingsRepository';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';
import { CalorieCalculator } from '../src/services/calculations/CalorieCalculator';

describe('Branch coverage push', () => {
  beforeEach(async () => {
    await AppSettingsRepository.replaceAll({});
    await PersonalRecordRepository.replaceAll([]);
  });

  it('covers AppSettingsRepository.get existing and missing keys', async () => {
    await AppSettingsRepository.set('k1', 'v1');
    await expect(AppSettingsRepository.get('k1')).resolves.toBe('v1');
    await expect(AppSettingsRepository.get('missing')).resolves.toBeNull();
  });

  it('covers PersonalRecordRepository previousValue nullish branch', async () => {
    await PersonalRecordRepository.save({
      id: 'r-prev',
      userId: 'u1',
      exerciseId: 'deadlift',
      exerciseName: 'Deadlift',
      recordType: 'weight',
      value: 180,
      previousValue: 170,
      date: '2026-01-01',
      workoutId: 'w1',
      isActive: false,
    });

    const all = await PersonalRecordRepository.getAll();
    expect(all[0].previousValue).toBe(170);
  });

  it('covers additional intensity branches in calculateExerciseCalories', () => {
    const light = CalorieCalculator.calculateExerciseCalories(
      6,
      80,
      [
        { reps: 10, weightKg: 40, completed: true },
        { reps: 10, weightKg: 40, completed: false },
      ],
      'light',
      60
    );

    const moderate = CalorieCalculator.calculateExerciseCalories(
      6,
      80,
      [
        { reps: 10, weightKg: 50, completed: true },
        { reps: 10, weightKg: 50, completed: true },
      ],
      'moderate',
      60
    );

    expect(light).toBeGreaterThan(0);
    expect(moderate).toBeGreaterThan(light / 2);
  });
});
