import {
  CITY_OTHER_OPTION,
  destinationCityOptions,
  destinationCityOptionsWithOther,
  isCityOtherOption,
} from '../../data/ghanaReference';
import { QuizQuestion, type QuizAnswers } from './QuizPage';

export const GHANA_CITY_OPTIONS = destinationCityOptions();

/** Capitals + “Other area (not listed)” for city / operating-area questions. */
export const GHANA_CITY_OPTIONS_WITH_OTHER = destinationCityOptionsWithOther();

export { CITY_OTHER_OPTION, isCityOtherOption };

export const LANGUAGE_OPTIONS = [
  'English',
  'French',
  'Twi',
  'Arabic',
  'Hausa',
  'Other',
];

export const DIETARY_OPTIONS = [
  'Halal',
  'Vegan',
  'Vegetarian',
  'Kosher',
  'Gluten-free',
  'Food allergies',
  'None',
];

export const QUIET_SOCIAL_LABELS = { min: 'Very quiet', max: 'Very social' };

export const RELIGION_OPTIONS = ['Islam', 'Christianity', 'Other', 'Prefer not to say'];

export const PREFER_NOT_TO_SAY = 'Prefer not to say';

export const OTHER_OPTION_LABELS = ['Other', 'Other (specify)'] as const;

export function isOtherOption(label: string): boolean {
  return (
    (OTHER_OPTION_LABELS as readonly string[]).includes(label) ||
    isCityOtherOption(label)
  );
}

const PLACE_OTHER_FIELD_IDS = new Set([
  'city',
  'destination',
  'operatingAreas',
]);

/**
 * Replace “Other area” sentinels with the typed place name before persisting quiz answers.
 */
export function resolvePlaceOtherAnswers(answers: QuizAnswers): QuizAnswers {
  const next: QuizAnswers = { ...answers };

  for (const fieldId of PLACE_OTHER_FIELD_IDS) {
    const value = next[fieldId];
    const specify = next[otherSpecifyKey(fieldId)];
    const specifyText =
      typeof specify === 'string' && specify.trim().length > 0
        ? specify.trim()
        : '';

    if (typeof value === 'string' && isCityOtherOption(value) && specifyText) {
      next[fieldId] = specifyText;
      continue;
    }

    if (Array.isArray(value) && specifyText) {
      next[fieldId] = value.map((item) =>
        isCityOtherOption(item) ? specifyText : item,
      );
    }
  }

  return next;
}

export function otherSpecifyKey(questionId: string): string {
  return `${questionId}Other`;
}

export const RELIGION_ACCOMMODATION_OPTIONS = [
  'Halal food only',
  'Quiet/prayer time respected',
  'Dedicated prayer space helpful',
  'No specific accommodation needed',
  'Other (specify)',
];

export function createReligiousAccommodationsFollowUp(): QuizQuestion {
  return {
    id: 'religiousAccommodations',
    question: 'Which religious accommodations matter for your stay?',
    type: 'multi-select',
    options: RELIGION_ACCOMMODATION_OPTIONS,
    required: true,
    showWhen: {
      fieldId: 'religion',
      notEquals: PREFER_NOT_TO_SAY,
      hideWhenEmpty: true,
    },
  };
}

export function createReligionOtherFollowUp(fieldId = 'religion'): QuizQuestion {
  return {
    id: 'religionOther',
    question: 'Which religion or tradition?',
    type: 'text',
    placeholder: 'e.g. Traditional African, Hindu, Baháʼí',
    required: true,
    showWhen: {
      fieldId,
      equals: 'Other',
    },
  };
}

export type QuizPageDefinition = QuizQuestion[];
