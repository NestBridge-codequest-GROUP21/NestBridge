import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/env';
import { loadSession, saveSession, clearSession } from './authStorage';
import type { AccountProfileState, PrimaryIntent, ProfileProgress } from '../types/accountProfile';
import type {
  BookingListItem,
  BookingStatus,
  BookingType,
  GuideProfileSummary,
  HostProfileSummary,
  IncomingBookingRequest,
} from '../types/booking';
import type { AuthSession, AuthUser } from '../types/auth';
import type { LodgingCategory, LodgingListing } from '../types/lodging';
import { normalizeVerification } from '../types/verification';
import type {
  StudentEvent,
  StudentEventDraft,
  StudentEventOrganizerKind,
  StudentEventType,
} from '../data/studentEventsMock';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface AuthTokenPayload {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  displayName: string;
  emailVerified?: boolean;
  identityVerified?: boolean;
  staff?: boolean;
  notificationsEnabled?: boolean;
}

export interface AdminUserSummary {
  userId: string;
  fullName: string;
  email: string;
  primaryIntent?: string | null;
  identityVerified: boolean;
  emailVerified: boolean;
  staff: boolean;
  suspended: boolean;
}

export interface AdminListingStatus {
  type: string;
  listingId: string;
  active: boolean;
  hidden: boolean;
  setupStatus?: string | null;
  city?: string | null;
}

