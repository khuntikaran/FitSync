export const ROOT_STACK_ROUTES = {
  ONBOARDING: 'Onboarding',
  MAIN_TABS: 'MainTabs',
} as const;

export const MAIN_TAB_ROUTES = {
  HOME: 'Home',
  WORKOUT: 'Workout',
  HISTORY: 'History',
  PROGRESS: 'Progress',
  SETTINGS: 'Settings',
} as const;

export type RootStackRoute = (typeof ROOT_STACK_ROUTES)[keyof typeof ROOT_STACK_ROUTES];
export type MainTabRoute = (typeof MAIN_TAB_ROUTES)[keyof typeof MAIN_TAB_ROUTES];
