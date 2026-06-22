import { useState } from 'react';
import type { QuizAnswers } from './QuizPage';
import type { QuizPageDefinition } from './quizConstants';

export function useQuizNavigation(
  pages: QuizPageDefinition[],
  logLabel: string,
  onFinish?: (answers: QuizAnswers) => void,
) {
  const [pageIndex, setPageIndex] = useState(0);
  const [allAnswers, setAllAnswers] = useState<QuizAnswers>({});

  const totalPages = pages.length;
  const isLastPage = pageIndex === totalPages - 1;

  const handleContinue = (pageAnswers: QuizAnswers) => {
    const merged = { ...allAnswers, ...pageAnswers };

    if (isLastPage) {
      console.log(`${logLabel}:`, merged);
      onFinish?.(merged);
      return;
    }

    setAllAnswers(merged);
    setPageIndex((prev) => prev + 1);
  };

  const handleBack = (pageAnswers: QuizAnswers) => {
    setAllAnswers((prev) => ({ ...prev, ...pageAnswers }));
    setPageIndex((prev) => prev - 1);
  };

  return {
    pageIndex,
    currentPage: pages[pageIndex],
    totalPages,
    isLastPage,
    allAnswers,
    handleContinue,
    handleBack,
  };
}
