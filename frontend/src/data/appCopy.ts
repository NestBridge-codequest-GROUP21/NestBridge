/**
 * Cross-screen copy — warm Ghana/Accra voice, single source for reusable phrases.
 */

import type { PrimaryIntent, SetupTrack } from '../types/accountProfile';
import { PRIMARY_INTENT_ICONS } from '../types/accountProfile';
import type { OnboardingNextStep } from '../components/OnboardingNextStepsCard';
import { ONBOARDING_HERO_IMAGES } from './onboardingHeroImages';

export const splashCopy = {
  tagline: 'From Arrival to Belonging.',
  continueHint: 'Tap to continue',
};

export const welcomeCopy = {
  headline: 'Host families, local guides, and places to stay — starting in Ghana.',
  subheadline: 'Create an account to find homestays, guides, and lodging in Ghana.',
  valuePills: [
    { icon: '🏠', label: 'Homestays near campus and city centres' },
    { icon: '🗺️', label: 'Verified guides for orientation and culture' },
    { icon: '🏨', label: 'Hotels and hostels when you need your own space' },
  ],
};

export const intentSelectCopy = {
  noteTitle: 'You can do it all here',
  noteBody:
    'Pick what matters most right now. You can still book guides, find stays, and browse lodging anytime from Search.',
};

export const browseGateCopy = {
  message:
    'Add your travel details to request a stay — browsing is free until then.',
  continueLabel: 'Continue setup',
};

export const bookingGateCopy = {
  homestay: 'Complete your travel profile to send a booking request or message hosts.',
  guide: 'Complete your travel profile to book a guide session or message guides.',
  messaging: 'Complete your travel profile before messaging hosts and guides.',
};

/** Shared shape for polished empty experiences (icon + copy + optional CTA label). */
export type EmptyStateContent = {
  title: string;
  body: string;
  tip?: string;
  /** Emoji glyph key resolved by AppIcon — never rendered as raw emoji in the icon tile. */
  iconGlyph?: string;
  primaryActionLabel?: string;
};

