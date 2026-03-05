import { ScreenScaffold } from '../../components/layout/screenScaffold';
import { OnboardingInput, OnboardingService } from '../../services/onboarding/OnboardingService';
import { ONBOARDING_STEPS } from './onboardingScreen';

export function buildOnboardingScreenView(stepIndex: number, input?: OnboardingInput): ScreenScaffold {
  const activeStep = ONBOARDING_STEPS[Math.max(0, Math.min(stepIndex, ONBOARDING_STEPS.length - 1))];
  const preview = input ? OnboardingService.buildProfile(input) : null;

  return {
    title: 'Onboarding',
    description: `Step ${stepIndex + 1}/${ONBOARDING_STEPS.length}: ${activeStep}`,
    sections: [
      {
        title: 'Flow Steps',
        items: ONBOARDING_STEPS.map((step, index) => ({ step, index, active: index === stepIndex })),
      },
      {
        title: 'Profile Preview',
        items: preview ? [preview] : [],
      },
    ],
    actions: [
      { label: 'Previous', actionKey: 'onboarding.previous', emphasis: 'text' },
      { label: 'Next', actionKey: 'onboarding.next', emphasis: 'primary' },
    ],
  };
}
