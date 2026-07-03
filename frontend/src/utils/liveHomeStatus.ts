import type { BookingListItem, IncomingBookingRequest } from '../types/booking';
import type { RecentActivityItem } from '../components/RecentActivityList';

export interface LiveHomeStatus {
  statusLabel: string;
  reminder: string;
  recentActivity: RecentActivityItem[];
}

function formatShortDate(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function mapBookingActivity(bookings: BookingListItem[]): RecentActivityItem[] {
  return bookings.slice(0, 3).map((booking) => ({
    id: booking.id,
    icon: booking.bookingType === 'GUIDE' ? '🗺️' : '🏠',
    title: `${booking.hostName} — ${booking.status.replace(/_/g, ' ').toLowerCase()}`,
    timestamp: formatShortDate(booking.checkIn || booking.createdAt),
  }));
}

function mapIncomingActivity(incoming: IncomingBookingRequest[], label: string): RecentActivityItem[] {
  return incoming.slice(0, 3).map((request) => ({
    id: request.id,
    icon: label.includes('session') ? '🗺️' : '🏠',
    title: `${request.studentName} ${label}`,
    timestamp: formatShortDate(request.checkIn ?? request.session?.sessionDate ?? ''),
  }));
}

export function buildStudentHomeStatus(
  bookings: BookingListItem[],
  cityLabel: string,
  setupIncomplete: boolean,
  apiError?: string | null,
): LiveHomeStatus {
  if (apiError) {
    return {
      statusLabel: cityLabel ? `Heading to ${cityLabel.split(',')[0]?.trim() || cityLabel}` : 'Your homestay search',
      reminder: `Could not load live data: ${apiError}`,
      recentActivity: [],
    };
  }
  const pending = bookings.filter((b) => b.status === 'PENDING_HOST').length;
  const awaitingPay = bookings.filter((b) => b.status === 'ACCEPTED').length;
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;

  let reminder = setupIncomplete
    ? 'Finish your travel profile to request homestays and guide sessions.'
    : 'Browse hosts and guides matched to your destination.';
  if (awaitingPay > 0) {
    reminder = `You have ${awaitingPay} booking${awaitingPay > 1 ? 's' : ''} ready to pay.`;
  } else if (pending > 0) {
    reminder = `${pending} homestay request${pending > 1 ? 's' : ''} awaiting host review.`;
  } else if (confirmed > 0) {
    reminder = `${confirmed} confirmed stay${confirmed > 1 ? 's' : ''} on your calendar.`;
  }

  return {
    statusLabel: cityLabel
      ? `Heading to ${cityLabel.split(',')[0]?.trim() || cityLabel} soon`
      : 'Plan your arrival',
    reminder,
    recentActivity: mapBookingActivity(bookings),
  };
}

export function buildTouristHomeStatus(
  bookings: BookingListItem[],
  cityLabel: string,
  setupIncomplete: boolean,
  apiError?: string | null,
): LiveHomeStatus {
  if (apiError) {
    return {
      statusLabel: 'Explore Ghana',
      reminder: `Could not load live data: ${apiError}`,
      recentActivity: [],
    };
  }
  const guidePending = bookings.filter((b) => b.bookingType === 'GUIDE' && b.status === 'PENDING_HOST').length;
  const reminder = setupIncomplete
    ? 'Complete your travel profile to book guide sessions.'
    : guidePending > 0
      ? `${guidePending} guide session request${guidePending > 1 ? 's' : ''} pending.`
      : 'Discover guides, sites, and trusted lodging partners.';

  return {
    statusLabel: cityLabel ? `Discover ${cityLabel}` : 'Explore Ghana',
    reminder,
    recentActivity: mapBookingActivity(bookings),
  };
}

export function buildHostHomeStatus(
  incoming: IncomingBookingRequest[],
  apiError?: string | null,
): LiveHomeStatus {
  const pending = incoming.length;
  return {
    statusLabel: pending > 0 ? `${pending} new request${pending > 1 ? 's' : ''}` : 'Listing active',
    reminder: apiError
      ? `Could not load live data: ${apiError}`
      : pending > 0
        ? 'Review incoming homestay requests on your Requests tab.'
        : 'Your listing is live. Travel tools stay available when you are on the move.',
    recentActivity: mapIncomingActivity(incoming, 'requested a homestay'),
  };
}

export function buildGuideHomeStatus(
  incoming: IncomingBookingRequest[],
  apiError?: string | null,
): LiveHomeStatus {
  const pending = incoming.length;
  return {
    statusLabel: pending > 0 ? `${pending} session request${pending > 1 ? 's' : ''}` : 'Available for tours',
    reminder: apiError
      ? `Could not load live data: ${apiError}`
      : pending > 0
        ? 'Review incoming session requests on your Bookings tab.'
        : 'Keep your availability updated so travelers can book you.',
    recentActivity: mapIncomingActivity(incoming, 'requested a guide session'),
  };
}
