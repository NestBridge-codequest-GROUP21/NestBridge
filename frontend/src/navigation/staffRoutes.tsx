import React, { useCallback, useEffect, useState } from 'react';
import StaffUserSearchScreen from '../screens/shared/StaffUserSearchScreen';
import StaffUserDetailScreen from '../screens/shared/StaffUserDetailScreen';
import StaffUserActivityScreen from '../screens/shared/StaffUserActivityScreen';
import StaffPendingKycScreen from '../screens/shared/StaffPendingKycScreen';
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
  getAdminKycDocumentDataUri,
  getApiErrorMessage,
  listAdminListings,
  listAdminUsers,
  listPendingKyc,
  setAdminListingVisibility,
  setAdminUserKycStatus,
  setAdminUserStaffStatus,
  setAdminUserSuspended,
  setAdminUserEmailVerified,
  unlockAdminUserIdentity,
  type AdminBookingActivity,
  type AdminListingModeration,
  type AdminOverview,
  type AdminPendingKyc,
  type AdminSosActivity,
  type AdminUserDetail,
  type AdminUserSummary,
} from '../services/api';
import type { StaffUserCategory } from '../screens/shared/StaffUserSearchScreen';

function listParamsForCategory(
  category: StaffUserCategory,
  query: string,
): {
  intent?: 'STUDENT' | 'TOURIST' | 'HOST' | 'GUIDE';
  staff?: boolean;
  query?: string;
} {
  const trimmed = query.trim();
  const q = trimmed.length > 0 ? trimmed : undefined;
  if (category === 'STAFF') {
    return { staff: true, query: q };
  }
  if (category === 'ALL') {
    return { query: q };
  }
  return { intent: category, query: q };
}

export interface AdminHomeRouteProps {
  staffName: string;
  tabBarItems: TabBarItem[];
  onTabPress: (tabId: string) => void;
  onOpenUsers: () => void;
  onOpenUsersByCategory?: (category: StaffUserCategory) => void;
  onOpenPendingKyc?: () => void;
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
  onOpenUsersByCategory,
  onOpenPendingKyc,
  onOpenModeration,
  onOpenPreview,
  onOpenProfile,
  notificationCount = 0,
  onNotificationPress,
  onSosPress,
}: AdminHomeRouteProps) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOverview = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'refresh') {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);
    try {
      setOverview(await getAdminOverview());
    } catch (error) {
      setOverview(null);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview('initial');
  }, [loadOverview]);

  return (
    <AdminHomeScreen
      staffName={staffName}
      overview={overview}
      isLoading={isLoading}
      refreshing={refreshing}
      errorMessage={errorMessage}
      tabBarItems={tabBarItems}
      onTabPress={onTabPress}
      onRefresh={() => {
        void loadOverview('refresh');
      }}
      onOpenUsers={onOpenUsers}
      onOpenUsersByCategory={onOpenUsersByCategory}
      onOpenPendingKyc={onOpenPendingKyc}
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
      const page = await listAdminListings(params);
      setListings(page.items);
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
  initialCategory?: StaffUserCategory;
  onSelectUser: (userId: string) => void;
  onBack: () => void;
  tabBarItems?: TabBarItem[];
  onTabPress?: (tabId: string) => void;
  onSosPress?: () => void;
}

