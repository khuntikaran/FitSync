import React, { useEffect, useMemo, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { buildProgressScreenView } from './progressScreenView';
import { ScreenFrame } from '../../components/common/VisualComponents';

const width = Dimensions.get('window').width - 24;

function buildChartConfig() {
  return {
    backgroundColor: '#1E1E1E',
    backgroundGradientFrom: '#1E1E1E',
    backgroundGradientTo: '#1E1E1E',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  };
}

export function ProgressVisualScreen() {
  const [volumeSeries, setVolumeSeries] = useState<number[]>([]);
  const [weightSeries, setWeightSeries] = useState<number[]>([]);

  useEffect(() => {
    buildProgressScreenView('month').then((view) => {
      const volumePoints = (view.sections.find((s) => s.title === 'Volume Trend')?.items as Array<{ y: number }> | undefined) ?? [];
      const weightPoints = (view.sections.find((s) => s.title === 'Weight Trend')?.items as Array<{ y: number }> | undefined) ?? [];
      setVolumeSeries(volumePoints.map((p) => p.y));
      setWeightSeries(weightPoints.map((p) => p.y));
    });
  }, []);

  const hasData = useMemo(() => volumeSeries.length > 0 || weightSeries.length > 0, [volumeSeries.length, weightSeries.length]);

  return (
    <ScreenFrame title="Progress Charts">
      {!hasData ? (
        <Text>No chart data yet.</Text>
      ) : (
        <>
          <Text>Volume Trend</Text>
          <LineChart
            data={{ labels: volumeSeries.map((_, i) => `${i + 1}`), datasets: [{ data: volumeSeries.length ? volumeSeries : [0] }] }}
            width={width}
            height={220}
            chartConfig={buildChartConfig()}
          />
          <Text>Weight Trend</Text>
          <LineChart
            data={{ labels: weightSeries.map((_, i) => `${i + 1}`), datasets: [{ data: weightSeries.length ? weightSeries : [0] }] }}
            width={width}
            height={220}
            chartConfig={buildChartConfig()}
          />
        </>
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
