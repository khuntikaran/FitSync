import { Exercise, WorkoutTemplate, WorkoutCategory, MuscleGroup, Equipment } from '../types';

type ExerciseCategory = Exclude<WorkoutCategory, 'custom'>;

const CATEGORY_IMAGE_ASSET: Record<ExerciseCategory, string> = {
  push: 'assets/images/exercises/categories/push.svg',
  pull: 'assets/images/exercises/categories/pull.svg',
  legs: 'assets/images/exercises/categories/legs.svg',
  upper: 'assets/images/exercises/categories/upper.svg',
  lower: 'assets/images/exercises/categories/lower.svg',
  full_body: 'assets/images/exercises/categories/full_body.svg',
  chest: 'assets/images/exercises/categories/chest.svg',
  back: 'assets/images/exercises/categories/back.svg',
  arms: 'assets/images/exercises/categories/arms.svg',
  shoulders: 'assets/images/exercises/categories/shoulders.svg',
  core: 'assets/images/exercises/categories/core.svg',
  cardio: 'assets/images/exercises/categories/cardio.svg',
};

interface ExerciseSeedDefinition {
  category: ExerciseCategory;
  baseName: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  metValue: number;
  difficulty: Exercise['difficulty'];
}

const EXERCISE_SEEDS: ExerciseSeedDefinition[] = [
  { category: 'push', baseName: 'Barbell Bench Press', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'], equipment: 'barbell', metValue: 6.0, difficulty: 'intermediate' },
  { category: 'pull', baseName: 'Barbell Deadlift', primaryMuscles: ['lower_back', 'hamstrings', 'glutes'], secondaryMuscles: ['traps', 'lats', 'forearms'], equipment: 'barbell', metValue: 8.0, difficulty: 'advanced' },
  { category: 'legs', baseName: 'Back Squat', primaryMuscles: ['quads', 'glutes'], secondaryMuscles: ['hamstrings', 'core'], equipment: 'barbell', metValue: 6.5, difficulty: 'intermediate' },
  { category: 'upper', baseName: 'Pull-Ups', primaryMuscles: ['lats'], secondaryMuscles: ['biceps', 'rhomboids'], equipment: 'bodyweight', metValue: 5.0, difficulty: 'intermediate' },
  { category: 'lower', baseName: 'Romanian Deadlift', primaryMuscles: ['hamstrings', 'glutes'], secondaryMuscles: ['lower_back'], equipment: 'barbell', metValue: 6.0, difficulty: 'intermediate' },
  { category: 'full_body', baseName: 'Dumbbell Thruster', primaryMuscles: ['quads', 'front_delts'], secondaryMuscles: ['glutes', 'core'], equipment: 'dumbbell', metValue: 7.0, difficulty: 'intermediate' },
  { category: 'chest', baseName: 'Push-Ups', primaryMuscles: ['chest'], secondaryMuscles: ['triceps', 'front_delts'], equipment: 'bodyweight', metValue: 4.0, difficulty: 'beginner' },
  { category: 'back', baseName: 'Barbell Row', primaryMuscles: ['lats', 'rhomboids'], secondaryMuscles: ['biceps', 'lower_back'], equipment: 'barbell', metValue: 6.0, difficulty: 'intermediate' },
  { category: 'arms', baseName: 'Dumbbell Curl', primaryMuscles: ['biceps'], secondaryMuscles: ['forearms'], equipment: 'dumbbell', metValue: 3.0, difficulty: 'beginner' },
  { category: 'shoulders', baseName: 'Overhead Press', primaryMuscles: ['front_delts'], secondaryMuscles: ['triceps', 'side_delts'], equipment: 'barbell', metValue: 5.0, difficulty: 'intermediate' },
  { category: 'core', baseName: 'Plank', primaryMuscles: ['abs', 'core'], secondaryMuscles: ['glutes'], equipment: 'bodyweight', metValue: 3.0, difficulty: 'beginner' },
  { category: 'cardio', baseName: 'Running', primaryMuscles: ['cardio'], secondaryMuscles: ['quads', 'hamstrings', 'calves'], equipment: 'bodyweight', metValue: 9.8, difficulty: 'intermediate' },
];

const TRAINING_VARIANTS = [
  'Strength',
  'Hypertrophy',
  'Tempo',
  'Paused',
  'Explosive',
  'Circuit',
  'Endurance',
  'Controlled',
  'Technique',
  'Power',
  'Volume',
  'Deload',
  'Progression',
] as const;

function toId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function buildExercise(seed: ExerciseSeedDefinition, variant: string): Exercise {
  const name = `${seed.baseName} (${variant})`;
  return {
    id: toId(`${seed.category}_${seed.baseName}_${variant}`),
    name,
    category: seed.category,
    primaryMuscles: seed.primaryMuscles,
    secondaryMuscles: seed.secondaryMuscles,
    equipment: seed.equipment,
    metValue: seed.metValue,
    difficulty: seed.difficulty,
    description: `${seed.baseName} variation focused on ${variant.toLowerCase()} training stimulus.`,
    instructions: [
      `Set up for ${seed.baseName.toLowerCase()} safely.`,
      `Perform reps using ${variant.toLowerCase()} intent.`,
      'Control each rep and maintain consistent form.',
    ],
    tips: [`Use appropriate load for ${variant.toLowerCase()} day.`],
  };
}

const generatedExercises = EXERCISE_SEEDS.flatMap((seed) =>
  TRAINING_VARIANTS.map((variant) => buildExercise(seed, variant))
);

export const EXERCISES: Exercise[] = [
  {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'front_delts'],
    equipment: 'barbell',
    metValue: 6.0,
    difficulty: 'intermediate',
    description: 'Compound chest exercise using barbell.',
    instructions: ['Lie flat on bench with eyes under bar.', 'Lower to mid-chest with control.', 'Press up to full lockout.'],
    tips: ['Keep wrists stacked over elbows.'],
  },
  {
    id: 'overhead_press',
    name: 'Overhead Press',
    category: 'shoulders',
    primaryMuscles: ['front_delts'],
    secondaryMuscles: ['triceps', 'side_delts'],
    equipment: 'barbell',
    metValue: 5.0,
    difficulty: 'intermediate',
    description: 'Standing vertical pressing movement.',
    instructions: ['Brace core.', 'Press bar overhead.', 'Lower under control.'],
    tips: ['Avoid excessive back arch.'],
  },
  {
    id: 'deadlift',
    name: 'Barbell Deadlift',
    category: 'pull',
    primaryMuscles: ['lower_back', 'hamstrings', 'glutes'],
    secondaryMuscles: ['traps', 'lats', 'forearms'],
    equipment: 'barbell',
    metValue: 8.0,
    difficulty: 'advanced',
    description: 'Heavy posterior-chain compound.',
    instructions: ['Brace core.', 'Keep neutral spine.', 'Drive through floor.'],
    tips: ['Keep bar path close to shins.'],
  },
  {
    id: 'barbell_row',
    name: 'Barbell Row',
    category: 'back',
    primaryMuscles: ['lats', 'rhomboids'],
    secondaryMuscles: ['biceps', 'lower_back'],
    equipment: 'barbell',
    metValue: 6.0,
    difficulty: 'intermediate',
    description: 'Horizontal pulling for back thickness.',
    instructions: ['Hinge at hips.', 'Pull to lower chest.', 'Lower with control.'],
    tips: ['Do not round lower back.'],
  },
  {
    id: 'squat',
    name: 'Barbell Back Squat',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core', 'lower_back'],
    equipment: 'barbell',
    metValue: 6.5,
    difficulty: 'intermediate',
    description: 'Foundational lower-body exercise.',
    instructions: ['Brace and descend.', 'Reach depth.', 'Drive to stand.'],
    tips: ['Knees track with toes.'],
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    category: 'lower',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lower_back'],
    equipment: 'barbell',
    metValue: 6.0,
    difficulty: 'intermediate',
    description: 'Hip hinge for hamstrings and glutes.',
    instructions: ['Hinge hips back.', 'Maintain neutral spine.', 'Return by extending hips.'],
    tips: ['Keep bar close to legs.'],
  },
  {
    id: 'pull_ups',
    name: 'Pull-Ups',
    category: 'upper',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'rhomboids'],
    equipment: 'bodyweight',
    metValue: 5.0,
    difficulty: 'intermediate',
    description: 'Bodyweight vertical pull.',
    instructions: ['Hang from bar.', 'Pull chin over bar.', 'Lower with control.'],
    tips: ['Use full range of motion.'],
  },
  {
    id: 'dumbbell_curl',
    name: 'Dumbbell Curl',
    category: 'arms',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    metValue: 3.0,
    difficulty: 'beginner',
    description: 'Biceps isolation exercise.',
    instructions: ['Keep elbows tucked.', 'Curl with control.', 'Lower slowly.'],
    tips: ['Avoid swinging.'],
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    primaryMuscles: ['abs', 'core'],
    secondaryMuscles: ['glutes'],
    equipment: 'bodyweight',
    metValue: 3.0,
    difficulty: 'beginner',
    description: 'Isometric core stability hold.',
    instructions: ['Keep body straight.', 'Brace core.', 'Breathe steadily.'],
    tips: ['Prioritize form over duration.'],
  },
  {
    id: 'running',
    name: 'Running (6 mph)',
    category: 'cardio',
    primaryMuscles: ['cardio'],
    secondaryMuscles: ['quads', 'hamstrings', 'calves'],
    equipment: 'bodyweight',
    metValue: 9.8,
    difficulty: 'intermediate',
    description: 'Steady-state cardio effort.',
    instructions: ['Maintain pace and breathing rhythm.'],
    tips: ['Progress by pace or distance.'],
  },
  {
    id: 'push_ups',
    name: 'Push-Ups',
    category: 'chest',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'front_delts'],
    equipment: 'bodyweight',
    metValue: 4.0,
    difficulty: 'beginner',
    description: 'Bodyweight pressing movement.',
    instructions: ['Hands under shoulders.', 'Lower chest to floor.', 'Press up.'],
    tips: ['Maintain rigid plank position.'],
  },
  {
    id: 'thruster',
    name: 'Dumbbell Thruster',
    category: 'full_body',
    primaryMuscles: ['quads', 'front_delts'],
    secondaryMuscles: ['glutes', 'core'],
    equipment: 'dumbbell',
    metValue: 7.0,
    difficulty: 'intermediate',
    description: 'Squat to overhead press combo movement.',
    instructions: ['Squat with dumbbells.', 'Drive up explosively.', 'Press overhead at top.'],
    tips: ['Keep torso upright.'],
  },
  ...generatedExercises,
];

