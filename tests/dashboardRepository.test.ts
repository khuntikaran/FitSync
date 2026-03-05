import { beforeEach, describe, expect, it } from 'vitest';
import { WorkoutRepository } from '../src/database/repositories/WorkoutRepository';
import { DashboardService } from '../src/services/dashboard/DashboardService';
import { WorkoutSession } from '../src/types';

function session(overrides: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    id: 'w1',
    date: '2026-01-10',
    startTime: '2026-01-10T10:00:00.000Z',
    name: 'Test Workout',
    workoutType: 'push',
    exercises: [],
    totalCaloriesBurned: 0,
    totalVolumeKg: 100,
    totalDurationSeconds: 1800,
    ...overrides,
  };
}

describe('WorkoutRepository + DashboardService integration', () => {
  beforeEach(async () => {
    await WorkoutRepository.replaceAll([]);
  });

  it('does not duplicate sessions when saving same id repeatedly', async () => {
    await WorkoutRepository.save(session({ id: 'same-id', totalVolumeKg: 100 }));
    await WorkoutRepository.save(session({ id: 'same-id', totalVolumeKg: 200 }));

    const all = await WorkoutRepository.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].totalVolumeKg).toBe(200);
  });

  it('returns a copy from getAll to avoid external mutation of repository state', async () => {
    await WorkoutRepository.save(session({ id: 'immutable-check' }));

    const firstRead = await WorkoutRepository.getAll();
    firstRead.push(session({ id: 'injected-by-consumer' }));

    const secondRead = await WorkoutRepository.getAll();
    expect(secondRead.map((w) => w.id)).toEqual(['immutable-check']);
  });

 main
  it('builds dashboard summary from repository workouts', async () => {
    await WorkoutRepository.save(
      session({
        id: 'older',
        date: '2026-01-09',
        startTime: '2026-01-09T09:00:00.000Z',
        name: 'Older Workout',
        totalVolumeKg: 80,
      })
    );

    await WorkoutRepository.save(
      session({
        id: 'latest',
        date: '2026-01-10',
        startTime: '2026-01-10T11:00:00.000Z',
        name: 'Latest Workout',
        totalVolumeKg: 120,
      })
    );

    const summary = await DashboardService.getSummary();

    expect(summary.totalWorkouts).toBe(2);
    expect(summary.latestWorkoutName).toBe('Latest Workout');
    expect(summary.latestWorkoutDate).toBe('2026-01-10');
    expect(summary.weeklyVolumeKg).toBe(200);
  });
});
