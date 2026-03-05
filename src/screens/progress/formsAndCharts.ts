import { EXERCISES } from '../../constants/exercises';
import { BodyMeasurementRepository } from '../../database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../../database/repositories/PersonalRecordRepository';
import { WorkoutRepository } from '../../database/repositories/WorkoutRepository';
import { MeasurementService } from '../../services/measurements/MeasurementService';
import { ProgressPeriod, ProgressService } from '../../services/progress/ProgressService';
import { PersonalRecordService } from '../../services/records/PersonalRecordService';
import { BodyMeasurement, PersonalRecord } from '../../types';
import { toIsoDate } from '../../utils/date';
import { assertFiniteNumber, assertPositive } from '../../utils/validation';

export interface MeasurementFormInput {
  userId: string;
  date?: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
  shouldersCm?: number;
  notes?: string;
}

export interface PersonalRecordFormInput {
  userId: string;
  exerciseId: string;
  exerciseName: string;
  recordType: PersonalRecord['recordType'];
  value: number;
  workoutId: string;
  date?: string;
}

export interface ProgressChartPipeline {
  weightLine: Array<{ x: string; y: number }>;
  volumeLine: Array<{ x: string; y: number }>;
  recordBar: Array<{ x: string; y: number }>;
  muscleGroupBar: Array<{ x: string; y: number }>;
  workoutFrequencyBar: Array<{ x: string; y: number }>;
  recordTimelineLine: Array<{ x: string; y: number }>;
}

function normalizeDate(value?: string): string {
  if (!value) return toIsoDate(new Date());
  if (Number.isNaN(Date.parse(value))) {
    throw new Error('Date must be a valid ISO date string.');
  }
  return value.slice(0, 10);
}

function optionalMetric(value: number | undefined, label: string): number | undefined {
  if (typeof value === 'undefined') return undefined;
  assertFiniteNumber(value, label);
  if (value < 0) throw new Error(`${label} must be zero or greater.`);
  return value;
}

function buildVolumeThreshold(period: ProgressPeriod): Date | null {
  if (period === 'all') return null;
  const now = new Date();
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export async function submitMeasurementForm(input: MeasurementFormInput): Promise<BodyMeasurement> {
  if (!input.userId.trim()) throw new Error('User id is required.');

  return MeasurementService.logMeasurement({
export async function submitMeasurementForm(input: MeasurementFormInput): Promise<BodyMeasurement> {
  if (!input.userId.trim()) throw new Error('User id is required.');

  const measurement = await MeasurementService.logMeasurement({
    userId: input.userId,
    date: normalizeDate(input.date),
    weightKg: optionalMetric(input.weightKg, 'Weight'),
    bodyFatPercentage: optionalMetric(input.bodyFatPercentage, 'Body fat percentage'),
    chestCm: optionalMetric(input.chestCm, 'Chest'),
    waistCm: optionalMetric(input.waistCm, 'Waist'),
    hipsCm: optionalMetric(input.hipsCm, 'Hips'),
    armsCm: optionalMetric(input.armsCm, 'Arms'),
    thighsCm: optionalMetric(input.thighsCm, 'Thighs'),
    shouldersCm: optionalMetric(input.shouldersCm, 'Shoulders'),
    notes: input.notes?.trim() || undefined,
  });

  return measurement;
}

export async function submitPersonalRecordForm(input: PersonalRecordFormInput): Promise<PersonalRecord> {
  if (!input.userId.trim() || !input.exerciseId.trim() || !input.workoutId.trim()) {
    throw new Error('User id, exercise id and workout id are required.');
  }

  assertFiniteNumber(input.value, 'Record value');
  assertPositive(input.value, 'Record value');

  return PersonalRecordService.registerRecord({
    ...input,
    date: normalizeDate(input.date),
    exerciseName: input.exerciseName.trim(),
  });
}

export async function buildProgressChartPipeline(period: ProgressPeriod): Promise<ProgressChartPipeline> {
  const [measurements, workouts, records] = await Promise.all([
    BodyMeasurementRepository.getAll(),
    WorkoutRepository.getAll(),
    PersonalRecordRepository.getAll(),
  ]);

  const weightTrend = ProgressService.buildWeightTrend(measurements);
  const volumeThreshold = buildVolumeThreshold(period);
  const volumeThreshold = (() => {
    if (period === 'all') return null;
    const now = new Date();
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  })();

  const volumeLine = workouts
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .filter((workout) =>
      volumeThreshold ? new Date(`${workout.date}T00:00:00.000Z`) >= volumeThreshold : true
    )
    .map((workout) => ({ x: workout.date, y: workout.totalVolumeKg }));

  const activeRecords = records
    .filter((record) => record.isActive)
    .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));

  const muscleGroupBar = ProgressService.summarizeVolumeByMuscleGroup(workouts, EXERCISES, period)
    .slice(0, 8)
    .map((entry) => ({ x: entry.muscleGroup, y: entry.volumeKg }));

  const workoutFrequencyBar = ProgressService.summarizeWorkoutFrequency(workouts, period).map((entry) => ({
    x: entry.date,
    y: entry.workouts,
  }));

  const recordTimelineLine = activeRecords
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((record) => ({ x: record.date, y: record.value }));
  const recordBar = records
    .filter((record) => record.isActive)
    .sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
    .map((record) => ({ x: record.exerciseName, y: record.value }));

  return {
    weightLine: weightTrend.map((point) => ({ x: point.date, y: point.weightKg })),
    volumeLine,
    recordBar: activeRecords.map((record) => ({ x: record.exerciseName, y: record.value })),
    muscleGroupBar,
    workoutFrequencyBar,
    recordTimelineLine,
    recordBar,
  };
}
