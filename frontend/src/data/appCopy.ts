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
  homestay: 'Add your travel details to send a booking request.',
  guide: 'Add your travel details to book a guide session.',
};

export const emptyStates = {
  hostRequests: {
    title: 'No requests yet',
    body: 'When a student matches your home, they will show up here. Keep your listing details fresh so matches find you.',
  },
  guideRequests: {
    title: 'No session requests yet',
    body: 'When a traveller books a tour with you, it will appear here.',
  },
  hostBookings: {
    title: 'No confirmed stays yet',
    body: 'When guests pay for an accepted request, their stay will appear here on your calendar.',
  },
  guideBookings: {
    title: 'No upcoming tours',
    body: 'Confirmed and paid sessions will show here with date, time, and guest details.',
  },
  guideEarnings: {
    title: 'No earnings yet',
    body: 'Completed and confirmed tours will appear here with payout breakdown.',
  },
  hostEarnings: {
    title: 'No payouts yet',
    body: 'When guests pay for confirmed stays, escrow releases to this screen after check-in.',
  },
  messages: {
    title: 'No messages yet',
    body: 'When you message a host, guide, or guest, conversations will appear here.',
  },
  discoveryHosts: (city: string) => ({
    title: `No homestays in ${city} yet`,
    body: 'We are onboarding more host families in this area. Try Accra or Kumasi, or check back soon.',
  }),
  discoveryGuides: (city: string) => ({
    title: `No guides in ${city} yet`,
    body: 'New guides join every week. Browse Accra listings or widen your search.',
  }),
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
