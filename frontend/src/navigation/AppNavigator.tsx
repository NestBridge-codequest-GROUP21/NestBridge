import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, View, StyleSheet } from 'react-native';
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
import MatchSearchScreen, {
  matchSearchDefaults,
} from '../screens/student/MatchSearchScreen';
import type { MatchSearchDefaults } from '../screens/student/MatchSearchScreen';
import BookingConfirmedScreen from '../screens/student/BookingConfirmedScreen';
import IncomingRequestsScreen from '../screens/host/IncomingRequestsScreen';
import ProviderHomeDashboard from '../screens/host/ProviderHomeDashboard';
import MatchRequestReviewScreen from '../screens/host/MatchRequestReviewScreen';
import SessionReviewScreen from '../screens/guide/SessionReviewScreen';
import GuideSearchScreen from '../screens/shared/GuideSearchScreen';
import MessagesTabScreen from '../screens/shared/MessagesTabScreen';
import ChatRoute from './ChatRoute';
import SiteDetailRoute from './SiteDetailRoute';
import VideoDetailRoute from './VideoDetailRoute';
import VideoLibraryScreen from '../screens/shared/VideoLibraryScreen';
import RouteErrorState from '../components/RouteErrorState';
import StackSosLayout from '../components/StackSosLayout';
import { BookingHostRoute, SessionBookingGuideRoute } from './bookingRoutes';
import SponsorListScreen from '../screens/Sponsor/SponsorListScreen';
import SponsorDetailScreen from '../screens/Sponsor/SponsorDetailScreen';
import SponsorApplicationScreen from '../screens/Sponsor/SponsorApplicationScreen';
import KYCPromptScreen from '../screens/host/KYCPromptScreen';
import { SPONSORS_MOCK, getSponsorById } from '../data/sponsorsMock';
import { kycPromptForTrack } from '../data/kycPromptMock';
import HostRequestsTabScreen from '../screens/host/HostRequestsTabScreen';
import HostBookingsTabScreen from '../screens/host/HostBookingsTabScreen';
import HostEarningsTabScreen from '../screens/host/HostEarningsTabScreen';
import GuideBookingsTabScreen from '../screens/guide/GuideBookingsTabScreen';
import GuideEarningsTabScreen from '../screens/guide/GuideEarningsTabScreen';
import BrowseHomeScreen from '../screens/shared/BrowseHomeScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import AccountSetupScreen from '../screens/shared/AccountSetupScreen';
import DevTestingScreen from '../screens/shared/DevTestingScreen';
import UnifiedSearchScreen from '../screens/shared/UnifiedSearchScreen';
import ExploreHomeScreen from '../screens/tourist/ExploreHomeScreen';
import LodgingDirectoryScreen from '../screens/tourist/LodgingDirectoryScreen';
import LodgingDetailScreen from '../screens/tourist/LodgingDetailScreen';
import PrepChecklistScreen from '../screens/student/PrepChecklistScreen';
import StudentEventsScreen from '../screens/student/StudentEventsScreen';
import CreateEventScreen from '../screens/student/CreateEventScreen';
import { useStudentEvents } from '../hooks/useStudentEvents';
import type { StudentEventDraft } from '../data/studentEventsMock';
import LocalTipsScreen from '../screens/student/LocalTipsScreen';
import TransportGuideScreen from '../screens/student/TransportGuideScreen';
import ExploreStaysScreen from '../screens/tourist/ExploreStaysScreen';
import SitesDirectoryScreen from '../screens/tourist/SitesDirectoryScreen';
import WelfareCheckInScreen from '../screens/shared/WelfareCheckInScreen';
import ReviewPromptScreen from '../screens/shared/ReviewPromptScreen';
import { useLodgingPartners, lodgingListingFromId } from '../hooks/useLodgingPartners';
import OfflineMapScreen from '../screens/tourist/OfflineMapScreen';
import HostCalendarScreen from '../screens/host/HostCalendarScreen';
import HostListingsScreen from '../screens/host/HostListingsScreen';
import TourTypesSetupScreen from '../screens/guide/TourTypesSetupScreen';
import GuideAvailabilityScreen from '../screens/guide/GuideAvailabilityScreen';
import SOSScreen from '../screens/shared/SOSScreen';
import { HostProfileRoute, GuideProfileRoute } from './profileRoutes';
import type {
  BookingContext,
  BookingListItem,
  BookingTabFilter,
  GuideProfileSummary,
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
  navigateContinueSetup,
  navigatePrimaryOnboarding,
} from './onboardingNavigation';
import type { AppStackParamList } from './types';
import {
  culturalGuidanceItemsForRole,
  shouldShowTravelBookingEntry,
} from '../data/profileHub';
import {
  guideTourSectionsFromTypes,
  handleProfileCulturalItem,
  mainTabSosProps,
  shouldWrapStackSos,
} from './mainTabSos';
import type { DevHomeRoute } from '../utils/devTestingPresets';
import type { AccountProfileState } from '../types/accountProfile';

import { useHomeApiData } from '../hooks/useHomeApiData';
import { useProviderTabData } from '../hooks/useProviderTabData';
import { useConversations } from '../hooks/useConversations';
import {
  usePhrases,
  useTopics,
  useTransport,
  useSites,
  useChecklist,
  useEmergencyContacts,
  useMapLandmarks,
  useVideos,
} from '../hooks/useContent';
import { handleTabPress, navigateToHome } from './tabRouting';
import {
  acceptBooking,
  confirmBooking,
  createBooking,
  createConversation,
  declineBooking,
  findMatches,
  getGuideProfile,
  getHostProfile,
  logSos,
  getApiErrorMessage,
} from '../services/api';
import { colors, spacing } from '../constants/theme';
import { studentHomeMockData, tabBarWithBadgesForRole } from '../data/studentHomeMock';
import {
  getQuickActionsForRole,
  homeRoleFromIntent,
} from '../data/homeNavigation';
import {
  hostFeaturedRequestMock,
  guideFeaturedTourMock,
  studentRecentActivityMock,
  touristRecentActivityMock,
} from '../data/homeContentMock';
import {
  destinationMock,
  profileSetupMock,
  intentSelectMock,
  ONBOARDING_TOTAL_STEPS,
} from '../data/studentOnboardingMock';
import {
  getUnreadNotificationCount,
  studentBookingsMock,
  incomingBookingRequestsMock,
} from '../data/bookingMock';
import { conversationsMock } from '../data/conversationsMock';
import { withDemoFallback } from '../utils/demoLiveMerge';
import {
  hostConfirmedStaysMock,
  guideUpcomingToursMock,
} from '../data/providerBookingsMock';
import {
  listingFromId,
} from '../data/lodgingDirectoryMock';
import { exploreSectionsMock } from '../data/touristExploreMock';
import { welfareCheckInQuestions } from '../data/welfareMock';
import {
  buildSearchMatchParams,
  hostMatchesToStayListings,
  matchToGuideSummary,
  matchToHostSummary,
  matchToMatchResultHost,
} from '../data/homeFeeds';
import type { ConversationListItem } from '../types/messaging';
import {
  hostCalendarDaysMock,
  hostActiveBookingMock,
  hostListingsMock,
  tourTypesMock,
  guideCalendarDaysMock,
} from '../data/featureScreensMock';
import {
  buildStudentHomeStatus,
  buildTouristHomeStatus,
  buildHostHomeStatus,
  buildGuideHomeStatus,
} from '../utils/liveHomeStatus';
import { getPersonalizedGreeting } from '../utils/greeting';
import {
  onboardingReadyCopyByTrack,
  bookingGateCopy,
  emptyStates,
  devTestingCopy,
} from '../data/appCopy';
import { DEMO_PASSWORD, type DemoAccount } from '../data/demoAccounts';

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

