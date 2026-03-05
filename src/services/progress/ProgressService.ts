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
