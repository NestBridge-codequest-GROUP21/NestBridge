import type { QuizAnswers } from '../screens/onboarding/QuizPage';

function asString(value: QuizAnswers[string]): string | null {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return null;
}

function asStringArray(value: QuizAnswers[string]): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.length > 0);
  }
  return [];
}

function formatList(items: string[], max = 2): string {
  return items.slice(0, max).join(' · ');
}

export function deriveMatchReasons(answers?: QuizAnswers | null, maxReasons = 3): string[] {
  if (!answers) {
    return [];
  }

  const reasons: string[] = [];

  const dietary = asStringArray(answers.dietary).filter((d) => d !== 'None');
  if (dietary.length > 0) {
    reasons.push(formatList(dietary.map((d) => `${d}-friendly`)));
  }

  const accommodations = asStringArray(answers.religiousAccommodations);
  if (accommodations.includes('Halal food only')) {
    reasons.push('Halal meals offered');
  }
  if (accommodations.includes('Quiet/prayer time respected')) {
    reasons.push('Quiet evenings');
  }

  const householdVibe = typeof answers.householdVibe === 'number' ? answers.householdVibe : null;
  if (householdVibe !== null && householdVibe <= 35) {
    reasons.push('Quiet household');
  } else if (householdVibe !== null && householdVibe >= 65) {
    reasons.push('Social household');
  }

  const dailyRhythm = asString(answers.dailyRhythm);
  if (dailyRhythm === 'Early riser') {
    reasons.push('Early riser friendly');
  }

  const languages = asStringArray(answers.languages).filter((l) => l !== 'Other');
  const languagesOther = asString(answers.languagesOther);
  const langDisplay = languagesOther ? [...languages, languagesOther] : languages;
  if (langDisplay.length > 0) {
    reasons.push(formatList(langDisplay));
  }

  const destination = asString(answers.destination);
  if (destination && reasons.length < maxReasons) {
    const cityPart = destination.split(',')[0]?.trim();
    if (cityPart) {
      reasons.push(`Near ${cityPart}`);
    }
  }

  return reasons.slice(0, maxReasons);
}

export function formatMatchSubtitle(answers?: QuizAnswers | null): string {
  const reasons = deriveMatchReasons(answers);
  if (reasons.length >= 2) {
    return reasons.join(' · ');
  }
  if (reasons.length === 1) {
    return reasons[0];
  }
  return 'Matched to your preferences';
}
