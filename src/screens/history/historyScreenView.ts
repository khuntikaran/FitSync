import { ScreenScaffold } from '../../components/layout/screenScaffold';
import { loadHistoryScreenData } from './historyScreen';

export async function buildHistoryScreenView(): Promise<ScreenScaffold> {
  const data = await loadHistoryScreenData();

  return {
    title: 'Workout History',
    description: `${data.total} session(s) logged`,
    sections: [
      {
        title: 'Sessions',
        items: data.workouts,
      },
    ],
  };
}
