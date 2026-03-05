import { ExerciseRepository } from '../../database/repositories/ExerciseRepository';
import { NotificationService } from '../../services/notifications/NotificationService';
import { useWorkoutStore } from '../../store/workoutStore';
import { Exercise, WorkoutTemplate } from '../../types';

export class WorkoutScreenController {
  static startWorkout(template?: WorkoutTemplate): void {
    useWorkoutStore.getState().startWorkout(template);
  }

  static addExercise(exercise: Exercise): void {
    useWorkoutStore.getState().addExercise(exercise);
  }

  static async listExercises(query?: string): Promise<Exercise[]> {
    if (!query) return ExerciseRepository.getAll();
    return ExerciseRepository.searchByName(query);
  }

  static async completeSetAndStartRest(exerciseId: string, setId: string, seconds: number): Promise<void> {
    const state = useWorkoutStore.getState();
    state.completeSet(exerciseId, setId);
    state.startRestTimer(seconds);
    await NotificationService.scheduleRestTimer(seconds);
  }

  static async finishWorkout(): Promise<void> {
    await useWorkoutStore.getState().completeWorkout();
    await NotificationService.cancelAll();
  }

  static cancelWorkout(): void {
    useWorkoutStore.getState().cancelWorkout();
  }
}
