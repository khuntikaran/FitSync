import { LocalAppApi } from '../api/localAppApi';
import { MAIN_TAB_ROUTES, MainTabRoute, ROOT_STACK_ROUTES, RootStackRoute } from './routes';

export interface AppShellState {
  rootRoute: RootStackRoute;
  activeTab: MainTabRoute;
  onboardingStepIndex: number;
}

export function createDefaultAppShellState(): AppShellState {
  return {
    rootRoute: ROOT_STACK_ROUTES.ONBOARDING,
    activeTab: MAIN_TAB_ROUTES.HOME,
    onboardingStepIndex: 0,
  };
}

export async function renderActiveScreen(state: AppShellState) {
  if (state.rootRoute === ROOT_STACK_ROUTES.ONBOARDING) {
    return LocalAppApi.getOnboardingView(state.onboardingStepIndex);
  }

  switch (state.activeTab) {
    case MAIN_TAB_ROUTES.WORKOUT:
      return LocalAppApi.getWorkoutView();
    case MAIN_TAB_ROUTES.HISTORY:
      return LocalAppApi.getHistoryView();
    case MAIN_TAB_ROUTES.PROGRESS:
      return LocalAppApi.getProgressView('month');
    case MAIN_TAB_ROUTES.SETTINGS:
      return LocalAppApi.getSettingsView();
    case MAIN_TAB_ROUTES.HOME:
    default:
      return LocalAppApi.getHomeView();
  }
}
