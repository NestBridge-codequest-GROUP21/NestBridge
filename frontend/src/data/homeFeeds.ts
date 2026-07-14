import type { FeaturedHomeCardProps } from '../components/FeaturedHomeCard';
import type { DiscoveryListingItem } from '../components/DiscoveryListingSection';
import type { MatchResult, MatchFindParams } from '../services/api';
import type { MatchResultHost } from '../screens/student/MatchResultsScreen';
import { sampleMatchResults } from '../screens/student/MatchResultsScreen';
import type { SuggestedHostItem } from '../screens/student/StudentHomeDashboard';
import type { GuideProfileSummary, HostProfileSummary } from '../types/booking';
import type { StayListing } from './featureScreensMock';
import type { AccountProfileState } from '../types/accountProfile';
import { FLEXIBLE_POLICY } from './bookingMock';
import { suggestedGuidesMock } from './guideSessionMock';

const DEFAULT_MATCH_REASONS = [
  'Verified host family',
  'Location matches your destination',
];

function ensureMatchReasons(reasons: string[] | undefined): string[] {
  const list = [...(reasons ?? [])];
  for (const fallback of DEFAULT_MATCH_REASONS) {
    if (list.length >= 2) break;
    if (!list.includes(fallback)) list.push(fallback);
  }
  return list.slice(0, 4);
}

function initialsFromName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function matchToMatchResultHost(match: MatchResult): MatchResultHost {
  return {
    id: match.targetId,
    matchId: match.matchId,
    hostName: match.targetName,
    initials: match.initials ?? initialsFromName(match.targetName),
    compatibilityScore: Math.round(match.compatibilityScore),
    trustBadge: match.trustBadge ?? 'VERIFIED',
    matchReasons: ensureMatchReasons(match.matchReasons),
    pricePerNight: match.pricePerNight ?? 0,
    currency: 'GHS',
    location: match.location ?? 'Ghana',
  };
}

export function matchToFeaturedCard(
  match: MatchResult,
): Omit<FeaturedHomeCardProps, 'onPress'> {
  const isGuide = match.targetType === 'GUIDE';
  const price = match.pricePerNight != null
    ? isGuide
      ? `GHS ${Math.round(match.pricePerNight)}/session`
      : `GHS ${Math.round(match.pricePerNight)}/night`
    : '';

  return {
    sectionLabel: isGuide ? 'Recommended for you' : 'Your top match',
    name: match.targetName,
    badge: `${Math.round(match.compatibilityScore)}% match`,
    details: [match.location, price].filter(Boolean).join(' · '),
    matchReasons: ensureMatchReasons(match.matchReasons).slice(0, 2),
    ctaLabel: isGuide ? 'See all guides →' : 'View profile →',
    initials: match.initials ?? initialsFromName(match.targetName),
  };
}

export function matchToSuggestedHost(match: MatchResult): SuggestedHostItem {
  return {
    id: match.targetId,
    name: match.targetName,
    matchPercentage: Math.round(match.compatibilityScore),
    location: match.location ?? 'Ghana',
    pricePerNight: match.pricePerNight != null
      ? `GHS ${Math.round(match.pricePerNight)}/night`
      : 'Price on request',
  };
}

export function matchToDiscoveryItem(match: MatchResult): DiscoveryListingItem {
  const isGuide = match.targetType === 'GUIDE';
  return {
    id: match.targetId,
    name: match.targetName,
    subtitle: match.location ?? 'Ghana',
    priceLabel: match.pricePerNight != null
      ? isGuide
        ? `GHS ${Math.round(match.pricePerNight)}/day`
        : `GHS ${Math.round(match.pricePerNight)}/night`
      : 'Price on request',
    initials: match.initials ?? initialsFromName(match.targetName),
    matchPercentage: Math.round(match.compatibilityScore),
  };
}

export function matchToGuideSummary(match: MatchResult): GuideProfileSummary {
  return {
    id: match.targetId,
    matchId: match.matchId,
    name: match.targetName,
    initials: match.initials ?? initialsFromName(match.targetName),
    location: match.location ?? 'Ghana',
    matchPercentage: Math.round(match.compatibilityScore),
    pricePerSession: match.pricePerNight ?? 0,
    sessionDurationHours: 3,
    currency: 'GHS',
    serviceTypes: ensureMatchReasons(match.matchReasons).slice(0, 2),
    languages: ['English'],
    cancellationPolicy: FLEXIBLE_POLICY,
    icon: '🗺️',
  };
}

