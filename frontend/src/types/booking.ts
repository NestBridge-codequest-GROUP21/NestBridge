import type { ProviderVerification } from './verification';

export type BookingStatus =
  | 'PENDING_HOST'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'CHECKED_IN';

export type BookingType = 'HOST' | 'GUIDE';

export type SeekerRole = 'STUDENT' | 'TOURIST';

/** Context tag for a booking request — derived at request time, not from profile switching. */
export type BookingContext = 'STUDENT' | 'TOURIST' | 'TRAVEL';

export type BookingTabFilter = 'active' | 'pending' | 'past';

export interface SessionDetails {
  sessionDate: string;
  sessionStartTime: string;
  durationHours: number;
}

export interface SessionPriceBreakdown {
  sessionRate: number;
  currency: string;
  platformFee: number;
  total: number;
}

export interface PriceBreakdown {
  nightlyRate: number;
  currency: string;
  nights: number;
  subtotal: number;
  platformFee: number;
  total: number;
}

export interface BookingListItem {
  id: string;
  bookingType: BookingType;
  hostId: string;
  hostName: string;
  hostInitials: string;
  hostLocation: string;
  hostIcon?: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  priceBreakdown: PriceBreakdown;
  sessionPrice?: SessionPriceBreakdown;
  session?: SessionDetails;
  seekerRole?: SeekerRole;
  bookingContext?: BookingContext;
  cancellationPolicy: string;
  createdAt: string;
}

/** Formal stay request submitted by a student (alias for list/detail views). */
export type BookingRequest = BookingListItem;

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  relatedBookingId?: string;
}

export interface HostProfileSummary {
  id: string;
  userId?: string;
  matchId?: string;
  name: string;
  initials: string;
  location: string;
  matchPercentage: number;
  pricePerNight: number;
  currency: string;
  cancellationPolicy: string;
  icon?: string;
  /** Trust flags from API — omit or all-false for unverified hosts. */
  verification?: ProviderVerification;
}

export interface GuideProfileSummary {
  id: string;
  userId?: string;
  matchId?: string;
  name: string;
  initials: string;
  location: string;
  matchPercentage: number;
  pricePerSession: number;
  sessionDurationHours: number;
  currency: string;
  serviceTypes: string[];
  languages: string[];
  cancellationPolicy: string;
  icon?: string;
  /** Trust flags from API — omit or all-false for unverified guides. */
  verification?: ProviderVerification;
}

export interface HostCapacityInfo {
  overlappingAccepted: number;
  maxAllowed: number;
  periodLabel: string;
  canAccept: boolean;
  declineReason?: string;
}

export interface IncomingBookingRequest {
  id: string;
  bookingType: BookingType;
  seekerRole: SeekerRole;
  studentId: string;
  studentName: string;
  studentInitials: string;
  studentOrigin: string;
  studentUniversity: string;
  compatibilityScore: number;
  checkIn: string;
  checkOut: string;
  session?: SessionDetails;
  sessionPrice?: SessionPriceBreakdown;
  message?: string;
  priceBreakdown: PriceBreakdown;
  cancellationPolicy: string;
  capacity: HostCapacityInfo;
}

export interface BookingScreenPrefill {
  checkIn: string;
  checkOut: string;
  host: HostProfileSummary;
}