export const emptyStates = {
  hostRequests: {
    title: 'Your request inbox is clear',
    body: 'When a student or traveller matches your home, their request will land here.',
    tip: 'Keep your listing photos and house rules fresh so the right guests find you.',
    iconGlyph: '📩',
    primaryActionLabel: 'Review my listing',
  } satisfies EmptyStateContent,
  guideRequests: {
    title: 'No session requests yet',
    body: 'Travellers booking tours and orientation walks will appear here first.',
    tip: 'Clear tour types and open availability help guests book with confidence.',
    iconGlyph: '🗺️',
    primaryActionLabel: 'Set tour types',
  } satisfies EmptyStateContent,
  hostBookings: {
    title: 'No confirmed stays yet',
    body: 'Once a guest pays for an accepted request, their stay shows up here on your calendar.',
    tip: 'Respond to pending requests so great matches do not slip away.',
    iconGlyph: '🏠',
    primaryActionLabel: 'View requests',
  } satisfies EmptyStateContent,
  guideBookings: {
    title: 'No upcoming tours',
    body: 'Confirmed sessions appear here with date, time, and guest details.',
    tip: 'Open a few slots this week — orientation walks book quickly before term starts.',
    iconGlyph: '📅',
    primaryActionLabel: 'Set availability',
  } satisfies EmptyStateContent,
  guideEarnings: {
    title: 'No earnings yet',
    body: 'Completed tours will show payout amounts and status once guests check out.',
    tip: 'Finish a confirmed session to see your first NestBridge payout here.',
    iconGlyph: '💰',
    primaryActionLabel: 'View bookings',
  } satisfies EmptyStateContent,
  hostEarnings: {
    title: 'No payouts yet',
    body: 'When guests pay for confirmed stays, escrow releases appear here after check-in.',
    tip: 'Accept a request and complete check-in to unlock your first payout.',
    iconGlyph: '💰',
    primaryActionLabel: 'View bookings',
  } satisfies EmptyStateContent,
  messages: {
    title: 'Your inbox is quiet 💬',
    body: 'Connect with hosts and guides to start your Ghana journey.',
    tip: 'Message after matching to confirm arrival plans and ask questions.',
    iconGlyph: '💬',
    primaryActionLabel: 'Start exploring',
  } satisfies EmptyStateContent,
  notifications: {
    title: 'All caught up',
    body: 'Booking updates, payment reminders, and host messages will appear here.',
    tip: 'Keep notifications on so you never miss a check-in or session request.',
    iconGlyph: '🔔',
    primaryActionLabel: 'Go to home',
  } satisfies EmptyStateContent,
  recommendations: {
    title: 'Personal picks are on the way',
    body: 'As you set a destination and preferences, NestBridge suggests hosts, guides, and local tips for you.',
    tip: 'Finish profile setup for sharper recommendations.',
    iconGlyph: '✨',
    primaryActionLabel: 'Start exploring',
  } satisfies EmptyStateContent,
  studentBookings: {
    active: {
      title: 'No journeys yet',
      body: 'Your Ghana experience starts here. Find a host, guide, or cultural experience to begin.',
      tip: 'Search hosts near your campus city, or book a guide for your first weekend.',
      iconGlyph: '🌍',
      primaryActionLabel: 'Find accommodation',
    } satisfies EmptyStateContent,
    pending: {
      title: 'No pending requests',
      body: 'Send a stay request to a host — it will show here while they review it.',
      tip: 'Compatible hosts often reply within a day or two.',
      iconGlyph: '📩',
      primaryActionLabel: 'Find a host',
    } satisfies EmptyStateContent,
    past: {
      title: 'No past trips yet',
      body: 'Completed stays and closed requests will gather here as you travel.',
      tip: 'After a stay, you can leave a review from your booking details.',
      iconGlyph: '🧳',
      primaryActionLabel: 'Plan a trip',
    } satisfies EmptyStateContent,
  },
  hostListings: {
    title: 'No listings yet',
    body: 'Add your home so students and travellers can discover you on NestBridge.',
    tip: 'A clear photo and neighbourhood note help guests feel at home before they arrive.',
    iconGlyph: '🏡',
    primaryActionLabel: 'Finish host setup',
  } satisfies EmptyStateContent,
  matchResults: {
    title: 'No matches this time',
    body: 'Try widening your budget or adjusting your dates, then search again.',
    tip: 'Hosts near campus fill up fast — a flexible date range helps.',
    iconGlyph: '🏠',
    primaryActionLabel: 'Edit search',
  } satisfies EmptyStateContent,
  guideSearch: (city: string): EmptyStateContent => ({
    title: 'No guides nearby yet',
    body: `We are onboarding more local guides around ${city}. Try another city or check back soon.`,
    tip: 'Guides help with markets, transport, and settling in.',
    iconGlyph: '🗺️',
    primaryActionLabel: 'Browse stays instead',
  }),
  discoveryHosts: (city: string): EmptyStateContent => ({
    title: `No homestays near ${city.split(',')[0]?.trim() || city} yet`,
    body: 'We are still onboarding host families for this destination. Search nearby hubs or finish your profile so we can match you when listings open.',
    tip: 'Try Accra, Kumasi, Cape Coast, or Tamale — or widen your search dates.',
    iconGlyph: '🏠',
    primaryActionLabel: 'Search all hosts',
  }),
  discoveryGuides: (city: string): EmptyStateContent => ({
    title: `No guides in ${city} yet`,
    body: 'New guides join every week. Browse another city or explore cultural sites meanwhile.',
    tip: 'Orientation walks book quickly before the semester starts.',
    iconGlyph: '🗺️',
    primaryActionLabel: 'Explore guides',
  }),
  exploreStays: (city: string): EmptyStateContent => ({
    title: 'Nothing to explore here yet',
    body: `Host families near ${city} are still joining. Try Accra or Kumasi, or check back soon.`,
    tip: 'Finish your profile to unlock better stay matches.',
    iconGlyph: '🏡',
    primaryActionLabel: 'Find a host',
  }),
  lodgingDirectory: (city: string): EmptyStateContent => ({
    title: 'Nothing saved in this filter',
    body: `Try another category, or widen your search around ${city}.`,
    tip: 'Partner guesthouses often sit near universities and business districts.',
    iconGlyph: '🏨',
    primaryActionLabel: 'Clear filters',
  }),
  sitesDirectory: (city: string): EmptyStateContent => ({
    title: 'No sites listed yet',
    body: `Cultural sites for ${city} are still being curated. Try Accra, or book a local guide for neighbourhood tips.`,
    tip: 'Accra and Cape Coast have the fullest directories today.',
    iconGlyph: '🏛️',
    primaryActionLabel: 'Explore guides',
  }),
  studentEvents: {
    title: 'No events yet',
    body: 'Be the first to bring students together — host a cook-out, market walk, or weekend trip.',
    tip: 'Campus events fill up fast near the start of term.',
    iconGlyph: '🎉',
    primaryActionLabel: 'Host your own',
  } satisfies EmptyStateContent,
  chatThread: (participantName: string): EmptyStateContent => ({
    title: 'Start the conversation',
    body: `Say hello to ${participantName}. Clear plans help hosts and guides prepare for your stay.`,
    tip: 'Share arrival times, dietary needs, or questions about your destination.',
    iconGlyph: '👋',
  }),
  sosContacts: {
    title: 'Nothing saved yet',
    body: 'Add trusted contacts so you can reach them quickly in an emergency.',
    tip: 'Campus security and your host family are good starting points.',
    iconGlyph: '❤️',
    primaryActionLabel: 'Open profile',
  } satisfies EmptyStateContent,
  prepChecklist: {
    title: 'Your checklist is empty',
    body: 'Add items you need before arrival — travel adapter, MoMo float, and copies of your documents.',
    tip: 'Use the field below to add anything you do not want to forget.',
    iconGlyph: '✅',
  } satisfies EmptyStateContent,
  localTips: {
    title: 'No culture guide for this city yet',
    body: 'Phrases and cultural etiquette will show here once they are available for your destination.',
    tip: 'The Ghana culture & language guide is ready for Accra — update your city in account setup if needed.',
    iconGlyph: '👋',
    primaryActionLabel: 'Update destination',
  } satisfies EmptyStateContent,
  practicalTips: {
    title: 'No local tips for this city yet',
    body: 'Practical living tips — transport, money, SIM cards, and safety — will show here when available.',
    tip: 'Try Accra or Kumasi for the fullest daily-living guide.',
    iconGlyph: '📍',
    primaryActionLabel: 'Update destination',
  } satisfies EmptyStateContent,
  transport: {
    title: 'No routes for this city yet',
    body: 'Tro-tro, taxi, and ride-hailing guidance will show here when available for your destination.',
    tip: 'Try Accra or Kumasi for the fullest transport guide.',
    iconGlyph: '🚌',
  } satisfies EmptyStateContent,
  transportMode: {
    title: 'No routes listed',
    body: 'We do not have sample routes for this mode yet. Try another tab above.',
    tip: 'Switch modes to see tro-tro, taxi, or ride-hailing options.',
    iconGlyph: '🚌',
  } satisfies EmptyStateContent,
  videoLibrary: (city: string): EmptyStateContent => ({
    title: 'Your learning hub is getting ready',
    body: `Orientation clips for arriving, living, and exploring ${city} will appear here once they are curated.`,
    tip: 'Check Preparing for Ghana, Living in Ghana, Culture & Communication, and Exploring Ghana when content is available.',
    iconGlyph: '🎬',
  }),
  sponsors: {
    title: 'No sponsors match',
    body: 'Clear the search or pick another category. Every chip shows how many partners are available.',
    tip: 'Try “All” or search words like scholarship, diaspora, or Accra.',
    iconGlyph: '🎓',
    primaryActionLabel: 'Clear filters',
  } satisfies EmptyStateContent,
  guideAvailability: {
    title: 'No shifts scheduled',
    body: 'Tap a day on the calendar to open or close availability for tours.',
    tip: 'Regular morning and weekend slots attract the most bookings.',
    iconGlyph: '📆',
  } satisfies EmptyStateContent,
};

