import { describe, expect, it } from 'vitest';
import { diffInSeconds, toIsoDate } from '../src/utils/date';
import { assertFiniteNumber, assertInRange, assertPositive } from '../src/utils/validation';
import { NotificationService } from '../src/services/notifications/NotificationService';

describe('date utils', () => {
  it('formats ISO date and clamps negative diff to zero', () => {
    expect(toIsoDate(new Date('2026-01-10T15:30:00.000Z'))).toBe('2026-01-10');

    const negative = diffInSeconds('2026-01-10T11:00:00.000Z', '2026-01-10T10:00:00.000Z');
    expect(negative).toBe(0);
  });
});

describe('validation utils', () => {
  it('assertValidNumber throws for non-finite values', () => {
    expect(() => assertFiniteNumber(Number.NaN, 'Value')).toThrow('Value must be a finite number.');
  });

  it('assertInRange throws for values outside bounds', () => {
    expect(() => assertInRange(10, 'Age', 13, 100)).toThrow('Age must be between 13 and 100.');
    expect(() => assertInRange(120, 'Age', 13, 100)).toThrow('Age must be between 13 and 100.');
  });

  it('assertPositive throws for zero or negative values', () => {
    expect(() => assertPositive(0, 'Weight')).toThrow('Weight must be positive.');
    expect(() => assertPositive(-1, 'Weight')).toThrow('Weight must be positive.');
  });
});

describe('NotificationService default adapter', () => {
  it('no-op adapter methods resolve without throwing', async () => {
    // Uses default NoopNotificationAdapter without setting an adapter
    await expect(NotificationService.scheduleRestTimer(5)).resolves.toBeUndefined();
    await expect(NotificationService.cancelAll()).resolves.toBeUndefined();
  });
});
