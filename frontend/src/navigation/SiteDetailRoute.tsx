import React from 'react';
import TouristSiteDetailScreen from '../screens/tourist/TouristSiteDetailScreen';
import RouteErrorState from '../components/RouteErrorState';
import { useSite } from '../hooks/useContent';

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

  if (siteApi.isLoading) {
    return <RouteErrorState isLoading message="" />;
  }

  if (siteApi.error || !siteApi.data) {
    return (
      <RouteErrorState
        title="Site unavailable"
        message={siteApi.error ?? 'We could not load this site.'}
        onBack={onBack}
        onRetry={() => siteApi.refresh()}
      />
    );
  }

  const site = siteApi.data;
  return (
    <TouristSiteDetailScreen
      site={{
        name: site.name,
        city: site.city,
        description: site.description,
        openingHours: site.openingHours ?? '',
        admission: site.admission ?? '',
      }}
      onBack={onBack}
      onFindGuidePress={onFindGuidePress}
    />
  );
}
