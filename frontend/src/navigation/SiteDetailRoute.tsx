import React from 'react';
import TouristSiteDetailScreen from '../screens/tourist/TouristSiteDetailScreen';
import RouteErrorState from '../components/RouteErrorState';
import { useSite } from '../hooks/useContent';
import { touristSiteFromId } from '../data/touristSitesMock';

export interface SiteDetailRouteProps {
  siteKey: string;
  onBack?: () => void;
  onFindGuidePress?: () => void;
}

export default function SiteDetailRoute({
  siteKey,
  onBack,
  onFindGuidePress,
}: SiteDetailRouteProps) {
  const siteApi = useSite(siteKey, !!siteKey);
  const mockSite = touristSiteFromId(siteKey);

  if (siteApi.isLoading && !mockSite) {
    return <RouteErrorState isLoading message="" />;
  }

  const apiSite = siteApi.data;
  if (!apiSite && !mockSite) {
    return (
      <RouteErrorState
        title="Site unavailable"
        message={siteApi.error ?? 'We could not load this site.'}
        onBack={onBack}
        onRetry={() => siteApi.refresh()}
      />
    );
  }

  const site = apiSite
    ? {
        name: apiSite.name,
        city: apiSite.city,
        description: apiSite.description,
        openingHours: apiSite.openingHours ?? '',
        admission: apiSite.admission ?? '',
      }
    : mockSite!;

  return (
    <TouristSiteDetailScreen
      site={site}
      onBack={onBack}
      onFindGuidePress={onFindGuidePress}
    />
  );
}
