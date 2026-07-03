import { useCallback, useEffect, useState } from 'react';
import {
  getPhrases,
  getTopics,
  getTransport,
  getSites,
  getSite,
  getChecklist,
  getEmergencyContacts,
  getMapLandmarks,
  getVideos,
  getVideo,
  getApiErrorMessage,
} from '../services/api';
import type {
  ChecklistItemApi,
  EmergencyContactApi,
  MapLandmarkApi,
  PhraseApi,
  TopicApi,
  TouristSiteApi,
  TransportTabApi,
  VideoResourceApi,
} from '../services/api';

export interface ContentState<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

function useContentFetch<T>(
  enabled: boolean,
  fetcher: () => Promise<T>,
  initial: T,
): ContentState<T> {
  const [data, setData] = useState<T>(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!enabled) {
      setData(initial);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setData(initial);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, tick]);

  return { data, isLoading, error, refresh };
}

export function usePhrases(city?: string, enabled = true) {
  return useContentFetch<PhraseApi[]>(enabled, () => getPhrases(city), []);
}

export function useTopics(city?: string, enabled = true) {
  return useContentFetch<TopicApi[]>(enabled, () => getTopics(city), []);
}

export function useTransport(city?: string, enabled = true) {
  return useContentFetch<TransportTabApi[]>(enabled, () => getTransport(city), []);
}

export function useSites(city?: string, enabled = true) {
  return useContentFetch<TouristSiteApi[]>(enabled, () => getSites(city), []);
}

export function useSite(siteKey: string | undefined, enabled = true) {
  return useContentFetch<TouristSiteApi | null>(
    enabled && !!siteKey,
    async () => (siteKey ? getSite(siteKey) : null),
    null,
  );
}

export function useChecklist(city?: string, enabled = true) {
  return useContentFetch<ChecklistItemApi[]>(enabled, () => getChecklist(city), []);
}

export function useEmergencyContacts(enabled = true) {
  return useContentFetch<EmergencyContactApi[]>(
    enabled,
    () => getEmergencyContacts(),
    [],
  );
}

export function useMapLandmarks(city?: string, enabled = true) {
  return useContentFetch<MapLandmarkApi[]>(enabled, () => getMapLandmarks(city), []);
}

export function useVideos(city?: string, category?: string, enabled = true) {
  return useContentFetch<VideoResourceApi[]>(
    enabled,
    () => getVideos(city, category),
    [],
  );
}

export function useVideo(videoKey: string | undefined, enabled = true) {
  return useContentFetch<VideoResourceApi | null>(
    enabled && !!videoKey,
    async () => (videoKey ? getVideo(videoKey) : null),
    null,
  );
}
