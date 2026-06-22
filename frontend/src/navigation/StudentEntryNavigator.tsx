import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DestinationSetupScreen from '../screens/onboarding/DestinationSetupScreen';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';
import OnboardingReadyScreen from '../screens/onboarding/OnboardingReadyScreen';
import StudentQuizScreen from '../screens/onboarding/StudentQuizScreen';
import HostQuizScreen from '../screens/onboarding/HostQuizScreen';
import TouristQuizScreen from '../screens/onboarding/TouristQuizScreen';
import GuideQuizScreen from '../screens/onboarding/GuideQuizScreen';
import StudentHomeDashboard from '../screens/student/StudentHomeDashboard';
import type { QuizAnswers } from '../screens/onboarding/QuizPage';

import { studentHomeMockData } from '../data/studentHomeMock';
import {
  splashMock,
  welcomeMock,
  roleOptions,
  registerMock,
  destinationMock,
  profileSetupMock,
  onboardingReadyMock,
  ONBOARDING_TOTAL_STEPS,
} from '../data/studentOnboardingMock';

export type StudentEntryStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Register: undefined;
  Destination: undefined;
  StudentQuiz: undefined;
  HostQuiz: undefined;
  TouristQuiz: undefined;
  GuideQuiz: undefined;
  ProfileSetup: undefined;
  OnboardingReady: undefined;
  StudentHome: undefined;
};

const Stack = createNativeStackNavigator<StudentEntryStackParamList>();

type QuizScreenName = 'StudentQuiz' | 'HostQuiz' | 'TouristQuiz' | 'GuideQuiz';

function getQuizRouteForRole(roleId: string): QuizScreenName {
  switch (roleId) {
    case 'host':
      return 'HostQuiz';
    case 'guide':
      return 'GuideQuiz';
    case 'tourist':
      return 'TouristQuiz';
    default:
      return 'StudentQuiz';
  }
}

function roleUsesDestinationScreen(roleId: string): boolean {
  return roleId === 'student' || roleId === 'tourist';
}

function getPostRegisterRoute(roleId: string): keyof StudentEntryStackParamList {
  return roleUsesDestinationScreen(roleId) ? 'Destination' : getQuizRouteForRole(roleId);
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function StudentEntryNavigator() {
  const [selectedRoleId, setSelectedRoleId] = useState('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  const [roleQuizAnswers, setRoleQuizAnswers] = useState<QuizAnswers>({});
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  const resolvedName = displayName.trim() || fullName.trim() || 'Guest';
  const resolvedInitials = getInitials(resolvedName);

  const homeProps = useMemo(
    () => ({
      ...studentHomeMockData,
      greeting: 'Good morning 👋',
      userName: resolvedName,
      userInitials: resolvedInitials,
    }),
    [resolvedName, resolvedInitials],
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Splash">
          {({ navigation }) => <SplashAutoAdvance navigation={navigation} />}
        </Stack.Screen>

        <Stack.Screen name="Welcome">
          {({ navigation }) => (
            <WelcomeScreen
              {...welcomeMock}
              roles={roleOptions}
              selectedRoleId={selectedRoleId}
              onSelectRole={setSelectedRoleId}
              onGetStarted={() => navigation.navigate('Register')}
              onSignIn={() => navigation.navigate('Register')}
              onContinueAsGuest={() => navigation.navigate('Register')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Register">
          {({ navigation }) => (
            <RegisterScreen
              {...registerMock}
              fullName={fullName}
              email={email}
              password={password}
              keepSignedIn={keepSignedIn}
              onFullNameChange={setFullName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onToggleKeepSignedIn={() => setKeepSignedIn((v) => !v)}
              onSubmit={() => {
                setDisplayName(fullName);
                navigation.navigate(getPostRegisterRoute(selectedRoleId));
              }}
              onSignInPress={() => navigation.navigate(getPostRegisterRoute(selectedRoleId))}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Destination">
          {({ navigation }) => (
            <DestinationSetupScreen
              currentStep={1}
              totalSteps={ONBOARDING_TOTAL_STEPS}
              {...destinationMock}
              city={city}
              university={university}
              arrivalDate={arrivalDate}
              departureDate={departureDate}
              onCityChange={setCity}
              onUniversityChange={setUniversity}
              onArrivalDateChange={setArrivalDate}
              onDepartureDateChange={setDepartureDate}
              onContinue={() =>
                navigation.navigate(getQuizRouteForRole(selectedRoleId))
              }
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StudentQuiz">
          {({ navigation }) => (
            <StudentQuizScreen
              onFinish={(answers) => {
                setRoleQuizAnswers(answers);
                navigation.navigate('ProfileSetup');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="HostQuiz">
          {({ navigation }) => (
            <HostQuizScreen
              onFinish={(answers) => {
                setRoleQuizAnswers(answers);
                navigation.navigate('ProfileSetup');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="TouristQuiz">
          {({ navigation }) => (
            <TouristQuizScreen
              onFinish={(answers) => {
                setRoleQuizAnswers(answers);
                navigation.navigate('ProfileSetup');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="GuideQuiz">
          {({ navigation }) => (
            <GuideQuizScreen
              onFinish={(answers) => {
                setRoleQuizAnswers(answers);
                navigation.navigate('ProfileSetup');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ProfileSetup">
          {({ navigation }) => (
            <ProfileSetupScreen
              currentStep={3}
              totalSteps={ONBOARDING_TOTAL_STEPS}
              {...profileSetupMock}
              displayName={displayName}
              bio={bio}
              initials={resolvedInitials}
              onDisplayNameChange={setDisplayName}
              onBioChange={setBio}
              onContinue={() => navigation.navigate('OnboardingReady')}
              onSkip={() => navigation.navigate('OnboardingReady')}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="OnboardingReady">
          {({ navigation }) => (
            <OnboardingReadyScreen
              userName={resolvedName}
              destination={city || 'your destination'}
              matchHint={onboardingReadyMock.matchHint}
              onEnterDashboard={() => navigation.reset({
                index: 0,
                routes: [{ name: 'StudentHome' }],
              })}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="StudentHome">
          {() => <StudentHomeDashboard {...homeProps} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/** Auto-advances splash → welcome after a short delay. Mount inside Splash screen wrapper. */
export function SplashAutoAdvance({
  navigation,
}: {
  navigation: { replace: (name: keyof StudentEntryStackParamList) => void };
}) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Welcome'), 2200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return <SplashScreen {...splashMock} />;
}
