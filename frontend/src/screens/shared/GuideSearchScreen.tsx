import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import EmptyState from '../../components/EmptyState';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  shadows,
} from '../../constants/theme';
import type { GuideProfileSummary } from '../../types/booking';
import { formatCurrency } from '../../data/bookingMock';

export interface GuideSearchScreenProps {
  title: string;
  subtitle: string;
  cityLabel: string;
  guides: GuideProfileSummary[];
  showMatchScores?: boolean;
  onGuidePress?: (guideId: string) => void;
  onBack?: () => void;
}

export default function GuideSearchScreen({
  title,
  subtitle,
  cityLabel,
  guides,
  showMatchScores = false,
  onGuidePress,
  onBack,
}: GuideSearchScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title={title}
        subtitle={subtitle}
        compact
        onBack={onBack}
      />

      <View style={styles.cityRow}>
        <View style={styles.cityPill}>
          <Text style={styles.cityPillText}>{cityLabel}</Text>
        </View>
      </View>

      {guides.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title="No guides nearby yet"
            body={`We are onboarding more local guides around ${cityLabel}. Try Accra or check back soon.`}
            tip="Guides help with markets, transport, and settling in."
            iconName="people-outline"
          />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingRight: spacing.lg + insets.right },
          ]}
        >
          {guides.map((guide) => (
            <Pressable
              key={guide.id}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() => onGuidePress?.(guide.id)}
              accessibilityRole="button"
              accessibilityLabel={
                showMatchScores
                  ? `${guide.name}, ${guide.matchPercentage} percent match`
                  : guide.name
              }
            >
              <View style={styles.topRow}>
                <View style={styles.iconWrap}>
                  <Text style={styles.iconInitials}>{guide.initials}</Text>
                </View>
                {showMatchScores ? (
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{guide.matchPercentage}%</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {guide.name}
              </Text>
              <Text style={styles.location} numberOfLines={1}>
                {guide.location}
              </Text>
              <Text style={styles.services} numberOfLines={1}>
                {guide.serviceTypes.slice(0, 2).join(' · ')}
              </Text>
              <Text style={styles.price}>
                {formatCurrency(guide.pricePerSession, guide.currency)} / session
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cityRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  cityPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cityPillText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  emptyWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  card: {
    width: 240,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInitials: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  name: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  matchBadge: {
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  matchText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  location: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  services: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  price: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
});
