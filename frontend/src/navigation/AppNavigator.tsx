import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { pickProfileImage, pickListingImage } from '../services/imagePicker';

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
import { resolvePlaceOtherAnswers } from '../screens/onboarding/quizConstants';
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
import { SPONSORS_MOCK, getSponsorById } from '../data/sponsorsMock';
import { KycPromptRoute, VerificationStatusRoute } from './kycRoutes';
import HostRequestsTabScreen from '../screens/host/HostRequestsTabScreen';
import HostBookingsTabScreen from '../screens/host/HostBookingsTabScreen';
import HostEarningsTabScreen from '../screens/host/HostEarningsTabScreen';
import GuideBookingsTabScreen from '../screens/guide/GuideBookingsTabScreen';
import GuideEarningsTabScreen from '../screens/guide/GuideEarningsTabScreen';
import BrowseHomeScreen from '../screens/shared/BrowseHomeScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';
import HelpDeskScreen from '../screens/shared/HelpDeskScreen';
import { HELP_TOPICS, nestBridgeSupportContacts } from '../data/helpDesk';
import AccountSetupScreen from '../screens/shared/AccountSetupScreen';
import DevTestingScreen from '../screens/shared/DevTestingScreen';
import { AdminHomeRoute } from './staffRoutes';
import { StaffStackScreens } from './staffStackScreens';
import StaffPreviewBanner from '../components/StaffPreviewBanner';
import { useStaffSession } from '../context/StaffSessionContext';
import UnifiedSearchScreen from '../screens/shared/UnifiedSearchScreen';
import ExploreHomeScreen from '../screens/tourist/ExploreHomeScreen';
import LodgingDirectoryScreen from '../screens/tourist/LodgingDirectoryScreen';
import LodgingDetailScreen from '../screens/tourist/LodgingDetailScreen';
import PrepChecklistScreen from '../screens/student/PrepChecklistScreen';
import StudentEventsScreen from '../screens/student/StudentEventsScreen';
import StudentPublicProfileScreen from '../screens/student/StudentPublicProfileScreen';
import NearbyCommunityRoute from './NearbyCommunityRoute';
import CreateEventScreen from '../screens/student/CreateEventScreen';
import { useStudentEvents } from '../hooks/useStudentEvents';
import { studentEventsMock, type StudentEventDraft } from '../data/studentEventsMock';
import LocalTipsScreen from '../screens/student/LocalTipsScreen';
import PracticalLocalTipsScreen from '../screens/student/PracticalLocalTipsScreen';
import TransportGuideScreen from '../screens/student/TransportGuideScreen';
import {
  culturePhraseSections,
  cultureTopicSections,
  hasCompletedCultureTips,
  hasCompletedLanguageBasics,
  summarizeCultureGuideProgress,
} from '../data/cultureLanguageGuide';
import { practicalLocalTipSections } from '../data/practicalLocalTips';
import {
  EMPTY_CULTURE_GUIDE_PROGRESS,
  loadCultureGuideProgress,
  markCulturePhraseCompleted,
  markCulturePhrasePracticed,
  markCultureTopicCompleted,
  type CultureGuideProgress,
} from '../services/cultureGuideProgress';
import { speakPhrase } from '../utils/speakPhrase';
import ExploreStaysScreen from '../screens/tourist/ExploreStaysScreen';
import SitesDirectoryScreen from '../screens/tourist/SitesDirectoryScreen';
import UniversitiesDirectoryScreen from '../screens/student/UniversitiesDirectoryScreen';
import WelfareCheckInScreen from '../screens/shared/WelfareCheckInScreen';
import ReviewPromptScreen from '../screens/shared/ReviewPromptScreen';
import RatingsScreen from '../screens/shared/RatingsScreen';
import PaymentMethodScreen, {
  type PaymentMethodId,
} from '../screens/shared/PaymentMethodScreen';
import { useLodgingPartners, lodgingListingFromId } from '../hooks/useLodgingPartners';
import OfflineMapScreen from '../screens/tourist/OfflineMapScreen';
import HostCalendarScreen from '../screens/host/HostCalendarScreen';
import HostListingsScreen from '../screens/host/HostListingsScreen';
import HostListingEditScreen from '../screens/host/HostListingEditScreen';
import TourTypesSetupScreen from '../screens/guide/TourTypesSetupScreen';
import GuideAvailabilityScreen from '../screens/guide/GuideAvailabilityScreen';
import SOSScreen from '../screens/shared/SOSScreen';
import { NotificationsRoute } from './notificationRoutes';
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
  getStaffAwareHomeRoute,
  getProgressForTrack,
  getProgressPercent,
  getStepsForTrack,
  isIdentityLocked,
  isSeekerComplete,
  MIN_ABOUT_LENGTH,
  MIN_BIO_LENGTH,
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
  handleProfileCulturalItem,
  homeTabSosProps,
} from './mainTabSos';
import {
  nearbyUniversitiesForCity,
  normalizeCity,
  universitiesForCity,
} from '../data/ghanaReference';
import type { DevHomeRoute } from '../utils/devTestingPresets';
import type { AccountProfileState } from '../types/accountProfile';

import { useHomeApiData } from '../hooks/useHomeApiData';
import { useProviderTabData } from '../hooks/useProviderTabData';
import { useConversations } from '../hooks/useConversations';
import {
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
  getNotificationsPreference,
  setNotificationsPreference,
} from '../services/api';
import {
  registerPushTokenIfAvailable,
  unregisterPushTokenLocally,
} from '../services/pushRegistration';
import {
  hostProfileToListing,
  mergeTourTypesFromProfile,
  tourTypesToServiceTypes,
  createTourTypeOption,
  isDuplicateTourTypeLabel,
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
  homeRoleForSession,
  homeRoleFromIntent,
} from '../data/homeNavigation';
import {
  hostFeaturedRequestMock,
  studentRecentActivityMock,
  touristRecentActivityMock,
  hostPerformanceMock,
  guidePerformanceMock,
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
  bindDemoFallbackSession,
  withCatalogFallback,
  withProductCatalogFallback,
  withDemoFallback,
  withDemoFallbackValue,
  presentableLoading,
  presentableError,
  uniqueByContactNumber,
  uniqueByKey,
  normalizeContactNumber,
} from '../utils/demoLiveMerge';
import { shouldUseDemoFallbackForAccount } from '../config/demoMode';
import {
  confirmDemoBooking,
  isApiBookingId,
  createDemoGuideBookingRequest,
  createDemoHostBookingRequest,
  mergeBookingsWithLocalOverrides,
} from '../utils/demoBookingFlow';
import {
  emergencyContactsMock,
  enrichEmergencyContact,
  localEmergencyNumber,
} from '../data/sosMock';
import {
  hostConfirmedStaysMock,
  guideUpcomingToursMock,
  computeEarningsFromBookings,
} from '../data/providerBookingsMock';
import { lodgingListingsForCity, listingFromId } from '../data/lodgingDirectoryMock';
import {
  checklistApiMock,
  landmarksApiMock,
  sitesApiMock,
  transportApiMock,
  videosApiMock,
} from '../data/contentLibraryMock';
import { exploreSectionsForCity } from '../data/touristExploreMock';
import { buildDemoHomeRecommendations } from '../data/recommendations';
import { slimHomeRecommendations } from '../utils/slimHomeRecommendations';
import type { RecommendationItem } from '../types/recommendations';
import type { HomeRecommendations } from '../types/recommendations';
import {
  EMPTY_JOURNEY_MILESTONES,
  type JourneyMilestones,
} from '../types/journeyProgress';
import { buildJourneyProgress } from '../utils/buildJourneyProgress';
import {
  loadJourneyMilestones,
  markJourneyMilestone,
} from '../services/journeyMilestones';
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
import { enrichConversations } from '../utils/enrichConversations';
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
import { DEMO_PASSWORD, DEMO_ACTOR_ACCOUNTS, ALL_DEMO_ACCOUNTS, demoPresetForAccount, type DemoAccount } from '../data/demoAccounts';

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

