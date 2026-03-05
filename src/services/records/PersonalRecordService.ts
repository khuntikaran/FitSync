import { PersonalRecord } from '../../types';
import { PersonalRecordRepository } from '../../database/repositories/PersonalRecordRepository';
import { createId } from '../../utils/id';

interface RecordInput {
  userId: string;
  exerciseId: string;
  exerciseName: string;
  recordType: PersonalRecord['recordType'];
  value: number;
  date: string;
  workoutId: string;
}

export class PersonalRecordService {
  static async registerRecord(input: RecordInput): Promise<PersonalRecord> {
    const active = await PersonalRecordRepository.getActiveByExercise(input.exerciseId);

    if (active && input.value <= active.value) {
      return active;
    }

    if (active) {
      await PersonalRecordRepository.save({ ...active, isActive: false });
    }

    const record: PersonalRecord = {
      id: createId('pr'),
      userId: input.userId,
      exerciseId: input.exerciseId,
      exerciseName: input.exerciseName,
      recordType: input.recordType,
      value: input.value,
      previousValue: active?.value,
      date: input.date,
      workoutId: input.workoutId,
      isActive: true,
    };

    await PersonalRecordRepository.save(record);
    return record;
  }
}
