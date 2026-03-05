import { BodyMeasurementRepository } from '../../database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../../database/repositories/PersonalRecordRepository';
import { AppSettingsRepository } from '../../database/repositories/AppSettingsRepository';
import { UserRepository } from '../../database/repositories/UserRepository';
import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { AppConfig } from '../../constants/config';
import { BackupFileAdapter } from './adapters/reactNativeFileShareAdapter';

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


function isArrayOfObjects(value: unknown): value is Record<string, unknown>[] {
  return (
    Array.isArray(value) &&
    value.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))
  );
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

class NoopBackupFileAdapter implements BackupFileAdapter {
  getDocumentDirectoryPath(): string {
    throw new Error('Backup file adapter is not configured.');
  }

  async writeFile(_path: string, _content: string, _encoding: 'utf8'): Promise<void> {
    throw new Error('Backup file adapter is not configured.');
  }

  async readFile(_path: string, _encoding: 'utf8'): Promise<string> {
    throw new Error('Backup file adapter is not configured.');
  }

  async share(_payload: { url: string; type: string; filename: string }): Promise<void> {
    throw new Error('Backup file adapter is not configured.');
  }
}

export class BackupService {
  private static fileAdapter: BackupFileAdapter = new NoopBackupFileAdapter();

  static setFileAdapter(adapter: BackupFileAdapter): void {
    BackupService.fileAdapter = adapter;
  }

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
      isArrayOfObjects(candidate.workouts) &&
      isArrayOfObjects(candidate.measurements) &&
      isArrayOfObjects(candidate.records) &&
      isNullableObject(candidate.user) &&
      hasValidAppSettings
    );
  }

  static async importData(payload: unknown): Promise<boolean> {
    if (!BackupService.validateImportPayload(payload)) {
      throw new Error('Invalid backup payload');
    }

    const data = normalizeImportPayload(payload);

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


  static async exportToFile(): Promise<string> {
    const data = await BackupService.exportData();
    const backupFilePath = `${BackupService.fileAdapter.getDocumentDirectoryPath()}/fitsync_backup_${Date.now()}.json`;

    await BackupService.fileAdapter.writeFile(backupFilePath, JSON.stringify(data, null, 2), 'utf8');
    await BackupService.fileAdapter.share({
      url: `file://${backupFilePath}` ,
      type: 'application/json',
      filename: 'fitsync_backup',
    });

    return backupFilePath;
  }

  static async importFromFile(filePath: string): Promise<boolean> {
    const content = await BackupService.fileAdapter.readFile(filePath, 'utf8');
    const payload = JSON.parse(content) as unknown;
    return BackupService.importData(payload);
  }
}
