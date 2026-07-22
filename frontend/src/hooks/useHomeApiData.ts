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
  refresh: () => void;
  retrySection: (section: HomeApiSection) => void;
}

function logHomeSectionFailure(section: HomeApiSection, err: unknown): string {
  const message = getApiErrorMessage(err);
  console.warn(`[homeApi] ${section} failed:`, message, err);
  return message;
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
  const [tick, setTick] = useState(0);
  const [sectionRetry, setSectionRetry] = useState<{
    section: HomeApiSection;
    token: number;
  } | null>(null);

  const profileRef = useRef(profileState);
  profileRef.current = profileState;
  const sectionErrorsRef = useRef(sectionErrors);
  sectionErrorsRef.current = sectionErrors;

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

        if (shouldRun('hostMatches', options.fetchMatches)) {
          attempted.push('hostMatches');
          tasks.push(
            findMatches(buildHostMatchParams(profile))
              .then((results) => {
                if (cancelled) return;
                markSuccess('hostMatches');
                setHostMatches(results);
                const top = results[0];
                if (top) {
                  setFeaturedMatch(matchToFeaturedCard(top));
                  setTopMatchTargetId(top.targetId);
                  setSuggestedHosts(results.slice(0, 4).map(matchToSuggestedHost));
                } else {
                  setFeaturedMatch(null);
                  setTopMatchTargetId(null);
                  setSuggestedHosts([]);
                }
              })
              .catch((err) => {
                if (cancelled) return;
                markFailure('hostMatches', err);
                setHostMatches([]);
                setFeaturedMatch(null);
                setTopMatchTargetId(null);
                setSuggestedHosts([]);
              }),
          );
        }

        if (shouldRun('guideMatches', options.fetchGuideMatches)) {
          attempted.push('guideMatches');
          tasks.push(
            findMatches(buildGuideMatchParams(profile))
              .then((results) => {
                if (cancelled) return;
                markSuccess('guideMatches');
                setGuideMatches(results);
                const top = results[0];
                if (top) {
                  setFeaturedGuide(matchToFeaturedCard(top));
                  setTopGuideTargetId(top.targetId);
                  setSuggestedGuides(results.slice(0, 4).map(matchToDiscoveryItem));
                } else {
                  setFeaturedGuide(null);
                  setTopGuideTargetId(null);
                  setSuggestedGuides([]);
                }
              })
              .catch((err) => {
                if (cancelled) return;
                markFailure('guideMatches', err);
                setGuideMatches([]);
                setFeaturedGuide(null);
                setTopGuideTargetId(null);
                setSuggestedGuides([]);
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
    refresh,
    retrySection,
  };
}
