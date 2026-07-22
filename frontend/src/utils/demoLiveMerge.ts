/**
 * Demo presentation layer for CodeQuest / pre-launch judging.
 *
 * Two merge modes:
 * - {@link withCatalogFallback} — platform content for every signed-in user
 *   (videos, tourist sites, transport, landmarks, checklist, emergency numbers).
 *   Live API wins; catalog fills gaps.
 * - {@link withDemoFallback} — location-personalized or personal rows (lodging
 *   partners, explore stays, bookings, messages, notifications, match
 *   hosts/guides, provider inbox). Only for seeded demo actor accounts when
 *   the global flag is on; real accounts see genuine empty states.
 *
 * Global kill switch: EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=false
 * Per-account gate (demo merge only): shouldUseDemoFallbackForAccount(email)
 */

import { shouldUseDemoFallbackForAccount } from '../config/demoMode';

export interface DemoFallbackOptions {
  isLoading?: boolean;
  error?: string | null | undefined;
  /** Property used to identity-match live vs demo rows (default: `id`). */
  idKey?: string;
  /**
   * Custom identity key. Prefer this when live IDs (UUIDs) differ from demo
   * keys, or when rows have no `id` (e.g. emergency contacts by phone).
   */
  matchKey?: (item: unknown) => string;
  /**
   * Email of the signed-in account. When omitted, uses the session email
   * bound via {@link bindDemoFallbackSession}.
   */
  accountEmail?: string | null;
}

/** Session email for withDemoFallback callers that cannot thread email through. */
let sessionAccountEmail: string | null | undefined;

/** Call from the signed-in shell whenever the auth user changes. */
export function bindDemoFallbackSession(email: string | null | undefined): void {
  sessionAccountEmail = email;
}

function isFallbackActive(options?: DemoFallbackOptions): boolean {
  const email =
    options?.accountEmail !== undefined
      ? options.accountEmail
      : sessionAccountEmail;
  return shouldUseDemoFallbackForAccount(email);
}

function resolveMatchKey<T>(
  item: T,
  idKey: string,
  matchKey?: (item: unknown) => string,
): string {
  if (matchKey) {
    return matchKey(item).trim();
  }
  const value = (item as Record<string, unknown>)[idKey];
  return value != null ? String(value).trim() : '';
}

/** Prefer live rows; when empty/partial, fill with app catalog content for every user. */
export function withCatalogFallback<T>(
  live: T[],
  catalog: T[],
  options?: Omit<DemoFallbackOptions, 'accountEmail'> & { idKey?: keyof T },
): T[] {
  if (live.length === 0) {
    return catalog;
  }

  const idKey = String(options?.idKey ?? 'id');
  const liveKeys = new Set(
    live
      .map((item) => resolveMatchKey(item, idKey, options?.matchKey))
      .filter((key) => key.length > 0),
  );

  if (liveKeys.size === 0) {
    return live;
  }

  const extras = catalog.filter((item) => {
    const key = resolveMatchKey(item, idKey, options?.matchKey);
    if (!key) {
      return false;
    }
    return !liveKeys.has(key);
  });

  return extras.length > 0 ? [...live, ...extras] : live;
}

/** Prefer a live catalog item; otherwise use the bundled catalog entry for every user. */
export function withCatalogFallbackValue<T>(
  live: T | null | undefined,
  catalog: T,
): T | null {
  return live ?? catalog;
}

/** Prefer live rows; only for demo actors, append demo-only rows when empty/partial. */
export function withDemoFallback<T>(
  live: T[],
  demo: T[],
  options?: DemoFallbackOptions & { idKey?: keyof T },
): T[] {
  if (!isFallbackActive(options)) {
    return live;
  }
  return withCatalogFallback(live, demo, options);
}

/** Prefer a live value; otherwise show the demo default for demo actors only. */
export function withDemoFallbackValue<T>(
  live: T | null | undefined,
  demo: T,
  options?: DemoFallbackOptions,
): T | null {
  if (!isFallbackActive(options)) {
    return live !== null && live !== undefined ? live : null;
  }
  return withCatalogFallbackValue(live, demo);
}

export function isPresentingDemoData<T>(live: T[], display: T[]): boolean {
  return live.length === 0 && display.length > 0;
}

/** Hide spinners when demo content is already on screen. */
export function presentableLoading(
  isLoading: boolean,
  live: unknown[],
  display: unknown[],
): boolean {
  return isLoading && !isPresentingDemoData(live, display);
}

/** Hide API error banners when demo content is covering the gap. */
export function presentableError(
  error: string | null | undefined,
  live: unknown[],
  display: unknown[],
): string | null {
  if (!error) {
    return null;
  }
  return isPresentingDemoData(live, display) ? null : error;
}

/** Normalize phone/SMS dial strings for uniqueness checks. */
export function normalizeContactNumber(value: string): string {
  return value.replace(/[^\d+]/g, '');
}

/** Keep the first contact for each normalized phone number. */
export function uniqueByContactNumber<T extends { number: string }>(
  contacts: T[],
): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const contact of contacts) {
    const key = normalizeContactNumber(contact.number);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(contact);
  }
  return unique;
}

/** Keep the first item for each match key. */
export function uniqueByKey<T>(items: T[], matchKey: (item: T) => string): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const item of items) {
    const key = matchKey(item).trim().toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }
  return unique;
}
