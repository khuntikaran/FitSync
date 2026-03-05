import { ScreenScaffold } from '../../components/layout/screenScaffold';
import { ProgressPeriod } from '../../services/progress/ProgressService';
import { loadProgressChartData, loadProgressScreenData } from './progressScreen';

export async function buildProgressScreenView(period: ProgressPeriod): Promise<ScreenScaffold> {
  const [summary, charts] = await Promise.all([
    loadProgressScreenData(period),
    loadProgressChartData(period),
  ]);

  return {
    title: 'Progress',
    description: `${summary.volume.workouts} workout(s), ${summary.activeRecords} active record(s)`,
    sections: [
      { title: 'Weight Trend', items: charts.weightLine },
      { title: 'Volume Trend', items: charts.volumeLine },
      { title: 'Muscle Group Volume', items: charts.muscleGroupBar },
      { title: 'Workout Frequency', items: charts.workoutFrequencyBar },
      { title: 'Record Timeline', items: charts.recordTimelineLine },
    ],
  };
}
