import React, { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { ScreenFrame, PrimaryAction } from '../../components/common/VisualComponents';
import { SettingsScreenController } from './settingsScreen';

export function SettingsVisualScreen() {
  const [theme, setTheme] = useState('system');
  const [importPath, setImportPath] = useState('/tmp/fitsync_backup.json');
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    SettingsScreenController.loadPreferences().then((p) => setTheme(p.theme));
  }, []);

  return (
    <ScreenFrame title="Settings & Backup">
    <ScreenFrame title="Settings">
      <Text>Theme: {theme}</Text>
      <PrimaryAction
        label="Set Dark Theme"
        onPress={async () => {
          const updated = await SettingsScreenController.updatePreferences({ theme: 'dark' });
          setTheme(updated.theme);
        }}
      />
      <PrimaryAction
        label="Export Backup"
        onPress={async () => {
          try {
            const file = await SettingsScreenController.exportBackupToFile();
            setStatus(`Exported: ${file}`);
          } catch (error) {
            setStatus((error as Error).message);
          }
        }}
      />
      <TextInput mode="outlined" label="Import path" value={importPath} onChangeText={setImportPath} />
      <PrimaryAction
        label="Import Backup"
        onPress={async () => {
          try {
            await SettingsScreenController.importBackupFromFile(importPath);
            setStatus('Import completed');
          } catch (error) {
            setStatus((error as Error).message);
          }
        }}
      />
      <Text>{status}</Text>
    </ScreenFrame>
  );
}
