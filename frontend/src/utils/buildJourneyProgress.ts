import type { AccountProfileState } from '../types/accountProfile';
import type { BookingListItem, BookingStatus } from '../types/booking';
import type {
  JourneyMilestones,
  JourneyProgress,
  JourneyStep,
} from '../types/journeyProgress';
import { isSeekerComplete } from './accountProfile';

const STAY_FOUND_STATUSES: BookingStatus[] = [
  'ACCEPTED',
  'CONFIRMED',
  'CHECKED_IN',
];

const GUIDE_CONNECTED_STATUSES: BookingStatus[] = [
  'ACCEPTED',
  'CONFIRMED',
  'CHECKED_IN',
  'PENDING_HOST',
];

function hasBooking(
  bookings: BookingListItem[],
  type: BookingListItem['bookingType'],
  statuses: BookingStatus[],
): boolean {
  return bookings.some(
    (booking) =>
      booking.bookingType === type && statuses.includes(booking.status),
  );
}

/**
 * Builds the "Your Ghana Journey" progress model from existing profile,
 * bookings, and soft milestones (SOS / culture / language).
 */
export function buildJourneyProgress(input: {
  profileState: AccountProfileState;
  bookings: BookingListItem[];
  milestones: JourneyMilestones;
  destinationLabel?: string;
}): JourneyProgress {
  const place =
    input.destinationLabel?.trim() ||
    input.profileState.seekerSetup.data.city?.trim() ||
    'Ghana';

  const steps: JourneyStep[] = [
    {
      id: 'profile',
      title: 'Profile completed',
      subtitle: 'Destination, preferences, and basics',
      iconGlyph: '👤',
      completed: isSeekerComplete(input.profileState),
      routeHint: 'AccountSetup',
    },
    {
      id: 'accommodation',
      title: 'Accommodation found',
      subtitle: 'Host stay accepted or confirmed',
      iconGlyph: '🏡',
      completed: hasBooking(input.bookings, 'HOST', STAY_FOUND_STATUSES),
      routeHint: 'MatchSearch',
    },
    {
      id: 'guide',
      title: 'Guide connected',
      subtitle: 'Tour or orientation session booked',
      iconGlyph: '🗺️',
      completed: hasBooking(input.bookings, 'GUIDE', GUIDE_CONNECTED_STATUSES),
      routeHint: 'GuideSearch',
    },
    {
      id: 'emergency',
      title: 'Emergency contacts saved',
      subtitle: 'Know who to call when you need help',
      iconGlyph: '🆘',
      completed: input.milestones.emergencyContactsSaved,
      routeHint: 'SOS',
    },
    {
      id: 'culture',
      title: 'Ghana culture tips completed',
      subtitle: 'Local customs and everyday etiquette',
      iconGlyph: '🤝',
      completed: input.milestones.cultureTipsCompleted,
      routeHint: 'LocalTips',
    },
    {
      id: 'language',
      title: 'Local language basics completed',
      subtitle: 'A few phrases to open doors',
      iconGlyph: '💬',
      completed: input.milestones.languageBasicsCompleted,
      routeHint: 'LocalTips',
    },
  ];

  const completedCount = steps.filter((step) => step.completed).length;
  const totalCount = steps.length;
  const percent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  let subtitle = `Settling into ${place}`;
  if (percent === 0) {
    subtitle = `Your path from arrival to belonging in ${place}`;
  } else if (percent < 100) {
    subtitle = `${completedCount} of ${totalCount} milestones · keep going`;
  } else {
    subtitle = `You are settling in beautifully in ${place}`;
  }

  return {
    title: 'Your Ghana Journey',
    subtitle,
    percent,
    completedCount,
    totalCount,
    steps,
  };
}
