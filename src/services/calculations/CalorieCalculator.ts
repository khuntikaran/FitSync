import { ActivityLevel, Gender } from '../../types';

export class CalorieCalculator {
  static calculateBMR(
    weightKg: number,
    heightCm: number,
    age: number,
    gender: Gender
  ): number {
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;

    if (gender === 'male') bmr += 5;
    else if (gender === 'female') bmr -= 161;
    else bmr -= 78;

    return Math.round(bmr);
  }

  static calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const multipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    return Math.round(bmr * multipliers[activityLevel]);
  }

  static calculateExerciseCalories(
    metValue: number,
    bodyWeightKg: number,
    sets: Array<{ reps: number; weightKg: number; completed: boolean }>,
    intensity: 'light' | 'moderate' | 'vigorous' = 'moderate',
    restTimeSeconds = 90
  ): number {
    const totalReps = sets.reduce(
      (sum, set) => (set.completed ? sum + set.reps : sum),
      0
    );
    const activeTimeHours = (totalReps * 3) / 3600;

    const totalVolume = sets.reduce(
      (sum, set) => (set.completed ? sum + set.weightKg * set.reps : sum),
      0
    );

    const volumeFactor = Math.min(totalVolume / (bodyWeightKg * 10), 2.0);
    const intensityMultipliers = { light: 0.8, moderate: 1.0, vigorous: 1.2 };

    const adjustedMET =
      metValue * intensityMultipliers[intensity] * (1 + volumeFactor * 0.1);

    const baseCalories = adjustedMET * bodyWeightKg * activeTimeHours;

    const epocMultiplier =
      intensity === 'vigorous' ? 1.15 : intensity === 'moderate' ? 1.08 : 1;

    const completedSets = sets.filter((s) => s.completed).length;
    const restTimeHours = (Math.max(completedSets - 1, 0) * restTimeSeconds) / 3600;
    const restCalories = 1.5 * bodyWeightKg * restTimeHours;

    return Math.round(baseCalories * epocMultiplier + restCalories);
  }

  static calculateOneRepMax(weightKg: number, reps: number): number | null {
    if (reps === 1) return weightKg;
    if (reps === 0 || weightKg === 0 || reps > 12) return null;

    const epley = weightKg * (1 + reps / 30);
    const brzycki = weightKg * (36 / (37 - reps));
    const lombardi = weightKg * Math.pow(reps, 0.1);

    return Math.round(((epley + brzycki + lombardi) / 3) * 10) / 10;
  }

  static calculateVolume(
    sets: Array<{ weightKg: number; reps: number; completed: boolean }>
  ): number {
    return sets.reduce(
      (total, set) => (set.completed ? total + set.weightKg * set.reps : total),
      0
    );
  }

  static calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }

  static suggestProgression(
    currentWeight: number,
    targetReps: number,
    actualReps: number,
    rpe?: number
  ): { suggestion: 'increase' | 'maintain' | 'deload'; newWeight?: number } {
    if (actualReps >= targetReps + 2 && (!rpe || rpe <= 8)) {
      const increase = currentWeight * 0.025;
      return {
        suggestion: 'increase',
        newWeight: Math.round((currentWeight + increase) / 0.5) * 0.5,
      };
    }

    if (actualReps >= targetReps) return { suggestion: 'maintain' };

    return { suggestion: 'deload', newWeight: Math.round(currentWeight * 0.9 * 10) / 10 };
  }
}
