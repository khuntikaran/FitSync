import { WorkoutSession } from '../../types';

export interface WeeklyVolumeSummary {
  totalVolumeKg: number;
  workouts: number;
  avgVolumePerWorkout: number;
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
}
