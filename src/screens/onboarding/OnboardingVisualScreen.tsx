import React, { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenFrame, Inline, PrimaryAction } from '../../components/common/VisualComponents';
import { submitOnboarding } from './onboardingScreen';
import { ROOT_STACK_ROUTES } from '../../navigation/routes';

type NavLike = { replace: (routeName: string) => void };

export function OnboardingVisualScreen({ navigation }: { navigation: NavLike }) {
  const [age, setAge] = useState('30');
  const [heightCm, setHeightCm] = useState('180');
  const [weightKg, setWeightKg] = useState('80');
  const [status, setStatus] = useState('Fill profile and submit.');

  const canSubmit = useMemo(
    () => Number(age) > 0 && Number(heightCm) > 0 && Number(weightKg) > 0,
    [age, heightCm, weightKg]
  );

  return (
    <ScreenFrame title="Onboarding">
      <Text>Age</Text>
      <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" style={{ backgroundColor: '#fff', padding: 8 }} />
      <Inline>
        <View style={{ flex: 1 }}>
          <Text>Height (cm)</Text>
          <TextInput value={heightCm} onChangeText={setHeightCm} keyboardType="number-pad" style={{ backgroundColor: '#fff', padding: 8 }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text>Weight (kg)</Text>
          <TextInput value={weightKg} onChangeText={setWeightKg} keyboardType="number-pad" style={{ backgroundColor: '#fff', padding: 8 }} />
        </View>
      </Inline>
import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenFrame, PrimaryAction } from '../../components/common/VisualComponents';
import { submitOnboarding } from './onboardingScreen';

export function OnboardingVisualScreen() {
  const [age, setAge] = useState('30');
  const [status, setStatus] = useState('Fill profile and submit.');

  return (
    <ScreenFrame title="Onboarding">
      <TextInput value={age} onChangeText={setAge} keyboardType="number-pad" style={{ backgroundColor: '#fff', padding: 8 }} />
      <PrimaryAction
        label="Complete Onboarding"
        onPress={async () => {
          try {
            await submitOnboarding({
              age: Number(age),
              gender: 'male',
              heightCm: Number(heightCm),
              weightKg: Number(weightKg),
              activityLevel: 'moderate',
            });
            setStatus('Onboarding completed. Redirecting...');
            navigation.replace(ROOT_STACK_ROUTES.MAIN_TABS);
              heightCm: 180,
              weightKg: 80,
              activityLevel: 'moderate',
            });
            setStatus('Onboarding completed.');
          } catch (error) {
            setStatus((error as Error).message);
          }
        }}
      />
      {!canSubmit ? <Text>All fields are required.</Text> : null}
      <Text>{status}</Text>
    </ScreenFrame>
  );
}
