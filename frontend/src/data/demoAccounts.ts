import type { PrimaryIntent } from '../types/accountProfile';

/** Password for every seeded @nestbridge.app demo account (see V4 migration). */
export const DEMO_PASSWORD = 'password';

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
 * Seeded backend users — one tap signs in with real DB data (bookings, messages, etc.).
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
