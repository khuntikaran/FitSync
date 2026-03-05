import { beforeEach, describe, expect, it } from 'vitest';
import { OnboardingService } from '../src/services/onboarding/OnboardingService';
import { UserRepository } from '../src/database/repositories/UserRepository';

describe('OnboardingService', () => {
  beforeEach(async () => {
    await UserRepository.clear();
  });

  it('builds a profile with default metric unit system', () => {
    const profile = OnboardingService.buildProfile({
      age: 30,
      gender: 'male',
      heightCm: 180,
      weightKg: 80,
      activityLevel: 'moderate',
    });

    expect(profile.id.startsWith('user-')).toBe(true);
    expect(profile.unitSystem).toBe('metric');
    expect(profile.bmr).toBeGreaterThan(0);
    expect(profile.tdee).toBeGreaterThan(profile.bmr);
  });

  it('throws when height exceeds upper bound', () => {
    expect(() =>
      OnboardingService.buildProfile({
        age: 30,
        gender: 'female',
        heightCm: 301,
        weightKg: 70,
        activityLevel: 'light',
      })
    ).toThrow('Height must be a positive number under 300 cm.');
  });

  it('persists profile on complete', async () => {
    const created = await OnboardingService.complete({
      age: 26,
      gender: 'other',
      heightCm: 170,
      weightKg: 65,
      activityLevel: 'active',
      unitSystem: 'imperial',
    });

    const persisted = await UserRepository.get();
    expect(persisted).not.toBeNull();
    expect(persisted?.id).toBe(created.id);
    expect(persisted?.unitSystem).toBe('imperial');
  });
});
