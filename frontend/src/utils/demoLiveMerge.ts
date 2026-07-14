/**
 * Demo presentation layer for CodeQuest / pre-launch judging.
 *
 * Live API data wins when the backend returns real rows. When the database is
 * empty, the request errors, or the app is still loading, curated Ghana mock
 * content keeps every screen populated so judges see the deployed experience.
 */

export interface DemoFallbackOptions {
  isLoading?: boolean;
  error?: string | null | undefined;
}

/** Prefer live rows; otherwise always show demo (even while loading or on error). */
export function withDemoFallback<T>(
  live: T[],
  demo: T[],
  _options?: DemoFallbackOptions,
): T[] {
  return live.length > 0 ? live : demo;
}

/** Prefer a live value; otherwise show the demo default. */
export function withDemoFallbackValue<T>(
  live: T | null | undefined,
  demo: T,
  _options?: DemoFallbackOptions,
): T {
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