export function matchToHostSummary(match: MatchResult): HostProfileSummary {
  return {
    id: match.targetId,
    matchId: match.matchId,
    name: match.targetName,
    initials: match.initials ?? initialsFromName(match.targetName),
    location: match.location ?? 'Ghana',
    matchPercentage: Math.round(match.compatibilityScore),
    pricePerNight: match.pricePerNight ?? 0,
    currency: 'GHS',
    cancellationPolicy: FLEXIBLE_POLICY,
    icon: '🏡',
  };
}

export function hostMatchesToStayListings(matches: MatchResult[]): StayListing[] {
  return matches
    .filter((m) => m.targetType === 'HOST')
    .slice(0, 6)
    .map((match, index) => ({
      id: match.targetId,
      title: `${match.targetName}'s Homestay`,
      location: match.location ?? 'Ghana',
      rating: match.compatibilityScore >= 90 ? 5 : match.compatibilityScore >= 80 ? 4 : 4,
      pricePerNight: match.pricePerNight != null
        ? `GHS ${Math.round(match.pricePerNight)}/night`
        : 'Price on request',
      verifiedHost: true,
      amenities: ['Wifi', 'Meals'],
      imageEmoji: index % 2 === 0 ? '🏡' : '🏠',
    }));
}

export function matchResultHostToHostSummary(host: MatchResultHost): HostProfileSummary {
  return {
    id: host.id,
    matchId: host.matchId,
    name: host.hostName,
    initials: host.initials,
    location: host.location,
    matchPercentage: host.compatibilityScore,
    pricePerNight: host.pricePerNight,
    currency: host.currency,
    cancellationPolicy: FLEXIBLE_POLICY,
    icon: '🏡',
  };
}

export function buildDemoHostProfileCache(): Record<string, HostProfileSummary> {
  const cache: Record<string, HostProfileSummary> = {};
  for (const host of sampleMatchResults) {
    cache[host.id] = matchResultHostToHostSummary(host);
  }
  return cache;
}

export function buildDemoGuideProfileCache(): Record<string, GuideProfileSummary> {
  const cache: Record<string, GuideProfileSummary> = {};
  for (const guide of suggestedGuidesMock) {
    cache[guide.id] = guide;
  }
  return cache;
}

export function guideSummariesToDiscoveryItems(
  guides: GuideProfileSummary[],
): DiscoveryListingItem[] {
  return guides.map((guide) => ({
    id: guide.id,
    name: guide.name,
    subtitle: guide.location,
    priceLabel: `GHS ${Math.round(guide.pricePerSession)}/session`,
    initials: guide.initials,
    matchPercentage: guide.matchPercentage,
  }));
}

export function matchResultsToStayListings(results: MatchResultHost[]): StayListing[] {
  return results.slice(0, 6).map((host, index) => ({
    id: host.id,
    title: `${host.hostName}'s Homestay`,
    location: host.location,
    rating: host.compatibilityScore >= 90 ? 5 : 4,
    pricePerNight: `${host.currency} ${host.pricePerNight}/night`,
    verifiedHost: true,
    amenities: ['Wifi', 'Meals'],
    imageEmoji: index % 2 === 0 ? '🏡' : '🏠',
  }));
}

export const demoTopMatchHostId = sampleMatchResults[0]?.id ?? 'host-1';
export const demoTopGuideId = suggestedGuidesMock[0]?.id ?? 'guide-1';

export function buildHostMatchParams(
  profileState: AccountProfileState,
  overrides?: Partial<MatchFindParams>,
): MatchFindParams {
  const data = profileState.seekerSetup.data;
  const city = data.city?.split(',')[0]?.trim() || data.city || 'Accra';
  return {
    city,
    checkIn: data.arrivalDate || undefined,
    checkOut: data.departureDate || undefined,
    maxBudget: 300,
    targetType: 'HOST',
    universityLat: 5.6504,
    universityLng: -0.187,
    preferredLanguages: ['English'],
    ...overrides,
  };
}

export function buildGuideMatchParams(
  profileState: AccountProfileState,
  overrides?: Partial<MatchFindParams>,
): MatchFindParams {
  const data = profileState.seekerSetup.data;
  const city = data.city?.split(',')[0]?.trim() || data.city || 'Accra';
  return {
    city,
    maxBudget: 300,
    targetType: 'GUIDE',
    ...overrides,
  };
}

export function buildSearchMatchParams(
  profileState: AccountProfileState,
  search: {
    destinationCity: string;
    checkIn: string;
    checkOut: string;
    budgetMax: number;
  },
): MatchFindParams {
  return {
    city: search.destinationCity.split(',')[0]?.trim() || search.destinationCity,
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    maxBudget: search.budgetMax,
    targetType: 'HOST',
    universityLat: 5.6504,
    universityLng: -0.187,
    preferredLanguages: ['English'],
  };
}
