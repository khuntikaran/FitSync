import { beforeEach, describe, expect, it, vi } from 'vitest';
import { submitOnboarding } from '../src/screens/onboarding/onboardingScreen';
import { useUserStore } from '../src/store/userStore';
import { loadHomeScreenData } from '../src/screens/main/homeScreen';
import { WorkoutRepository } from '../src/database/repositories/WorkoutRepository';
import { WorkoutScreenController } from '../src/screens/workout/workoutScreen';
import { NotificationService } from '../src/services/notifications/NotificationService';
import { loadHistoryScreenData } from '../src/screens/history/historyScreen';
import { loadProgressScreenData } from '../src/screens/progress/progressScreen';
import { BodyMeasurementRepository } from '../src/database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';
import { SettingsScreenController } from '../src/screens/settings/settingsScreen';
import { BackupService } from '../src/services/backup/BackupService';
import { AppSettingsRepository } from '../src/database/repositories/AppSettingsRepository';
import { useWorkoutStore } from '../src/store/workoutStore';

beforeEach(async () => {
  useUserStore.getState().clearProfile();
  useUserStore.setState({ isOnboarded: false });
  await WorkoutRepository.replaceAll([]);
  await BodyMeasurementRepository.replaceAll([]);
  await PersonalRecordRepository.replaceAll([]);
  await AppSettingsRepository.replaceAll({});
});

describe('screen controllers', () => {
  it('submits onboarding and updates user store', async () => {
    const profile = await submitOnboarding({
      age: 28,
      gender: 'male',
      heightCm: 180,
      weightKg: 82,
      activityLevel: 'moderate',
    });

    const state = useUserStore.getState();
    expect(profile.id).toContain('user-');
    expect(state.profile?.id).toBe(profile.id);
    expect(state.isOnboarded).toBe(true);
  });

  it('loads home, history and progress data from repositories/services', async () => {
    await WorkoutRepository.save({
      id: 'w1',
      date: '2026-01-10',
      startTime: '2026-01-10T10:00:00.000Z',
      endTime: '2026-01-10T11:00:00.000Z',
      name: 'Push Day',
      workoutType: 'push',
      exercises: [],
      totalCaloriesBurned: 300,
      totalVolumeKg: 1000,
      totalDurationSeconds: 3600,
    });

    await BodyMeasurementRepository.save({ id: 'm1', userId: 'u1', date: '2026-01-10', weightKg: 81 });
    await PersonalRecordRepository.save({
      id: 'pr1',
      userId: 'u1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      recordType: 'weight',
      value: 100,
      date: '2026-01-10',
      workoutId: 'w1',
      isActive: true,
    });

    const home = await loadHomeScreenData(new Date('2026-01-10T08:00:00.000Z'));
    const history = await loadHistoryScreenData();
    const progress = await loadProgressScreenData('all');

    expect(home.totalWorkouts).toBe(1);
    expect(home.latestWorkoutName).toBe('Push Day');
    expect(history.total).toBe(1);
    expect(progress.weightTrend).toHaveLength(1);
    expect(progress.activeRecords).toBe(1);
  });

  it('controls workout lifecycle and settings backup actions', async () => {
    const scheduled: number[] = [];
    NotificationService.setAdapter({
      schedule: async () => {
        scheduled.push(1);
      },
      cancelAll: async () => undefined,
    });

    WorkoutScreenController.startWorkout();
    const exercise = (await WorkoutScreenController.listExercises())[0];
    WorkoutScreenController.addExercise(exercise);

    const workoutState = useWorkoutStore.getState();
    const firstWorkoutExercise = workoutState.activeWorkout?.exercises[0];
    expect(firstWorkoutExercise).toBeTruthy();

    workoutState.addSet(firstWorkoutExercise!.id, { reps: 8, weightKg: 60, completed: false });
    const setId = useWorkoutStore.getState().activeWorkout!.exercises[0].sets[0].id;

    await WorkoutScreenController.completeSetAndStartRest(firstWorkoutExercise!.id, setId, 30);
    await WorkoutScreenController.finishWorkout();

    expect(scheduled).toHaveLength(1);
    expect(useWorkoutStore.getState().activeWorkout).toBeNull();

    const fakeFs = {
      getDocumentDirectoryPath: () => '/tmp',
      writeFile: vi.fn().mockResolvedValue(undefined),
      readFile: vi
        .fn()
        .mockResolvedValue(
          JSON.stringify({
            version: '1.0',
            exportDate: new Date().toISOString(),
            user: null,
            workouts: [],
            measurements: [],
            records: [],
            appSettings: {},
          })
        ),
      share: vi.fn().mockResolvedValue(undefined),
    };
    BackupService.setFileAdapter(fakeFs);

    await expect(SettingsScreenController.updatePreferences({ theme: 'dark' })).resolves.toMatchObject({
      theme: 'dark',
    });
    await expect(SettingsScreenController.exportBackupToFile()).resolves.toContain('/tmp/fitsync_backup_');
    await expect(SettingsScreenController.importBackupFromFile('/tmp/backup.json')).resolves.toBe(true);
  });
});

