import type { ExploreSectionItem } from '../screens/tourist/ExploreHomeScreen';
import {
  touristSitesForCity,
  type TouristSiteSummary,
} from './touristSitesMock';

function siteToExploreSection(site: TouristSiteSummary): ExploreSectionItem {
  return {
    id: site.id,
    title: site.name,
    subtitle: site.description.split('.')[0] ?? site.city,
    icon: site.icon,
    accent: site.accent,
  };
}

/** Full national carousel — used only when city has no local sites. */
export const exploreSectionsMock: ExploreSectionItem[] =
  touristSitesForCity('').map(siteToExploreSection);

/** Destination-scoped Explore cards — Accra never shows Cape Coast Castle as first tap. */
export function exploreSectionsForCity(city: string): ExploreSectionItem[] {
  return touristSitesForCity(city).map(siteToExploreSection);
}
