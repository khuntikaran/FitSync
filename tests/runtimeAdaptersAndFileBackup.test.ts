import { describe, expect, it, vi } from 'vitest';
import { DatabaseService } from '../src/database/connection';
import { ReactNativeSQLiteAdapter } from '../src/database/adapters/reactNativeSQLiteAdapter';
import { ReactNativePushNotificationAdapter } from '../src/services/notifications/adapters/reactNativePushNotificationAdapter';
import { NotificationService } from '../src/services/notifications/NotificationService';
import { BackupService } from '../src/services/backup/BackupService';
import { ReactNativeFileShareAdapter } from '../src/services/backup/adapters/reactNativeFileShareAdapter';
import { configureReactNativeRuntimeAdapters } from '../src/runtime/configureReactNativeRuntime';

class MockSQLiteTx {
  executeSql = vi.fn((sql: string, _params: unknown[], success: (tx: unknown, result: unknown) => void) => {
    success(this, {
      rows: {
        length: 1,
        item: () => ({ sql }),
      },
    });
  });
}

describe('ReactNativeSQLiteAdapter', () => {
  it('executes SQL against provided transaction bridge', async () => {
    const tx = new MockSQLiteTx();
    const module = {
      openDatabase: vi.fn(() => ({
        transaction: (callback: (transaction: MockSQLiteTx) => void) => callback(tx),
      })),
    };

    const adapter = ReactNativeSQLiteAdapter.createFromModule(module, 'FitTrackPro.db');
    const result = await adapter.executeSql('SELECT 1;');

    expect(module.openDatabase).toHaveBeenCalledWith({ name: 'FitTrackPro.db', location: 'default' });
    expect(result.rows.length).toBe(1);
    expect(result.rows.item(0)).toEqual({ sql: 'SELECT 1;' });
  });
});

describe('ReactNativePushNotificationAdapter', () => {
  it('schedules and cancels local notifications through module bridge', async () => {
    const pushModule = {
      localNotificationSchedule: vi.fn(),
      cancelAllLocalNotifications: vi.fn(),
    };

    NotificationService.setAdapter(new ReactNativePushNotificationAdapter(pushModule));

    await NotificationService.scheduleRestTimer(1);
    await NotificationService.cancelAll();

    expect(pushModule.localNotificationSchedule).toHaveBeenCalledTimes(1);
    expect(pushModule.cancelAllLocalNotifications).toHaveBeenCalledTimes(1);
  });
});

describe('BackupService file adapter integration', () => {
  it('exports to file and imports from file via adapter', async () => {
    const fsModule = {
      DocumentDirectoryPath: '/docs',
      writeFile: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          version: '1.0',
          exportDate: new Date().toISOString(),
          user: null,
          workouts: [],
          measurements: [],
          records: [],
          appSettings: {},
        })
      ),
    };

    const shareModule = {
      open: vi.fn().mockResolvedValue(undefined),
    };

    BackupService.setFileAdapter(new ReactNativeFileShareAdapter(fsModule, shareModule));

    const path = await BackupService.exportToFile();
    const imported = await BackupService.importFromFile('/docs/in.json');

    expect(path).toContain('/docs/fitsync_backup_');
    expect(fsModule.writeFile).toHaveBeenCalledTimes(1);
    expect(shareModule.open).toHaveBeenCalledTimes(1);
    expect(imported).toBe(true);
  });
});

describe('configureReactNativeRuntimeAdapters', () => {
  it('wires all runtime adapters in a single entrypoint', async () => {
    const tx = new MockSQLiteTx();
    const sqlite = {
      openDatabase: () => ({
        transaction: (callback: (transaction: MockSQLiteTx) => void) => callback(tx),
      }),
    };
    const push = {
      localNotificationSchedule: vi.fn(),
      cancelAllLocalNotifications: vi.fn(),
    };
    const fsModule = {
      DocumentDirectoryPath: '/docs',
      writeFile: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          version: '1.0',
          exportDate: new Date().toISOString(),
          user: null,
          workouts: [],
          measurements: [],
          records: [],
          appSettings: {},
        })
      ),
    };
    const share = { open: vi.fn().mockResolvedValue(undefined) };

    configureReactNativeRuntimeAdapters({ sqlite, pushNotification: push, fileSystem: fsModule, share });

    await expect(DatabaseService.execute('SELECT bridge;')).resolves.toBeTruthy();
    await NotificationService.scheduleRestTimer(1);
    await BackupService.exportToFile();

    expect(push.localNotificationSchedule).toHaveBeenCalledTimes(1);
    expect(share.open).toHaveBeenCalledTimes(1);
  });
});