function touristSiteIdFromCarouselSection(
  sectionId: string,
  knownSiteKeys: string[] = [],
): string {
  if (sectionId === 'sites') return 'site-cape-coast';
  if (sectionId === 'site-food') return 'site-makola';
  if (knownSiteKeys.includes(sectionId)) return sectionId;
  return 'site-cape-coast';
}

function handleStudentQuickAction(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  actionId: string,
) {
  if (actionId === 'checklist') {
    navigation.navigate('PrepChecklist');
  }
  if (actionId === 'cultural-tips') {
    navigation.navigate('LocalTips');
  }
  if (actionId === 'transport') {
    navigation.navigate('TransportGuide');
  }
  if (actionId === 'sos') {
    navigation.navigate('SOS');
  }
}

function handleTouristQuickAction(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  actionId: string,
) {
  if (actionId === 'book-guide') {
    navigation.navigate('GuideSearch');
  }
  if (actionId === 'explore-stays') {
    navigation.navigate('ExploreStays');
  }
  if (actionId === 'offline-map') {
    navigation.navigate('OfflineMap');
  }
  if (actionId === 'sos') {
    navigation.navigate('SOS');
  }
}

function handleProviderQuickAction(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  actionId: string,
  role: 'host' | 'guide',
) {
  if (actionId === 'listings') {
    navigation.navigate('HostListings');
  }
  if (actionId === 'availability') {
    // Manage open slots. Guides use the availability calendar; hosts use their
    // stay calendar as the equivalent slot-management surface.
    navigation.navigate(role === 'guide' ? 'GuideAvailability' : 'HostCalendar');
  }
  if (actionId === 'calendar') {
    // View committed schedule. Distinct from availability: hosts have a stay
    // calendar; guides see their booked sessions on the bookings tab.
    if (role === 'guide') {
      navigation.reset({ index: 0, routes: [{ name: 'GuideBookingsTab' }] });
    } else {
      navigation.navigate('HostCalendar');
    }
  }
  if (actionId === 'tour-types') {
    navigation.navigate('TourTypesSetup');
  }
  if (actionId === 'earnings') {
    if (role === 'guide') {
      navigation.reset({ index: 0, routes: [{ name: 'GuideEarningsTab' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'HostEarningsTab' }] });
    }
  }
  if (actionId === 'sos') {
    navigation.navigate('SOS');
  }
}

function handleExploreSectionPress(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  sectionId: string,
) {
  if (sectionId.startsWith('site-') || sectionId === 'sites') {
    if (sectionId === 'sites') {
      navigation.navigate('SitesDirectory');
      return;
    }
    navigation.navigate('TouristSiteDetail', {
      siteId: touristSiteIdFromCarouselSection(sectionId),
    });
    return;
  }
  if (sectionId === 'transport') {
    navigation.navigate('TransportGuide');
    return;
  }
  if (sectionId === 'greetings') {
    navigation.navigate('LocalTips');
    return;
  }
  if (sectionId === 'packing') {
    navigation.navigate('PrepChecklist');
    return;
  }
  if (sectionId === 'events') {
    navigation.navigate('StudentEvents');
    return;
  }
  navigation.navigate('TouristSiteDetail', {
    siteId: touristSiteIdFromCarouselSection(sectionId),
  });
}

function defaultCheckIn(arrivalDate: string): string {
  return arrivalDate || '2026-09-01';
}

