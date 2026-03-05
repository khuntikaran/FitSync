import { BodyMeasurement } from '../../types';
import { DatabaseService } from '../connection';

export class BodyMeasurementRepository {
  private static measurements: BodyMeasurement[] = [];

  static async save(measurement: BodyMeasurement): Promise<void> {
    const existingIndex = BodyMeasurementRepository.measurements.findIndex(
      (item) => item.id === measurement.id
    );

    if (existingIndex >= 0) BodyMeasurementRepository.measurements[existingIndex] = measurement;
    else BodyMeasurementRepository.measurements.push(measurement);

    await DatabaseService.execute(
      `INSERT OR REPLACE INTO body_measurements
      (id, user_id, date, weight_kg, body_fat_percentage, chest_cm, waist_cm, hips_cm, arms_cm, thighs_cm, shoulders_cm, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        measurement.id,
        measurement.userId,
        measurement.date,
        measurement.weightKg ?? null,
        measurement.bodyFatPercentage ?? null,
        measurement.chestCm ?? null,
        measurement.waistCm ?? null,
        measurement.hipsCm ?? null,
        measurement.armsCm ?? null,
        measurement.thighsCm ?? null,
        measurement.shouldersCm ?? null,
        measurement.notes ?? null,
      ]
    );
  }

  static async getAll(): Promise<BodyMeasurement[]> {
    return BodyMeasurementRepository.measurements;
  }
}
