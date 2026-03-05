import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { WorkoutSession } from '../../types';

export interface HistoryScreenData {
  workouts: WorkoutSession[];
  total: number;
}

export async function loadHistoryScreenData(): Promise<HistoryScreenData> {
  const workouts = await WorkoutRepository.getAll();
  const sorted = [...workouts].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.startTime.localeCompare(a.startTime);
  });

  return {
    workouts: sorted,
    total: sorted.length,
  };
}

export async function getWorkoutHistoryDetail(workoutId: string): Promise<WorkoutSession | null> {
  const workouts = await WorkoutRepository.getAll();
  return workouts.find((workout) => workout.id === workoutId) ?? null;
}
