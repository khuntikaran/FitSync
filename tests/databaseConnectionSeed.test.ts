import { describe, expect, it } from 'vitest';
import { DatabaseAdapter, DatabaseService, SQLResultSet } from '../src/database/connection';
import { ExerciseRepository } from '../src/database/repositories/ExerciseRepository';

class RecordingAdapter implements DatabaseAdapter {
  public calls: Array<{ sql: string; params: unknown[] }> = [];

  async executeSql(sql: string, params: unknown[] = []): Promise<SQLResultSet> {
    this.calls.push({ sql, params });
    return {
      rows: {
        length: 0,
        item: () => ({}),
      },
    };
  }
}

describe('DatabaseService', () => {
  it('initialize executes pragma and schema create SQL', async () => {
    const adapter = new RecordingAdapter();
    DatabaseService.setAdapter(adapter);

    await DatabaseService.initialize();

    expect(adapter.calls[0].sql).toContain('PRAGMA foreign_keys = ON');
    expect(adapter.calls[1].sql).toContain('CREATE TABLE IF NOT EXISTS users');
  });

  it('transaction commits on success', async () => {
    const adapter = new RecordingAdapter();
    DatabaseService.setAdapter(adapter);

    await DatabaseService.transaction(async () => {
      await DatabaseService.execute('SELECT 1;');
    });

    expect(adapter.calls.map((c) => c.sql)).toEqual([
      'BEGIN TRANSACTION;',
      'SELECT 1;',
      'COMMIT;',
    ]);
  });

  it('transaction rolls back when operation throws', async () => {
    const adapter = new RecordingAdapter();
    DatabaseService.setAdapter(adapter);

    await expect(
      DatabaseService.transaction(async () => {
        await DatabaseService.execute('SELECT 1;');
        throw new Error('boom');
      })
    ).rejects.toThrow('boom');

    expect(adapter.calls.map((c) => c.sql)).toEqual([
      'BEGIN TRANSACTION;',
      'SELECT 1;',
      'ROLLBACK;',
    ]);
  });
});

describe('ExerciseRepository.seedDefaults', () => {
  it('seeds exercises by issuing insert statements in a transaction', async () => {
    const adapter = new RecordingAdapter();
    DatabaseService.setAdapter(adapter);

    await ExerciseRepository.seedDefaults();

    const sqls = adapter.calls.map((c) => c.sql);
    expect(sqls[0]).toBe('BEGIN TRANSACTION;');
    expect(sqls.some((sql) => sql.includes('INSERT OR REPLACE INTO exercises'))).toBe(true);
    expect(sqls.at(-1)).toBe('COMMIT;');
  });
});
