import type {
  ActiveBookingDetail,
  GuideCalendarDay,
  HostCalendarDay,
  HostListingItem,
  TourTypeOption,
} from '../data/featureScreensMock';
import { tourTypesMock } from '../data/featureScreensMock';
import type { GuideProfileApi, HostProfileApi } from './api';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function hostProfileToListing(profile: HostProfileApi): HostListingItem {
  const address =
    profile.address?.trim() ||
    [profile.city, profile.country].filter(Boolean).join(', ') ||
    'Homestay listing';

  return {
    id: profile.hostId,
    address,
    imageEmoji: '🏠',
    isOnline: profile.active ?? true,
    bookingsScore: 100,
  };
}

export function mergeTourTypesFromProfile(
  serviceTypes: string[] | undefined,
  pricePerSession?: number,
): { tourTypes: TourTypeOption[]; baseRate: string; maxGroupSize: string } {
  const enabledSet = new Set((serviceTypes ?? []).map((value) => value.toLowerCase()));
  const tourTypes = tourTypesMock.map((option) => ({
    ...option,
    enabled:
      enabledSet.has(option.label.toLowerCase()) ||
      enabledSet.has(option.id.toLowerCase()) ||
      (serviceTypes ?? []).some((type) =>
        option.label.toLowerCase().includes(type.toLowerCase()),
      ),
  }));

  return {
    tourTypes,
    baseRate: pricePerSession != null ? String(Math.round(pricePerSession)) : '45',
    maxGroupSize: '8',
  };
}

export function tourTypesToServiceTypes(tourTypes: TourTypeOption[]): string[] {
  return tourTypes.filter((type) => type.enabled).map((type) => type.label);
}

export function buildGuideSchedulePatch(
  existing: Record<string, unknown> | undefined,
  maxGroupSize: string,
): Record<string, unknown> {
  const schedule: Record<string, unknown> = { ...(existing ?? {}) };
  const parsed = Number.parseInt(maxGroupSize, 10);
  if (!Number.isNaN(parsed)) {
    schedule.maxGroupSize = parsed;
  }
  return schedule;
}

export function readMaxGroupSize(schedule: Record<string, unknown> | undefined): string {
  const raw = schedule?.maxGroupSize;
  if (typeof raw === 'number') {
    return String(raw);
  }
  if (typeof raw === 'string' && raw.trim()) {
    return raw;
  }
  return '8';
}

export function mapHostCalendarDays(
  days: Array<{ date?: string; day?: number; status?: string }>,
): HostCalendarDay[] {
  return days
    .filter((day) => day.day != null && day.status)
    .map((day) => ({
      date: day.date ?? '',
      day: day.day as number,
      status: (day.status as HostCalendarDay['status']) ?? 'available',
    }));
}

export function mapGuideCalendarDays(
  days: Array<{ date?: string; day?: number; shifts?: string[] }>,
): GuideCalendarDay[] {
  return days
    .filter((day) => day.day != null)
    .map((day) => ({
      date: day.date ?? '',
      day: day.day as number,
      shifts: (day.shifts ?? []) as GuideCalendarDay['shifts'],
    }));
}

export function isAvailabilityDateKey(key: string): boolean {
  return DATE_KEY_PATTERN.test(key);
}

export function mapActiveBooking(
  booking: { guestName?: string; dateRange?: string; totalAmount?: string } | null | undefined,
): ActiveBookingDetail | null {
  if (!booking?.guestName) {
    return null;
  }
  return {
    guestName: booking.guestName,
    dateRange: booking.dateRange ?? '',
    totalAmount: booking.totalAmount ?? '',
  };
}
