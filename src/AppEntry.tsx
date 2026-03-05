import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { HomeVisualScreen } from './screens/main/HomeVisualScreen';
import { WorkoutVisualScreen } from './screens/workout/WorkoutVisualScreen';
import { HistoryVisualScreen } from './screens/history/HistoryVisualScreen';
import { ProgressVisualScreen } from './screens/progress/ProgressVisualScreen';
import { SettingsVisualScreen } from './screens/settings/SettingsVisualScreen';

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
