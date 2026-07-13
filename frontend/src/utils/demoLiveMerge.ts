/**
 * Prefer live API data; when the request succeeded but returned nothing, show
 * curated demo content so local demos still feel populated.
 */
export function withDemoFallback<T>(
  live: T[],
  demo: T[],
  options: { isLoading: boolean; error: string | null | undefined },
): T[] {
  if (options.isLoading || options.error) {
    return live;
  }
  return live.length > 0 ? live : demo;
}
