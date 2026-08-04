import React, { useCallback, useEffect, useState } from 'react';
import StaffUserSearchScreen from '../screens/shared/StaffUserSearchScreen';
import StaffUserDetailScreen from '../screens/shared/StaffUserDetailScreen';
import StaffUserActivityScreen from '../screens/shared/StaffUserActivityScreen';
import AdminHomeScreen from '../screens/shared/AdminHomeScreen';
import AdminModerationScreen, {
  type ModerationFilter,
} from '../screens/shared/AdminModerationScreen';
import AdminPreviewPickerScreen, {
  ADMIN_PREVIEW_ROLE_OPTIONS,
} from '../screens/shared/AdminPreviewPickerScreen';
import type { TabBarItem } from '../components/AppTabBar';
import type { PrimaryIntent } from '../types/accountProfile';
import {
  getAdminOverview,
  getAdminUser,
  getAdminUserActivity,
  getApiErrorMessage,
  listAdminListings,
  searchAdminUsers,
  setAdminListingVisibility,
  setAdminUserKycStatus,
  setAdminUserStaffStatus,
  setAdminUserSuspended,
  setAdminUserEmailVerified,
  type AdminBookingActivity,
  type AdminListingModeration,
  type AdminOverview,
  type AdminSosActivity,
  type AdminUserDetail,
  type AdminUserSummary,
} from '../services/api';

export interface AdminHomeRouteProps {
  staffName: string;
  tabBarItems: TabBarItem[];
  onTabPress: (tabId: string) => void;
  onOpenUsers: () => void;
  onOpenModeration: () => void;
  onOpenPreview: () => void;
  onOpenProfile: () => void;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onSosPress?: () => void;
}

export function AdminHomeRoute({
  staffName,
  tabBarItems,
  onTabPress,
  onOpenUsers,
  onOpenModeration,
  onOpenPreview,
  onOpenProfile,
  notificationCount = 0,
  onNotificationPress,
  onSosPress,
}: AdminHomeRouteProps) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setOverview(await getAdminOverview());
    } catch (error) {
      setOverview(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  return (
    <AdminHomeScreen
      staffName={staffName}
      overview={overview}
      isLoading={isLoading}
      errorMessage={errorMessage}
      tabBarItems={tabBarItems}
      onTabPress={onTabPress}
      onRefresh={() => {
        void loadOverview();
      }}
      onOpenUsers={onOpenUsers}
      onOpenModeration={onOpenModeration}
      onOpenPreview={onOpenPreview}
      onOpenProfile={onOpenProfile}
      notificationCount={notificationCount}
      onNotificationPress={onNotificationPress}
      onSosPress={onSosPress}
    />
  );
}

export interface AdminModerationRouteProps {
  tabBarItems: TabBarItem[];
  onTabPress: (tabId: string) => void;
  onBack: () => void;
  onSosPress?: () => void;
}

export function AdminModerationRoute({
  tabBarItems,
  onTabPress,
  onBack,
  onSosPress,
}: AdminModerationRouteProps) {
  const [filter, setFilter] = useState<ModerationFilter>('ALL');
  const [listings, setListings] = useState<AdminListingModeration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params =
        filter === 'HIDDEN'
          ? { hidden: true }
          : filter === 'HOST' || filter === 'GUIDE'
            ? { type: filter }
            : undefined;
      setListings(await listAdminListings(params));
    } catch (error) {
      setListings([]);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  const onToggleVisibility = useCallback(
    async (listingId: string, hide: boolean) => {
      setActionBusy(true);
      setActionMessage(null);
      setErrorMessage(null);
      try {
        await setAdminListingVisibility(listingId, hide);
        setActionMessage(hide ? 'Listing hidden from marketplace.' : 'Listing restored.');
        await loadListings();
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setActionBusy(false);
      }
    },
    [loadListings],
  );

  return (
    <AdminModerationScreen
      listings={listings}
      filter={filter}
      isLoading={isLoading}
      actionBusy={actionBusy}
      errorMessage={errorMessage}
      actionMessage={actionMessage}
      tabBarItems={tabBarItems}
      onTabPress={onTabPress}
      onFilterChange={setFilter}
      onToggleVisibility={(listingId, hide) => {
        void onToggleVisibility(listingId, hide);
      }}
      onRefresh={() => {
        void loadListings();
      }}
      onBack={onBack}
      onSosPress={onSosPress}
    />
  );
}

export interface AdminPreviewRouteProps {
  tabBarItems: TabBarItem[];
  onTabPress: (tabId: string) => void;
  onSelectRole: (role: PrimaryIntent) => void;
  onBack: () => void;
  onSosPress?: () => void;
}

export function AdminPreviewRoute({
  tabBarItems,
  onTabPress,
  onSelectRole,
  onBack,
  onSosPress,
}: AdminPreviewRouteProps) {
  return (
    <AdminPreviewPickerScreen
      options={ADMIN_PREVIEW_ROLE_OPTIONS}
      tabBarItems={tabBarItems}
      onSelectRole={onSelectRole}
      onTabPress={onTabPress}
      onBack={onBack}
      onSosPress={onSosPress}
    />
  );
}

export interface StaffUserSearchRouteProps {
  onSelectUser: (userId: string) => void;
  onBack: () => void;
  tabBarItems?: TabBarItem[];
  onTabPress?: (tabId: string) => void;
  onSosPress?: () => void;
}

export function StaffUserSearchRoute({
  onSelectUser,
  onBack,
  tabBarItems,
  onTabPress,
  onSosPress,
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
      tabBarItems={tabBarItems}
      onQueryChange={setQuery}
      onSearch={() => {
        void onSearch();
      }}
      onSelectUser={onSelectUser}
      onTabPress={onTabPress}
      onBack={onBack}
      onSosPress={onSosPress}
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

  const runListingAction = useCallback(
    async (listingId: string, hide: boolean) => {
      setActionBusy(true);
      setActionMessage(null);
      setErrorMessage(null);
      try {
        await setAdminListingVisibility(listingId, hide);
        setUser(await getAdminUser(userId));
        setActionMessage(hide ? 'Listing hidden.' : 'Listing restored.');
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setActionBusy(false);
      }
    },
    [userId],
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
      onHideListing={(listingId) => {
        void runListingAction(listingId, true);
      }}
      onRestoreListing={(listingId) => {
        void runListingAction(listingId, false);
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