export interface AdminUserDetail {
  userId: string;
  fullName: string;
  email: string;
  primaryIntent?: string | null;
  identityVerified: boolean;
  identityLocked?: boolean;
  emailVerified: boolean;
  staff: boolean;
  suspended: boolean;
  nationality?: string | null;
  kycStatus?: string | null;
  kycRejectionReason?: string | null;
  seekerSetupStatus?: string | null;
  listings: AdminListingStatus[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminPage<T> {
  items: T[];
  page: number;
  limit: number;
  total: number | null;
  hasMore: boolean;
}

export type KycStatusValue = 'pending' | 'approved' | 'rejected' | 'none';

export interface KycStatus {
  status: KycStatusValue | string;
  rejectionReason?: string | null;
  jobId?: string | null;
  provider?: string | null;
  updatedAt?: string | null;
  identityVerified: boolean;
}

export interface AdminPendingKyc {
  jobId: string;
  userId: string;
  fullName: string;
  email: string;
  primaryIntent?: string | null;
  provider?: string | null;
  createdAt?: string | null;
}

export interface AdminBookingActivity {
  bookingId: string;
  bookingType: string;
  status: string;
  paymentStatus?: string | null;
  guestId: string;
  hostOrGuideId: string;
  checkIn?: string | null;
  checkOut?: string | null;
  sessionDate?: string | null;
  totalPrice?: number | null;
  createdAt?: string | null;
}

export interface AdminSosActivity {
  sosId: string;
  triggeredAt?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  contactedEmergency: boolean;
  contactedSupport: boolean;
}

export interface AdminUserActivity {
  userId: string;
  recentBookings: AdminBookingActivity[];
  recentSosAlerts: AdminSosActivity[];
}

export interface AdminOverview {
  totalUsers: number;
  studentCount: number;
  touristCount: number;
  hostCount: number;
  guideCount: number;
  staffCount: number;
  suspendedCount: number;
  unverifiedIdentityCount: number;
  unverifiedEmailCount: number;
  pendingKycCount?: number;
  activeHostListings: number;
  activeGuideListings: number;
  hiddenHostListings: number;
  hiddenGuideListings: number;
  pendingBookings: number;
  confirmedBookings: number;
  sosLast24Hours: number;
  sosLast7Days: number;
  recentBookings: AdminBookingActivity[];
  recentSosAlerts: AdminSosActivity[];
}

export interface AdminListingModeration {
  listingId: string;
  type: string;
  ownerUserId: string;
  ownerName: string;
  ownerEmail?: string | null;
  city?: string | null;
  active: boolean;
  hidden: boolean;
}

export interface AdminListingVisibilityResult {
  listingId: string;
  type: string;
  active: boolean;
  hidden: boolean;
}

export interface StaffAuditResult {
  auditId: string;
  action: string;
  detail?: string | null;
  createdAt?: string | null;
}

function authUserFromPayload(payload: AuthTokenPayload): AuthUser {
  return {
    userId: payload.userId,
    email: payload.email,
    displayName: payload.displayName,
    identityVerified: Boolean(payload.identityVerified),
    isStaff: Boolean(payload.staff),
    notificationsEnabled: payload.notificationsEnabled !== false,
  };
}

export interface MatchResult {
  matchId: string;
  targetId: string;
  targetType: 'HOST' | 'GUIDE';
  targetName: string;
  targetPhotoUrl?: string;
  compatibilityScore: number;
  matchReasons: string[];
  trustBadge?: string;
  verification?: {
    providerVerified?: boolean;
    identityVerified?: boolean;
    phoneVerified?: boolean;
    locationVerified?: boolean;
    experienceVerified?: boolean;
  };
  pricePerNight?: number;
  distanceKm?: number;
  location?: string;
  initials?: string;
}

export interface MatchFindParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  maxBudget?: number;
  targetType?: 'HOST' | 'GUIDE';
  universityLat?: number;
  universityLng?: number;
  preferredLanguages?: string[];
  dietaryRequirements?: string[];
  lifestylePreference?: string;
}

export interface IncomingBookingApi {
  id: string;
  bookingType: BookingType;
  seekerRole?: string;
  studentId: string;
  studentName: string;
  studentInitials: string;
  studentOrigin?: string;
  studentUniversity?: string;
  compatibilityScore?: number;
  checkIn?: string;
  checkOut?: string;
  sessionDate?: string;
  sessionStartTime?: string;
  sessionDurationHours?: number;
  message?: string;
  nightlyRate?: number;
  totalPrice?: number;
  platformFee?: number;
  nights?: number;
  cancellationPolicy?: string;
  overlappingAccepted?: number;
  maxAllowed?: number;
  canAccept?: boolean;
  declineReason?: string;
}

export interface BookingApi {
  bookingId: string;
  guestId: string;
  hostOrGuideId: string;
  bookingType: BookingType;
  checkIn?: string;
  checkOut?: string;
  sessionDate?: string;
  sessionStartTime?: string;
  sessionDurationHours?: number;
  guestMessage?: string;
  totalPrice?: number;
  platformFee?: number;
  status: BookingStatus;
  paymentStatus?: string | null;
  guestName?: string;
  guestInitials?: string;
  providerName?: string;
}

export interface ConversationApi {
  conversationId: string;
  participantA: string;
  participantB: string;
  firebasePath: string;
}

export interface ConversationListApi {
  conversationId: string;
  participantId: string;
  participantName: string;
  participantInitials: string;
  participantRole: string;
  firebasePath: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessageApi {
  messageId: string;
  senderId: string;
  text: string;
  sentAt: string;
}

export interface PhraseApi {
  id: string;
  emoji: string;
  phrase: string;
  translation: string;
  hasAudio: boolean;
  audioUrl?: string;
}

export interface TopicApi {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export interface TransportRouteApi {
  id: string;
  name: string;
  description: string;
  fareLabel: string;
  estimatedPrice: string;
}

export interface TransportTabApi {
  id: string;
  label: string;
  routes: TransportRouteApi[];
}

export interface TouristSiteApi {
  id: string;
  siteKey: string;
  name: string;
  city: string;
  description: string;
  openingHours?: string;
  admission?: string;
}

export interface ChecklistItemApi {
  id: string;
  itemKey: string;
  label: string;
}

export interface EmergencyContactApi {
  label: string;
  number: string;
}

export interface MapLandmarkApi {
  id: string;
  name: string;
  topPercent: number;
  leftPercent: number;
  lat?: number;
  lng?: number;
}

export interface VideoResourceApi {
  id: string;
  videoKey: string;
  title: string;
  description: string;
  category: string;
  youtubeId: string;
  thumbnailUrl?: string;
  city: string;
}

export interface LodgingPartnerApi {
  partnerId: string;
  name: string;
  city: string;
  category: string;
  address?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  bookingUrl?: string;
  priceFrom?: number;
  currency?: string;
  description?: string;
}

export interface WelfareCheckInApi {
  checkinId?: string;
  bookingId?: string;
  scheduledAt?: string;
  completedAt?: string;
  flagged?: boolean;
}

export interface HostProfileApi {
  hostId: string;
  userId: string;
  hostName: string;
  initials?: string;
  address?: string;
  city?: string;
  country?: string;
  pricePerNight?: number;
  cancellationPolicy?: string;
  houseRules?: string;
  photos?: string[];
  amenities?: string[];
  roomType?: string;
  maxGuests?: number;
  matchPercentage?: number;
  matchReasons?: string[];
  averageRating?: number;
  reviewCount?: number;
  active?: boolean;
  availabilityCalendar?: Record<string, unknown>;
  verification?: {
    providerVerified?: boolean;
    identityVerified?: boolean;
    phoneVerified?: boolean;
    locationVerified?: boolean;
    experienceVerified?: boolean;
  };
}

export interface GuideProfileApi {
  guideId: string;
  userId: string;
  name: string;
  initials?: string;
  city?: string;
  country?: string;
  pricePerSession?: number;
  sessionDurationHours?: number;
  serviceTypes?: string[];
  languagesOffered?: string[];
  matchPercentage?: number;
  matchReasons?: string[];
  averageRating?: number;
  reviewCount?: number;
  active?: boolean;
  availabilitySchedule?: Record<string, unknown>;
  verification?: {
    providerVerified?: boolean;
    identityVerified?: boolean;
    phoneVerified?: boolean;
    locationVerified?: boolean;
    experienceVerified?: boolean;
  };
}

export interface HostCalendarDayApi {
  date?: string;
  day?: number;
  status?: string;
}

export interface GuideCalendarDayApi {
  date?: string;
  day?: number;
  shifts?: string[];
}

export interface HostActiveBookingApi {
  guestName?: string;
  dateRange?: string;
  totalAmount?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  // Railway free/hobby tiers often cold-start past 8s; short timeouts look like "offline".
  timeout: 25000,
  headers: { 'Content-Type': 'application/json' },
});

let refreshPromise: Promise<AuthSession | null> | null = null;

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session = await loadSession();
  if (session?.token && config.headers) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }
      const session = await refreshPromise;
      refreshPromise = null;
      if (session?.token && original.headers) {
        original.headers.Authorization = `Bearer ${session.token}`;
        return api(original);
      }
      await clearSession();
    }
    return Promise.reject(error);
  },
);