export const providerWelcome = {
  host: (name: string) => ({
    greeting: name,
    line: 'Students near East Legon are looking for hosts this month — keep your listing ready.',
  }),
  guide: (name: string) => ({
    greeting: name,
    line: 'Travellers are booking orientation walks before the semester — check your availability.',
  }),
};

export const profileCopy = {
  aboutAccount:
    'Finish setup only for what you want to book or offer. Search is always open for homestays, guides, and lodging.',
};

export const accountSetupCopy = {
  headerSubtitle:
    'Set up what you need — book stays, offer your home, or list tours. One sign-in covers everything.',
  infoTitle: 'Book and offer from one place',
  infoBody:
    'Complete travel details to request stays. Add a host or guide listing when you are ready to welcome guests.',
  exchangeStudentToggleLabel: 'I am no longer an active exchange student',
  exchangeStudentToggleHint:
    'Turn this on when your exchange program has ended. You can then list as a host or guide while still booking as a traveller.',
};

export const devTestingCopy = {
  title: 'Developer testing',
  subtitle: 'Open app flows without finishing onboarding. Development builds only.',
  resetLabel: 'Reset to brand-new user',
  resetHint: 'Clears profile progress and signs you out.',
  homeDashboardsTitle: 'Jump to home dashboard',
  partialOnboardingTitle: 'Simulate partial onboarding',
  exchangeStudentTitle: 'Exchange student flag',
  exchangeStudentActive: 'Active exchange student (provider listing blocked)',
  exchangeStudentInactive: 'No longer on exchange (provider listing allowed)',
  demoActorsTitle: 'Switch demo actor',
  demoActorsHint:
    'Signs in as a seeded demo account with real bookings and messages. Password: password',
  demoActorsLoginError: 'Could not sign in — is the backend running?',
};

