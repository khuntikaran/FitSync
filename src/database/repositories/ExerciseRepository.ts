import { EXERCISES } from '../../constants/exercises';
import { Exercise } from '../../types';
import { DatabaseService } from '../connection';

export class ExerciseRepository {
  static async seedDefaults(): Promise<void> {
    await DatabaseService.transaction(async () => {
      for (const exercise of EXERCISES) {
        await DatabaseService.execute(
          `INSERT OR REPLACE INTO exercises (
            id, name, category, primary_muscles, secondary_muscles, equipment,
            met_value, difficulty, description, instructions, tips, is_favorite, image_asset
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL);`,
          [
            exercise.id,
            exercise.name,
            exercise.category,
            JSON.stringify(exercise.primaryMuscles),
            JSON.stringify(exercise.secondaryMuscles),
            exercise.equipment,
            exercise.metValue,
            exercise.difficulty,
            exercise.description,
            JSON.stringify(exercise.instructions),
            JSON.stringify(exercise.tips),
          ]
        );
      }
    });
  }

  static async getAll(): Promise<Exercise[]> {
    return EXERCISES;
  }

  static async getByCategory(category: Exercise['category']): Promise<Exercise[]> {
    return EXERCISES.filter((exercise) => exercise.category === category);
  }

  static async searchByName(query: string): Promise<Exercise[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return EXERCISES;

    return EXERCISES.filter((exercise) =>
      exercise.name.toLowerCase().includes(normalized)
    );
  }
}
