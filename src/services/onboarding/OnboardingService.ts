import { CalorieCalculator } from '../calculations/CalorieCalculator';
import { UserRepository } from '../../database/repositories/UserRepository';
import { ActivityLevel, Gender, UserProfile } from '../../types';

interface OnboardingInput {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  unitSystem?: 'metric' | 'imperial';
}

const generateId = () => `user-${Date.now()}`;

function validateOnboardingInput(input: OnboardingInput): void {
  if (!Number.isFinite(input.age) || input.age < 13 || input.age > 100) {
    throw new Error('Age must be between 13 and 100.');
  }

  if (!Number.isFinite(input.heightCm) || input.heightCm <= 0) {
    throw new Error('Height must be a positive number.');
  }

  if (!Number.isFinite(input.weightKg) || input.weightKg <= 0) {
    throw new Error('Weight must be a positive number.');
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
      id: generateId(),
      age: input.age,
      gender: input.gender,
      heightCm: input.heightCm,
      weightKg: input.weightKg,
      activityLevel: input.activityLevel,
      bmr,
      tdee,
      unitSystem: input.unitSystem ?? 'metric',
    };
  }

  static async complete(input: OnboardingInput): Promise<UserProfile> {
    const profile = OnboardingService.buildProfile(input);
    await UserRepository.save(profile);
    return profile;
  }
}

export type { OnboardingInput };
