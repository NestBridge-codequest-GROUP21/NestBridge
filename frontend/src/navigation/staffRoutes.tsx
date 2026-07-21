import React, { useCallback, useEffect, useState } from 'react';
import StaffUserSearchScreen from '../screens/shared/StaffUserSearchScreen';
import StaffUserDetailScreen from '../screens/shared/StaffUserDetailScreen';
import StaffUserActivityScreen from '../screens/shared/StaffUserActivityScreen';
import {
  getAdminUser,
  getAdminUserActivity,
  getApiErrorMessage,
  searchAdminUsers,
  setAdminUserKycStatus,
  setAdminUserStaffStatus,
  setAdminUserSuspended,
  setAdminUserEmailVerified,
  type AdminBookingActivity,
  type AdminSosActivity,
  type AdminUserDetail,
  type AdminUserSummary,
} from '../services/api';

export interface StaffUserSearchRouteProps {
  onSelectUser: (userId: string) => void;
  onBack: () => void;
}

export function StaffUserSearchRoute({
  onSelectUser,
  onBack,
}: StaffUserSearchRouteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AdminUserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const onSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsLoading(true);
    setErrorMessage(null);
    setHasSearched(true);
    try {
      const users = await searchAdminUsers(trimmed);
      setResults(users);
    } catch (error) {
      setResults([]);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <StaffUserSearchScreen
      query={query}
      results={results}
      isLoading={isLoading}
      errorMessage={errorMessage}
      hasSearched={hasSearched}
      onQueryChange={setQuery}
      onSearch={() => {
        void onSearch();
      }}
      onSelectUser={onSelectUser}
      onBack={onBack}
    />
  );
}

export interface StaffUserDetailRouteProps {
  userId: string;
  onViewActivity: (userId: string, userName: string) => void;
  onBack: () => void;
}

export function StaffUserDetailRoute({
  userId,
  onViewActivity,
  onBack,
}: StaffUserDetailRouteProps) {
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setUser(await getAdminUser(userId));
    } catch (error) {
      setUser(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const runAction = useCallback(
    async (action: () => Promise<AdminUserDetail>, successMessage: string) => {
      setActionBusy(true);
      setActionMessage(null);
      setErrorMessage(null);
      try {
        const updated = await action();
        setUser(updated);
        setActionMessage(successMessage);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setActionBusy(false);
      }
    },
    [],
  );

  return (
    <StaffUserDetailScreen
      user={user}
      isLoading={isLoading}
      errorMessage={errorMessage}
      actionBusy={actionBusy}
      actionMessage={actionMessage}
      onSuspend={() => {
        void runAction(
          () => setAdminUserSuspended(userId, true),
          'Account suspended.',
        );
      }}
      onUnsuspend={() => {
        void runAction(
          () => setAdminUserSuspended(userId, false),
          'Account unsuspended.',
        );
      }}
      onForceVerify={() => {
        void runAction(
          () => setAdminUserKycStatus(userId, true),
          'KYC marked verified.',
        );
      }}
      onClearKyc={() => {
        void runAction(
          () => setAdminUserKycStatus(userId, false),
          'KYC verification cleared.',
        );
      }}
      onMarkEmailVerified={() => {
        void runAction(
          () => setAdminUserEmailVerified(userId, true),
          'Email marked verified — user can sign in.',
        );
      }}
      onClearEmailVerified={() => {
        void runAction(
          () => setAdminUserEmailVerified(userId, false),
          'Email verification cleared.',
        );
      }}
      onGrantStaff={() => {
        void runAction(
          () => setAdminUserStaffStatus(userId, true),
          'Staff access granted.',
        );
      }}
      onRevokeStaff={() => {
        void runAction(
          () => setAdminUserStaffStatus(userId, false),
          'Staff access revoked.',
        );
      }}
      onViewActivity={() => {
        if (user) {
          onViewActivity(user.userId, user.fullName);
        }
      }}
      onBack={onBack}
    />
  );
}

export interface StaffUserActivityRouteProps {
  userId: string;
  userName: string;
  onBack: () => void;
}

export function StaffUserActivityRoute({
  userId,
  userName,
  onBack,
}: StaffUserActivityRouteProps) {
  const [bookings, setBookings] = useState<AdminBookingActivity[]>([]);
  const [sosAlerts, setSosAlerts] = useState<AdminSosActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const activity = await getAdminUserActivity(userId);
        if (!cancelled) {
          setBookings(activity.recentBookings ?? []);
          setSosAlerts(activity.recentSosAlerts ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          setBookings([]);
          setSosAlerts([]);
          setErrorMessage(getApiErrorMessage(error));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <StaffUserActivityScreen
      userName={userName}
      bookings={bookings}
      sosAlerts={sosAlerts}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onBack={onBack}
    />
  );
}
