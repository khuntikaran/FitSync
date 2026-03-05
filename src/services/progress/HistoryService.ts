import { WorkoutSession } from '../../types';

export class HistoryService {
  static groupWorkoutsByDate(workouts: WorkoutSession[]): Record<string, WorkoutSession[]> {
    return workouts.reduce<Record<string, WorkoutSession[]>>((acc, workout) => {
      if (!acc[workout.date]) acc[workout.date] = [];
      acc[workout.date].push(workout);
      return acc;
    }, {});
  }

  static getLatestWorkout(workouts: WorkoutSession[]): WorkoutSession | null {
    if (workouts.length === 0) return null;
    return [...workouts].sort((a, b) => b.startTime.localeCompare(a.startTime))[0];
  }
}
