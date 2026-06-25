import type {
  BookingListItem,
  GuideProfileSummary,
  IncomingBookingRequest,
  SessionPriceBreakdown,
} from '../types/booking';
import { FLEXIBLE_POLICY } from './bookingMock';

export { FLEXIBLE_POLICY };

export const suggestedGuidesMock: GuideProfileSummary[] = [
  {
    id: 'guide-1',
    name: 'Kofi Asante',
    initials: 'KA',
    location: 'Accra — Osu & Labadi',
    matchPercentage: 95,
    pricePerSession: 120,
    sessionDurationHours: 3,
    currency: 'GHS',
    serviceTypes: ['City tour', 'Food tour'],
    languages: ['English', 'Twi'],
    cancellationPolicy: FLEXIBLE_POLICY,
    icon: '🗺️',
  },
  {
    id: 'guide-2',
    name: 'Ama Serwaa',
    initials: 'AS',
    location: 'Kumasi — Cultural sites',
    matchPercentage: 92,
    pricePerSession: 95,
    sessionDurationHours: 4,
    currency: 'GHS',
    serviceTypes: ['Cultural orientation', 'University walk'],
    languages: ['English', 'French'],
    cancellationPolicy: FLEXIBLE_POLICY,
    icon: '🏛️',
  },
  {
    id: 'guide-3',
    name: 'Yaw Mensah',
    initials: 'YM',
    location: 'Accra — Airport & East Legon',
    matchPercentage: 89,
    pricePerSession: 150,
    sessionDurationHours: 2.5,
    currency: 'GHS',
    serviceTypes: ['Airport pickup', 'Language exchange'],
    languages: ['English', 'Hausa'],
    cancellationPolicy: FLEXIBLE_POLICY,
    icon: '✈️',
  },
];

export const incomingSessionRequestsMock: IncomingBookingRequest[] = [
  {
    id: 'sess-req-1',
    bookingType: 'GUIDE',
    seekerRole: 'STUDENT',
    studentId: 'student-1',
    studentName: 'Akosua Darko',
    studentInitials: 'AD',
    studentOrigin: 'Lagos, Nigeria',
    studentUniversity: 'University of Ghana',
    compatibilityScore: 94,
    checkIn: '2026-09-05',
    checkOut: '2026-09-05',
    session: {
      sessionDate: '2026-09-05',
      sessionStartTime: '10:00',
      durationHours: 3,
    },
    message: 'Would love a food tour of Osu before classes start.',
    priceBreakdown: {
      nightlyRate: 0,
      currency: 'GHS',
      nights: 0,
      subtotal: 0,
      platformFee: 0,
      total: 0,
    },
    sessionPrice: {
      sessionRate: 120,
      currency: 'GHS',
      platformFee: 6,
      total: 126,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    capacity: {
      overlappingAccepted: 1,
      maxAllowed: 2,
      periodLabel: '10:00 – 13:00, Sep 5',
      canAccept: true,
    },
  },
  {
    id: 'sess-req-2',
    bookingType: 'GUIDE',
    seekerRole: 'TOURIST',
    studentId: 'tourist-1',
    studentName: 'Sarah Chen',
    studentInitials: 'SC',
    studentOrigin: 'Singapore',
    studentUniversity: 'Visiting traveler',
    compatibilityScore: 90,
    checkIn: '2026-07-12',
    checkOut: '2026-07-12',
    session: {
      sessionDate: '2026-07-12',
      sessionStartTime: '14:00',
      durationHours: 3,
    },
    message: 'Interested in a half-day city tour with photo stops.',
    priceBreakdown: {
      nightlyRate: 0,
      currency: 'GHS',
      nights: 0,
      subtotal: 0,
      platformFee: 0,
      total: 0,
    },
    sessionPrice: {
      sessionRate: 120,
      currency: 'GHS',
      platformFee: 6,
      total: 126,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    capacity: {
      overlappingAccepted: 2,
      maxAllowed: 2,
      periodLabel: '14:00 – 17:00, Jul 12',
      canAccept: false,
      declineReason: 'You already have 2 sessions at this time.',
    },
  },
  {
    id: 'sess-req-3',
    bookingType: 'GUIDE',
    seekerRole: 'TOURIST',
    studentId: 'tourist-2',
    studentName: 'Marco Rossi',
    studentInitials: 'MR',
    studentOrigin: 'Italy',
    studentUniversity: 'Visiting traveler',
    compatibilityScore: 87,
    checkIn: '2026-07-20',
    checkOut: '2026-07-20',
    session: {
      sessionDate: '2026-07-20',
      sessionStartTime: '09:00',
      durationHours: 4,
    },
    message: 'Looking for a cultural orientation walk in Kumasi.',
    priceBreakdown: {
      nightlyRate: 0,
      currency: 'GHS',
      nights: 0,
      subtotal: 0,
      platformFee: 0,
      total: 0,
    },
    sessionPrice: {
      sessionRate: 120,
      currency: 'GHS',
      platformFee: 6,
      total: 126,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    capacity: {
      overlappingAccepted: 0,
      maxAllowed: 2,
      periodLabel: '09:00 – 13:00, Jul 20',
      canAccept: true,
    },
  },
];

export const touristBookingsMock: BookingListItem[] = [
  {
    id: 't-booking-1',
    bookingType: 'GUIDE',
    seekerRole: 'TOURIST',
    hostId: 'guide-2',
    hostName: 'Ama Serwaa',
    hostInitials: 'AS',
    hostLocation: 'Kumasi — Cultural sites',
    hostIcon: '🏛️',
    checkIn: '2026-07-18',
    checkOut: '2026-07-18',
    status: 'ACCEPTED',
    session: {
      sessionDate: '2026-07-18',
      sessionStartTime: '09:00',
      durationHours: 4,
    },
    priceBreakdown: {
      nightlyRate: 0,
      currency: 'GHS',
      nights: 0,
      subtotal: 0,
      platformFee: 0,
      total: 0,
    },
    sessionPrice: {
      sessionRate: 95,
      currency: 'GHS',
      platformFee: 5,
      total: 100,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    createdAt: '2026-06-18',
  },
  {
    id: 't-booking-2',
    bookingType: 'HOST',
    seekerRole: 'TOURIST',
    hostId: 'host-1',
    hostName: 'Abena Mensah',
    hostInitials: 'AM',
    hostLocation: 'East Legon, Accra',
    hostIcon: '🏡',
    checkIn: '2026-07-10',
    checkOut: '2026-07-17',
    status: 'PENDING_HOST',
    priceBreakdown: {
      nightlyRate: 180,
      currency: 'GHS',
      nights: 7,
      subtotal: 1260,
      platformFee: 63,
      total: 1323,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    createdAt: '2026-06-19',
  },
];

export function guideSummaryFromId(guideId: string): GuideProfileSummary {
  return (
    suggestedGuidesMock.find((g) => g.id === guideId) ?? suggestedGuidesMock[0]
  );
}

export function computeSessionPrice(
  sessionRate: number,
  currency: string,
): SessionPriceBreakdown {
  const platformFee = Math.round(sessionRate * 0.05);
  return {
    sessionRate,
    currency,
    platformFee,
    total: sessionRate + platformFee,
  };
}

export function formatSessionTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = Number(hours);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
}

export function formatSessionSchedule(
  sessionDate: string,
  startTime: string,
  durationHours: number,
): string {
  const date = formatBookingDate(sessionDate);
  return `${date} · ${formatSessionTime(startTime)} (${durationHours}h)`;
}

function formatBookingDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