export const EXERCISE_IMAGE_ASSETS: Record<string, string> = EXERCISES.reduce<Record<string, string>>(
  (acc, exercise) => {
    acc[exercise.id] = CATEGORY_IMAGE_ASSET[exercise.category];
    return acc;
  },
  {}
);

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'template_push',
    name: 'Push Day',
    workoutType: 'push',
    description: 'Chest, shoulders, triceps focus.',
    exercises: [{ exerciseId: 'barbell_bench_press', defaultSets: 4, defaultReps: 8, restTimeSeconds: 120 }],
  },
  {
    id: 'template_pull',
    name: 'Pull Day',
    workoutType: 'pull',
    description: 'Back and biceps focus.',
    exercises: [{ exerciseId: 'deadlift', defaultSets: 3, defaultReps: 5, restTimeSeconds: 180 }],
  },
  {
    id: 'template_legs',
    name: 'Leg Day',
    workoutType: 'legs',
    description: 'Lower body hypertrophy/strength.',
    exercises: [{ exerciseId: 'squat', defaultSets: 4, defaultReps: 8, restTimeSeconds: 180 }],
  },
  {
    id: 'template_upper',
    name: 'Upper Body',
    workoutType: 'upper',
    description: 'Mixed upper-body compounds.',
    exercises: [{ exerciseId: 'pull_ups', defaultSets: 4, defaultReps: 8, restTimeSeconds: 120 }],
  },
  {
    id: 'template_lower',
    name: 'Lower Body',
    workoutType: 'lower',
    description: 'Posterior + anterior chain.',
    exercises: [{ exerciseId: 'romanian_deadlift', defaultSets: 4, defaultReps: 10, restTimeSeconds: 120 }],
  },
  {
    id: 'template_full_body',
    name: 'Full Body',
    workoutType: 'full_body',
    description: 'Full body stimulus in one session.',
    exercises: [{ exerciseId: 'thruster', defaultSets: 4, defaultReps: 10, restTimeSeconds: 90 }],
  },
  {
    id: 'template_chest',
    name: 'Chest Focus',
    workoutType: 'chest',
    description: 'Chest emphasis split.',
    exercises: [{ exerciseId: 'push_ups', defaultSets: 4, defaultReps: 15, restTimeSeconds: 60 }],
  },
  {
    id: 'template_back',
    name: 'Back Focus',
    workoutType: 'back',
    description: 'Back emphasis split.',
    exercises: [{ exerciseId: 'barbell_row', defaultSets: 4, defaultReps: 10, restTimeSeconds: 90 }],
  },
  {
    id: 'template_arms',
    name: 'Arms Focus',
    workoutType: 'arms',
    description: 'Arms-specific training day.',
    exercises: [{ exerciseId: 'dumbbell_curl', defaultSets: 4, defaultReps: 12, restTimeSeconds: 60 }],
  },
  {
    id: 'template_shoulders',
    name: 'Shoulders Focus',
    workoutType: 'shoulders',
    description: 'Shoulder-specific day.',
    exercises: [{ exerciseId: 'overhead_press', defaultSets: 4, defaultReps: 8, restTimeSeconds: 120 }],
  },
  {
    id: 'template_core',
    name: 'Core Focus',
    workoutType: 'core',
    description: 'Core stability and strength.',
    exercises: [{ exerciseId: 'plank', defaultSets: 3, defaultReps: 1, restTimeSeconds: 60 }],
  },
  {
    id: 'template_cardio',
    name: 'Cardio Focus',
    workoutType: 'cardio',
    description: 'Conditioning day.',
    exercises: [{ exerciseId: 'running', defaultSets: 1, defaultReps: 1, restTimeSeconds: 0 }],
  },
];

export function getWorkoutTemplateByType(type: WorkoutTemplate['workoutType']): WorkoutTemplate | undefined {
  return WORKOUT_TEMPLATES.find((template) => template.workoutType === type);
}
