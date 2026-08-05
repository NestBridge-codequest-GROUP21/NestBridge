import { useCallback, useEffect, useRef, useState } from 'react';
import type { FeaturedHomeCardProps } from '../components/FeaturedHomeCard';
import type { DiscoveryListingItem } from '../components/DiscoveryListingSection';
import {
  findMatches,
  getIncomingBookings,
  getUserBookings,
  getApiErrorMessage,
  type MatchResult,
} from '../services/api';
import type { BookingListItem, IncomingBookingRequest } from '../types/booking';
import type { AccountProfileState } from '../types/accountProfile';
import type { SuggestedHostItem } from '../screens/student/StudentHomeDashboard';
import {
  buildGuideMatchParams,
  buildHostMatchParams,
  matchToDiscoveryItem,
  matchToFeaturedCard,
  matchToSuggestedHost,
} from '../data/homeFeeds';
import {
  filterMatchesByBudget,
  seekerBudgetRangeFromProfile,
  type SeekerBudgetRange,
} from '../data/budgetRanges';

export type HomeApiSection =
  | 'hostMatches'
  | 'guideMatches'
  | 'hostIncoming'
  | 'guideIncoming'
  | 'bookings';

export interface HomeApiSectionErrors {
  hostMatches: string | null;
  guideMatches: string | null;
  hostIncoming: string | null;
  guideIncoming: string | null;
  bookings: string | null;
}

const EMPTY_SECTION_ERRORS: HomeApiSectionErrors = {
  hostMatches: null,
  guideMatches: null,
  hostIncoming: null,
  guideIncoming: null,
  bookings: null,
};

export interface HomeApiState {
  featuredMatch: Omit<FeaturedHomeCardProps, 'onPress'> | null;
  featuredGuide: Omit<FeaturedHomeCardProps, 'onPress'> | null;
  suggestedHosts: SuggestedHostItem[];
  suggestedGuides: DiscoveryListingItem[];
  hostMatches: MatchResult[];
  guideMatches: MatchResult[];
  topMatchTargetId: string | null;
  topGuideTargetId: string | null;
  hostIncoming: IncomingBookingRequest[];
  guideIncoming: IncomingBookingRequest[];
  bookings: BookingListItem[];
  isLoading: boolean;
  /** Per-section failures — use these for inline UI, never as a global banner alone. */
  sectionErrors: HomeApiSectionErrors;
  /**
   * Fatal home error: every requested section failed.
   * Partial failures leave this null so the dashboard can still render.
   */
  error: string | null;
  /** Quiz budget label, when set during onboarding. */
  preferredBudgetLabel: string | null;
  /**
   * Preferred quiz band had zero hosts, but other priced hosts exist.
   * UI should ask before calling exploreOutsideHostBudget.
   */
  hostBudgetExploreAvailable: boolean;
  /** Same for guides / session prices. */
  guideBudgetExploreAvailable: boolean;
  refresh: () => void;
  retrySection: (section: HomeApiSection) => void;
  exploreOutsideHostBudget: () => void;
  exploreOutsideGuideBudget: () => void;
}

function logHomeSectionFailure(section: HomeApiSection, err: unknown): string {
  const message = getApiErrorMessage(err);
  console.warn(`[homeApi] ${section} failed:`, message, err);
  return message;
}

function applyHostResults(
  results: MatchResult[],
  setters: {
    setHostMatches: (v: MatchResult[]) => void;
    setFeaturedMatch: (v: Omit<FeaturedHomeCardProps, 'onPress'> | null) => void;
    setTopMatchTargetId: (v: string | null) => void;
    setSuggestedHosts: (v: SuggestedHostItem[]) => void;
  },
) {
  setters.setHostMatches(results);
  const top = results[0];
  if (top) {
    setters.setFeaturedMatch(matchToFeaturedCard(top));
    setters.setTopMatchTargetId(top.targetId);
    setters.setSuggestedHosts(results.slice(0, 4).map(matchToSuggestedHost));
  } else {
    setters.setFeaturedMatch(null);
    setters.setTopMatchTargetId(null);
    setters.setSuggestedHosts([]);
  }
}

