/**
 * Cross-screen copy — warm Ghana/Accra voice, single source for reusable phrases.
 */

import type { PrimaryIntent } from '../types/accountProfile';
import { PRIMARY_INTENT_LABELS } from '../types/accountProfile';

export const splashCopy = {
  tagline: 'From Arrival to Belonging.',
  continueHint: 'Tap to continue',
};

export const welcomeCopy = {
  headline: 'Host families, local guides, and places to stay — starting in Ghana.',
  subheadline:
    'Land in Accra with a host family, a local guide, or a room near campus — all from one login.',
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
};

export const validationCopy = {
  placeInvalid:
    "Check the spelling — try 'Wa' or 'Wa, Upper West'.",
  otherRequired: 'Tell us which one — a few words is enough.',
};

export function buildMatchHint(university?: string, city?: string): string {
  const place = university?.trim() || city?.trim() || 'your area';
  return `We will surface hosts near ${place} who match your diet and quiet-hours answers. Browse freely while we fine-tune suggestions.`;
}

export function buildOnboardingReadySubtitle(destination: string): string {
  return `Your answers are in. We will suggest hosts and guides in ${destination}.`;
}

export interface OnboardingReadyCopyContext {
  destination?: string;
  university?: string;
  city?: string;
}

export interface OnboardingReadyCopy {
  subtitle: string;
  matchHint: string;
  ctaLabel: string;
  roleLabel?: string;
}

export function onboardingReadyCopy(
  intent: PrimaryIntent,
  ctx: OnboardingReadyCopyContext = {},
): OnboardingReadyCopy {
  const destination = ctx.destination?.trim() || ctx.city?.trim() || 'your destination';

  if (intent === 'HOST') {
    return {
      subtitle: 'Your host listing is saved. Students can now discover your home.',
      matchHint:
        'Incoming homestay requests will appear on your dashboard. Keep your listing details up to date.',
      ctaLabel: 'Go to your dashboard',
      roleLabel: PRIMARY_INTENT_LABELS.HOST,
    };
  }

  if (intent === 'GUIDE') {
    return {
      subtitle: 'Your guide profile is saved. Travellers can book sessions with you.',
      matchHint:
        'Session requests will appear on your dashboard. Add tour types to stand out.',
      ctaLabel: 'Go to your dashboard',
      roleLabel: PRIMARY_INTENT_LABELS.GUIDE,
    };
  }

  return {
    subtitle: buildOnboardingReadySubtitle(destination),
    matchHint: buildMatchHint(ctx.university, ctx.city),
    ctaLabel: `Explore ${destination}`,
    roleLabel: PRIMARY_INTENT_LABELS[intent],
  };
}
