import { beforeEach, describe, expect, it } from 'vitest';
import { buildHomeScreenView } from '../src/screens/main/homeScreenView';
import { buildOnboardingScreenView } from '../src/screens/onboarding/onboardingScreenView';
import { buildWorkoutScreenView } from '../src/screens/workout/workoutScreenView';
import { buildHistoryScreenView } from '../src/screens/history/historyScreenView';
import { buildProgressScreenView } from '../src/screens/progress/progressScreenView';
import { buildSettingsScreenView } from '../src/screens/settings/settingsScreenView';
import { WorkoutRepository } from '../src/database/repositories/WorkoutRepository';
import { BodyMeasurementRepository } from '../src/database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';
import { AppSettingsRepository } from '../src/database/repositories/AppSettingsRepository';
import { useWorkoutStore } from '../src/store/workoutStore';

beforeEach(async () => {
  await WorkoutRepository.replaceAll([]);
  await BodyMeasurementRepository.replaceAll([]);
  await PersonalRecordRepository.replaceAll([]);
  await AppSettingsRepository.replaceAll({});
  useWorkoutStore.getState().cancelWorkout();
});

describe('screen visual view models', () => {
  it('builds onboarding + home + settings views', async () => {
    const onboarding = buildOnboardingScreenView(0, {
      age: 30,
      gender: 'male',
      heightCm: 180,
      weightKg: 82,
      activityLevel: 'moderate',
    });
    const home = await buildHomeScreenView();
    const settings = await buildSettingsScreenView();

    expect(onboarding.title).toBe('Onboarding');
    expect(home.title.length).toBeGreaterThan(0);
    expect(settings.sections[0].title).toBe('Preferences');
  });

  it('builds workout + history + progress views from repository data', async () => {
    await WorkoutRepository.save({
      id: 'w1',
      date: '2026-03-02',
      startTime: '2026-03-02T10:00:00.000Z',
      endTime: '2026-03-02T11:00:00.000Z',
      name: 'Push',
      workoutType: 'push',
      exercises: [
        { id: 'we1', exerciseId: 'barbell_bench_press', exerciseName: 'Barbell Bench Press', sets: [], restTimeSeconds: 90, orderIndex: 0 },
      ],
      totalCaloriesBurned: 300,
      totalVolumeKg: 1200,
      totalDurationSeconds: 3600,
    });

    const workout = await buildWorkoutScreenView('bench');
    const history = await buildHistoryScreenView();
    const progress = await buildProgressScreenView('all');

    expect(workout.sections[1].items.length).toBeGreaterThan(0);
    expect(history.description).toContain('1 session');
    expect(progress.sections.length).toBeGreaterThanOrEqual(5);
  });
});
