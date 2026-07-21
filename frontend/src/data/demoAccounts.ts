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

/**
 * Seeded staff account — use Staff sign-in or email/password only.
 * Never include in Quick sign-in tiles (anyone with the APK could one-tap into ops).
 */
export const DEMO_STAFF_ACCOUNT: DemoAccount = {
  id: 'staff',
  label: 'Staff',
  name: 'NestBridge Staff',
  email: 'admin@nestbridge.app',
  intent: 'TOURIST',
  description: 'Ops dashboard — Staff sign-in with email/password only',
};

/** Complete seeker profile preset for a seeded demo actor (Accra / UG context). */
export function demoPresetForAccount(account: DemoAccount): AccountProfileState {
  const base = presetHomeDashboard(account.intent);
  return {
    ...base,
    seekerSetup: {
      ...base.seekerSetup,
      data: {
        city: 'Accra, Ghana',
        university: 'University of Ghana',
        arrivalDate: '2026-09-01',
        departureDate: '2026-12-15',
        displayName: account.name,
        bio: 'Exchange student exploring homestays and cultural experiences in Ghana.',
      },
    },
  };
}

/**
 * Consumer demo actors for Quick sign-in on the post-splash Welcome screen only.
 * Staff is intentionally omitted — ops access is via Staff sign-in only.
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

/** All seeded demo emails (consumer actors + staff). */
export const ALL_DEMO_ACCOUNTS: DemoAccount[] = [
  DEMO_STAFF_ACCOUNT,
  ...DEMO_ACTOR_ACCOUNTS,
];
