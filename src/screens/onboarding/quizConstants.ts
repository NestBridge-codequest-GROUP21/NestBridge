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

export type QuizPageDefinition = QuizQuestion[];
