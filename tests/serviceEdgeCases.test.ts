import { beforeEach, describe, expect, it } from 'vitest';
import { OnboardingService } from '../src/services/onboarding/OnboardingService';
import { WorkoutSessionService } from '../src/services/workout/WorkoutSessionService';
import { WorkoutRepository } from '../src/database/repositories/WorkoutRepository';
import { HistoryService } from '../src/services/progress/HistoryService';
import { ProgressService } from '../src/services/progress/ProgressService';
import { WorkoutSession } from '../src/types';

function workout(overrides: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    id: 'w1',
    date: '2026-01-10',
    startTime: '2026-01-10T10:00:00.000Z',
    name: 'Test',
    workoutType: 'push',
    exercises: [],
    totalCaloriesBurned: 0,
    totalVolumeKg: 100,
    totalDurationSeconds: 0,
    ...overrides,
  };
}

describe('OnboardingService edge validations', () => {
  it('throws when weight exceeds upper bound', () => {
    expect(() =>
      OnboardingService.buildProfile({
        age: 25,
        gender: 'male',
        heightCm: 180,
        weightKg: 501,
        activityLevel: 'moderate',
      })
    ).toThrow('Weight must be a positive number under 500 kg.');
  });
});

describe('WorkoutSessionService persistence path', () => {
  beforeEach(async () => {
    await WorkoutRepository.replaceAll([]);
  });

  it('saveFinalized persists finalized workout', async () => {
    const saved = await WorkoutSessionService.saveFinalized(workout({ id: 'persist-1' }));
    expect(saved.endTime).toBeTypeOf('string');

    const all = await WorkoutRepository.getAll();
    expect(all.some((w) => w.id === 'persist-1')).toBe(true);
  });
});

describe('HistoryService and ProgressService edge cases', () => {
  it('HistoryService returns null latest and zero streak for empty workouts', () => {
    expect(HistoryService.getLatestWorkout([])).toBeNull();
    expect(HistoryService.calculateWorkoutStreak([])).toBe(0);
  });

  it('ProgressService returns zero summary for empty workouts', () => {
    expect(ProgressService.summarizeWeeklyVolume([])).toEqual({
      totalVolumeKg: 0,
      workouts: 0,
      avgVolumePerWorkout: 0,
    });
  });

  it('ProgressService supports month/year/all periods', () => {
    const workouts = [
      workout({ id: 'recent', date: '2026-01-09', totalVolumeKg: 200 }),
      workout({ id: 'older', date: '2025-02-01', totalVolumeKg: 500 }),
    ];

    const all = ProgressService.summarizeVolumeByPeriod(workouts, 'all');
    expect(all.totalVolumeKg).toBe(700);

    const month = ProgressService.summarizeVolumeByPeriod(workouts, 'month');
    expect(month.totalVolumeKg).toBeGreaterThanOrEqual(0);

    const year = ProgressService.summarizeVolumeByPeriod(workouts, 'year');
    expect(year.totalVolumeKg).toBeGreaterThanOrEqual(month.totalVolumeKg);
  });
});
