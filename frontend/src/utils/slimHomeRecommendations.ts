import type {
  HomeRecommendations,
  RecommendationSection,
} from '../types/recommendations';

/**
 * Student home keep-list is intentionally empty.
 * Culture, prepare-for-arrival, universities, transport, and sponsors live on
 * the Explore tab (and dedicated screens) — not the Home dashboard.
 * Do NOT re-add institutions / transport / culture / resources here.
 */
const STUDENT_HOME_SECTION_IDS = new Set<string>();

/**
 * Tourist / browse home: visit Ghana — skip duplicating “Guides nearby” list.
 * Culture tips stay on Explore; keep destination highlights only.
 */
const TOURIST_HOME_SECTION_IDS = new Set([
  'attractions',
  'food',
  'accommodation',
]);

/**
 * Host / guide home: short profile tips only.
 * Operational “opportunities” and tour-type grids belong on Bookings /
 * Availability / Explore — not duplicated on Home.
 */
const PROVIDER_HOME_SECTION_IDS = new Set(['profile-tips']);

function allowListForRole(role: string): Set<string> {
  switch (role) {
    case 'HOST':
    case 'GUIDE':
      return PROVIDER_HOME_SECTION_IDS;
    case 'STUDENT':
      return STUDENT_HOME_SECTION_IDS;
    case 'TOURIST':
    case 'BROWSE':
    default:
      return TOURIST_HOME_SECTION_IDS;
  }
}

function headlineForRole(recommendations: HomeRecommendations): string {
  switch (recommendations.role) {
    case 'HOST':
      return 'Tips for hosting';
    case 'GUIDE':
      return 'Tips for guiding';
    case 'STUDENT':
      return `Settling into ${recommendations.city}`;
    case 'TOURIST':
    case 'BROWSE':
    default:
      return `Exploring ${recommendations.city}`;
  }
}

/**
 * Keep only role-relevant home recommendation sections.
 * Full catalogues stay on Explore / dedicated screens.
 */
export function slimHomeRecommendationSections(
  sections: RecommendationSection[],
  role: string,
): RecommendationSection[] {
  const allow = allowListForRole(role);

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
    headline: headlineForRole(recommendations),
    sections: slimHomeRecommendationSections(
      recommendations.sections,
      recommendations.role,
    ),
  };
}
