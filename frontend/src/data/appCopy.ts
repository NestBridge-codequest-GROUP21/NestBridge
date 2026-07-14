/**
 * Cross-screen copy — warm Ghana/Accra voice, single source for reusable phrases.
 */

import type { PrimaryIntent, SetupTrack } from '../types/accountProfile';
import { PRIMARY_INTENT_LABELS } from '../types/accountProfile';
import type { OnboardingNextStep } from '../components/OnboardingNextStepsCard';
import type { FeatureHighlight } from '../components/FeatureHighlightRow';

export const splashCopy = {
  tagline: 'From Arrival to Belonging.',
  continueHint: 'Tap to continue',
};

export const welcomeCopy = {
  headline: 'Host families, local guides, and places to stay — starting in Ghana.',
  subheadline:
    'Create an account with any email — demo accounts are optional shortcuts only.',
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
    tip: 'Tip: hosts in East Legon often get the first inquiries before semester starts.',
  },
  guideRequests: {
    title: 'No session requests yet',
    body: 'When a traveller books a tour with you, it will appear here.',
    tip: 'Tip: add a heritage walk or campus orientation to stand out.',
  },
  hostBookings: {
    title: 'No confirmed stays yet',
    body: 'When guests pay for an accepted request, their stay will appear here on your calendar.',
    tip: 'Tip: respond quickly to pending requests to fill your calendar.',
  },
  guideBookings: {
    title: 'No upcoming tours',
    body: 'Confirmed and paid sessions will show here with date, time, and guest details.',
    tip: 'Tip: keep your availability updated so travellers can book you.',
  },
  guideEarnings: {
    title: 'No earnings yet',
    body: 'Completed and confirmed tours will appear here with payout breakdown.',
    tip: 'Tip: payouts reflect session rate minus the platform fee.',
  },
  hostEarnings: {
    title: 'No payouts yet',
    body: 'When guests pay for confirmed stays, escrow releases to this screen after check-in.',
    tip: 'Tip: respond quickly to homestay requests to fill your calendar.',
  },
  messages: {
    title: 'No messages yet',
    body: 'When you message a host, guide, or guest, conversations will appear here.',
    tip: 'Tip: open a host or guide profile and tap Message to start chatting.',
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
  subtitle: 'Jump into flows without completing real onboarding. Dev builds only.',
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
  destination?: string;
  university?: string;
  city?: string;
}

export interface OnboardingReadyCopy {
  subtitle: string;
  heroIcon: string;
  nextSteps: OnboardingNextStep[];
  featureHighlights: FeatureHighlight[];
  ctaLabel: string;
  secondaryCtaLabel: string;
  roleLabel?: string;
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

  if (intent === 'HOST') {
    return {
      subtitle:
        'Your answers are in. We will connect you with students who are the right fit for your home.',
      heroIcon: '🏠',
      nextSteps: [
        {
          icon: '🤝',
          title: 'We match you with students',
          body: 'We recommend students who align with your home and preferences.',
        },
        {
          icon: '💬',
          title: 'Review and connect',
          body: 'Chat with interested students before you accept a request.',
        },
        {
          icon: '🛡️',
          title: 'Safe and supported',
          body: 'Every student is verified before they can request a stay.',
        },
      ],
      featureHighlights: [
        { icon: '🎯', label: 'Great matches' },
        { icon: '😌', label: 'Peace of mind' },
        { icon: '🤲', label: 'Support' },
        { icon: '💛', label: 'Meaningful connections' },
      ],
      ctaLabel: 'View incoming requests',
      secondaryCtaLabel: 'Save profile and explore later',
      roleLabel: PRIMARY_INTENT_LABELS.HOST,
    };
  }

  if (intent === 'GUIDE') {
    return {
      subtitle:
        'Your answers are in. We will connect you with travellers looking for amazing tours.',
      heroIcon: '🗺️',
      nextSteps: [
        {
          icon: '📩',
          title: 'We find tour opportunities',
          body: 'See travellers looking for experiences you offer.',
        },
        {
          icon: '📆',
          title: 'Manage your tours',
          body: 'Set availability, prices, and tour preferences.',
        },
        {
          icon: '⭐',
          title: 'Grow your reputation',
          body: 'Collect reviews and build trust with every session.',
        },
      ],
      featureHighlights: [
        { icon: '📈', label: 'More bookings' },
        { icon: '🕐', label: 'Flexible' },
        { icon: '✅', label: 'Trusted platform' },
        { icon: '🌍', label: 'Make an impact' },
      ],
      ctaLabel: 'Explore tour requests',
      secondaryCtaLabel: 'Save profile and explore later',
      roleLabel: PRIMARY_INTENT_LABELS.GUIDE,
    };
  }

  if (intent === 'TOURIST') {
    return {
      subtitle:
        'Your answers are in. We will suggest top-rated guides and experiences just for you.',
      heroIcon: '📸',
      nextSteps: [
        {
          icon: '🗺️',
          title: 'We find the best guides',
          body: 'Get recommendations for trusted local guides in your destination.',
        },
        {
          icon: '✨',
          title: 'Curated experiences',
          body: 'Browse tours, food walks, and must-see places nearby.',
        },
        {
          icon: '🛡️',
          title: 'Safe and reliable',
          body: 'All guides are verified and reviewed by other travellers.',
        },
      ],
      featureHighlights: [
        { icon: '⭐', label: 'Top rated' },
        { icon: '💡', label: 'Local insights' },
        { icon: '🔒', label: 'Secure and safe' },
        { icon: '🎒', label: 'Adventure made easy' },
      ],
      ctaLabel: 'Explore experiences',
      secondaryCtaLabel: 'Save profile and explore later',
      roleLabel: PRIMARY_INTENT_LABELS.TOURIST,
    };
  }

  return {
    subtitle: `Your answers are in. We will suggest host families that match your lifestyle and study needs in ${destination}.`,
    heroIcon: '🎓',
    nextSteps: [
      {
        icon: '🏠',
        title: 'We find your best matches',
        body: 'Surface host families by your preferences and location.',
      },
      {
        icon: '✨',
        title: 'Personalised recommendations',
        body: 'Matches improve as you explore and update your profile.',
      },
      {
        icon: '🛡️',
        title: 'Safe and verified homes',
        body: 'All host families are verified before listing.',
      },
    ],
    featureHighlights: [
      { icon: '🤗', label: 'Welcoming' },
      { icon: '🎯', label: 'Smart matches' },
      { icon: '✅', label: 'Trusted' },
      { icon: '🚀', label: 'Start your journey' },
    ],
    ctaLabel: 'Explore your matches',
    secondaryCtaLabel: 'Save profile and explore later',
    roleLabel: PRIMARY_INTENT_LABELS.STUDENT,
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
