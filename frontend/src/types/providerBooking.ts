import type { BookingStatus, BookingType, SessionDetails } from './booking';

export interface ProviderBookingItem {
  id: string;
  bookingType: BookingType;
  guestName: string;
  guestInitials: string;
  status: BookingStatus;
  checkIn: string;
  checkOut: string;
  session?: SessionDetails;
  totalPrice: number;
  platformFee: number;
  hostPayout: number;
  currency: string;
}

export interface EarningsSummary {
  currency: string;
  periodLabel: string;
  grossTotal: number;
  platformFees: number;
  netPayout: number;
  sessionCount: number;
}

export interface EarningsLineItem {
  id: string;
  guestName: string;
  label: string;
  gross: number;
  fee: number;
  net: number;
  currency: string;
  status: BookingStatus;
}
