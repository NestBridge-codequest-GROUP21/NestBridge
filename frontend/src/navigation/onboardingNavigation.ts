import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { PrimaryIntent } from '../types/accountProfile';
import type { SetupTrack } from '../types/accountProfile';
import type { AppStackParamList } from './types';
import {
  getSeekerQuizRoute,
  seekerUsesDestination,
} from '../utils/accountProfile';

export function navigateSetupOnboarding(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  track: SetupTrack,
  primaryIntent: PrimaryIntent | null,
  nextStep: string | null,
) {
  const step =
    nextStep ??
    (track === 'SEEKER' && seekerUsesDestination(primaryIntent)
      ? 'destination'
      : 'quiz');

  switch (step) {
    case 'destination':
      navigation.navigate('Destination', { track: 'SEEKER' });
      return;
    case 'quiz':
      if (track === 'HOST') {
        navigation.navigate('HostQuiz', { track: 'HOST' });
        return;
      }
      if (track === 'GUIDE') {
        navigation.navigate('GuideQuiz', { track: 'GUIDE' });
        return;
      }
      if (getSeekerQuizRoute(primaryIntent) === 'StudentQuiz') {
        navigation.navigate('StudentQuiz', { track: 'SEEKER' });
      } else {
        navigation.navigate('TouristQuiz', { track: 'SEEKER' });
      }
      return;
    case 'profile':
      navigation.navigate('ProfileSetup', { track });
      return;
    case 'ready':
      navigation.navigate('OnboardingReady', { track });
      return;
    default:
      navigation.navigate('AccountSetup');
  }
}

export function navigateContinueSetup(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  track: SetupTrack,
  primaryIntent: PrimaryIntent | null,
  getNextStep: (track: SetupTrack) => string | null,
  startSetup: (track: SetupTrack) => Promise<void>,
) {
  void startSetup(track).then(() => {
    navigateSetupOnboarding(navigation, track, primaryIntent, getNextStep(track));
  });
}

export function navigatePrimaryOnboarding(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  intent: PrimaryIntent,
) {
  if (intent === 'STUDENT' || intent === 'TOURIST') {
    navigation.navigate('Destination', { track: 'SEEKER' });
    return;
  }
  if (intent === 'HOST') {
    navigation.navigate('HostQuiz', { track: 'HOST' });
    return;
  }
  navigation.navigate('GuideQuiz', { track: 'GUIDE' });
}

export function bookingContextToSeekerRole(
  context: import('../types/booking').BookingContext,
): import('../types/booking').SeekerRole {
  return context === 'STUDENT' ? 'STUDENT' : 'TOURIST';
}
