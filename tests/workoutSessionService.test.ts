import { describe, expect, it } from 'vitest';
import { WorkoutSessionService } from '../src/services/workout/WorkoutSessionService';
import { WorkoutSession } from '../src/types';

function buildSession(overrides: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    id: 'workout-1',
    date: '2026-01-10',
    startTime: '2026-01-10T10:00:00.000Z',
    name: '  Push Day  ',
    workoutType: 'push',
    exercises: [],
    totalCaloriesBurned: 0,
    totalVolumeKg: 0,
    totalDurationSeconds: 0,
    ...overrides,
  };
}

describe('WorkoutSessionService.finalize', () => {
  it('trims workout name and sets end-time fields', () => {
    const finalized = WorkoutSessionService.finalize(buildSession());

    expect(finalized.name).toBe('Push Day');
    expect(finalized.endTime).toBeTypeOf('string');
    expect(finalized.totalDurationSeconds).toBeGreaterThanOrEqual(0);
  });

  it('throws when startTime is invalid', () => {
    expect(() =>
      WorkoutSessionService.finalize(buildSession({ startTime: 'invalid-date' }))
    ).toThrow('Workout start time must be a valid ISO datetime.');
  });


  it('throws when startTime is missing', () => {
    expect(() => WorkoutSessionService.finalize(buildSession({ startTime: '' }))).toThrow(
      'Workout start time is required.'
    );
  });

  it('throws when name is blank', () => {
    expect(() => WorkoutSessionService.finalize(buildSession({ name: '   ' }))).toThrow(
      'Workout name is required.'
    );
  });
});
