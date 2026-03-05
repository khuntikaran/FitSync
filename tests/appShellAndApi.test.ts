import { beforeEach, describe, expect, it } from 'vitest';
import { LocalAppApi } from '../src/api/localAppApi';
import { useAppShellController } from '../src/hooks/useAppShell';
import { MAIN_TAB_ROUTES } from '../src/navigation/routes';
import { WorkoutRepository } from '../src/database/repositories/WorkoutRepository';
import { BodyMeasurementRepository } from '../src/database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';

beforeEach(async () => {
  await WorkoutRepository.replaceAll([]);
  await BodyMeasurementRepository.replaceAll([]);
  await PersonalRecordRepository.replaceAll([]);
});

describe('LocalAppApi facade', () => {
  it('provides screen view models and form actions', async () => {
    const onboarding = LocalAppApi.getOnboardingView(0, {
      age: 30,
      gender: 'male',
      heightCm: 180,
      weightKg: 80,
      activityLevel: 'moderate',
    });

    const home = await LocalAppApi.getHomeView();

    const measurement = await LocalAppApi.submitMeasurement({
      userId: 'u1',
      date: '2026-03-10',
      weightKg: 80,
    });

    expect(onboarding.title).toBe('Onboarding');
    expect(home.title.length).toBeGreaterThan(0);
    expect(measurement.userId).toBe('u1');
  });
});

describe('useAppShellController', () => {
  it('transitions between onboarding and tab routes and renders active screen', async () => {
    const controller = useAppShellController();

    const onboardingView = await controller.render();
    expect((onboardingView as { title: string }).title).toBe('Onboarding');

    controller.goToMainTabs();
    controller.setActiveTab(MAIN_TAB_ROUTES.PROGRESS);

    const progressView = await controller.render();
    expect((progressView as { title: string }).title).toBe('Progress');
  });
});
