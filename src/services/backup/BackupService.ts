import { BodyMeasurementRepository } from '../../database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../../database/repositories/PersonalRecordRepository';
import { AppSettingsRepository } from '../../database/repositories/AppSettingsRepository';
import { UserRepository } from '../../database/repositories/UserRepository';
import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { AppConfig } from '../../constants/config';

type BackupVersion = typeof AppConfig.backupVersion;

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value).every((item) => typeof item === 'string');
}

function isIsoDateString(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isNullableObject(value: unknown): value is Record<string, unknown> | null {
  return value === null || (typeof value === 'object' && !Array.isArray(value));
}

export interface ExportData {
  version: BackupVersion;
  exportDate: string;
  user: Awaited<ReturnType<typeof UserRepository.get>>;
  workouts: Awaited<ReturnType<typeof WorkoutRepository.getAll>>;
  measurements: Awaited<ReturnType<typeof BodyMeasurementRepository.getAll>>;
  records: Awaited<ReturnType<typeof PersonalRecordRepository.getAll>>;
  appSettings: Awaited<ReturnType<typeof AppSettingsRepository.getAll>>;
}

type ImportData = Omit<ExportData, 'appSettings'> & {
  appSettings?: Awaited<ReturnType<typeof AppSettingsRepository.getAll>>;
};

function normalizeImportPayload(payload: ImportData): ExportData {
  return {
    ...payload,
    appSettings: payload.appSettings ?? {},
  };
}

export class BackupService {
  static async exportData(): Promise<ExportData> {
    return {
      version: AppConfig.backupVersion,
      exportDate: new Date().toISOString(),
      user: await UserRepository.get(),
      workouts: await WorkoutRepository.getAll(),
      measurements: await BodyMeasurementRepository.getAll(),
      records: await PersonalRecordRepository.getAll(),
      appSettings: await AppSettingsRepository.getAll(),
    };
  }

  static validateImportPayload(payload: unknown): payload is ImportData {
    if (!payload || typeof payload !== 'object') return false;

    const candidate = payload as Partial<ImportData>;
    const hasValidAppSettings =
      typeof candidate.appSettings === 'undefined' || isStringRecord(candidate.appSettings);

    return (
      candidate.version === AppConfig.backupVersion &&
      isIsoDateString(candidate.exportDate) &&
      Array.isArray(candidate.workouts) &&
      Array.isArray(candidate.measurements) &&
      Array.isArray(candidate.records) &&
      isNullableObject(candidate.user) &&
      hasValidAppSettings
    );
  }

  static async importData(payload: unknown): Promise<boolean> {
    if (!BackupService.validateImportPayload(payload)) {
      throw new Error('Invalid backup payload');
    }

    const data = normalizeImportPayload(payload as ImportData);

    if (data.user) {
      await UserRepository.save(data.user);
    } else {
      await UserRepository.clear();
    }

    await WorkoutRepository.replaceAll(data.workouts);
    await BodyMeasurementRepository.replaceAll(data.measurements);
    await PersonalRecordRepository.replaceAll(data.records);
    await AppSettingsRepository.replaceAll(data.appSettings);

    return true;
  }
}
