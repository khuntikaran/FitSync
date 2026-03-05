import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { HistoryService } from '../progress/HistoryService';
import { ProgressService } from '../progress/ProgressService';

export interface DashboardSummary {
  totalWorkouts: number;
  latestWorkoutName: string | null;
  latestWorkoutDate: string | null;
  workoutStreakDays: number;
  weeklyVolumeKg: number;
  monthlyVolumeKg: number;
}

export class DashboardService {
  static async getSummary(): Promise<DashboardSummary> {
    const workouts = await WorkoutRepository.getAll();
    const latest = HistoryService.getLatestWorkout(workouts);
    const streak = HistoryService.calculateWorkoutStreak(workouts);
    const weekly = ProgressService.summarizeVolumeByPeriod(workouts, 'week');
    const monthly = ProgressService.summarizeVolumeByPeriod(workouts, 'month');

    return {
      totalWorkouts: workouts.length,
      latestWorkoutName: latest?.name ?? null,
      latestWorkoutDate: latest?.date ?? null,
      workoutStreakDays: streak,
      weeklyVolumeKg: weekly.totalVolumeKg,
      monthlyVolumeKg: monthly.totalVolumeKg,
    };
  }
}
