import { BodyMeasurement, WorkoutSession } from '../../types';
import { WorkoutSession } from '../../types';

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

function filterWorkoutsByPeriod(workouts: WorkoutSession[], period: ProgressPeriod): WorkoutSession[] {
  if (period === 'all') return workouts;

  const now = new Date();
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

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
}
