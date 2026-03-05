import React, { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native-paper';
import { ScreenFrame, PrimaryAction, StatCard } from '../../components/common/VisualComponents';
import { buildWorkoutScreenView } from './workoutScreenView';
import { WorkoutScreenController } from './workoutScreen';
import { useWorkoutStore } from '../../store/workoutStore';

export function WorkoutVisualScreen() {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
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

  useEffect(() => {
    refresh();
    const timer = setInterval(() => {
      const rest = useWorkoutStore.getState().restTimer;
      if (!rest.isRunning) {
        setSeconds(0);
        return;
      }

      setSeconds((current) => {
        if (current <= 0) return rest.timeRemaining || rest.totalTime;
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeWorkout = useWorkoutStore.getState().activeWorkout;
  const workoutLabel = useMemo(() => activeWorkout?.name ?? 'No active workout', [activeWorkout?.name]);

  return (
    <ScreenFrame title="Workout Tracking">
      <Text>{workoutLabel}</Text>
      <StatCard label="Active exercises" value={`${count}`} />
      <StatCard label="Rest timer" value={seconds > 0 ? `${seconds}s` : 'Idle'} />
      <PrimaryAction
        label="Start Workout"
        onPress={() => {
          WorkoutScreenController.startWorkout();
          refresh();
        }}
      />
      <PrimaryAction
        label="Start 90s Rest Timer"
        onPress={() => {
          useWorkoutStore.getState().startRestTimer(90);
          setSeconds(90);
        }}
      />
      <PrimaryAction
        label="Finish Workout"
        onPress={async () => {
          await WorkoutScreenController.finishWorkout();
          refresh();
        }}
      />
  useEffect(() => { refresh(); }, []);

  return (
    <ScreenFrame title="Workout">
      <Text>Active exercises: {count}</Text>
      <PrimaryAction label="Start Workout" onPress={() => { WorkoutScreenController.startWorkout(); refresh(); }} />
    </ScreenFrame>
  );
}
