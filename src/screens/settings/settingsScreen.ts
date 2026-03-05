import { BackupService } from '../../services/backup/BackupService';
import { SettingsService, UserPreferences } from '../../services/settings/SettingsService';

export class SettingsScreenController {
  static async loadPreferences(): Promise<UserPreferences> {
    return SettingsService.getPreferences();
  }

  static async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    return SettingsService.updatePreferences(updates);
  }

  static async exportBackupToFile(): Promise<string> {
    return BackupService.exportToFile();
  }

  static async importBackupFromFile(path: string): Promise<boolean> {
    return BackupService.importFromFile(path);
  }
}
