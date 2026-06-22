import type { RoleOption } from '../screens/auth/WelcomeScreen';
import type { QuizOption } from '../screens/onboarding/CulturalQuizScreen';

export const splashMock = {
  appName: 'NestBridge',
  tagline: 'Bridging Places · Building Homes',
  subtitle: 'Group 21 · CodeQuest 2026',
};

export const welcomeMock = {
  appName: 'NestBridge',
  headline: 'Connect with host families, cultural guides & explore Africa',
  subheadline: 'Find your home away from home with culturally intelligent matching.',
};

export const roleOptions: RoleOption[] = [
  {
    id: 'student',
    label: 'Student / Traveler',
    description: 'Find host families, book stays & message hosts',
    icon: '🎓',
  },
  {
    id: 'host',
    label: 'Host Family',
    description: 'Open your home to international students',
    icon: '🏠',
  },
  {
    id: 'guide',
    label: 'Cultural Guide',
    description: 'Offer tours, heritage walks & local experiences',
    icon: '🗺️',
  },
  {
    id: 'tourist',
    label: 'Tourist',
    description: 'Explore sites, book guides & find lodging',
    icon: '✈️',
  },
];

export const registerMock = {
  title: 'Create your account',
  subtitle: 'One quick signup — then we personalize your matching profile.',
};

export const destinationMock = {
  title: 'Where are you headed?',
  subtitle: "We'll use this to surface host families near your campus or study area.",
};

export const profileSetupMock = {
  title: 'Introduce yourself',
  subtitle: 'A friendly profile helps hosts feel confident welcoming you.',
};

export const onboardingReadyMock = {
  matchHint: 'Your first matches are being prepared based on your cultural preferences quiz.',
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
      { id: 'none', label: 'No restrictions', icon: '🍽️' },
      { id: 'halal', label: 'Halal', icon: '🥘' },
      { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
      { id: 'vegan', label: 'Vegan', icon: '🌱' },
    ],
  },
  {
    id: 'study',
    question: 'What matters most in your living space?',
    helperText: "We'll prioritize hosts whose home fits your daily rhythm.",
    options: [
      { id: 'quiet', label: 'Quiet study environment', icon: '📚' },
      { id: 'social', label: 'Social, family atmosphere', icon: '👨‍👩‍👧' },
      { id: 'independent', label: 'Private room & independence', icon: '🚪' },
      { id: 'flexible', label: 'Flexible — open to either', icon: '✨' },
    ],
  },
  {
    id: 'language',
    question: 'Which languages do you speak comfortably?',
    helperText: 'Helps us match you with hosts who can communicate easily.',
    options: [
      { id: 'english', label: 'English only', icon: '🇬🇧' },
      { id: 'english-french', label: 'English & French', icon: '🇫🇷' },
      { id: 'english-local', label: 'English + local language learner', icon: '🌍' },
      { id: 'multilingual', label: 'Multilingual', icon: '💬' },
    ],
  },
  {
    id: 'curfew',
    question: 'How do you feel about house rules?',
    helperText: 'Honest answers lead to better long-term stays.',
    options: [
      { id: 'strict', label: 'I prefer clear rules & curfews', icon: '🕙' },
      { id: 'moderate', label: 'Moderate rules are fine', icon: '⚖️' },
      { id: 'relaxed', label: 'Relaxed, independent schedule', icon: '🌙' },
      { id: 'discuss', label: 'Happy to discuss with host', icon: '🤝' },
    ],
  },
  {
    id: 'duration',
    question: 'How long is your stay?',
    helperText: 'Some hosts specialize in short visits, others prefer semester stays.',
    options: [
      { id: 'short', label: 'Under 2 weeks', icon: '📅' },
      { id: 'month', label: 'About a month', icon: '🗓️' },
      { id: 'semester', label: 'Full semester', icon: '🎓' },
      { id: 'year', label: 'Academic year or longer', icon: '🏡' },
    ],
  },
];

export const ONBOARDING_TOTAL_STEPS = 4;
