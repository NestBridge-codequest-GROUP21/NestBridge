import type { PrimaryIntent } from '../types/accountProfile';
import type {
  HomeRecommendations,
  RecommendationItem,
  RecommendationSection,
} from '../types/recommendations';
import {
  normalizeCity,
  nearbyUniversitiesForCity,
  recommendationSearchCities,
  universitiesForCity,
} from './ghanaReference';
import { touristSitesMock } from './touristSitesMock';
import { suggestedGuidesMock } from './guideSessionMock';
import { allSampleMatchResults } from './matchResultsMock';
import { lodgingDirectoryMock } from './lodgingDirectoryMock';

function section(
  id: string,
  title: string,
  layout: 'list' | 'grid',
  items: RecommendationItem[],
): RecommendationSection {
  return { id, title, layout, items: items.slice(0, 4) };
}

function cityInCluster(itemCity: string, destination: string): boolean {
  const dest = normalizeCity(destination);
  const cities = recommendationSearchCities(dest);
  return cities.some((c) => normalizeCity(itemCity) === c);
}

function institutionItems(city: string, university?: string): RecommendationItem[] {
  const local = universitiesForCity(city).map((name) => ({
    id: `inst-${name}`,
    type: 'INSTITUTION' as const,
    title: name,
    subtitle: `Institution near ${normalizeCity(city)}`,
    icon: '🎓',
    reason:
      university && name.toLowerCase().includes(university.toLowerCase())
        ? 'Matches your selected university'
        : 'Local to your destination',
    routeHint: 'PrepChecklist',
  }));
  if (local.length > 0) {
    return local;
  }
  return nearbyUniversitiesForCity(city).map((name) => ({
    id: `inst-near-${name}`,
    type: 'INSTITUTION' as const,
    title: name,
    subtitle: `Nearby hub for students heading to ${normalizeCity(city)}`,
    icon: '🎓',
    reason: 'Closest campuses for this destination',
    routeHint: 'PrepChecklist',
  }));
}

function hostItems(city: string): RecommendationItem[] {
  return allSampleMatchResults
    .filter((host) => cityInCluster(host.location, city))
    .slice(0, 4)
    .map((host) => ({
      id: host.id,
      type: 'HOST' as const,
      title: host.hostName,
      subtitle: `${host.location} · GHS ${host.pricePerNight}/night`,
      icon: '🏡',
      reason: `Homestay near ${normalizeCity(city)}`,
      targetId: host.id,
      routeHint: 'HostProfile',
      priceLabel: `GHS ${host.pricePerNight}/night`,
      matchPercentage: host.compatibilityScore,
    }));
}

function guideItems(city: string, foodOnly = false): RecommendationItem[] {
  return suggestedGuidesMock
    .filter((guide) => cityInCluster(guide.location, city))
    .filter((guide) =>
      foodOnly
        ? guide.serviceTypes.some((s) => /food|market|culinary/i.test(s))
        : true,
    )
    .slice(0, 4)
    .map((guide) => ({
      id: guide.id,
      type: 'GUIDE' as const,
      title: guide.name,
      subtitle: `${guide.serviceTypes.slice(0, 2).join(', ')} · ${guide.location}`,
      icon: '🗺️',
      reason: `Local guide for ${normalizeCity(city)}`,
      targetId: guide.id,
      routeHint: 'GuideProfile',
      priceLabel: `GHS ${guide.pricePerSession}/session`,
    }));
}

function siteItems(city: string): RecommendationItem[] {
  return touristSitesMock
    .filter((site) => cityInCluster(site.city, city))
    .slice(0, 4)
    .map((site) => ({
      id: site.id,
      type: 'SITE' as const,
      title: site.name,
      subtitle: `${site.city} · ${site.admission}`,
      icon: site.icon,
      reason: `Attraction near ${normalizeCity(city)}`,
      targetId: site.id,
      routeHint: 'TouristSiteDetail',
    }));
}

