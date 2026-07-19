import type {
  BookingListItem,
  BookingContext,
  GuideProfileSummary,
  HostProfileSummary,
} from '../types/booking';
import { computePriceBreakdown, FLEXIBLE_POLICY } from '../data/bookingMock';
import { computeSessionPrice } from '../data/guideSessionMock';

let demoBookingCounter = 0;

const API_BOOKING_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Live API bookings use UUIDs; mock/demo rows use string ids like `booking-1`. */
export function isApiBookingId(bookingId: string): boolean {
  return API_BOOKING_ID_RE.test(bookingId);
}

function nextDemoBookingId(prefix: string): string {
  demoBookingCounter += 1;
  return `${prefix}-${Date.now()}-${demoBookingCounter}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createDemoHostBookingRequest(
  host: HostProfileSummary,
  checkIn: string,
  checkOut: string,
  bookingContext: BookingContext = 'STUDENT',
): BookingListItem {
  const priceBreakdown = computePriceBreakdown(
    host.pricePerNight,
    host.currency,
    checkIn,
    checkOut,
  );

  return {
    id: nextDemoBookingId('demo-host-booking'),
    bookingType: 'HOST',
    seekerRole: bookingContext === 'TOURIST' ? 'TOURIST' : 'STUDENT',
    bookingContext,
    hostId: host.id,
    hostName: host.name,
    hostInitials: host.initials,
    hostLocation: host.location,
    hostIcon: host.icon ?? '🏡',
    checkIn,
    checkOut,
    status: 'PENDING_HOST',
    priceBreakdown,
    cancellationPolicy: host.cancellationPolicy || FLEXIBLE_POLICY,
    createdAt: todayIso(),
  };
}

export function createDemoGuideBookingRequest(
  guide: GuideProfileSummary,
  sessionDate: string,
  sessionStartTime: string,
  bookingContext: BookingContext = 'STUDENT',
): BookingListItem {
  const sessionPrice = computeSessionPrice(guide.pricePerSession, guide.currency);

  return {
    id: nextDemoBookingId('demo-guide-booking'),
    bookingType: 'GUIDE',
    seekerRole: bookingContext === 'TOURIST' ? 'TOURIST' : 'STUDENT',
    bookingContext,
    hostId: guide.id,
    hostName: guide.name,
    hostInitials: guide.initials,
    hostLocation: guide.location,
    hostIcon: guide.icon ?? '🗺️',
    checkIn: sessionDate,
    checkOut: sessionDate,
    status: 'PENDING_HOST',
    session: {
      sessionDate,
      sessionStartTime,
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
    cancellationPolicy: guide.cancellationPolicy || FLEXIBLE_POLICY,
    createdAt: todayIso(),
  };
}

export function confirmDemoBooking(booking: BookingListItem): BookingListItem {
  return {
    ...booking,
    status: 'CONFIRMED',
  };
}

export function mergeBookingsWithLocalOverrides(
  base: BookingListItem[],
  local: BookingListItem[],
): BookingListItem[] {
  const overrides = new Map(local.map((item) => [item.id, item]));
  const baseIds = new Set(base.map((item) => item.id));
  const merged = base.map((item) => overrides.get(item.id) ?? item);
  const createdLocally = local.filter((item) => !baseIds.has(item.id));
  return [...createdLocally, ...merged];
}
