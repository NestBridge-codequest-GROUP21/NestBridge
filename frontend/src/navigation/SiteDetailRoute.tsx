import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import TouristSiteDetailScreen from '../screens/tourist/TouristSiteDetailScreen';
import { useSite } from '../hooks/useContent';
import { colors } from '../constants/theme';

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

  if (siteApi.isLoading || !siteApi.data) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.teal} />
      </View>
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

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
