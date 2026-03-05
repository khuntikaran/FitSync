import { DatabaseAdapter, SQLResultSet } from '../connection';

/**
 * Adapter boundary for wiring `react-native-sqlite-storage` in mobile runtime.
 * This file avoids hard dependency imports so the repository remains runnable in constrained CI environments.
 */
export class ReactNativeSQLiteAdapter implements DatabaseAdapter {
  constructor(private readonly database: ReactNativeSQLiteDatabase) {}

  static createFromModule(
    sqliteModule: ReactNativeSQLiteModule,
    databaseName: string
  ): ReactNativeSQLiteAdapter {
    return new ReactNativeSQLiteAdapter(sqliteModule.openDatabase({ name: databaseName, location: 'default' }));
  }

  async executeSql(sql: string, params: unknown[] = []): Promise<SQLResultSet> {
    return new Promise<SQLResultSet>((resolve, reject) => {
      this.database.transaction((transaction) => {
        transaction.executeSql(
          sql,
          params,
          (_tx, resultSet) => {
            resolve({
              rows: {
                length: resultSet.rows.length,
                item: (index: number) => resultSet.rows.item(index) as Record<string, unknown>,
              },
            });
          },
          (_tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }
}

interface ReactNativeSQLiteResultRows {
  length: number;
  item: (index: number) => unknown;
}

interface ReactNativeSQLiteResultSet {
  rows: ReactNativeSQLiteResultRows;
}

interface ReactNativeSQLiteTransaction {
  executeSql: (
    sql: string,
    params: unknown[],
    success: (transaction: ReactNativeSQLiteTransaction, resultSet: ReactNativeSQLiteResultSet) => void,
    failure: (transaction: ReactNativeSQLiteTransaction, error: Error) => boolean
  ) => void;
}

interface ReactNativeSQLiteDatabase {
  transaction: (callback: (transaction: ReactNativeSQLiteTransaction) => void) => void;
}

interface ReactNativeSQLiteModule {
  openDatabase: (options: { name: string; location: 'default' }) => ReactNativeSQLiteDatabase;
}
