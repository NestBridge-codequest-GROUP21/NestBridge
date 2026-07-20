/**
 * Demo presentation layer for CodeQuest / pre-launch judging.
 *
 * Live API data wins when the backend returns real rows. When the database is
 * empty, the request errors, or the app is still loading, curated Ghana mock
 * content keeps every screen populated so judges see the deployed experience.
 *
 * Disable via EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=false before real production.
 */

import { isDemoFallbackEnabled } from '../config/demoMode';

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

/** Prefer live rows; when demo mode is on, append demo-only rows so every screen stays full. */
export function withDemoFallback<T>(
  live: T[],
  demo: T[],
  options?: DemoFallbackOptions & { idKey?: keyof T },
): T[] {
  if (!isDemoFallbackEnabled()) {
    return live;
  }
  if (live.length === 0) {
    return demo;
  }

  const idKey = String(options?.idKey ?? 'id');
  const liveKeys = new Set(
    live
      .map((item) => resolveMatchKey(item, idKey, options?.matchKey))
      .filter((key) => key.length > 0),
  );

  // Live rows with no usable identity keys cannot be safely merged — appending
  // demo would duplicate every contact/card (seen on SOS when contacts lack `id`).
  if (liveKeys.size === 0) {
    return live;
  }

  const extras = demo.filter((item) => {
    const key = resolveMatchKey(item, idKey, options?.matchKey);
    if (!key) {
      return false;
    }
    return !liveKeys.has(key);
  });

  return extras.length > 0 ? [...live, ...extras] : live;
}

/** Prefer a live value; otherwise show the demo default when fallback is enabled. */
export function withDemoFallbackValue<T>(
  live: T | null | undefined,
  demo: T,
  _options?: DemoFallbackOptions,
): T | null {
  if (!isDemoFallbackEnabled()) {
    return live !== null && live !== undefined ? live : null;
  }
  return live ?? demo;
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
