import { CREATE_TABLES, DATABASE_NAME, DATABASE_VERSION } from './schema';

export interface SQLResultSetRowList {
  length: number;
  item: (index: number) => Record<string, unknown>;
}

export interface SQLResultSet {
  rows: SQLResultSetRowList;
}

export interface DatabaseAdapter {
  executeSql: (sql: string, params?: unknown[]) => Promise<SQLResultSet>;
}

/**
 * In-memory adapter used as a safe default in non-RN environments.
 * Replace with react-native-sqlite-storage adapter on mobile runtime.
 */
class InMemoryAdapter implements DatabaseAdapter {
  private executedStatements: Array<{ sql: string; params: unknown[] }> = [];

  async executeSql(sql: string, params: unknown[] = []): Promise<SQLResultSet> {
    this.executedStatements.push({ sql, params });
    return {
      rows: {
        length: 0,
        item: () => ({}),
      },
    };
  }

  getStatements() {
    return this.executedStatements;
  }
}

export class DatabaseService {
  private static adapter: DatabaseAdapter = new InMemoryAdapter();

  static readonly config = {
    version: DATABASE_VERSION,
    name: DATABASE_NAME,
  };

  static setAdapter(adapter: DatabaseAdapter) {
    DatabaseService.adapter = adapter;
  }

  static async initialize(): Promise<void> {
    await DatabaseService.adapter.executeSql('PRAGMA foreign_keys = ON;');
    await DatabaseService.adapter.executeSql(CREATE_TABLES);
  }

  static async execute(sql: string, params: unknown[] = []): Promise<SQLResultSet> {
    return DatabaseService.adapter.executeSql(sql, params);
  }

  static async transaction<T>(operation: () => Promise<T>): Promise<T> {
    await DatabaseService.execute('BEGIN TRANSACTION;');
    try {
      const result = await operation();
      await DatabaseService.execute('COMMIT;');
      return result;
    } catch (error) {
      await DatabaseService.execute('ROLLBACK;');
      throw error;
    }
  }
}
