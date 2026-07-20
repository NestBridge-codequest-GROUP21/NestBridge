/**
 * Personalized home recommendations — destination-aware, role-specific.
 */

export type RecommendationItemType =
  | 'INSTITUTION'
  | 'HOST'
  | 'GUIDE'
  | 'SITE'
  | 'LODGING'
  | 'TRANSPORT'
  | 'CULTURE'
  | 'RESOURCE'
  | 'PROFILE_TIP'
  | 'OPPORTUNITY';

export type RecommendationLayout = 'list' | 'grid';

export interface RecommendationItem {
  id: string;
  type: RecommendationItemType;
  title: string;
  subtitle: string;
  icon?: string;
  reason?: string;
  targetId?: string;
  routeHint?: string;
  matchPercentage?: number;
  priceLabel?: string;
}

export interface RecommendationSection {
  id: string;
  title: string;
  layout: RecommendationLayout;
  items: RecommendationItem[];
}

export interface HomeRecommendations {
  city: string;
  role: string;
  headline: string;
  sections: RecommendationSection[];
}
