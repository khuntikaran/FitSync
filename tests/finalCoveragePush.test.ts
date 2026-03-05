import { describe, expect, it, vi } from 'vitest';
import { BackupService } from '../src/services/backup/BackupService';
import { AppConfig } from '../src/constants/config';
import { CalorieCalculator } from '../src/services/calculations/CalorieCalculator';
import { WorkoutRepository } from '../src/database/repositories/WorkoutRepository';
import { DashboardService } from '../src/services/dashboard/DashboardService';

describe('Coverage edge cases', () => {
  it('BackupService rejects non-object payload and array appSettings', () => {
    expect(BackupService.validateImportPayload(null)).toBe(false);

    const payload = {
      version: AppConfig.backupVersion,
      exportDate: new Date().toISOString(),
      user: null,
      workouts: [],
      measurements: [],
      records: [],
      appSettings: [] as unknown as Record<string, string>,
    };

    expect(BackupService.validateImportPayload(payload)).toBe(false);
  });

  it('CalorieCalculator covers female branch and computed 1RM branch', () => {
    const femaleBmr = CalorieCalculator.calculateBMR(60, 165, 28, 'female');
    expect(femaleBmr).toBeGreaterThan(0);

    const oneRm = CalorieCalculator.calculateOneRepMax(80, 5);
    expect(oneRm).not.toBeNull();
    expect(oneRm!).toBeGreaterThan(80);
  });

  it('DashboardService returns null latest values when no workouts exist', async () => {
    await WorkoutRepository.replaceAll([]);
    const summary = await DashboardService.getSummary();

    expect(summary.totalWorkouts).toBe(0);
    expect(summary.latestWorkoutName).toBeNull();
    expect(summary.latestWorkoutDate).toBeNull();
    expect(summary.weeklyVolumeKg).toBe(0);
  });

  it('DatabaseService default in-memory adapter exposes row item and records statements', async () => {
    vi.resetModules();
    const module = await import('../src/database/connection');
    const { DatabaseService } = module;

    const result = await DatabaseService.execute('SELECT 42;');
    expect(result.rows.length).toBe(0);
    expect(result.rows.item(0)).toEqual({});

    const internalAdapter = (DatabaseService as unknown as { adapter: { getStatements: () => Array<{ sql: string }> } }).adapter;
    const statements = internalAdapter.getStatements();
    expect(statements.some((entry) => entry.sql === 'SELECT 42;')).toBe(true);
  });
});