function lodgingItems(city: string): RecommendationItem[] {
  return lodgingDirectoryMock
    .filter((listing) => cityInCluster(listing.city, city))
    .slice(0, 4)
    .map((listing) => ({
      id: listing.id,
      type: 'LODGING' as const,
      title: listing.name,
      subtitle: `${listing.city} · ${listing.category}`,
      icon: '🏨',
      reason: `Lodging near ${normalizeCity(city)}`,
      targetId: listing.id,
      routeHint: 'LodgingDetail',
    }));
}

function cultureItems(city: string): RecommendationItem[] {
  const capital = normalizeCity(city);
  if (capital === 'Damongo') {
    return [
      {
        id: 'culture-damongo-1',
        type: 'CULTURE',
        title: 'Savannah hospitality',
        subtitle: 'Greet elders first and dress modestly in village settings',
        icon: '🌿',
        reason: `Cultural tip for ${capital}`,
        routeHint: 'LocalTips',
      },
      {
        id: 'culture-damongo-2',
        type: 'CULTURE',
        title: 'Visiting Mole respectfully',
        subtitle: 'Stay with park guides and never feed wildlife',
        icon: '🐘',
        reason: `Cultural tip for ${capital}`,
        routeHint: 'LocalTips',
      },
    ];
  }
  if (capital === 'Cape Coast') {
    return [
      {
        id: 'culture-cc-1',
        type: 'CULTURE',
        title: 'Heritage site etiquette',
        subtitle: 'Quiet respect at castles and memorials',
        icon: '🏛️',
        reason: `Cultural tip for ${capital}`,
        routeHint: 'LocalTips',
      },
    ];
  }
  return [
    {
      id: 'culture-accra-1',
      type: 'CULTURE',
      title: 'Handshake norms',
      subtitle: 'Use your right hand and greet elders first',
      icon: '🤝',
      reason: `Cultural tip for ${capital}`,
      routeHint: 'LocalTips',
    },
  ];
}

function transportItems(city: string): RecommendationItem[] {
  const capital = normalizeCity(city);
  if (capital === 'Damongo') {
    return [
      {
        id: 'transport-damongo-1',
        type: 'TRANSPORT',
        title: 'Tamale → Damongo',
        subtitle: 'STC / shared vans from Tamale station',
        icon: '🚌',
        reason: `Transport for ${capital}`,
        routeHint: 'TransportGuide',
      },
      {
        id: 'transport-damongo-2',
        type: 'TRANSPORT',
        title: 'Damongo → Mole Park',
        subtitle: 'Shared taxis and park transfers',
        icon: '🚐',
        reason: `Transport for ${capital}`,
        routeHint: 'TransportGuide',
      },
    ];
  }
  return [
    {
      id: 'transport-generic',
      type: 'TRANSPORT',
      title: 'Transport guide',
      subtitle: `Tro-tro, ride apps, and safe transfers in ${capital}`,
      icon: '🚌',
      reason: `Getting around ${capital}`,
      routeHint: 'TransportGuide',
    },
  ];
}

function studentResources(city: string): RecommendationItem[] {
  const capital = normalizeCity(city);
  return [
    {
      id: 'resource-checklist',
      type: 'RESOURCE',
      title: 'Prep checklist',
      subtitle: `Documents and arrival tasks for ${capital}`,
      icon: '✅',
      routeHint: 'PrepChecklist',
    },
    {
      id: 'resource-videos',
      type: 'RESOURCE',
      title: 'Orientation videos',
      subtitle: 'Transport, culture, and settling-in guides',
      icon: '🎬',
      routeHint: 'VideoLibrary',
    },
    {
      id: 'resource-sponsors',
      type: 'RESOURCE',
      title: 'Sponsors & support',
      subtitle: 'Scholarships and travel partners',
      icon: '🎓',
      routeHint: 'SponsorList',
    },
    {
      id: 'resource-events',
      type: 'RESOURCE',
      title: 'Student events',
      subtitle: `Meetups near ${capital}`,
      icon: '📅',
      routeHint: 'StudentEvents',
    },
  ];
}

