import { PersonalRecord } from '../../types';
import { DatabaseService } from '../connection';

export class PersonalRecordRepository {
  private static records: PersonalRecord[] = [];

  static async save(record: PersonalRecord): Promise<void> {
    const existingIndex = PersonalRecordRepository.records.findIndex((item) => item.id === record.id);
    if (existingIndex >= 0) PersonalRecordRepository.records[existingIndex] = record;
    else PersonalRecordRepository.records.push(record);

    await DatabaseService.execute(
      `INSERT OR REPLACE INTO personal_records
      (id, user_id, exercise_id, exercise_name, record_type, value, previous_value, date, workout_id, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        record.id,
        record.userId,
        record.exerciseId,
        record.exerciseName,
        record.recordType,
        record.value,
        record.previousValue ?? null,
        record.date,
        record.workoutId,
        record.isActive ? 1 : 0,
      ]
    );
  }

  static async getAll(): Promise<PersonalRecord[]> {
    return PersonalRecordRepository.records;
  }

  static async getActiveByExercise(exerciseId: string): Promise<PersonalRecord | null> {
    const active = PersonalRecordRepository.records
      .filter((record) => record.exerciseId === exerciseId && record.isActive)
      .sort((a, b) => b.date.localeCompare(a.date))[0];

    return active ?? null;
  }

  static async replaceAll(records: PersonalRecord[]): Promise<void> {
    PersonalRecordRepository.records = [...records];
    await DatabaseService.execute('DELETE FROM personal_records;');
    for (const record of records) {
      await PersonalRecordRepository.save(record);
    }
  }
}
