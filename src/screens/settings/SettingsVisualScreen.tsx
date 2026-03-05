import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { ScreenFrame, PrimaryAction } from '../../components/common/VisualComponents';
import { SettingsScreenController } from './settingsScreen';

export function SettingsVisualScreen() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    SettingsScreenController.loadPreferences().then((p) => setTheme(p.theme));
  }, []);

  return (
    <ScreenFrame title="Settings">
      <Text>Theme: {theme}</Text>
      <PrimaryAction
        label="Set Dark Theme"
        onPress={async () => {
          const updated = await SettingsScreenController.updatePreferences({ theme: 'dark' });
          setTheme(updated.theme);
        }}
      />
    </ScreenFrame>
  );
}
