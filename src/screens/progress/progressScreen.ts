import { BodyMeasurementRepository } from '../../database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../../database/repositories/PersonalRecordRepository';
import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { ProgressPeriod, ProgressService } from '../../services/progress/ProgressService';

export interface ProgressScreenData {
  volume: ReturnType<typeof ProgressService.summarizeVolumeByPeriod>;
  weightTrend: ReturnType<typeof ProgressService.buildWeightTrend>;
  activeRecords: number;
}

export async function loadProgressScreenData(period: ProgressPeriod): Promise<ProgressScreenData> {
  const [workouts, measurements, records] = await Promise.all([
    WorkoutRepository.getAll(),
    BodyMeasurementRepository.getAll(),
    PersonalRecordRepository.getAll(),
  ]);

  return {
    volume: ProgressService.summarizeVolumeByPeriod(workouts, period),
    weightTrend: ProgressService.buildWeightTrend(measurements),
    activeRecords: records.filter((record) => record.isActive).length,
  };
}
