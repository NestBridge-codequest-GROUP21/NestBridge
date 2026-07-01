import type { EarningsLineItem, EarningsSummary, ProviderBookingItem } from '../types/providerBooking';

export const hostConfirmedStaysMock: ProviderBookingItem[] = [
  {
    id: 'host-stay-1',
    bookingType: 'HOST',
    guestName: 'Akosua Darko',
    guestInitials: 'AD',
    status: 'CONFIRMED',
    checkIn: '2026-09-01',
    checkOut: '2026-12-15',
    totalPrice: 19845,
    platformFee: 945,
    hostPayout: 18900,
    currency: 'GHS',
  },
  {
    id: 'host-stay-2',
    bookingType: 'HOST',
    guestName: 'Priya Sharma',
    guestInitials: 'PS',
    status: 'ACCEPTED',
    checkIn: '2026-10-01',
    checkOut: '2026-12-01',
    totalPrice: 11880,
    platformFee: 594,
    hostPayout: 11286,
    currency: 'GHS',
  },
];

export const guideUpcomingToursMock: ProviderBookingItem[] = [
  {
    id: 'guide-tour-1',
    bookingType: 'GUIDE',
    guestName: 'Akosua Darko',
    guestInitials: 'AD',
    status: 'CONFIRMED',
    checkIn: '2026-09-05',
    checkOut: '2026-09-05',
    session: {
      sessionDate: '2026-09-05',
      sessionStartTime: '10:00',
      durationHours: 3,
    },
    totalPrice: 126,
    platformFee: 6,
    hostPayout: 120,
    currency: 'GHS',
  },
  {
    id: 'guide-tour-2',
    bookingType: 'GUIDE',
    guestName: 'Marcus Lee',
    guestInitials: 'ML',
    status: 'CONFIRMED',
    checkIn: '2026-09-12',
    checkOut: '2026-09-12',
    session: {
      sessionDate: '2026-09-12',
      sessionStartTime: '14:00',
      durationHours: 4,
    },
    totalPrice: 100,
    platformFee: 5,
    hostPayout: 95,
    currency: 'GHS',
  },
];

export const guideEarningsSummaryMock: EarningsSummary = {
  currency: 'GHS',
  periodLabel: 'June 2026',
  grossTotal: 226,
  platformFees: 11,
  netPayout: 215,
  sessionCount: 2,
};

export const guideEarningsLineItemsMock: EarningsLineItem[] = [
  {
    id: 'guide-tour-1',
    guestName: 'Akosua Darko',
    label: 'Osu food tour · Sep 5',
    gross: 126,
    fee: 6,
    net: 120,
    currency: 'GHS',
    status: 'CONFIRMED',
  },
  {
    id: 'guide-tour-2',
    guestName: 'Marcus Lee',
    label: 'Heritage walk · Sep 12',
    gross: 100,
    fee: 5,
    net: 95,
    currency: 'GHS',
    status: 'CONFIRMED',
  },
];

export function computeEarningsFromBookings(
  bookings: ProviderBookingItem[],
  periodLabel: string,
): { summary: EarningsSummary; lineItems: EarningsLineItem[] } {
  const confirmed = bookings.filter((b) =>
    ['ACCEPTED', 'CONFIRMED', 'CHECKED_IN'].includes(b.status),
  );
  const currency = confirmed[0]?.currency ?? 'GHS';
  const grossTotal = confirmed.reduce((sum, b) => sum + b.totalPrice, 0);
  const platformFees = confirmed.reduce((sum, b) => sum + b.platformFee, 0);
  const netPayout = confirmed.reduce((sum, b) => sum + b.hostPayout, 0);

  const lineItems: EarningsLineItem[] = confirmed.map((b) => ({
    id: b.id,
    guestName: b.guestName,
    label:
      b.session != null
        ? `${b.session.sessionDate} · ${b.session.sessionStartTime}`
        : `${b.checkIn} – ${b.checkOut}`,
    gross: b.totalPrice,
    fee: b.platformFee,
    net: b.hostPayout,
    currency: b.currency,
    status: b.status,
  }));

  return {
    summary: {
      currency,
      periodLabel,
      grossTotal,
      platformFees,
      netPayout,
      sessionCount: confirmed.length,
    },
    lineItems,
  };
}