function applyGuideResults(
  results: MatchResult[],
  setters: {
    setGuideMatches: (v: MatchResult[]) => void;
    setFeaturedGuide: (v: Omit<FeaturedHomeCardProps, 'onPress'> | null) => void;
    setTopGuideTargetId: (v: string | null) => void;
    setSuggestedGuides: (v: DiscoveryListingItem[]) => void;
  },
) {
  setters.setGuideMatches(results);
  const top = results[0];
  if (top) {
    setters.setFeaturedGuide(matchToFeaturedCard(top));
    setters.setTopGuideTargetId(top.targetId);
    setters.setSuggestedGuides(results.slice(0, 4).map(matchToDiscoveryItem));
  } else {
    setters.setFeaturedGuide(null);
    setters.setTopGuideTargetId(null);
    setters.setSuggestedGuides([]);
  }
}

async function loadBudgetAwareMatches(
  preferredParams: Parameters<typeof findMatches>[0],
  range: SeekerBudgetRange | null,
  allowOutside: boolean,
): Promise<{ results: MatchResult[]; exploreAvailable: boolean }> {
  if (!range || allowOutside) {
    const openParams = {
      ...preferredParams,
      minBudget: undefined,
      maxBudget: undefined,
    };
    const results = await findMatches(openParams);
    return { results, exploreAvailable: false };
  }

  const preferred = await findMatches(preferredParams);
  const inRange = filterMatchesByBudget(preferred, range);
  if (inRange.length > 0) {
    return { results: inRange, exploreAvailable: false };
  }

  const openParams = {
    ...preferredParams,
    minBudget: undefined,
    maxBudget: undefined,
  };
  const wider = await findMatches(openParams);
  return {
    results: [],
    exploreAvailable: wider.length > 0,
  };
}

