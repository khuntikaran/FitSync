import { UserProfile } from '../../types';
import { DatabaseService } from '../connection';

export class UserRepository {
  private static currentProfile: UserProfile | null = null;

  static async save(profile: UserProfile): Promise<void> {
    UserRepository.currentProfile = profile;

    await DatabaseService.execute(
      `INSERT OR REPLACE INTO users (id, age, gender, height_cm, weight_kg, activity_level, bmr, tdee, unit_system)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        profile.id,
        profile.age,
        profile.gender,
        profile.heightCm,
        profile.weightKg,
        profile.activityLevel,
        profile.bmr,
        profile.tdee,
        profile.unitSystem,
      ]
    );
  }

  static async get(): Promise<UserProfile | null> {
    return UserRepository.currentProfile;
  }

  static async clear(): Promise<void> {
    UserRepository.currentProfile = null;
    await DatabaseService.execute('DELETE FROM users;');
  }
}
