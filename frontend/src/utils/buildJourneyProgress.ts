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
 * Personal settle-in status for Home — not a second Explore / SOS menu.
 * Emergency contacts live only on the SOS screen.
 */
export function buildJourneyProgress(input: {
  profileState: AccountProfileState;
  bookings: BookingListItem[];
  /** Kept for call-site compatibility; emergency is SOS-only and unused here. */
  milestones: JourneyMilestones;
  destinationLabel?: string;
  /** @deprecated Unused — journey is status-only, not a navigation hub. */
  preferStayCatalogue?: boolean;
  /** Tourist copy focuses on visiting — not academic settle-in. */
  journeyAudience?: 'student' | 'tourist';
}): JourneyProgress {
  void input.milestones;
  const place =
    input.destinationLabel?.trim() ||
    input.profileState.seekerSetup.data.city?.trim() ||
    'Ghana';
  const isTourist = input.journeyAudience === 'tourist';

  const accommodationFound = hasBooking(
    input.bookings,
    'HOST',
    STAY_FOUND_STATUSES,
  );
  const guideConnected = hasBooking(
    input.bookings,
    'GUIDE',
    GUIDE_CONNECTED_STATUSES,
  );

  const steps: JourneyStep[] = [
    {
      id: 'profile',
      title: isTourist ? 'Trip profile ready' : 'Travel profile ready',
      subtitle: isTourist
        ? 'Destination, dates, and travel basics'
        : 'Destination, preferences, and basics',
      iconGlyph: '👤',
      completed: isSeekerComplete(input.profileState),
    },
    {
      id: 'accommodation',
      title: isTourist ? 'Stay booked' : 'Homestay booked',
      subtitle: accommodationFound
        ? isTourist
          ? 'Lodging is on your bookings'
          : 'A host stay is on your bookings'
        : 'No stay booked yet',
      iconGlyph: '🏡',
      completed: accommodationFound,
    },
    {
      id: 'guide',
      title: isTourist ? 'Guided trip planned' : 'Guide session planned',
      subtitle: guideConnected
        ? 'A guide session is on your bookings'
        : 'No guide session yet',
      iconGlyph: '🗺️',
      completed: guideConnected,
    },
  ];

  const completedCount = steps.filter((step) => step.completed).length;
  const totalCount = steps.length;
  const percent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  let subtitle = isTourist
    ? `Your trip readiness for ${place}`
    : `Your settle-in status for ${place}`;
  if (percent === 0) {
    subtitle = isTourist
      ? `Track trip readiness for ${place}`
      : `Track settle-in status for ${place}`;
  } else if (percent < 100) {
    subtitle = `${completedCount} of ${totalCount} complete`;
  } else {
    subtitle = isTourist
      ? `Ready for your visit to ${place}`
      : `Ready to settle into ${place}`;
  }

  return {
    title: isTourist ? 'Trip readiness' : 'Settle-in status',
    subtitle,
    percent,
    completedCount,
    totalCount,
    steps,
  };
}