function providerTips(role: 'HOST' | 'GUIDE', city: string): HomeRecommendations {
  const capital = normalizeCity(city);
  const tips: RecommendationItem[] =
    role === 'HOST'
      ? [
          {
            id: 'tip-host-photos',
            type: 'PROFILE_TIP',
            title: 'Add listing photos',
            subtitle: 'Homes with photos get more booking requests',
            icon: '📸',
            reason: 'Improve visibility',
            routeHint: 'HostListings',
          },
          {
            id: 'tip-host-rules',
            type: 'PROFILE_TIP',
            title: 'Clarify house rules',
            subtitle: 'Clear rules help the right guests choose you',
            icon: '✅',
            reason: 'Profile quality',
            routeHint: 'HostListings',
          },
        ]
      : [
          {
            id: 'tip-guide-tours',
            type: 'PROFILE_TIP',
            title: 'Add tour types',
            subtitle: `City and heritage tours perform well in ${capital}`,
            icon: '🎯',
            reason: 'Tour catalogue',
            routeHint: 'TourTypesSetup',
          },
          {
            id: 'tip-guide-slots',
            type: 'PROFILE_TIP',
            title: 'Open more session slots',
            subtitle: `Travellers in ${capital} are looking for guides`,
            icon: '🗓️',
            reason: 'Availability',
            routeHint: 'GuideAvailability',
          },
        ];

  const opportunities: RecommendationItem[] =
    role === 'HOST'
      ? [
          {
            id: 'opp-host-requests',
            type: 'OPPORTUNITY',
            title: 'Review incoming stay requests',
            subtitle: `Students looking for homes in ${capital}`,
            icon: '📩',
            routeHint: 'HostRequestsTab',
          },
        ]
      : [
          {
            id: 'opp-guide-sites',
            type: 'OPPORTUNITY',
            title: 'Highlight local attractions',
            subtitle: `Pair tours with sites near ${capital}`,
            icon: '🏛️',
            routeHint: 'SitesDirectory',
          },
        ];

  return {
    city: capital,
    role,
    headline: 'Recommended for you',
    sections: [
      section('profile-tips', `Improve your ${role === 'HOST' ? 'host' : 'guide'} profile`, 'list', tips),
      section('opportunities', 'Relevant opportunities', 'list', opportunities),
    ].filter((s) => s.items.length > 0),
  };
}

/**
 * Offline / demo recommendations — always destination-scoped.
 * Damongo never returns Accra institutions or Accra-only attractions.
 */
export function buildDemoHomeRecommendations(
  role: PrimaryIntent | 'BROWSE',
  city: string,
  options?: { university?: string },
): HomeRecommendations {
  const capital = normalizeCity(city);

  if (role === 'HOST' || role === 'GUIDE') {
    return providerTips(role, capital);
  }

  if (role === 'STUDENT') {
    const sections = [
      section('institutions', 'Nearby institutions', 'list', institutionItems(capital, options?.university)),
      section('accommodation', `Accommodation near ${capital}`, 'list', hostItems(capital)),
      section('transport', `Getting around ${capital}`, 'grid', transportItems(capital)),
      section('guides', 'Local guides', 'list', guideItems(capital)),
      section('culture', 'Cultural tips', 'grid', cultureItems(capital)),
      section('resources', 'Student resources', 'grid', studentResources(capital)),
    ].filter((s) => s.items.length > 0);

    return {
      city: capital,
      role: 'STUDENT',
      headline: `Recommended for you in ${capital}`,
      sections,
    };
  }

  // TOURIST + BROWSE
  const food = guideItems(capital, true);
  const sections = [
    section('attractions', `Attractions near ${capital}`, 'list', siteItems(capital)),
    section('guides', 'Guides for your trip', 'list', guideItems(capital)),
    section(
      'food',
      'Food experiences',
      'list',
      food.length > 0
        ? food
        : siteItems(capital).filter((s) => /market|food|beach/i.test(s.title + s.subtitle)),
    ),
    section(
      'accommodation',
      'Places to stay',
      'list',
      lodgingItems(capital).length > 0 ? lodgingItems(capital) : hostItems(capital),
    ),
    section('culture', 'Cultural information', 'grid', cultureItems(capital)),
  ].filter((s) => s.items.length > 0);

  return {
    city: capital,
    role: role === 'BROWSE' ? 'TOURIST' : role,
    headline: `Recommended for you in ${capital}`,
    sections,
  };
}
