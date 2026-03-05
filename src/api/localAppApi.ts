import { OnboardingInput } from '../services/onboarding/OnboardingService';
import { ProgressPeriod } from '../services/progress/ProgressService';
import { submitOnboarding } from '../screens/onboarding/onboardingScreen';
import { buildOnboardingScreenView } from '../screens/onboarding/onboardingScreenView';
import { buildHomeScreenView } from '../screens/main/homeScreenView';
import { buildWorkoutScreenView } from '../screens/workout/workoutScreenView';
import { buildHistoryScreenView } from '../screens/history/historyScreenView';
import { buildProgressScreenView } from '../screens/progress/progressScreenView';
import {
  MeasurementFormInput,
  PersonalRecordFormInput,
  submitMeasurementForm,
  submitPersonalRecordForm,
} from '../screens/progress/formsAndCharts';
import { buildSettingsScreenView } from '../screens/settings/settingsScreenView';

export const LocalAppApi = {
  getOnboardingView: (stepIndex: number, input?: OnboardingInput) =>
    buildOnboardingScreenView(stepIndex, input),
  submitOnboarding,
  getHomeView: () => buildHomeScreenView(),
  getWorkoutView: (query?: string) => buildWorkoutScreenView(query),
  getHistoryView: () => buildHistoryScreenView(),
  getProgressView: (period: ProgressPeriod) => buildProgressScreenView(period),
  submitMeasurement: (input: MeasurementFormInput) => submitMeasurementForm(input),
  submitPersonalRecord: (input: PersonalRecordFormInput) => submitPersonalRecordForm(input),
  getSettingsView: () => buildSettingsScreenView(),
};
