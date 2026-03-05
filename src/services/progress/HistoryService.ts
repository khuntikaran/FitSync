import { WorkoutSession } from '../../types';

function toDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00.000Z`);
}

function diffDays(a: Date, b: Date): number {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

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

  static calculateWorkoutStreak(workouts: WorkoutSession[]): number {
    if (workouts.length === 0) return 0;

    const uniqueDates = [...new Set(workouts.map((w) => w.date))].sort((a, b) => b.localeCompare(a));
    let streak = 1;

    for (let i = 1; i < uniqueDates.length; i += 1) {
      const prev = toDate(uniqueDates[i - 1]);
      const curr = toDate(uniqueDates[i]);
      if (diffDays(prev, curr) === 1) streak += 1;
      else break;
    }

    return streak;
  }
}
