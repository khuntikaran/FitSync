import { BodyMeasurementRepository } from '../../database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../../database/repositories/PersonalRecordRepository';
import { UserRepository } from '../../database/repositories/UserRepository';
import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';

export interface ExportData {
  version: '1.0';
  exportDate: string;
  user: Awaited<ReturnType<typeof UserRepository.get>>;
  workouts: Awaited<ReturnType<typeof WorkoutRepository.getAll>>;
  measurements: Awaited<ReturnType<typeof BodyMeasurementRepository.getAll>>;
  records: Awaited<ReturnType<typeof PersonalRecordRepository.getAll>>;
}

export class BackupService {
  static async exportData(): Promise<ExportData> {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      user: await UserRepository.get(),
      workouts: await WorkoutRepository.getAll(),
      measurements: await BodyMeasurementRepository.getAll(),
      records: await PersonalRecordRepository.getAll(),
    };
  }

  static validateImportPayload(payload: unknown): payload is ExportData {
    if (!payload || typeof payload !== 'object') return false;

    const candidate = payload as Partial<ExportData>;
    return (
      candidate.version === '1.0' &&
      typeof candidate.exportDate === 'string' &&
      Array.isArray(candidate.workouts) &&
      Array.isArray(candidate.measurements) &&
      Array.isArray(candidate.records)
    );
  }

  static async importData(payload: unknown): Promise<boolean> {
    if (!BackupService.validateImportPayload(payload)) {
      throw new Error('Invalid backup payload');
    }

    const data = payload;

    if (data.user) {
      await UserRepository.save(data.user);
    } else {
      await UserRepository.clear();
    }

    await WorkoutRepository.replaceAll(data.workouts);
    await BodyMeasurementRepository.replaceAll(data.measurements);
    await PersonalRecordRepository.replaceAll(data.records);

    return true;
    return candidate.version === '1.0' && typeof candidate.exportDate === 'string';
  }
}
