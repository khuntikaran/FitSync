import { BodyMeasurement } from '../../types';
import { BodyMeasurementRepository } from '../../database/repositories/BodyMeasurementRepository';
import { ProgressService } from '../progress/ProgressService';

const generateId = () => `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export class MeasurementService {
  static async logMeasurement(
    measurement: Omit<BodyMeasurement, 'id'>
  ): Promise<BodyMeasurement> {
    const withId: BodyMeasurement = { ...measurement, id: generateId() };
    await BodyMeasurementRepository.save(withId);
    return withId;
  }

  static async getWeightTrend() {
    const measurements = await BodyMeasurementRepository.getAll();
    return ProgressService.buildWeightTrend(measurements);
  }
}
