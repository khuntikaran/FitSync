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
      <Text>{status}</Text>
    </ScreenFrame>
  );
}
