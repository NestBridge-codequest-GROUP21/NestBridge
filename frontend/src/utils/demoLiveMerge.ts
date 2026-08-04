/**
 * Demo presentation layer for CodeQuest / pre-launch judging.
 *
 * - {@link withCatalogFallback} / {@link withDemoFallback} — fill gaps with
 *   bundled mock/catalog rows only for seeded demo actor accounts when the
 *   global flag is on. Real Create Account users see live API data only
 *   (or genuine empty / error states).
 * - {@link withProductCatalogFallback} — always-available product safety
 *   content (e.g. Ghana emergency numbers). Not fake personal data.
 *
 * Global kill switch: EXPO_PUBLIC_ENABLE_DEMO_FALLBACK=false
 * Per-account gate: shouldUseDemoFallbackForAccount(email)
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

function mergeCatalogRows<T>(
  live: T[],
  catalog: T[],
  options?: DemoFallbackOptions & { idKey?: keyof T },
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

/**
 * Prefer live rows; fill from bundled catalog only for demo actors.
 * Real accounts get live API rows only (empty when the API returns empty).
 */
export function withCatalogFallback<T>(
  live: T[],
  catalog: T[],
  options?: DemoFallbackOptions & { idKey?: keyof T },
): T[] {
  if (!isFallbackActive(options)) {
    return live;
  }
  return mergeCatalogRows(live, catalog, options);
}

/** Prefer a live item; otherwise use bundled catalog only for demo actors. */
export function withCatalogFallbackValue<T>(
  live: T | null | undefined,
  catalog: T,
  options?: DemoFallbackOptions,
): T | null {
  if (live !== null && live !== undefined) {
    return live;
  }
  if (!isFallbackActive(options)) {
    return null;
  }
  return catalog;
}

/**
 * Prefer live rows; always fill gaps from product catalog (safety content).
 * Use only for non-personal constants like national emergency numbers.
 */
export function withProductCatalogFallback<T>(
  live: T[],
  catalog: T[],
  options?: Omit<DemoFallbackOptions, 'accountEmail'> & { idKey?: keyof T },
): T[] {
  return mergeCatalogRows(live, catalog, options);
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
  return mergeCatalogRows(live, demo, options);
}

/** Prefer a live value; otherwise show the demo default for demo actors only. */
export function withDemoFallbackValue<T>(
  live: T | null | undefined,
  demo: T,
  options?: DemoFallbackOptions,
): T | null {
  return withCatalogFallbackValue(live, demo, options);
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
  let digits = value.replace(/[^\d]/g, '');
  // Ghana local 0XXXXXXXXX → 233XXXXXXXXX
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = `233${digits.slice(1)}`;
  }
  // Drop a leading + country trunk already captured as digits-only.
  return digits;
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
