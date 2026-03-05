declare const require: (moduleName: string) => unknown;

import { seedDatabase } from './services/seed/seedDatabase';
import { configureReactNativeRuntimeAdapters } from './runtime/configureReactNativeRuntime';

/**
 * Application bootstrap for service-layer initialization.
 * In React Native runtime this should be invoked before rendering navigation.
 */
export async function bootstrapApp(): Promise<void> {
  configureReactNativeRuntimeAdapters(loadRuntimeModules());
  await seedDatabase();
}

function loadRuntimeModules(): {
  sqlite?: unknown;
  pushNotification?: unknown;
  fileSystem?: unknown;
  share?: unknown;
} {
  const optionalRequire = (moduleName: string): unknown | undefined => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(moduleName);
    } catch {
      return undefined;
    }
  };

  return {
    sqlite: optionalRequire('react-native-sqlite-storage'),
    pushNotification: optionalRequire('react-native-push-notification'),
    fileSystem: optionalRequire('react-native-fs'),
    share: optionalRequire('react-native-share'),
  };
}
