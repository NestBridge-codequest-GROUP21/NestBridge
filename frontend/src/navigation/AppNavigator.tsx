import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { pickProfileImage } from '../services/imagePicker';

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
import ExploreHubScreen from '../screens/shared/ExploreHubScreen';
import RouteErrorState from '../components/RouteErrorState';
import { sanitizeVideoResources } from '../utils/videoPlayback';
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
import {
  StaffUserActivityRoute,
  StaffUserDetailRoute,
  StaffUserSearchRoute,
} from './staffRoutes';
import UnifiedSearchScreen from '../screens/shared/UnifiedSearchScreen';
import ExploreHomeScreen from '../screens/tourist/ExploreHomeScreen';
import LodgingDirectoryScreen from '../screens/tourist/LodgingDirectoryScreen';
import LodgingDetailScreen from '../screens/tourist/LodgingDetailScreen';
import PrepChecklistScreen from '../screens/student/PrepChecklistScreen';
import StudentEventsScreen from '../screens/student/StudentEventsScreen';
import CreateEventScreen from '../screens/student/CreateEventScreen';
import { useStudentEvents } from '../hooks/useStudentEvents';
import { studentEventsMock, type StudentEventDraft } from '../data/studentEventsMock';
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
import NotificationsScreen from '../screens/shared/NotificationsScreen';
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
  homeTabSosProps,
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
  createBooking,
  createConversation,
  declineBooking,
  fetchUnreadNotificationCount,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createKycSession,
  findMatches,
  getHomeRecommendations,
  getGuideProfile,
  getHostProfile,
  logSos,
  getWelfareCheckIns,
  submitWelfareCheckIn,
  submitReview,
  getMyHostProfile,
  updateMyHostProfile,
  getMyHostCalendar,
  getMyHostActiveBooking,
  getMyGuideProfile,
  updateMyGuideProfile,
  getMyGuideCalendar,
  getApiErrorMessage,
} from '../services/api';
import {
  hostProfileToListing,
  mergeTourTypesFromProfile,
  tourTypesToServiceTypes,
  buildGuideSchedulePatch,
  readMaxGroupSize,
  mapHostCalendarDays,
  mapGuideCalendarDays,
  mapActiveBooking,
  toggleHostDayBlocked,
  mergeHostAvailabilityCalendar,
  toggleGuideShift,
  mergeGuideAvailabilitySchedule,
  getProviderCalendarMonth,
  buildEmptyHostMonthDays,
  buildEmptyGuideMonthDays,
} from '../services/providerProfile';
import { completeBookingPayment, PaymentCancelledError } from '../services/paymentFlow';
import { uploadProfilePhotoIfConfigured } from '../services/mediaUpload';
import { studentHomeMockData, tabBarWithBadgesForRole, suggestedHostsForCity } from '../data/studentHomeMock';
import {
  getQuickActionsForRole,
  getTabBarForRole,
  homeRoleFromIntent,
} from '../data/homeNavigation';
import {
  hostFeaturedRequestMock,
  guideFeaturedTourMock,
  studentRecentActivityMock,
  touristRecentActivityMock,
  hostPerformanceMock,
  touristFeaturedGuideMock,
  studentFeaturedMatchForCity,
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
  notificationsMockForIntent,
} from '../data/bookingMock';
import { conversationsMock } from '../data/conversationsMock';
import {
  withDemoFallback,
  withDemoFallbackValue,
  presentableLoading,
  presentableError,
  uniqueByContactNumber,
  uniqueByKey,
  normalizeContactNumber,
} from '../utils/demoLiveMerge';
import {
  confirmDemoBooking,
  isApiBookingId,
  createDemoGuideBookingRequest,
  createDemoHostBookingRequest,
  mergeBookingsWithLocalOverrides,
} from '../utils/demoBookingFlow';
import { emergencyContactsMock, localEmergencyNumber } from '../data/sosMock';
import {
  hostConfirmedStaysMock,
  guideUpcomingToursMock,
  computeEarningsFromBookings,
} from '../data/providerBookingsMock';
import { lodgingListingsForCity, listingFromId } from '../data/lodgingDirectoryMock';
import {
  checklistApiMock,
  landmarksApiMock,
  phrasesApiMock,
  sitesApiMock,
  topicsApiMock,
  transportApiMock,
  videosApiMock,
} from '../data/contentLibraryMock';
import { exploreSectionsForCity } from '../data/touristExploreMock';
import { buildDemoHomeRecommendations } from '../data/recommendations';
import type { RecommendationItem } from '../types/recommendations';
import type { HomeRecommendations } from '../types/recommendations';
import {
  touristSiteIdFromCarouselSection,
  touristSiteSummaryFromId,
} from '../data/touristSitesMock';
import { welfareCheckInQuestions } from '../data/welfareMock';
import type { WelfareCheckInQuestion } from '../data/welfareMock';
import {
  buildSearchMatchParams,
  hostMatchesToStayListings,
  matchToGuideSummary,
  matchToHostSummary,
  matchToMatchResultHost,
  buildDemoHostProfileCache,
  buildDemoGuideProfileCache,
  guideSummariesToDiscoveryItems,
  matchResultsToStayListings,
  demoTopMatchHostIdForCity,
  demoTopGuideId,
} from '../data/homeFeeds';
import { sampleMatchResultsForCity } from '../data/matchResultsMock';
import {
  suggestedGuidesMock,
  guidesForAttraction,
} from '../data/guideSessionMock';
import type { ConversationListItem } from '../types/messaging';
import type {
  ActiveBookingDetail,
  GuideShiftBlock,
  HostListingItem,
  TourTypeOption,
} from '../data/featureScreensMock';
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
import { DEMO_PASSWORD, DEMO_ACTOR_ACCOUNTS, demoPresetForAccount, type DemoAccount } from '../data/demoAccounts';

const Stack = createNativeStackNavigator<AppStackParamList>();

type ProviderScreenHeaderProps = {
  greeting: string;
  userName: string;
  userInitials: string;
  navigation: NativeStackNavigationProp<AppStackParamList>;
};

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
  if (actionId === 'sponsors') {
    navigation.navigate('SponsorList');
  }
  if (actionId === 'transport') {
    navigation.navigate('TransportGuide');
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
  if (actionId === 'cultural-tips') {
    navigation.navigate('LocalTips');
  }
}

function handleRecommendationItemPress(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  item: RecommendationItem,
) {
  const targetId = item.targetId ?? item.id;
  switch (item.routeHint) {
    case 'HostProfile':
      navigation.navigate('HostProfile', { hostId: targetId });
      return;
    case 'GuideProfile':
      navigation.navigate('GuideProfile', { guideId: targetId });
      return;
    case 'TouristSiteDetail':
      navigation.navigate('TouristSiteDetail', { siteId: targetId });
      return;
    case 'LodgingDetail':
      navigation.navigate('LodgingDetail', { listingId: targetId });
      return;
    case 'GuideSearch':
      navigation.navigate('GuideSearch');
      return;
    case 'ExploreStays':
      navigation.navigate('ExploreStays');
      return;
    case 'LodgingDirectory':
      navigation.navigate('LodgingDirectory');
      return;
    case 'SitesDirectory':
      navigation.navigate('SitesDirectory');
      return;
    case 'TransportGuide':
      navigation.navigate('TransportGuide');
      return;
    case 'LocalTips':
      navigation.navigate('LocalTips');
      return;
    case 'PrepChecklist':
      navigation.navigate('PrepChecklist');
      return;
    case 'VideoLibrary':
      navigation.navigate('VideoLibrary');
      return;
    case 'SponsorList':
      navigation.navigate('SponsorList');
      return;
    case 'StudentEvents':
      navigation.navigate('StudentEvents');
      return;
    case 'AccountSetup':
      navigation.navigate('AccountSetup');
      return;
    case 'HostListings':
      navigation.navigate('HostListings');
      return;
    case 'HostCalendar':
      navigation.navigate('HostCalendar');
      return;
    case 'HostRequestsTab':
      navigation.reset({ index: 0, routes: [{ name: 'HostRequestsTab' }] });
      return;
    case 'TourTypesSetup':
      navigation.navigate('TourTypesSetup');
      return;
    case 'GuideAvailability':
      navigation.navigate('GuideAvailability');
      return;
    case 'GuideBookingsTab':
      navigation.reset({ index: 0, routes: [{ name: 'GuideBookingsTab' }] });
      return;
    default:
      break;
  }
}

