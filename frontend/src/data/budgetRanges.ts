import type { AccountProfileState } from '../types/accountProfile';
import type { MatchResult } from '../services/api';

/** Open ceiling for “Above GHS 350” and widen searches. */
export const BUDGET_OPEN_MAX = 99999;

export type SeekerBudgetRange = {
  label: string;
  min: number;
  /** Inclusive max. Use BUDGET_OPEN_MAX for open-ended. */
  max: number;
};

/** Must match StudentQuizScreen / TouristQuizScreen budget options exactly. */
export const SEEKER_BUDGET_RANGES: readonly SeekerBudgetRange[] = [
  { label: 'Under GHS 100', min: 0, max: 99 },
  { label: 'GHS 100-200', min: 100, max: 200 },
  { label: 'GHS 200-350', min: 200, max: 350 },
  { label: 'Above GHS 350', min: 351, max: BUDGET_OPEN_MAX },
] as const;

/** API hard-filter fields for a quiz band. Open-ended sides are omitted. */
export function budgetApiParamsFromRange(
  range: SeekerBudgetRange | null,
): { minBudget?: number; maxBudget?: number } {
  if (!range) return {};
  return {
    ...(range.min > 0 ? { minBudget: range.min } : {}),
    ...(range.max < BUDGET_OPEN_MAX ? { maxBudget: range.max } : {}),
  };
}

/** Parse "GHS 180/night" style labels used in demo host cards. */
export function parsePriceAmount(label: string | null | undefined): number | null {
  if (!label) return null;
  const match = label.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

export function quizBudgetLabelFromProfile(
  profileState: AccountProfileState,
): string | null {
  const raw = profileState.seekerSetup.data.quizAnswers?.budget;
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null;
}

export function seekerBudgetRangeFromLabel(
  label: string | null | undefined,
): SeekerBudgetRange | null {
  if (!label) return null;
  const normalized = label.trim().toLowerCase();
  return (
    SEEKER_BUDGET_RANGES.find((range) => range.label.toLowerCase() === normalized) ??
    null
  );
}

export function seekerBudgetRangeFromProfile(
  profileState: AccountProfileState,
): SeekerBudgetRange | null {
  return seekerBudgetRangeFromLabel(quizBudgetLabelFromProfile(profileState));
}

export function formatBudgetRangeLabel(range: SeekerBudgetRange): string {
  return range.label;
}

/** Price fits the inclusive quiz band. Null/unknown prices are excluded from preferred band. */
export function priceInBudgetRange(
  price: number | null | undefined,
  range: SeekerBudgetRange | null,
): boolean {
  if (!range) return true;
  if (price == null || !Number.isFinite(price)) return false;
  return price >= range.min && price <= range.max;
}

export function filterMatchesByBudget(
  matches: MatchResult[],
  range: SeekerBudgetRange | null,
): MatchResult[] {
  if (!range) return matches;
  return matches.filter((match) => priceInBudgetRange(match.pricePerNight, range));
}

export function matchSearchDefaultsFromBudget(
  range: SeekerBudgetRange | null,
): { budgetMin: number; budgetMax: number } {
  if (!range) {
    return { budgetMin: 100, budgetMax: 200 };
  }
  return {
    budgetMin: range.min,
    budgetMax: range.max,
  };
}
