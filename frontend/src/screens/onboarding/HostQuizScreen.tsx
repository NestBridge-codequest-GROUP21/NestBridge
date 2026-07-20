import React from 'react';
import QuizPage from './QuizPage';
import type { QuizAnswers } from './QuizPage';
import {
  GHANA_CITY_OPTIONS,
  LANGUAGE_OPTIONS,
  QUIET_SOCIAL_LABELS,
  QuizPageDefinition,
  RELIGION_OPTIONS,
  createReligiousAccommodationsFollowUp,
  createReligionOtherFollowUp,
} from './quizConstants';
import { useQuizNavigation } from './useQuizNavigation';

const HOST_PAGES: QuizPageDefinition[] = [
  [
    {
      id: 'householdLanguages',
      question: 'Which languages are spoken in your household?',
      type: 'multi-select',
      options: LANGUAGE_OPTIONS,
      required: true,
    },
  ],
  [
    {
      id: 'dietaryAccommodations',
      question: 'What dietary accommodations can you offer?',
      type: 'multi-select',
      options: [
        'Halal',
        'Vegan',
        'Vegetarian',
        'Kosher',
        'Standard',
        'Can accommodate allergies',
      ],
      required: true,
    },
  ],
  [
    {
      id: 'religion',
      question: 'Which religious tradition does your household observe or welcome?',
      type: 'single-select',
      options: RELIGION_OPTIONS,
      required: true,
    },
    createReligionOtherFollowUp(),
    createReligiousAccommodationsFollowUp(),
  ],
  [
    {
      id: 'householdRhythm',
      question: "How would you describe your household's daily rhythm?",
      type: 'single-select',
      options: ['Early riser household', 'Night owl friendly', 'Flexible'],
      required: true,
    },
  ],
  [
    {
      id: 'householdSocial',
      question: 'How social is your household day to day?',
      type: 'slider',
      sliderLabels: QUIET_SOCIAL_LABELS,
      required: true,
    },
  ],
  [
    {
      id: 'houseRules',
      question: 'What are your house rules?',
      type: 'multi-select',
      options: [
        'No smoking',
        'No alcohol',
        'Guests allowed with notice',
        'No overnight guests',
        'Curfew applies',
      ],
      required: true,
    },
  ],
  [
    {
      id: 'pricePerNight',
      question: 'What is your nightly rate?',
      type: 'number',
      placeholder: 'Amount in GHS',
      required: true,
    },
  ],
  [
    {
      id: 'preferredStayLength',
      question: 'What length of stay do you prefer hosting?',
      type: 'single-select',
      options: [
        'Short stays only — under 2 weeks',
        'Medium stays — 2 weeks to 2 months',
        'Long stays — a full semester or longer',
        'Flexible — any length works',
      ],
      required: true,
    },
  ],
  [
    {
      id: 'city',
      question: 'Which Ghanaian city is your home in?',
      type: 'single-select',
      options: GHANA_CITY_OPTIONS,
      required: true,
    },
    {
      id: 'address',
      question: 'Street address or neighbourhood?',
      type: 'text',
      placeholder: 'Street, neighbourhood, or landmark',
      required: true,
    },
  ],
  [
    {
      id: 'householdBackground',
      question: "What is your household's cultural or national background?",
      type: 'text',
      placeholder: 'Share your household background',
      required: true,
    },
  ],
  [
    {
      id: 'genderPreference',
      question: 'Do you have a gender preference for guests?',
      type: 'single-select',
      options: ['No preference', 'Male guests only', 'Female guests only'],
      defaultValue: 'No preference',
      required: false,
    },
    {
      id: 'studentBackground',
      question: 'Do you welcome students from a particular background?',
      type: 'single-select',
      options: ['Open to all', 'Prefer similar background', 'No preference'],
      defaultValue: 'No preference',
      required: false,
    },
    {
      id: 'additionalHostNotes',
      question: 'Anything else students should know about your home?',
      type: 'text',
      placeholder: 'House routines, quiet hours, or welcome tips',
      required: false,
    },
  ],
];

export interface HostQuizScreenProps {
  onFinish?: (answers: QuizAnswers) => void;
}

export default function HostQuizScreen({ onFinish }: HostQuizScreenProps = {}) {
  const {
    pageIndex,
    currentPage,
    totalPages,
    isLastPage,
    allAnswers,
    handleContinue,
    handleBack,
  } = useQuizNavigation(HOST_PAGES, 'Host quiz answers', onFinish);

  return (
    <QuizPage
      key={pageIndex}
      questions={currentPage}
      pageNumber={pageIndex + 1}
      totalPages={totalPages}
      isLastPage={isLastPage}
      savedAnswers={allAnswers}
      showBack={pageIndex > 0}
      onContinue={handleContinue}
      onBack={handleBack}
      stepLabel="Host preferences"
    />
  );
}
