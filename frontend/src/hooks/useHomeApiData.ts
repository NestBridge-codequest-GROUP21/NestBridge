import { useCallback, useEffect, useState } from 'react';
import type { FeaturedHomeCardProps } from '../components/FeaturedHomeCard';
import type { DiscoveryListingItem } from '../components/DiscoveryListingSection';
import {
  findMatches,
  getIncomingBookings,
  getUserBookings,
  getApiErrorMessage,
  type MatchResult,
} from '../services/api';
import type { BookingListItem, BookingType, IncomingBookingRequest } from '../types/booking';
import type { AccountProfileState } from '../types/accountProfile';
import type { SuggestedHostItem } from '../screens/student/StudentHomeDashboard';
import {
  buildGuideMatchParams,
  buildHostMatchParams,
  matchToDiscoveryItem,
  matchToFeaturedCard,
  matchToSuggestedHost,
} from '../data/homeFeeds';

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
  error: string | null;
  refresh: () => void;
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
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

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
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      const errors: string[] = [];

      try {
        const tasks: Promise<void>[] = [];

        if (options.fetchMatches) {
          tasks.push(
            findMatches(buildHostMatchParams(profileState)).then((results) => {
              if (cancelled) return;
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
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setHostMatches([]);
                setFeaturedMatch(null);
                setTopMatchTargetId(null);
                setSuggestedHosts([]);
              }
            }),
          );
        }

        if (options.fetchGuideMatches) {
          tasks.push(
            findMatches(buildGuideMatchParams(profileState)).then((results) => {
              if (cancelled) return;
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
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setGuideMatches([]);
                setFeaturedGuide(null);
                setTopGuideTargetId(null);
                setSuggestedGuides([]);
              }
            }),
          );
        }

        if (options.fetchHostIncoming) {
          tasks.push(
            getIncomingBookings('HOST').then((items) => {
              if (!cancelled) setHostIncoming(items);
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setHostIncoming([]);
              }
            }),
          );
        }

        if (options.fetchGuideIncoming) {
          tasks.push(
            getIncomingBookings('GUIDE').then((items) => {
              if (!cancelled) setGuideIncoming(items);
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setGuideIncoming([]);
              }
            }),
          );
        }

        if (options.fetchBookings) {
          tasks.push(
            getUserBookings(userId).then((items) => {
              if (!cancelled) setBookings(items);
            }).catch((err) => {
              if (!cancelled) {
                errors.push(getApiErrorMessage(err));
                setBookings([]);
              }
            }),
          );
        }

        await Promise.all(tasks);

        if (!cancelled && errors.length > 0) {
          setError(errors[0]);
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
    error,
    refresh,
  };
}
