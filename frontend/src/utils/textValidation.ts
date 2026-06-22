const VOWEL_PATTERN = /[aeiouAEIOU]/;
const LONG_WORD_PATTERN = /\S{16,}/;
const REPEATED_CHAR_PATTERN = /(.)\1{4,}/;

/**
 * Returns true when text looks like a genuine answer (lenient — not a spell-check).
 * Flags obvious keyboard-mashing; when in doubt, returns true.
 */
export function isLikelyValidText(text: string): boolean {
  const trimmed = text.trim();

  if (trimmed.length < 3) {
    return false;
  }

  if (LONG_WORD_PATTERN.test(trimmed)) {
    return false;
  }

  if (trimmed.length > 4 && !VOWEL_PATTERN.test(trimmed)) {
    return false;
  }

  if (REPEATED_CHAR_PATTERN.test(trimmed)) {
    return false;
  }

  return true;
}
