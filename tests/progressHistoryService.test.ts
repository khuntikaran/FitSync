import { afterEach, describe, expect, it, vi } from 'vitest';
import { HistoryService } from '../src/services/progress/HistoryService';
import { ProgressService } from '../src/services/progress/ProgressService';
import { BodyMeasurement, WorkoutSession } from '../src/types';

function workout(overrides: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    id: 'w-1',
    date: '2026-01-10',
    startTime: '2026-01-10T10:00:00.000Z',
    name: 'Workout',
    workoutType: 'push',
    exercises: [],
    totalCaloriesBurned: 0,
    totalVolumeKg: 100,
    totalDurationSeconds: 1200,
    ...overrides,
  };
}

describe('HistoryService', () => {
  it('groups workouts by date and returns latest by startTime', () => {
    const workouts = [
      workout({ id: 'a', date: '2026-01-10', startTime: '2026-01-10T08:00:00.000Z' }),
      workout({ id: 'b', date: '2026-01-10', startTime: '2026-01-10T09:00:00.000Z' }),
      workout({ id: 'c', date: '2026-01-09', startTime: '2026-01-09T20:00:00.000Z' }),
    ];

    const grouped = HistoryService.groupWorkoutsByDate(workouts);
    expect(grouped['2026-01-10']).toHaveLength(2);
    expect(grouped['2026-01-09']).toHaveLength(1);

    const latest = HistoryService.getLatestWorkout(workouts);
    expect(latest?.id).toBe('b');
  });

  it('calculates streak across consecutive days and stops on gap', () => {
    const workouts = [
      workout({ date: '2026-01-10' }),
      workout({ date: '2026-01-09' }),
      workout({ date: '2026-01-08' }),
      workout({ date: '2026-01-06' }),
    ];

    expect(HistoryService.calculateWorkoutStreak(workouts)).toBe(3);
  });
});

describe('ProgressService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('summarizes volume by period and rounds average', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-10T12:00:00.000Z'));

    const workouts = [
      workout({ id: 'in-week', date: '2026-01-09', totalVolumeKg: 123 }),
      workout({ id: 'in-week-2', date: '2026-01-04', totalVolumeKg: 100 }),
      workout({ id: 'out-week', date: '2025-12-20', totalVolumeKg: 1000 }),
    ];

    const weekly = ProgressService.summarizeVolumeByPeriod(workouts, 'week');
    expect(weekly.totalVolumeKg).toBe(223);
    expect(weekly.workouts).toBe(2);
    expect(weekly.avgVolumePerWorkout).toBe(111.5);
  });

  it('builds sorted weight trend and excludes undefined weights', () => {
    const measurements: BodyMeasurement[] = [
      { id: '1', userId: 'u1', date: '2026-01-02', weightKg: 79.5 },
      { id: '2', userId: 'u1', date: '2026-01-01' },
      { id: '3', userId: 'u1', date: '2026-01-03', weightKg: 79.2 },
    ];

    expect(ProgressService.buildWeightTrend(measurements)).toEqual([
      { date: '2026-01-02', weightKg: 79.5 },
      { date: '2026-01-03', weightKg: 79.2 },
    ]);
  });
});
