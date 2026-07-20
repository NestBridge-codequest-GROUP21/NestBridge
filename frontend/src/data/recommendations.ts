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
  layout: 'list' | 'grid' | 'featured',
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
    location: normalizeCity(city),
    icon: '🎓',
    reason:
      university && name.toLowerCase().includes(university.toLowerCase())
        ? 'Matches your selected university'
        : `Recommended because you selected ${normalizeCity(city)}`,
    actionLabel: 'View',
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
    location: normalizeCity(city),
    icon: '🎓',
    reason: 'Closest campuses for this destination',
    actionLabel: 'View',
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
      location: host.location,
      icon: '🏡',
      reason: `Recommended because you selected ${normalizeCity(city)}`,
      targetId: host.id,
      routeHint: 'HostProfile',
      priceLabel: `GHS ${host.pricePerNight}/night`,
      matchPercentage: host.compatibilityScore,
      actionLabel: 'View stay',
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
      location: guide.location,
      icon: '🗺️',
      reason: `Local guide for ${normalizeCity(city)}`,
      targetId: guide.id,
      routeHint: 'GuideProfile',
      priceLabel: `GHS ${guide.pricePerSession}/session`,
      actionLabel: 'View guide',
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
      location: site.city,
      icon: site.icon,
      reason: `Recommended because you selected ${normalizeCity(city)}`,
      targetId: site.id,
      routeHint: 'TouristSiteDetail',
      actionLabel: 'Explore',
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
      location: listing.city,
      icon: '🏨',
      reason: `Lodging near ${normalizeCity(city)}`,
      targetId: listing.id,
      routeHint: 'LodgingDetail',
      actionLabel: 'View stay',
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
        location: capital,
        icon: '🌿',
        reason: `Cultural tip for ${capital}`,
        actionLabel: 'Read tip',
        routeHint: 'LocalTips',
      },
      {
        id: 'culture-damongo-2',
        type: 'CULTURE',
        title: 'Visiting Mole respectfully',
        subtitle: 'Stay with park guides and never feed wildlife',
        location: capital,
        icon: '🐘',
        reason: `Cultural tip for ${capital}`,
        actionLabel: 'Read tip',
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
        location: capital,
        icon: '🏛️',
        reason: `Cultural tip for ${capital}`,
        actionLabel: 'Read tip',
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
      location: capital,
      icon: '🤝',
      reason: `Cultural tip for ${capital}`,
      actionLabel: 'Read tip',
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
        location: capital,
        icon: '🚌',
        reason: `Transport for ${capital}`,
        actionLabel: 'Open',
        routeHint: 'TransportGuide',
      },
      {
        id: 'transport-damongo-2',
        type: 'TRANSPORT',
        title: 'Damongo → Mole Park',
        subtitle: 'Shared taxis and park transfers',
        location: capital,
        icon: '🚐',
        reason: `Transport for ${capital}`,
        actionLabel: 'Open',
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
      location: capital,
      icon: '🚌',
      reason: `Getting around ${capital}`,
      actionLabel: 'Open',
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
      location: capital,
      icon: '✅',
      reason: 'Prepare before you travel',
      actionLabel: 'Open',
      routeHint: 'PrepChecklist',
    },
    {
      id: 'resource-videos',
      type: 'RESOURCE',
      title: 'Orientation videos',
      subtitle: 'Transport, culture, and settling-in guides',
      location: capital,
      icon: '🎬',
      reason: 'Prepare before you travel',
      actionLabel: 'Open',
      routeHint: 'VideoLibrary',
    },
    {
      id: 'resource-sponsors',
      type: 'RESOURCE',
      title: 'Sponsors & support',
      subtitle: 'Scholarships and travel partners',
      location: 'Ghana',
      icon: '🎓',
      reason: 'Student support options',
      actionLabel: 'Open',
      routeHint: 'SponsorList',
    },
    {
      id: 'resource-events',
      type: 'RESOURCE',
      title: 'Student events',
      subtitle: `Meetups near ${capital}`,
      location: capital,
      icon: '📅',
      reason: 'Connect after you arrive',
      actionLabel: 'Open',
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
    headline:
      role === 'HOST'
        ? `Picked for hosts in ${capital}`
        : `Picked for guides in ${capital}`,
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
      section('institutions', 'Nearby universities', 'list', institutionItems(capital, options?.university)),
      section('accommodation', `Homestays near ${capital}`, 'list', hostItems(capital)),
      section('transport', `Getting to ${capital}`, 'list', transportItems(capital)),
      section('guides', 'Local guides', 'list', guideItems(capital)),
      section('culture', 'Culture & local tips', 'grid', cultureItems(capital)),
      section('resources', 'Arrival resources', 'list', studentResources(capital)),
    ].filter((s) => s.items.length > 0);

    return {
      city: capital,
      role: 'STUDENT',
      headline: `Picked for your stay in ${capital}`,
      sections,
    };
  }

  // TOURIST + BROWSE
  const food = guideItems(capital, true);
  const sections = [
    section('attractions', `Places to explore`, 'grid', siteItems(capital)),
    section('guides', 'Local guides', 'list', guideItems(capital)),
    section(
      'food',
      'Featured experiences',
      'featured',
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
    section('culture', 'Culture & local tips', 'grid', cultureItems(capital)),
  ].filter((s) => s.items.length > 0);

  return {
    city: capital,
    role: role === 'BROWSE' ? 'TOURIST' : role,
    headline: `Picked for your stay in ${capital}`,
    sections,
  };
}
