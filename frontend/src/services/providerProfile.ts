import type {
  ActiveBookingDetail,
  GuideCalendarDay,
  GuideShiftBlock,
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

export function getProviderCalendarMonth(referenceDate: Date = new Date()): {
  year: number;
  month: number;
  monthLabel: string;
  startWeekday: number;
} {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;
  const monthLabel = referenceDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const startWeekday = new Date(year, month - 1, 1).getDay();
  return { year, month, monthLabel, startWeekday };
}

export function buildEmptyHostMonthDays(
  year: number,
  month: number,
): HostCalendarDay[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { date, day, status: 'available' as const };
  });
}

export function buildEmptyGuideMonthDays(
  year: number,
  month: number,
): GuideCalendarDay[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { date, day, shifts: [] as GuideCalendarDay['shifts'] };
  });
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

const GUIDE_SHIFT_ORDER: GuideShiftBlock[] = ['morning', 'afternoon', 'evening'];

export function toggleHostDayBlocked(
  days: HostCalendarDay[],
  dayNumber: number,
): HostCalendarDay[] | null {
  const target = days.find((day) => day.day === dayNumber);
  if (!target || target.status === 'booked') {
    return null;
  }
  const nextStatus = target.status === 'blocked' ? 'available' : 'blocked';
  return days.map((day) =>
    day.day === dayNumber ? { ...day, status: nextStatus } : day,
  );
}

export function mergeHostAvailabilityCalendar(
  existing: Record<string, unknown> | undefined,
  monthDays: HostCalendarDay[],
): Record<string, unknown> {
  const calendar: Record<string, unknown> = { ...(existing ?? {}) };
  for (const day of monthDays) {
    if (!day.date || !isAvailabilityDateKey(day.date)) {
      continue;
    }
    if (day.status === 'blocked') {
      calendar[day.date] = 'blocked';
      continue;
    }
    if (day.status === 'available') {
      delete calendar[day.date];
    }
  }
  return calendar;
}

export function toggleGuideShift(
  days: GuideCalendarDay[],
  dayNumber: number,
  shift: GuideShiftBlock,
): GuideCalendarDay[] {
  return days.map((day) => {
    if (day.day !== dayNumber) {
      return day;
    }
    const enabled = day.shifts.includes(shift);
    const nextShifts = enabled
      ? day.shifts.filter((entry) => entry !== shift)
      : [...day.shifts, shift];
    nextShifts.sort(
      (left, right) =>
        GUIDE_SHIFT_ORDER.indexOf(left) - GUIDE_SHIFT_ORDER.indexOf(right),
    );
    return { ...day, shifts: nextShifts };
  });
}

export function mergeGuideAvailabilitySchedule(
  existing: Record<string, unknown> | undefined,
  monthDays: GuideCalendarDay[],
): Record<string, unknown> {
  const schedule: Record<string, unknown> = { ...(existing ?? {}) };
  if (existing?.maxGroupSize != null) {
    schedule.maxGroupSize = existing.maxGroupSize;
  }
  for (const day of monthDays) {
    if (!day.date || !isAvailabilityDateKey(day.date)) {
      continue;
    }
    if (day.shifts.length > 0) {
      schedule[day.date] = day.shifts;
      continue;
    }
    delete schedule[day.date];
  }
  return schedule;
}
