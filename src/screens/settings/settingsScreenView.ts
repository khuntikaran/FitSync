import { ScreenScaffold } from '../../components/layout/screenScaffold';
import { SettingsScreenController } from './settingsScreen';

export async function buildSettingsScreenView(): Promise<ScreenScaffold> {
  const preferences = await SettingsScreenController.loadPreferences();

  return {
    title: 'Settings',
    description: 'Manage app preferences and backup tools.',
    sections: [
      {
        title: 'Preferences',
        items: [preferences],
      },
      {
        title: 'Backup',
        items: [
          { action: 'Export Backup', key: 'settings.backup.export' },
          { action: 'Import Backup', key: 'settings.backup.import' },
        ],
      },
    ],
  };
}
