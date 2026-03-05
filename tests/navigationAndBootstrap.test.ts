import { describe, expect, it } from 'vitest';
import { MAIN_TAB_ORDER, ROOT_STACK_ORDER } from '../src/navigation/navigationConfig';
import { MAIN_TAB_ROUTES, ROOT_STACK_ROUTES } from '../src/navigation/routes';
import { MAIN_SCREEN_TITLES } from '../src/screens/main/screenPlaceholders';
import { bootstrapApp } from '../src/App';

describe('navigation config', () => {
  it('keeps root stack and tabs in expected order', () => {
    expect(ROOT_STACK_ORDER).toEqual([ROOT_STACK_ROUTES.ONBOARDING, ROOT_STACK_ROUTES.MAIN_TABS]);
    expect(MAIN_TAB_ORDER).toEqual([
      MAIN_TAB_ROUTES.HOME,
      MAIN_TAB_ROUTES.WORKOUT,
      MAIN_TAB_ROUTES.HISTORY,
      MAIN_TAB_ROUTES.PROGRESS,
      MAIN_TAB_ROUTES.SETTINGS,
    ]);
  });

  it('exposes title placeholders for each main route', () => {
    expect(MAIN_SCREEN_TITLES.home).toBe('Home');
    expect(MAIN_SCREEN_TITLES.workout).toBe('Workout');
    expect(MAIN_SCREEN_TITLES.history).toBe('History');
    expect(MAIN_SCREEN_TITLES.progress).toBe('Progress');
    expect(MAIN_SCREEN_TITLES.settings).toBe('Settings');
  });
});

describe('bootstrap', () => {
  it('bootstraps without runtime modules available', async () => {
    await expect(bootstrapApp()).resolves.toBeUndefined();
  });
});
