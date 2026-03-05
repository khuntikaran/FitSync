import { beforeEach, describe, expect, it } from 'vitest';
import { getWorkoutTemplateByType } from '../src/constants/exercises';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';

describe('Workout template constants', () => {
  it('returns template by workout type and undefined for missing type', () => {
    const push = getWorkoutTemplateByType('push');
    expect(push?.id).toBe('template_push');

    const custom = getWorkoutTemplateByType('custom' as never);
    expect(custom).toBeUndefined();
  });
});

describe('PersonalRecordRepository.getActiveByExercise', () => {
  beforeEach(async () => {
    await PersonalRecordRepository.replaceAll([]);
  });

  it('returns null when no active record exists', async () => {
    await PersonalRecordRepository.save({
      id: 'r1',
      userId: 'u1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      recordType: 'weight',
      value: 90,
      date: '2026-01-01',
      workoutId: 'w1',
      isActive: false,
    });

    await expect(PersonalRecordRepository.getActiveByExercise('bench')).resolves.toBeNull();
  });

  it('returns latest active record by date for exercise', async () => {
    await PersonalRecordRepository.save({
      id: 'r-old',
      userId: 'u1',
      exerciseId: 'squat',
      exerciseName: 'Squat',
      recordType: 'weight',
      value: 120,
      date: '2026-01-01',
      workoutId: 'w1',
      isActive: true,
    });

    await PersonalRecordRepository.save({
      id: 'r-latest',
      userId: 'u1',
      exerciseId: 'squat',
      exerciseName: 'Squat',
      recordType: 'weight',
      value: 130,
      date: '2026-01-05',
      workoutId: 'w2',
      isActive: true,
    });

    const active = await PersonalRecordRepository.getActiveByExercise('squat');
    expect(active?.id).toBe('r-latest');
  });
});
