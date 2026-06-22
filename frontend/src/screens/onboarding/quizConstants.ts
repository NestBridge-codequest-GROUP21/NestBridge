import { QuizQuestion } from './QuizPage';

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
    question: 'Which accommodations matter to you?',
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

export type QuizPageDefinition = QuizQuestion[];
