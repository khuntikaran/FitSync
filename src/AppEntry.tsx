import React, { useMemo, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { HomeVisualScreen } from './screens/main/HomeVisualScreen';
import { WorkoutVisualScreen } from './screens/workout/WorkoutVisualScreen';
import { HistoryVisualScreen } from './screens/history/HistoryVisualScreen';
import { ProgressVisualScreen } from './screens/progress/ProgressVisualScreen';
import { SettingsVisualScreen } from './screens/settings/SettingsVisualScreen';
import { OnboardingVisualScreen } from './screens/onboarding/OnboardingVisualScreen';
import { MAIN_TAB_ROUTES, RootStackRoute, ROOT_STACK_ROUTES } from './navigation/routes';
import { useAppShellController } from './hooks/useAppShell';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={MAIN_TAB_ROUTES.HOME} component={HomeVisualScreen} />
      <Tab.Screen name={MAIN_TAB_ROUTES.WORKOUT} component={WorkoutVisualScreen} />
      <Tab.Screen name={MAIN_TAB_ROUTES.HISTORY} component={HistoryVisualScreen} />
      <Tab.Screen name={MAIN_TAB_ROUTES.PROGRESS} component={ProgressVisualScreen} />
      <Tab.Screen name={MAIN_TAB_ROUTES.SETTINGS} component={SettingsVisualScreen} />
    </Tab.Navigator>
  );
}

export default function AppEntry() {
  const appShell = useMemo(() => useAppShellController(), []);
  const activeRootRef = useRef<RootStackRoute>(appShell.getState().rootRoute);

  return (
    <PaperProvider>
      <NavigationContainer
        onStateChange={(state) => {
          const root = state?.routes?.[state.index ?? 0]?.name as RootStackRoute | undefined;
          if (!root) return;
          activeRootRef.current = root;
          if (root === ROOT_STACK_ROUTES.ONBOARDING) {
            appShell.setOnboardingStep(appShell.getState().onboardingStepIndex);
          } else {
            appShell.goToMainTabs();
          }
        }}
      >
        <RootStack.Navigator initialRouteName={activeRootRef.current} screenOptions={{ headerShown: false }}>
          <RootStack.Screen name={ROOT_STACK_ROUTES.ONBOARDING} component={OnboardingVisualScreen} />
          <RootStack.Screen name={ROOT_STACK_ROUTES.MAIN_TABS} component={MainTabs} />
        </RootStack.Navigator>

const Tab = createBottomTabNavigator();

export default function AppEntry() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeVisualScreen} />
          <Tab.Screen name="Workout" component={WorkoutVisualScreen} />
          <Tab.Screen name="History" component={HistoryVisualScreen} />
          <Tab.Screen name="Progress" component={ProgressVisualScreen} />
          <Tab.Screen name="Settings" component={SettingsVisualScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
