import { beforeEach, describe, expect, it } from 'vitest';
import { BodyMeasurementRepository } from '../src/database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';

describe('Repository encapsulation', () => {
  beforeEach(async () => {
    await BodyMeasurementRepository.replaceAll([]);
    await PersonalRecordRepository.replaceAll([]);
  });

  it('BodyMeasurementRepository.getAll returns a copy', async () => {
    await BodyMeasurementRepository.save({
      id: 'm1',
      userId: 'u1',
      date: '2026-01-10',
      weightKg: 80,
    });

    const first = await BodyMeasurementRepository.getAll();
    first.push({ id: 'm2', userId: 'u1', date: '2026-01-11', weightKg: 81 });

    const second = await BodyMeasurementRepository.getAll();
    expect(second.map((m) => m.id)).toEqual(['m1']);
  });

  it('PersonalRecordRepository.getAll returns a copy', async () => {
    await PersonalRecordRepository.save({
      id: 'r1',
      userId: 'u1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      recordType: 'weight',
      value: 100,
      date: '2026-01-10',
      workoutId: 'w1',
      isActive: true,
    });

    const first = await PersonalRecordRepository.getAll();
    first.push({
      id: 'r2',
      userId: 'u1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      recordType: 'weight',
      value: 110,
      date: '2026-01-11',
      workoutId: 'w2',
      isActive: true,
    });

    const second = await PersonalRecordRepository.getAll();
    expect(second.map((r) => r.id)).toEqual(['r1']);
  });
});
