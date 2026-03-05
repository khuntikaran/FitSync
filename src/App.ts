import { seedDatabase } from './services/seed/seedDatabase';

/**
 * Application bootstrap for service-layer initialization.
 * In React Native runtime this should be invoked before rendering navigation.
 */
export async function bootstrapApp(): Promise<void> {
  await seedDatabase();
}
