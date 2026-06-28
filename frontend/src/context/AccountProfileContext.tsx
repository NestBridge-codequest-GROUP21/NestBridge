import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { QuizAnswers } from '../screens/onboarding/QuizPage';
import type {
  AccountProfileState,
  PrimaryIntent,
  ProfileData,
  ProfileProgress,
  SetupTrack,
} from '../types/accountProfile';
import {
  clearAccountProfile,
  loadAccountProfile,
  saveAccountProfile,
} from '../services/accountProfileStorage';
import {
  canAcceptGuideSessions,
  canAcceptHostBookings,
  canBookGuideSession,
  canBookHomestay,
  canEnableGuideProvider,
  canEnableHostProvider,
  createDefaultAccountProfileState,
  getBookingContext,
  getGuideNextStep,
  getHostNextStep,
  getProviderBlockedReason,
  getSeekerNextStep,
  getStepsForTrack,
  isActiveExchangeStudent,
  isGuideComplete,
  isHostComplete,
  isSeekerComplete,
} from '../utils/accountProfile';
import { useAuth } from './AuthContext';

interface AccountProfileContextValue {
  state: AccountProfileState;
  isLoading: boolean;
  primaryIntent: PrimaryIntent | null;
  isActiveExchangeStudent: boolean;
  setPrimaryIntent: (intent: PrimaryIntent) => Promise<void>;
  setIsActiveExchangeStudent: (active: boolean) => Promise<void>;
  completeStep: (
    track: SetupTrack,
    step: string,
    data?: Partial<ProfileData>,
  ) => Promise<void>;
  markTrackComplete: (track: SetupTrack) => Promise<void>;
  startSetup: (track: SetupTrack) => Promise<void>;
  canBookHomestay: boolean;
  canBookGuideSession: boolean;
  canAcceptHostBookings: boolean;
  canAcceptGuideSessions: boolean;
  canEnableHostProvider: boolean;
  canEnableGuideProvider: boolean;
  providerBlockedReason: string | null;
  /** @deprecated Use providerBlockedReason */
  hostProviderBlockedReason: string | null;
  isSeekerComplete: boolean;
  isHostComplete: boolean;
  isGuideComplete: boolean;
  getNextStep: (track: SetupTrack) => string | null;
  getBookingContext: (bookingType: 'HOST' | 'GUIDE') => ReturnType<typeof getBookingContext>;
  resetAccountProfile: () => Promise<void>;
  applyDevPreset: (preset: AccountProfileState) => Promise<void>;
}

const AccountProfileContext = createContext<AccountProfileContextValue | undefined>(
  undefined,
);

function deriveStatus(
  stepsCompleted: string[],
  allSteps: readonly string[],
): ProfileProgress['status'] {
  if (allSteps.every((step) => stepsCompleted.includes(step))) {
    return 'COMPLETE';
  }
  if (stepsCompleted.length > 0) {
    return 'IN_PROGRESS';
  }
  return 'NOT_STARTED';
}

function mergeProfileData(
  current: ProfileData,
  data?: Partial<ProfileData>,
): ProfileData {
  const merged: ProfileData = { ...current, ...data };
  if (data?.quizAnswers) {
    merged.quizAnswers = {
      ...(current.quizAnswers ?? {}),
      ...data.quizAnswers,
    } as QuizAnswers;
  }
  return merged;
}

function updateTrackProgress(
  state: AccountProfileState,
  track: SetupTrack,
  updater: (progress: ProfileProgress) => ProfileProgress,
): AccountProfileState {
  if (track === 'SEEKER') {
    return { ...state, seekerSetup: updater(state.seekerSetup) };
  }
  if (track === 'HOST') {
    return { ...state, hostProvider: updater(state.hostProvider) };
  }
  return { ...state, guideProvider: updater(state.guideProvider) };
}

function canStartProviderTrack(
  state: AccountProfileState,
  track: SetupTrack,
): boolean {
  if (track === 'HOST') {
    return canEnableHostProvider(state);
  }
  if (track === 'GUIDE') {
    return canEnableGuideProvider(state);
  }
  return true;
}

