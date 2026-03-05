import { AppShellState, createDefaultAppShellState, renderActiveScreen } from '../navigation/appShell';
import { MAIN_TAB_ROUTES, MainTabRoute, ROOT_STACK_ROUTES } from '../navigation/routes';

export interface AppShellController {
  getState: () => AppShellState;
  goToMainTabs: () => void;
  setActiveTab: (tab: MainTabRoute) => void;
  setOnboardingStep: (index: number) => void;
  render: () => Promise<unknown>;
}

export function useAppShellController(initial?: Partial<AppShellState>): AppShellController {
  let state: AppShellState = {
    ...createDefaultAppShellState(),
    ...initial,
  };

  return {
    getState: () => state,
    goToMainTabs: () => {
      state = { ...state, rootRoute: ROOT_STACK_ROUTES.MAIN_TABS, activeTab: MAIN_TAB_ROUTES.HOME };
    },
    setActiveTab: (tab) => {
      state = { ...state, activeTab: tab, rootRoute: ROOT_STACK_ROUTES.MAIN_TABS };
    },
    setOnboardingStep: (index) => {
      state = { ...state, onboardingStepIndex: Math.max(0, index), rootRoute: ROOT_STACK_ROUTES.ONBOARDING };
    },
    render: () => renderActiveScreen(state),
  };
}
