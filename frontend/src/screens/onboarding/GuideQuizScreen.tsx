import React from 'react';
import QuizPage from './QuizPage';
import type { QuizAnswers } from './QuizPage';
import { DIETARY_OPTIONS, LANGUAGE_OPTIONS, QuizPageDefinition, RELIGION_OPTIONS, createReligiousAccommodationsFollowUp } from './quizConstants';
import { useQuizNavigation } from './useQuizNavigation';

const GUIDE_PAGES: QuizPageDefinition[] = [
  [
    {
      id: 'guideLanguages',
      question: 'Which languages can you guide in?',
      type: 'multi-select',
      options: LANGUAGE_OPTIONS,
      required: true,
    },
  ],
  [
    {
      id: 'religion',
      question: 'Do you practice a religion that guides how you accommodate visitors?',
      type: 'single-select',
      options: RELIGION_OPTIONS,
      required: true,
    },
    createReligiousAccommodationsFollowUp(),
  ],
  [
    {
      id: 'guidingStyle',
      question: "What's your guiding style?",
      type: 'multi-select',
      options: [
        'Relaxed/flexible pace',
        'Structured/efficient',
        'High-energy/adventurous',
      ],
      required: true,
    },
  ],
  [
    {
      id: 'pricePerSession',
      question: "What's your price per session?",
      type: 'number',
      placeholder: 'Amount in GHS',
      required: true,
    },
  ],
  [
    {
      id: 'sessionDuration',
      question: "What's your session duration?",
      type: 'number',
      placeholder: 'Duration in hours',
      required: true,
    },
  ],
  [
    {
      id: 'operatingAreas',
      question: 'Which city/areas do you operate in?',
      type: 'text',
      placeholder: 'e.g. Accra — Osu, Labadi, Airport area',
      required: true,
    },
  ],
  [
    {
      id: 'serviceTypes',
      question: 'What service types do you offer?',
      type: 'multi-select',
      options: [
        'City tour',
        'Cultural orientation',
        'Airport pickup',
        'Food tour',
        'Language exchange',
        'University walk',
      ],
      required: true,
    },
  ],
  [
    {
      id: 'smokingDrinking',
      question: 'Are you comfortable with guests who smoke or drink during sessions?',
      type: 'single-select',
      options: ['Comfortable with both', 'Prefer neither', 'No preference'],
      required: true,
    },
  ],
  [
    {
      id: 'tourDietary',
      question: 'Can you accommodate specific dietary needs during tours?',
      type: 'multi-select',
      options: DIETARY_OPTIONS,
      required: false,
    },
    {
      id: 'guideBackground',
      question:
        "What's your own cultural background, and do you specialize with any particular group?",
      type: 'text',
      placeholder: 'Share your background and any specialties',
      required: false,
    },
  ],
];

export interface GuideQuizScreenProps {
  onFinish?: (answers: QuizAnswers) => void;
}

export default function GuideQuizScreen({ onFinish }: GuideQuizScreenProps = {}) {
  const {
    pageIndex,
    currentPage,
    totalPages,
    isLastPage,
    allAnswers,
    handleContinue,
    handleBack,
  } = useQuizNavigation(GUIDE_PAGES, 'Guide quiz answers', onFinish);

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
      stepLabel="Guide preferences"
    />
  );
}
