import { beforeEach, describe, expect, it } from 'vitest';
import { BodyMeasurementRepository } from '../src/database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';
import { WorkoutRepository } from '../src/database/repositories/WorkoutRepository';
import {
  buildProgressChartPipeline,
  submitMeasurementForm,
  submitPersonalRecordForm,
} from '../src/screens/progress/formsAndCharts';

describe('progress forms and chart pipeline', () => {
  beforeEach(async () => {
    await BodyMeasurementRepository.replaceAll([]);
    await PersonalRecordRepository.replaceAll([]);
    await WorkoutRepository.replaceAll([]);
  });

  it('submits measurement form with sanitization and generated id', async () => {
    const result = await submitMeasurementForm({
      userId: 'user-1',
      date: '2026-03-01T12:00:00.000Z',
      weightKg: 80.5,
      notes: '  weekly check-in  ',
    });

    expect(result.id).toContain('bm-');
    expect(result.date).toBe('2026-03-01');
    expect(result.notes).toBe('weekly check-in');
  });

  it('submits personal record form and rejects invalid value', async () => {
    const record = await submitPersonalRecordForm({
      userId: 'user-1',
      exerciseId: 'bench',
      exerciseName: ' Bench Press ',
      recordType: 'weight',
      value: 100,
      workoutId: 'workout-1',
      date: '2026-03-01',
    });

    expect(record.id).toContain('pr-');
    expect(record.exerciseName).toBe('Bench Press');

    await expect(
      submitPersonalRecordForm({
        userId: 'user-1',
        exerciseId: 'bench',
        exerciseName: 'Bench Press',
        recordType: 'weight',
        value: 0,
        workoutId: 'workout-1',
      })
    ).rejects.toThrow('Record value must be positive.');
  });

  it('builds chart datasets from measurements, workouts and active records', async () => {
    await submitMeasurementForm({ userId: 'user-1', date: '2026-03-01', weightKg: 80 });
    await WorkoutRepository.save({
      id: 'w1',
      date: '2026-03-01',
      startTime: '2026-03-01T10:00:00.000Z',
      endTime: '2026-03-01T11:00:00.000Z',
      name: 'Push',
      workoutType: 'push',
      exercises: [{ id: 'we1', exerciseId: 'barbell_bench_press', exerciseName: 'Barbell Bench Press', sets: [], restTimeSeconds: 90, orderIndex: 0 }],
      exercises: [],
      totalCaloriesBurned: 300,
      totalVolumeKg: 1200,
      totalDurationSeconds: 3600,
    });

    await submitPersonalRecordForm({
      userId: 'user-1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      recordType: 'weight',
      value: 105,
      workoutId: 'w1',
      date: '2026-03-01',
    });

    const chart = await buildProgressChartPipeline('all');

    expect(chart.weightLine).toEqual([{ x: '2026-03-01', y: 80 }]);
    expect(chart.volumeLine).toEqual([{ x: '2026-03-01', y: 1200 }]);
    expect(chart.recordBar).toEqual([{ x: 'Bench Press', y: 105 }]);
    expect(chart.muscleGroupBar.length).toBeGreaterThan(0);
    expect(chart.workoutFrequencyBar).toEqual([{ x: '2026-03-01', y: 1 }]);
    expect(chart.recordTimelineLine).toEqual([{ x: '2026-03-01', y: 105 }]);
  });
});
