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
  const idKey = options?.idKey ?? ('id' as keyof T);
  const liveIds = new Set(
    live.map((item) => {
      const value = item[idKey];
      return value != null ? String(value) : '';
    }),
  );
  const extras = demo.filter((item) => {
    const value = item[idKey];
    if (value == null) {
      return true;
    }
    return !liveIds.has(String(value));
  });
  return extras.length > 0 ? [...live, ...extras] : live;
}

/** Prefer a live value; otherwise show the demo default when fallback is enabled. */
export function withDemoFallbackValue<T>(
  live: T | null | undefined,
  demo: T,
  _options?: DemoFallbackOptions,
): T {
  if (!isDemoFallbackEnabled()) {
    return (live !== null && live !== undefined ? live : demo) as T;
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
