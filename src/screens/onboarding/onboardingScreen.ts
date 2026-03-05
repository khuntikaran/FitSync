import { OnboardingInput, OnboardingService } from '../../services/onboarding/OnboardingService';
import { useUserStore } from '../../store/userStore';

export const ONBOARDING_STEPS = [
  'welcome',
  'profile',
  'activity',
  'goals',
  'review',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export function buildOnboardingPreview(input: OnboardingInput) {
  return OnboardingService.buildProfile(input);
}

export async function submitOnboarding(input: OnboardingInput) {
  const profile = await OnboardingService.complete(input);
  const { setProfile, completeOnboarding } = useUserStore.getState();
  setProfile(profile);
  completeOnboarding();
  return profile;
}
