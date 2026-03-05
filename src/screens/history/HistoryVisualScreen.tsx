import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { buildHistoryScreenView } from './historyScreenView';
import { ScreenFrame } from '../../components/common/VisualComponents';

export function HistoryVisualScreen() {
  const [summary, setSummary] = useState('Loading...');

  useEffect(() => {
    buildHistoryScreenView().then((view) => setSummary(view.description ?? 'No history'));
  }, []);

  return (
    <ScreenFrame title="History">
      <Text>{summary}</Text>
    </ScreenFrame>
  );
}