export function StaffUserSearchRoute({
  initialCategory = 'ALL',
  onSelectUser,
  onBack,
  tabBarItems,
  onTabPress,
  onSosPress,
}: StaffUserSearchRouteProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<StaffUserCategory>(initialCategory);
  const [results, setResults] = useState<AdminUserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const loadUsers = useCallback(async (nextCategory: StaffUserCategory, nextQuery: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const page = await listAdminUsers(listParamsForCategory(nextCategory, nextQuery));
      setResults(page.items);
      setHasLoaded(true);
    } catch (error) {
      setResults([]);
      setHasLoaded(true);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers(category, query);
    // Load when category changes; query applies on Search / Refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: category-driven reload
  }, [category, loadUsers]);

  return (
    <StaffUserSearchScreen
      query={query}
      category={category}
      results={results}
      isLoading={isLoading}
      errorMessage={errorMessage}
      hasLoaded={hasLoaded}
      tabBarItems={tabBarItems}
      onQueryChange={setQuery}
      onCategoryChange={setCategory}
      onSearch={() => {
        void loadUsers(category, query);
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
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [kycDocumentUri, setKycDocumentUri] = useState<string | null>(null);
  const [kycDocumentLoading, setKycDocumentLoading] = useState(false);
  const [kycDocumentError, setKycDocumentError] = useState<string | null>(null);

  const loadKycDocument = useCallback(async (detail: AdminUserDetail | null) => {
    if (!detail?.hasKycDocument) {
      setKycDocumentUri(null);
      setKycDocumentError(null);
      setKycDocumentLoading(false);
      return;
    }
    setKycDocumentLoading(true);
    setKycDocumentError(null);
    try {
      setKycDocumentUri(await getAdminKycDocumentDataUri(detail.userId));
    } catch (error) {
      setKycDocumentUri(null);
      setKycDocumentError(getApiErrorMessage(error));
    } finally {
      setKycDocumentLoading(false);
    }
  }, []);

  const loadUser = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      if (mode === 'refresh') {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);
      try {
        const detail = await getAdminUser(userId);
        setUser(detail);
        await loadKycDocument(detail);
      } catch (error) {
        setUser(null);
        setKycDocumentUri(null);
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [loadKycDocument, userId],
  );

  useEffect(() => {
    void loadUser('initial');
  }, [loadUser]);

  const runAction = useCallback(
    async (action: () => Promise<AdminUserDetail>, successMessage: string) => {
      setActionBusy(true);
      setActionMessage(null);
      setErrorMessage(null);
      try {
        const updated = await action();
        setUser(updated);
        await loadKycDocument(updated);
        setActionMessage(successMessage);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error));
      } finally {
        setActionBusy(false);
      }
    },
    [loadKycDocument],
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
      refreshing={refreshing}
      errorMessage={errorMessage}
      actionBusy={actionBusy}
      actionMessage={actionMessage}
      kycDocumentUri={kycDocumentUri}
      kycDocumentLoading={kycDocumentLoading}
      kycDocumentError={kycDocumentError}
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
      onRejectKyc={(reason) => {
        void runAction(
          () => setAdminUserKycStatus(userId, false, reason),
          'KYC rejected.',
        );
      }}
      onUnlockIdentity={() => {
        void runAction(
          () => unlockAdminUserIdentity(userId),
          'Identity fields unlocked.',
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
      onRefresh={() => {
        void loadUser('refresh');
      }}
      onBack={onBack}
    />
  );
}

export interface StaffPendingKycRouteProps {
  onSelectUser: (userId: string) => void;
  onBack: () => void;
  tabBarItems?: TabBarItem[];
  onTabPress?: (tabId: string) => void;
  onSosPress?: () => void;
}

export function StaffPendingKycRoute({
  onSelectUser,
  onBack,
  tabBarItems,
  onTabPress,
  onSosPress,
}: StaffPendingKycRouteProps) {
  const [items, setItems] = useState<AdminPendingKyc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPending = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'refresh') {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);
    try {
      setItems(await listPendingKyc());
    } catch (error) {
      setItems([]);
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadPending('initial');
  }, [loadPending]);

  return (
    <StaffPendingKycScreen
      items={items}
      isLoading={isLoading}
      refreshing={refreshing}
      errorMessage={errorMessage}
      tabBarItems={tabBarItems}
      onSelectUser={onSelectUser}
      onRefresh={() => {
        void loadPending('refresh');
      }}
      onTabPress={onTabPress}
      onBack={onBack}
      onSosPress={onSosPress}
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
