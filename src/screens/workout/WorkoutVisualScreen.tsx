import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { ScreenFrame, PrimaryAction } from '../../components/common/VisualComponents';
import { buildWorkoutScreenView } from './workoutScreenView';
import { WorkoutScreenController } from './workoutScreen';

export function WorkoutVisualScreen() {
  const [count, setCount] = useState(0);

  const refresh = async () => {
    const view = await buildWorkoutScreenView();
    setCount(view.sections[0]?.items.length ?? 0);
  };

  useEffect(() => { refresh(); }, []);

  return (
    <ScreenFrame title="Workout">
      <Text>Active exercises: {count}</Text>
      <PrimaryAction label="Start Workout" onPress={() => { WorkoutScreenController.startWorkout(); refresh(); }} />
    </ScreenFrame>
  );
}