export const validationCopy = {
  placeInvalid:
    "Check the spelling — try 'Wa' or 'Wa, Upper West'.",
  otherRequired: 'Tell us which one — a few words is enough.',
};

export interface OnboardingReadyCopyContext {
  userName?: string;
  destination?: string;
  university?: string;
  city?: string;
}

export interface OnboardingReadyCopy {
  subtitle: string;
  heroImageUri: string;
  carouselCards: OnboardingNextStep[];
  ctaLabel: string;
  roleLabel: string;
  roleIcon: string;
}

const ONBOARDING_ROLE_LABELS: Record<PrimaryIntent, string> = {
  STUDENT: 'Student',
  TOURIST: 'Tourist',
  HOST: 'Host',
  GUIDE: 'Guide',
};

function onboardingReadySubtitle(intent: PrimaryIntent, userName: string): string {
  const name = userName.trim() || 'there';
  if (intent === 'TOURIST') {
    return `Explore local culture, ${name}!`;
  }
  if (intent === 'HOST') {
    return `Find your ideal guest, ${name}!`;
  }
  if (intent === 'GUIDE') {
    return `Showcase your expertise, ${name}!`;
  }
  return `Let's find your perfect home, ${name}!`;
}

export function trackToIntent(track: SetupTrack): PrimaryIntent {
  if (track === 'HOST') return 'HOST';
  if (track === 'GUIDE') return 'GUIDE';
  return 'STUDENT';
}

