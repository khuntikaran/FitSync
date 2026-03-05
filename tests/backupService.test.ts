import { describe, expect, it } from 'vitest';
import { AppConfig } from '../src/constants/config';
import { BackupService } from '../src/services/backup/BackupService';

function buildValidPayload() {
  return {
    version: AppConfig.backupVersion,
    exportDate: new Date().toISOString(),
    user: null,
    workouts: [],
    measurements: [],
    records: [],
    appSettings: {},
  };
}

describe('BackupService.validateImportPayload', () => {
  it('accepts current payload with appSettings', () => {
    expect(BackupService.validateImportPayload(buildValidPayload())).toBe(true);
  });

  it('accepts legacy payload without appSettings', () => {
    const payload = buildValidPayload();
    const { appSettings: _removed, ...legacyPayload } = payload;
    expect(BackupService.validateImportPayload(legacyPayload)).toBe(true);
  });

  it('rejects invalid exportDate', () => {
    const payload = buildValidPayload();
    payload.exportDate = 'not-a-date';
    expect(BackupService.validateImportPayload(payload)).toBe(false);
  });

  it('rejects arrays containing non-object entries', () => {
    const payload = buildValidPayload();
    payload.workouts = [123 as never];
    expect(BackupService.validateImportPayload(payload)).toBe(false);
  });

  it('rejects malformed appSettings values', () => {
    const payload = buildValidPayload();
    payload.appSettings = { theme: 42 as never };
    expect(BackupService.validateImportPayload(payload)).toBe(false);
  });
});
