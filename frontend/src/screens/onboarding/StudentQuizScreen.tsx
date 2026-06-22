import React from 'react';
import QuizPage from './QuizPage';
import {
  DIETARY_OPTIONS,
  LANGUAGE_OPTIONS,
  QUIET_SOCIAL_LABELS,
  QuizPageDefinition,
} from './quizConstants';
import { useQuizNavigation } from './useQuizNavigation';
import type { QuizAnswers } from './QuizPage';

const STUDENT_PAGES: QuizPageDefinition[] = [
  [
    {
      id: 'languages',
      question: 'Which languages do you speak comfortably?',
      type: 'multi-select',
      options: LANGUAGE_OPTIONS,
      required: true,
    },
  ],
  [
    {
      id: 'dietary',
      question: 'Do you have any dietary requirements?',
      type: 'multi-select',
      options: DIETARY_OPTIONS,
      required: true,
    },
  ],
  [
    {
      id: 'religion',
      question: "Do you practice a religion you'd like your host to be aware of?",
      type: 'single-select',
      options: ['Islam', 'Christianity', 'Other', 'Prefer not to say'],
      required: true,
    },
  ],
  [
    {
      id: 'dailyRhythm',
      question: "What's your daily rhythm like?",
      type: 'single-select',
      options: ['Early riser', 'Night owl', 'Flexible'],
      required: true,
    },
  ],
  [
    {
      id: 'householdVibe',
      question: 'How do you feel about a lively vs quiet household?',
      type: 'slider',
      sliderLabels: QUIET_SOCIAL_LABELS,
      required: true,
    },
  ],
  [
    {
      id: 'smokingAlcohol',
      question: 'Are you comfortable with smoking or alcohol in the household?',
      type: 'single-select',
      options: ['Comfortable with both', 'Prefer neither', 'No preference'],
      required: true,
    },
  ],
  [
    {
      id: 'budget',
      question: "What's your budget range per night?",
      type: 'single-select',
      options: [
        'Under GHS 100',
        'GHS 100-200',
        'GHS 200-350',
        'Above GHS 350',
      ],
      required: true,
    },
  ],
  [
    {
      id: 'destination',
      question: 'Which city and university are you heading to?',
      type: 'text',
      placeholder: 'e.g. Accra, University of Ghana',
      required: true,
    },
  ],
  [
    {
      id: 'languagePractice',
      question: 'Which language would you like to practice while here?',
      type: 'single-select',
      options: [...LANGUAGE_OPTIONS, 'None'],
      required: false,
    },
    {
      id: 'foodAllergies',
      question: 'If you have food allergies, please specify',
      type: 'text',
      placeholder: 'List any allergies or sensitivities',
      required: false,
    },
    {
      id: 'hostCulturalBackground',
      question: "Do you have a preference for your host's cultural background?",
      type: 'single-select',
      options: ['No preference', 'Similar to mine', 'Open to any background'],
      defaultValue: 'No preference',
      required: false,
    },
  ],
  [
    {
      id: 'additionalNotes',
      question: 'Anything else important for your host to know?',
      type: 'text',
      placeholder: 'Share anything that helps your host welcome you',
      required: false,
    },
  ],
];

export interface StudentQuizScreenProps {
  onFinish?: (answers: QuizAnswers) => void;
}

export default function StudentQuizScreen({ onFinish }: StudentQuizScreenProps = {}) {
  const {
    pageIndex,
    currentPage,
    totalPages,
    isLastPage,
    allAnswers,
    handleContinue,
    handleBack,
  } = useQuizNavigation(STUDENT_PAGES, 'Student quiz answers', onFinish);

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
      stepLabel="Student preferences"
    />
  );
}