function defaultCheckOut(departureDate: string): string {
  return departureDate || '2026-12-15';
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
  const { user, signOut, signIn } = useAuth();
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
  const [demoLoginBusy, setDemoLoginBusy] = useState(false);
  const [demoLoginError, setDemoLoginError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [bookingFilter, setBookingFilter] = useState<BookingTabFilter>('active');
  const [lodgingFilter, setLodgingFilter] = useState<LodgingCategoryFilter>('ALL');
  const [savedLodgingIds, setSavedLodgingIds] = useState<string[]>([]);
  const [checklistCompleted, setChecklistCompleted] = useState<string[]>(
    profileState.seekerSetup.data.checklistCompleted ?? [],
  );
  const [hostListings, setHostListings] = useState(hostListingsMock);
  const [tourTypes, setTourTypes] = useState(tourTypesMock);
  const [tourBaseRate, setTourBaseRate] = useState('45');
  const [tourMaxGroupSize, setTourMaxGroupSize] = useState('8');
  const [hostProfileCache, setHostProfileCache] = useState<Record<string, HostProfileSummary>>({});
  const [guideProfileCache, setGuideProfileCache] = useState<Record<string, GuideProfileSummary>>({});
  const conversationsApi = useConversations(user?.userId);
  const conversations = useMemo(
    () =>
      withDemoFallback(conversationsApi.conversations, conversationsMock, {
        isLoading: conversationsApi.isLoading,
        error: conversationsApi.error,
      }),
    [conversationsApi.conversations, conversationsApi.isLoading, conversationsApi.error],
  );
  const [completedWelfareCheckIns, setCompletedWelfareCheckIns] = useState<string[]>([]);
  const studentEventsApi = useStudentEvents(user?.userId);

  const homeApi = useHomeApiData(user?.userId, profileState, {
    fetchMatches: (primaryIntent === 'STUDENT' || primaryIntent === 'TOURIST') && !!user,
    fetchGuideMatches: (primaryIntent === 'TOURIST' || primaryIntent === 'STUDENT') && !!user,
    fetchHostIncoming: canAcceptHostBookings && !!user,
    fetchGuideIncoming: canAcceptGuideSessions && !!user,
    fetchBookings: !!user,
  });

  const providerTab = useProviderTabData(user?.userId, {
    fetchHostPending: primaryIntent === 'HOST' && !!user,
    fetchHostActive: primaryIntent === 'HOST' && !!user,
    fetchGuidePending: primaryIntent === 'GUIDE' && !!user,
    fetchGuideActive: primaryIntent === 'GUIDE' && !!user,
  });

  const hostPendingDisplay = useMemo(
    () =>
      withDemoFallback(providerTab.hostPending, incomingBookingRequestsMock, {
        isLoading: providerTab.isLoading,
        error: providerTab.error,
      }),
    [providerTab.hostPending, providerTab.isLoading, providerTab.error],
  );

  const hostActiveDisplay = useMemo(
    () =>
      withDemoFallback(providerTab.hostActiveBookings, hostConfirmedStaysMock, {
        isLoading: providerTab.isLoading,
        error: providerTab.error,
      }),
    [providerTab.hostActiveBookings, providerTab.isLoading, providerTab.error],
  );

  const guideActiveDisplay = useMemo(
    () =>
      withDemoFallback(providerTab.guideActiveBookings, guideUpcomingToursMock, {
        isLoading: providerTab.isLoading,
        error: providerTab.error,
      }),
    [providerTab.guideActiveBookings, providerTab.isLoading, providerTab.error],
  );

  const seekerSetupIncomplete = !!user && !isSeekerComplete(profileState);

  const hostIncoming = useMemo(
    () =>
      withDemoFallback(homeApi.hostIncoming, incomingBookingRequestsMock, {
        isLoading: homeApi.isLoading,
        error: homeApi.error,
      }),
    [homeApi.hostIncoming, homeApi.isLoading, homeApi.error],
  );
  const guideIncoming = useMemo(
    () =>
      withDemoFallback(
        homeApi.guideIncoming,
        incomingBookingRequestsMock.filter((r) => r.bookingType === 'GUIDE'),
        { isLoading: homeApi.isLoading, error: homeApi.error },
      ),
    [homeApi.guideIncoming, homeApi.isLoading, homeApi.error],
  );

  const displayBookings = useMemo(
    () =>
      withDemoFallback(homeApi.bookings, studentBookingsMock, {
        isLoading: homeApi.isLoading,
        error: homeApi.error,
      }),
    [homeApi.bookings, homeApi.isLoading, homeApi.error],
  );

  useEffect(() => {
    setBookings(displayBookings);
  }, [displayBookings]);

  useEffect(() => {
    if (homeApi.hostMatches.length === 0) return;
    setHostProfileCache((prev) => {
      const next = { ...prev };
      for (const match of homeApi.hostMatches) {
        if (match.targetType === 'HOST') {
          next[match.targetId] = matchToHostSummary(match);
        }
      }
      return next;
    });
  }, [homeApi.hostMatches]);

  useEffect(() => {
    if (homeApi.guideMatches.length === 0) return;
    setGuideProfileCache((prev) => {
      const next = { ...prev };
      for (const match of homeApi.guideMatches) {
        if (match.targetType === 'GUIDE') {
          next[match.targetId] = matchToGuideSummary(match);
        }
      }
      return next;
    });
  }, [homeApi.guideMatches]);

  const resolveHost = useCallback(
    (hostId: string): HostProfileSummary | null => hostProfileCache[hostId] ?? null,
    [hostProfileCache],
  );

  const resolveGuide = useCallback(
    (guideId: string): GuideProfileSummary | null => guideProfileCache[guideId] ?? null,
    [guideProfileCache],
  );

  const runMatchSearch = useCallback(
    async (params: MatchSearchDefaults) => {
      try {
        const matches = await findMatches(
          buildSearchMatchParams(profileState, {
            destinationCity: params.destinationCity,
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            budgetMax: params.budgetMax,
          }),
        );
        const hostMatches = matches.filter((m) => m.targetType === 'HOST');
        const results = hostMatches.map(matchToMatchResultHost);
        setHostProfileCache((prev) => {
          const next = { ...prev };
          for (const match of hostMatches) {
            next[match.targetId] = matchToHostSummary(match);
          }
          return next;
        });
        return { results };
      } catch (err) {
        return { results: [], error: getApiErrorMessage(err) };
      }
    },
    [profileState],
  );

  const openMessageWithParticipant = useCallback(
    async (
      navigation: NativeStackNavigationProp<AppStackParamList>,
      participant: {
        userId: string;
        name: string;
        initials: string;
        role: ConversationListItem['participantRole'];
      },
    ) => {
      const conv = await createConversation(participant.userId);
      const listItem: ConversationListItem = {
        id: conv.conversationId,
        participantId: participant.userId,
        participantName: participant.name,
        participantInitials: participant.initials,
        participantRole: participant.role,
        lastMessage: 'Conversation started',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        firebasePath: conv.firebasePath,
      };
      conversationsApi.upsertConversation(listItem);
      navigation.navigate('Chat', { conversationId: conv.conversationId });
    },
    [conversationsApi],
  );

  const messageHost = useCallback(
    async (
      navigation: NativeStackNavigationProp<AppStackParamList>,
      host: HostProfileSummary,
    ) => {
      let profile = host;
      if (!profile.userId) {
        profile = await getHostProfile(host.id);
        setHostProfileCache((prev) => ({ ...prev, [host.id]: profile }));
      }
      if (!profile.userId) return;
      await openMessageWithParticipant(navigation, {
        userId: profile.userId,
        name: profile.name,
        initials: profile.initials,
        role: 'host',
      });
    },
    [openMessageWithParticipant],
  );

  const messageGuide = useCallback(
    async (
      navigation: NativeStackNavigationProp<AppStackParamList>,
      guide: GuideProfileSummary,
    ) => {
      let profile = guide;
      if (!profile.userId) {
        profile = await getGuideProfile(guide.id);
        setGuideProfileCache((prev) => ({ ...prev, [guide.id]: profile }));
      }
      if (!profile.userId) return;
      await openMessageWithParticipant(navigation, {
        userId: profile.userId,
        name: profile.name,
        initials: profile.initials,
        role: 'guide',
      });
    },
    [openMessageWithParticipant],
  );

  const guideListForSearch = useMemo(
    () => homeApi.guideMatches.map(matchToGuideSummary),
    [homeApi.guideMatches],
  );

  const exploreStayListings = useMemo(
    () => hostMatchesToStayListings(homeApi.hostMatches),
    [homeApi.hostMatches],
  );

  const guideTourSections = useMemo(
    () => guideTourSectionsFromTypes(tourTypes),
    [tourTypes],
  );

  const profileCulturalItems = useMemo(
    () => culturalGuidanceItemsForRole(homeRoleFromIntent(primaryIntent)),
    [primaryIntent],
  );

  // Login name wins everywhere — profile displayName is only for editing, not greeting.
  const resolvedName =
    user?.displayName?.trim() || displayName.trim() || 'Guest';
  const resolvedInitials = getInitials(resolvedName);
  const homeRouteKey = getHomeRoute(profileState);
  const profileFields = getProfileFields(profileState);
  const cityLabel = profileFields.city || city || 'Accra';
  const lodgingApi = useLodgingPartners(cityLabel, !!user);
  const contentPhrases = usePhrases(cityLabel, !!user);
  const contentTopics = useTopics(cityLabel, !!user);
  const contentTransport = useTransport(cityLabel, !!user);
  const contentSites = useSites(cityLabel, !!user);
  const contentChecklist = useChecklist(cityLabel, !!user);
  const contentEmergency = useEmergencyContacts(!!user);
  const contentLandmarks = useMapLandmarks(cityLabel, !!user);
  const contentVideos = useVideos(cityLabel, undefined, !!user);

  const checklistTasks = useMemo(
    () =>
      contentChecklist.data.map((item) => ({
        id: item.itemKey,
        label: item.label,
        completed: checklistCompleted.includes(item.itemKey),
      })),
    [contentChecklist.data, checklistCompleted],
  );

  const sitesDirectoryItems = useMemo(
    () =>
      contentSites.data.map((site) => ({
        id: site.siteKey,
        name: site.name,
        city: site.city,
        description: site.description,
        admission: site.admission ?? '',
      })),
    [contentSites.data],
  );

  useEffect(() => {
    setChecklistCompleted(profileState.seekerSetup.data.checklistCompleted ?? []);
  }, [profileState.seekerSetup.data.checklistCompleted, user?.userId]);
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
  const homeRole = homeRoleFromIntent(primaryIntent);
  const tabBarItems = tabBarWithBadgesForRole(
    homeRole,
    unreadNotifications,
    incomingBadgeCount,
  );
  const hostTabBarItems = tabBarWithBadgesForRole(
    'HOST',
    unreadNotifications,
    hostIncoming.length,
  );
  const guideTabBarItems = tabBarWithBadgesForRole(
    'GUIDE',
    unreadNotifications,
    guideIncoming.length,
  );

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

  const handleDemoActorLogin = useCallback(async (account: DemoAccount) => {
    setDemoLoginError(null);
    setDemoLoginBusy(true);
    try {
      const ok = await signIn(account.email, DEMO_PASSWORD, true);
      if (!ok) {
        setDemoLoginError(devTestingCopy.demoActorsLoginError);
      }
    } finally {
      setDemoLoginBusy(false);
    }
  }, [signIn]);

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

  const routeTabPress = (
    navigation: NativeStackNavigationProp<AppStackParamList>,
    tabId: string,
    contextHomeRoute: HomeRoute = homeRouteKey,
  ) => {
    handleTabPress(navigation, tabId, homeRole, contextHomeRoute);
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

  const hostCalendarActiveBooking = useMemo(() => {
    const active = hostActiveDisplay[0];
    if (!active) {
      return hostActiveBookingMock;
    }
    const range =
      active.checkIn === active.checkOut
        ? active.checkIn
        : `${active.checkIn} – ${active.checkOut}`;
    return {
      guestName: active.guestName,
      dateRange: range,
      totalAmount: `GHS ${active.hostPayout.toLocaleString('en-GH')}`,
    };
  }, [hostActiveDisplay]);

  const personalizedGreeting = getPersonalizedGreeting(firstName);

  const navigateToMatchSearch = (
    navigation: NativeStackNavigationProp<AppStackParamList>,
  ) => {
    navigation.navigate('MatchSearch');
  };

  const matchSearchProps = useMemo(
    () => ({
      defaults: {
        ...matchSearchDefaults,
        destinationCity: cityLabel.split(',')[0]?.trim() || cityLabel,
        checkIn,
        checkOut,
      },
      onSearch: runMatchSearch,
    }),
    [cityLabel, checkIn, checkOut, runMatchSearch],
  );

  const homeDataError = homeApi.error;
  const isHomeLoading = homeApi.isLoading;
  const studentLive = buildStudentHomeStatus(
    bookings,
    cityLabel,
    seekerSetupIncomplete,
    homeDataError,
  );
  const touristLive = buildTouristHomeStatus(
    bookings,
    cityLabel,
    seekerSetupIncomplete,
    homeDataError,
  );
  const hostLive = buildHostHomeStatus(hostIncoming, providerTab.error ?? homeDataError);
  const guideLive = buildGuideHomeStatus(guideIncoming, providerTab.error ?? homeDataError);

  const homeProps = useMemo(
    () => ({
      ...studentHomeMockData,
      greeting: personalizedGreeting,
      userName: firstName,
      userInitials: resolvedInitials,
      activeTabId: 'home',
      tabBarItems,
      featuredMatch: homeApi.featuredMatch ?? undefined,
      suggestedHosts: homeApi.suggestedHosts,
      recommendedSectionTitle: 'Prep before you arrive',
      showMatchScores,
      isHomeLoading,
      homeDataError,
      statusLabel: studentLive.statusLabel,
      reminder: studentLive.reminder,
      recentActivity:
        studentLive.recentActivity.length > 0
          ? studentLive.recentActivity
          : studentRecentActivityMock,
      showSetupBanner: seekerSetupIncomplete && primaryIntent === 'STUDENT',
    }),
    [
      firstName,
      resolvedInitials,
      tabBarItems,
      personalizedGreeting,
      homeApi.featuredMatch,
      homeApi.suggestedHosts,
      showMatchScores,
      isHomeLoading,
      homeDataError,
      studentLive.statusLabel,
      studentLive.reminder,
      studentLive.recentActivity,
      seekerSetupIncomplete,
      primaryIntent,
    ],
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
      statusIcon: '🌍',
      statusLabel: touristLive.statusLabel,
      featuredGuide: homeApi.featuredGuide ?? undefined,
      quickActions: getQuickActionsForRole('BROWSE'),
      sections: exploreSectionsMock,
      exploreSectionTitle: `Explore ${cityLabel.split(',')[0]?.trim() || cityLabel}`,
      recentActivity:
        touristLive.recentActivity.length > 0
          ? touristLive.recentActivity
          : touristRecentActivityMock,
      reminder: touristLive.reminder,
      tabBarItems,
      activeTabId: 'home',
      showSetupBanner: false,
    }),
    [firstName, resolvedInitials, cityLabel, tabBarItems, personalizedGreeting, touristLive, homeApi.featuredGuide],
  );

  const exploreHomeProps = useMemo(
    () => ({
      greeting: getPersonalizedGreeting(firstName),
      userName: firstName,
      userInitials: resolvedInitials,
      cityLabel,
      statusIcon: '🌍',
      statusLabel: touristLive.statusLabel,
      featuredGuide: homeApi.featuredGuide ?? undefined,
      suggestedGuides: homeApi.suggestedGuides,
      showMatchScores,
      isHomeLoading,
      homeDataError,
      quickActions: getQuickActionsForRole('TOURIST'),
      sections: exploreSectionsMock,
      exploreSectionTitle: `Explore ${cityLabel.split(',')[0]?.trim() || cityLabel}`,
      recentActivity:
        touristLive.recentActivity.length > 0
          ? touristLive.recentActivity
          : touristRecentActivityMock,
      reminder: touristLive.reminder,
      tabBarItems,
      activeTabId: 'home',
      showSetupBanner: seekerSetupIncomplete && primaryIntent === 'TOURIST',
    }),
    [
      firstName,
      resolvedInitials,
      cityLabel,
      tabBarItems,
      homeApi.featuredGuide,
      homeApi.suggestedGuides,
      showMatchScores,
      isHomeLoading,
      homeDataError,
      seekerSetupIncomplete,
      primaryIntent,
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
      screenLayout={({ children, navigation, route }) => {
        if (!shouldWrapStackSos(route.name)) {
          return children;
        }
        return (
          <StackSosLayout onSosPress={() => navigation.navigate('SOS')}>
            {children}
          </StackSosLayout>
        );
      }}
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
            {...mainTabSosProps(navigation)}
            onSectionPress={(sectionId) => handleExploreSectionPress(navigation, sectionId)}
            onFeaturedGuidePress={() => navigation.navigate('GuideSearch')}
            onQuickActionPress={(actionId) => handleTouristQuickAction(navigation, actionId)}
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'BrowseHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="MessagesTab">
        {({ navigation }) => (
          <MessagesTabScreen
            userName={firstName}
            userInitials={resolvedInitials}
            conversations={conversations}
            tabBarItems={tabBarItems}
            activeTabId="messages"
            emptyState={emptyStates.messages}
            isLoading={conversationsApi.isLoading}
            errorMessage={conversationsApi.error}
            {...mainTabSosProps(navigation)}
            onConversationPress={(conversationId) =>
              navigation.navigate('Chat', { conversationId })
            }
            onTabPress={(tabId) => routeTabPress(navigation, tabId)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Chat">
        {({ navigation, route }) => {
          const conversation = conversations.find(
            (item) => item.id === route.params.conversationId,
          );
          if (!conversation || !user) {
            return (
              <RouteErrorState
                title="Conversation not found"
                message="This chat may have been removed or is no longer available."
                onBack={() => navigation.goBack()}
              />
            );
          }
          return (
            <ChatRoute
              conversation={conversation}
              currentUserId={user.userId}
              onBack={() => navigation.goBack()}
              onMessageSent={() => conversationsApi.refresh()}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="HostRequestsTab">
        {({ navigation }) => (
          <HostRequestsTabScreen
            userName={firstName}
            userInitials={resolvedInitials}
            requests={hostPendingDisplay}
            tabBarItems={hostTabBarItems}
            activeTabId="requests"
            isLoading={providerTab.isLoading}
            errorMessage={providerTab.error}
            emptyState={emptyStates.hostRequests}
            {...mainTabSosProps(navigation)}
            onRequestPress={(requestId) =>
              navigation.navigate('MatchRequestReview', { requestId })
            }
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'HostHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostBookingsTab">
        {({ navigation }) => (
          <HostBookingsTabScreen
            userName={firstName}
            userInitials={resolvedInitials}
            bookings={hostActiveDisplay}
            tabBarItems={hostTabBarItems}
            activeTabId="bookings"
            isLoading={providerTab.isLoading}
            errorMessage={providerTab.error}
            emptyState={emptyStates.hostBookings}
            {...mainTabSosProps(navigation)}
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'HostHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostEarningsTab">
        {({ navigation }) => (
          <HostEarningsTabScreen
            userName={firstName}
            userInitials={resolvedInitials}
            summary={providerTab.hostEarningsSummary}
            lineItems={providerTab.hostEarningsLineItems}
            tabBarItems={hostTabBarItems}
            activeTabId="earnings"
            isLoading={providerTab.isLoading}
            errorMessage={providerTab.error}
            emptyState={emptyStates.hostEarnings}
            {...mainTabSosProps(navigation)}
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'HostHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideBookingsTab">
        {({ navigation }) => (
          <GuideBookingsTabScreen
            userName={firstName}
            userInitials={resolvedInitials}
            bookings={guideActiveDisplay}
            tabBarItems={guideTabBarItems}
            activeTabId="bookings"
            isLoading={providerTab.isLoading}
            errorMessage={providerTab.error}
            emptyState={emptyStates.guideBookings}
            onBookingPress={(requestId) =>
              navigation.navigate('SessionReview', { requestId })
            }
            {...mainTabSosProps(navigation)}
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'GuideHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideEarningsTab">
        {({ navigation }) => (
          <GuideEarningsTabScreen
            userName={firstName}
            userInitials={resolvedInitials}
            summary={providerTab.earningsSummary}
            lineItems={providerTab.earningsLineItems}
            tabBarItems={guideTabBarItems}
            activeTabId="earnings"
            isLoading={providerTab.isLoading}
            errorMessage={providerTab.error}
            emptyState={emptyStates.guideEarnings}
            {...mainTabSosProps(navigation)}
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'GuideHome')}
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
            culturalGuidanceItems={profileCulturalItems}
            showTravelBooking={shouldShowTravelBookingEntry(homeRole)}
            tabBarItems={tabBarItems}
            activeTabId="profile"
            {...mainTabSosProps(navigation)}
            onAccountSetupPress={() => navigation.navigate('AccountSetup')}
            onCulturalGuidanceItemPress={(itemId) =>
              handleProfileCulturalItem(navigation, itemId)
            }
            onCoreServicesPress={() => navigation.navigate('UnifiedSearch')}
            onTravelBookingPress={() => navigation.navigate('UnifiedSearch')}
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
            onTabPress={(tabId) => routeTabPress(navigation, tabId)}
          />
        )}
      </Stack.Screen>

      {__DEV__ ? (
        <Stack.Screen name="DevTesting">
          {({ navigation }) => (
            <DevTestingScreen
              isActiveExchangeStudent={isActiveExchangeStudent}
              demoLoginBusy={demoLoginBusy}
              demoLoginError={demoLoginError}
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
              onDemoActorLogin={(account) => {
                void handleDemoActorLogin(account);
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
            {...mainTabSosProps(navigation)}
            onBack={() => navigation.goBack()}
            onCategoryPress={(categoryId) => {
              if (categoryId === 'homestays') {
                if (primaryIntent === 'STUDENT') {
                  navigateToMatchSearch(navigation);
                  return;
                }
                navigation.navigate('ExploreStays');
              }
              if (categoryId === 'guides') {
                navigation.navigate('GuideSearch');
              }
              if (categoryId === 'lodging') {
                navigation.navigate('LodgingDirectory');
              }
            }}
            onTabPress={(tabId) => routeTabPress(navigation, tabId)}
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
                if (track === 'HOST' || track === 'GUIDE') {
                  navigation.navigate('KYCPrompt', { track });
                  return;
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
                if (track === 'HOST' || track === 'GUIDE') {
                  navigation.navigate('KYCPrompt', { track });
                  return;
                }
                navigation.navigate('OnboardingReady', { track });
              }}
              onBack={() => navigation.goBack()}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="KYCPrompt">
        {({ navigation, route }) => {
          const { track } = route.params;
          return (
            <KYCPromptScreen
              data={kycPromptForTrack(track)}
              onVerifyNow={() => navigation.navigate('OnboardingReady', { track })}
              onVerifyLater={() => navigation.navigate('OnboardingReady', { track })}
              onSosPress={() => navigation.navigate('SOS')}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="OnboardingReady">
        {({ navigation, route }) => {
          const track = route.params.track;
          const destination =
            city || profileFields.city || 'your destination';
          const readyCopy = onboardingReadyCopyByTrack(track, primaryIntent, {
            destination,
            university: university || profileFields.university,
            city: city || profileFields.city,
          });

          const goToDashboard = async () => {
            await completeStep(track, 'ready');
            await markTrackComplete(track);
            if (track === 'SEEKER' && primaryIntent === 'STUDENT') {
              homeApi.refresh();
            }
            if (track === 'SEEKER' && primaryIntent === 'TOURIST') {
              homeApi.refresh();
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
          };

          return (
            <OnboardingReadyScreen
              roleHeadline={readyCopy.roleHeadline}
              subtitle={readyCopy.subtitle}
              heroIcon={readyCopy.heroIcon}
              nextSteps={readyCopy.nextSteps}
              featureHighlights={readyCopy.featureHighlights}
              ctaLabel={readyCopy.ctaLabel}
              secondaryCtaLabel={readyCopy.secondaryCtaLabel}
              roleLabel={readyCopy.roleLabel}
              onEnterDashboard={() => {
                void goToDashboard();
              }}
              onExploreLater={() => {
                void goToDashboard();
              }}
              onBack={() => navigation.goBack()}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="StudentHome">
        {({ navigation }) => (
          <StudentHomeDashboard
            {...homeProps}
            {...mainTabSosProps(navigation)}
            onSetupPress={() => continueSeekerSetup(navigation)}
            onFeaturedMatchPress={() => {
              if (homeApi.topMatchTargetId) {
                navigation.navigate('HostProfile', {
                  hostId: homeApi.topMatchTargetId,
                });
              } else {
                navigation.navigate('MatchSearch');
              }
            }}
            onSuggestedHostPress={(hostId) =>
              navigation.navigate('HostProfile', { hostId })
            }
            onRecommendedSectionPress={(sectionId) =>
              handleExploreSectionPress(navigation, sectionId)
            }
            onQuickActionPress={(actionId) =>
              handleStudentQuickAction(navigation, actionId)
            }
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'StudentHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ExploreHome">
        {({ navigation }) => (
          <ExploreHomeScreen
            {...exploreHomeProps}
            {...mainTabSosProps(navigation)}
            onSetupPress={() => continueSeekerSetup(navigation)}
            onFeaturedGuidePress={() => {
              if (homeApi.topGuideTargetId) {
                navigation.navigate('GuideProfile', {
                  guideId: homeApi.topGuideTargetId,
                });
              } else {
                navigation.navigate('GuideSearch');
              }
            }}
            onSuggestedGuidePress={(guideId) =>
              navigation.navigate('GuideProfile', { guideId })
            }
            onSectionPress={(sectionId) => handleExploreSectionPress(navigation, sectionId)}
            onQuickActionPress={(actionId) => handleTouristQuickAction(navigation, actionId)}
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'ExploreHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostHome">
        {({ navigation }) => {
          const firstRequest = hostIncoming[0];
          const featuredCard = firstRequest
            ? {
                sectionLabel: 'Incoming request',
                name: firstRequest.studentName,
                badge: `${firstRequest.compatibilityScore}% match`,
                details: `Requesting ${firstRequest.checkIn}–${firstRequest.checkOut} · ${firstRequest.message ?? 'Stay request'}`,
                ctaLabel: 'Review request →',
                initials: firstRequest.studentInitials,
              }
            : homeDataError
              ? undefined
              : hostFeaturedRequestMock;

          return (
            <ProviderHomeDashboard
              providerRole="host"
              greeting={personalizedGreeting}
              userName={firstName}
              userInitials={resolvedInitials}
              statusIcon="🏠"
              statusLabel={hostLive.statusLabel}
              featuredCard={featuredCard}
              quickActions={getQuickActionsForRole('HOST')}
              performanceStats={[]}
              requests={hostIncoming}
              emptyState={emptyStates.hostRequests}
              recentActivity={hostLive.recentActivity}
              reminder={hostLive.reminder}
              tabBarItems={hostTabBarItems}
              activeTabId="home"
              {...mainTabSosProps(navigation)}
              onFeaturedPress={() => {
                if (firstRequest) {
                  navigation.navigate('MatchRequestReview', {
                    requestId: firstRequest.id,
                  });
                } else {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'HostRequestsTab' }],
                  });
                }
              }}
              onQuickActionPress={(actionId) =>
                handleProviderQuickAction(navigation, actionId, 'host')
              }
              onRequestPress={(requestId) =>
                navigation.navigate('MatchRequestReview', { requestId })
              }
              onSeeAllRequestsPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'HostRequestsTab' }],
                })
              }
              onTabPress={(tabId) => routeTabPress(navigation, tabId, 'HostHome')}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="GuideHome">
        {({ navigation }) => {
          const firstRequest = guideIncoming[0];
          const sessionLabel = firstRequest?.session
            ? `${firstRequest.session.sessionDate} · ${firstRequest.session.sessionStartTime}`
            : 'City tour';
          const featuredCard = firstRequest
            ? {
                sectionLabel: 'Upcoming tour',
                name: `${firstRequest.studentName} — Guide session`,
                badge: guideFeaturedTourMock.badge,
                details: sessionLabel,
                ctaLabel: 'View details →',
                initials: firstRequest.studentInitials,
              }
            : homeDataError
              ? undefined
              : guideFeaturedTourMock;

          return (
            <ProviderHomeDashboard
              providerRole="guide"
              greeting={personalizedGreeting}
              userName={firstName}
              userInitials={resolvedInitials}
              statusIcon="🗺️"
              statusLabel={guideLive.statusLabel}
              featuredCard={featuredCard}
              quickActions={getQuickActionsForRole('GUIDE')}
              tourSuggestions={guideTourSections}
              tourSuggestionsTitle="Your tour types"
              requests={guideIncoming}
              emptyState={emptyStates.guideRequests}
              recentActivity={guideLive.recentActivity}
              reminder={guideLive.reminder}
              tabBarItems={guideTabBarItems}
              activeTabId="home"
              {...mainTabSosProps(navigation)}
              onFeaturedPress={() => {
                if (firstRequest) {
                  navigation.navigate('SessionReview', { requestId: firstRequest.id });
                } else {
                  navigation.navigate('TourTypesSetup');
                }
              }}
              onQuickActionPress={(actionId) =>
                handleProviderQuickAction(navigation, actionId, 'guide')
              }
              onRequestPress={(requestId) =>
                navigation.navigate('SessionReview', { requestId })
              }
              onSeeAllRequestsPress={() => navigation.navigate('IncomingSessionRequests')}
              onTourSuggestionPress={() => navigation.navigate('TourTypesSetup')}
              onTabPress={(tabId) => routeTabPress(navigation, tabId, 'GuideHome')}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="StudentBookings">
        {({ navigation }) => (
          <StudentBookingsScreen
            {...bookingsTabProps}
            {...mainTabSosProps(navigation)}
            onFilterChange={setBookingFilter}
            onBookingPress={(bookingId) => {
              const booking = bookings.find((entry) => entry.id === bookingId);
              if (!booking) return;
              if (
                bookingFilter === 'active' &&
                (booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN')
              ) {
                navigation.navigate('WelfareCheckIn', { bookingId });
                return;
              }
              if (
                bookingFilter === 'past' &&
                (booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN')
              ) {
                navigation.navigate('ReviewPrompt', {
                  bookingId,
                  hostName: booking.hostName,
                });
              }
            }}
            payBlocked={!canBookHomestay && !canBookGuideSession}
            payBlockedMessage="Complete your travel profile to pay for bookings."
            onContinueSetupPay={() => continueSeekerSetup(navigation)}
            onPayPress={async (bookingId) => {
              if (!canBookHomestay && !canBookGuideSession) {
                return;
              }
              try {
                await confirmBooking(bookingId);
                homeApi.refresh();
                navigation.navigate('BookingConfirmed', { bookingId });
              } catch (err) {
                Alert.alert('Payment failed', getApiErrorMessage(err));
              }
            }}
            onTabPress={(tabId) => routeTabPress(navigation, tabId)}
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
            tabBarItems={tabBarItems}
            activeTabId="search"
            {...mainTabSosProps(navigation)}
            onTabPress={(tabId) => routeTabPress(navigation, tabId)}
            onBack={() => navigation.goBack()}
            onHostPress={(hostId) =>
              navigation.navigate('HostProfile', { hostId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostProfile">
        {({ navigation, route }) => (
          <HostProfileRoute
            hostId={route.params.hostId}
            showMatchScores={showMatchScores}
            resolveHost={resolveHost}
            canBookHomestay={canBookHomestay}
            onContinueSetup={() => continueSeekerSetup(navigation)}
            onBack={() => navigation.goBack()}
            onBookPress={(host) =>
              navigation.navigate('Booking', {
                hostId: host.id,
                bookingContext: makeBookingContext('HOST'),
              })
            }
            onMessagePress={(host) => {
              void messageHost(navigation, host);
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Booking">
        {({ navigation, route }) => (
          <BookingHostRoute
            hostId={route.params.hostId}
            resolveHost={resolveHost}
            showMatchScores={showMatchScores}
            checkIn={checkIn}
            checkOut={checkOut}
            canBookHomestay={canBookHomestay}
            requestBlockedMessage={bookingGateCopy.homestay}
            onContinueSetup={() => continueSeekerSetup(navigation)}
            onBack={() => navigation.goBack()}
            onSendRequest={async (host) => {
              await createBooking({
                bookingType: 'HOST',
                hostOrGuideId: host.id,
                matchId: host.matchId,
                checkIn,
                checkOut,
                nightlyRate: host.pricePerNight,
                guestMessage: 'Homestay request via NestBridge',
              });
              homeApi.refresh();
              setBookingFilter('pending');
              navigation.navigate('StudentBookings');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="BookingConfirmed">
        {({ navigation, route }) => {
          const booking = bookings.find((b) => b.id === route.params.bookingId);
          if (!booking) {
            return (
              <RouteErrorState
                title="Booking not found"
                message="We could not find that booking confirmation."
                onBack={() => navigation.goBack()}
              />
            );
          }
          return (
            <BookingConfirmedScreen
              hostName={booking.hostName}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              totalAmount={booking.priceBreakdown.total}
              currency={booking.priceBreakdown.currency}
              onViewBookings={() => {
                setBookingFilter('active');
                homeApi.refresh();
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
            guides={guideListForSearch}
            showMatchScores={showMatchScores}
            onBack={() => navigation.goBack()}
            onGuidePress={(guideId) =>
              navigation.navigate('GuideProfile', { guideId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideProfile">
        {({ navigation, route }) => (
          <GuideProfileRoute
            guideId={route.params.guideId}
            showMatchScores={showMatchScores}
            resolveGuide={resolveGuide}
            canBookGuideSession={canBookGuideSession}
            onContinueSetup={() => continueSeekerSetup(navigation)}
            onBack={() => navigation.goBack()}
            onBookPress={(guide) =>
              navigation.navigate('SessionBooking', {
                guideId: guide.id,
                bookingContext: makeBookingContext('GUIDE'),
              })
            }
            onMessagePress={(guide) => {
              void messageGuide(navigation, guide);
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SessionBooking">
        {({ navigation, route }) => (
          <SessionBookingGuideRoute
            guideId={route.params.guideId}
            resolveGuide={resolveGuide}
            sessionDate={sessionDate}
            sessionStartTime={DEFAULT_SESSION_TIME}
            canBookGuideSession={canBookGuideSession}
            requestBlockedMessage={bookingGateCopy.guide}
            onContinueSetup={() => continueSeekerSetup(navigation)}
            onBack={() => navigation.goBack()}
            onSendRequest={async (guide) => {
              await createBooking({
                bookingType: 'GUIDE',
                hostOrGuideId: guide.id,
                matchId: guide.matchId,
                sessionDate,
                sessionStartTime: DEFAULT_SESSION_TIME,
                sessionDurationHours: guide.sessionDurationHours,
                sessionRate: guide.pricePerSession,
                guestMessage: 'Guide session request via NestBridge',
              });
              homeApi.refresh();
              setBookingFilter('pending');
              navigation.navigate('StudentBookings');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="LodgingDirectory">
        {({ navigation }) => (
          <LodgingDirectoryScreen
            cityLabel={cityLabel}
            listings={lodgingApi.listings}
            isLoading={lodgingApi.isLoading}
            errorMessage={lodgingApi.error}
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
          const listing =
            lodgingListingFromId(route.params.listingId, lodgingApi.listings) ??
            listingFromId(route.params.listingId);
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

      <Stack.Screen name="SitesDirectory">
        {({ navigation }) => (
          <SitesDirectoryScreen
            cityLabel={cityLabel}
            sites={sitesDirectoryItems}
            onBack={() => navigation.goBack()}
            onSitePress={(siteId) =>
              navigation.navigate('TouristSiteDetail', { siteId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="WelfareCheckIn">
        {({ navigation, route }) => {
          const booking = bookings.find((entry) => entry.id === route.params.bookingId);
          const bookingId = route.params.bookingId;
          const alreadyCompleted =
            completedWelfareCheckIns.includes(bookingId);

          return (
            <WelfareCheckInScreen
              hostName={booking?.hostName ?? 'your host'}
              checkIn={booking?.checkIn ?? checkIn}
              checkOut={booking?.checkOut ?? checkOut}
              questions={welfareCheckInQuestions}
              alreadyCompleted={alreadyCompleted}
              onBack={() => navigation.goBack()}
              onSosPress={() => navigation.navigate('SOS')}
              onSubmit={() => {
                setCompletedWelfareCheckIns((prev) =>
                  prev.includes(bookingId) ? prev : [...prev, bookingId],
                );
                navigation.goBack();
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="ReviewPrompt">
        {({ navigation, route }) => (
          <ReviewPromptScreen
            hostName={route.params.hostName}
            onBack={() => navigation.goBack()}
            onSkip={() => navigation.goBack()}
            onSubmit={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SOS">
        {({ navigation }) => (
          <SOSScreen
            emergencyContacts={contentEmergency.data.map((contact) => ({
              label: contact.label,
              number: contact.number,
            }))}
            onBack={() => navigation.goBack()}
            onCallEmergencyServices={() => {
              void logSos({ contactedEmergency: true });
              dialPhoneNumber('191');
            }}
            onContactCallPress={(contact) => {
              void logSos({ contactedSupport: true });
              dialPhoneNumber(contact.number);
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TouristSiteDetail">
        {({ navigation, route }) => (
          <SiteDetailRoute
            siteKey={route.params.siteId}
            onBack={() => navigation.goBack()}
            onFindGuidePress={() => navigation.navigate('GuideSearch')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="VideoLibrary">
        {({ navigation }) => (
          <VideoLibraryScreen
            cityLabel={cityLabel}
            videos={contentVideos.data}
            isLoading={contentVideos.isLoading}
            errorMessage={contentVideos.error}
            onBack={() => navigation.goBack()}
            onVideoPress={(videoKey) => navigation.navigate('VideoDetail', { videoKey })}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="VideoDetail">
        {({ navigation, route }) => (
          <VideoDetailRoute
            videoKey={route.params.videoKey}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="PrepChecklist">
        {({ navigation }) => (
          <PrepChecklistScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon={studentHomeMockData.statusIcon}
            statusLabel={studentLive.statusLabel}
            tasks={checklistTasks}
            onToggleTask={(taskId) => {
              const next = checklistCompleted.includes(taskId)
                ? checklistCompleted.filter((id) => id !== taskId)
                : [...checklistCompleted, taskId];
              setChecklistCompleted(next);
              void completeStep('SEEKER', 'profile', { checklistCompleted: next });
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="LocalTips">
        {({ navigation }) => (
          <LocalTipsScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon={studentHomeMockData.statusIcon}
            statusLabel={studentLive.statusLabel}
            phrases={contentPhrases.data.map((phrase) => ({
              id: phrase.id,
              emoji: phrase.emoji,
              phrase: phrase.phrase,
              translation: phrase.translation,
              hasAudio: phrase.hasAudio,
            }))}
            topics={contentTopics.data.map((topic) => ({
              id: topic.id,
              emoji: topic.emoji,
              title: topic.title,
              description: topic.description,
            }))}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TransportGuide">
        {({ navigation }) => (
          <TransportGuideScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon={studentHomeMockData.statusIcon}
            statusLabel={studentLive.statusLabel}
            tabs={contentTransport.data.map((tab) => ({
              id: tab.id,
              label: tab.label,
              routes: tab.routes.map((route) => ({
                id: route.id,
                name: route.name,
                description: route.description,
                fareLabel: route.fareLabel,
                estimatedPrice: route.estimatedPrice,
              })),
            }))}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ExploreStays">
        {({ navigation }) => (
          <ExploreStaysScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon="🏡"
            statusLabel={touristLive.statusLabel}
            listings={exploreStayListings}
            onBookPress={(listingId) =>
              navigation.navigate('HostProfile', { hostId: listingId })
            }
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="OfflineMap">
        {({ navigation }) => (
          <OfflineMapScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon="📍"
            statusLabel={touristLive.statusLabel}
            regionLabel="Greater Accra Region"
            downloadSize="Offline landmarks from NestBridge"
            landmarks={contentLandmarks.data.map((landmark) => ({
              id: landmark.id,
              name: landmark.name,
              topPercent: landmark.topPercent,
              leftPercent: landmark.leftPercent,
            }))}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostCalendar">
        {({ navigation }) => (
          <HostCalendarScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon="📅"
            statusLabel="Host"
            calendarTitle={`${firstName}'s Calendar`}
            monthLabel="July 2026"
            startWeekday={3}
            days={hostCalendarDaysMock}
            activeBooking={hostCalendarActiveBooking}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostListings">
        {({ navigation }) => (
          <HostListingsScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon="📅"
            statusLabel="Host"
            listings={hostListings}
            onToggleOnline={(listingId, isOnline) => {
              setHostListings((prev) =>
                prev.map((listing) =>
                  listing.id === listingId ? { ...listing, isOnline } : listing,
                ),
              );
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TourTypesSetup">
        {({ navigation }) => (
          <TourTypesSetupScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon="🗺️"
            statusLabel="Guide"
            tourTypes={tourTypes}
            baseRate={tourBaseRate}
            maxGroupSize={tourMaxGroupSize}
            onToggleTourType={(tourTypeId, enabled) => {
              setTourTypes((prev) =>
                prev.map((tour) =>
                  tour.id === tourTypeId ? { ...tour, enabled } : tour,
                ),
              );
            }}
            onBaseRateChange={setTourBaseRate}
            onMaxGroupSizeChange={setTourMaxGroupSize}
            onSavePress={() => navigation.goBack()}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideAvailability">
        {({ navigation }) => (
          <GuideAvailabilityScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon="🗺️"
            statusLabel="Guide"
            calendarTitle={`${firstName}'s Availability`}
            monthLabel="July 2026"
            startWeekday={3}
            days={guideCalendarDaysMock}
            onBack={() => navigation.goBack()}
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
          const request = hostIncoming.find((r) => r.id === route.params.requestId);
          if (!request) {
            return (
              <RouteErrorState
                title="Request not found"
                message="This homestay request is no longer available."
                onBack={() => navigation.goBack()}
              />
            );
          }
          return (
            <MatchRequestReviewScreen
              request={request}
              acceptBlocked={!canAcceptHostBookings}
              acceptBlockedMessage="Complete your host listing to accept homestay requests."
              onContinueSetup={() => continueHostSetup(navigation)}
              onBack={() => navigation.goBack()}
              onAccept={() => {
                void acceptBooking(request.id).then(() => homeApi.refresh());
                navigation.navigate('IncomingRequests');
              }}
              onDecline={() => {
                void declineBooking(request.id).then(() => homeApi.refresh());
                navigation.navigate('IncomingRequests');
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="SessionReview">
        {({ navigation, route }) => {
          const request = guideIncoming.find((r) => r.id === route.params.requestId);
          if (!request) {
            return (
              <RouteErrorState
                title="Request not found"
                message="This session request is no longer available."
                onBack={() => navigation.goBack()}
              />
            );
          }
          return (
            <SessionReviewScreen
              request={request}
              acceptBlocked={!canAcceptGuideSessions}
              acceptBlockedMessage="Complete your guide listing to accept session requests."
              onContinueSetup={() => continueGuideSetup(navigation)}
              onBack={() => navigation.goBack()}
              onAccept={() => {
                void acceptBooking(request.id).then(() => homeApi.refresh());
                navigation.navigate('IncomingSessionRequests');
              }}
              onDecline={() => {
                void declineBooking(request.id).then(() => homeApi.refresh());
                navigation.navigate('IncomingSessionRequests');
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="StudentEvents">
        {({ navigation }) => (
          <StudentEventsScreen
            events={studentEventsApi.events}
            joinedIds={studentEventsApi.joinedIds}
            isLoading={studentEventsApi.isLoading}
            error={studentEventsApi.error}
            onBack={() => navigation.goBack()}
            onCreatePress={() => navigation.navigate('CreateEvent')}
            onRetry={studentEventsApi.refresh}
            onToggleJoin={(eventId) => {
              void studentEventsApi.toggleJoin(eventId);
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="CreateEvent">
        {({ navigation }) => (
          <CreateEventScreen
            onBack={() => navigation.goBack()}
            onSubmit={async (draft: StudentEventDraft) => {
              await studentEventsApi.createEvent(draft);
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SponsorList">
        {({ navigation }) => (
          <SponsorListScreen
            sponsors={SPONSORS_MOCK}
            onBack={() => navigation.goBack()}
            onSponsorPress={(sponsorId) =>
              navigation.navigate('SponsorDetail', { sponsorId })
            }
            onSosPress={() => navigation.navigate('SOS')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SponsorDetail">
        {({ navigation, route }) => {
          const sponsor = getSponsorById(route.params.sponsorId);
          if (!sponsor) {
            return (
              <RouteErrorState
                title="Sponsor not found"
                message="This sponsorship listing is no longer available."
                onBack={() => navigation.goBack()}
              />
            );
          }
          return (
            <SponsorDetailScreen
              sponsor={sponsor}
              onBack={() => navigation.goBack()}
              onApplyPress={() =>
                navigation.navigate('SponsorApplication', {
                  sponsorId: sponsor.id,
                })
              }
              onSosPress={() => navigation.navigate('SOS')}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="SponsorApplication">
        {({ navigation, route }) => {
          const sponsor = getSponsorById(route.params.sponsorId);
          if (!sponsor) {
            return (
              <RouteErrorState
                title="Sponsor not found"
                message="This sponsorship listing is no longer available."
                onBack={() => navigation.goBack()}
              />
            );
          }
          return (
            <SponsorApplicationScreen
              sponsor={{
                id: sponsor.id,
                name: sponsor.name,
                logo: sponsor.logo,
              }}
              onBack={() => navigation.goBack()}
              onReturnToList={() => navigation.navigate('SponsorList')}
              onSosPress={() => navigation.navigate('SOS')}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const routeLoaderStyle = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});
