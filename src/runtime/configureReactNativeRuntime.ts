import { AppConfig } from '../constants/config';
import { ReactNativeSQLiteAdapter } from '../database/adapters/reactNativeSQLiteAdapter';
import { DatabaseService } from '../database/connection';
import { BackupService } from '../services/backup/BackupService';
import { ReactNativeFileShareAdapter } from '../services/backup/adapters/reactNativeFileShareAdapter';
import { ReactNativePushNotificationAdapter } from '../services/notifications/adapters/reactNativePushNotificationAdapter';
import { NotificationService } from '../services/notifications/NotificationService';

interface RuntimeModuleMap {
  sqlite?: unknown;
  pushNotification?: unknown;
  fileSystem?: unknown;
  share?: unknown;
}

export function configureReactNativeRuntimeAdapters(modules: RuntimeModuleMap): void {
  if (modules.sqlite) {
    DatabaseService.setAdapter(ReactNativeSQLiteAdapter.createFromModule(modules.sqlite as never, AppConfig.databaseName));
  }

  if (modules.pushNotification) {
    NotificationService.setAdapter(
      new ReactNativePushNotificationAdapter(modules.pushNotification as never)
    );
  }

  if (modules.fileSystem && modules.share) {
    BackupService.setFileAdapter(new ReactNativeFileShareAdapter(modules.fileSystem as never, modules.share as never));
  }
}