async function refreshAccessToken(): Promise<AuthSession | null> {
  const session = await loadSession();
  if (!session?.refreshToken) {
    return null;
  }
  try {
    const { data } = await axios.post<ApiResponse<AuthTokenPayload>>(
      `${API_BASE_URL}/api/auth/refresh-token`,
      { refreshToken: session.refreshToken },
    );
    const next: AuthSession = {
      ...session,
      token: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      user: authUserFromPayload(data.data),
    };
    await saveSession(next);
    return next;
  } catch (error) {
    // Expired/revoked refresh → null (caller should sign out).
    // Network/timeout → rethrow so AuthContext can keep the cached session offline.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

/** Refresh tokens and hydrate user flags (e.g. isStaff) for an existing session. */
export async function refreshSession(): Promise<AuthSession | null> {
  return refreshAccessToken();
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Request failed');
  }
  return response.data.data;
}

export function mapProfileFromApi(dto: {
  primaryIntent?: PrimaryIntent | null;
  isActiveExchangeStudent?: boolean;
  seekerSetup?: ProfileProgress;
  hostProvider?: ProfileProgress;
  guideProvider?: ProfileProgress;
}): AccountProfileState {
  const emptyProgress = (): ProfileProgress => ({
    status: 'NOT_STARTED',
    stepsCompleted: [],
    data: {},
  });
  return {
    primaryIntent: dto.primaryIntent ?? null,
    isActiveExchangeStudent: dto.isActiveExchangeStudent,
    seekerSetup: dto.seekerSetup ?? emptyProgress(),
    hostProvider: dto.hostProvider ?? emptyProgress(),
    guideProvider: dto.guideProvider ?? emptyProgress(),
  };
}

export function mapIncomingBooking(item: IncomingBookingApi): IncomingBookingRequest {
  const nights = item.nights ?? 0;
  const nightly = item.nightlyRate ?? 0;
  const subtotal = nightly * nights;
  const platformFee = item.platformFee ?? Math.round(subtotal * 0.05);
  return {
    id: item.id,
    bookingType: item.bookingType,
    seekerRole: (item.seekerRole as 'STUDENT' | 'TOURIST') ?? 'STUDENT',
    studentId: item.studentId,
    studentName: item.studentName,
    studentInitials: item.studentInitials,
    studentOrigin: item.studentOrigin ?? '',
    studentUniversity: item.studentUniversity ?? '',
    compatibilityScore: item.compatibilityScore ?? 0,
    checkIn: item.checkIn ?? '',
    checkOut: item.checkOut ?? '',
    session:
      item.sessionDate && item.sessionStartTime
        ? {
            sessionDate: item.sessionDate,
            sessionStartTime: item.sessionStartTime,
            durationHours: Number(item.sessionDurationHours ?? 0),
          }
        : undefined,
    sessionPrice:
      item.bookingType === 'GUIDE' && item.totalPrice != null
        ? {
            sessionRate: Number(item.totalPrice) - Number(item.platformFee ?? 0),
            currency: 'GHS',
            platformFee: Number(item.platformFee ?? 0),
            total: Number(item.totalPrice),
          }
        : undefined,
    message: item.message,
    priceBreakdown: {
      nightlyRate: nightly,
      currency: 'GHS',
      nights,
      subtotal,
      platformFee,
      total: item.totalPrice ?? subtotal + platformFee,
    },
    cancellationPolicy: item.cancellationPolicy ?? 'FLEXIBLE',
    capacity: {
      overlappingAccepted: item.overlappingAccepted ?? 0,
      maxAllowed: item.maxAllowed ?? 2,
      periodLabel: item.checkIn && item.checkOut ? `${item.checkIn} – ${item.checkOut}` : '',
      canAccept: item.canAccept ?? true,
      declineReason: item.declineReason,
    },
  };
}

export function mapBookingListItem(item: BookingApi): BookingListItem {
  const providerName =
    item.providerName?.trim() ||
    // Never fall back to guestName — that makes seekers appear as their own host.
    'Host';
  const providerInitials = providerName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'HO';
  return {
    id: item.bookingId,
    bookingType: item.bookingType,
    hostId: item.hostOrGuideId,
    hostName: providerName,
    hostInitials: providerInitials,
    hostLocation: '',
    checkIn: item.checkIn ?? '',
    checkOut: item.checkOut ?? item.sessionDate ?? '',
    status: item.status,
    session:
      item.bookingType === 'GUIDE' && item.sessionDate
        ? {
            sessionDate: item.sessionDate,
            sessionStartTime: item.sessionStartTime ?? '',
            durationHours: item.sessionDurationHours ?? 0,
          }
        : undefined,
    priceBreakdown: {
      nightlyRate: 0,
      currency: 'GHS',
      nights: 0,
      subtotal: Number(item.totalPrice ?? 0) - Number(item.platformFee ?? 0),
      platformFee: Number(item.platformFee ?? 0),
      total: Number(item.totalPrice ?? 0),
    },
    cancellationPolicy: 'FLEXIBLE',
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

export async function register(
  displayName: string,
  email: string,
  password: string,
): Promise<import('../types/auth').RegisterResult> {
  const { data } = await api.post<
    ApiResponse<{
      email: string;
      displayName: string;
      requiresEmailVerification: boolean;
      emailDeliveryFailed?: boolean;
    }>
  >('/api/auth/register', {
    fullName: displayName,
    email,
    password,
  });
  const payload = unwrap({ data });
  return {
    email: payload.email,
    displayName: payload.displayName,
    requiresEmailVerification: payload.requiresEmailVerification,
    emailDeliveryFailed: Boolean(payload.emailDeliveryFailed),
    message: data?.message,
  };
}

export async function resendVerificationEmail(email: string): Promise<void> {
  const { data } = await api.post<ApiResponse<null>>('/api/auth/resend-verification', {
    email,
  });
  unwrap({ data });
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { data } = await api.post<ApiResponse<null>>('/api/auth/forgot-password', {
    email,
  });
  unwrap({ data });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const { data } = await api.post<ApiResponse<null>>('/api/auth/reset-password', {
    token,
    password,
  });
  unwrap({ data });
}

export async function login(
  email: string,
  password: string,
): Promise<AuthSession> {
  const { data } = await api.post<ApiResponse<AuthTokenPayload>>('/api/auth/login', {
    email,
    password,
  });
  const payload = unwrap({ data });
  return {
    token: payload.accessToken,
    refreshToken: payload.refreshToken,
    user: authUserFromPayload(payload),
    keepSignedIn: true,
  };
}

function normalizeAdminPage<T>(payload: AdminPage<T> | T[] | null | undefined): AdminPage<T> {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      page: 0,
      limit: payload.length,
      total: payload.length,
      hasMore: false,
    };
  }
  const items = payload?.items ?? [];
  return {
    items,
    page: payload?.page ?? 0,
    limit: payload?.limit ?? items.length,
    total: payload?.total ?? null,
    hasMore: Boolean(payload?.hasMore),
  };
}

export async function listAdminUsers(params?: {
  intent?: 'STUDENT' | 'TOURIST' | 'HOST' | 'GUIDE';
  staff?: boolean;
  query?: string;
  page?: number;
  limit?: number;
}): Promise<AdminPage<AdminUserSummary>> {
  const { data } = await api.get<ApiResponse<AdminPage<AdminUserSummary> | AdminUserSummary[]>>(
    '/api/admin/users',
    {
      params: {
        intent: params?.intent,
        staff: params?.staff,
        query: params?.query,
        page: params?.page,
        limit: params?.limit,
      },
    },
  );
  return normalizeAdminPage(unwrap({ data }));
}

export async function searchAdminUsers(query: string): Promise<AdminUserSummary[]> {
  const { data } = await api.get<ApiResponse<AdminUserSummary[]>>('/api/admin/users/search', {
    params: { query },
  });
  return unwrap({ data });
}

export async function getAdminUser(userId: string): Promise<AdminUserDetail> {
  const { data } = await api.get<ApiResponse<AdminUserDetail>>(`/api/admin/users/${userId}`);
  return unwrap({ data });
}

export async function setAdminUserSuspended(
  userId: string,
  suspended: boolean,
): Promise<AdminUserDetail> {
  const { data } = await api.patch<ApiResponse<AdminUserDetail>>(
    `/api/admin/users/${userId}/suspend`,
    { suspended },
  );
  return unwrap({ data });
}

export async function setAdminUserKycStatus(
  userId: string,
  identityVerified: boolean,
  reason?: string,
): Promise<AdminUserDetail> {
  const body: { identityVerified: boolean; reason?: string } = { identityVerified };
  if (!identityVerified && reason != null) {
    body.reason = reason;
  }
  const { data } = await api.patch<ApiResponse<AdminUserDetail>>(
    `/api/admin/users/${userId}/kyc-status`,
    body,
  );
  return unwrap({ data });
}

export async function unlockAdminUserIdentity(userId: string): Promise<AdminUserDetail> {
  const { data } = await api.post<ApiResponse<AdminUserDetail>>(
    `/api/admin/users/${userId}/unlock-identity`,
  );
  return unwrap({ data });
}

export async function listPendingKyc(limit?: number): Promise<AdminPendingKyc[]> {
  const { data } = await api.get<ApiResponse<AdminPendingKyc[]>>('/api/admin/kyc/pending', {
    params: limit != null ? { limit } : undefined,
  });
  return unwrap({ data }) ?? [];
}

export async function getKycStatus(): Promise<KycStatus> {
  const { data } = await api.get<ApiResponse<KycStatus>>('/api/kyc/status');
  return unwrap({ data });
}

export async function setAdminUserEmailVerified(
  userId: string,
  emailVerified: boolean,
): Promise<AdminUserDetail> {
  const { data } = await api.patch<ApiResponse<AdminUserDetail>>(
    `/api/admin/users/${userId}/email-verified`,
    { emailVerified },
  );
  return unwrap({ data });
}

export async function setAdminUserStaffStatus(
  userId: string,
  isStaff: boolean,
): Promise<AdminUserDetail> {
  const { data } = await api.patch<ApiResponse<AdminUserDetail>>(
    `/api/admin/users/${userId}/staff-status`,
    { isStaff },
  );
  return unwrap({ data });
}

export async function getAdminUserActivity(userId: string): Promise<AdminUserActivity> {
  const { data } = await api.get<ApiResponse<AdminUserActivity>>(
    `/api/admin/users/${userId}/activity`,
  );
  return unwrap({ data });
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const { data } = await api.get<ApiResponse<AdminOverview>>('/api/admin/overview');
  return unwrap({ data });
}

export async function listAdminListings(params?: {
  type?: string;
  hidden?: boolean;
  page?: number;
  limit?: number;
}): Promise<AdminPage<AdminListingModeration>> {
  const { data } = await api.get<
    ApiResponse<AdminPage<AdminListingModeration> | AdminListingModeration[]>
  >('/api/admin/listings', {
    params,
  });
  return normalizeAdminPage(unwrap({ data }));
}

export async function setAdminListingVisibility(
  listingId: string,
  hidden: boolean,
): Promise<AdminListingVisibilityResult> {
  const { data } = await api.patch<ApiResponse<AdminListingVisibilityResult>>(
    `/api/admin/listings/${listingId}/visibility`,
    { hidden },
  );
  return unwrap({ data });
}

export async function recordStaffAudit(
  action: string,
  detail?: string,
): Promise<StaffAuditResult> {
  const { data } = await api.post<ApiResponse<StaffAuditResult>>('/api/admin/audit', {
    action,
    detail,
  });
  return unwrap({ data });
}

export async function logout(refreshToken?: string): Promise<void> {
  try {
    await api.post('/api/auth/logout', refreshToken ? { refreshToken } : {});
  } catch {
    // clear local session regardless
  }
}

export async function getMyProfile(): Promise<AccountProfileState> {
  const { data } = await api.get<ApiResponse<AccountProfileState>>('/api/users/me/profile');
  return mapProfileFromApi(unwrap({ data }));
}

export async function updateMyProfile(
  update: Partial<AccountProfileState>,
): Promise<AccountProfileState> {
  const { data } = await api.put<ApiResponse<AccountProfileState>>('/api/users/me/profile', update);
  return mapProfileFromApi(unwrap({ data }));
}

export function mapHostProfileApi(dto: HostProfileApi): HostProfileSummary {
  const location = [dto.address, dto.city].filter(Boolean).join(', ') || dto.city || 'Ghana';
  return {
    id: dto.hostId,
    userId: dto.userId,
    name: dto.hostName,
    initials: dto.initials ?? dto.hostName.slice(0, 2).toUpperCase(),
    location,
    matchPercentage: dto.matchPercentage ?? 0,
    pricePerNight: Number(dto.pricePerNight ?? 0),
    currency: 'GHS',
    cancellationPolicy: dto.cancellationPolicy ?? 'FLEXIBLE',
    icon: '🏡',
    verification: normalizeVerification(dto.verification),
  };
}

export function mapGuideProfileApi(dto: GuideProfileApi): GuideProfileSummary {
  const location = [dto.city, dto.country].filter(Boolean).join(', ') || 'Ghana';
  return {
    id: dto.guideId,
    userId: dto.userId,
    name: dto.name,
    initials: dto.initials ?? dto.name.slice(0, 2).toUpperCase(),
    location,
    matchPercentage: dto.matchPercentage ?? 0,
    pricePerSession: Number(dto.pricePerSession ?? 0),
    sessionDurationHours: Number(dto.sessionDurationHours ?? 3),
    currency: 'GHS',
    serviceTypes: dto.serviceTypes ?? ['City tour'],
    languages: dto.languagesOffered ?? ['English'],
    cancellationPolicy: 'FLEXIBLE',
    icon: '🗺️',
    verification: normalizeVerification(dto.verification),
  };
}

export async function getHostProfile(hostId: string): Promise<HostProfileSummary> {
  const { data } = await api.get<ApiResponse<HostProfileApi>>(`/api/hosts/${hostId}`);
  return mapHostProfileApi(unwrap({ data }));
}

export async function getGuideProfile(guideId: string): Promise<GuideProfileSummary> {
  const { data } = await api.get<ApiResponse<GuideProfileApi>>(`/api/guides/${guideId}`);
  return mapGuideProfileApi(unwrap({ data }));
}

export async function getMyHostProfile(): Promise<HostProfileApi> {
  const { data } = await api.get<ApiResponse<HostProfileApi>>('/api/hosts/profile/mine');
  return unwrap({ data });
}

export async function updateMyHostProfile(
  body: Partial<HostProfileApi>,
): Promise<HostProfileApi> {
  const { data } = await api.put<ApiResponse<HostProfileApi>>('/api/hosts/profile', body);
  return unwrap({ data });
}

export async function getMyHostCalendar(
  year: number,
  month: number,
): Promise<HostCalendarDayApi[]> {
  const { data } = await api.get<ApiResponse<HostCalendarDayApi[]>>(
    '/api/hosts/profile/mine/calendar',
    { params: { year, month } },
  );
  return unwrap({ data });
}

export async function getMyHostActiveBooking(): Promise<HostActiveBookingApi | null> {
  const { data } = await api.get<ApiResponse<HostActiveBookingApi | null>>(
    '/api/hosts/profile/mine/active-booking',
  );
  return unwrap({ data });
}

export async function getMyGuideProfile(): Promise<GuideProfileApi> {
  const { data } = await api.get<ApiResponse<GuideProfileApi>>('/api/guides/profile/mine');
  return unwrap({ data });
}

export async function updateMyGuideProfile(
  body: Partial<GuideProfileApi>,
): Promise<GuideProfileApi> {
  const { data } = await api.put<ApiResponse<GuideProfileApi>>('/api/guides/profile', body);
  return unwrap({ data });
}

export async function getMyGuideCalendar(
  year: number,
  month: number,
): Promise<GuideCalendarDayApi[]> {
  const { data } = await api.get<ApiResponse<GuideCalendarDayApi[]>>(
    '/api/guides/profile/mine/calendar',
    { params: { year, month } },
  );
  return unwrap({ data });
}

export async function findMatches(params: MatchFindParams): Promise<MatchResult[]> {
  const { data } = await api.post<ApiResponse<MatchResult[]>>('/api/matches/find', params);
  return unwrap({ data });
}

export interface CommunityMemberApi {
  userId: string;
  fullName: string;
  initials: string;
  bio?: string;
  about?: string;
  profilePhotoUrl?: string;
  city?: string;
  university?: string;
  nationality?: string;
  identityVerified?: boolean;
}

export interface CommunityHostApi {
  hostId: string;
  userId: string;
  fullName: string;
  initials: string;
  bio?: string;
  city?: string;
  address?: string;
  roomType?: string;
  pricePerNight?: number;
  averageRating?: number;
  reviewCount?: number;
  identityVerified?: boolean;
}

export interface NearbyCommunityApi {
  city: string;
  students: CommunityMemberApi[];
  hosts: CommunityHostApi[];
}

export async function getNearbyCommunity(city?: string): Promise<NearbyCommunityApi> {
  const { data } = await api.get<ApiResponse<NearbyCommunityApi>>('/api/community/nearby', {
    params: city ? { city } : undefined,
  });
  return unwrap({ data });
}

export async function getPublicUser(userId: string): Promise<{
  userId: string;
  fullName: string;
  bio?: string;
  about?: string;
  profilePhotoUrl?: string;
  primaryIntent?: string;
}> {
  const { data } = await api.get<
    ApiResponse<{
      userId: string;
      fullName: string;
      bio?: string;
      about?: string;
      profilePhotoUrl?: string;
      primaryIntent?: string;
    }>
  >(`/api/users/${userId}`);
  return unwrap({ data });
}

export async function getHomeRecommendations(params?: {
  city?: string;
  role?: string;
}): Promise<import('../types/recommendations').HomeRecommendations> {
  const { data } = await api.get<
    ApiResponse<import('../types/recommendations').HomeRecommendations>
  >('/api/recommendations/home', { params });
  return unwrap({ data });
}

export async function getIncomingBookings(
  bookingType: BookingType = 'HOST',
  status?: BookingStatus,
): Promise<IncomingBookingRequest[]> {
  const params: { bookingType: BookingType; status?: BookingStatus } = { bookingType };
  if (status) {
    params.status = status;
  }
  const { data } = await api.get<ApiResponse<IncomingBookingApi[]>>('/api/bookings/incoming', {
    params,
  });
  return unwrap({ data }).map(mapIncomingBooking);
}

export async function getProviderActiveBookings(
  bookingType: BookingType,
): Promise<IncomingBookingRequest[]> {
  const { data } = await api.get<ApiResponse<IncomingBookingApi[]>>('/api/bookings/incoming', {
    params: { bookingType, active: true },
  });
  return unwrap({ data }).map(mapIncomingBooking);
}

export async function getUserBookings(userId: string): Promise<BookingListItem[]> {
  const { data } = await api.get<ApiResponse<BookingApi[]>>(`/api/users/${userId}/bookings`);
  return unwrap({ data }).map(mapBookingListItem);
}

export async function createBooking(body: Record<string, unknown>): Promise<BookingApi> {
  const { data } = await api.post<ApiResponse<BookingApi>>('/api/bookings', body);
  return unwrap({ data });
}

export async function acceptBooking(bookingId: string): Promise<BookingApi> {
  const { data } = await api.put<ApiResponse<BookingApi>>(`/api/bookings/${bookingId}/accept`);
  return unwrap({ data });
}

export async function declineBooking(bookingId: string): Promise<BookingApi> {
  const { data } = await api.put<ApiResponse<BookingApi>>(`/api/bookings/${bookingId}/decline`);
  return unwrap({ data });
}

export async function confirmBooking(bookingId: string): Promise<BookingApi> {
  const { data } = await api.put<ApiResponse<BookingApi>>(`/api/bookings/${bookingId}/confirm`);
  return unwrap({ data });
}

export interface PaymentInitializeResult {
  mockPayment: boolean;
  authorizationUrl?: string;
  reference?: string;
  bookingId?: string;
  amount?: number;
  currency?: string;
}

export interface PaymentVerifyResult {
  paid: boolean;
  reference?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  message?: string;
}

export async function initializeBookingPayment(
  bookingId: string,
  options?: { channels?: string[] },
): Promise<PaymentInitializeResult> {
  const { data } = await api.post<ApiResponse<PaymentInitializeResult>>(
    `/api/bookings/${bookingId}/payment/initialize`,
    options?.channels?.length ? { channels: options.channels } : {},
  );
  return unwrap({ data });
}

export async function verifyBookingPayment(
  bookingId: string,
): Promise<PaymentVerifyResult> {
  const { data } = await api.post<ApiResponse<PaymentVerifyResult>>(
    `/api/bookings/${bookingId}/payment/verify`,
  );
  return unwrap({ data });
}

export async function getBookingById(bookingId: string): Promise<BookingApi> {
  const { data } = await api.get<ApiResponse<BookingApi>>(`/api/bookings/${bookingId}`);
  return unwrap({ data });
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  const { data } = await api.get<ApiResponse<{ count: number }>>('/api/notifications/unread-count');
  const payload = unwrap({ data });
  return payload.count ?? 0;
}

export async function fetchNotifications(): Promise<import('../types/booking').AppNotification[]> {
  const { data } = await api.get<
    ApiResponse<
      Array<{
        id: string;
        type: string;
        title: string;
        body: string;
        read: boolean;
        createdAt: string;
        data?: { bookingId?: string; userId?: string };
      }>
    >
  >('/api/notifications');
  return unwrap({ data }).map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    read: item.read,
    createdAt: item.createdAt,
    type: item.type,
    relatedBookingId:
      typeof item.data?.bookingId === 'string' ? item.data.bookingId : undefined,
    relatedUserId:
      typeof item.data?.userId === 'string' ? item.data.userId : undefined,
  }));
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await api.put(`/api/notifications/${notificationId}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.put('/api/notifications/read-all');
}

export interface KycSessionResult {
  enabled: boolean;
  verificationUrl?: string;
  jobId?: string;
  message?: string;
}

export async function createKycSession(): Promise<KycSessionResult> {
  const { data } = await api.post<ApiResponse<KycSessionResult>>('/api/kyc/session');
  return unwrap({ data });
}

export async function registerDeviceToken(
  expoPushToken: string,
  platform: string,
): Promise<void> {
  await api.post('/api/users/me/device-tokens', { expoPushToken, platform });
}

export async function getNotificationsPreference(): Promise<boolean> {
  const { data } = await api.get<ApiResponse<{ enabled: boolean }>>(
    '/api/users/me/notifications-preference',
  );
  return Boolean(unwrap({ data }).enabled);
}

export async function setNotificationsPreference(
  enabled: boolean,
): Promise<boolean> {
  const { data } = await api.put<ApiResponse<{ enabled: boolean }>>(
    '/api/users/me/notifications-preference',
    { enabled },
  );
  return Boolean(unwrap({ data }).enabled);
}

export interface PhotoUploadUrlResult {
  enabled: boolean;
  uploadUrl?: string;
  publicUrl?: string;
  contentType?: string;
}

export async function getProfilePhotoUploadUrl(
  contentType = 'image/jpeg',
): Promise<PhotoUploadUrlResult> {
  const { data } = await api.post<ApiResponse<PhotoUploadUrlResult>>(
    '/api/users/me/profile-photo/upload-url',
    { contentType },
  );
  return unwrap({ data });
}

export async function cancelBooking(bookingId: string): Promise<BookingApi> {
  const { data } = await api.put<ApiResponse<BookingApi>>(`/api/bookings/${bookingId}/cancel`);
  return unwrap({ data });
}

export function mapLodgingPartner(dto: LodgingPartnerApi): LodgingListing {
  const category = (['HOTEL', 'GUESTHOUSE', 'PARTNER'].includes(dto.category)
    ? dto.category
    : 'PARTNER') as LodgingCategory;
  const priceHint =
    dto.priceFrom != null
      ? `From ${dto.currency ?? 'GHS'} ${Math.round(Number(dto.priceFrom))}/night`
      : 'Price on request';

  return {
    id: dto.partnerId,
    name: dto.name,
    category,
    city: dto.city,
    area: dto.address?.split(',')[0]?.trim() || dto.city,
    priceHint,
    rating: 4.5,
    phone: dto.phone,
    email: dto.email,
    bookingUrl: dto.bookingUrl ?? dto.websiteUrl,
    description: dto.description ?? '',
    icon: category === 'HOTEL' ? '🏨' : category === 'GUESTHOUSE' ? '🛏️' : '🤝',
  };
}

export async function getLodgingPartners(city?: string): Promise<LodgingListing[]> {
  const { data } = await api.get<ApiResponse<LodgingPartnerApi[]>>('/api/lodging/partners', {
    params: city ? { city: city.split(',')[0]?.trim() || city } : undefined,
  });
  return unwrap({ data }).map(mapLodgingPartner);
}

export async function getWelfareCheckIns(bookingId: string): Promise<WelfareCheckInApi[]> {
  const { data } = await api.get<ApiResponse<WelfareCheckInApi[]>>(
    `/api/welfare/checkins/${bookingId}`,
  );
  return unwrap({ data });
}

export async function submitWelfareCheckIn(
  bookingId: string,
  responses: Record<string, boolean>,
): Promise<WelfareCheckInApi> {
  const { data } = await api.post<ApiResponse<WelfareCheckInApi>>(
    `/api/welfare/checkins/${bookingId}`,
    { responses },
  );
  return unwrap({ data });
}

export interface ReviewApi {
  reviewId?: string;
  bookingId?: string;
  rating?: number;
  comment?: string;
  status?: string;
}

export async function submitReview(
  bookingId: string,
  rating: number,
  comment: string,
): Promise<ReviewApi> {
  const { data } = await api.post<ApiResponse<ReviewApi>>(
    `/api/reviews/bookings/${bookingId}`,
    { rating, comment },
  );
  return unwrap({ data });
}

export async function logSos(body: {
  locationLat?: number;
  locationLng?: number;
  contactedEmergency?: boolean;
  contactedSupport?: boolean;
}): Promise<void> {
  await api.post('/api/welfare/sos', body);
}

export async function createConversation(participantId: string): Promise<ConversationApi> {
  const { data } = await api.post<ApiResponse<ConversationApi>>('/api/conversations', {
    participantId,
  });
  const payload = unwrap({ data });
  return {
    ...payload,
    conversationId: String(payload.conversationId),
    participantA: String(payload.participantA),
    participantB: String(payload.participantB),
  };
}

export async function listConversations(): Promise<ConversationListApi[]> {
  const { data } = await api.get<ApiResponse<ConversationListApi[]>>('/api/conversations');
  return unwrap({ data });
}

export async function getConversationMessages(conversationId: string): Promise<ChatMessageApi[]> {
  const { data } = await api.get<ApiResponse<ChatMessageApi[]>>(
    `/api/conversations/${conversationId}/messages`,
  );
  return unwrap({ data });
}

export async function sendConversationMessage(
  conversationId: string,
  text: string,
): Promise<ChatMessageApi> {
  const { data } = await api.post<ApiResponse<ChatMessageApi>>(
    `/api/conversations/${conversationId}/messages`,
    { text },
  );
  return unwrap({ data });
}

async function fetchContent<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const { data } = await api.get<ApiResponse<T>>(path, { params });
  return unwrap({ data });
}

export async function getPhrases(city?: string): Promise<PhraseApi[]> {
  return fetchContent('/api/content/phrases', { city });
}

export async function getTopics(city?: string): Promise<TopicApi[]> {
  return fetchContent('/api/content/topics', { city });
}

export async function getTransport(city?: string): Promise<TransportTabApi[]> {
  return fetchContent('/api/content/transport', { city });
}

export async function getSites(city?: string): Promise<TouristSiteApi[]> {
  return fetchContent('/api/content/sites', { city });
}

export async function getSite(siteKey: string): Promise<TouristSiteApi> {
  return fetchContent(`/api/content/sites/${siteKey}`);
}

export async function getChecklist(city?: string): Promise<ChecklistItemApi[]> {
  return fetchContent('/api/content/checklist', { city });
}

export async function getEmergencyContacts(): Promise<EmergencyContactApi[]> {
  return fetchContent('/api/content/emergency-contacts');
}

export async function getMapLandmarks(city?: string): Promise<MapLandmarkApi[]> {
  return fetchContent('/api/content/map-landmarks', { city });
}

export async function getVideos(city?: string, category?: string): Promise<VideoResourceApi[]> {
  return fetchContent('/api/content/videos', { city, category });
}

export async function getVideo(videoKey: string): Promise<VideoResourceApi> {
  return fetchContent(`/api/content/videos/${videoKey}`);
}

export interface StudentEventApi {
  eventId: string;
  hostId: string;
  title: string;
  type: StudentEventType;
  organizerKind: StudentEventOrganizerKind;
  organizerName: string;
  organizerInitials: string;
  eventDateLabel: string;
  location: string;
  description: string;
  capacity: number;
  attendeeCount: number;
  spotsLeft: number;
  joined: boolean;
  hostedByYou: boolean;
  createdAt?: string;
}

export function mapStudentEvent(dto: StudentEventApi): StudentEvent {
  return {
    id: dto.eventId,
    title: dto.title,
    type: dto.type,
    organizerKind: dto.organizerKind,
    organizerName: dto.organizerName,
    organizerInitials: dto.organizerInitials,
    dateLabel: dto.eventDateLabel,
    location: dto.location,
    description: dto.description,
    capacity: dto.capacity,
    attending: dto.attendeeCount,
    hostedByYou: dto.hostedByYou,
  };
}

export async function listStudentEvents(): Promise<StudentEventApi[]> {
  const { data } = await api.get<ApiResponse<StudentEventApi[]>>('/api/events');
  return unwrap({ data });
}

export async function createStudentEvent(
  draft: StudentEventDraft,
): Promise<StudentEventApi> {
  const capacityNum = parseInt(draft.capacity, 10);
  const { data } = await api.post<ApiResponse<StudentEventApi>>('/api/events', {
    title: draft.title,
    type: draft.type,
    organizerKind: draft.organizerKind,
    eventDateLabel: draft.dateLabel,
    location: draft.location,
    capacity: Number.isFinite(capacityNum) && capacityNum > 0 ? capacityNum : null,
    description: draft.description,
  });
  return unwrap({ data });
}

export async function joinStudentEvent(eventId: string): Promise<StudentEventApi> {
  const { data } = await api.post<ApiResponse<StudentEventApi>>(
    `/api/events/${eventId}/join`,
  );
  return unwrap({ data });
}

export async function leaveStudentEvent(eventId: string): Promise<StudentEventApi> {
  const { data } = await api.post<ApiResponse<StudentEventApi>>(
    `/api/events/${eventId}/leave`,
  );
  return unwrap({ data });
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const msg = (error.response?.data as ApiResponse<unknown> | undefined)?.message;

    if (msg && typeof msg === 'string' && msg.trim()) {
      return msg;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Server is waking up — wait a few seconds and try again.';
    }

    // No HTTP response → DNS / TLS / offline / server unreachable (phone can still show 4G).
    if (!error.response) {
      return 'Connection issue — wait a few seconds and try again.';
    }

    if (status === 429) {
      return 'Too many attempts. Please wait a minute and try again.';
    }
    if (status === 503 || status === 502) {
      return 'Email delivery is temporarily unavailable. Please try again shortly.';
    }
    if (status === 401) {
      return 'Your session has expired. Please sign in again.';
    }
    if (status === 403) {
      return 'You do not have permission to do that.';
    }
    if (status != null && status >= 500) {
      return 'The server ran into a problem. Please try again.';
    }

    return error.message || 'Something went wrong.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

export default api;
