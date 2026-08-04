import type { SetupTrack } from '../types/accountProfile';

export type AuthStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  VerifyEmail: { email: string };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type AppStackParamList = {
  IntentSelect: undefined;
  BrowseHome: undefined;
  StudentHome: undefined;
  ExploreHome: undefined;
  HostHome: undefined;
  GuideHome: undefined;
  AdminHome: undefined;
  AdminModeration: undefined;
  AdminPreview: undefined;
  Profile: undefined;
  Settings: undefined;
  ExploreHub: undefined;
  DevTesting: undefined;
  StaffUserSearch: undefined;
  StaffUserDetail: { userId: string };
  StaffUserActivity: { userId: string; userName: string };
  AccountSetup: undefined;
  UnifiedSearch: undefined;
  Destination: { track: 'SEEKER' };
  StudentQuiz: { track: 'SEEKER' };
  HostQuiz: { track: 'HOST' };
  TouristQuiz: { track: 'SEEKER' };
  GuideQuiz: { track: 'GUIDE' };
  ProfileSetup: { track: SetupTrack };
  KYCPrompt: { track: 'SEEKER' | 'HOST' | 'GUIDE' };
  OnboardingReady: { track: SetupTrack };
  StudentBookings: undefined;
  MatchSearch: undefined;
  HostRequestsTab: undefined;
  HostBookingsTab: undefined;
  HostEarningsTab: undefined;
  GuideBookingsTab: undefined;
  GuideEarningsTab: undefined;
  MessagesTab: undefined;
  Chat: { conversationId: string };
  HostProfile: { hostId: string };
  Booking: { hostId: string; bookingContext?: import('../types/booking').BookingContext };
  BookingConfirmed: { bookingId: string };
  GuideSearch:
    | {
        siteId?: string;
        siteName?: string;
        /** nearby = Guides Nearby; book = Book a Trip */
        mode?: 'nearby' | 'book';
      }
    | undefined;
  GuideProfile: { guideId: string };
  SessionBooking: { guideId: string; bookingContext?: import('../types/booking').BookingContext };
  LodgingDirectory: undefined;
  LodgingDetail: { listingId: string };
  IncomingRequests: undefined;
  IncomingSessionRequests: undefined;
  MatchRequestReview: { requestId: string };
  SessionReview: { requestId: string };
  SOS: undefined;
  TouristSiteDetail: { siteId: string };
  PrepChecklist: undefined;
  LocalTips: { focus?: 'culture' | 'language' } | undefined;
  PracticalTips: undefined;
  TransportGuide: undefined;
  ExploreStays: undefined;
  OfflineMap: undefined;
  HostCalendar: undefined;
  HostListings: undefined;
  HostListingEdit: { focus?: 'photos' | 'rules' } | undefined;
  TourTypesSetup: undefined;
  GuideAvailability: undefined;
  SitesDirectory: undefined;
  UniversitiesDirectory: undefined;
  StudentEvents: undefined;
  CreateEvent: undefined;
  VideoLibrary: undefined;
  VideoDetail: { videoKey: string };
  SponsorList: undefined;
  SponsorDetail: { sponsorId: string };
  SponsorApplication: { sponsorId: string };
  HelpDesk: undefined;
  WelfareCheckIn: { bookingId: string };
  ReviewPrompt: { bookingId: string; hostName: string };
  Ratings: undefined;
  PaymentCheckout: { bookingId: string };
  Notifications: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};
