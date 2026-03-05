import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { buildHomeScreenView } from './homeScreenView';
import { ScreenFrame, StatCard } from '../../components/common/VisualComponents';

export function HomeVisualScreen() {
  const [cards, setCards] = useState<Array<{label:string;value:string}>>([]);

  useEffect(() => {
    buildHomeScreenView().then((view) => {
      const statCards = (view.sections[0]?.items as Array<{label:string;value:string}> | undefined) ?? [];
      setCards(statCards);
    });
  }, []);

  return (
    <ScreenFrame title="Home">
      {cards.length === 0 ? <Text>No stats yet.</Text> : cards.map((card) => (
        <StatCard key={card.label} label={card.label} value={card.value} />
      ))}
    </ScreenFrame>
  );
}
