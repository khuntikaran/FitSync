import { CalorieCalculator } from '../calculations/CalorieCalculator';
import { ExerciseSet, WorkoutSession } from '../../types';

export class WorkoutAnalyticsService {
  static calculateSessionVolume(session: WorkoutSession): number {
    return session.exercises.reduce(
      (sum, exercise) => sum + CalorieCalculator.calculateVolume(exercise.sets),
      0
    );
  }

  static calculateSetCompletionRate(session: WorkoutSession): number {
    const allSets: ExerciseSet[] = session.exercises.flatMap((exercise) => exercise.sets);
    if (allSets.length === 0) return 0;
    const completed = allSets.filter((set) => set.completed).length;
    return Math.round((completed / allSets.length) * 100);
  }
}
