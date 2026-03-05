import { WorkoutSession } from '../../types';
import { DatabaseService } from '../connection';

export class WorkoutRepository {
  private static workouts: WorkoutSession[] = [];

  static async save(session: WorkoutSession): Promise<void> {
    WorkoutRepository.workouts.push(session);

    await DatabaseService.execute(
      `INSERT OR REPLACE INTO workout_sessions
      (id, user_id, date, start_time, end_time, name, workout_type, template_id, total_calories_burned, total_volume_kg, total_duration_seconds)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        session.id,
        'local-user',
        session.date,
        session.startTime,
        session.endTime ?? null,
        session.name,
        session.workoutType,
        session.templateId ?? null,
        session.totalCaloriesBurned,
        session.totalVolumeKg,
        session.totalDurationSeconds,
      ]
    );
  }

  static async getAll(): Promise<WorkoutSession[]> {
    return WorkoutRepository.workouts;
  }
}
