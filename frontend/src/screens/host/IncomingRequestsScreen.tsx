import { useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import IncomingRequestCard, {
  IncomingRequestsEmptyBlock,
} from '../../components/IncomingRequestCard';

import type { IncomingBookingRequest } from '../../types/booking';

export interface IncomingRequestsEmptyState {
  title: string;
  body: string;
  tip?: string;
}

export interface IncomingRequestsScreenProps {
  requests: IncomingBookingRequest[];
  title?: string;
  subtitle?: string;
  emptyState?: IncomingRequestsEmptyState;
  onRequestPress?: (requestId: string) => void;
  onBack?: () => void;
}

export default function IncomingRequestsScreen({
  requests,
  title = 'Incoming requests',
  subtitle,
  emptyState,
  onRequestPress,
  onBack,
}: IncomingRequestsScreenProps) {
  const styles = useThemedStyles(createStyles);

  const pendingCount = requests.length;
  const defaultSubtitle =
    pendingCount === 1 ? '1 pending request' : `${pendingCount} pending requests`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title={title}
        subtitle={subtitle ?? defaultSubtitle}
        onBack={onBack}
        compact
      />

      <ScreenScroll>
        {requests.length === 0 && emptyState ? (
          <IncomingRequestsEmptyBlock
            title={emptyState.title}
            body={emptyState.body}
            tip={emptyState.tip}
          />
        ) : null}

        {requests.map((request, index) => (
          <IncomingRequestCard
            key={request.id}
            request={request}
            isLast={index === requests.length - 1}
            onPress={onRequestPress}
          />
        ))}
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
}

