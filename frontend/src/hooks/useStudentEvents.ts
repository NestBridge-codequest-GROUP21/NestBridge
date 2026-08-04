import { useCallback, useEffect, useState } from 'react';
import {
  createStudentEvent,
  getApiErrorMessage,
  joinStudentEvent,
  leaveStudentEvent,
  listStudentEvents,
  mapStudentEvent,
  type StudentEventApi,
} from '../services/api';
import type { StudentEvent, StudentEventDraft } from '../data/studentEventsMock';

export interface StudentEventsState {
  events: StudentEvent[];
  joinedIds: string[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  toggleJoin: (eventId: string) => Promise<void>;
  createEvent: (draft: StudentEventDraft) => Promise<void>;
}

export function useStudentEvents(
  userId: string | undefined,
  options?: { enabled?: boolean },
): StudentEventsState {
  const enabled = options?.enabled !== false;
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const applyList = useCallback((items: StudentEventApi[]) => {
    setEvents(items.map(mapStudentEvent));
    setJoinedIds(items.filter((item) => item.joined).map((item) => item.eventId));
  }, []);

  const upsert = useCallback((dto: StudentEventApi) => {
    setEvents((current) => {
      const mapped = mapStudentEvent(dto);
      const index = current.findIndex((event) => event.id === dto.eventId);
      if (index === -1) {
        return [mapped, ...current];
      }
      const next = [...current];
      next[index] = mapped;
      return next;
    });
    setJoinedIds((current) => {
      if (dto.joined) {
        return current.includes(dto.eventId) ? current : [...current, dto.eventId];
      }
      return current.filter((id) => id !== dto.eventId);
    });
  }, []);

  useEffect(() => {
    if (!userId || !enabled) {
      if (!userId) {
        setEvents([]);
        setJoinedIds([]);
        setError(null);
      }
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const items = await listStudentEvents();
        if (!cancelled) applyList(items);
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err));
          setEvents([]);
          setJoinedIds([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, tick, applyList, enabled]);

  const toggleJoin = useCallback(
    async (eventId: string) => {
      const currentlyJoined = joinedIds.includes(eventId);
      try {
        setError(null);
        const dto = currentlyJoined
          ? await leaveStudentEvent(eventId)
          : await joinStudentEvent(eventId);
        upsert(dto);
      } catch (err) {
        setError(getApiErrorMessage(err));
      }
    },
    [joinedIds, upsert],
  );

  const createEvent = useCallback(
    async (draft: StudentEventDraft) => {
      const dto = await createStudentEvent(draft);
      upsert(dto);
    },
    [upsert],
  );

  return { events, joinedIds, isLoading, error, refresh, toggleJoin, createEvent };
}
