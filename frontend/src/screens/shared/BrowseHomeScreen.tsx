import React from 'react';
import ExploreHomeScreen, {
  type ExploreHomeScreenProps,
} from '../tourist/ExploreHomeScreen';

export type BrowseHomeScreenProps = Omit<ExploreHomeScreenProps, 'variant'>;

export default function BrowseHomeScreen(props: BrowseHomeScreenProps) {
  return <ExploreHomeScreen {...props} variant="browse" />;
}
