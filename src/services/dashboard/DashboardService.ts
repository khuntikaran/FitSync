import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { HistoryService } from '../progress/HistoryService';
import { ProgressService } from '../progress/ProgressService';

export interface DashboardSummary {
  totalWorkouts: number;
  latestWorkoutName: string | null;
  latestWorkoutDate: string | null;
  weeklyVolumeKg: number;
}

export class DashboardService {
  static async getSummary(): Promise<DashboardSummary> {
    const workouts = await WorkoutRepository.getAll();
    const latest = HistoryService.getLatestWorkout(workouts);
    const volume = ProgressService.summarizeWeeklyVolume(workouts);

    return {
      totalWorkouts: workouts.length,
      latestWorkoutName: latest?.name ?? null,
      latestWorkoutDate: latest?.date ?? null,
      weeklyVolumeKg: volume.totalVolumeKg,
    };
  }
}
