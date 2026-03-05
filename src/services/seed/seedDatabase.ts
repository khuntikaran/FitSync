import { runMigrations } from '../../database/migrations/runMigrations';
import { ExerciseRepository } from '../../database/repositories/ExerciseRepository';

export async function seedDatabase(): Promise<void> {
  await runMigrations();
  await ExerciseRepository.seedDefaults();
}
