import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { buildHistoryScreenView } from './historyScreenView';
import { ScreenFrame, StatCard } from '../../components/common/VisualComponents';

type WorkoutHistoryItem = { id: string; name: string; date: string; totalVolumeKg: number };

export function HistoryVisualScreen() {
  const [summary, setSummary] = useState('Loading...');
  const [items, setItems] = useState<WorkoutHistoryItem[]>([]);

  useEffect(() => {
    buildHistoryScreenView().then((view) => {
      setSummary(view.description ?? 'No history');
      setItems((view.sections[0]?.items as WorkoutHistoryItem[] | undefined) ?? []);
    });
import { ScreenFrame } from '../../components/common/VisualComponents';

export function HistoryVisualScreen() {
  const [summary, setSummary] = useState('Loading...');

  useEffect(() => {
    buildHistoryScreenView().then((view) => setSummary(view.description ?? 'No history'));
  }, []);

  return (
    <ScreenFrame title="History">
      <Text>{summary}</Text>
      {items.slice(0, 10).map((item) => (
        <StatCard key={item.id} label={`${item.date} • ${item.name}`} value={`${item.totalVolumeKg} kg`} />
      ))}
    </ScreenFrame>
  );
}
