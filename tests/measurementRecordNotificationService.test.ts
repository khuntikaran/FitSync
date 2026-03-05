import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MeasurementService } from '../src/services/measurements/MeasurementService';
import { PersonalRecordService } from '../src/services/records/PersonalRecordService';
import { NotificationService } from '../src/services/notifications/NotificationService';
import { BodyMeasurementRepository } from '../src/database/repositories/BodyMeasurementRepository';
import { PersonalRecordRepository } from '../src/database/repositories/PersonalRecordRepository';

describe('MeasurementService', () => {
  beforeEach(async () => {
    await BodyMeasurementRepository.replaceAll([]);
  });

  it('logs measurement with generated id and returns sorted weight trend', async () => {
    const created = await MeasurementService.logMeasurement({
      userId: 'u1',
      date: '2026-01-02',
      weightKg: 80,
    });

    expect(created.id.startsWith('bm-')).toBe(true);

    await MeasurementService.logMeasurement({
      userId: 'u1',
      date: '2026-01-01',
      weightKg: 81,
    });

    const trend = await MeasurementService.getWeightTrend();
    expect(trend).toEqual([
      { date: '2026-01-01', weightKg: 81 },
      { date: '2026-01-02', weightKg: 80 },
    ]);
  });
});

describe('PersonalRecordService', () => {
  beforeEach(async () => {
    await PersonalRecordRepository.replaceAll([]);
  });

  it('creates a new active personal record with generated id', async () => {
    const record = await PersonalRecordService.registerRecord({
      userId: 'u1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      recordType: 'weight',
      value: 100,
      date: '2026-01-10',
      workoutId: 'w1',
    });

    expect(record.id.startsWith('pr-')).toBe(true);
    expect(record.isActive).toBe(true);
    expect(record.previousValue).toBeUndefined();
  });

  it('deactivates old active record when improved value is registered', async () => {
    const initial = await PersonalRecordService.registerRecord({
      userId: 'u1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      recordType: 'weight',
      value: 100,
      date: '2026-01-10',
      workoutId: 'w1',
    });

    const improved = await PersonalRecordService.registerRecord({
      userId: 'u1',
      exerciseId: 'bench',
      exerciseName: 'Bench Press',
      recordType: 'weight',
      value: 105,
      date: '2026-01-11',
      workoutId: 'w2',
    });

    expect(improved.previousValue).toBe(100);

    const all = await PersonalRecordRepository.getAll();
    const old = all.find((r) => r.id === initial.id);
    const current = all.find((r) => r.id === improved.id);

    expect(old?.isActive).toBe(false);
    expect(current?.isActive).toBe(true);
  });

  it('returns existing active record when value does not improve', async () => {
    const initial = await PersonalRecordService.registerRecord({
      userId: 'u1',
      exerciseId: 'squat',
      exerciseName: 'Squat',
      recordType: 'weight',
      value: 140,
      date: '2026-01-10',
      workoutId: 'w1',
    });

    const returned = await PersonalRecordService.registerRecord({
      userId: 'u1',
      exerciseId: 'squat',
      exerciseName: 'Squat',
      recordType: 'weight',
      value: 139,
      date: '2026-01-11',
      workoutId: 'w2',
    });

    expect(returned.id).toBe(initial.id);

    const all = await PersonalRecordRepository.getAll();
    expect(all).toHaveLength(1);
  });
});

describe('NotificationService', () => {
  it('schedules rest timer notification via configured adapter', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-10T10:00:00.000Z'));

    const schedule = vi.fn().mockResolvedValue(undefined);
    const cancelAll = vi.fn().mockResolvedValue(undefined);

    NotificationService.setAdapter({ schedule, cancelAll });

    await NotificationService.scheduleRestTimer(30);

    expect(schedule).toHaveBeenCalledTimes(1);
    const payload = schedule.mock.calls[0][0];
    expect(payload.title).toBe('Rest Complete! 💪');
    expect(payload.message).toBe('Time for your next set');
    expect(payload.date.toISOString()).toBe('2026-01-10T10:00:30.000Z');

    vi.useRealTimers();
  });

  it('clamps non-positive rest seconds to at least one second', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-10T10:00:00.000Z'));

    const schedule = vi.fn().mockResolvedValue(undefined);
    const cancelAll = vi.fn().mockResolvedValue(undefined);

    NotificationService.setAdapter({ schedule, cancelAll });

    await NotificationService.scheduleRestTimer(0);

    const payload = schedule.mock.calls[0][0];
    expect(payload.date.toISOString()).toBe('2026-01-10T10:00:01.000Z');

    await NotificationService.cancelAll();
    expect(cancelAll).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
