import type { SetupTrack } from '../types/accountProfile';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};

export type AppStackParamList = {
  IntentSelect: undefined;
  BrowseHome: undefined;
  StudentHome: undefined;
  ExploreHome: undefined;
  HostHome: undefined;
  GuideHome: undefined;
  Profile: undefined;
  AccountSetup: undefined;
  UnifiedSearch: undefined;
  Destination: { track: 'SEEKER' };
  StudentQuiz: { track: 'SEEKER' };
  HostQuiz: { track: 'HOST' };
  TouristQuiz: { track: 'SEEKER' };
  GuideQuiz: { track: 'GUIDE' };
  ProfileSetup: { track: SetupTrack };
  OnboardingReady: { track: SetupTrack };
  StudentBookings: undefined;
  MatchSearch: undefined;
  HostProfile: { hostId: string };
  Booking: { hostId: string; bookingContext?: import('../types/booking').BookingContext };
  BookingConfirmed: { bookingId: string };
  GuideSearch: undefined;
  GuideProfile: { guideId: string };
  SessionBooking: { guideId: string; bookingContext?: import('../types/booking').BookingContext };
  LodgingDirectory: undefined;
  LodgingDetail: { listingId: string };
  IncomingRequests: undefined;
  IncomingSessionRequests: undefined;
  MatchRequestReview: { requestId: string };
  SessionReview: { requestId: string };
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};
