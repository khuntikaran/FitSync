import { CalorieCalculator } from '../calculations/CalorieCalculator';
import { UserRepository } from '../../database/repositories/UserRepository';
import { ActivityLevel, Gender, UserProfile } from '../../types';
import { createId } from '../../utils/id';
import { AppConfig } from '../../constants/config';
import { assertInRange, assertPositive } from '../../utils/validation';

interface OnboardingInput {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  unitSystem?: 'metric' | 'imperial';
}

function validateOnboardingInput(input: OnboardingInput): void {
  assertInRange(input.age, 'Age', 13, 100);
  assertPositive(input.heightCm, 'Height');
  assertPositive(input.weightKg, 'Weight');

  if (input.heightCm > 300) {
    throw new Error('Height must be a positive number under 300 cm.');
  }

  if (input.weightKg > 500) {
    throw new Error('Weight must be a positive number under 500 kg.');
  }
}

export class OnboardingService {
  static buildProfile(input: OnboardingInput): UserProfile {
    validateOnboardingInput(input);

    const bmr = CalorieCalculator.calculateBMR(
      input.weightKg,
      input.heightCm,
      input.age,
      input.gender
    );

    const tdee = CalorieCalculator.calculateTDEE(bmr, input.activityLevel);

    return {
      id: createId('user'),
      age: input.age,
      gender: input.gender,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      activityLevel: input.activityLevel,
      bmr,
      tdee,
      unitSystem: input.unitSystem ?? AppConfig.unitSystem.default,
    };
  }

  static async complete(input: OnboardingInput): Promise<UserProfile> {
    const profile = OnboardingService.buildProfile(input);
    await UserRepository.save(profile);
    return profile;
  }
}

export type { OnboardingInput };
