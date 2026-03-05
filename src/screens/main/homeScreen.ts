import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { DashboardService } from '../../services/dashboard/DashboardService';
import { HistoryService } from '../../services/progress/HistoryService';

export interface HomeScreenData {
  greeting: string;
  streakDays: number;
  totalWorkouts: number;
  latestWorkoutName: string | null;
  latestWorkoutDate: string | null;
  weeklyVolumeKg: number;
}

function buildGreeting(now: Date): string {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export async function loadHomeScreenData(now: Date = new Date()): Promise<HomeScreenData> {
  const workouts = await WorkoutRepository.getAll();
  const summary = await DashboardService.getSummary();

  return {
    greeting: buildGreeting(now),
    streakDays: HistoryService.calculateWorkoutStreak(workouts),
    totalWorkouts: summary.totalWorkouts,
    latestWorkoutName: summary.latestWorkoutName,
    latestWorkoutDate: summary.latestWorkoutDate,
    weeklyVolumeKg: summary.weeklyVolumeKg,
  };
}
