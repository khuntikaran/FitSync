import { DatabaseAdapter, SQLResultSet } from '../connection';

/**
 * Adapter boundary for wiring `react-native-sqlite-storage` in mobile runtime.
 * This file avoids hard dependency imports so the repository remains runnable in constrained CI environments.
 */
export class ReactNativeSQLiteAdapter implements DatabaseAdapter {
  private readonly unavailableReason =
    'react-native-sqlite-storage runtime adapter is not wired in this environment.';

  async executeSql(_sql: string, _params: unknown[] = []): Promise<SQLResultSet> {
    throw new Error(this.unavailableReason);
  }
}
