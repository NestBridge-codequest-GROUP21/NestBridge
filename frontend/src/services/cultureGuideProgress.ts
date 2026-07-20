import * as SecureStore from 'expo-secure-store';

export type CultureGuideProgress = {
  completedPhraseIds: string[];
  practicedPhraseIds: string[];
  completedTopicIds: string[];
};

export const EMPTY_CULTURE_GUIDE_PROGRESS: CultureGuideProgress = {
  completedPhraseIds: [],
  practicedPhraseIds: [],
  completedTopicIds: [],
};

function progressKey(userId: string): string {
  return `nestbridge.cultureGuideProgress.${userId}`;
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

export async function loadCultureGuideProgress(
  userId: string,
): Promise<CultureGuideProgress> {
  try {
    const raw = await SecureStore.getItemAsync(progressKey(userId));
    if (!raw) {
      return { ...EMPTY_CULTURE_GUIDE_PROGRESS };
    }
    const parsed = JSON.parse(raw) as Partial<CultureGuideProgress>;
    return {
      completedPhraseIds: uniqueIds(parsed.completedPhraseIds ?? []),
      practicedPhraseIds: uniqueIds(parsed.practicedPhraseIds ?? []),
      completedTopicIds: uniqueIds(parsed.completedTopicIds ?? []),
    };
  } catch {
    return { ...EMPTY_CULTURE_GUIDE_PROGRESS };
  }
}

export async function saveCultureGuideProgress(
  userId: string,
  progress: CultureGuideProgress,
): Promise<void> {
  await SecureStore.setItemAsync(
    progressKey(userId),
    JSON.stringify({
      completedPhraseIds: uniqueIds(progress.completedPhraseIds),
      practicedPhraseIds: uniqueIds(progress.practicedPhraseIds),
      completedTopicIds: uniqueIds(progress.completedTopicIds),
    }),
  );
}

export async function markCulturePhraseCompleted(
  userId: string,
  phraseId: string,
): Promise<CultureGuideProgress> {
  const current = await loadCultureGuideProgress(userId);
  if (current.completedPhraseIds.includes(phraseId)) {
    return current;
  }
  const next = {
    ...current,
    completedPhraseIds: uniqueIds([...current.completedPhraseIds, phraseId]),
  };
  await saveCultureGuideProgress(userId, next);
  return next;
}

export async function markCulturePhrasePracticed(
  userId: string,
  phraseId: string,
): Promise<CultureGuideProgress> {
  const current = await loadCultureGuideProgress(userId);
  const next = {
    ...current,
    practicedPhraseIds: uniqueIds([...current.practicedPhraseIds, phraseId]),
    completedPhraseIds: uniqueIds([...current.completedPhraseIds, phraseId]),
  };
  await saveCultureGuideProgress(userId, next);
  return next;
}

export async function markCultureTopicCompleted(
  userId: string,
  topicId: string,
): Promise<CultureGuideProgress> {
  const current = await loadCultureGuideProgress(userId);
  if (current.completedTopicIds.includes(topicId)) {
    return current;
  }
  const next = {
    ...current,
    completedTopicIds: uniqueIds([...current.completedTopicIds, topicId]),
  };
  await saveCultureGuideProgress(userId, next);
  return next;
}
