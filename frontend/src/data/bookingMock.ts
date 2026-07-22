import type {
  BookingListItem,
  HostProfileSummary,
  IncomingBookingRequest,
  PriceBreakdown,
  AppNotification,
} from '../types/booking';
import { hostVerification } from '../types/verification';

const FLEXIBLE_POLICY =
  'Free cancellation up to 7 days before check-in. 50% refund within 7 days.';

export { FLEXIBLE_POLICY };

export const hostProfileMock: HostProfileSummary = {
  id: 'host-1',
  name: 'Abena Mensah',
  initials: 'AM',
  location: 'East Legon, Accra',
  matchPercentage: 96,
  pricePerNight: 180,
  currency: 'GHS',
  cancellationPolicy: FLEXIBLE_POLICY,
  icon: '🏡',
  verification: hostVerification(),
};

export const studentBookingsMock: BookingListItem[] = [
  {
    id: 'booking-1',
    bookingType: 'HOST',
    seekerRole: 'STUDENT',
    hostId: 'host-1',
    hostName: 'Abena Mensah',
    hostInitials: 'AM',
    hostLocation: 'East Legon, Accra',
    hostIcon: '🏡',
    checkIn: '2026-09-01',
    checkOut: '2026-12-15',
    status: 'CONFIRMED',
    priceBreakdown: {
      nightlyRate: 180,
      currency: 'GHS',
      nights: 105,
      subtotal: 18900,
      platformFee: 945,
      total: 19845,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    createdAt: '2026-06-20',
  },
  {
    id: 'booking-2',
    bookingType: 'HOST',
    seekerRole: 'STUDENT',
    hostId: 'host-2',
    hostName: 'Kwame & Grace Asante',
    hostInitials: 'KG',
    hostLocation: 'Cantonments, Accra',
    hostIcon: '🏡',
    checkIn: '2026-09-01',
    checkOut: '2026-11-30',
    status: 'PENDING_HOST',
    priceBreakdown: {
      nightlyRate: 220,
      currency: 'GHS',
      nights: 90,
      subtotal: 19800,
      platformFee: 990,
      total: 20790,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    createdAt: '2026-06-22',
  },
  {
    id: 'booking-3',
    bookingType: 'HOST',
    seekerRole: 'STUDENT',
    hostId: 'host-3',
    hostName: 'Efua Boateng',
    hostInitials: 'EB',
    hostLocation: 'Osu, Accra',
    hostIcon: '🏡',
    checkIn: '2025-09-01',
    checkOut: '2025-12-01',
    status: 'CONFIRMED',
    priceBreakdown: {
      nightlyRate: 165,
      currency: 'GHS',
      nights: 91,
      subtotal: 15015,
      platformFee: 751,
      total: 15766,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    createdAt: '2025-07-10',
  },
  {
    id: 'booking-4',
    bookingType: 'GUIDE',
    seekerRole: 'STUDENT',
    hostId: 'guide-1',
    hostName: 'Kofi Asante',
    hostInitials: 'KA',
    hostLocation: 'Accra — Osu & Labadi',
    hostIcon: '🗺️',
    checkIn: '2026-09-05',
    checkOut: '2026-09-05',
    status: 'PENDING_HOST',
    session: {
      sessionDate: '2026-09-05',
      sessionStartTime: '10:00',
      durationHours: 3,
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
      sessionRate: 120,
      currency: 'GHS',
      platformFee: 6,
      total: 126,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    createdAt: '2026-06-23',
  },
  {
    id: 'booking-5',
    bookingType: 'HOST',
    seekerRole: 'STUDENT',
    hostId: 'host-4',
    hostName: 'Yaa Nkrumah',
    hostInitials: 'YN',
    hostLocation: 'Adenta, Accra',
    hostIcon: '🏡',
    checkIn: '2026-09-01',
    checkOut: '2026-12-15',
    status: 'DECLINED',
    priceBreakdown: {
      nightlyRate: 150,
      currency: 'GHS',
      nights: 105,
      subtotal: 15750,
      platformFee: 788,
      total: 16538,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    createdAt: '2026-06-15',
  },
  {
    id: 'booking-6',
    bookingType: 'GUIDE',
    seekerRole: 'STUDENT',
    hostId: 'guide-2',
    hostName: 'Ama Owusu',
    hostInitials: 'AO',
    hostLocation: 'Accra — Jamestown & Makola',
    hostIcon: '🗺️',
    checkIn: '2026-07-04',
    checkOut: '2026-07-04',
    status: 'EXPIRED',
    session: {
      sessionDate: '2026-07-04',
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
      sessionRate: 160,
      currency: 'GHS',
      platformFee: 8,
      total: 168,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    createdAt: '2026-06-25',
  },
];

export const incomingBookingRequestsMock: IncomingBookingRequest[] = [
  {
    id: 'req-1',
    bookingType: 'HOST',
    seekerRole: 'STUDENT',
    studentId: 'student-1',
    studentName: 'Akosua Darko',
    studentInitials: 'AD',
    studentOrigin: 'Lagos, Nigeria',
    studentUniversity: 'University of Ghana',
    compatibilityScore: 94,
    checkIn: '2026-09-01',
    checkOut: '2026-12-15',
    message:
      'Hi! We discussed the weekly meal plan and quiet study hours. I would love to stay with your family.',
    priceBreakdown: {
      nightlyRate: 180,
      currency: 'GHS',
      nights: 105,
      subtotal: 18900,
      platformFee: 945,
      total: 19845,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    capacity: {
      overlappingAccepted: 1,
      maxAllowed: 2,
      periodLabel: 'Sep 1 – Dec 15, 2026',
      canAccept: true,
    },
  },
  {
    id: 'req-2',
    bookingType: 'HOST',
    seekerRole: 'STUDENT',
    studentId: 'student-2',
    studentName: 'James Osei',
    studentInitials: 'JO',
    studentOrigin: 'Kumasi, Ghana',
    studentUniversity: 'Ashesi University',
    compatibilityScore: 88,
    checkIn: '2026-09-10',
    checkOut: '2026-11-20',
    message: 'Looking for a warm family environment close to campus.',
    priceBreakdown: {
      nightlyRate: 180,
      currency: 'GHS',
      nights: 71,
      subtotal: 12780,
      platformFee: 639,
      total: 13419,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    capacity: {
      overlappingAccepted: 2,
      maxAllowed: 2,
      periodLabel: 'Sep 1 – Dec 15, 2026',
      canAccept: false,
      declineReason: 'You already have 2 guests for these dates.',
    },
  },
  {
    id: 'req-3',
    bookingType: 'HOST',
    seekerRole: 'STUDENT',
    studentId: 'student-3',
    studentName: 'Priya Sharma',
    studentInitials: 'PS',
    studentOrigin: 'Mumbai, India',
    studentUniversity: 'University of Ghana',
    compatibilityScore: 91,
    checkIn: '2027-01-15',
    checkOut: '2027-04-30',
    message: 'Vegetarian meals discussed — excited to learn about Ghanaian culture.',
    priceBreakdown: {
      nightlyRate: 180,
      currency: 'GHS',
      nights: 105,
      subtotal: 18900,
      platformFee: 945,
      total: 19845,
    },
    cancellationPolicy: FLEXIBLE_POLICY,
    capacity: {
      overlappingAccepted: 0,
      maxAllowed: 2,
      periodLabel: 'Jan 15 – Apr 30, 2027',
      canAccept: true,
    },
  },
  {
    id: 'req-guide-1',
    bookingType: 'GUIDE',
    seekerRole: 'STUDENT',
    studentId: 'student-1',
    studentName: 'Akosua Darko',
    studentInitials: 'AD',
    studentOrigin: 'Lagos, Nigeria',
    studentUniversity: 'University of Ghana',
    compatibilityScore: 93,
    checkIn: '2026-09-05',
    checkOut: '2026-09-05',
    session: {
      sessionDate: '2026-09-05',
      sessionStartTime: '10:00',
      durationHours: 3,
    },
    message: 'City orientation walk around Osu and Labadi.',
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
      maxAllowed: 4,
      periodLabel: 'Sep 5, 2026',
      canAccept: true,
    },
  },
];

export const studentNotificationsMock: AppNotification[] = [
  {
    id: 'notif-student-1',
    title: 'Host accepted your request',
    body: 'Abena Mensah accepted your stay. Complete payment within 48 hours.',
    read: false,
    createdAt: '2026-06-21',
    relatedBookingId: 'booking-1',
  },
  {
    id: 'notif-student-2',
    title: 'Booking request sent',
    body: 'Kwame & Grace Asante will review your request for Sep–Nov 2026.',
    read: true,
    createdAt: '2026-06-22',
    relatedBookingId: 'booking-2',
  },
];

export const touristNotificationsMock: AppNotification[] = [
  {
    id: 'notif-tourist-1',
    title: 'Guide accepted your session',
    body: 'Kofi Asante confirmed your city orientation. Complete payment to lock it in.',
    read: false,
    createdAt: '2026-06-21',
    relatedBookingId: 't-booking-1',
  },
  {
    id: 'notif-tourist-2',
    title: 'Saved lodging tip',
    body: 'Labadi Beach Hotel is popular this week — check availability before you arrive.',
    read: true,
    createdAt: '2026-06-20',
  },
];

export const hostNotificationsMock: AppNotification[] = [
  {
    id: 'notif-host-1',
    title: 'New stay request',
    body: 'Akosua Darko requested a homestay for Sep–Dec 2026. Review it in Requests.',
    read: false,
    createdAt: '2026-06-21',
    relatedBookingId: 'req-1',
  },
  {
    id: 'notif-host-2',
    title: 'Payment received',
    body: 'A guest completed payment for an upcoming stay. It now appears under Bookings.',
    read: true,
    createdAt: '2026-06-19',
  },
];

export const guideNotificationsMock: AppNotification[] = [
  {
    id: 'notif-guide-1',
    title: 'New session request',
    body: 'A visitor requested a 3-hour city orientation on Sep 5. Review it in Bookings.',
    read: false,
    createdAt: '2026-06-21',
    relatedBookingId: 'req-guide-1',
  },
  {
    id: 'notif-guide-2',
    title: 'Session confirmed',
    body: 'A guest paid for your upcoming tour. Check your schedule and meeting point.',
    read: true,
    createdAt: '2026-06-18',
  },
];

/** @deprecated Prefer notificationsMockForIntent — kept for existing imports. */
export const bookingNotificationsMock = studentNotificationsMock;

export function notificationsMockForIntent(
  intent: 'STUDENT' | 'TOURIST' | 'HOST' | 'GUIDE' | null | undefined,
): AppNotification[] {
  switch (intent) {
    case 'HOST':
      return hostNotificationsMock;
    case 'GUIDE':
      return guideNotificationsMock;
    case 'TOURIST':
      return touristNotificationsMock;
    case 'STUDENT':
    default:
      return studentNotificationsMock;
  }
}

export function getUnreadNotificationCount(
  intent?: 'STUDENT' | 'TOURIST' | 'HOST' | 'GUIDE' | null,
): number {
  return notificationsMockForIntent(intent).filter((n) => !n.read).length;
}

export function formatBookingDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-GH')}`;
}

export function computePriceBreakdown(
  nightlyRate: number,
  currency: string,
  checkIn: string,
  checkOut: string,
): PriceBreakdown {
  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);
  const nights = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const subtotal = nightlyRate * nights;
  const platformFee = Math.round(subtotal * 0.05);
  return {
    nightlyRate,
    currency,
    nights,
    subtotal,
    platformFee,
    total: subtotal + platformFee,
  };
}
