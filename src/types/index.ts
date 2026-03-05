export type Gender = 'male' | 'female' | 'other';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type WorkoutCategory =
  | 'push'
  | 'pull'
  | 'legs'
  | 'upper'
  | 'lower'
  | 'full_body'
  | 'chest'
  | 'back'
  | 'arms'
  | 'shoulders'
  | 'core'
  | 'cardio'
  | 'custom';

export type MuscleGroup =
  | 'chest'
  | 'upper_chest'
  | 'lower_chest'
  | 'lats'
  | 'traps'
  | 'rhomboids'
  | 'lower_back'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'core'
  | 'cardio';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'smith_machine'
  | 'kettlebell'
  | 'bodyweight'
  | 'resistance_band'
  | 'med_ball';

export interface Exercise {
  id: string;
  name: string;
  category: Exclude<WorkoutCategory, 'custom'>;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  metValue: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions: string[];
  tips: string[];
}

export interface ExerciseSet {
  id: string;
  reps: number;
  weightKg: number;
  completed: boolean;
  rpe?: number;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
  restTimeSeconds: number;
  orderIndex: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  workoutType: Exclude<WorkoutCategory, 'custom'>;
  description: string;
  exercises: Array<{
    exerciseId: string;
    defaultSets: number;
    defaultReps: number;
    restTimeSeconds: number;
  }>;
}

export interface WorkoutSession {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  name: string;
  workoutType: WorkoutCategory;
  templateId?: string;
  exercises: WorkoutExercise[];
  totalCaloriesBurned: number;
  totalVolumeKg: number;
  totalDurationSeconds: number;
}

export interface UserProfile {
  id: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  bmr: number;
  tdee: number;
  unitSystem: 'metric' | 'imperial';
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  recordType: 'weight' | 'volume' | 'one_rep_max' | 'reps';
  value: number;
  previousValue?: number;
  date: string;
  workoutId: string;
  isActive: boolean;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
  shouldersCm?: number;
  notes?: string;
}
