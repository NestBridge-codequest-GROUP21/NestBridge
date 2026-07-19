import type { IncomingBookingRequest } from '../types/booking';
import type { ProviderBookingItem } from '../types/providerBooking';

const ACTIVE_PROVIDER_STATUSES = new Set(['ACCEPTED', 'CONFIRMED', 'CHECKED_IN']);

export function incomingToProviderBooking(
  request: IncomingBookingRequest,
): ProviderBookingItem {
  const total = request.priceBreakdown.total;
  const fee = request.priceBreakdown.platformFee;
  const payout =
    request.sessionPrice != null
      ? request.sessionPrice.total - request.sessionPrice.platformFee
      : total - fee;

  return {
    id: request.id,
    bookingType: request.bookingType,
    guestName: request.studentName,
    guestInitials: request.studentInitials,
    status: 'CONFIRMED',
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    session: request.session,
    totalPrice: request.sessionPrice?.total ?? total,
    platformFee: request.sessionPrice?.platformFee ?? fee,
    hostPayout: payout,
    currency: request.priceBreakdown.currency,
  };
}

export function mapIncomingListToProviderBookings(
  items: IncomingBookingRequest[],
): ProviderBookingItem[] {
  return items.map(incomingToProviderBooking);
}

export function isActiveProviderBooking(status: string): boolean {
  return ACTIVE_PROVIDER_STATUSES.has(status);
}
