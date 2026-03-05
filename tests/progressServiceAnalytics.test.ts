import { describe, expect, it } from 'vitest';
import { EXERCISES } from '../src/constants/exercises';
import { ProgressService } from '../src/services/progress/ProgressService';
import { WorkoutSession } from '../src/types';

const workouts: WorkoutSession[] = [
  {
    id: 'w1',
    date: '2026-03-01',
    startTime: '2026-03-01T10:00:00.000Z',
    endTime: '2026-03-01T11:00:00.000Z',
    name: 'Push',
    workoutType: 'push',
    exercises: [
      { id: 'we1', exerciseId: 'barbell_bench_press', exerciseName: 'Barbell Bench Press', sets: [], restTimeSeconds: 90, orderIndex: 0 },
      { id: 'we2', exerciseId: 'overhead_press', exerciseName: 'Overhead Press', sets: [], restTimeSeconds: 90, orderIndex: 1 },
    ],
    totalCaloriesBurned: 300,
    totalVolumeKg: 1600,
    totalDurationSeconds: 3600,
  },
  {
    id: 'w2',
    date: '2026-03-01',
    startTime: '2026-03-01T18:00:00.000Z',
    endTime: '2026-03-01T19:00:00.000Z',
    name: 'Back',
    workoutType: 'back',
    exercises: [
      { id: 'we3', exerciseId: 'barbell_row', exerciseName: 'Barbell Row', sets: [], restTimeSeconds: 90, orderIndex: 0 },
    ],
    totalCaloriesBurned: 280,
    totalVolumeKg: 900,
    totalDurationSeconds: 3000,
  },
];

describe('ProgressService richer analytics sources', () => {
  it('summarizes muscle group volume distribution', () => {
    const muscleVolume = ProgressService.summarizeVolumeByMuscleGroup(workouts, EXERCISES, 'all');

    expect(muscleVolume.length).toBeGreaterThan(0);
    expect(muscleVolume[0].volumeKg).toBeGreaterThan(0);
    expect(muscleVolume.some((entry) => entry.muscleGroup === 'chest')).toBe(true);
  });

  it('summarizes workout frequency by date', () => {
    const frequency = ProgressService.summarizeWorkoutFrequency(workouts, 'all');
    expect(frequency).toEqual([{ date: '2026-03-01', workouts: 2 }]);
  });
});
