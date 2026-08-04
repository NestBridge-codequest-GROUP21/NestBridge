import type { AccountProfileState, PrimaryIntent } from '../types/accountProfile';
import { presetHomeDashboard } from '../utils/devTestingPresets';

/** Password for every seeded @nestbridge.app demo account (see V4 migration). */
export const DEMO_PASSWORD = 'password';

export function demoFirstName(fullName: string): string {
  return fullName.split(' ')[0]?.trim() || fullName.trim();
}

export function demoInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export interface DemoAccount {
  id: string;
  /** Short role label shown on buttons */
  label: string;
  /** Display name stored in the DB for this demo user */
  name: string;
  email: string;
  intent: PrimaryIntent;
  /** One line about what this demo account is useful for */
  description: string;
}

/** Complete profile preset for a seeded demo actor (Accra / UG context). */
export function demoPresetForAccount(account: DemoAccount): AccountProfileState {
  const base = presetHomeDashboard(account.intent);
  const identity = {
    displayName: account.name,
    bio: 'Exchange student exploring homestays and cultural experiences in Ghana.',
    about:
      'I am here for a semester exchange and want a respectful homestay where I can share meals, practice local customs, and feel part of family life in Ghana.',
    identityLocked: true as const,
  };
  const hostIdentity = {
    displayName: account.name,
    bio: 'NestBridge demo host sharing a welcoming home in Ghana.',
    about:
      'Seeded NestBridge demo host account for CodeQuest. Bio and about stay locked so students know who they are booking with.',
    identityLocked: true as const,
  };
  const guideIdentity = {
    displayName: account.name,
    bio: 'NestBridge demo guide offering cultural tours in Ghana.',
    about:
      'Seeded NestBridge demo guide account for CodeQuest. Bio and about stay locked so travelers know who they are meeting.',
    identityLocked: true as const,
  };
  return {
    ...base,
    seekerSetup: {
      ...base.seekerSetup,
      data: {
        city: 'Accra, Ghana',
        university: 'University of Ghana',
        arrivalDate: '2026-09-01',
        departureDate: '2026-12-15',
        ...identity,
      },
    },
    hostProvider:
      account.intent === 'HOST'
        ? { ...base.hostProvider, data: { ...base.hostProvider.data, ...hostIdentity } }
        : base.hostProvider,
    guideProvider:
      account.intent === 'GUIDE'
        ? { ...base.guideProvider, data: { ...base.guideProvider.data, ...guideIdentity } }
        : base.guideProvider,
  };
}

/**
 * Consumer demo actors (email/password Sign in; Quick tiles currently off).
 * Staff/ops: personal allowlisted Gmails only — no shared demo admin account.
 * Password for all: {@link DEMO_PASSWORD}
 */
export const DEMO_ACTOR_ACCOUNTS: DemoAccount[] = [
  {
    id: 'student',
    label: 'Student',
    name: 'Akosua Darko',
    email: 'akosua.demo@nestbridge.app',
    intent: 'STUDENT',
    description: 'Homestay search, bookings, messages, student events',
  },
  {
    id: 'tourist',
    label: 'Tourist',
    name: 'Zara Okonkwo',
    email: 'zara.tourist@nestbridge.app',
    intent: 'TOURIST',
    description: 'Explore Accra, guides, lodging, cultural content',
  },
  {
    id: 'host',
    label: 'Host family',
    name: 'Abena Mensah',
    email: 'abena.host@nestbridge.app',
    intent: 'HOST',
    description: 'Incoming stay requests, calendar, listings',
  },
  {
    id: 'guide',
    label: 'Local guide',
    name: 'Kofi Asante',
    email: 'kofi.guide@nestbridge.app',
    intent: 'GUIDE',
    description: 'Tour sessions, availability, guide bookings',
  },
];

/** All seeded consumer demo emails. */
export const ALL_DEMO_ACCOUNTS: DemoAccount[] = [...DEMO_ACTOR_ACCOUNTS];
