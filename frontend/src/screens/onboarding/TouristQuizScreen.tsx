import React from 'react';
import QuizPage from './QuizPage';
import type { QuizAnswers } from './QuizPage';
import {
  DIETARY_OPTIONS,
  GHANA_CITY_OPTIONS,
  LANGUAGE_OPTIONS,
  QUIET_SOCIAL_LABELS,
  QuizPageDefinition,
  RELIGION_OPTIONS,
  createReligiousAccommodationsFollowUp,
  createReligionOtherFollowUp,
} from './quizConstants';
import { useQuizNavigation } from './useQuizNavigation';

const TOURIST_PAGES: QuizPageDefinition[] = [
  [
    {
      id: 'languages',
      question: 'Which languages do you speak?',
      type: 'multi-select',
      options: LANGUAGE_OPTIONS,
      required: true,
    },
  ],
  [
    {
      id: 'dietary',
      question: 'Any dietary requirements during your trip?',
      type: 'multi-select',
      options: DIETARY_OPTIONS,
      required: true,
    },
  ],
  [
    {
      id: 'travelStyle',
      question: "What's your travel style?",
      type: 'multi-select',
      options: [
        'Cultural immersion',
        'Adventure',
        'Food & dining',
        'History',
        'Relaxed sightseeing',
      ],
      required: true,
    },
  ],
  [
    {
      id: 'stayVibe',
      question: 'Are you comfortable with a lively stay or prefer quieter?',
      type: 'slider',
      sliderLabels: QUIET_SOCIAL_LABELS,
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
      question: 'Which city are you visiting?',
      type: 'single-select',
      options: GHANA_CITY_OPTIONS,
      required: true,
    },
  ],
  [
    {
      id: 'religion',
      question: "Do you practice a religion you'd like hosts to be aware of?",
      type: 'single-select',
      options: RELIGION_OPTIONS,
      required: true,
    },
    createReligionOtherFollowUp(),
    createReligiousAccommodationsFollowUp(),
  ],
  [
    {
      id: 'culturalPreference',
      question: 'Any cultural background preference for your host or guide?',
      type: 'single-select',
      options: ['No preference', 'Similar to mine', 'Open to any background'],
      defaultValue: 'No preference',
      required: false,
    },
  ],
];

export interface TouristQuizScreenProps {
  onFinish?: (answers: QuizAnswers) => void;
}

export default function TouristQuizScreen({ onFinish }: TouristQuizScreenProps = {}) {
  const {
    pageIndex,
    currentPage,
    totalPages,
    isLastPage,
    allAnswers,
    handleContinue,
    handleBack,
  } = useQuizNavigation(TOURIST_PAGES, 'Tourist quiz answers', onFinish);

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
      stepLabel="Tourist preferences"
    />
  );
}