export function onboardingReadyCopy(
  intent: PrimaryIntent,
  ctx: OnboardingReadyCopyContext = {},
): OnboardingReadyCopy {
  const destination = ctx.destination?.trim() || ctx.city?.trim() || 'your destination';
  const userName = ctx.userName?.trim() || 'there';
  const subtitle = onboardingReadySubtitle(intent, userName);

  if (intent === 'HOST') {
    return {
      subtitle,
      heroImageUri: ONBOARDING_HERO_IMAGES.HOST,
      carouselCards: [
        {
          icon: '🔑',
          title: 'Matched guests',
          body: 'See students and travellers looking for a homestay with your household.',
        },
        {
          icon: '💬',
          title: 'Review requests',
          body: 'Message guests and accept stays on your own schedule.',
        },
        {
          icon: '🛡️',
          title: 'Verified guests',
          body: 'Guests complete NestBridge checks before they can request a stay.',
        },
      ],
      ctaLabel: 'Go to requests',
      roleLabel: ONBOARDING_ROLE_LABELS.HOST,
      roleIcon: PRIMARY_INTENT_ICONS.HOST,
    };
  }

  if (intent === 'GUIDE') {
    return {
      subtitle,
      heroImageUri: ONBOARDING_HERO_IMAGES.GUIDE,
      carouselCards: [
        {
          icon: '🗺️',
          title: 'Session bookings',
          body: 'Accept tour and orientation sessions from travellers who match your offer.',
        },
        {
          icon: '📆',
          title: 'Your availability',
          body: 'Set tour types, prices, and open time slots.',
        },
        {
          icon: '⭐',
          title: 'Reviews',
          body: 'Build trust with feedback after each completed session.',
        },
      ],
      ctaLabel: 'Go to bookings',
      roleLabel: ONBOARDING_ROLE_LABELS.GUIDE,
      roleIcon: PRIMARY_INTENT_ICONS.GUIDE,
    };
  }

  if (intent === 'TOURIST') {
    return {
      subtitle,
      heroImageUri: ONBOARDING_HERO_IMAGES.TOURIST,
      carouselCards: [
        {
          icon: '🏪',
          title: 'Local guides',
          body: `Book someone who knows the markets and neighbourhoods around ${destination}.`,
        },
        {
          icon: '🏠',
          title: 'Verified homestays',
          body: 'Stay with host families reviewed by other travellers.',
        },
        {
          icon: '🛡️',
          title: 'Help when you need it',
          body: 'Emergency contacts and SOS stay within reach during your trip.',
        },
      ],
      ctaLabel: 'Book a trip',
      roleLabel: ONBOARDING_ROLE_LABELS.TOURIST,
      roleIcon: PRIMARY_INTENT_ICONS.TOURIST,
    };
  }

  return {
    subtitle,
    heroImageUri: ONBOARDING_HERO_IMAGES.STUDENT,
    carouselCards: [
      {
        icon: '📖',
        title: 'A place to settle',
        body: 'Find host families that fit your study routine and lifestyle.',
      },
      {
        icon: '🎯',
        title: 'Matched to you',
        body: `See hosts near ${destination} ranked by what matters for your move.`,
      },
      {
        icon: '🛡️',
        title: 'Verified hosts',
        body: 'Host families are checked before they appear in NestBridge.',
      },
    ],
    ctaLabel: 'See your matches',
    roleLabel: ONBOARDING_ROLE_LABELS.STUDENT,
    roleIcon: PRIMARY_INTENT_ICONS.STUDENT,
  };
}

export function onboardingReadyCopyByTrack(
  track: SetupTrack,
  primaryIntent: PrimaryIntent | null,
  ctx: OnboardingReadyCopyContext = {},
): OnboardingReadyCopy {
  if (track === 'HOST') {
    return onboardingReadyCopy('HOST', ctx);
  }
  if (track === 'GUIDE') {
    return onboardingReadyCopy('GUIDE', ctx);
  }
  return onboardingReadyCopy(primaryIntent ?? 'STUDENT', ctx);
}

/** @deprecated Use onboardingReadyCopy nextSteps instead */
export function buildMatchHint(university?: string, city?: string): string {
  const place = university?.trim() || city?.trim() || 'your area';
  return `We will surface hosts near ${place} who match your diet and quiet-hours answers. Browse freely while we fine-tune suggestions.`;
}

/** @deprecated Use onboardingReadyCopy subtitle instead */
export function buildOnboardingReadySubtitle(destination: string): string {
  return `Your answers are in. We will suggest hosts and guides in ${destination}.`;
}
