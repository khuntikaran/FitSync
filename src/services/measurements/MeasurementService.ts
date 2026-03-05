import { BodyMeasurement } from '../../types';
import { BodyMeasurementRepository } from '../../database/repositories/BodyMeasurementRepository';
import { ProgressService } from '../progress/ProgressService';
import { createId } from '../../utils/id';

export class MeasurementService {
  static async logMeasurement(
    measurement: Omit<BodyMeasurement, 'id'>
  ): Promise<BodyMeasurement> {
    const withId: BodyMeasurement = { ...measurement, id: createId('bm') };
    await BodyMeasurementRepository.save(withId);
    return withId;
  }

  static async getWeightTrend() {
    const measurements = await BodyMeasurementRepository.getAll();
    return ProgressService.buildWeightTrend(measurements);
  }
}
