import type { AccountProfileState } from '../types/accountProfile';
import type { MatchFindParams } from '../services/api';
import type { QuizAnswers } from '../screens/onboarding/QuizPage';
import {
  budgetApiParamsFromRange,
  seekerBudgetRangeFromProfile,
} from './budgetRanges';
import { normalizeCity } from './ghanaReference';

/** Approximate campus / city centres used for proximity scoring (WGS84). */
const PLACE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  accra: { lat: 5.6037, lng: -0.187 },
  kumasi: { lat: 6.6885, lng: -1.6244 },
  'cape coast': { lat: 5.1053, lng: -1.2466 },
  tamale: { lat: 9.4008, lng: -0.8393 },
  takoradi: { lat: 4.9016, lng: -1.7831 },
  tema: { lat: 5.6698, lng: -0.0166 },
  ho: { lat: 6.6009, lng: 0.4713 },
  sunyani: { lat: 7.3399, lng: -2.3268 },
  koforidua: { lat: 6.094, lng: -0.2591 },
  wa: { lat: 10.0601, lng: -2.5099 },
  bolgatanga: { lat: 10.7856, lng: -0.8514 },
  'university of ghana': { lat: 5.6504, lng: -0.187 },
  'kwame nkrumah university of science and technology': { lat: 6.6745, lng: -1.5716 },
  knust: { lat: 6.6745, lng: -1.5716 },
  'university of cape coast': { lat: 5.1155, lng: -1.2908 },
  ucc: { lat: 5.1155, lng: -1.2908 },
  'university for development studies': { lat: 9.4034, lng: -0.842 },
  uds: { lat: 9.4034, lng: -0.842 },
};

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  const single = asString(value);
  return single ? [single] : [];
}

export function quizAnswersFromProfile(
  profileState: AccountProfileState,
): QuizAnswers {
  return profileState.seekerSetup.data.quizAnswers ?? {};
}

/** Map quiz slider / stay vibe into algorithm lifestyle tokens. */
export function lifestylePreferenceFromQuiz(answers: QuizAnswers): string | undefined {
  const vibeRaw = answers.householdVibe ?? answers.stayVibe;
  if (typeof vibeRaw === 'number' && Number.isFinite(vibeRaw)) {
    if (vibeRaw <= 35) return 'quiet';
    if (vibeRaw >= 65) return 'social';
    return 'flexible';
  }
  const daily = asString(answers.dailyRhythm)?.toLowerCase();
  if (daily?.includes('early')) return 'quiet';
  if (daily?.includes('night')) return 'social';
  if (daily?.includes('flexible')) return 'flexible';
  return undefined;
}

export function dietaryRequirementsFromQuiz(answers: QuizAnswers): string[] {
  const dietary = asStringList(answers.dietary).filter(
    (item) => item.toLowerCase() !== 'none',
  );
  const allergies = asString(answers.foodAllergies);
  if (allergies && !dietary.some((item) => item.toLowerCase().includes('allerg'))) {
    dietary.push('Food allergies');
  }
  // Encode free-text allergies so the API hard-filter can treat them seriously.
  if (allergies) {
    dietary.push(`Allergy: ${allergies}`);
  }
  return dietary;
}

export function preferredLanguagesFromQuiz(answers: QuizAnswers): string[] {
  const spoken = asStringList(answers.languages);
  const practice = asString(answers.languagePractice);
  const merged = [...spoken];
  if (practice && practice.toLowerCase() !== 'none' && !merged.includes(practice)) {
    merged.push(practice);
  }
  return merged.length > 0 ? merged : ['English'];
}

export function culturalPreferenceFromQuiz(answers: QuizAnswers): string | undefined {
  const raw =
    asString(answers.hostCulturalBackground) ?? asString(answers.culturalPreference);
  if (!raw) return undefined;
  const lower = raw.toLowerCase();
  if (lower.includes('no preference') || lower.includes('open to any')) {
    return undefined;
  }
  return raw;
}

export function religionPreferenceFromQuiz(answers: QuizAnswers): string | undefined {
  const religion = asString(answers.religion);
  if (!religion || religion.toLowerCase().includes('prefer not')) {
    return undefined;
  }
  if (religion.toLowerCase() === 'other') {
    return asString(answers.religionOther) ?? religion;
  }
  return religion;
}

export function resolveMatchAnchorCoordinates(
  city: string | undefined,
  university: string | undefined,
): { universityLat?: number; universityLng?: number } {
  const uniKey = university?.trim().toLowerCase() ?? '';
  if (uniKey && PLACE_COORDINATES[uniKey]) {
    const point = PLACE_COORDINATES[uniKey];
    return { universityLat: point.lat, universityLng: point.lng };
  }
  const cityKey = city ? normalizeCity(city).toLowerCase() : '';
  if (cityKey && PLACE_COORDINATES[cityKey]) {
    const point = PLACE_COORDINATES[cityKey];
    return { universityLat: point.lat, universityLng: point.lng };
  }
  // Accra fallback only when no city — keeps proximity soft rather than zeroing.
  return { universityLat: 5.6037, universityLng: -0.187 };
}

/**
 * Build preference fields from the seeker’s saved quiz + travel profile.
 * Used by home matches and host search so scoring is not hardcoded.
 */
export function matchPreferenceParamsFromProfile(
  profileState: AccountProfileState,
): Pick<
  MatchFindParams,
  | 'preferredLanguages'
  | 'dietaryRequirements'
  | 'lifestylePreference'
  | 'culturalBackgroundPreference'
  | 'religionPreference'
  | 'universityLat'
  | 'universityLng'
  | 'minBudget'
  | 'maxBudget'
> {
  const data = profileState.seekerSetup.data;
  const answers = quizAnswersFromProfile(profileState);
  const budget = budgetApiParamsFromRange(seekerBudgetRangeFromProfile(profileState));
  const coords = resolveMatchAnchorCoordinates(data.city, data.university);

  return {
    ...budget,
    ...coords,
    preferredLanguages: preferredLanguagesFromQuiz(answers),
    dietaryRequirements: dietaryRequirementsFromQuiz(answers),
    lifestylePreference: lifestylePreferenceFromQuiz(answers),
    culturalBackgroundPreference: culturalPreferenceFromQuiz(answers),
    religionPreference: religionPreferenceFromQuiz(answers),
  };
}
