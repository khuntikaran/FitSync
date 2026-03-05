import { ScreenScaffold } from '../../components/layout/screenScaffold';
import { useWorkoutStore } from '../../store/workoutStore';
import { WorkoutScreenController } from './workoutScreen';

export async function buildWorkoutScreenView(searchQuery?: string): Promise<ScreenScaffold> {
  const state = useWorkoutStore.getState();
  const exercises = await WorkoutScreenController.listExercises(searchQuery);

  return {
    title: 'Workout',
    description: state.activeWorkout
      ? `${state.activeWorkout.name} in progress`
      : 'Start a workout to begin tracking sets.',
    sections: [
      {
        title: 'Active Exercises',
        items: state.activeWorkout?.exercises ?? [],
      },
      {
        title: 'Exercise Library Results',
        items: exercises.slice(0, 20),
      },
    ],
    actions: [
      { label: 'Finish', actionKey: 'workout.finish', emphasis: 'primary' },
      { label: 'Cancel', actionKey: 'workout.cancel', emphasis: 'secondary' },
    ],
  };
}
