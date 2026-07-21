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
  /** When true, accommodation CTA prefers ExploreStays over MatchSearch. */
  preferStayCatalogue?: boolean;
  /** Tourist copy focuses on visiting — not academic settle-in. */
  journeyAudience?: 'student' | 'tourist';
}): JourneyProgress {
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
      title: isTourist ? 'Trip profile ready' : 'Profile completed',
      subtitle: isTourist
        ? 'Destination, dates, and travel basics'
        : 'Destination, preferences, and basics',
      iconGlyph: '👤',
      completed: isSeekerComplete(input.profileState),
      routeHint: 'AccountSetup',
    },
    {
      id: 'accommodation',
      title: isTourist ? 'Stay booked' : 'Accommodation found',
      subtitle: accommodationFound
        ? isTourist
          ? 'Open your lodging booking'
          : 'Open your stay booking'
        : isTourist
          ? 'Find lodging or a host stay'
          : 'Browse or match with a host stay',
      iconGlyph: '🏡',
      completed: accommodationFound,
      routeHint: accommodationFound
        ? 'StudentBookings'
        : input.preferStayCatalogue
          ? 'ExploreStays'
          : 'MatchSearch',
    },
    {
      id: 'guide',
      title: isTourist ? 'Guided trip planned' : 'Guide connected',
      subtitle: guideConnected
        ? isTourist
          ? 'Open your guided experience'
          : 'Open your guide session'
        : isTourist
          ? 'Book a local guide or tour'
          : 'Find a local guide near you',
      iconGlyph: '🗺️',
      completed: guideConnected,
      routeHint: guideConnected ? 'StudentBookings' : 'GuideSearch',
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
      title: isTourist
        ? 'Culture tips reviewed'
        : 'Ghana culture tips completed',
      subtitle: isTourist
        ? 'Customs and etiquette for your visit'
        : 'Local customs and everyday etiquette',
      iconGlyph: '🤝',
      completed: input.milestones.cultureTipsCompleted,
      routeHint: 'LocalTips',
    },
    {
      id: 'language',
      title: isTourist
        ? 'Useful phrases learned'
        : 'Local language basics completed',
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

  let subtitle = isTourist
    ? `Planning your visit to ${place}`
    : `Settling into ${place}`;
  if (percent === 0) {
    subtitle = isTourist
      ? `Your path from landing to exploring ${place}`
      : `Your path from arrival to belonging in ${place}`;
  } else if (percent < 100) {
    subtitle = `${completedCount} of ${totalCount} milestones · keep going`;
  } else {
    subtitle = isTourist
      ? `You are ready to explore ${place}`
      : `You are settling in beautifully in ${place}`;
  }

  return {
    title: isTourist ? 'Your Ghana Trip' : 'Your Ghana Journey',
    subtitle,
    percent,
    completedCount,
    totalCount,
    steps,
  };
}
