import { BodyMeasurement, Exercise, MuscleGroup, WorkoutSession } from '../../types';
import { BodyMeasurement, WorkoutSession } from '../../types';

export interface WeeklyVolumeSummary {
  totalVolumeKg: number;
  workouts: number;
  avgVolumePerWorkout: number;
}

export interface WeightTrendPoint {
  date: string;
  weightKg: number;
}

export type ProgressPeriod = 'week' | 'month' | 'year' | 'all';

export interface MuscleGroupVolumePoint {
  muscleGroup: MuscleGroup;
  volumeKg: number;
}

export interface WorkoutFrequencyPoint {
  date: string;
  workouts: number;
}

function buildPeriodThreshold(period: ProgressPeriod): Date | null {
  if (period === 'all') return null;

  const now = new Date();
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function filterWorkoutsByPeriod(workouts: WorkoutSession[], period: ProgressPeriod): WorkoutSession[] {
  const threshold = buildPeriodThreshold(period);
  if (!threshold) return workouts;

  return workouts.filter((workout) => new Date(`${workout.date}T00:00:00.000Z`) >= threshold);
}

export class ProgressService {
  static summarizeWeeklyVolume(workouts: WorkoutSession[]): WeeklyVolumeSummary {
    if (workouts.length === 0) {
      return { totalVolumeKg: 0, workouts: 0, avgVolumePerWorkout: 0 };
    }

    const totalVolumeKg = workouts.reduce((sum, workout) => sum + workout.totalVolumeKg, 0);

    return {
      totalVolumeKg,
      workouts: workouts.length,
      avgVolumePerWorkout: Math.round((totalVolumeKg / workouts.length) * 10) / 10,
    };
  }

  static summarizeVolumeByPeriod(
    workouts: WorkoutSession[],
    period: ProgressPeriod
  ): WeeklyVolumeSummary {
    return ProgressService.summarizeWeeklyVolume(filterWorkoutsByPeriod(workouts, period));
  }

  static buildWeightTrend(measurements: BodyMeasurement[]): WeightTrendPoint[] {
    return measurements
      .filter((measurement) => typeof measurement.weightKg === 'number')
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((measurement) => ({
        date: measurement.date,
        weightKg: measurement.weightKg as number,
      }));
  }

  static summarizeVolumeByMuscleGroup(
    workouts: WorkoutSession[],
    exercises: Exercise[],
    period: ProgressPeriod
  ): MuscleGroupVolumePoint[] {
    const scoped = filterWorkoutsByPeriod(workouts, period);
    const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
    const totals = new Map<MuscleGroup, number>();

    for (const workout of scoped) {
      if (workout.exercises.length === 0 || workout.totalVolumeKg <= 0) continue;
      const perExerciseVolume = workout.totalVolumeKg / workout.exercises.length;

      for (const loggedExercise of workout.exercises) {
        const catalog = exerciseById.get(loggedExercise.exerciseId);
        if (!catalog || catalog.primaryMuscles.length === 0) continue;

        const perMuscle = perExerciseVolume / catalog.primaryMuscles.length;
        for (const muscle of catalog.primaryMuscles) {
          totals.set(muscle, Math.round(((totals.get(muscle) ?? 0) + perMuscle) * 10) / 10);
        }
      }
    }

    return [...totals.entries()]
      .map(([muscleGroup, volumeKg]) => ({ muscleGroup, volumeKg }))
      .sort((a, b) => b.volumeKg - a.volumeKg);
  }

  static summarizeWorkoutFrequency(
    workouts: WorkoutSession[],
    period: ProgressPeriod
  ): WorkoutFrequencyPoint[] {
    const scoped = filterWorkoutsByPeriod(workouts, period);
    const byDate = scoped.reduce<Record<string, number>>((acc, workout) => {
      acc[workout.date] = (acc[workout.date] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(byDate)
      .map(([date, count]) => ({ date, workouts: count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
