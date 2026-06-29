import React, { useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import IntentSelectScreen, {
  intentOptionsFromPrimary,
} from '../screens/auth/IntentSelectScreen';
import DestinationSetupScreen from '../screens/onboarding/DestinationSetupScreen';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';
import OnboardingReadyScreen from '../screens/onboarding/OnboardingReadyScreen';
import StudentQuizScreen from '../screens/onboarding/StudentQuizScreen';
import HostQuizScreen from '../screens/onboarding/HostQuizScreen';
import TouristQuizScreen from '../screens/onboarding/TouristQuizScreen';
import GuideQuizScreen from '../screens/onboarding/GuideQuizScreen';
import StudentHomeDashboard from '../screens/student/StudentHomeDashboard';
import StudentBookingsScreen from '../screens/student/StudentBookingsScreen';
import HostProfileScreen from '../screens/student/HostProfileScreen';
import MatchSearchScreen, {
  matchSearchDefaults,
} from '../screens/student/MatchSearchScreen';
import { sampleMatchResults } from '../screens/student/MatchResultsScreen';
import BookingScreen from '../screens/student/BookingScreen';
import BookingConfirmedScreen from '../screens/student/BookingConfirmedScreen';
import IncomingRequestsScreen from '../screens/host/IncomingRequestsScreen';
import ProviderHomeDashboard from '../screens/host/ProviderHomeDashboard';
import MatchRequestReviewScreen from '../screens/host/MatchRequestReviewScreen';
import SessionReviewScreen from '../screens/guide/SessionReviewScreen';
import GuideSearchScreen from '../screens/shared/GuideSearchScreen';
import GuideProfileDetailScreen from '../screens/shared/GuideProfileDetailScreen';
import SessionBookingScreen from '../screens/shared/SessionBookingScreen';
import BrowseHomeScreen from '../screens/shared/BrowseHomeScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import AccountSetupScreen from '../screens/shared/AccountSetupScreen';
import DevTestingScreen from '../screens/shared/DevTestingScreen';
import UnifiedSearchScreen from '../screens/shared/UnifiedSearchScreen';
import ExploreHomeScreen from '../screens/tourist/ExploreHomeScreen';
import LodgingDirectoryScreen from '../screens/tourist/LodgingDirectoryScreen';
import LodgingDetailScreen from '../screens/tourist/LodgingDetailScreen';
import TouristSiteDetailScreen from '../screens/tourist/TouristSiteDetailScreen';
import SOSScreen from '../screens/shared/SOSScreen';
import type {
  BookingContext,
  BookingListItem,
  BookingTabFilter,
  HostProfileSummary,
} from '../types/booking';
import type { PrimaryIntent, SetupTrack } from '../types/accountProfile';
import type { LodgingCategoryFilter } from '../types/lodging';
import { useAuth } from '../context/AuthContext';
import { useAccountProfile } from '../context/AccountProfileContext';
import {
  getAccountSetupSummary,
  getHomeRoute,
  getProgressForTrack,
  getProgressPercent,
  getStepsForTrack,
  isSeekerComplete,
} from '../utils/accountProfile';
import type { HomeRoute } from '../utils/accountProfile';
import {
  bookingContextToSeekerRole,
  navigateContinueSetup,
  navigatePrimaryOnboarding,
} from './onboardingNavigation';
import type { AppStackParamList } from './types';
import type { DevHomeRoute } from '../utils/devTestingPresets';
import type { AccountProfileState } from '../types/accountProfile';

import { studentHomeMockData } from '../data/studentHomeMock';
import {
  destinationMock,
  profileSetupMock,
  intentSelectMock,
  ONBOARDING_TOTAL_STEPS,
} from '../data/studentOnboardingMock';
import {
  studentBookingsMock,
  incomingBookingRequestsMock,
  hostProfileMock,
  computePriceBreakdown,
  getUnreadNotificationCount,
} from '../data/bookingMock';
import {
  suggestedGuidesMock,
  incomingSessionRequestsMock,
  touristBookingsMock,
  guideSummaryFromId,
  computeSessionPrice,
} from '../data/guideSessionMock';
import {
  lodgingDirectoryMock,
  listingFromId,
} from '../data/lodgingDirectoryMock';
import { exploreSectionsMock } from '../data/touristExploreMock';
import {
  emergencyContactsMock,
  localEmergencyNumber,
} from '../data/sosMock';
import { touristSiteFromId } from '../data/touristSitesMock';
import { getPersonalizedGreeting } from '../utils/greeting';
import { formatMatchSubtitle } from '../utils/matchReasons';
import {
  onboardingReadyCopy,
  bookingGateCopy,
  emptyStates,
  providerWelcome,
} from '../data/appCopy';

const Stack = createNativeStackNavigator<AppStackParamList>();

function dialPhoneNumber(number: string) {
  const sanitized = number.replace(/[^\d+]/g, '');
  void Linking.openURL(`tel:${sanitized}`);
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

function parsePricePerNight(priceLabel: string): number {
  const match = priceLabel.match(/(\d+)/);
  return match ? Number(match[1]) : hostProfileMock.pricePerNight;
}

function hostSummaryFromId(hostId: string): HostProfileSummary {
  const suggested = studentHomeMockData.suggestedHosts.find((h) => h.id === hostId);
  if (!suggested) {
    return hostProfileMock;
  }
  return {
    id: suggested.id,
    name: suggested.name,
    initials: getInitials(suggested.name),
    location: suggested.location,
    matchPercentage: suggested.matchPercentage,
    pricePerNight: parsePricePerNight(suggested.pricePerNight),
    currency: 'GHS',
    cancellationPolicy: hostProfileMock.cancellationPolicy,
  };
}

function defaultCheckIn(arrivalDate: string): string {
  return arrivalDate || '2026-09-01';
}

function defaultCheckOut(departureDate: string): string {
  return departureDate || '2026-12-15';
}

function tabBarWithBadges(unreadCount: number, incomingCount: number) {
  return studentHomeMockData.tabBarItems.map((tab) => {
    if (tab.id === 'bookings' && unreadCount > 0) {
      return { ...tab, badgeCount: unreadCount };
    }
    if (tab.id === 'messages' && incomingCount > 0) {
      return { ...tab, badgeCount: incomingCount };
    }
    return tab;
  });
}

function resetToBookingsTab(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  homeRoute: HomeRoute,
) {
  navigation.reset({
    index: 1,
    routes: [
      { name: homeRouteToScreenName(homeRoute) },
      { name: 'StudentBookings' },
    ],
  });
}

function handleBookingsBack(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  homeRoute: HomeRoute,
) {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }
  navigateToHome(navigation, homeRoute);
}

function navigateToHome(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  route: HomeRoute,
) {
  navigation.navigate(homeRouteToScreenName(route));
}

function getProfileFields(
  profileState: ReturnType<typeof useAccountProfile>['state'],
) {
  const data = profileState.seekerSetup.data;
  return {
    city: data.city ?? '',
    university: data.university ?? '',
    arrivalDate: data.arrivalDate ?? '',
    departureDate: data.departureDate ?? '',
    displayName: data.displayName ?? '',
    bio: data.bio ?? '',
  };
}

function homeRouteToScreenName(
  route: HomeRoute,
): 'IntentSelect' | 'BrowseHome' | 'StudentHome' | 'ExploreHome' | 'HostHome' | 'GuideHome' {
  switch (route) {
    case 'StudentHome':
      return 'StudentHome';
    case 'ExploreHome':
      return 'ExploreHome';
    case 'HostHome':
      return 'HostHome';
    case 'GuideHome':
      return 'GuideHome';
    case 'IntentSelect':
      return 'IntentSelect';
    default:
      return 'BrowseHome';
  }
}

function devRouteToScreenName(
  route: DevHomeRoute,
): 'IntentSelect' | 'StudentHome' | 'ExploreHome' | 'HostHome' | 'GuideHome' {
  return route;
}

function resetToDevRoute(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  route: DevHomeRoute,
) {
  navigation.reset({
    index: 0,
    routes: [{ name: devRouteToScreenName(route) }],
  });
}

function syncFieldsFromProfileState(
  state: AccountProfileState,
  fallbackName: string,
  setters: {
    setCity: (v: string) => void;
    setUniversity: (v: string) => void;
    setArrivalDate: (v: string) => void;
    setDepartureDate: (v: string) => void;
    setDisplayName: (v: string) => void;
    setBio: (v: string) => void;
  },
) {
  const data = state.seekerSetup.data;
  setters.setCity(data.city ?? '');
  setters.setUniversity(data.university ?? '');
  setters.setArrivalDate(data.arrivalDate ?? '');
  setters.setDepartureDate(data.departureDate ?? '');
  setters.setDisplayName(data.displayName ?? fallbackName);
  setters.setBio(data.bio ?? '');
}

const DEFAULT_SESSION_DATE = '2026-09-05';
const DEFAULT_SESSION_TIME = '10:00';

const SEARCH_CATEGORIES = [
  {
    id: 'homestays',
    label: 'Homestays',
    description: 'Verified host families near campus and city centers',
    icon: '🏠',
  },
  {
    id: 'guides',
    label: 'Tour guides',
    description: 'Cultural tours, orientation, and local experiences',
    icon: '🗺️',
  },
  {
    id: 'lodging',
    label: 'Hotels & hostels',
    description: 'Browse lodging options and save contacts',
    icon: '🏨',
  },
];

export default function AppNavigator() {
  const { user, signOut } = useAuth();
  const {
    state: profileState,
    primaryIntent,
    isActiveExchangeStudent,
    setPrimaryIntent,
    setIsActiveExchangeStudent,
    completeStep,
    markTrackComplete,
    startSetup,
    canBookHomestay,
    canBookGuideSession,
    canAcceptHostBookings,
    canAcceptGuideSessions,
    canEnableHostProvider,
    canEnableGuideProvider,
    providerBlockedReason,
    getNextStep,
    getBookingContext,
    resetAccountProfile,
    applyDevPreset,
  } = useAccountProfile();

  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [pendingIntent, setPendingIntent] = useState<PrimaryIntent | null>(null);

  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [hostIncoming, setHostIncoming] = useState(incomingBookingRequestsMock);
  const [guideIncoming, setGuideIncoming] = useState(incomingSessionRequestsMock);
  const [bookingFilter, setBookingFilter] = useState<BookingTabFilter>('active');
  const [lodgingFilter, setLodgingFilter] = useState<LodgingCategoryFilter>('ALL');
  const [savedLodgingIds, setSavedLodgingIds] = useState<string[]>([]);

  const resolvedName =
    displayName.trim() || user?.displayName?.trim() || 'Guest';
  const resolvedInitials = getInitials(resolvedName);
  const homeRouteKey = getHomeRoute(profileState);
  const profileFields = getProfileFields(profileState);
  const cityLabel = profileFields.city || city || 'Accra';
  const checkIn = defaultCheckIn(arrivalDate || profileFields.arrivalDate);
  const checkOut = defaultCheckOut(departureDate || profileFields.departureDate);
  const sessionDate = arrivalDate || profileFields.arrivalDate || DEFAULT_SESSION_DATE;
  const setupSummary = getAccountSetupSummary(profileState);
  const showMatchScores = isSeekerComplete(profileState);

  const unreadNotifications = getUnreadNotificationCount();
  const incomingBadgeCount =
    (canAcceptGuideSessions && guideIncoming.length > 0
      ? guideIncoming.length
      : 0) +
    (canAcceptHostBookings && hostIncoming.length > 0 ? hostIncoming.length : 0);
  const tabBarItems = tabBarWithBadges(unreadNotifications, incomingBadgeCount);

  const continueSeekerSetup = (
    navigation: NativeStackNavigationProp<AppStackParamList>,
  ) => {
    navigateContinueSetup(
      navigation,
      'SEEKER',
      primaryIntent,
      getNextStep,
      startSetup,
    );
  };

  const continueHostSetup = (navigation: NativeStackNavigationProp<AppStackParamList>) => {
    if (!canEnableHostProvider) {
      return;
    }
    navigateContinueSetup(
      navigation,
      'HOST',
      primaryIntent,
      getNextStep,
      startSetup,
    );
  };

  const continueGuideSetup = (navigation: NativeStackNavigationProp<AppStackParamList>) => {
    if (!canEnableGuideProvider) {
      return;
    }
    navigateContinueSetup(
      navigation,
      'GUIDE',
      primaryIntent,
      getNextStep,
      startSetup,
    );
  };

  const handleDevPreset = (
    navigation: NativeStackNavigationProp<AppStackParamList>,
    options: {
      preset: AccountProfileState;
      navigateTo: DevHomeRoute;
      resumeTrack?: SetupTrack;
    },
  ) => {
    void (async () => {
      await applyDevPreset(options.preset);
      syncFieldsFromProfileState(options.preset, user?.displayName ?? 'Guest', {
        setCity,
        setUniversity,
        setArrivalDate,
        setDepartureDate,
        setDisplayName,
        setBio,
      });
      if (options.resumeTrack) {
        navigateContinueSetup(
          navigation,
          options.resumeTrack,
          options.preset.primaryIntent,
          (track) => {
            if (track === 'SEEKER') {
              const steps = getStepsForTrack('SEEKER', options.preset.primaryIntent);
              return steps.find(
                (step) =>
                  !options.preset.seekerSetup.stepsCompleted.includes(step),
              ) ?? null;
            }
            if (track === 'HOST') {
              return getStepsForTrack('HOST', options.preset.primaryIntent).find(
                (step) =>
                  !options.preset.hostProvider.stepsCompleted.includes(step),
              ) ?? null;
            }
            return getStepsForTrack('GUIDE', options.preset.primaryIntent).find(
              (step) =>
                !options.preset.guideProvider.stepsCompleted.includes(step),
            ) ?? null;
          },
          startSetup,
        );
        return;
      }
      resetToDevRoute(navigation, options.navigateTo);
    })();
  };

  const navigateHome = (navigation: NativeStackNavigationProp<AppStackParamList>) => {
    navigateToHome(navigation, homeRouteKey);
  };

  const handleTabPress = (
    navigation: NativeStackNavigationProp<AppStackParamList>,
    tabId: string,
  ) => {
    if (tabId === 'home') {
      navigateHome(navigation);
    }
    if (tabId === 'search') {
      navigation.navigate('UnifiedSearch');
    }
    if (tabId === 'bookings') {
      navigation.navigate('StudentBookings');
    }
    if (tabId === 'profile') {
      navigation.navigate('Profile');
    }
  };

  const syncOnboardingFields = (track: SetupTrack) => {
    const progress = getProgressForTrack(profileState, track);
    setCity(progress.data.city ?? '');
    setUniversity(progress.data.university ?? '');
    setArrivalDate(progress.data.arrivalDate ?? '');
    setDepartureDate(progress.data.departureDate ?? '');
    setDisplayName(progress.data.displayName ?? user?.displayName ?? '');
    setBio(progress.data.bio ?? '');
  };

  const setupTracks = useMemo(() => {
    const tracks: SetupTrack[] = ['SEEKER', 'HOST', 'GUIDE'];
    return tracks.map((track) => {
      const progress = getProgressForTrack(profileState, track);
      const steps = getStepsForTrack(track, primaryIntent);
      const blocked =
        (track === 'HOST' && !canEnableHostProvider) ||
        (track === 'GUIDE' && !canEnableGuideProvider);
      return {
        track,
        status: progress.status,
        progressPercent: getProgressPercent(progress, steps),
        blocked,
        blockedMessage: blocked ? providerBlockedReason ?? undefined : undefined,
      };
    });
  }, [
    profileState,
    primaryIntent,
    canEnableHostProvider,
    canEnableGuideProvider,
    providerBlockedReason,
  ]);

  const firstName = resolvedName.split(' ')[0] || resolvedName;

  const matchSubtitle = formatMatchSubtitle(profileState.seekerSetup.data.quizAnswers);
  const personalizedGreeting = getPersonalizedGreeting(firstName);

  const matchSearchProps = useMemo(
    () => ({
      defaults: {
        ...matchSearchDefaults,
        destinationCity: cityLabel.split(',')[0]?.trim() || cityLabel,
        checkIn,
        checkOut,
      },
      results: sampleMatchResults,
    }),
    [cityLabel, checkIn, checkOut],
  );

  const navigateToMatchSearch = (
    navigation: NativeStackNavigationProp<AppStackParamList>,
  ) => {
    navigation.navigate('MatchSearch');
  };

  const homeProps = useMemo(
    () => ({
      ...studentHomeMockData,
      greeting: personalizedGreeting,
      userName: firstName,
      userInitials: resolvedInitials,
      activeTabId: 'home',
      tabBarItems,
      showMatchScores,
      matchAlert: {
        ...studentHomeMockData.matchAlert,
        subtitle: matchSubtitle,
      },
      hostsSectionTitle: showMatchScores
        ? 'Suggested hosts'
        : `Popular stays in ${cityLabel}`,
    }),
    [firstName, resolvedInitials, tabBarItems, showMatchScores, cityLabel, personalizedGreeting, matchSubtitle],
  );

  const bookingsTabProps = useMemo(
    () => ({
      bookings,
      activeFilter: bookingFilter,
      tabBarItems,
      activeTabId: 'bookings',
      showHostReviewEntry: canAcceptHostBookings,
      showGuideReviewEntry: canAcceptGuideSessions,
    }),
    [
      bookings,
      bookingFilter,
      canAcceptHostBookings,
      canAcceptGuideSessions,
      tabBarItems,
    ],
  );

  const browseHomeProps = useMemo(
    () => ({
      greeting: personalizedGreeting,
      userName: firstName,
      userInitials: resolvedInitials,
      cityLabel,
      sections: exploreSectionsMock,
      suggestedGuides: suggestedGuidesMock,
      suggestedHosts: studentHomeMockData.suggestedHosts,
      tabBarItems,
      activeTabId: 'home',
      showSetupBanner: false,
      showMatchScores,
      guidesEmptyState: emptyStates.discoveryGuides(cityLabel),
      hostsEmptyState: emptyStates.discoveryHosts(cityLabel),
    }),
    [firstName, resolvedInitials, cityLabel, tabBarItems, showMatchScores, personalizedGreeting],
  );

  const exploreHomeProps = useMemo(
    () => ({
      greeting: getPersonalizedGreeting(firstName),
      userName: firstName,
      userInitials: resolvedInitials,
      cityLabel,
      sections: exploreSectionsMock,
      suggestedGuides: suggestedGuidesMock,
      suggestedHosts: studentHomeMockData.suggestedHosts,
      tabBarItems,
      activeTabId: 'home',
      savedLodgingCount: savedLodgingIds.length,
      showMatchScores,
      guidesEmptyState: emptyStates.discoveryGuides(cityLabel),
      hostsEmptyState: emptyStates.discoveryHosts(cityLabel),
    }),
    [
      firstName,
      resolvedInitials,
      cityLabel,
      tabBarItems,
      savedLodgingIds.length,
      showMatchScores,
    ],
  );

  const initialRoute = primaryIntent
    ? homeRouteToScreenName(homeRouteKey)
    : 'IntentSelect';

  const makeBookingContext = (
    bookingType: 'HOST' | 'GUIDE',
    override?: BookingContext,
  ): BookingContext => override ?? getBookingContext(bookingType);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="IntentSelect">
        {({ navigation }) => (
          <IntentSelectScreen
            {...intentSelectMock}
            options={intentOptionsFromPrimary()}
            selectedIntent={pendingIntent ?? primaryIntent}
            onSelect={setPendingIntent}
            onContinue={async () => {
              const intent = pendingIntent ?? primaryIntent;
              if (!intent) {
                return;
              }
              await setPrimaryIntent(intent);
              navigatePrimaryOnboarding(navigation, intent);
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="BrowseHome">
        {({ navigation }) => (
          <BrowseHomeScreen
            {...browseHomeProps}
            onSectionPress={(sectionId) => {
              if (sectionId === 'guides') {
                navigation.navigate('GuideSearch');
              }
              if (sectionId === 'homestays') {
                navigation.navigate('HostProfile', { hostId: 'host-1' });
              }
              if (sectionId === 'lodging') {
                navigation.navigate('LodgingDirectory');
              }
              if (sectionId === 'sites') {
                navigation.navigate('TouristSiteDetail', { siteId: 'site-1' });
              }
            }}
            onGuidePress={(guideId) => navigation.navigate('GuideProfile', { guideId })}
            onHostPress={(hostId) => navigation.navigate('HostProfile', { hostId })}
            onTabPress={(tabId) => handleTabPress(navigation, tabId)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Profile">
        {({ navigation }) => (
          <ProfileScreen
            userName={resolvedName}
            userInitials={resolvedInitials}
            email={user?.email ?? ''}
            setupSummary={setupSummary}
            tabBarItems={tabBarItems}
            activeTabId="profile"
            onAccountSetupPress={() => navigation.navigate('AccountSetup')}
            onSignOut={() => {
              void signOut();
            }}
            onDevTestingPress={() => navigation.navigate('DevTesting')}
            onResetDemo={() => {
              void (async () => {
                await resetAccountProfile();
                await signOut();
              })();
            }}
            onTabPress={(tabId) => handleTabPress(navigation, tabId)}
          />
        )}
      </Stack.Screen>

      {__DEV__ ? (
        <Stack.Screen name="DevTesting">
          {({ navigation }) => (
            <DevTestingScreen
              isActiveExchangeStudent={isActiveExchangeStudent}
              onBack={() => navigation.goBack()}
              onApplyPreset={(options) => handleDevPreset(navigation, options)}
              onToggleExchangeStudent={(active) => {
                void setIsActiveExchangeStudent(active);
              }}
              onResetDemo={() => {
                void (async () => {
                  await resetAccountProfile();
                  await signOut();
                })();
              }}
            />
          )}
        </Stack.Screen>
      ) : null}

      <Stack.Screen name="AccountSetup">
        {({ navigation }) => (
          <AccountSetupScreen
            userName={resolvedName}
            userInitials={resolvedInitials}
            primaryIntent={primaryIntent}
            setupTracks={setupTracks}
            showExchangeStudentToggle={primaryIntent === 'STUDENT'}
            isNoLongerExchangeStudent={!isActiveExchangeStudent}
            onExchangeStudentToggle={() => {
              void setIsActiveExchangeStudent(!isActiveExchangeStudent);
            }}
            onBack={() => navigation.goBack()}
            onChangeIntent={() => navigation.navigate('IntentSelect')}
            onTrackPress={(track) => {
              syncOnboardingFields(track);
              const progress = getProgressForTrack(profileState, track);
              if (progress.status === 'COMPLETE') {
                return;
              }
              if (track === 'HOST' && !canEnableHostProvider) {
                return;
              }
              if (track === 'GUIDE' && !canEnableGuideProvider) {
                return;
              }
              navigateContinueSetup(
                navigation,
                track,
                primaryIntent,
                getNextStep,
                startSetup,
              );
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="UnifiedSearch">
        {({ navigation }) => (
          <UnifiedSearchScreen
            userName={firstName}
            userInitials={resolvedInitials}
            cityLabel={cityLabel}
            categories={SEARCH_CATEGORIES}
            tabBarItems={tabBarItems}
            activeTabId="search"
            onBack={() => navigation.goBack()}
            onCategoryPress={(categoryId) => {
              if (categoryId === 'homestays') {
                if (primaryIntent === 'STUDENT') {
                  navigateToMatchSearch(navigation);
                  return;
                }
                navigation.navigate('HostProfile', { hostId: 'host-1' });
              }
              if (categoryId === 'guides') {
                navigation.navigate('GuideSearch');
              }
              if (categoryId === 'lodging') {
                navigation.navigate('LodgingDirectory');
              }
            }}
            onTabPress={(tabId) => handleTabPress(navigation, tabId)}
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
            onContinue={() => {
              void completeStep('SEEKER', 'destination', {
                city,
                university,
                arrivalDate,
                departureDate,
              });
              navigation.navigate(
                primaryIntent === 'STUDENT' ? 'StudentQuiz' : 'TouristQuiz',
                { track: 'SEEKER' },
              );
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StudentQuiz">
        {({ navigation }) => (
          <StudentQuizScreen
            onFinish={(answers) => {
              void completeStep('SEEKER', 'quiz', { quizAnswers: answers });
              navigation.navigate('ProfileSetup', { track: 'SEEKER' });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostQuiz">
        {({ navigation }) => (
          <HostQuizScreen
            onFinish={(answers) => {
              void completeStep('HOST', 'quiz', { quizAnswers: answers });
              navigation.navigate('ProfileSetup', { track: 'HOST' });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TouristQuiz">
        {({ navigation }) => (
          <TouristQuizScreen
            onFinish={(answers) => {
              void completeStep('SEEKER', 'quiz', { quizAnswers: answers });
              navigation.navigate('ProfileSetup', { track: 'SEEKER' });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideQuiz">
        {({ navigation }) => (
          <GuideQuizScreen
            onFinish={(answers) => {
              void completeStep('GUIDE', 'quiz', { quizAnswers: answers });
              navigation.navigate('ProfileSetup', { track: 'GUIDE' });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProfileSetup">
        {({ navigation, route }) => {
          const track = route.params.track;
          return (
            <ProfileSetupScreen
              currentStep={3}
              totalSteps={ONBOARDING_TOTAL_STEPS}
              {...profileSetupMock}
              displayName={displayName}
              bio={bio}
              initials={resolvedInitials}
              onDisplayNameChange={setDisplayName}
              onBioChange={setBio}
              onContinue={() => {
                const profileName =
                  displayName.trim() || user?.displayName?.trim() || '';
                void completeStep(track, 'profile', {
                  displayName: profileName,
                  bio,
                });
                if (profileName && profileName !== displayName) {
                  setDisplayName(profileName);
                }
                navigation.navigate('OnboardingReady', { track });
              }}
              onSkip={() => {
                const profileName =
                  displayName.trim() || user?.displayName?.trim() || '';
                void completeStep(track, 'profile', {
                  displayName: profileName,
                  bio,
                });
                if (profileName && profileName !== displayName) {
                  setDisplayName(profileName);
                }
                navigation.navigate('OnboardingReady', { track });
              }}
              onBack={() => navigation.goBack()}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="OnboardingReady">
        {({ navigation, route }) => {
          const track = route.params.track;
          const destination =
            city || profileFields.city || 'your destination';
          const readyCopy = onboardingReadyCopy(primaryIntent ?? 'STUDENT', {
            destination,
            university: university || profileFields.university,
            city: city || profileFields.city,
          });
          return (
            <OnboardingReadyScreen
              userName={resolvedName}
              subtitle={readyCopy.subtitle}
              matchHint={readyCopy.matchHint}
              ctaLabel={readyCopy.ctaLabel}
              roleLabel={readyCopy.roleLabel}
              onEnterDashboard={async () => {
                await completeStep(track, 'ready');
                await markTrackComplete(track);
                if (track === 'SEEKER' && primaryIntent === 'STUDENT') {
                  setBookings(studentBookingsMock);
                }
                if (track === 'SEEKER' && primaryIntent === 'TOURIST') {
                  setBookings(touristBookingsMock);
                }
                let nextHome: keyof AppStackParamList = 'BrowseHome';
                if (primaryIntent === 'STUDENT') {
                  nextHome = 'StudentHome';
                } else if (primaryIntent === 'TOURIST') {
                  nextHome = 'ExploreHome';
                } else if (primaryIntent === 'HOST') {
                  nextHome = 'HostHome';
                } else if (primaryIntent === 'GUIDE') {
                  nextHome = 'GuideHome';
                }
                navigation.reset({
                  index: 0,
                  routes: [{ name: nextHome }],
                });
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="StudentHome">
        {({ navigation }) => (
          <StudentHomeDashboard
            {...homeProps}
            onSearchPress={() => navigateToMatchSearch(navigation)}
            onMatchAlertPress={() => navigateToMatchSearch(navigation)}
            onSeeAllHostsPress={() => navigateToMatchSearch(navigation)}
            onQuickActionPress={(actionId) => {
              if (actionId === 'bookings') {
                navigation.navigate('StudentBookings');
              }
              if (actionId === 'guides') {
                navigation.navigate('GuideSearch');
              }
              if (actionId === 'find-hosts') {
                navigateToMatchSearch(navigation);
              }
              if (actionId === 'sos') {
                navigation.navigate('SOS');
              }
            }}
            onHostPress={(hostId) => navigation.navigate('HostProfile', { hostId })}
            onTabPress={(tabId) => handleTabPress(navigation, tabId)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ExploreHome">
        {({ navigation }) => (
          <ExploreHomeScreen
            {...exploreHomeProps}
            onSectionPress={(sectionId) => {
              if (sectionId === 'guides') {
                navigation.navigate('GuideSearch');
              }
              if (sectionId === 'homestays') {
                navigation.navigate('HostProfile', { hostId: 'host-1' });
              }
              if (sectionId === 'lodging') {
                navigation.navigate('LodgingDirectory');
              }
              if (sectionId === 'sites') {
                navigation.navigate('TouristSiteDetail', { siteId: 'site-1' });
              }
            }}
            onGuidePress={(guideId) =>
              navigation.navigate('GuideProfile', { guideId })
            }
            onHostPress={(hostId) => navigation.navigate('HostProfile', { hostId })}
            onTabPress={(tabId) => handleTabPress(navigation, tabId)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostHome">
        {({ navigation }) => {
          const welcome = providerWelcome.host(firstName);
          const hostSubtitle =
            hostIncoming.length > 0
              ? `${hostIncoming.length} students want to stay with you`
              : 'No pending requests';
          return (
            <ProviderHomeDashboard
              greeting={personalizedGreeting}
              userName={firstName}
              userInitials={resolvedInitials}
              welcomeLine={welcome.line}
              requestsTitle="Homestay requests"
              requestsSubtitle={hostSubtitle}
              requests={hostIncoming}
              emptyState={emptyStates.hostRequests}
              tabBarItems={tabBarItems}
              activeTabId="home"
              onRequestPress={(requestId) =>
                navigation.navigate('MatchRequestReview', { requestId })
              }
              onTabPress={(tabId) => handleTabPress(navigation, tabId)}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="GuideHome">
        {({ navigation }) => {
          const welcome = providerWelcome.guide(firstName);
          const guideSubtitle =
            guideIncoming.length > 0
              ? `${guideIncoming.length} pending tour requests`
              : 'No pending requests';
          return (
            <ProviderHomeDashboard
              greeting={personalizedGreeting}
              userName={firstName}
              userInitials={resolvedInitials}
              welcomeLine={welcome.line}
              requestsTitle="Session requests"
              requestsSubtitle={guideSubtitle}
              requests={guideIncoming}
              emptyState={emptyStates.guideRequests}
              tabBarItems={tabBarItems}
              activeTabId="home"
              onRequestPress={(requestId) =>
                navigation.navigate('SessionReview', { requestId })
              }
              onTabPress={(tabId) => handleTabPress(navigation, tabId)}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="StudentBookings">
        {({ navigation }) => (
          <StudentBookingsScreen
            {...bookingsTabProps}
            onFilterChange={setBookingFilter}
            payBlocked={!canBookHomestay && !canBookGuideSession}
            payBlockedMessage="Complete your travel profile to pay for bookings."
            onContinueSetupPay={() => continueSeekerSetup(navigation)}
            onPayPress={(bookingId) => {
              if (!canBookHomestay && !canBookGuideSession) {
                return;
              }
              const booking = bookings.find((b) => b.id === bookingId);
              if (booking) {
                navigation.navigate('BookingConfirmed', { bookingId: booking.id });
              }
            }}
            onTabPress={(tabId) => handleTabPress(navigation, tabId)}
            onBack={
              navigation.canGoBack()
                ? () => handleBookingsBack(navigation, homeRouteKey)
                : undefined
            }
            onHostReviewPress={() => navigation.navigate('IncomingRequests')}
            onGuideReviewPress={() => navigation.navigate('IncomingSessionRequests')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="MatchSearch">
        {({ navigation }) => (
          <MatchSearchScreen
            {...matchSearchProps}
            onBack={() => navigation.goBack()}
            onHostPress={(hostId) =>
              navigation.navigate('HostProfile', { hostId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostProfile">
        {({ navigation, route }) => {
          const host = hostSummaryFromId(route.params.hostId);
          return (
            <HostProfileScreen
              host={host}
              showMatchScores={showMatchScores}
              onBack={() => navigation.goBack()}
              onBookPress={() => {
                if (!canBookHomestay) {
                  continueSeekerSetup(navigation);
                  return;
                }
                navigation.navigate('Booking', {
                  hostId: host.id,
                  bookingContext: makeBookingContext('HOST'),
                });
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="Booking">
        {({ navigation, route }) => {
          const host = hostSummaryFromId(route.params.hostId);
          const bookingContext = makeBookingContext('HOST', route.params.bookingContext);
          const priceBreakdown = computePriceBreakdown(
            host.pricePerNight,
            host.currency,
            checkIn,
            checkOut,
          );
          return (
            <BookingScreen
              host={host}
              showMatchScores={showMatchScores}
              checkIn={checkIn}
              checkOut={checkOut}
              priceBreakdown={priceBreakdown}
              requestBlocked={!canBookHomestay}
              requestBlockedMessage={bookingGateCopy.homestay}
              onContinueSetup={() => continueSeekerSetup(navigation)}
              onBack={() => navigation.goBack()}
              onSendRequest={() => {
                const newBooking: BookingListItem = {
                  id: `booking-${Date.now()}`,
                  bookingType: 'HOST',
                  bookingContext,
                  seekerRole: bookingContextToSeekerRole(bookingContext),
                  hostId: host.id,
                  hostName: host.name,
                  hostInitials: host.initials,
                  hostLocation: host.location,
                  hostIcon: host.icon,
                  checkIn,
                  checkOut,
                  status: 'PENDING_HOST',
                  priceBreakdown,
                  cancellationPolicy: host.cancellationPolicy,
                  createdAt: new Date().toISOString().slice(0, 10),
                };
                setBookings((prev) => [newBooking, ...prev]);
                setBookingFilter('pending');
                navigation.navigate('StudentBookings');
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="BookingConfirmed">
        {({ navigation, route }) => {
          const booking = bookings.find((b) => b.id === route.params.bookingId);
          const fallback = bookings.find((b) => b.status === 'ACCEPTED') ?? bookings[0];
          const resolved = booking ?? fallback;
          return (
            <BookingConfirmedScreen
              hostName={resolved.hostName}
              checkIn={resolved.checkIn}
              checkOut={resolved.checkOut}
              totalAmount={resolved.priceBreakdown.total}
              currency={resolved.priceBreakdown.currency}
              onViewBookings={() => {
                setBookings((prev) =>
                  prev.map((b) =>
                    b.id === resolved.id
                      ? { ...b, status: 'CONFIRMED' as const }
                      : b,
                  ),
                );
                setBookingFilter('active');
                resetToBookingsTab(navigation, homeRouteKey);
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="GuideSearch">
        {({ navigation }) => (
          <GuideSearchScreen
            title="Find a guide"
            subtitle="Tours, orientation, and cultural experiences"
            cityLabel={cityLabel}
            guides={suggestedGuidesMock}
            showMatchScores={showMatchScores}
            onBack={() => navigation.goBack()}
            onGuidePress={(guideId) =>
              navigation.navigate('GuideProfile', { guideId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideProfile">
        {({ navigation, route }) => {
          const guide = guideSummaryFromId(route.params.guideId);
          return (
            <GuideProfileDetailScreen
              guide={guide}
              showMatchScores={showMatchScores}
              onBack={() => navigation.goBack()}
              onBookPress={() => {
                if (!canBookGuideSession) {
                  continueSeekerSetup(navigation);
                  return;
                }
                navigation.navigate('SessionBooking', {
                  guideId: guide.id,
                  bookingContext: makeBookingContext('GUIDE'),
                });
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="SessionBooking">
        {({ navigation, route }) => {
          const guide = guideSummaryFromId(route.params.guideId);
          const bookingContext = makeBookingContext('GUIDE', route.params.bookingContext);
          const sessionPrice = computeSessionPrice(
            guide.pricePerSession,
            guide.currency,
          );
          return (
            <SessionBookingScreen
              guide={guide}
              sessionDate={sessionDate}
              sessionStartTime={DEFAULT_SESSION_TIME}
              sessionPrice={sessionPrice}
              requestBlocked={!canBookGuideSession}
              requestBlockedMessage={bookingGateCopy.guide}
              onContinueSetup={() => continueSeekerSetup(navigation)}
              onBack={() => navigation.goBack()}
              onSendRequest={() => {
                const newBooking: BookingListItem = {
                  id: `booking-${Date.now()}`,
                  bookingType: 'GUIDE',
                  bookingContext,
                  seekerRole: bookingContextToSeekerRole(bookingContext),
                  hostId: guide.id,
                  hostName: guide.name,
                  hostInitials: guide.initials,
                  hostLocation: guide.location,
                  hostIcon: guide.icon,
                  checkIn: sessionDate,
                  checkOut: sessionDate,
                  status: 'PENDING_HOST',
                  session: {
                    sessionDate,
                    sessionStartTime: DEFAULT_SESSION_TIME,
                    durationHours: guide.sessionDurationHours,
                  },
                  priceBreakdown: {
                    nightlyRate: 0,
                    currency: guide.currency,
                    nights: 0,
                    subtotal: 0,
                    platformFee: 0,
                    total: 0,
                  },
                  sessionPrice,
                  cancellationPolicy: guide.cancellationPolicy,
                  createdAt: new Date().toISOString().slice(0, 10),
                };
                setBookings((prev) => [newBooking, ...prev]);
                setBookingFilter('pending');
                navigation.navigate('StudentBookings');
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="LodgingDirectory">
        {({ navigation }) => (
          <LodgingDirectoryScreen
            cityLabel={cityLabel}
            listings={lodgingDirectoryMock}
            activeFilter={lodgingFilter}
            savedCount={savedLodgingIds.length}
            onFilterChange={setLodgingFilter}
            onBack={() => navigation.goBack()}
            onListingPress={(listingId) =>
              navigation.navigate('LodgingDetail', { listingId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="LodgingDetail">
        {({ navigation, route }) => {
          const listing = listingFromId(route.params.listingId);
          const isSaved = savedLodgingIds.includes(listing.id);
          return (
            <LodgingDetailScreen
              listing={listing}
              isSaved={isSaved}
              onBack={() => navigation.goBack()}
              onSaveContact={() => {
                setSavedLodgingIds((prev) =>
                  prev.includes(listing.id) ? prev : [...prev, listing.id],
                );
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="SOS">
        {({ navigation }) => (
          <SOSScreen
            emergencyContacts={emergencyContactsMock}
            onBack={() => navigation.goBack()}
            onCallEmergencyServices={() => dialPhoneNumber(localEmergencyNumber)}
            onContactCallPress={(contact) => dialPhoneNumber(contact.number)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TouristSiteDetail">
        {({ navigation, route }) => (
          <TouristSiteDetailScreen
            site={touristSiteFromId(route.params.siteId)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="IncomingRequests">
        {({ navigation }) => (
          <IncomingRequestsScreen
            requests={hostIncoming}
            title="Homestay requests"
            subtitle={`${hostIncoming.length} students want to stay with you`}
            onBack={() => navigation.goBack()}
            onRequestPress={(requestId) =>
              navigation.navigate('MatchRequestReview', { requestId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="IncomingSessionRequests">
        {({ navigation }) => (
          <IncomingRequestsScreen
            requests={guideIncoming}
            title="Session requests"
            subtitle={`${guideIncoming.length} pending tour requests`}
            onBack={() => navigation.goBack()}
            onRequestPress={(requestId) =>
              navigation.navigate('SessionReview', { requestId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="MatchRequestReview">
        {({ navigation, route }) => {
          const request =
            hostIncoming.find((r) => r.id === route.params.requestId) ??
            incomingBookingRequestsMock[0];
          return (
            <MatchRequestReviewScreen
              request={request}
              acceptBlocked={!canAcceptHostBookings}
              acceptBlockedMessage="Complete your host listing to accept homestay requests."
              onContinueSetup={() => continueHostSetup(navigation)}
              onBack={() => navigation.goBack()}
              onAccept={() => {
                setHostIncoming((prev) => prev.filter((r) => r.id !== request.id));
                navigation.navigate('IncomingRequests');
              }}
              onDecline={() => {
                setHostIncoming((prev) => prev.filter((r) => r.id !== request.id));
                navigation.navigate('IncomingRequests');
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="SessionReview">
        {({ navigation, route }) => {
          const request =
            guideIncoming.find((r) => r.id === route.params.requestId) ??
            incomingSessionRequestsMock[0];
          return (
            <SessionReviewScreen
              request={request}
              acceptBlocked={!canAcceptGuideSessions}
              acceptBlockedMessage="Complete your guide listing to accept session requests."
              onContinueSetup={() => continueGuideSetup(navigation)}
              onBack={() => navigation.goBack()}
              onAccept={() => {
                setGuideIncoming((prev) => prev.filter((r) => r.id !== request.id));
                navigation.navigate('IncomingSessionRequests');
              }}
              onDecline={() => {
                setGuideIncoming((prev) => prev.filter((r) => r.id !== request.id));
                navigation.navigate('IncomingSessionRequests');
              }}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