function handleProviderQuickAction(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  actionId: string,
  role: 'host' | 'guide',
) {
  if (actionId === 'book-travel') {
    navigation.navigate('UnifiedSearch');
  }
  if (actionId === 'explore') {
    navigation.reset({ index: 0, routes: [{ name: 'ExploreHub' }] });
  }
  if (actionId === 'listings') {
    navigation.navigate('HostListings');
  }
  if (actionId === 'availability') {
    // Manage open slots. Guides use the availability calendar; hosts use their
    // stay calendar as the equivalent slot-management surface.
    navigation.navigate(role === 'guide' ? 'GuideAvailability' : 'HostCalendar');
  }
  if (actionId === 'calendar') {
    // Hosts manage stay availability; guides manage open session slots.
    navigation.navigate(role === 'guide' ? 'GuideAvailability' : 'HostCalendar');
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
}

function handleExploreSectionPress(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  sectionId: string,
) {
  if (sectionId === 'sites') {
    navigation.navigate('SitesDirectory');
    return;
  }
  if (sectionId.startsWith('site-')) {
    const siteId = touristSiteIdFromCarouselSection(sectionId);
    if (!siteId) {
      navigation.navigate('SitesDirectory');
      return;
    }
    navigation.navigate('TouristSiteDetail', { siteId });
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
  // Unknown section — open sites directory, never a random attraction.
  navigation.navigate('SitesDirectory');
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

type WelfareCheckInStackProps = NativeStackScreenProps<AppStackParamList, 'WelfareCheckIn'> & {
  hostName: string;
  checkIn: string;
  checkOut: string;
  questions: WelfareCheckInQuestion[];
  onSosPress: () => void;
};

function WelfareCheckInStackScreen({
  navigation,
  route,
  hostName,
  checkIn,
  checkOut,
  questions,
  onSosPress,
}: WelfareCheckInStackProps) {
  const bookingId = route.params.bookingId;
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void getWelfareCheckIns(bookingId)
      .then((rows) => setAlreadyCompleted(rows.some((row) => !!row.completedAt)))
      .catch(() => undefined);
  }, [bookingId]);

  return (
    <WelfareCheckInScreen
      hostName={hostName}
      checkIn={checkIn}
      checkOut={checkOut}
      questions={questions}
      alreadyCompleted={alreadyCompleted}
      isLoading={submitting}
      errorMessage={errorMessage}
      onBack={() => navigation.goBack()}
      onSosPress={onSosPress}
      onSubmit={(answers) => {
        setSubmitting(true);
        setErrorMessage(null);
        void submitWelfareCheckIn(bookingId, answers)
          .then(() => {
            setAlreadyCompleted(true);
            navigation.goBack();
          })
          .catch((error) => {
            setErrorMessage(getApiErrorMessage(error));
            setSubmitting(false);
          });
      }}
    />
  );
}

type ReviewPromptStackProps = NativeStackScreenProps<AppStackParamList, 'ReviewPrompt'>;

function ReviewPromptStackScreen({ navigation, route }: ReviewPromptStackProps) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <ReviewPromptScreen
      hostName={route.params.hostName}
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.goBack()}
      onSubmit={(rating, comment) => {
        if (submitting) {
          return;
        }
        setSubmitting(true);
        void submitReview(route.params.bookingId, rating, comment)
          .then(() => navigation.goBack())
          .catch((error) => {
            setSubmitting(false);
            Alert.alert('Could not submit review', getApiErrorMessage(error));
          });
      }}
    />
  );
}

function HostListingsStackScreen({
  greeting,
  userName,
  userInitials,
  navigation,
}: ProviderScreenHeaderProps) {
  const [listings, setListings] = useState<HostListingItem[]>([]);

  useEffect(() => {
    void getMyHostProfile()
      .then((profile) => setListings([hostProfileToListing(profile)]))
      .catch(() => setListings([]));
  }, []);

  const displayListings = withDemoFallback(listings, hostListingsMock);

  return (
    <HostListingsScreen
      greeting={greeting}
      userName={userName}
      userInitials={userInitials}
      statusIcon="📅"
      statusLabel="Host"
      listings={displayListings}
      emptyState={emptyStates.hostListings}
      onAddListingPress={() => {
        Alert.alert(
          'Add listing',
          'Listing creation opens from account setup. Update your host profile to publish a stay.',
        );
        navigation.navigate('AccountSetup');
      }}
      onToggleOnline={(listingId, isOnline) => {
        setListings((prev) =>
          prev.map((listing) =>
            listing.id === listingId ? { ...listing, isOnline } : listing,
          ),
        );
        void updateMyHostProfile({ active: isOnline })
          .then((profile) => setListings([hostProfileToListing(profile)]))
          .catch((error) => {
            Alert.alert('Could not update listing', getApiErrorMessage(error));
          });
      }}
      onBack={() => navigation.goBack()}
    />
  );
}

function HostCalendarStackScreen({
  greeting,
  userName,
  userInitials,
  navigation,
  fallbackActiveBooking,
}: ProviderScreenHeaderProps & { fallbackActiveBooking: ActiveBookingDetail }) {
  const { user } = useAuth();
  const calendarMonth = useMemo(() => getProviderCalendarMonth(), []);
  const [days, setDays] = useState(() =>
    buildEmptyHostMonthDays(calendarMonth.year, calendarMonth.month),
  );
  const [activeBooking, setActiveBooking] = useState(fallbackActiveBooking);
  const [loadedFromApi, setLoadedFromApi] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reloadCalendar = useCallback(() => {
    void getMyHostCalendar(calendarMonth.year, calendarMonth.month)
      .then((rows) => {
        const mapped = mapHostCalendarDays(rows);
        setDays(
          mapped.length > 0
            ? mapped
            : buildEmptyHostMonthDays(calendarMonth.year, calendarMonth.month),
        );
        setLoadedFromApi(true);
        setLoadError(null);
      })
      .catch((error) => {
        setLoadedFromApi(false);
        setLoadError(getApiErrorMessage(error));
      });
  }, [calendarMonth.month, calendarMonth.year]);

  useEffect(() => {
    reloadCalendar();

    void getMyHostActiveBooking()
      .then((booking) => {
        const mapped = mapActiveBooking(booking);
        if (mapped) {
          setActiveBooking(mapped);
        }
      })
      .catch(() => undefined);
  }, [fallbackActiveBooking, reloadCalendar, user?.userId]);

  const canEdit = loadedFromApi && !saving;
  const displayDays = loadedFromApi
    ? days
    : withDemoFallback(days, hostCalendarDaysMock);
  const displayBooking = withDemoFallbackValue(activeBooking, hostActiveBookingMock);

  const persistHostCalendar = (nextDays: typeof days) => {
    if (!loadedFromApi) {
      Alert.alert(
        'Calendar not ready',
        loadError ?? 'Load your calendar from the server before editing.',
      );
      return;
    }
    setSaving(true);
    setStatusMessage('Saving…');
    void getMyHostProfile()
      .then((profile) =>
        updateMyHostProfile({
          availabilityCalendar: mergeHostAvailabilityCalendar(
            profile.availabilityCalendar,
            nextDays,
          ),
        }),
      )
      .then(() => {
        setStatusMessage('Calendar saved');
        reloadCalendar();
      })
      .catch((error) => {
        setStatusMessage(null);
        Alert.alert('Could not save calendar', getApiErrorMessage(error));
        reloadCalendar();
      })
      .finally(() => setSaving(false));
  };

  return (
    <HostCalendarScreen
      greeting={greeting}
      userName={userName}
      userInitials={userInitials}
      statusIcon="📅"
      statusLabel="Host"
      calendarTitle={`${userName}'s Calendar`}
      monthLabel={calendarMonth.monthLabel}
      startWeekday={calendarMonth.startWeekday}
      days={displayDays}
      activeBooking={displayBooking}
      editable={canEdit}
      statusMessage={statusMessage ?? loadError}
      onDayInteract={(dayNumber) => {
        const nextDays = toggleHostDayBlocked(days, dayNumber);
        if (!nextDays) {
          setStatusMessage('Booked days cannot be changed.');
          return;
        }
        setDays(nextDays);
        persistHostCalendar(nextDays);
      }}
      onBack={() => navigation.goBack()}
    />
  );
}

type TourTypesStackProps = ProviderScreenHeaderProps & {
  onProfileSaved?: (tourTypes: TourTypeOption[], baseRate: string, maxGroupSize: string) => void;
};

function TourTypesStackScreen({
  greeting,
  userName,
  userInitials,
  navigation,
  onProfileSaved,
}: TourTypesStackProps) {
  const [tourTypes, setTourTypes] = useState(tourTypesMock);
  const [baseRate, setBaseRate] = useState('45');
  const [maxGroupSize, setMaxGroupSize] = useState('8');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getMyGuideProfile()
      .then((profile) => {
        const merged = mergeTourTypesFromProfile(profile.serviceTypes, profile.pricePerSession);
        setTourTypes(merged.tourTypes);
        setBaseRate(merged.baseRate);
        setMaxGroupSize(readMaxGroupSize(profile.availabilitySchedule));
      })
      .catch(() => undefined);
  }, []);

  return (
    <TourTypesSetupScreen
      greeting={greeting}
      userName={userName}
      userInitials={userInitials}
      statusIcon="🗺️"
      statusLabel="Guide"
      tourTypes={tourTypes}
      baseRate={baseRate}
      maxGroupSize={maxGroupSize}
      onToggleTourType={(tourTypeId, enabled) => {
        setTourTypes((prev) =>
          prev.map((tour) => (tour.id === tourTypeId ? { ...tour, enabled } : tour)),
        );
      }}
      onBaseRateChange={setBaseRate}
      onMaxGroupSizeChange={setMaxGroupSize}
      onSavePress={() => {
        if (saving) {
          return;
        }
        setSaving(true);
        const parsedRate = Number.parseFloat(baseRate);
        void getMyGuideProfile()
          .then((existing) =>
            updateMyGuideProfile({
              serviceTypes: tourTypesToServiceTypes(tourTypes),
              pricePerSession: Number.isNaN(parsedRate) ? undefined : parsedRate,
              availabilitySchedule: buildGuideSchedulePatch(
                existing.availabilitySchedule,
                maxGroupSize,
              ),
            }),
          )
          .then(() => {
            onProfileSaved?.(tourTypes, baseRate, maxGroupSize);
            navigation.goBack();
          })
          .catch((error) => {
            Alert.alert('Could not save tour types', getApiErrorMessage(error));
            setSaving(false);
          });
      }}
      onBack={() => navigation.goBack()}
    />
  );
}