export function AccountProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AccountProfileState>(
    createDefaultAccountProfileState(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) {
        if (mounted) {
          setState(createDefaultAccountProfileState());
          setIsLoading(false);
        }
        return;
      }
      const saved = await loadAccountProfile(user.userId);
      if (mounted) {
        setState(saved);
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.userId]);

  const persist = useCallback(
    async (next: AccountProfileState) => {
      setState(next);
      if (user) {
        await saveAccountProfile(user.userId, next);
      }
    },
    [user],
  );

  const setPrimaryIntent = useCallback(
    async (intent: PrimaryIntent) => {
      const next: AccountProfileState = {
        ...state,
        primaryIntent: intent,
        isActiveExchangeStudent:
          intent === 'STUDENT' ? (state.isActiveExchangeStudent ?? true) : state.isActiveExchangeStudent,
      };
      await persist(next);
    },
    [persist, state],
  );

  const setIsActiveExchangeStudentFlag = useCallback(
    async (active: boolean) => {
      await persist({ ...state, isActiveExchangeStudent: active });
    },
    [persist, state],
  );

  const startSetup = useCallback(
    async (track: SetupTrack) => {
      if (!canStartProviderTrack(state, track)) {
        return;
      }
      const steps = getStepsForTrack(track, state.primaryIntent);
      const progress =
        track === 'SEEKER'
          ? state.seekerSetup
          : track === 'HOST'
            ? state.hostProvider
            : state.guideProvider;
      await persist(
        updateTrackProgress(state, track, () => ({
          ...progress,
          status: progress.stepsCompleted.length > 0 ? 'IN_PROGRESS' : 'IN_PROGRESS',
          stepsCompleted: progress.stepsCompleted,
        })),
      );
      void steps;
    },
    [persist, state],
  );

  const completeStep = useCallback(
    async (track: SetupTrack, step: string, data?: Partial<ProfileData>) => {
      if (!canStartProviderTrack(state, track)) {
        return;
      }
      const steps = getStepsForTrack(track, state.primaryIntent);
      const current =
        track === 'SEEKER'
          ? state.seekerSetup
          : track === 'HOST'
            ? state.hostProvider
            : state.guideProvider;
      const stepsCompleted = current.stepsCompleted.includes(step)
        ? current.stepsCompleted
        : [...current.stepsCompleted, step];
      const nextProgress: ProfileProgress = {
        status: deriveStatus(stepsCompleted, steps),
        stepsCompleted,
        data: mergeProfileData(current.data, data),
      };
      await persist(updateTrackProgress(state, track, () => nextProgress));
    },
    [persist, state],
  );

  const markTrackComplete = useCallback(
    async (track: SetupTrack) => {
      if (!canStartProviderTrack(state, track)) {
        return;
      }
      const steps = getStepsForTrack(track, state.primaryIntent);
      const current =
        track === 'SEEKER'
          ? state.seekerSetup
          : track === 'HOST'
            ? state.hostProvider
            : state.guideProvider;
      await persist(
        updateTrackProgress(state, track, () => ({
          ...current,
          status: 'COMPLETE',
          stepsCompleted: [...steps],
        })),
      );
    },
    [persist, state],
  );

  const resetAccountProfile = useCallback(async () => {
    const next = createDefaultAccountProfileState();
    setState(next);
    if (user) {
      await clearAccountProfile(user.userId);
    }
  }, [user]);

  const applyDevPreset = useCallback(
    async (preset: AccountProfileState) => {
      await persist(preset);
    },
    [persist],
  );

  const getNextStep = useCallback(
    (track: SetupTrack) => {
      if (track === 'SEEKER') {
        return getSeekerNextStep(state);
      }
      if (track === 'HOST') {
        return getHostNextStep(state);
      }
      return getGuideNextStep(state);
    },
    [state],
  );

  const blockedReason = getProviderBlockedReason(state);

  const value = useMemo(
    () => ({
      state,
      isLoading,
      primaryIntent: state.primaryIntent,
      isActiveExchangeStudent: isActiveExchangeStudent(state),
      setPrimaryIntent,
      setIsActiveExchangeStudent: setIsActiveExchangeStudentFlag,
      completeStep,
      markTrackComplete,
      startSetup,
      canBookHomestay: canBookHomestay(state),
      canBookGuideSession: canBookGuideSession(state),
      canAcceptHostBookings: canAcceptHostBookings(state),
      canAcceptGuideSessions: canAcceptGuideSessions(state),
      canEnableHostProvider: canEnableHostProvider(state),
      canEnableGuideProvider: canEnableGuideProvider(state),
      providerBlockedReason: blockedReason,
      hostProviderBlockedReason: blockedReason,
      isSeekerComplete: isSeekerComplete(state),
      isHostComplete: isHostComplete(state),
      isGuideComplete: isGuideComplete(state),
      getNextStep,
      getBookingContext: (bookingType: 'HOST' | 'GUIDE') =>
        getBookingContext(state, bookingType),
      resetAccountProfile,
      applyDevPreset,
    }),
    [
      state,
      isLoading,
      setPrimaryIntent,
      setIsActiveExchangeStudentFlag,
      completeStep,
      markTrackComplete,
      startSetup,
      getNextStep,
      resetAccountProfile,
      applyDevPreset,
      blockedReason,
    ],
  );

  return (
    <AccountProfileContext.Provider value={value}>
      {children}
    </AccountProfileContext.Provider>
  );
}

export function useAccountProfile(): AccountProfileContextValue {
  const context = useContext(AccountProfileContext);
  if (!context) {
    throw new Error('useAccountProfile must be used within AccountProfileProvider');
  }
  return context;
}

/** @deprecated Use useAccountProfile */
export function useCapabilities(): AccountProfileContextValue {
  return useAccountProfile();
}
