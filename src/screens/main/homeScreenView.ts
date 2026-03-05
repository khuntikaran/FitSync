import { StatCard } from '../../components/common/cards';
import { ScreenScaffold } from '../../components/layout/screenScaffold';
import { loadHomeScreenData } from './homeScreen';

export async function buildHomeScreenView(): Promise<ScreenScaffold> {
  const data = await loadHomeScreenData();
  const cards: StatCard[] = [
    { label: 'Streak', value: `${data.streakDays} days`, tone: 'success' },
    { label: 'Total Workouts', value: `${data.totalWorkouts}` },
    { label: 'Weekly Volume', value: `${data.weeklyVolumeKg} kg`, tone: 'info' },
  ];

  return {
    title: `${data.greeting}, Athlete`,
    description: data.latestWorkoutName
      ? `Latest: ${data.latestWorkoutName} on ${data.latestWorkoutDate}`
      : 'No workouts logged yet.',
    sections: [{ title: 'Today', items: cards }],
    actions: [{ label: 'Start Workout', actionKey: 'workout.start', emphasis: 'primary' }],
  };
}