export function useHomeApiData(
  userId: string | undefined,
  profileState: AccountProfileState,
  options: {
    fetchMatches?: boolean;
    fetchGuideMatches?: boolean;
    fetchHostIncoming?: boolean;
    fetchGuideIncoming?: boolean;
    fetchBookings?: boolean;
  },
): HomeApiState {
  const [featuredMatch, setFeaturedMatch] = useState<Omit<FeaturedHomeCardProps, 'onPress'> | null>(null);
  const [featuredGuide, setFeaturedGuide] = useState<Omit<FeaturedHomeCardProps, 'onPress'> | null>(null);
  const [suggestedHosts, setSuggestedHosts] = useState<SuggestedHostItem[]>([]);
  const [suggestedGuides, setSuggestedGuides] = useState<DiscoveryListingItem[]>([]);
  const [hostMatches, setHostMatches] = useState<MatchResult[]>([]);
  const [guideMatches, setGuideMatches] = useState<MatchResult[]>([]);
  const [topMatchTargetId, setTopMatchTargetId] = useState<string | null>(null);
  const [topGuideTargetId, setTopGuideTargetId] = useState<string | null>(null);
  const [hostIncoming, setHostIncoming] = useState<IncomingBookingRequest[]>([]);
  const [guideIncoming, setGuideIncoming] = useState<IncomingBookingRequest[]>([]);
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionErrors, setSectionErrors] = useState<HomeApiSectionErrors>(EMPTY_SECTION_ERRORS);
  const [error, setError] = useState<string | null>(null);
  const [preferredBudgetLabel, setPreferredBudgetLabel] = useState<string | null>(null);
  const [hostBudgetExploreAvailable, setHostBudgetExploreAvailable] = useState(false);
  const [guideBudgetExploreAvailable, setGuideBudgetExploreAvailable] = useState(false);
  const [allowOutsideHostBudget, setAllowOutsideHostBudget] = useState(false);
  const [allowOutsideGuideBudget, setAllowOutsideGuideBudget] = useState(false);
  const [tick, setTick] = useState(0);
  const [sectionRetry, setSectionRetry] = useState<{
    section: HomeApiSection;
    token: number;
  } | null>(null);

  const profileRef = useRef(profileState);
  profileRef.current = profileState;
  const sectionErrorsRef = useRef(sectionErrors);
  sectionErrorsRef.current = sectionErrors;
  const allowOutsideHostRef = useRef(allowOutsideHostBudget);
  allowOutsideHostRef.current = allowOutsideHostBudget;
  const allowOutsideGuideRef = useRef(allowOutsideGuideBudget);
  allowOutsideGuideRef.current = allowOutsideGuideBudget;

  const quizBudget =
    typeof profileState.seekerSetup.data.quizAnswers?.budget === 'string'
      ? profileState.seekerSetup.data.quizAnswers.budget
      : null;
  const quizFingerprint = JSON.stringify(
    profileState.seekerSetup.data.quizAnswers ?? null,
  );
  const universityKey = profileState.seekerSetup.data.university ?? '';

  const refresh = useCallback(() => {
    setSectionRetry(null);
    setTick((t) => t + 1);
  }, []);

  const retrySection = useCallback((section: HomeApiSection) => {
    console.info(`[homeApi] retrying section: ${section}`);
    setSectionRetry((prev) => ({
      section,
      token: (prev?.token ?? 0) + 1,
    }));
  }, []);

  const exploreOutsideHostBudget = useCallback(() => {
    allowOutsideHostRef.current = true;
    setAllowOutsideHostBudget(true);
    setHostBudgetExploreAvailable(false);
    setSectionRetry({ section: 'hostMatches', token: Date.now() });
  }, []);

  const exploreOutsideGuideBudget = useCallback(() => {
    allowOutsideGuideRef.current = true;
    setAllowOutsideGuideBudget(true);
    setGuideBudgetExploreAvailable(false);
    setSectionRetry({ section: 'guideMatches', token: Date.now() });
  }, []);

  const quizFingerprintRef = useRef(quizFingerprint);
  useEffect(() => {
    if (quizFingerprintRef.current === quizFingerprint) return;
    quizFingerprintRef.current = quizFingerprint;
    // Preference edits reset widen consent (refs first so the next fetch is strict).
    allowOutsideHostRef.current = false;
    allowOutsideGuideRef.current = false;
    setAllowOutsideHostBudget(false);
    setAllowOutsideGuideBudget(false);
    setHostBudgetExploreAvailable(false);
    setGuideBudgetExploreAvailable(false);
  }, [quizFingerprint]);

  useEffect(() => {
    if (!userId) {
      setFeaturedMatch(null);
      setFeaturedGuide(null);
      setSuggestedHosts([]);
      setSuggestedGuides([]);
      setHostMatches([]);
      setGuideMatches([]);
      setHostIncoming([]);
      setGuideIncoming([]);
      setBookings([]);
      setSectionErrors(EMPTY_SECTION_ERRORS);
      setError(null);
      setPreferredBudgetLabel(null);
      setHostBudgetExploreAvailable(false);
      setGuideBudgetExploreAvailable(false);
      return;
    }

    let cancelled = false;
    const onlySection = sectionRetry?.section ?? null;

    const shouldRun = (section: HomeApiSection, enabled: boolean | undefined) => {
      if (!enabled) return false;
      if (!onlySection) return true;
      return onlySection === section;
    };

    (async () => {
      setIsLoading(true);
      if (!onlySection) {
        setSectionErrors(EMPTY_SECTION_ERRORS);
        setError(null);
      }

      const attempted: HomeApiSection[] = [];
      const failures: Partial<HomeApiSectionErrors> = {};

      const markFailure = (section: HomeApiSection, err: unknown) => {
        failures[section] = logHomeSectionFailure(section, err);
      };

      const markSuccess = (section: HomeApiSection) => {
        failures[section] = null;
      };

      try {
        const tasks: Promise<void>[] = [];
        const profile = profileRef.current;
        const range = seekerBudgetRangeFromProfile(profile);
        setPreferredBudgetLabel(range?.label ?? null);

        if (shouldRun('hostMatches', options.fetchMatches)) {
          attempted.push('hostMatches');
          tasks.push(
            loadBudgetAwareMatches(
              buildHostMatchParams(profile),
              range,
              allowOutsideHostRef.current,
            )
              .then(({ results, exploreAvailable }) => {
                if (cancelled) return;
                markSuccess('hostMatches');
                setHostBudgetExploreAvailable(exploreAvailable);
                applyHostResults(results, {
                  setHostMatches,
                  setFeaturedMatch,
                  setTopMatchTargetId,
                  setSuggestedHosts,
                });
              })
              .catch((err) => {
                if (cancelled) return;
                markFailure('hostMatches', err);
                setHostBudgetExploreAvailable(false);
                applyHostResults([], {
                  setHostMatches,
                  setFeaturedMatch,
                  setTopMatchTargetId,
                  setSuggestedHosts,
                });
              }),
          );
        }

        if (shouldRun('guideMatches', options.fetchGuideMatches)) {
          attempted.push('guideMatches');
          tasks.push(
            loadBudgetAwareMatches(
              buildGuideMatchParams(profile),
              range,
              allowOutsideGuideRef.current,
            )
              .then(({ results, exploreAvailable }) => {
                if (cancelled) return;
                markSuccess('guideMatches');
                setGuideBudgetExploreAvailable(exploreAvailable);
                applyGuideResults(results, {
                  setGuideMatches,
                  setFeaturedGuide,
                  setTopGuideTargetId,
                  setSuggestedGuides,
                });
              })
              .catch((err) => {
                if (cancelled) return;
                markFailure('guideMatches', err);
                setGuideBudgetExploreAvailable(false);
                applyGuideResults([], {
                  setGuideMatches,
                  setFeaturedGuide,
                  setTopGuideTargetId,
                  setSuggestedGuides,
                });
              }),
          );
        }

        if (shouldRun('hostIncoming', options.fetchHostIncoming)) {
          attempted.push('hostIncoming');
          tasks.push(
            getIncomingBookings('HOST')
              .then((items) => {
                if (cancelled) return;
                markSuccess('hostIncoming');
                setHostIncoming(items);
              })
              .catch((err) => {
                if (cancelled) return;
                markFailure('hostIncoming', err);
                setHostIncoming([]);
              }),
          );
        }

        if (shouldRun('guideIncoming', options.fetchGuideIncoming)) {
          attempted.push('guideIncoming');
          tasks.push(
            getIncomingBookings('GUIDE')
              .then((items) => {
                if (cancelled) return;
                markSuccess('guideIncoming');
                setGuideIncoming(items);
              })
              .catch((err) => {
                if (cancelled) return;
                markFailure('guideIncoming', err);
                setGuideIncoming([]);
              }),
          );
        }

        if (shouldRun('bookings', options.fetchBookings)) {
          attempted.push('bookings');
          tasks.push(
            getUserBookings(userId)
              .then((items) => {
                if (cancelled) return;
                markSuccess('bookings');
                setBookings(items);
              })
              .catch((err) => {
                if (cancelled) return;
                markFailure('bookings', err);
                setBookings([]);
              }),
          );
        }

        await Promise.all(tasks);

        if (cancelled) return;

        const enabledSections: HomeApiSection[] = [];
        if (options.fetchMatches) enabledSections.push('hostMatches');
        if (options.fetchGuideMatches) enabledSections.push('guideMatches');
        if (options.fetchHostIncoming) enabledSections.push('hostIncoming');
        if (options.fetchGuideIncoming) enabledSections.push('guideIncoming');
        if (options.fetchBookings) enabledSections.push('bookings');

        const nextErrors: HomeApiSectionErrors = onlySection
          ? { ...sectionErrorsRef.current }
          : { ...EMPTY_SECTION_ERRORS };
        for (const section of attempted) {
          nextErrors[section] = failures[section] ?? null;
        }
        sectionErrorsRef.current = nextErrors;
        setSectionErrors(nextErrors);

        const failedAttempted = attempted.filter((section) => Boolean(failures[section]));
        const allFailed =
          enabledSections.length > 0 &&
          enabledSections.every((section) => Boolean(nextErrors[section]));

        if (allFailed) {
          const fatal =
            nextErrors[enabledSections[0]] ??
            failures[failedAttempted[0]] ??
            'Something went wrong.';
          console.warn('[homeApi] all requested home sections failed:', enabledSections, fatal);
          setError(fatal);
        } else {
          if (failedAttempted.length > 0) {
            console.info(
              '[homeApi] partial home load — continuing with successful sections. Failed:',
              failedAttempted,
            );
          }
          setError(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    userId,
    tick,
    sectionRetry?.section,
    sectionRetry?.token,
    options.fetchMatches,
    options.fetchGuideMatches,
    options.fetchHostIncoming,
    options.fetchGuideIncoming,
    options.fetchBookings,
    profileState.seekerSetup.data.city,
    profileState.seekerSetup.data.arrivalDate,
    profileState.seekerSetup.data.departureDate,
    quizBudget,
    quizFingerprint,
    universityKey,
  ]);

  return {
    featuredMatch,
    featuredGuide,
    suggestedHosts,
    suggestedGuides,
    hostMatches,
    guideMatches,
    topMatchTargetId,
    topGuideTargetId,
    hostIncoming,
    guideIncoming,
    bookings,
    isLoading,
    sectionErrors,
    error,
    preferredBudgetLabel,
    hostBudgetExploreAvailable,
    guideBudgetExploreAvailable,
    refresh,
    retrySection,
    exploreOutsideHostBudget,
    exploreOutsideGuideBudget,
  };
}
