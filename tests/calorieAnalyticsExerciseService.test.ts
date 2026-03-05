import { describe, expect, it } from 'vitest';
import { CalorieCalculator } from '../src/services/calculations/CalorieCalculator';
import { WorkoutAnalyticsService } from '../src/services/analytics/WorkoutAnalyticsService';
import { ExerciseRepository } from '../src/database/repositories/ExerciseRepository';
import { WorkoutSession } from '../src/types';

function session(): WorkoutSession {
  return {
    id: 'w1',
    date: '2026-01-10',
    startTime: '2026-01-10T10:00:00.000Z',
    name: 'Session',
    workoutType: 'push',
    exercises: [
      {
        id: 'we1',
        exerciseId: 'barbell_bench_press',
        exerciseName: 'Barbell Bench Press',
        restTimeSeconds: 90,
        orderIndex: 0,
        sets: [
          { id: 's1', reps: 8, weightKg: 80, completed: true },
          { id: 's2', reps: 8, weightKg: 80, completed: false },
        ],
      },
      {
        id: 'we2',
        exerciseId: 'overhead_press',
        exerciseName: 'Overhead Press',
        restTimeSeconds: 90,
        orderIndex: 1,
        sets: [{ id: 's3', reps: 5, weightKg: 50, completed: true }],
      },
    ],
    totalCaloriesBurned: 0,
    totalVolumeKg: 0,
    totalDurationSeconds: 0,
  };
}

describe('CalorieCalculator', () => {
  it('calculates BMR/TDEE/BMI and volume', () => {
    const bmr = CalorieCalculator.calculateBMR(80, 180, 30, 'male');
    const tdee = CalorieCalculator.calculateTDEE(bmr, 'moderate');
    const bmi = CalorieCalculator.calculateBMI(80, 180);
    const volume = CalorieCalculator.calculateVolume([
      { reps: 10, weightKg: 50, completed: true },
      { reps: 10, weightKg: 50, completed: false },
    ]);

    expect(bmr).toBeGreaterThan(0);
    expect(tdee).toBeGreaterThan(bmr);
    expect(bmi).toBe(24.7);
    expect(volume).toBe(500);
  });

  it('handles one-rep-max and progression suggestions', () => {
    expect(CalorieCalculator.calculateOneRepMax(100, 1)).toBe(100);
    expect(CalorieCalculator.calculateOneRepMax(100, 0)).toBeNull();
    expect(CalorieCalculator.calculateOneRepMax(100, 13)).toBeNull();

    const inc = CalorieCalculator.suggestProgression(100, 8, 10, 8);
    const keep = CalorieCalculator.suggestProgression(100, 8, 8, 9);
    const deload = CalorieCalculator.suggestProgression(100, 8, 6, 9);

    expect(inc.suggestion).toBe('increase');
    expect(inc.newWeight).toBeGreaterThan(100);
    expect(keep.suggestion).toBe('maintain');
    expect(deload.suggestion).toBe('deload');
    expect(deload.newWeight).toBeLessThan(100);
  });

  it('calculates exercise calories with intensity and rest factors', () => {
    const calories = CalorieCalculator.calculateExerciseCalories(
      6,
      80,
      [
        { reps: 10, weightKg: 60, completed: true },
        { reps: 8, weightKg: 60, completed: true },
      ],
      'vigorous',
      90
    );

    expect(calories).toBeGreaterThan(0);
  });
});

describe('WorkoutAnalyticsService', () => {
  it('calculates session volume and completion rate', () => {
    const s = session();

    expect(WorkoutAnalyticsService.calculateSessionVolume(s)).toBe(890);
    expect(WorkoutAnalyticsService.calculateSetCompletionRate(s)).toBe(67);
  });

  it('returns zero completion rate for sessions with no sets', () => {
    const s = session();
    s.exercises = [];
    expect(WorkoutAnalyticsService.calculateSetCompletionRate(s)).toBe(0);
  });
});

describe('ExerciseRepository', () => {
  it('filters by category and supports search', async () => {
    const chest = await ExerciseRepository.getByCategory('chest');
    expect(chest.length).toBeGreaterThan(0);

    const search = await ExerciseRepository.searchByName('bench');
    expect(search.some((e) => e.name.toLowerCase().includes('bench'))).toBe(true);

    const all = await ExerciseRepository.searchByName('   ');
    const list = await ExerciseRepository.getAll();
    expect(all.length).toBe(list.length);
  });
});
