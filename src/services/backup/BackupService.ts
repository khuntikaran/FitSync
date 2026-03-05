import { UserRepository } from '../../database/repositories/UserRepository';
import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';

export interface ExportData {
  version: '1.0';
  exportDate: string;
  user: Awaited<ReturnType<typeof UserRepository.get>>;
  workouts: Awaited<ReturnType<typeof WorkoutRepository.getAll>>;
}

export class BackupService {
  static async exportData(): Promise<ExportData> {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      user: await UserRepository.get(),
      workouts: await WorkoutRepository.getAll(),
    };
  }

  static validateImportPayload(payload: unknown): payload is ExportData {
    if (!payload || typeof payload !== 'object') return false;

    const candidate = payload as Partial<ExportData>;
    return candidate.version === '1.0' && typeof candidate.exportDate === 'string';
  }
}