function GuideAvailabilityStackScreen({
  greeting,
  userName,
  userInitials,
  navigation,
}: ProviderScreenHeaderProps) {
  const { user } = useAuth();
  const calendarMonth = useMemo(() => getProviderCalendarMonth(), []);
  const [days, setDays] = useState(() =>
    buildEmptyGuideMonthDays(calendarMonth.year, calendarMonth.month),
  );
  const [loadedFromApi, setLoadedFromApi] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reloadCalendar = useCallback(() => {
    void getMyGuideCalendar(calendarMonth.year, calendarMonth.month)
      .then((rows) => {
        const mapped = mapGuideCalendarDays(rows);
        setDays(
          mapped.length > 0
            ? mapped
            : buildEmptyGuideMonthDays(calendarMonth.year, calendarMonth.month),
        );
        setLoadedFromApi(true);
        setLoadError(null);
      })
      .catch((error) => {
        setLoadedFromApi(false);
        setLoadError(getApiErrorMessage(error));
      });
  }, [calendarMonth.month, calendarMonth.year]);

  useEffect(() => {
    reloadCalendar();
  }, [reloadCalendar, user?.userId]);

  const canEdit = loadedFromApi && !saving;
  const displayDays = loadedFromApi
    ? days
    : withDemoFallback(days, guideCalendarDaysMock);

  const persistGuideSchedule = (nextDays: typeof days) => {
    if (!loadedFromApi) {
      Alert.alert(
        'Availability not ready',
        loadError ?? 'Load your availability from the server before editing.',
      );
      return;
    }
    setSaving(true);
    setStatusMessage('Saving…');
    void getMyGuideProfile()
      .then((profile) =>
        updateMyGuideProfile({
          availabilitySchedule: mergeGuideAvailabilitySchedule(
            profile.availabilitySchedule,
            nextDays,
          ),
        }),
      )
      .then(() => {
        setStatusMessage('Availability saved');
        reloadCalendar();
      })
      .catch((error) => {
        setStatusMessage(null);
        Alert.alert('Could not save availability', getApiErrorMessage(error));
        reloadCalendar();
      })
      .finally(() => setSaving(false));
  };

  return (
    <GuideAvailabilityScreen
      greeting={greeting}
      userName={userName}
      userInitials={userInitials}
      statusIcon="🗺️"
      statusLabel="Guide"
      calendarTitle={`${userName}'s Availability`}
      monthLabel={calendarMonth.monthLabel}
      startWeekday={calendarMonth.startWeekday}
      days={displayDays}
      editable={canEdit}
      statusMessage={statusMessage ?? loadError}
      onSelectedDayChange={setSelectedDay}
      onShiftToggle={(shift: GuideShiftBlock, enabled: boolean) => {
        const current = days.find((day) => day.day === selectedDay);
        if (!current) {
          return;
        }
        const alreadyEnabled = current.shifts.includes(shift);
        if (alreadyEnabled === enabled) {
          return;
        }
        const nextDays = toggleGuideShift(days, selectedDay, shift);
        setDays(nextDays);
        persistGuideSchedule(nextDays);
      }}
      onBack={() => navigation.goBack()}
    />
  );
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
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const handleAddProfilePhoto = useCallback(async () => {
    const picked = await pickProfileImage();
    if (picked?.uri) {
      setProfilePhotoUri(picked.uri);
    }
  }, []);

  const saveProfileSetupStep = useCallback(
    async (track: SetupTrack) => {
      const profileName = displayName.trim() || user?.displayName?.trim() || '';
      let profilePhotoUrl: string | undefined;
      try {
        profilePhotoUrl = await uploadProfilePhotoIfConfigured(profilePhotoUri);
      } catch {
        profilePhotoUrl = undefined;
      }
      const stepData: Record<string, string> = {
        displayName: profileName,
        bio,
      };
      if (profilePhotoUrl) {
        stepData.profilePhotoUrl = profilePhotoUrl;
      }
      await completeStep(track, 'profile', stepData);
      if (profileName && profileName !== displayName) {
        setDisplayName(profileName);
      }
    },
    [bio, completeStep, displayName, profilePhotoUri, user?.displayName],
  );

  const [pendingIntent, setPendingIntent] = useState<PrimaryIntent | null>(null);
  const [demoLoginBusy, setDemoLoginBusy] = useState(false);
  const [demoLoginError, setDemoLoginError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [localBookings, setLocalBookings] = useState<BookingListItem[]>([]);
  const demoProfileSyncedForUser = useRef<string | null>(null);
  const [bookingFilter, setBookingFilter] = useState<BookingTabFilter>('active');
  const [payLoading, setPayLoading] = useState(false);
  const [payStatusLabel, setPayStatusLabel] = useState('Preparing payment...');
  const [lodgingFilter, setLodgingFilter] = useState<LodgingCategoryFilter>('ALL');
  const [savedLodgingIds, setSavedLodgingIds] = useState<string[]>([]);
  const [checklistCompleted, setChecklistCompleted] = useState<string[]>(
    profileState.seekerSetup.data.checklistCompleted ?? [],
  );
  const [checklistRemoved, setChecklistRemoved] = useState<string[]>(
    profileState.seekerSetup.data.checklistRemoved ?? [],
  );
  const [tourTypes, setTourTypes] = useState(tourTypesMock);
  const [tourBaseRate, setTourBaseRate] = useState('45');
  const [tourMaxGroupSize, setTourMaxGroupSize] = useState('8');
  const [hostProfileCache, setHostProfileCache] = useState<Record<string, HostProfileSummary>>(
    () => buildDemoHostProfileCache(),
  );
  const [guideProfileCache, setGuideProfileCache] = useState<Record<string, GuideProfileSummary>>(
    () => buildDemoGuideProfileCache(),
  );
  const conversationsApi = useConversations(user?.userId);
  const conversations = useMemo(
    () =>
      withDemoFallback(conversationsApi.conversations, conversationsMock, {
        isLoading: conversationsApi.isLoading,
        error: conversationsApi.error,
      }),
    [conversationsApi.conversations, conversationsApi.isLoading, conversationsApi.error],
  );
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

  useEffect(() => {
    if (primaryIntent !== 'GUIDE' || !user?.userId) {
      return;
    }
    void getMyGuideProfile()
      .then((profile) => {
        const merged = mergeTourTypesFromProfile(profile.serviceTypes, profile.pricePerSession);
        setTourTypes(merged.tourTypes);
        setTourBaseRate(merged.baseRate);
        setTourMaxGroupSize(readMaxGroupSize(profile.availabilitySchedule));
      })
      .catch(() => undefined);
  }, [primaryIntent, user?.userId]);

  const hostPendingDisplay = useMemo(
    () =>
      withDemoFallback(providerTab.hostPending, incomingBookingRequestsMock, {
        isLoading: providerTab.isLoading,
        error: providerTab.error,
      }),
    [providerTab.hostPending, providerTab.isLoading, providerTab.error],
  );

  const guidePendingDisplay = useMemo(
    () =>
      withDemoFallback(
        providerTab.guidePending,
        incomingBookingRequestsMock.filter((request) => request.bookingType === 'GUIDE'),
        { isLoading: providerTab.isLoading, error: providerTab.error },
      ),
    [providerTab.guidePending, providerTab.isLoading, providerTab.error],
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

  // Earnings mirror the confirmed stays/tours shown on the Bookings tabs, so a
  // demo host or guide sees payouts that match their calendar instead of an
  // empty "No payouts yet" screen when the backend has no live earnings yet.
  const hostEarningsDisplay = useMemo(
    () => computeEarningsFromBookings(hostActiveDisplay, 'This month'),
    [hostActiveDisplay],
  );

  const guideEarningsDisplay = useMemo(
    () => computeEarningsFromBookings(guideActiveDisplay, 'This month'),
    [guideActiveDisplay],
  );

  const studentEventsDisplay = useMemo(
    () =>
      withDemoFallback(studentEventsApi.events, studentEventsMock, {
        isLoading: studentEventsApi.isLoading,
        error: studentEventsApi.error,
      }),
    [studentEventsApi.events, studentEventsApi.isLoading, studentEventsApi.error],
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

  const mergedBookings = useMemo(
    () => mergeBookingsWithLocalOverrides(displayBookings, localBookings),
    [displayBookings, localBookings],
  );

  useEffect(() => {
    setBookings(mergedBookings);
  }, [mergedBookings]);

  const upsertLocalBooking = useCallback((booking: BookingListItem) => {
    setLocalBookings((prev) => {
      const index = prev.findIndex((item) => item.id === booking.id);
      if (index === -1) {
        return [booking, ...prev];
      }
      const next = [...prev];
      next[index] = booking;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!user?.userId) {
      demoProfileSyncedForUser.current = null;
      return;
    }
    const demoAccount = DEMO_ACTOR_ACCOUNTS.find((account) => account.email === user.email);
    if (!demoAccount || demoProfileSyncedForUser.current === user.userId) {
      return;
    }
    demoProfileSyncedForUser.current = user.userId;
    void (async () => {
      await applyDevPreset(demoPresetForAccount(demoAccount));
      await setPrimaryIntent(demoAccount.intent);
    })();
  }, [user?.userId, user?.email, applyDevPreset, setPrimaryIntent]);

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
      const matchParams = buildSearchMatchParams(profileState, {
        destinationCity: params.destinationCity,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        budgetMax: params.budgetMax,
      });
      const cityLabel = matchParams.city ?? params.destinationCity;

      try {
        const matches = await findMatches(matchParams);
        const hostMatches = matches.filter((m) => m.targetType === 'HOST');
        if (hostMatches.length > 0) {
          const results = hostMatches.map(matchToMatchResultHost);
          setHostProfileCache((prev) => {
            const next = { ...prev };
            for (const match of hostMatches) {
              next[match.targetId] = matchToHostSummary(match);
            }
            return next;
          });
          return { results };
        }

        return {
          results: [],
          error: `No hosts found in ${cityLabel}. Try adjusting your dates or budget.`,
        };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not load matches.';
        return { results: [], error: message };
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
    () =>
      uniqueByKey(
        withDemoFallback(
          homeApi.guideMatches.map(matchToGuideSummary),
          suggestedGuidesMock,
          { isLoading: homeApi.isLoading, error: homeApi.error },
        ),
        (guide) => guide.id,
      ),
    [homeApi.guideMatches, homeApi.isLoading, homeApi.error],
  );

  const suggestedGuidesDisplay = useMemo(
    () =>
      uniqueByKey(
        withDemoFallback(
          homeApi.suggestedGuides,
          guideSummariesToDiscoveryItems(suggestedGuidesMock),
          { isLoading: homeApi.isLoading, error: homeApi.error },
        ),
        (guide) => guide.id,
      ),
    [homeApi.suggestedGuides, homeApi.isLoading, homeApi.error],
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

  const exploreStayListings = useMemo(
    () =>
      uniqueByKey(
        withDemoFallback(
          hostMatchesToStayListings(homeApi.hostMatches),
          matchResultsToStayListings(sampleMatchResultsForCity(cityLabel)),
          { isLoading: homeApi.isLoading, error: homeApi.error },
        ),
        (listing) => listing.id,
      ),
    [homeApi.hostMatches, homeApi.isLoading, homeApi.error, cityLabel],
  );

  const suggestedHostsDisplay = useMemo(
    () =>
      uniqueByKey(
        withDemoFallback(homeApi.suggestedHosts, suggestedHostsForCity(cityLabel), {
          isLoading: homeApi.isLoading,
          error: homeApi.error,
        }),
        (host) => host.id,
      ),
    [homeApi.suggestedHosts, homeApi.isLoading, homeApi.error, cityLabel],
  );

  const displayTopMatchHostId =
    homeApi.topMatchTargetId ?? demoTopMatchHostIdForCity(cityLabel);
  const displayTopGuideId = homeApi.topGuideTargetId ?? demoTopGuideId;

  const lodgingApi = useLodgingPartners(cityLabel, !!user);
  const contentPhrases = usePhrases(cityLabel, !!user);
  const contentTopics = useTopics(cityLabel, !!user);
  const contentTransport = useTransport(cityLabel, !!user);
  const contentSites = useSites(cityLabel, !!user);
  const contentChecklist = useChecklist(cityLabel, !!user);
  const contentEmergency = useEmergencyContacts(!!user);
  const contentLandmarks = useMapLandmarks(cityLabel, !!user);
  const contentVideos = useVideos(cityLabel, undefined, !!user);

  const emergencyContactsDisplay = useMemo(
    () =>
      uniqueByContactNumber(
        withDemoFallback(contentEmergency.data, emergencyContactsMock, {
          isLoading: contentEmergency.isLoading,
          error: contentEmergency.error,
          matchKey: (item) =>
            normalizeContactNumber(
              String((item as { number?: string }).number ?? ''),
            ),
        }),
      ).filter(
        (contact) =>
          normalizeContactNumber(contact.number) !==
          normalizeContactNumber(localEmergencyNumber),
      ),
    [contentEmergency.data, contentEmergency.isLoading, contentEmergency.error],
  );

  const lodgingListingsDisplay = useMemo(
    () =>
      withDemoFallback(lodgingApi.listings, lodgingListingsForCity(cityLabel), {
        isLoading: lodgingApi.isLoading,
        error: lodgingApi.error,
      }),
    [lodgingApi.listings, lodgingApi.isLoading, lodgingApi.error, cityLabel],
  );

  const phrasesDisplay = useMemo(() => {
    // Prefer the richer curated Ghana phrase set in demo builds so thin DB
    // seeds do not replace useful relocation content.
    if (phrasesApiMock.length > 0) {
      return phrasesApiMock;
    }
    return withDemoFallback(contentPhrases.data, phrasesApiMock, {
      isLoading: contentPhrases.isLoading,
      error: contentPhrases.error,
    });
  }, [contentPhrases.data, contentPhrases.isLoading, contentPhrases.error]);

  const topicsDisplay = useMemo(() => {
    if (topicsApiMock.length > 0) {
      return topicsApiMock;
    }
    return withDemoFallback(contentTopics.data, topicsApiMock, {
      isLoading: contentTopics.isLoading,
      error: contentTopics.error,
    });
  }, [contentTopics.data, contentTopics.isLoading, contentTopics.error]);

  const transportDisplay = useMemo(
    () =>
      uniqueByKey(
        withDemoFallback(contentTransport.data, transportApiMock, {
          isLoading: contentTransport.isLoading,
          error: contentTransport.error,
          matchKey: (item) => String((item as { id?: string }).id ?? ''),
        }),
        (tab) => tab.id,
      ),
    [contentTransport.data, contentTransport.isLoading, contentTransport.error],
  );

  const sitesDisplay = useMemo(
    () =>
      uniqueByKey(
        withDemoFallback(contentSites.data, sitesApiMock, {
          isLoading: contentSites.isLoading,
          error: contentSites.error,
          matchKey: (item) => {
            const site = item as { siteKey?: string; name?: string };
            return site.siteKey || site.name || '';
          },
        }),
        (site) => site.siteKey || site.name,
      ),
    [contentSites.data, contentSites.isLoading, contentSites.error],
  );

  const checklistContentDisplay = useMemo(
    () =>
      uniqueByKey(
        withDemoFallback(contentChecklist.data, checklistApiMock, {
          isLoading: contentChecklist.isLoading,
          error: contentChecklist.error,
          matchKey: (item) =>
            String((item as { itemKey?: string }).itemKey ?? ''),
        }),
        (item) => item.itemKey,
      ),
    [contentChecklist.data, contentChecklist.isLoading, contentChecklist.error],
  );

  const landmarksDisplay = useMemo(
    () =>
      uniqueByKey(
        withDemoFallback(contentLandmarks.data, landmarksApiMock, {
          isLoading: contentLandmarks.isLoading,
          error: contentLandmarks.error,
          matchKey: (item) => String((item as { name?: string }).name ?? ''),
        }),
        (landmark) => landmark.name,
      ),
    [contentLandmarks.data, contentLandmarks.isLoading, contentLandmarks.error],
  );

  const videosDisplay = useMemo(
    () =>
      sanitizeVideoResources(
        uniqueByKey(
          withDemoFallback(contentVideos.data, videosApiMock, {
            isLoading: contentVideos.isLoading,
            error: contentVideos.error,
            matchKey: (item) =>
              String((item as { videoKey?: string }).videoKey ?? ''),
          }),
          (video) => video.videoKey,
        ),
      ),
    [contentVideos.data, contentVideos.isLoading, contentVideos.error],
  );

  const checklistTasks = useMemo(
    () =>
      checklistContentDisplay
        .filter((item) => !checklistRemoved.includes(item.itemKey))
        .map((item) => ({
          id: item.itemKey,
          label: item.label,
          completed: checklistCompleted.includes(item.itemKey),
        })),
    [checklistContentDisplay, checklistCompleted, checklistRemoved],
  );

  const sitesDirectoryItems = useMemo(
    () =>
      sitesDisplay.map((site) => ({
        id: site.siteKey,
        name: site.name,
        city: site.city,
        description: site.description,
        admission: site.admission ?? '',
      })),
    [sitesDisplay],
  );

  useEffect(() => {
    setChecklistCompleted(profileState.seekerSetup.data.checklistCompleted ?? []);
    setChecklistRemoved(profileState.seekerSetup.data.checklistRemoved ?? []);
  }, [
    profileState.seekerSetup.data.checklistCompleted,
    profileState.seekerSetup.data.checklistRemoved,
    user?.userId,
  ]);
  const checkIn = defaultCheckIn(arrivalDate || profileFields.arrivalDate);
  const checkOut = defaultCheckOut(departureDate || profileFields.departureDate);
  const sessionDate = arrivalDate || profileFields.arrivalDate || DEFAULT_SESSION_DATE;
  const setupSummary = getAccountSetupSummary(profileState);
  const showMatchScores = isSeekerComplete(profileState);

  const roleNotificationsMock = useMemo(
    () => notificationsMockForIntent(primaryIntent),
    [primaryIntent],
  );
  const [unreadNotifications, setUnreadNotifications] = useState(
    getUnreadNotificationCount(primaryIntent),
  );
  const [notificationsList, setNotificationsList] = useState(roleNotificationsMock);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const refreshNotificationState = useCallback(async () => {
    if (!user) {
      return;
    }
    const fallback = notificationsMockForIntent(primaryIntent);
    try {
      const [count, list] = await Promise.all([
        fetchUnreadNotificationCount(),
        fetchNotifications(),
      ]);
      const display = withDemoFallback(list, fallback);
      setNotificationsList(display);
      setUnreadNotifications(
        list.length > 0 ? count : display.filter((n) => !n.read).length,
      );
    } catch {
      setUnreadNotifications(getUnreadNotificationCount(primaryIntent));
      setNotificationsList(fallback);
    }
  }, [user, primaryIntent]);

  useEffect(() => {
    setNotificationsList(roleNotificationsMock);
    setUnreadNotifications(getUnreadNotificationCount(primaryIntent));
  }, [primaryIntent, roleNotificationsMock]);

  useEffect(() => {
    if (!user) {
      setUnreadNotifications(0);
      return;
    }
    void refreshNotificationState();
  }, [user?.userId, bookings.length, hostIncoming.length, guideIncoming.length, refreshNotificationState]);

  const openNotifications = useCallback(
    (navigation: NativeStackNavigationProp<AppStackParamList>) => {
      setNotificationsLoading(true);
      void refreshNotificationState().finally(() => setNotificationsLoading(false));
      navigation.navigate('Notifications');
    },
    [refreshNotificationState],
  );
  const incomingBadgeCount =
    (canAcceptGuideSessions && guideIncoming.length > 0
      ? guideIncoming.length
      : 0) +
    (canAcceptHostBookings && hostIncoming.length > 0 ? hostIncoming.length : 0);
  const homeRole = homeRoleFromIntent(primaryIntent);
  const demoRecommendations = useMemo(
    () =>
      buildDemoHomeRecommendations(
        homeRole === 'BROWSE' ? 'TOURIST' : primaryIntent ?? 'STUDENT',
        cityLabel,
        { university: university || profileFields.university },
      ),
    [homeRole, primaryIntent, cityLabel, university, profileFields.university],
  );
  const [liveRecommendations, setLiveRecommendations] =
    useState<HomeRecommendations | null>(null);

  useEffect(() => {
    if (!user) {
      setLiveRecommendations(null);
      return;
    }
    let cancelled = false;
    void getHomeRecommendations({
      city: cityLabel,
      role: primaryIntent ?? undefined,
    })
      .then((data) => {
        if (!cancelled && data?.sections?.length) {
          setLiveRecommendations(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLiveRecommendations(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, cityLabel, primaryIntent]);

  const homeRecommendations = liveRecommendations ?? demoRecommendations;

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
      await signIn(account.email, DEMO_PASSWORD, true);
      await applyDevPreset(demoPresetForAccount(account));
      await setPrimaryIntent(account.intent);
    } catch (error) {
      setDemoLoginError(devTestingCopy.demoActorsLoginError);
    } finally {
      setDemoLoginBusy(false);
    }
  }, [signIn, applyDevPreset, setPrimaryIntent]);
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

  const homeDataError = presentableError(
    homeApi.error,
    homeApi.bookings,
    displayBookings,
  );
  const isHomeLoading = presentableLoading(
    homeApi.isLoading,
    homeApi.hostMatches,
    suggestedHostsDisplay,
  );
  const studentLive = buildStudentHomeStatus(
    mergedBookings,
    cityLabel,
    seekerSetupIncomplete,
    homeDataError,
  );
  const touristLive = buildTouristHomeStatus(
    mergedBookings,
    cityLabel,
    seekerSetupIncomplete,
    homeDataError,
  );
  const hostLive = buildHostHomeStatus(
    hostIncoming,
    presentableError(providerTab.error ?? homeApi.error, providerTab.hostPending, hostPendingDisplay),
  );
  const guideLive = buildGuideHomeStatus(
    guideIncoming,
    presentableError(providerTab.error ?? homeApi.error, providerTab.guidePending, guidePendingDisplay),
  );

  const homeProps = useMemo(
    () => ({
      ...studentHomeMockData,
      greeting: personalizedGreeting,
      userName: firstName,
      userInitials: resolvedInitials,
      activeTabId: 'home',
      tabBarItems,
      featuredMatch: withDemoFallbackValue(
        homeApi.featuredMatch,
        studentFeaturedMatchForCity(cityLabel),
        { isLoading: homeApi.isLoading, error: homeApi.error },
      ),
      suggestedHosts: suggestedHostsDisplay.filter(
        (host) => host.id !== displayTopMatchHostId,
      ),
      recommendedSectionTitle: 'Prep before you arrive',
      recommendationSections: homeRecommendations.sections,
      recommendationHeadline: homeRecommendations.headline,
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
      suggestedHostsDisplay,
      displayTopMatchHostId,
      showMatchScores,
      isHomeLoading,
      homeDataError,
      studentLive.statusLabel,
      studentLive.reminder,
      studentLive.recentActivity,
      seekerSetupIncomplete,
      primaryIntent,
      cityLabel,
      homeRecommendations,
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
      featuredGuide: withDemoFallbackValue(
        homeApi.featuredGuide,
        touristFeaturedGuideMock,
        { isLoading: homeApi.isLoading, error: homeApi.error },
      ),
      quickActions: getQuickActionsForRole('BROWSE'),
      sections: exploreSectionsForCity(cityLabel),
      exploreSectionTitle: `Explore ${cityLabel.split(',')[0]?.trim() || cityLabel}`,
      recentActivity:
        touristLive.recentActivity.length > 0
          ? touristLive.recentActivity
          : touristRecentActivityMock,
      reminder: touristLive.reminder,
      tabBarItems,
      activeTabId: 'home',
      showSetupBanner: false,
      suggestedGuides: suggestedGuidesDisplay.filter(
        (guide) => guide.id !== displayTopGuideId,
      ),
      showMatchScores,
      recommendationSections: homeRecommendations.sections,
      recommendationHeadline: homeRecommendations.headline,
    }),
    [firstName, resolvedInitials, cityLabel, tabBarItems, personalizedGreeting, touristLive, homeApi.featuredGuide, homeDataError, suggestedGuidesDisplay, displayTopGuideId, showMatchScores, homeRecommendations],
  );

  const exploreHomeProps = useMemo(
    () => ({
      greeting: getPersonalizedGreeting(firstName),
      userName: firstName,
      userInitials: resolvedInitials,
      cityLabel,
      statusIcon: '🌍',
      statusLabel: touristLive.statusLabel,
      featuredGuide: withDemoFallbackValue(
        homeApi.featuredGuide,
        touristFeaturedGuideMock,
        { isLoading: homeApi.isLoading, error: homeApi.error },
      ),
      suggestedGuides: suggestedGuidesDisplay.filter(
        (guide) => guide.id !== displayTopGuideId,
      ),
      showMatchScores,
      isHomeLoading,
      recommendationSections: homeRecommendations.sections,
      recommendationHeadline: homeRecommendations.headline,
      homeDataError,
      quickActions: getQuickActionsForRole('TOURIST'),
      sections: exploreSectionsForCity(cityLabel),
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
      suggestedGuidesDisplay,
      displayTopGuideId,
      showMatchScores,
      isHomeLoading,
      homeDataError,
      seekerSetupIncomplete,
      primaryIntent,
      homeRecommendations,
    ],
  );

  const conversationsLoading = presentableLoading(
    conversationsApi.isLoading,
    conversationsApi.conversations,
    conversations,
  );
  const conversationsError = presentableError(
    conversationsApi.error,
    conversationsApi.conversations,
    conversations,
  );
  const hostRequestsLoading = presentableLoading(
    providerTab.isLoading,
    providerTab.hostPending,
    hostPendingDisplay,
  );
  const hostRequestsError = presentableError(
    providerTab.error,
    providerTab.hostPending,
    hostPendingDisplay,
  );
  const hostBookingsLoading = presentableLoading(
    providerTab.isLoading,
    providerTab.hostActiveBookings,
    hostActiveDisplay,
  );
  const hostBookingsError = presentableError(
    providerTab.error,
    providerTab.hostActiveBookings,
    hostActiveDisplay,
  );
  const guideBookingsLoading = presentableLoading(
    providerTab.isLoading,
    providerTab.guideActiveBookings,
    guideActiveDisplay,
  );
  const guideBookingsError = presentableError(
    providerTab.error,
    providerTab.guideActiveBookings,
    guideActiveDisplay,
  );
  const hostEarningsLoading = presentableLoading(
    providerTab.isLoading,
    providerTab.hostEarningsLineItems,
    hostEarningsDisplay.lineItems,
  );
  const hostEarningsError = presentableError(
    providerTab.error,
    providerTab.hostEarningsLineItems,
    hostEarningsDisplay.lineItems,
  );
  const guideEarningsLoading = presentableLoading(
    providerTab.isLoading,
    providerTab.earningsLineItems,
    guideEarningsDisplay.lineItems,
  );
  const guideEarningsError = presentableError(
    providerTab.error,
    providerTab.earningsLineItems,
    guideEarningsDisplay.lineItems,
  );
  const lodgingLoading = presentableLoading(
    lodgingApi.isLoading,
    lodgingApi.listings,
    lodgingListingsDisplay,
  );
  const lodgingError = presentableError(
    lodgingApi.error,
    lodgingApi.listings,
    lodgingListingsDisplay,
  );
  const videosLoading = presentableLoading(
    contentVideos.isLoading,
    contentVideos.data,
    videosDisplay,
  );
  const videosError = presentableError(
    contentVideos.error,
    contentVideos.data,
    videosDisplay,
  );
  const studentEventsLoading = presentableLoading(
    studentEventsApi.isLoading,
    studentEventsApi.events,
    studentEventsDisplay,
  );
  const studentEventsError = presentableError(
    studentEventsApi.error,
    studentEventsApi.events,
    studentEventsDisplay,
  );

  const initialRoute = primaryIntent
    ? homeRouteToScreenName(homeRouteKey)
    : 'IntentSelect';

  const makeBookingContext = (
    bookingType: 'HOST' | 'GUIDE',
    override?: BookingContext,
  ): BookingContext => override ?? getBookingContext(bookingType);

  const submitHostBookingRequest = useCallback(
    async (host: HostProfileSummary) => {
      const bookingContext = getBookingContext('HOST');
      try {
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
      } catch {
        upsertLocalBooking(
          createDemoHostBookingRequest(host, checkIn, checkOut, bookingContext),
        );
      }
    },
    [checkIn, checkOut, getBookingContext, homeApi, upsertLocalBooking],
  );

  const submitGuideBookingRequest = useCallback(
    async (guide: GuideProfileSummary) => {
      const bookingContext = getBookingContext('GUIDE');
      try {
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
      } catch {
        upsertLocalBooking(
          createDemoGuideBookingRequest(
            guide,
            sessionDate,
            DEFAULT_SESSION_TIME,
            bookingContext,
          ),
        );
      }
    },
    [sessionDate, getBookingContext, homeApi, upsertLocalBooking],
  );

  const confirmBookingWithDemoFallback = useCallback(
    async (bookingId: string): Promise<BookingListItem | null> => {
      const booking = mergedBookings.find((item) => item.id === bookingId) ?? null;

      // Mock/demo rows (e.g. booking-1) are not UUIDs — confirm locally only.
      if (booking && !isApiBookingId(bookingId)) {
        setPayStatusLabel('Confirming payment...');
        const confirmed = confirmDemoBooking(booking);
        upsertLocalBooking(confirmed);
        return confirmed;
      }

      try {
        const payment = await completeBookingPayment(bookingId, {
          onProgress: (phase, detail) => {
            if (detail) {
              setPayStatusLabel(detail);
              return;
            }
            if (phase === 'preparing') setPayStatusLabel('Preparing payment...');
            else if (phase === 'opening_checkout') setPayStatusLabel('Opening Paystack...');
            else if (phase === 'awaiting_confirmation') {
              setPayStatusLabel('Confirming payment...');
            } else if (phase === 'verifying') setPayStatusLabel('Verifying payment...');
            else if (phase === 'success') setPayStatusLabel('Payment Successful');
          },
        });
        homeApi.refresh();
        const confirmed = confirmDemoBooking(
          booking ?? {
            id: payment.booking.bookingId,
            bookingType: payment.booking.bookingType,
            hostId: payment.booking.hostOrGuideId,
            hostName: payment.booking.providerName ?? 'Host',
            hostInitials: (payment.booking.providerName ?? 'HO').slice(0, 2).toUpperCase(),
            hostLocation: '',
            checkIn: payment.booking.checkIn ?? '',
            checkOut: payment.booking.checkOut ?? payment.booking.sessionDate ?? '',
            status: 'ACCEPTED',
            priceBreakdown: {
              nightlyRate: 0,
              currency: payment.currency ?? 'GHS',
              nights: 1,
              subtotal: payment.booking.totalPrice ?? 0,
              platformFee: payment.booking.platformFee ?? 0,
              total: payment.booking.totalPrice ?? payment.amount ?? 0,
            },
            cancellationPolicy: 'Flexible',
            createdAt: new Date().toISOString(),
            seekerRole: 'STUDENT',
            bookingContext: 'STUDENT',
          },
        );
        upsertLocalBooking(confirmed);
        return confirmed;
      } catch (error) {
        const message = getApiErrorMessage(error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(message);
      }
    },
    [homeApi, mergedBookings, upsertLocalBooking],
  );

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
            guidesEmptyState={emptyStates.discoveryGuides(cityLabel)}
            onSectionPress={(sectionId) => handleExploreSectionPress(navigation, sectionId)}
            onFeaturedGuidePress={() =>
              navigation.navigate('GuideProfile', { guideId: displayTopGuideId })
            }
            onSuggestedGuidePress={(guideId) =>
              navigation.navigate('GuideProfile', { guideId })
            }
            onGuidesEmptyPrimaryAction={() => navigation.navigate('GuideSearch')}
            onRecommendationsEmptyPress={() => navigation.navigate('GuideSearch')}
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
            onEmptyPrimaryAction={() => {
              if (primaryIntent === 'HOST') {
                navigation.reset({ index: 0, routes: [{ name: 'HostHome' }] });
                return;
              }
              if (primaryIntent === 'GUIDE') {
                navigation.reset({ index: 0, routes: [{ name: 'GuideHome' }] });
                return;
              }
              if (primaryIntent === 'TOURIST') {
                navigation.navigate('GuideSearch');
                return;
              }
              navigation.navigate('MatchSearch');
            }}
            isLoading={conversationsLoading}
            errorMessage={conversationsError}
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
            isLoading={hostRequestsLoading}
            errorMessage={hostRequestsError}
            emptyState={emptyStates.hostRequests}
            onEmptyPrimaryAction={() => navigation.navigate('HostListings')}
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
            isLoading={hostBookingsLoading}
            errorMessage={hostBookingsError}
            emptyState={emptyStates.hostBookings}
            onEmptyPrimaryAction={() =>
              navigation.reset({ index: 0, routes: [{ name: 'HostRequestsTab' }] })
            }
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'HostHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostEarningsTab">
        {({ navigation }) => (
          <HostEarningsTabScreen
            userName={firstName}
            userInitials={resolvedInitials}
            summary={hostEarningsDisplay.summary}
            lineItems={hostEarningsDisplay.lineItems}
            tabBarItems={hostTabBarItems}
            activeTabId="earnings"
            isLoading={hostEarningsLoading}
            errorMessage={hostEarningsError}
            emptyState={emptyStates.hostEarnings}
            onEmptyPrimaryAction={() =>
              navigation.reset({ index: 0, routes: [{ name: 'HostBookingsTab' }] })
            }
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
            isLoading={guideBookingsLoading}
            errorMessage={guideBookingsError}
            emptyState={emptyStates.guideBookings}
            onEmptyPrimaryAction={() => navigation.navigate('GuideAvailability')}
            onBookingPress={(requestId) =>
              navigation.navigate('SessionReview', { requestId })
            }
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'GuideHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideEarningsTab">
        {({ navigation }) => (
          <GuideEarningsTabScreen
            userName={firstName}
            userInitials={resolvedInitials}
            summary={guideEarningsDisplay.summary}
            lineItems={guideEarningsDisplay.lineItems}
            tabBarItems={guideTabBarItems}
            activeTabId="earnings"
            isLoading={guideEarningsLoading}
            errorMessage={guideEarningsError}
            emptyState={emptyStates.guideEarnings}
            onEmptyPrimaryAction={() =>
              navigation.reset({ index: 0, routes: [{ name: 'GuideBookingsTab' }] })
            }
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'GuideHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Notifications">
        {({ navigation }) => (
          <NotificationsScreen
            userName={firstName}
            userInitials={resolvedInitials}
            notifications={notificationsList}
            isLoading={notificationsLoading}
            onBack={() => navigation.goBack()}
            onEmptyPrimaryAction={() => {
              if (primaryIntent === 'HOST') {
                navigation.reset({ index: 0, routes: [{ name: 'HostHome' }] });
                return;
              }
              if (primaryIntent === 'GUIDE') {
                navigation.reset({ index: 0, routes: [{ name: 'GuideHome' }] });
                return;
              }
              if (primaryIntent === 'TOURIST') {
                navigation.reset({ index: 0, routes: [{ name: 'ExploreHome' }] });
                return;
              }
              navigation.reset({ index: 0, routes: [{ name: 'StudentHome' }] });
            }}
            onMarkAllRead={() => {
              void (async () => {
                try {
                  await markAllNotificationsRead();
                  await refreshNotificationState();
                } catch {
                  Alert.alert('Notifications', 'Could not mark all as read.');
                }
              })();
            }}
            onNotificationPress={(notification) => {
              void (async () => {
                try {
                  if (!notification.read) {
                    await markNotificationRead(notification.id);
                    await refreshNotificationState();
                  }
                  if (notification.relatedBookingId) {
                    navigation.navigate('StudentBookings');
                  }
                } catch {
                  // still allow navigation
                  if (notification.relatedBookingId) {
                    navigation.navigate('StudentBookings');
                  }
                }
              })();
            }}
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
            showTravelBooking={shouldShowTravelBookingEntry(homeRole)}
            showStaffTools={Boolean(user?.isStaff)}
            onAccountSetupPress={() => navigation.navigate('AccountSetup')}
            onTravelBookingPress={() => navigation.navigate('UnifiedSearch')}
            onStaffToolsPress={() => navigation.navigate('StaffUserSearch')}
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
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ExploreHub">
        {({ navigation }) => {
          const isProvider = homeRole === 'HOST' || homeRole === 'GUIDE';
          const isTouristBrowse = homeRole === 'TOURIST' || homeRole === 'BROWSE';
          const primaryLabel =
            homeRole === 'STUDENT'
              ? 'Find a host'
              : isTouristBrowse
                ? 'Book a trip'
                : 'Browse stays & guides';
          return (
            <ExploreHubScreen
              title="Explore"
              subtitle={
                isTouristBrowse
                  ? 'Book guided trips, find stays, and explore culture in Ghana'
                  : homeRole === 'STUDENT'
                    ? 'Find a host family, guides, and support for life in Ghana'
                    : 'Homestays, guides, culture, and support for life in Ghana'
              }
              primaryActionLabel={primaryLabel}
              primaryActionHint={
                homeRole === 'STUDENT'
                  ? 'Match with verified host families near campus in Ghana'
                  : isTouristBrowse
                    ? 'Book local guides for tours, orientation, and cultural experiences'
                    : 'Homestays, local guides, hotels, and lodging across Ghana'
              }
              travelBookingLabel={
                isTouristBrowse ? 'Find stays & lodging' : undefined
              }
              travelBookingHint={
                isTouristBrowse
                  ? 'Homestays, hotels, and hostels across Ghana'
                  : undefined
              }
              hubItems={profileCulturalItems}
              tabBarItems={getTabBarForRole(homeRole)}
              activeTabId={isProvider ? 'home' : 'explore'}
              onPrimaryActionPress={() => {
                if (homeRole === 'STUDENT') {
                  navigation.navigate('MatchSearch');
                  return;
                }
                if (isTouristBrowse) {
                  // Trip booking = guide sessions (tours / experiences).
                  navigation.navigate('GuideSearch');
                  return;
                }
                navigation.navigate('UnifiedSearch');
              }}
              onTravelBookingPress={
                isTouristBrowse
                  ? () => navigation.navigate('UnifiedSearch')
                  : undefined
              }
              onHubItemPress={(itemId) =>
                handleProfileCulturalItem(navigation, itemId)
              }
              onTabPress={(tabId) => routeTabPress(navigation, tabId)}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="StaffUserSearch">
        {({ navigation }) => (
          <StaffUserSearchRoute
            onSelectUser={(userId) =>
              navigation.navigate('StaffUserDetail', { userId })
            }
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StaffUserDetail">
        {({ navigation, route }) => (
          <StaffUserDetailRoute
            userId={route.params.userId}
            onViewActivity={(userId, userName) =>
              navigation.navigate('StaffUserActivity', { userId, userName })
            }
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StaffUserActivity">
        {({ navigation, route }) => (
          <StaffUserActivityRoute
            userId={route.params.userId}
            userName={route.params.userName}
            onBack={() => navigation.goBack()}
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
            activeTabId="explore"
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
              photoUri={profilePhotoUri}
              onAddPhoto={handleAddProfilePhoto}
              onDisplayNameChange={setDisplayName}
              onBioChange={setBio}
              onContinue={() => {
                void (async () => {
                  await saveProfileSetupStep(track);
                  if (track === 'HOST' || track === 'GUIDE') {
                    navigation.navigate('KYCPrompt', { track });
                    return;
                  }
                  navigation.navigate('OnboardingReady', { track });
                })();
              }}
              onSkip={() => {
                void (async () => {
                  await saveProfileSetupStep(track);
                  if (track === 'HOST' || track === 'GUIDE') {
                    navigation.navigate('KYCPrompt', { track });
                    return;
                  }
                  navigation.navigate('OnboardingReady', { track });
                })();
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
              onVerifyNow={() => {
                void (async () => {
                  try {
                    const session = await createKycSession();
                    if (session.verificationUrl) {
                      await Linking.openURL(session.verificationUrl);
                    } else if (session.message) {
                      Alert.alert('Verification', session.message);
                    }
                  } catch (error) {
                    Alert.alert(
                      'Verification',
                      getApiErrorMessage(error),
                    );
                  }
                  navigation.navigate('OnboardingReady', { track });
                })();
              }}
              onVerifyLater={() => navigation.navigate('OnboardingReady', { track })}
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
            userName: firstName,
            destination,
            university: university || profileFields.university,
            city: city || profileFields.city,
          });

          const resolveHome = (): keyof AppStackParamList => {
            if (track === 'HOST' || primaryIntent === 'HOST') {
              return 'HostHome';
            }
            if (track === 'GUIDE' || primaryIntent === 'GUIDE') {
              return 'GuideHome';
            }
            if (primaryIntent === 'TOURIST') {
              return 'ExploreHome';
            }
            if (primaryIntent === 'STUDENT') {
              return 'StudentHome';
            }
            return 'BrowseHome';
          };

          const resolvePrimaryScreen = (): keyof AppStackParamList => {
            if (track === 'HOST') {
              return 'IncomingRequests';
            }
            if (track === 'GUIDE') {
              return 'GuideBookingsTab';
            }
            if (primaryIntent === 'STUDENT') {
              return 'MatchSearch';
            }
            if (primaryIntent === 'TOURIST') {
              return 'GuideSearch';
            }
            return 'UnifiedSearch';
          };

          const finishOnboarding = async () => {
            await completeStep(track, 'ready');
            await markTrackComplete(track);
            if (track === 'SEEKER' && primaryIntent === 'STUDENT') {
              homeApi.refresh();
            }
            if (track === 'SEEKER' && primaryIntent === 'TOURIST') {
              homeApi.refresh();
            }
          };

          const goToDashboard = async () => {
            await finishOnboarding();
            navigation.reset({
              index: 0,
              routes: [{ name: resolveHome() }],
            });
          };

          const goToPrimaryAction = async () => {
            await finishOnboarding();
            const home = resolveHome();
            const primaryScreen = resolvePrimaryScreen();
            navigation.reset({
              index: 1,
              routes: [{ name: home }, { name: primaryScreen }],
            });
          };

          return (
            <OnboardingReadyScreen
              subtitle={readyCopy.subtitle}
              heroImageUri={readyCopy.heroImageUri}
              carouselCards={readyCopy.carouselCards}
              ctaLabel={readyCopy.ctaLabel}
              roleLabel={readyCopy.roleLabel}
              roleIcon={readyCopy.roleIcon}
              onPrimaryAction={() => {
                void goToPrimaryAction();
              }}
              onContinueLater={() => {
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
            hostsEmptyState={emptyStates.discoveryHosts(cityLabel)}
            notificationCount={unreadNotifications}
            onNotificationPress={() => openNotifications(navigation)}
            {...homeTabSosProps(navigation)}
            onSetupPress={() => continueSeekerSetup(navigation)}
            onFeaturedMatchPress={() => {
              navigation.navigate('HostProfile', {
                hostId: displayTopMatchHostId,
              });
            }}
            onSuggestedHostPress={(hostId) =>
              navigation.navigate('HostProfile', { hostId })
            }
            onHostsEmptyPrimaryAction={() => navigation.navigate('MatchSearch')}
            onRecommendedSectionPress={(sectionId) =>
              handleExploreSectionPress(navigation, sectionId)
            }
            onRecommendationItemPress={(item) =>
              handleRecommendationItemPress(navigation, item)
            }
            onRecommendationsEmptyPress={() => navigation.navigate('MatchSearch')}
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
            guidesEmptyState={emptyStates.discoveryGuides(cityLabel)}
            notificationCount={unreadNotifications}
            onNotificationPress={() => openNotifications(navigation)}
            {...homeTabSosProps(navigation)}
            onSetupPress={() => continueSeekerSetup(navigation)}
            onFeaturedGuidePress={() => {
              navigation.navigate('GuideProfile', {
                guideId: displayTopGuideId,
              });
            }}
            onSuggestedGuidePress={(guideId) =>
              navigation.navigate('GuideProfile', { guideId })
            }
            onGuidesEmptyPrimaryAction={() => navigation.navigate('GuideSearch')}
            onSectionPress={(sectionId) => handleExploreSectionPress(navigation, sectionId)}
            onRecommendationItemPress={(item) =>
              handleRecommendationItemPress(navigation, item)
            }
            onRecommendationsEmptyPress={() => navigation.navigate('GuideSearch')}
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
              performanceStats={hostPerformanceMock}
              recommendationSections={homeRecommendations.sections}
              recommendationHeadline={homeRecommendations.headline}
              requests={hostIncoming}
              emptyState={emptyStates.hostRequests}
              onEmptyPrimaryAction={() => navigation.navigate('HostListings')}
              recentActivity={hostLive.recentActivity}
              reminder={hostLive.reminder}
              tabBarItems={hostTabBarItems}
              activeTabId="home"
              notificationCount={unreadNotifications}
              onNotificationPress={() => openNotifications(navigation)}
              {...homeTabSosProps(navigation)}
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
              onRecommendationItemPress={(item) =>
                handleRecommendationItemPress(navigation, item)
              }
              onRecommendationsEmptyPress={() => navigation.navigate('HostListings')}
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
              recommendationSections={homeRecommendations.sections}
              recommendationHeadline={homeRecommendations.headline}
              requests={guideIncoming}
              emptyState={emptyStates.guideRequests}
              onEmptyPrimaryAction={() => navigation.navigate('TourTypesSetup')}
              recentActivity={guideLive.recentActivity}
              reminder={guideLive.reminder}
              tabBarItems={guideTabBarItems}
              activeTabId="home"
              notificationCount={unreadNotifications}
              onNotificationPress={() => openNotifications(navigation)}
              {...homeTabSosProps(navigation)}
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
              onRecommendationItemPress={(item) =>
                handleRecommendationItemPress(navigation, item)
              }
              onRecommendationsEmptyPress={() => navigation.navigate('TourTypesSetup')}
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
            payLoading={payLoading}
            payStatusLabel={payStatusLabel}
            onPayPress={async (bookingId) => {
              if ((!canBookHomestay && !canBookGuideSession) || payLoading) {
                return;
              }
              setPayStatusLabel('Preparing payment...');
              setPayLoading(true);
              try {
                const confirmed = await confirmBookingWithDemoFallback(bookingId);
                if (!confirmed) {
                  Alert.alert('Payment failed', 'We could not find that booking.');
                  return;
                }
                Alert.alert('Payment Successful', 'Your booking is confirmed.');
                navigation.navigate('BookingConfirmed', { bookingId });
              } catch (error) {
                if (error instanceof PaymentCancelledError) {
                  Alert.alert('Payment cancelled', error.message);
                  return;
                }
                Alert.alert(
                  'Payment',
                  error instanceof Error
                    ? error.message
                    : 'Payment could not be completed. You can try again.',
                );
              } finally {
                setPayLoading(false);
                setPayStatusLabel('Preparing payment...');
              }
            }}
            onTabPress={(tabId) => routeTabPress(navigation, tabId)}
            onEmptyPrimaryAction={() => {
              if (primaryIntent === 'TOURIST') {
                navigation.navigate('GuideSearch');
                return;
              }
              navigation.navigate('MatchSearch');
            }}
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
            activeTabId="explore"
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
              await submitHostBookingRequest(host);
              setBookingFilter('pending');
              navigation.navigate('StudentBookings');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="BookingConfirmed">
        {({ navigation, route }) => {
          const booking =
            mergedBookings.find((b) => b.id === route.params.bookingId) ??
            bookings.find((b) => b.id === route.params.bookingId);
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
        {({ navigation, route }) => {
          const siteId = route.params?.siteId;
          const siteName = route.params?.siteName;
          const site = siteId ? touristSiteSummaryFromId(siteId) : null;
          const attractionGuides = siteId
            ? guidesForAttraction(
                guideListForSearch,
                siteId,
                site?.city ?? cityLabel,
                site?.guideKeywords ?? [],
              )
            : guideListForSearch;

          return (
            <GuideSearchScreen
              title={siteName ? `Guides for ${siteName}` : 'Book a trip'}
              subtitle={
                siteName
                  ? `Local guides who know ${siteName}`
                  : 'Tours, orientation, and cultural experiences'
              }
              cityLabel={site?.city ?? cityLabel}
              guides={attractionGuides}
              showMatchScores={showMatchScores}
              onBack={() => navigation.goBack()}
              onGuidePress={(guideId) =>
                navigation.navigate('GuideProfile', { guideId })
              }
              onEmptyPrimaryAction={() => navigation.navigate('ExploreStays')}
            />
          );
        }}
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
              await submitGuideBookingRequest(guide);
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
            listings={lodgingListingsDisplay}
            isLoading={lodgingLoading}
            errorMessage={lodgingError}
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
            lodgingListingFromId(route.params.listingId, lodgingListingsDisplay) ??
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
            onEmptyPrimaryAction={() => navigation.navigate('GuideSearch')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="WelfareCheckIn">
        {({ navigation, route }) => {
          const booking = bookings.find((entry) => entry.id === route.params.bookingId);

          return (
            <WelfareCheckInStackScreen
              navigation={navigation}
              route={route}
              hostName={booking?.hostName ?? 'your host'}
              checkIn={booking?.checkIn ?? checkIn}
              checkOut={booking?.checkOut ?? checkOut}
              questions={welfareCheckInQuestions}
              onSosPress={() => navigation.navigate('SOS')}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="ReviewPrompt">
        {(props) => <ReviewPromptStackScreen {...props} />}
      </Stack.Screen>

      <Stack.Screen name="SOS">
        {({ navigation }) => (
          <SOSScreen
            emergencyContacts={emergencyContactsDisplay.map((contact) => ({
              label: contact.label,
              number: contact.number,
            }))}
            onBack={() => navigation.goBack()}
            onCallEmergencyServices={() => {
              void logSos({ contactedEmergency: true });
              dialPhoneNumber(localEmergencyNumber);
            }}
            onContactCallPress={(contact) => {
              void logSos({ contactedSupport: true });
              dialPhoneNumber(contact.number);
            }}
            onEmptyPrimaryAction={() => navigation.navigate('Profile')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TouristSiteDetail">
        {({ navigation, route }) => {
          const site = touristSiteSummaryFromId(route.params.siteId);
          return (
            <SiteDetailRoute
              siteKey={route.params.siteId}
              onBack={() => navigation.goBack()}
              onFindGuidePress={() =>
                navigation.navigate('GuideSearch', {
                  siteId: route.params.siteId,
                  siteName: site?.name,
                })
              }
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="VideoLibrary">
        {({ navigation }) => (
          <VideoLibraryScreen
            cityLabel={cityLabel}
            videos={videosDisplay}
            isLoading={videosLoading}
            errorMessage={videosError}
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
            onDeleteTask={(taskId) => {
              const nextRemoved = checklistRemoved.includes(taskId)
                ? checklistRemoved
                : [...checklistRemoved, taskId];
              const nextCompleted = checklistCompleted.filter((id) => id !== taskId);
              setChecklistRemoved(nextRemoved);
              setChecklistCompleted(nextCompleted);
              void completeStep('SEEKER', 'profile', {
                checklistRemoved: nextRemoved,
                checklistCompleted: nextCompleted,
              });
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
            phrases={phrasesDisplay.map((phrase) => ({
              id: phrase.id,
              emoji: phrase.emoji,
              phrase: phrase.phrase,
              translation: phrase.translation,
              hasAudio: phrase.hasAudio,
            }))}
            topics={topicsDisplay.map((topic) => ({
              id: topic.id,
              emoji: topic.emoji,
              title: topic.title,
              description: topic.description,
            }))}
            onBack={() => navigation.goBack()}
            onEmptyPrimaryAction={() => navigation.navigate('AccountSetup')}
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
            tabs={transportDisplay.map((tab) => ({
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
            onEmptyPrimaryAction={() => navigation.navigate('MatchSearch')}
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
            landmarks={landmarksDisplay.map((landmark) => ({
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
          <HostCalendarStackScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            navigation={navigation}
            fallbackActiveBooking={hostCalendarActiveBooking}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostListings">
        {({ navigation }) => (
          <HostListingsStackScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            navigation={navigation}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TourTypesSetup">
        {({ navigation }) => (
          <TourTypesStackScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            navigation={navigation}
            onProfileSaved={(nextTourTypes, nextBaseRate, nextMaxGroupSize) => {
              setTourTypes(nextTourTypes);
              setTourBaseRate(nextBaseRate);
              setTourMaxGroupSize(nextMaxGroupSize);
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideAvailability">
        {({ navigation }) => (
          <GuideAvailabilityStackScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            navigation={navigation}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="IncomingRequests">
        {({ navigation }) => (
          <IncomingRequestsScreen
            requests={hostIncoming}
            title="Homestay requests"
            subtitle={`${hostIncoming.length} students want to stay with you`}
            emptyState={emptyStates.hostRequests}
            onEmptyPrimaryAction={() => navigation.navigate('HostListings')}
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
            emptyState={emptyStates.guideRequests}
            onEmptyPrimaryAction={() => navigation.navigate('TourTypesSetup')}
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
            events={studentEventsDisplay}
            joinedIds={studentEventsApi.joinedIds}
            isLoading={studentEventsLoading}
            error={studentEventsError}
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
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
