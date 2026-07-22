import type { QuizOption } from '../screens/onboarding/CulturalQuizScreen';
import { buildMatchHint, splashCopy, welcomeCopy, intentSelectCopy } from './appCopy';
import { demoStudentFirstName } from './studentHomeMock';
import { destinationPlaceholderExamples } from './ghanaReference';

export interface RoleOption {
  id: string;
  label: string;
  description: string;
}

export const splashMock = {
  appName: 'NestBridge',
  motto: splashCopy.tagline,
  description: splashCopy.description,
};

export const welcomeMock = {
  appName: 'NestBridge',
  headline: welcomeCopy.headline,
  subheadline: welcomeCopy.subheadline,
  valuePills: welcomeCopy.valuePills,
  tagline: splashCopy.tagline,
};

export const intentSelectMock = {
  title: 'What brings you here?',
  subtitle: 'Pick what matters most right now — your home screen will reflect it.',
  noteTitle: intentSelectCopy.noteTitle,
  noteBody: intentSelectCopy.noteBody,
};

export const roleOptions: RoleOption[] = [
  {
    id: 'student',
    label: 'Student / Traveler',
    description: 'Find a host family, book stays, and message hosts',
  },
  {
    id: 'host',
    label: 'Host Family',
    description: 'Open your home to international students',
  },
  {
    id: 'guide',
    label: 'Cultural Guide',
    description: 'Offer tours, heritage walks, and local experiences',
  },
  {
    id: 'tourist',
    label: 'Tourist',
    description: 'Explore sites, book guides, and find lodging',
  },
];

export const registerMock = {
  title: 'Create your account',
  subtitle: 'One sign-up — book stays, guides, and lodging whenever you need.',
};

export const loginMock = {
  title: 'Welcome back',
  subtitle: 'Sign in to pick up where you left off.',
};

export const destinationMock = {
  title: 'Where are you headed?',
  subtitle: 'We use this to show hosts and guides near your campus or city.',
  cityPlaceholder: `e.g. ${destinationPlaceholderExamples()}, Ho, Wa`,
};

export const profileSetupMock = {
  title: 'Introduce yourself',
  subtitle:
    'Your short bio and about section are locked once saved — that is how others decide who they are meeting.',
};

export const onboardingReadyMock = {
  userName: demoStudentFirstName,
  matchHint: buildMatchHint('University of Ghana', 'Accra'),
};

export interface QuizQuestion {
  id: string;
  question: string;
  helperText: string;
  options: QuizOption[];
}

export const culturalQuizQuestions: QuizQuestion[] = [
  {
    id: 'diet',
    question: 'Do you have any dietary preferences?',
    helperText: 'Hosts can filter for halal, vegetarian, and other needs.',
    options: [
      { id: 'none', label: 'No restrictions' },
      { id: 'halal', label: 'Halal' },
      { id: 'vegetarian', label: 'Vegetarian' },
      { id: 'vegan', label: 'Vegan' },
    ],
  },
  {
    id: 'study',
    question: 'What matters most in your living space?',
    helperText: 'We prioritize homes that fit your daily rhythm.',
    options: [
      { id: 'quiet', label: 'Quiet study environment' },
      { id: 'social', label: 'Social, family atmosphere' },
      { id: 'independent', label: 'Private room and independence' },
      { id: 'flexible', label: 'Flexible — open to either' },
    ],
  },
  {
    id: 'language',
    question: 'Which languages do you speak comfortably?',
    helperText: 'Helps us match you with people you can talk to easily.',
    options: [
      { id: 'english', label: 'English only' },
      { id: 'english-french', label: 'English and French' },
      { id: 'english-local', label: 'English plus local language learner' },
      { id: 'multilingual', label: 'Multilingual' },
    ],
  },
  {
    id: 'curfew',
    question: 'How do you feel about house rules?',
    helperText: 'Honest answers lead to better stays.',
    options: [
      { id: 'strict', label: 'Clear rules and curfews' },
      { id: 'moderate', label: 'Moderate rules are fine' },
      { id: 'relaxed', label: 'Relaxed, independent schedule' },
      { id: 'discuss', label: 'Happy to discuss with host' },
    ],
  },
  {
    id: 'duration',
    question: 'How long is your stay?',
    helperText: 'Some hosts prefer short visits; others prefer a full term.',
    options: [
      { id: 'short', label: 'Under 2 weeks' },
      { id: 'month', label: 'About a month' },
      { id: 'semester', label: 'Full semester' },
      { id: 'year', label: 'Academic year or longer' },
    ],
  },
];

export const ONBOARDING_TOTAL_STEPS = 4;