function handleTouristQuickAction(
  navigation: NativeStackNavigationProp<AppStackParamList>,
  actionId: string,
) {
  if (actionId === 'book-guide') {
    navigation.navigate('GuideSearch', { mode: 'book' });
  }
  if (actionId === 'explore-stays') {
    navigation.navigate('ExploreStays');
  }
  if (actionId === 'offline-map') {
    navigation.navigate('OfflineMap');
  }
  if (actionId === 'sites-directory') {
    navigation.navigate('SitesDirectory');
  }
  if (actionId === 'cultural-tips') {
    navigation.navigate('LocalTips');
  }
  if (actionId === 'practical-tips') {
    navigation.navigate('PracticalTips');
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
      navigation.navigate('GuideSearch', { mode: 'book' });
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
    case 'UniversitiesDirectory':
      navigation.navigate('UniversitiesDirectory');
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
    case 'MatchSearch':
      navigation.navigate('MatchSearch');
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
    case 'HostListingEdit':
    case 'HostListingEditPhotos':
      navigation.navigate('HostListingEdit', { focus: 'photos' });
      return;
    case 'HostListingEditRules':
      navigation.navigate('HostListingEdit', { focus: 'rules' });
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
    case 'IncomingSessionRequests':
      navigation.navigate('IncomingSessionRequests');
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

function isoDatePlusDays(daysAhead: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

function defaultCheckIn(arrivalDate: string): string {
  return arrivalDate || isoDatePlusDays(7);
}

function defaultCheckOut(departureDate: string): string {
  return departureDate || isoDatePlusDays(17);
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

type PaymentCheckoutStackProps = NativeStackScreenProps<AppStackParamList, 'PaymentCheckout'> & {
  bookings: BookingListItem[];
  payLoading: boolean;
  payStatusLabel: string;
  setPayLoading: (value: boolean) => void;
  setPayStatusLabel: (value: string) => void;
  onPaid: (booking: BookingListItem) => void;
};

function PaymentCheckoutStackScreen({
  navigation,
  route,
  bookings,
  payLoading,
  payStatusLabel,
  setPayLoading,
  setPayStatusLabel,
  onPaid,
}: PaymentCheckoutStackProps) {
  const booking = bookings.find((item) => item.id === route.params.bookingId) ?? null;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>('mobile_money');
  const amount =
    booking?.sessionPrice?.total ?? booking?.priceBreakdown.total ?? 0;
  const currency =
    booking?.sessionPrice?.currency ?? booking?.priceBreakdown.currency ?? 'GHS';

  return (
    <PaymentMethodScreen
      hostName={booking?.hostName ?? 'your booking'}
      amountLabel={amount.toLocaleString('en-GH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      currencyLabel={currency}
      selectedMethodId={selectedMethod}
      paying={payLoading}
      statusLabel={payLoading ? payStatusLabel : undefined}
      onSelectMethod={setSelectedMethod}
      onPayPress={() => {
        if (!booking || !selectedMethod || payLoading) {
          return;
        }
        if (!isApiBookingId(booking.id)) {
          Alert.alert(
            'Live Paystack required',
            'This preview row cannot open Mobile Money or bank checkout. Use an accepted live booking from the server.',
          );
          return;
        }
        setPayStatusLabel('Preparing payment...');
        setPayLoading(true);
        void completeBookingPayment(booking.id, {
          channels: [selectedMethod],
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
        })
          .then((payment) => {
            onPaid(booking);
            const message = payment.mockPayment
              ? 'Paystack is not enabled on the server, so this booking was confirmed in demo mode.'
              : 'Your booking is confirmed. Payment was processed securely via Paystack.';
            Alert.alert('Payment Successful', message);
            navigation.navigate('BookingConfirmed', { bookingId: booking.id });
          })
          .catch((error) => {
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
          })
          .finally(() => {
            setPayLoading(false);
            setPayStatusLabel('Preparing payment...');
          });
      }}
      onBack={() => navigation.goBack()}
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
        navigation.navigate('HostListingEdit', { focus: 'photos' });
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
      onEditPress={() => navigation.navigate('HostListingEdit', { focus: 'photos' })}
      onDeletePress={() => {
        Alert.alert(
          'Hide listing',
          'Turn your listing offline from the Online switch, or edit photos and house rules from Edit.',
        );
      }}
      onBack={() => navigation.goBack()}
    />
  );
}

function HostListingEditStackScreen({
  greeting,
  userName,
  userInitials,
  navigation,
  focus = 'photos',
}: ProviderScreenHeaderProps & { focus?: 'photos' | 'rules' }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [houseRules, setHouseRules] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingPhoto, setAddingPhoto] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getMyHostProfile()
      .then((profile) => {
        if (cancelled) {
          return;
        }
        setPhotos(Array.isArray(profile.photos) ? profile.photos.filter(Boolean) : []);
        setHouseRules(profile.houseRules ?? '');
        setLoading(false);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setLoading(false);
        Alert.alert('Could not load listing', getApiErrorMessage(error));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <HostListingEditScreen
      greeting={greeting}
      userName={userName}
      userInitials={userInitials}
      statusIcon="🏠"
      statusLabel="Listing"
      focus={focus}
      photos={photos}
      houseRules={houseRules}
      loading={loading}
      saving={saving}
      addingPhoto={addingPhoto}
      onHouseRulesChange={setHouseRules}
      onAddPhotoPress={() => {
        if (addingPhoto || saving) {
          return;
        }
        setAddingPhoto(true);
        void pickListingImage()
          .then(async (picked) => {
            if (!picked?.uri) {
              return;
            }
            const uploaded = await uploadProfilePhotoIfConfigured(picked.uri);
            const nextUri = uploaded ?? picked.uri;
            if (!uploaded) {
              Alert.alert(
                'Saved on this device',
                'Cloud photo storage is not configured yet, so this photo stays on your phone for now. House rules still sync to your listing.',
              );
            }
            setPhotos((prev) => (prev.includes(nextUri) ? prev : [...prev, nextUri]));
          })
          .catch((error) => {
            Alert.alert('Could not add photo', getApiErrorMessage(error));
          })
          .finally(() => setAddingPhoto(false));
      }}
      onRemovePhotoPress={(photoUri) => {
        setPhotos((prev) => prev.filter((uri) => uri !== photoUri));
      }}
      onSavePress={() => {
        if (saving || loading) {
          return;
        }
        setSaving(true);
        void updateMyHostProfile({
          photos,
          houseRules: houseRules.trim(),
        })
          .then(() => {
            setSaving(false);
            Alert.alert('Listing updated', 'Your photos and house rules are saved.');
            navigation.goBack();
          })
          .catch((error) => {
            setSaving(false);
            Alert.alert('Could not save listing', getApiErrorMessage(error));
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
}: ProviderScreenHeaderProps & {
  fallbackActiveBooking: ActiveBookingDetail | null;
}) {
  const { user } = useAuth();
  const calendarMonth = useMemo(() => getProviderCalendarMonth(), []);
  const [days, setDays] = useState(() =>
    buildEmptyHostMonthDays(calendarMonth.year, calendarMonth.month),
  );
  const [activeBooking, setActiveBooking] = useState<ActiveBookingDetail | null>(
    fallbackActiveBooking,
  );
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
        // Still allow blocking days — save upserts the host profile.
        setDays(buildEmptyHostMonthDays(calendarMonth.year, calendarMonth.month));
        setLoadedFromApi(true);
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
  const displayDays = days;
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
  const [tourTypes, setTourTypes] = useState<TourTypeOption[]>([]);
  const [baseRate, setBaseRate] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getMyGuideProfile()
      .then((profile) => {
        const merged = mergeTourTypesFromProfile(profile.serviceTypes, profile.pricePerSession);
        setTourTypes(merged.tourTypes);
        setBaseRate(merged.baseRate);
        setMaxGroupSize(readMaxGroupSize(profile.availabilitySchedule));
      })
      .catch(() => {
        // Form template only — not personal mock rows.
        setTourTypes(tourTypesMock.map((option) => ({ ...option, enabled: false })));
        setBaseRate('45');
        setMaxGroupSize('8');
      });
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
      onAddTourType={(label, description) => {
        if (!label.trim()) {
          return 'Enter a tour type name.';
        }
        if (isDuplicateTourTypeLabel(tourTypes, label)) {
          return 'That tour type already exists.';
        }
        setTourTypes((prev) => [...prev, createTourTypeOption(label, description)]);
        return null;
      }}
      onUpdateTourType={(tourTypeId, label, description) => {
        if (!label.trim()) {
          return 'Enter a tour type name.';
        }
        if (isDuplicateTourTypeLabel(tourTypes, label, tourTypeId)) {
          return 'That tour type already exists.';
        }
        setTourTypes((prev) =>
          prev.map((tour) =>
            tour.id === tourTypeId
              ? {
                  ...tour,
                  label: label.trim(),
                  description: description.trim() || tour.description,
                }
              : tour,
          ),
        );
        return null;
      }}
      onRemoveTourType={(tourTypeId) => {
        setTourTypes((prev) => prev.filter((tour) => tour.id !== tourTypeId));
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
            setSaving(false);
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
        setDays(buildEmptyGuideMonthDays(calendarMonth.year, calendarMonth.month));
        setLoadedFromApi(true);
        setLoadError(getApiErrorMessage(error));
      });
  }, [calendarMonth.month, calendarMonth.year]);

  useEffect(() => {
    reloadCalendar();
  }, [reloadCalendar, user?.userId]);

  const canEdit = loadedFromApi && !saving;
  const displayDays = days;

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
    about: data.about ?? '',
  };
}

function homeRouteToScreenName(
  route: HomeRoute,
):
  | 'IntentSelect'
  | 'BrowseHome'
  | 'StudentHome'
  | 'ExploreHome'
  | 'HostHome'
  | 'GuideHome'
  | 'AdminHome' {
  switch (route) {
    case 'StudentHome':
      return 'StudentHome';
    case 'ExploreHome':
      return 'ExploreHome';
    case 'HostHome':
      return 'HostHome';
    case 'GuideHome':
      return 'GuideHome';
    case 'AdminHome':
      return 'AdminHome';
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
    setAbout: (v: string) => void;
  },
) {
  const data = state.seekerSetup.data;
  setters.setCity(data.city ?? '');
  setters.setUniversity(data.university ?? '');
  setters.setArrivalDate(data.arrivalDate ?? '');
  setters.setDepartureDate(data.departureDate ?? '');
  setters.setDisplayName(data.displayName ?? fallbackName);
  setters.setBio(data.bio ?? '');
  setters.setAbout(data.about ?? '');
}

const DEFAULT_SESSION_DATE = isoDatePlusDays(7);
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
  const { user, signOut, signIn, refreshSession } = useAuth();
  const demoFallbackEnabled = shouldUseDemoFallbackForAccount(user?.email);

  useEffect(() => {
    bindDemoFallbackSession(user?.email ?? null);
    return () => bindDemoFallbackSession(null);
  }, [user?.email]);

  const {
    isStaff,
    isStaffShell,
    preview,
    isPreviewLocked,
    enterAppPreview,
    exitAppPreview,
  } = useStaffSession();
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
    canAcceptHostBookings: hostSetupComplete,
    canAcceptGuideSessions: guideSetupComplete,
    canEnableHostProvider,
    canEnableGuideProvider,
    providerBlockedReason,
    getNextStep,
    getBookingContext,
    resetAccountProfile,
    applyDevPreset,
  } = useAccountProfile();

  // Marketplace actions require staff KYC. Browse stays open. Staff accounts are exempt.
  const marketplaceUnlocked =
    Boolean(user?.isStaff) || Boolean(user?.identityVerified);
  const canBookHomestayNow = canBookHomestay && marketplaceUnlocked;
  const canBookGuideSessionNow = canBookGuideSession && marketplaceUnlocked;
  // Host/guide accept also needs listing+bio AND staff KYC.
  const canAcceptHostBookings = hostSetupComplete && marketplaceUnlocked;
  const canAcceptGuideSessions = guideSetupComplete && marketplaceUnlocked;

  const [city, setCity] = useState('');
  const [university, setUniversity] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [about, setAbout] = useState('');
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const handleAddProfilePhoto = useCallback(async () => {
    const picked = await pickProfileImage();
    if (picked?.uri) {
      setProfilePhotoUri(picked.uri);
    }
  }, []);

  const saveProfileSetupStep = useCallback(
    async (track: SetupTrack, options?: { skipIdentity?: boolean }) => {
      const progress = getProgressForTrack(profileState, track);
      const locked = Boolean(progress.data.identityLocked) &&
        Boolean(progress.data.bio?.trim()) &&
        Boolean(progress.data.about?.trim());

      if (locked) {
        await completeStep(track, 'profile', {
          displayName: progress.data.displayName,
          bio: progress.data.bio,
          about: progress.data.about,
          identityLocked: true,
        });
        return;
      }

      const profileName = displayName.trim() || user?.displayName?.trim() || '';
      const nextBio = bio.trim();
      const nextAbout = about.trim();

      // Soft skip — mark the step done so they can browse; booking stays gated.
      if (options?.skipIdentity) {
        const stepData: Record<string, string | boolean> = {
          identityLocked: false,
        };
        if (profileName.length >= 2) {
          stepData.displayName = profileName;
        }
        if (nextBio) {
          stepData.bio = nextBio;
        }
        if (nextAbout) {
          stepData.about = nextAbout;
        }
        await completeStep(track, 'profile', stepData);
        return;
      }

      if (profileName.length < 2 || nextBio.length < MIN_BIO_LENGTH || nextAbout.length < MIN_ABOUT_LENGTH) {
        return;
      }

      let profilePhotoUrl: string | undefined;
      try {
        profilePhotoUrl = await uploadProfilePhotoIfConfigured(profilePhotoUri);
      } catch {
        // Photo is optional — never block continue if upload/S3 fails.
        profilePhotoUrl = undefined;
      }
      const stepData: Record<string, string | boolean> = {
        displayName: profileName,
        bio: nextBio,
        about: nextAbout,
        identityLocked: true,
      };
      if (profilePhotoUrl) {
        stepData.profilePhotoUrl = profilePhotoUrl;
      }
      await completeStep(track, 'profile', stepData);
      if (profileName && profileName !== displayName) {
        setDisplayName(profileName);
      }
    },
    [about, bio, completeStep, displayName, profilePhotoUri, profileState, user?.displayName],
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
  const [journeyMilestones, setJourneyMilestones] = useState<JourneyMilestones>(
    EMPTY_JOURNEY_MILESTONES,
  );
  const [cultureGuideProgress, setCultureGuideProgress] =
    useState<CultureGuideProgress>(EMPTY_CULTURE_GUIDE_PROGRESS);
  const [tourTypes, setTourTypes] = useState<TourTypeOption[]>([]);
  const [tourBaseRate, setTourBaseRate] = useState('');
  const [tourMaxGroupSize, setTourMaxGroupSize] = useState('');
  const [hostProfileCache, setHostProfileCache] = useState<Record<string, HostProfileSummary>>(
    () => (shouldUseDemoFallbackForAccount(user?.email) ? buildDemoHostProfileCache() : {}),
  );
  const [guideProfileCache, setGuideProfileCache] = useState<Record<string, GuideProfileSummary>>(
    () => (shouldUseDemoFallbackForAccount(user?.email) ? buildDemoGuideProfileCache() : {}),
  );

  useEffect(() => {
    if (demoFallbackEnabled) {
      setHostProfileCache((prev) =>
        Object.keys(prev).length > 0 ? prev : buildDemoHostProfileCache(),
      );
      setGuideProfileCache((prev) =>
        Object.keys(prev).length > 0 ? prev : buildDemoGuideProfileCache(),
      );
    } else {
      setHostProfileCache({});
      setGuideProfileCache({});
    }
  }, [demoFallbackEnabled, user?.userId]);
  // Conversations load for everyone (Messages tab). Student events only for students.
  const conversationsApi = useConversations(user?.userId, { enabled: !!user });
  const conversationsRaw = useMemo(
    () =>
      withDemoFallback(conversationsApi.conversations, conversationsMock, {
        isLoading: conversationsApi.isLoading,
        error: conversationsApi.error,
      }),
    [conversationsApi.conversations, conversationsApi.isLoading, conversationsApi.error],
  );
  const studentEventsApi = useStudentEvents(user?.userId, {
    enabled: !!user && primaryIntent === 'STUDENT',
  });

  // Personalized home matches need a destination from onboarding — never default
  // every new student to Accra seed hosts with fake “match” framing.
  const seekerDestinationCity =
    profileState.seekerSetup.data.city?.trim() || '';
  const canFetchPersonalizedMatches =
    !!user &&
    !!seekerDestinationCity &&
    (primaryIntent === 'STUDENT' || primaryIntent === 'TOURIST');

  // Provider pending inbox is owned by useProviderTabData — do not also fetch via homeApi.
  const homeApi = useHomeApiData(user?.userId, profileState, {
    fetchMatches: canFetchPersonalizedMatches,
    fetchGuideMatches: canFetchPersonalizedMatches,
    fetchHostIncoming: false,
    fetchGuideIncoming: false,
    fetchBookings: !!user,
  });

  const providerTab = useProviderTabData(user?.userId, {
    fetchHostPending: (primaryIntent === 'HOST' || canAcceptHostBookings) && !!user,
    fetchHostActive: (primaryIntent === 'HOST' || canAcceptHostBookings) && !!user,
    fetchGuidePending: (primaryIntent === 'GUIDE' || canAcceptGuideSessions) && !!user,
    fetchGuideActive: (primaryIntent === 'GUIDE' || canAcceptGuideSessions) && !!user,
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

  // Single source: provider tab pending (avoids duplicate /incoming calls on mount).
  const hostIncoming = hostPendingDisplay;
  const guideIncoming = guidePendingDisplay;

  // Prefer live bookings only. Mock catalog fills the list when empty so Paystack /
  // ratings are not polluted with duplicate preview rows (different ids, same stay).
  const displayBookings = useMemo(() => {
    if (homeApi.bookings.length > 0) {
      return homeApi.bookings;
    }
    return withDemoFallback(homeApi.bookings, studentBookingsMock, {
      isLoading: homeApi.isLoading,
      error: homeApi.error,
    });
  }, [homeApi.bookings, homeApi.isLoading, homeApi.error]);

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
    const demoAccount = ALL_DEMO_ACCOUNTS.find((account) => account.email === user.email);
    if (!demoAccount || demoProfileSyncedForUser.current === user.userId) {
      return;
    }
    if (demoAccount.id === 'staff' || user.isStaff) {
      demoProfileSyncedForUser.current = user.userId;
      return;
    }
    demoProfileSyncedForUser.current = user.userId;
    void (async () => {
      await applyDevPreset(demoPresetForAccount(demoAccount));
      await setPrimaryIntent(demoAccount.intent);
    })();
  }, [user?.userId, user?.email, user?.isStaff, applyDevPreset, setPrimaryIntent]);

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
        profileTargetId?: string;
        verification?: ConversationListItem['verification'];
        rating?: number;
        ratingCount?: number;
      },
    ) => {
      if (!marketplaceUnlocked) {
        navigation.navigate('KYCPrompt', { track: 'SEEKER' });
        return;
      }
      const conv = await createConversation(participant.userId);
      const listItem: ConversationListItem = {
        id: conv.conversationId,
        participantId: participant.userId,
        participantName: participant.name,
        participantInitials: participant.initials,
        participantRole: participant.role,
        profileTargetId: participant.profileTargetId,
        verification: participant.verification,
        rating: participant.rating,
        ratingCount: participant.ratingCount,
        lastMessage: 'Conversation started',
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
        firebasePath: conv.firebasePath,
      };
      conversationsApi.upsertConversation(listItem);
      navigation.navigate('Chat', { conversationId: conv.conversationId });
    },
    [conversationsApi, marketplaceUnlocked],
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
      if (!profile.userId) {
        Alert.alert(
          'Messaging unavailable',
          'This host account is not ready for chat yet. Try again shortly or request a booking first.',
        );
        return;
      }
      await openMessageWithParticipant(navigation, {
        userId: profile.userId,
        name: profile.name,
        initials: profile.initials,
        role: 'host',
        profileTargetId: profile.id,
        verification: profile.verification,
        rating: profile.matchPercentage
          ? Math.round((profile.matchPercentage / 20) * 10) / 10
          : undefined,
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
      if (!profile.userId) {
        Alert.alert(
          'Messaging unavailable',
          'This guide account is not ready for chat yet. Try again shortly or book a session first.',
        );
        return;
      }
      await openMessageWithParticipant(navigation, {
        userId: profile.userId,
        name: profile.name,
        initials: profile.initials,
        role: 'guide',
        profileTargetId: profile.id,
        verification: profile.verification,
        rating: profile.matchPercentage
          ? Math.round((profile.matchPercentage / 20) * 10) / 10
          : undefined,
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

  const conversations = useMemo(() => {
    const profiles = [
      ...Object.values(hostProfileCache).map((host) => ({
        id: host.id,
        userId: host.userId,
        name: host.name,
        verification: host.verification,
        rating: host.matchPercentage ? host.matchPercentage / 20 : undefined,
        role: 'host' as const,
      })),
      ...Object.values(guideProfileCache).map((guide) => ({
        id: guide.id,
        userId: guide.userId,
        name: guide.name,
        verification: guide.verification,
        rating: guide.matchPercentage ? guide.matchPercentage / 20 : undefined,
        role: 'guide' as const,
      })),
      ...guideListForSearch.map((guide) => ({
        id: guide.id,
        userId: guide.userId,
        name: guide.name,
        verification: guide.verification,
        rating: guide.matchPercentage ? guide.matchPercentage / 20 : undefined,
        role: 'guide' as const,
      })),
    ];
    return enrichConversations(conversationsRaw, mergedBookings, profiles);
  }, [
    conversationsRaw,
    mergedBookings,
    hostProfileCache,
    guideProfileCache,
    guideListForSearch,
  ]);

  const profileCulturalItems = useMemo(
    () =>
      culturalGuidanceItemsForRole(
        homeRoleFromIntent(preview?.role ?? primaryIntent),
      ),
    [preview?.role, primaryIntent],
  );

  // Auth registration name wins; profile displayName is a soft fallback only.
  const profileFields = getProfileFields(profileState);
  const resolvedName =
    user?.displayName?.trim() ||
    displayName.trim() ||
    profileFields.displayName.trim() ||
    'Guest';
  const resolvedInitials = getInitials(resolvedName);
  const homeRouteKey = getStaffAwareHomeRoute(
    isStaff,
    preview?.role,
    profileState,
  );
  const cityLabel = (profileFields.city || city || '').trim();

  const universityDirectoryItems = useMemo(() => {
    const capital = normalizeCity(cityLabel);
    const preferred = university?.trim();
    const local = universitiesForCity(capital);
    const names =
      local.length > 0 ? local : nearbyUniversitiesForCity(capital);
    return names.map((name) => ({
      id: `uni-${name}`,
      name,
      city: capital,
      reason:
        preferred && name.toLowerCase().includes(preferred.toLowerCase())
          ? 'Matches your selected university'
          : local.length > 0
            ? `Institution near ${capital}`
            : 'Closest campuses for this destination',
    }));
  }, [cityLabel, university]);

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

  const displayTopMatchHostId = demoFallbackEnabled
    ? homeApi.topMatchTargetId ?? demoTopMatchHostIdForCity(cityLabel)
    : homeApi.topMatchTargetId ?? null;
  const displayTopGuideId = demoFallbackEnabled
    ? homeApi.topGuideTargetId ?? demoTopGuideId
    : homeApi.topGuideTargetId ?? null;

  const hasCity = cityLabel.length > 0;
  const lodgingApi = useLodgingPartners(cityLabel, !!user && hasCity);
  const contentTransport = useTransport(cityLabel, !!user && hasCity);
  const contentSites = useSites(cityLabel, !!user && hasCity);
  const contentChecklist = useChecklist(cityLabel, !!user && hasCity);
  const contentEmergency = useEmergencyContacts(!!user);
  const contentLandmarks = useMapLandmarks(cityLabel, !!user && hasCity);
  const contentVideos = useVideos(
    hasCity ? cityLabel : undefined,
    undefined,
    !!user,
  );

  const emergencyContactsDisplay = useMemo(() => {
    const liveContacts = contentEmergency.data.map((contact) =>
      enrichEmergencyContact(contact),
    );
    // Real Ghana emergency numbers — product safety content, not personal mock data.
    return uniqueByContactNumber(
      withProductCatalogFallback(liveContacts, emergencyContactsMock, {
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
    );
  }, [contentEmergency.data, contentEmergency.isLoading, contentEmergency.error]);

  const lodgingListingsDisplay = useMemo(
    () =>
      withDemoFallback(lodgingApi.listings, lodgingListingsForCity(cityLabel), {
        isLoading: lodgingApi.isLoading,
        error: lodgingApi.error,
      }),
    [lodgingApi.listings, lodgingApi.isLoading, lodgingApi.error, cityLabel],
  );

  const transportDisplay = useMemo(
    () =>
      uniqueByKey(
        withCatalogFallback(contentTransport.data, transportApiMock, {
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
        withCatalogFallback(contentSites.data, sitesApiMock, {
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
        withCatalogFallback(contentChecklist.data, checklistApiMock, {
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
        withCatalogFallback(contentLandmarks.data, landmarksApiMock, {
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
          withCatalogFallback(contentVideos.data, videosApiMock, {
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

  useEffect(() => {
    if (!user?.userId) {
      setJourneyMilestones(EMPTY_JOURNEY_MILESTONES);
      setCultureGuideProgress(EMPTY_CULTURE_GUIDE_PROGRESS);
      return;
    }
    let cancelled = false;
    void loadJourneyMilestones(user.userId).then((milestones) => {
      if (!cancelled) {
        setJourneyMilestones(milestones);
      }
    });
    void loadCultureGuideProgress(user.userId).then((progress) => {
      if (!cancelled) {
        setCultureGuideProgress(progress);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?.userId]);

  const markJourney = useCallback(
    async (key: keyof JourneyMilestones) => {
      if (!user?.userId) {
        return;
      }
      const next = await markJourneyMilestone(user.userId, key);
      setJourneyMilestones(next);
    },
    [user?.userId],
  );

  const cultureGuideSummary = useMemo(
    () =>
      summarizeCultureGuideProgress({
        phraseSections: culturePhraseSections,
        topicSections: cultureTopicSections,
        completedPhraseIds: cultureGuideProgress.completedPhraseIds,
        practicedPhraseIds: cultureGuideProgress.practicedPhraseIds,
        completedTopicIds: cultureGuideProgress.completedTopicIds,
      }),
    [cultureGuideProgress],
  );

  const syncCultureJourneyMilestones = useCallback(
    async (progress: CultureGuideProgress) => {
      const summary = summarizeCultureGuideProgress({
        phraseSections: culturePhraseSections,
        topicSections: cultureTopicSections,
        completedPhraseIds: progress.completedPhraseIds,
        practicedPhraseIds: progress.practicedPhraseIds,
        completedTopicIds: progress.completedTopicIds,
      });
      if (
        hasCompletedCultureTips({
          completedTopicIds: progress.completedTopicIds,
          topicsTotal: summary.topicsTotal,
        })
      ) {
        await markJourney('cultureTipsCompleted');
      }
      if (
        hasCompletedLanguageBasics({
          completedPhraseIds: progress.completedPhraseIds,
          practicedPhraseIds: progress.practicedPhraseIds,
          phrasesTotal: summary.phrasesTotal,
        })
      ) {
        await markJourney('languageBasicsCompleted');
      }
    },
    [markJourney],
  );

  const checkIn = defaultCheckIn(arrivalDate || profileFields.arrivalDate);
  const checkOut = defaultCheckOut(departureDate || profileFields.departureDate);
  const sessionDate = arrivalDate || profileFields.arrivalDate || DEFAULT_SESSION_DATE;
  const setupSummary = getAccountSetupSummary(profileState);
  const showMatchScores = isSeekerComplete(profileState);

  const roleNotificationsMock = useMemo(
    () => notificationsMockForIntent(primaryIntent),
    [primaryIntent],
  );
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notificationsEnabled !== false,
  );
  const [notificationsSaving, setNotificationsSaving] = useState(false);
  const [notificationsPrefError, setNotificationsPrefError] = useState('');
  const [notificationsList, setNotificationsList] = useState<
    ReturnType<typeof notificationsMockForIntent>
  >([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const refreshNotificationState = useCallback(async () => {
    if (!user) {
      return;
    }
    if (notificationsEnabled === false) {
      setUnreadNotifications(0);
      setNotificationsList([]);
      return;
    }
    const allowDemo = shouldUseDemoFallbackForAccount(user.email);
    const fallback = notificationsMockForIntent(primaryIntent);
    try {
      const [count, list] = await Promise.all([
        fetchUnreadNotificationCount(),
        fetchNotifications(),
      ]);
      const display = withDemoFallback(list, fallback, {
        accountEmail: user.email,
      });
      setNotificationsList(display);
      setUnreadNotifications(
        list.length > 0 ? count : display.filter((n) => !n.read).length,
      );
    } catch {
      if (allowDemo) {
        setUnreadNotifications(getUnreadNotificationCount(primaryIntent));
        setNotificationsList(fallback);
      } else {
        setUnreadNotifications(0);
        setNotificationsList([]);
      }
    }
  }, [user, primaryIntent, notificationsEnabled]);

  useEffect(() => {
    setNotificationsEnabled(user?.notificationsEnabled !== false);
  }, [user?.userId, user?.notificationsEnabled]);

  useEffect(() => {
    if (!user) {
      return;
    }
    void getNotificationsPreference()
      .then((enabled) => {
        setNotificationsEnabled(enabled);
      })
      .catch(() => {
        // Keep login payload / default when preference endpoint is unavailable.
      });
  }, [user?.userId]);

  useEffect(() => {
    if (notificationsEnabled === false) {
      setUnreadNotifications(0);
      setNotificationsList([]);
      return;
    }
    if (shouldUseDemoFallbackForAccount(user?.email)) {
      setNotificationsList(roleNotificationsMock);
      setUnreadNotifications(getUnreadNotificationCount(primaryIntent));
    } else {
      setNotificationsList([]);
      setUnreadNotifications(0);
    }
  }, [primaryIntent, roleNotificationsMock, user?.email, notificationsEnabled]);

  useEffect(() => {
    if (!user) {
      setUnreadNotifications(0);
      return;
    }
    // Count/list once per session user — openNotifications refreshes on demand.
    void refreshNotificationState();
  }, [user?.userId, notificationsEnabled, refreshNotificationState]);

  const openNotifications = useCallback(
    (navigation: NativeStackNavigationProp<AppStackParamList>) => {
      setNotificationsLoading(true);
      void refreshNotificationState().finally(() => setNotificationsLoading(false));
      navigation.navigate('Notifications');
    },
    [refreshNotificationState],
  );

  const visibleUnreadNotifications =
    notificationsEnabled === false ? 0 : unreadNotifications;

  const handleNotificationsPreferenceChange = useCallback(
    async (enabled: boolean) => {
      setNotificationsPrefError('');
      setNotificationsSaving(true);
      const previous = notificationsEnabled;
      setNotificationsEnabled(enabled);
      try {
        const saved = await setNotificationsPreference(enabled);
        setNotificationsEnabled(saved);
        if (!saved) {
          setUnreadNotifications(0);
          setNotificationsList([]);
          await unregisterPushTokenLocally();
        } else {
          void registerPushTokenIfAvailable();
          void refreshNotificationState();
        }
      } catch (error) {
        setNotificationsEnabled(previous);
        setNotificationsPrefError(getApiErrorMessage(error));
      } finally {
        setNotificationsSaving(false);
      }
    },
    [notificationsEnabled, refreshNotificationState],
  );

  // Show badge whenever we fetch that inbox (intent or accept-ready), not only when accept is unlocked.
  const incomingBadgeCount =
    ((primaryIntent === 'GUIDE' || canAcceptGuideSessions) && guideIncoming.length > 0
      ? guideIncoming.length
      : 0) +
    ((primaryIntent === 'HOST' || canAcceptHostBookings) && hostIncoming.length > 0
      ? hostIncoming.length
      : 0);
  const homeRole = homeRoleForSession(isStaffShell, preview?.role, primaryIntent);
  const effectiveIntent = preview?.role ?? primaryIntent;
  const demoRecommendations = useMemo(
    () =>
      buildDemoHomeRecommendations(
        homeRole === 'BROWSE' || homeRole === 'STAFF'
          ? 'TOURIST'
          : effectiveIntent ?? 'STUDENT',
        cityLabel,
        { university: university || profileFields.university },
      ),
    [homeRole, effectiveIntent, cityLabel, university, profileFields.university],
  );
  const [liveRecommendations, setLiveRecommendations] =
    useState<HomeRecommendations | null>(null);
  const [videoProgressRefreshKey, setVideoProgressRefreshKey] = useState(0);

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

  const homeRecommendations = liveRecommendations
    ?? (demoFallbackEnabled
      ? demoRecommendations
      : {
          city: cityLabel,
          role: String(effectiveIntent ?? 'STUDENT'),
          headline: '',
          sections: [],
        });
  const dashboardRecommendations = useMemo(
    () => slimHomeRecommendations(homeRecommendations),
    [homeRecommendations],
  );

  const tabBarItems = tabBarWithBadgesForRole(
    homeRole === 'STAFF' ? 'TOURIST' : homeRole,
    unreadNotifications,
    incomingBadgeCount,
  );
  const staffTabBarItems = getTabBarForRole('STAFF');
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
    // Listing ready but staff KYC still pending — send them to verify, not listing edit.
    if (hostSetupComplete && !user?.identityVerified) {
      navigation.navigate('KYCPrompt', { track: 'HOST' });
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
    if (guideSetupComplete && !user?.identityVerified) {
      navigation.navigate('KYCPrompt', { track: 'GUIDE' });
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
      const signedIn = await signIn(account.email, DEMO_PASSWORD, true);
      if (account.id === 'staff' || signedIn.isStaff) {
        return;
      }
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
        setAbout,
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
    setAbout(progress.data.about ?? '');
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

  const hostCalendarActiveBooking = useMemo((): ActiveBookingDetail | null => {
    const active = hostActiveDisplay[0];
    if (!active) {
      return demoFallbackEnabled ? hostActiveBookingMock : null;
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
  }, [hostActiveDisplay, demoFallbackEnabled]);

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

  // Fatal banner only when every requested home section failed (hook sets homeApi.error).
  // Demo-covered empty responses still suppress the global banner.
  const homeDataError = presentableError(
    homeApi.error,
    homeApi.bookings,
    displayBookings,
  );
  const hostsLoadError = presentableError(
    homeApi.sectionErrors.hostMatches,
    homeApi.suggestedHosts,
    suggestedHostsDisplay,
  );
  const guidesLoadError = presentableError(
    homeApi.sectionErrors.guideMatches,
    homeApi.suggestedGuides,
    suggestedGuidesDisplay,
  );
  const activityLoadError = presentableError(
    homeApi.sectionErrors.bookings,
    homeApi.bookings,
    displayBookings,
  );
  const isHomeLoading = presentableLoading(
    homeApi.isLoading,
    homeApi.hostMatches,
    suggestedHostsDisplay,
  );
  // Reminder / status use fatal error only — partial section failures stay inline.
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
  const journeyProgress = useMemo(
    () =>
      buildJourneyProgress({
        profileState,
        bookings: mergedBookings,
        milestones: journeyMilestones,
        destinationLabel: cityLabel,
        preferStayCatalogue:
          homeRole === 'TOURIST' || homeRole === 'BROWSE',
        journeyAudience:
          homeRole === 'TOURIST' || homeRole === 'BROWSE'
            ? 'tourist'
            : 'student',
      }),
    [profileState, mergedBookings, journeyMilestones, cityLabel, homeRole],
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
    () => {
      const nearbyHosts = suggestedHostsDisplay.filter(
        (host) => host.id !== displayTopMatchHostId,
      );
      return {
      greeting: personalizedGreeting,
      userName: firstName,
      userInitials: resolvedInitials,
      statusIcon: '🏠',
      notificationCount: 0,
      activeTabId: 'home',
      tabBarItems,
      featuredMatch:
        withDemoFallbackValue(
          homeApi.featuredMatch,
          studentFeaturedMatchForCity(cityLabel),
          { isLoading: homeApi.isLoading, error: homeApi.error },
        ) ?? undefined,
      suggestedHosts:
        nearbyHosts.length > 0
          ? nearbyHosts
          : suggestedHostsDisplay.slice(0, 2),
      recommendedSections: [],
      recommendationSections: dashboardRecommendations.sections,
      recommendationHeadline: dashboardRecommendations.headline,
      recommendationCity: cityLabel,
      suggestedHostsTitle: 'Homestays nearby',
      journeyProgress,
      showMatchScores,
      isHomeLoading,
      homeDataError,
      hostsLoadError,
      activityLoadError,
      statusLabel: studentLive.statusLabel,
      reminder: studentLive.reminder,
      recentActivity: studentLive.recentActivity,
      showSetupBanner: seekerSetupIncomplete && primaryIntent === 'STUDENT',
    };
    },
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
      hostsLoadError,
      activityLoadError,
      studentLive.statusLabel,
      studentLive.reminder,
      studentLive.recentActivity,
      seekerSetupIncomplete,
      primaryIntent,
      cityLabel,
      dashboardRecommendations,
      journeyProgress,
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
    () => {
      const nearbyGuides = suggestedGuidesDisplay.filter(
        (guide) => guide.id !== displayTopGuideId,
      );
      return {
      greeting: personalizedGreeting,
      userName: firstName,
      userInitials: resolvedInitials,
      cityLabel,
      statusIcon: '🌍',
      statusLabel: touristLive.statusLabel,
      featuredGuide:
        withDemoFallbackValue(
          homeApi.featuredGuide,
          touristFeaturedGuideMock,
          { isLoading: homeApi.isLoading, error: homeApi.error },
        ) ?? undefined,
      quickActions: getQuickActionsForRole('BROWSE'),
      recentActivity: touristLive.recentActivity,
      reminder: touristLive.reminder,
      homeDataError,
      guidesLoadError,
      activityLoadError,
      tabBarItems,
      activeTabId: 'home',
      showSetupBanner: false,
      suggestedGuides:
        nearbyGuides.length > 0
          ? nearbyGuides
          : suggestedGuidesDisplay.slice(0, 2),
      suggestedGuidesTitle: 'Guides nearby',
      showMatchScores,
      recommendationSections: dashboardRecommendations.sections,
      recommendationHeadline: dashboardRecommendations.headline,
      journeyProgress,
    };
    },
    [firstName, resolvedInitials, cityLabel, tabBarItems, personalizedGreeting, touristLive, homeApi.featuredGuide, suggestedGuidesDisplay, displayTopGuideId, showMatchScores, dashboardRecommendations, journeyProgress, homeDataError, guidesLoadError, activityLoadError],
  );

  const exploreHomeProps = useMemo(
    () => {
      const nearbyGuides = suggestedGuidesDisplay.filter(
        (guide) => guide.id !== displayTopGuideId,
      );
      return {
      greeting: getPersonalizedGreeting(firstName),
      userName: firstName,
      userInitials: resolvedInitials,
      cityLabel,
      statusIcon: '🌍',
      statusLabel: touristLive.statusLabel,
      featuredGuide:
        withDemoFallbackValue(
          homeApi.featuredGuide,
          touristFeaturedGuideMock,
          { isLoading: homeApi.isLoading, error: homeApi.error },
        ) ?? undefined,
      suggestedGuides:
        nearbyGuides.length > 0
          ? nearbyGuides
          : suggestedGuidesDisplay.slice(0, 2),
      suggestedGuidesTitle: 'Guides nearby',
      showMatchScores,
      recommendationSections: dashboardRecommendations.sections,
      recommendationHeadline: dashboardRecommendations.headline,
      journeyProgress,
      quickActions: getQuickActionsForRole('TOURIST'),
      recentActivity: touristLive.recentActivity,
      reminder: touristLive.reminder,
      homeDataError,
      guidesLoadError,
      activityLoadError,
      tabBarItems,
      activeTabId: 'home',
      showSetupBanner: seekerSetupIncomplete && primaryIntent === 'TOURIST',
    };
    },
    [
      firstName,
      resolvedInitials,
      cityLabel,
      tabBarItems,
      homeApi.featuredGuide,
      suggestedGuidesDisplay,
      displayTopGuideId,
      showMatchScores,
      seekerSetupIncomplete,
      primaryIntent,
      dashboardRecommendations,
      journeyProgress,
      touristLive,
      homeDataError,
      guidesLoadError,
      activityLoadError,
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

  const initialRoute =
    isStaff && !preview
      ? 'AdminHome'
      : primaryIntent
        ? homeRouteToScreenName(homeRouteKey)
        : 'IntentSelect';

  const guardPreviewMutation = useCallback(() => {
    if (!isPreviewLocked) return false;
    Alert.alert(
      'Preview is read-only',
      'Exit app preview to make booking or account changes. This action was blocked.',
    );
    return true;
  }, [isPreviewLocked]);

  const makeBookingContext = (
    bookingType: 'HOST' | 'GUIDE',
    override?: BookingContext,
  ): BookingContext => override ?? getBookingContext(bookingType);

  const submitHostBookingRequest = useCallback(
    async (host: HostProfileSummary) => {
      if (guardPreviewMutation()) return;
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
      } catch (error) {
        if (shouldUseDemoFallbackForAccount(user?.email)) {
          upsertLocalBooking(
            createDemoHostBookingRequest(host, checkIn, checkOut, bookingContext),
          );
          return;
        }
        Alert.alert('Could not create booking', getApiErrorMessage(error));
      }
    },
    [
      checkIn,
      checkOut,
      getBookingContext,
      guardPreviewMutation,
      homeApi,
      upsertLocalBooking,
      user?.email,
    ],
  );

  const submitGuideBookingRequest = useCallback(
    async (guide: GuideProfileSummary) => {
      if (guardPreviewMutation()) return;
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
      } catch (error) {
        if (shouldUseDemoFallbackForAccount(user?.email)) {
          upsertLocalBooking(
            createDemoGuideBookingRequest(
              guide,
              sessionDate,
              DEFAULT_SESSION_TIME,
              bookingContext,
            ),
          );
          return;
        }
        Alert.alert('Could not create booking', getApiErrorMessage(error));
      }
    },
    [
      sessionDate,
      getBookingContext,
      guardPreviewMutation,
      homeApi,
      upsertLocalBooking,
      user?.email,
    ],
  );

  const confirmBookingWithDemoFallback = useCallback(
    async (bookingId: string): Promise<BookingListItem | null> => {
      const booking = mergedBookings.find((item) => item.id === bookingId) ?? null;

      // Mock/demo rows (e.g. booking-1) are not UUIDs — cannot open live Paystack.
      if (booking && !isApiBookingId(bookingId)) {
        throw new Error(
          'This is a preview booking. Pay a live accepted booking to open Mobile Money, card, or bank checkout on Paystack.',
        );
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
    <View style={{ flex: 1 }}>
      {preview ? (
        <StaffPreviewBanner
          roleLabel={
            preview.role === 'STUDENT'
              ? 'Student'
              : preview.role === 'TOURIST'
                ? 'Tourist'
                : preview.role === 'HOST'
                  ? 'Host'
                  : 'Guide'
          }
          onExit={() => {
            void exitAppPreview();
          }}
        />
      ) : null}
    <Stack.Navigator
      key={preview ? `preview-${preview.role}` : isStaff ? 'staff-ops' : 'app'}
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="IntentSelect">
        {({ navigation }) =>
          isStaffShell ? (
            <AdminHomeRoute
              staffName={resolvedName}
              tabBarItems={staffTabBarItems}
              onTabPress={(tabId) => routeTabPress(navigation, tabId, 'AdminHome')}
              onOpenUsers={() => navigation.navigate('StaffUserSearch')}
              onOpenUsersByCategory={(category) =>
                navigation.navigate('StaffUserSearch', { category })
              }
              onOpenPendingKyc={() => navigation.navigate('StaffPendingKyc')}
              onOpenModeration={() => navigation.navigate('AdminModeration')}
              onOpenPreview={() => navigation.navigate('AdminPreview')}
              onOpenProfile={() => navigation.navigate('Profile')}
              notificationCount={visibleUnreadNotifications}
              onNotificationPress={() => openNotifications(navigation)}
              onSosPress={() => navigation.navigate('SOS')}
            />
          ) : (
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
          )
        }
      </Stack.Screen>

      <Stack.Screen name="BrowseHome">
        {({ navigation }) => (
          <BrowseHomeScreen
            {...browseHomeProps}
            guidesEmptyState={emptyStates.discoveryGuides(cityLabel)}
            {...homeTabSosProps(navigation)}
            notificationCount={visibleUnreadNotifications}
            onNotificationPress={() => openNotifications(navigation)}
            onFeaturedGuidePress={() => {
              if (!displayTopGuideId) return;
              navigation.navigate('GuideProfile', { guideId: displayTopGuideId });
            }}
            onSuggestedGuidePress={(guideId) =>
              navigation.navigate('GuideProfile', { guideId })
            }
            onGuidesEmptyPrimaryAction={() =>
              navigation.navigate('GuideSearch', { mode: 'nearby' })
            }
            onRetryGuides={() => homeApi.retrySection('guideMatches')}
            onRetryActivity={() => homeApi.retrySection('bookings')}
            onRetryHome={() => homeApi.refresh()}
            onRecommendationItemPress={(item) =>
              handleRecommendationItemPress(navigation, item)
            }
            onRecommendationsEmptyPress={() =>
              navigation.navigate('GuideSearch', { mode: 'nearby' })
            }
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
            tabBarItems={
              primaryIntent === 'HOST'
                ? hostTabBarItems
                : primaryIntent === 'GUIDE'
                  ? guideTabBarItems
                  : tabBarItems
            }
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
              if (primaryIntent === 'TOURIST' || homeRole === 'BROWSE') {
                navigation.navigate('GuideSearch', { mode: 'book' });
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
                onParticipantPress={() => {
                  const targetId =
                    conversation.profileTargetId ?? conversation.participantId;
                  if (conversation.participantRole === 'host') {
                    navigation.navigate('HostProfile', { hostId: targetId });
                    return;
                  }
                  if (conversation.participantRole === 'guide') {
                    navigation.navigate('GuideProfile', { guideId: targetId });
                  }
                }}
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
            onBookingPress={(bookingId) => {
              const pending = hostIncoming.find((r) => r.id === bookingId);
              if (pending) {
                navigation.navigate('MatchRequestReview', { requestId: bookingId });
                return;
              }
              navigation.reset({ index: 0, routes: [{ name: 'MessagesTab' }] });
            }}
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
            activeTabId="home"
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
            onBookingPress={(bookingId) => {
              const pending = guideIncoming.find((r) => r.id === bookingId);
              if (pending) {
                navigation.navigate('SessionReview', { requestId: bookingId });
                return;
              }
              // Confirmed tours are not SessionReview requests — open inbox to coordinate.
              navigation.reset({ index: 0, routes: [{ name: 'MessagesTab' }] });
            }}
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
          <NotificationsRoute
            navigation={navigation}
            userName={firstName}
            userInitials={resolvedInitials}
            notifications={notificationsList}
            isLoading={notificationsLoading}
            primaryIntent={primaryIntent}
            isStaff={isStaff}
            hostIncomingIds={hostIncoming.map((r) => r.id)}
            guideIncomingIds={guideIncoming.map((r) => r.id)}
            refreshNotificationState={refreshNotificationState}
            refreshSession={refreshSession}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Profile">
        {({ navigation }) => {
          const profileTabItems = isStaffShell
            ? staffTabBarItems
            : homeRole === 'HOST'
              ? hostTabBarItems
              : homeRole === 'GUIDE'
                ? guideTabBarItems
                : tabBarItems;
          return (
          <ProfileScreen
            userName={resolvedName}
            userInitials={resolvedInitials}
            email={user?.email ?? ''}
            setupSummary={isStaff ? 'Staff ops access' : setupSummary}
            showTravelBooking={!isStaff && shouldShowTravelBookingEntry(homeRole)}
            showAccountSetup={!isStaff}
            showStaffTools={isStaffShell}
            showReturnToOps={isStaffShell}
            showAppPreview={isStaffShell}
            showExitPreview={Boolean(preview)}
            tabBarItems={profileTabItems}
            activeTabId=""
            onTabPress={(tabId) =>
              routeTabPress(
                navigation,
                tabId,
                isStaffShell
                  ? 'AdminHome'
                  : homeRole === 'HOST'
                    ? 'HostHome'
                    : homeRole === 'GUIDE'
                      ? 'GuideHome'
                      : homeRouteKey,
              )
            }
            onBack={
              navigation.canGoBack()
                ? () => navigation.goBack()
                : undefined
            }
            onAccountSetupPress={() => {
              if (isStaff) return;
              navigation.navigate('AccountSetup');
            }}
            onTravelBookingPress={() => navigation.navigate('UnifiedSearch')}
            onSettingsPress={() => navigation.navigate('Settings')}
            onHelpPress={() => navigation.navigate('HelpDesk')}
            onRatingsPress={() => navigation.navigate('Ratings')}
            onVerificationStatusPress={
              isStaff ? undefined : () => navigation.navigate('VerificationStatus')
            }
            onStaffToolsPress={() => navigation.navigate('StaffUserSearch')}
            onReturnToOpsPress={() => navigateToHome(navigation, 'AdminHome')}
            onAppPreviewPress={() => navigation.navigate('AdminPreview')}
            onExitPreviewPress={() => {
              void (async () => {
                await exitAppPreview();
                navigateToHome(navigation, 'AdminHome');
              })();
            }}
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
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="Settings">
        {({ navigation }) => (
          <SettingsScreen
            notificationsEnabled={notificationsEnabled}
            notificationsSaving={notificationsSaving}
            notificationsError={notificationsPrefError || undefined}
            onNotificationsChange={(enabled) => {
              void handleNotificationsPreferenceChange(enabled);
            }}
            onHelpPress={() => navigation.navigate('HelpDesk')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HelpDesk">
        {({ navigation }) => (
          <HelpDeskScreen
            topics={HELP_TOPICS}
            supportContacts={nestBridgeSupportContacts()}
            onBack={() => navigation.goBack()}
            onOpenSos={() => navigation.navigate('SOS')}
            onCallSupport={(contact) => {
              dialPhoneNumber(contact.number);
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
          // Everyone can travel — hosts/guides included (hotels, hostels, guides).
          const showStayShortcut =
            homeRole === 'STUDENT' || isTouristBrowse || isProvider;
          return (
            <ExploreHubScreen
              title="Explore"
              subtitle={
                isTouristBrowse
                  ? 'Book guided trips, find stays, and explore culture in Ghana'
                  : homeRole === 'STUDENT'
                    ? 'Find a host family, guides, and support for life in Ghana'
                    : homeRole === 'HOST'
                      ? 'Manage your listing, and book stays or guides when you travel'
                      : homeRole === 'GUIDE'
                        ? 'Shape your tours, and book stays or guides when you travel'
                        : 'Tools for your NestBridge role in Ghana'
              }
              primaryActionLabel={primaryLabel}
              primaryActionHint={
                homeRole === 'STUDENT'
                  ? 'Match with verified host families near campus in Ghana'
                  : isTouristBrowse
                    ? 'Book local guides for tours, orientation, and cultural experiences'
                    : homeRole === 'HOST'
                      ? 'Search lodging and guides for your own trips'
                      : homeRole === 'GUIDE'
                        ? 'Search lodging and peer guides when you travel'
                        : 'Homestays, local guides, hotels, and lodging across Ghana'
              }
              travelBookingLabel={
                showStayShortcut
                  ? homeRole === 'STUDENT'
                    ? 'Browse homestays'
                    : 'Find stays & lodging'
                  : undefined
              }
              travelBookingHint={
                showStayShortcut
                  ? 'Homestays, hotels, and hostels across Ghana'
                  : undefined
              }
              hubSectionTitle={
                isProvider
                  ? 'Tools for your listing'
                  : homeRole === 'STUDENT'
                    ? 'Guides for living in Ghana'
                    : 'Explore Ghana'
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
                  navigation.navigate('GuideSearch', { mode: 'book' });
                  return;
                }
                navigation.navigate('UnifiedSearch');
              }}
              onTravelBookingPress={
                showStayShortcut
                  ? () => {
                      // Lodging catalogue for every role that can travel.
                      navigation.navigate('ExploreStays');
                    }
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

      <StaffStackScreens
        staffName={resolvedName}
        staffTabBarItems={staffTabBarItems}
        isStaffShell={isStaffShell}
        notificationCount={visibleUnreadNotifications}
        onTabPress={routeTabPress}
        openNotifications={openNotifications}
        enterAppPreview={enterAppPreview}
      />

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
        {({ navigation }) =>
          isStaff ? (
            <RouteErrorState
              title="Not available for staff"
              message="Staff accounts use the ops dashboard. Consumer account setup is only for students, tourists, hosts, and guides."
              onBack={() => navigateToHome(navigation, 'AdminHome')}
            />
          ) : (
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
          )
        }
      </Stack.Screen>

      <Stack.Screen name="UnifiedSearch">
        {({ navigation }) => {
          const isHost = homeRole === 'HOST';
          const isGuide = homeRole === 'GUIDE';
          return (
          <UnifiedSearchScreen
            userName={firstName}
            userInitials={resolvedInitials}
            cityLabel={cityLabel}
            categories={SEARCH_CATEGORIES}
            tabBarItems={
              isHost
                ? hostTabBarItems
                : isGuide
                  ? guideTabBarItems
                  : tabBarItems
            }
            activeTabId={isHost || isGuide ? 'home' : 'explore'}
            onBack={() => navigation.goBack()}
            onCategoryPress={(categoryId) => {
              if (categoryId === 'homestays') {
                // Use active home role, not primaryIntent — dual-track accounts
                // (e.g. host who started as student) must still open the catalogue.
                if (homeRole === 'STUDENT') {
                  navigateToMatchSearch(navigation);
                  return;
                }
                navigation.navigate('ExploreStays');
              }
              if (categoryId === 'guides') {
                navigation.navigate('GuideSearch', { mode: 'book' });
              }
              if (categoryId === 'lodging') {
                navigation.navigate('LodgingDirectory');
              }
            }}
            onTabPress={(tabId) =>
              routeTabPress(
                navigation,
                tabId,
                isHost ? 'HostHome' : isGuide ? 'GuideHome' : homeRouteKey,
              )
            }
          />
          );
        }}
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
              void completeStep('SEEKER', 'quiz', {
                quizAnswers: resolvePlaceOtherAnswers(answers),
              });
              navigation.navigate('ProfileSetup', { track: 'SEEKER' });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HostQuiz">
        {({ navigation }) => (
          <HostQuizScreen
            onFinish={(answers) => {
              const resolved = resolvePlaceOtherAnswers(answers);
              const hostCity =
                typeof resolved.city === 'string' ? resolved.city.trim() : '';
              void completeStep('HOST', 'quiz', {
                quizAnswers: resolved,
                ...(hostCity ? { city: hostCity } : {}),
              });
              if (hostCity) {
                setCity(hostCity);
              }
              navigation.navigate('ProfileSetup', { track: 'HOST' });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TouristQuiz">
        {({ navigation }) => (
          <TouristQuizScreen
            onFinish={(answers) => {
              const resolved = resolvePlaceOtherAnswers(answers);
              const visitCity =
                typeof resolved.destination === 'string'
                  ? resolved.destination.trim()
                  : '';
              void completeStep('SEEKER', 'quiz', {
                quizAnswers: resolved,
                ...(visitCity ? { city: visitCity } : {}),
              });
              if (visitCity) {
                setCity(visitCity);
              }
              navigation.navigate('ProfileSetup', { track: 'SEEKER' });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GuideQuiz">
        {({ navigation }) => (
          <GuideQuizScreen
            onFinish={(answers) => {
              const resolved = resolvePlaceOtherAnswers(answers);
              const areas = Array.isArray(resolved.operatingAreas)
                ? resolved.operatingAreas.filter(
                    (item): item is string => typeof item === 'string',
                  )
                : [];
              const primaryArea = areas[0]?.trim() ?? '';
              void completeStep('GUIDE', 'quiz', {
                quizAnswers: resolved,
                ...(primaryArea ? { city: primaryArea } : {}),
              });
              if (primaryArea) {
                setCity(primaryArea);
              }
              navigation.navigate('ProfileSetup', { track: 'GUIDE' });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProfileSetup">
        {({ navigation, route }) => {
          const track = route.params.track;
          const progress = getProgressForTrack(profileState, track);
          const locked = isIdentityLocked(progress);
          return (
            <ProfileSetupScreen
              currentStep={3}
              totalSteps={ONBOARDING_TOTAL_STEPS}
              {...profileSetupMock}
              displayName={displayName}
              bio={bio}
              about={about}
              initials={resolvedInitials}
              photoUri={profilePhotoUri}
              identityLocked={locked}
              onAddPhoto={handleAddProfilePhoto}
              onDisplayNameChange={setDisplayName}
              onBioChange={setBio}
              onAboutChange={setAbout}
              onContinue={() => {
                void (async () => {
                  await saveProfileSetupStep(track);
                  // Everyone hits KYC (verify now or later). Marketplace stays locked until staff approves.
                  navigation.navigate('KYCPrompt', { track });
                })();
              }}
              onSkipForNow={() => {
                void (async () => {
                  await saveProfileSetupStep(track, { skipIdentity: true });
                  navigation.navigate('KYCPrompt', { track });
                })();
              }}
              onBack={() => navigation.goBack()}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="KYCPrompt">
        {({ navigation, route }) => {
          const { track, afterVerify = 'OnboardingReady' } = route.params;
          return (
            <KycPromptRoute
              track={track}
              onFinished={() => {
                if (afterVerify === 'VerificationStatus') {
                  navigation.navigate('VerificationStatus');
                  return;
                }
                navigation.navigate('OnboardingReady', { track });
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="VerificationStatus">
        {({ navigation }) => {
          const track =
            homeRole === 'HOST' ? 'HOST' : homeRole === 'GUIDE' ? 'GUIDE' : 'SEEKER';
          return (
            <VerificationStatusRoute
              onBack={() => navigation.goBack()}
              onVerifyNow={() =>
                navigation.navigate('KYCPrompt', {
                  track,
                  afterVerify: 'VerificationStatus',
                })
              }
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
            notificationCount={visibleUnreadNotifications}
            onNotificationPress={() => openNotifications(navigation)}
            {...homeTabSosProps(navigation)}
            onSetupPress={() => continueSeekerSetup(navigation)}
            onFeaturedMatchPress={() => {
              if (!displayTopMatchHostId) return;
              navigation.navigate('HostProfile', {
                hostId: displayTopMatchHostId,
              });
            }}
            onSuggestedHostPress={(hostId) =>
              navigation.navigate('HostProfile', { hostId })
            }
            onHostsEmptyPrimaryAction={() => navigation.navigate('ExploreStays')}
            onRetryHosts={() => homeApi.retrySection('hostMatches')}
            onRetryActivity={() => homeApi.retrySection('bookings')}
            onRetryHome={() => homeApi.refresh()}
            onRecommendationItemPress={(item) =>
              handleRecommendationItemPress(navigation, item)
            }
            onRecommendationsEmptyPress={() => navigation.navigate('ExploreStays')}
            onTabPress={(tabId) => routeTabPress(navigation, tabId, 'StudentHome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ExploreHome">
        {({ navigation }) => (
          <ExploreHomeScreen
            {...exploreHomeProps}
            guidesEmptyState={emptyStates.discoveryGuides(cityLabel)}
            notificationCount={visibleUnreadNotifications}
            onNotificationPress={() => openNotifications(navigation)}
            {...homeTabSosProps(navigation)}
            onSetupPress={() => continueSeekerSetup(navigation)}
            onFeaturedGuidePress={() => {
              if (!displayTopGuideId) return;
              navigation.navigate('GuideProfile', { guideId: displayTopGuideId });
            }}
            onSuggestedGuidePress={(guideId) =>
              navigation.navigate('GuideProfile', { guideId })
            }
            onGuidesEmptyPrimaryAction={() =>
              navigation.navigate('GuideSearch', { mode: 'nearby' })
            }
            onRetryGuides={() => homeApi.retrySection('guideMatches')}
            onRetryActivity={() => homeApi.retrySection('bookings')}
            onRetryHome={() => homeApi.refresh()}
            onRecommendationItemPress={(item) =>
              handleRecommendationItemPress(navigation, item)
            }
            onRecommendationsEmptyPress={() =>
              navigation.navigate('GuideSearch', { mode: 'nearby' })
            }
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
            : undefined;

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
              performanceStats={
                demoFallbackEnabled ? hostPerformanceMock : []
              }
              recommendationSections={dashboardRecommendations.sections}
              recommendationHeadline={dashboardRecommendations.headline}
              recommendationCity={cityLabel}
              requests={hostIncoming}
              emptyState={emptyStates.hostRequests}
              onEmptyPrimaryAction={() => navigation.navigate('HostListings')}
              recentActivity={hostLive.recentActivity}
              reminder={hostLive.reminder}
              tabBarItems={hostTabBarItems}
              activeTabId="home"
              notificationCount={visibleUnreadNotifications}
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
            : 'Pending request';
          const featuredCard = firstRequest
            ? {
                sectionLabel: 'Upcoming tour',
                name: `${firstRequest.studentName} — Guide session`,
                badge: sessionLabel,
                details: firstRequest.session
                  ? `${firstRequest.session.durationHours}h session`
                  : 'Guide session request',
                ctaLabel: 'View details →',
                initials: firstRequest.studentInitials,
              }
            : undefined;

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
              performanceStats={
                demoFallbackEnabled ? guidePerformanceMock : []
              }
              performanceTitle="Your tour performance"
              recommendationSections={dashboardRecommendations.sections}
              recommendationHeadline={dashboardRecommendations.headline}
              recommendationCity={cityLabel}
              requests={guideIncoming}
              emptyState={emptyStates.guideRequests}
              onEmptyPrimaryAction={() => navigation.navigate('TourTypesSetup')}
              recentActivity={guideLive.recentActivity}
              reminder={guideLive.reminder}
              tabBarItems={guideTabBarItems}
              activeTabId="home"
              notificationCount={visibleUnreadNotifications}
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
                return;
              }
              // Pending / accepted / other statuses — open the provider profile.
              if (booking.bookingType === 'GUIDE') {
                navigation.navigate('GuideProfile', { guideId: booking.hostId });
                return;
              }
              navigation.navigate('HostProfile', { hostId: booking.hostId });
            }}
            payBlocked={!marketplaceUnlocked}
            payBlockedMessage={bookingGateCopy.pay}
            onContinueSetupPay={() =>
              navigation.navigate('KYCPrompt', { track: 'SEEKER' })
            }
            payLoading={payLoading}
            payStatusLabel={payStatusLabel}
            onPayPress={(bookingId) => {
              if (payLoading) {
                return;
              }
              if (!isApiBookingId(bookingId)) {
                Alert.alert(
                  'Live booking required',
                  'This preview stay cannot open Paystack. Open an accepted booking from the server (or request a stay and have the host accept it), then pay from Bookings.',
                );
                return;
              }
              navigation.navigate('PaymentCheckout', { bookingId });
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

      <Stack.Screen name="PaymentCheckout">
        {(props) => (
          <PaymentCheckoutStackScreen
            {...props}
            bookings={mergedBookings}
            payLoading={payLoading}
            payStatusLabel={payStatusLabel}
            setPayLoading={setPayLoading}
            setPayStatusLabel={setPayStatusLabel}
            onPaid={(booking) => {
              homeApi.refresh();
              upsertLocalBooking(confirmDemoBooking({ ...booking, status: 'CONFIRMED' }));
            }}
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
            canBookHomestay={canBookHomestayNow}
            onContinueSetup={() => {
              if (!marketplaceUnlocked) {
                navigation.navigate('KYCPrompt', { track: 'SEEKER' });
                return;
              }
              continueSeekerSetup(navigation);
            }}
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
            canBookHomestay={canBookHomestayNow}
            requestBlockedMessage={
              marketplaceUnlocked ? bookingGateCopy.homestay : bookingGateCopy.kyc
            }
            onContinueSetup={() => {
              if (!marketplaceUnlocked) {
                navigation.navigate('KYCPrompt', { track: 'SEEKER' });
                return;
              }
              continueSeekerSetup(navigation);
            }}
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
          const mode = route.params?.mode ?? 'book';
          const site = siteId ? touristSiteSummaryFromId(siteId) : null;
          const attractionGuides = siteId
            ? guidesForAttraction(
                guideListForSearch,
                siteId,
                site?.city ?? cityLabel,
                site?.guideKeywords ?? [],
              )
            : guideListForSearch;
          const isNearby = mode === 'nearby';

          return (
            <GuideSearchScreen
              title={
                siteName
                  ? `Guides for ${siteName}`
                  : isNearby
                    ? 'Guides nearby'
                    : 'Book a trip'
              }
              subtitle={
                siteName
                  ? `Local guides who know ${siteName}`
                  : isNearby
                    ? `Verified guides near ${cityLabel}`
                    : 'Tours, orientation, and cultural experiences'
              }
              cityLabel={site?.city ?? cityLabel}
              guides={attractionGuides}
              showMatchScores={showMatchScores}
              onBack={() => navigation.goBack()}
              onGuidePress={(guideId) =>
                navigation.navigate('GuideProfile', { guideId })
              }
              onEmptyPrimaryAction={() => {
                // Label is "Browse stays instead" — never Sites & culture.
                if (homeRole === 'STUDENT') {
                  navigation.navigate('MatchSearch');
                  return;
                }
                navigation.navigate('ExploreStays');
              }}
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
            canBookGuideSession={canBookGuideSessionNow}
            onContinueSetup={() => {
              if (!marketplaceUnlocked) {
                navigation.navigate('KYCPrompt', { track: 'SEEKER' });
                return;
              }
              continueSeekerSetup(navigation);
            }}
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
            canBookGuideSession={canBookGuideSessionNow}
            requestBlockedMessage={
              marketplaceUnlocked ? bookingGateCopy.guide : bookingGateCopy.kyc
            }
            onContinueSetup={() => {
              if (!marketplaceUnlocked) {
                navigation.navigate('KYCPrompt', { track: 'SEEKER' });
                return;
              }
              continueSeekerSetup(navigation);
            }}
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
            (demoFallbackEnabled
              ? listingFromId(route.params.listingId)
              : null);
          if (!listing) {
            return (
              <RouteErrorState
                title="Listing not found"
                message={`No lodging partner is available near ${cityLabel} for this link.`}
                onBack={() => navigation.goBack()}
              />
            );
          }
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
            onEmptyPrimaryAction={() =>
              navigation.navigate('GuideSearch', { mode: 'nearby' })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="UniversitiesDirectory">
        {({ navigation }) => (
          <UniversitiesDirectoryScreen
            cityLabel={cityLabel}
            universities={universityDirectoryItems}
            onBack={() => navigation.goBack()}
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

      <Stack.Screen name="Ratings">
        {({ navigation }) => {
          const pendingReviews = bookings.filter((booking) => {
            if (
              booking.status !== 'CONFIRMED' &&
              booking.status !== 'CHECKED_IN'
            ) {
              return false;
            }
            // Never ask a seeker to rate themselves (bad providerName fallback).
            const host = booking.hostName.trim().toLowerCase();
            const self = resolvedName.trim().toLowerCase();
            if (host && self && host === self) {
              return false;
            }
            if (host === 'host' || host === 'provider') {
              return false;
            }
            const endIso = booking.checkOut || booking.session?.sessionDate;
            if (!endIso) {
              return true;
            }
            const end = new Date(endIso);
            if (Number.isNaN(end.getTime())) {
              return true;
            }
            return end.getTime() <= Date.now();
          });
          return (
            <RatingsScreen
              userName={resolvedName}
              userInitials={resolvedInitials}
              pendingReviews={pendingReviews}
              onRatePress={(booking) =>
                navigation.navigate('ReviewPrompt', {
                  bookingId: booking.id,
                  hostName: booking.hostName,
                })
              }
              onBack={() => navigation.goBack()}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="SOS">
        {({ navigation }) => (
          <SOSScreen
            emergencyContacts={emergencyContactsDisplay}
            onBack={() => navigation.goBack()}
            onCallEmergencyServices={() => {
              void logSos({ contactedEmergency: true });
              void markJourney('emergencyContactsSaved');
              dialPhoneNumber(localEmergencyNumber);
            }}
            onContactCallPress={(contact) => {
              void logSos({ contactedSupport: true });
              void markJourney('emergencyContactsSaved');
              dialPhoneNumber(contact.number);
            }}
            onEmptyPrimaryAction={() => navigation.navigate('Profile')}
            onJourneyVisit={() => {
              void markJourney('emergencyContactsSaved');
            }}
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
            userId={user?.userId}
            viewerIntent={effectiveIntent ?? (homeRole === 'STAFF' ? null : homeRole)}
            isLoading={videosLoading}
            errorMessage={videosError}
            progressRefreshKey={videoProgressRefreshKey}
            onBack={() => navigation.goBack()}
            onVideoPress={(videoKey) =>
              navigation.navigate('VideoDetail', { videoKey })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="VideoDetail">
        {({ navigation, route }) => (
          <VideoDetailRoute
            videoKey={route.params.videoKey}
            userId={user?.userId}
            onBack={() => navigation.goBack()}
            onProgressChanged={() =>
              setVideoProgressRefreshKey((value) => value + 1)
            }
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
        {({ navigation, route }) => (
          <LocalTipsScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon={studentHomeMockData.statusIcon}
            statusLabel={studentLive.statusLabel}
            focus={route.params?.focus}
            phraseSections={culturePhraseSections}
            topicSections={cultureTopicSections}
            completedPhraseIds={cultureGuideProgress.completedPhraseIds}
            practicedPhraseIds={cultureGuideProgress.practicedPhraseIds}
            completedTopicIds={cultureGuideProgress.completedTopicIds}
            progressPercent={cultureGuideSummary.percent}
            progressLabel={`${cultureGuideSummary.phrasesCompleted}/${cultureGuideSummary.phrasesTotal} phrases · ${cultureGuideSummary.topicsCompleted}/${cultureGuideSummary.topicsTotal} culture notes · ${cultureGuideSummary.pronunciationPracticed} practiced`}
            onPhrasePress={(phraseId) => {
              if (!user?.userId) {
                return;
              }
              void markCulturePhraseCompleted(user.userId, phraseId).then(
                (next) => {
                  setCultureGuideProgress(next);
                  void syncCultureJourneyMilestones(next);
                },
              );
            }}
            onPhrasePracticePress={(phraseId) => {
              const match = culturePhraseSections
                .flatMap((section) => section.phrases)
                .find((item) => item.id === phraseId);
              void speakPhrase(match?.phrase ?? '');
              if (!user?.userId) {
                return;
              }
              void markCulturePhrasePracticed(user.userId, phraseId).then(
                (next) => {
                  setCultureGuideProgress(next);
                  void syncCultureJourneyMilestones(next);
                },
              );
            }}
            onTopicPress={(topicId) => {
              if (!user?.userId) {
                return;
              }
              void markCultureTopicCompleted(user.userId, topicId).then(
                (next) => {
                  setCultureGuideProgress(next);
                  void syncCultureJourneyMilestones(next);
                },
              );
            }}
            onBack={() => navigation.goBack()}
            onEmptyPrimaryAction={() => navigation.navigate('Profile')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="PracticalTips">
        {({ navigation }) => (
          <PracticalLocalTipsScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon="📍"
            statusLabel={studentLive.statusLabel}
            sections={practicalLocalTipSections}
            onBack={() => navigation.goBack()}
            onEmptyPrimaryAction={() => navigation.navigate('Profile')}
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
        {({ navigation }) => {
          const regionCity = cityLabel.split(',')[0]?.trim() || cityLabel;
          return (
          <OfflineMapScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            statusIcon="📍"
            statusLabel={touristLive.statusLabel}
            regionLabel={`${regionCity} area`}
            downloadSize="Offline landmarks from NestBridge"
            landmarks={landmarksDisplay.map((landmark) => ({
              id: landmark.id,
              name: landmark.name,
              topPercent: landmark.topPercent,
              leftPercent: landmark.leftPercent,
            }))}
            onLandmarkPress={(landmarkId) => {
              const landmark = landmarksDisplay.find((item) => item.id === landmarkId);
              const site = sitesDisplay.find(
                (item) =>
                  item.name === landmark?.name ||
                  item.siteKey === landmarkId ||
                  item.id === landmarkId,
              );
              if (site) {
                navigation.navigate('TouristSiteDetail', {
                  siteId: site.siteKey || site.id,
                });
                return;
              }
              Alert.alert(
                landmark?.name ?? 'Landmark',
                'Browse the sites directory for full details and guide options.',
                [
                  {
                    text: 'Browse sites',
                    onPress: () => navigation.navigate('SitesDirectory'),
                  },
                  { text: 'OK', style: 'cancel' },
                ],
              );
            }}
            onLocatePress={() => {
              Alert.alert(
                'Offline map',
                'This map shows curated landmarks for offline use. Live GPS centering is not available here.',
              );
            }}
            onBack={() => navigation.goBack()}
          />
          );
        }}
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

      <Stack.Screen name="HostListingEdit">
        {({ navigation, route }) => (
          <HostListingEditStackScreen
            greeting={personalizedGreeting}
            userName={firstName}
            userInitials={resolvedInitials}
            navigation={navigation}
            focus={route.params?.focus ?? 'photos'}
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
              acceptBlockedMessage={bookingGateCopy.acceptHost}
              onContinueSetup={() => continueHostSetup(navigation)}
              onBack={() => navigation.goBack()}
              onAccept={() => {
                void (async () => {
                  try {
                    await acceptBooking(request.id);
                    homeApi.refresh();
                    providerTab.refresh();
                    navigation.navigate('IncomingRequests');
                  } catch (error) {
                    Alert.alert('Could not accept request', getApiErrorMessage(error));
                  }
                })();
              }}
              onDecline={() => {
                void (async () => {
                  try {
                    await declineBooking(request.id);
                    homeApi.refresh();
                    providerTab.refresh();
                    navigation.navigate('IncomingRequests');
                  } catch (error) {
                    Alert.alert('Could not decline request', getApiErrorMessage(error));
                  }
                })();
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
              acceptBlockedMessage={bookingGateCopy.acceptGuide}
              onContinueSetup={() => continueGuideSetup(navigation)}
              onBack={() => navigation.goBack()}
              onAccept={() => {
                void (async () => {
                  try {
                    await acceptBooking(request.id);
                    homeApi.refresh();
                    providerTab.refresh();
                    navigation.navigate('IncomingSessionRequests');
                  } catch (error) {
                    Alert.alert('Could not accept session', getApiErrorMessage(error));
                  }
                })();
              }}
              onDecline={() => {
                void (async () => {
                  try {
                    await declineBooking(request.id);
                    homeApi.refresh();
                    providerTab.refresh();
                    navigation.navigate('IncomingSessionRequests');
                  } catch (error) {
                    Alert.alert('Could not decline session', getApiErrorMessage(error));
                  }
                })();
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

      <Stack.Screen name="NearbyCommunity">
        {(props) => (
          <NearbyCommunityRoute {...props} fallbackCityLabel={cityLabel} />
        )}
      </Stack.Screen>

      <Stack.Screen name="StudentPublicProfile">
        {({ navigation, route }) => {
          const member = route.params.member;
          return (
            <StudentPublicProfileScreen
              student={member}
              messageBlocked={!marketplaceUnlocked}
              messageBlockedHint="NestBridge staff must verify your identity before messaging."
              onBack={() => navigation.goBack()}
              onMessagePress={() => {
                void openMessageWithParticipant(navigation, {
                  userId: member.userId,
                  name: member.fullName,
                  initials: member.initials,
                  role: 'guest',
                }).catch((err) => {
                  Alert.alert('Could not open chat', getApiErrorMessage(err));
                });
              }}
            />
          );
        }}
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
            sponsors={demoFallbackEnabled ? SPONSORS_MOCK : []}
            onBack={() => navigation.goBack()}
            onSponsorPress={(sponsorId) =>
              navigation.navigate('SponsorDetail', { sponsorId })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SponsorDetail">
        {({ navigation, route }) => {
          const sponsor = demoFallbackEnabled
            ? getSponsorById(route.params.sponsorId)
            : undefined;
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
          const sponsor = demoFallbackEnabled
            ? getSponsorById(route.params.sponsorId)
            : undefined;
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
    </View>
  );
}
