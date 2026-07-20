import type {
  HomeRecommendations,
  RecommendationSection,
} from '../types/recommendations';

const SEEKER_HOME_SECTION_IDS = new Set([
  // Homestays/guides already appear in DiscoveryListing on home.
  'attractions',
]);

const PROVIDER_HOME_SECTION_IDS = new Set(['profile-tips']);

/**
 * Home dashboards only surface “what matters nearby” — prep, culture,
 * universities, videos, and explore catalogues live under Explore.
 */
export function slimHomeRecommendationSections(
  sections: RecommendationSection[],
  role: string,
): RecommendationSection[] {
  const allow =
    role === 'HOST' || role === 'GUIDE'
      ? PROVIDER_HOME_SECTION_IDS
      : SEEKER_HOME_SECTION_IDS;

  return sections
    .filter((section) => allow.has(section.id) && section.items.length > 0)
    .map((section) => ({
      ...section,
      items: section.items.slice(0, 3),
    }));
}

export function slimHomeRecommendations(
  recommendations: HomeRecommendations,
): HomeRecommendations {
  return {
    ...recommendations,
    headline:
      recommendations.role === 'HOST' || recommendations.role === 'GUIDE'
        ? 'Tips for your listing'
        : `Nearby in ${recommendations.city}`,
    sections: slimHomeRecommendationSections(
      recommendations.sections,
      recommendations.role,
    ),
  };
}
