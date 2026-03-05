import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { buildProgressScreenView } from './progressScreenView';
import { ScreenFrame } from '../../components/common/VisualComponents';

export function ProgressVisualScreen() {
  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    buildProgressScreenView('month').then((view) => {
      const points = (view.sections.find((s) => s.title === 'Volume Trend')?.items as Array<{y:number}> | undefined) ?? [];
      setSeries(points.map((p) => p.y));
    });
  }, []);

  return (
    <ScreenFrame title="Progress">
      {series.length === 0 ? (
        <Text>No chart data yet.</Text>
      ) : (
        <LineChart
          data={{ labels: series.map((_, i) => `${i + 1}`), datasets: [{ data: series }] }}
          width={Dimensions.get('window').width - 24}
          height={220}
          chartConfig={{
            backgroundColor: '#1E1E1E',
            backgroundGradientFrom: '#1E1E1E',
            backgroundGradientTo: '#1E1E1E',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          }}
        />
      )}
    </ScreenFrame>
  );
}
