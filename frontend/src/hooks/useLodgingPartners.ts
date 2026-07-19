import { useCallback, useEffect, useState } from 'react';
import {
  getLodgingPartners,
  getApiErrorMessage,
} from '../services/api';
import type { LodgingListing } from '../types/lodging';

export interface LodgingDirectoryState {
  listings: LodgingListing[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useLodgingPartners(city?: string, enabled = true): LodgingDirectoryState {
  const [listings, setListings] = useState<LodgingListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!enabled) {
      setListings([]);
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const partners = await getLodgingPartners(city);
        if (!cancelled) setListings(partners);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setListings([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [city, enabled, tick]);

  return { listings, isLoading, error, refresh };
}

export function lodgingListingFromId(
  listingId: string,
  listings: LodgingListing[],
): LodgingListing | null {
  return listings.find((entry) => entry.id === listingId) ?? null;
}
