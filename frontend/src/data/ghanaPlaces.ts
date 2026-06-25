/** Known Ghana cities and towns — includes short names that fail generic length checks. */
export const GHANA_PLACES = [
  'accra',
  'kumasi',
  'tamale',
  'cape coast',
  'takoradi',
  'sekondi',
  'sunyani',
  'wa',
  'ho',
  'bolgatanga',
  'koforidua',
  'techiman',
  'tema',
  'legon',
  'east legon',
  'cantonments',
  'madina',
  'osu',
  'labadi',
  'adenta',
  'achimota',
  'dansoman',
  'spintex',
  'airport residential',
  'north legon',
] as const;

export function normalizePlaceToken(text: string): string {
  return text.trim().toLowerCase();
}

export function isKnownGhanaPlace(text: string): boolean {
  const normalized = normalizePlaceToken(text);
  if (GHANA_PLACES.includes(normalized as (typeof GHANA_PLACES)[number])) {
    return true;
  }
  const firstPart = normalized.split(',')[0]?.trim() ?? '';
  return GHANA_PLACES.includes(firstPart as (typeof GHANA_PLACES)[number]);
}
