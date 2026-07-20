import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import IncomingRequestCard, {
  IncomingRequestsEmptyBlock,
} from '../../components/IncomingRequestCard';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  gradients,
  lineHeights,
} from '../../constants/theme';
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
  const insets = useSafeAreaInsets();
  const pendingCount = requests.length;
  const defaultSubtitle =
    pendingCount === 1 ? '1 pending request' : `${pendingCount} pending requests`;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        {onBack ? (
          <BackButton
            onPress={onBack}
            color={colors.white}
            style={styles.backButton}
          />
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle ?? defaultSubtitle}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.sm,
    marginLeft: -spacing.sm,
  },
  backPlaceholder: {
    height: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.88,
    lineHeight: lineHeights.body,
  },
  scroll: {
    flex: 1,
    marginTop: -spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});
