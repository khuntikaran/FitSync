import { create } from 'zustand';
import { Exercise, ExerciseSet, WorkoutSession, WorkoutTemplate } from '../types';
import { WorkoutSessionService } from '../services/workout/WorkoutSessionService';

interface WorkoutState {
  activeWorkout: WorkoutSession | null;
  restTimer: {
    isRunning: boolean;
    timeRemaining: number;
    totalTime: number;
  };
  startWorkout: (template?: WorkoutTemplate) => void;
  addExercise: (exercise: Exercise) => void;
  addSet: (exerciseId: string, set: Omit<ExerciseSet, 'id'>) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<ExerciseSet>) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  completeWorkout: () => Promise<void>;
  cancelWorkout: () => void;
}

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
export const useWorkoutStore = create<WorkoutState>((set) => ({
  activeWorkout: null,
  restTimer: { isRunning: false, timeRemaining: 0, totalTime: 0 },

  startWorkout: (template) => {
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const newWorkout: WorkoutSession = {
      id: id(),
      date,
      startTime: today.toISOString(),
      name: template?.name ?? 'Custom Workout',
      workoutType: template?.workoutType ?? 'custom',
      templateId: template?.id,
      exercises: [],
      totalCaloriesBurned: 0,
      totalVolumeKg: 0,
      totalDurationSeconds: 0,
    };

    set({ activeWorkout: newWorkout });
  },

  addExercise: (exercise) =>
    set((state) => {
      if (!state.activeWorkout) return state;

      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: [
            ...state.activeWorkout.exercises,
            {
              id: id(),
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              sets: [],
              restTimeSeconds: 90,
              orderIndex: state.activeWorkout.exercises.length,
            },
          ],
        },
      };
    }),

  addSet: (exerciseId, incomingSet) =>
    set((state) => {
      if (!state.activeWorkout) return state;

      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map((exercise) =>
            exercise.id === exerciseId
              ? {
                  ...exercise,
                  sets: [...exercise.sets, { ...incomingSet, id: id() }],
                }
              : exercise
          ),
        },
      };
    }),

  updateSet: (exerciseId, setId, updates) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map((ex) =>
            ex.id !== exerciseId
              ? ex
              : { ...ex, sets: ex.sets.map((s) => (s.id === setId ? { ...s, ...updates } : s)) }
          ),
        },
      };
    }),

  completeSet: (exerciseId, setId) =>
    set((state) => {
      if (!state.activeWorkout) return state;
      return {
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map((ex) =>
            ex.id !== exerciseId
              ? ex
              : { ...ex, sets: ex.sets.map((s) => (s.id === setId ? { ...s, completed: true } : s)) }
          ),
        },
      };
    }),

  startRestTimer: (seconds) =>
    set({ restTimer: { isRunning: true, timeRemaining: seconds, totalTime: seconds } }),

  stopRestTimer: () => set({ restTimer: { isRunning: false, timeRemaining: 0, totalTime: 0 } }),

  completeWorkout: async () => {
    const workout = get().activeWorkout;
    if (!workout) return;

    await WorkoutSessionService.saveFinalized(workout);
    set({ activeWorkout: null, restTimer: { isRunning: false, timeRemaining: 0, totalTime: 0 } });
  },

  cancelWorkout: () =>
    set({ activeWorkout: null, restTimer: { isRunning: false, timeRemaining: 0, totalTime: 0 } }),
  cancelWorkout: () => set({ activeWorkout: null, restTimer: { isRunning: false, timeRemaining: 0, totalTime: 0 } }),
}));
