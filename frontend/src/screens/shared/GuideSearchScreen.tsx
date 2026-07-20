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
import Card from '../../components/Card';
import Avatar from '../../components/Avatar';
import StatusBadge from '../../components/StatusBadge';
import AppIcon from '../../components/AppIcon';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  touchTarget,
  lineHeights,
  layout,
  iconSizes,
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          {guides.map((guide) => (
            <Pressable
              key={guide.id}
              style={({ pressed }) => [styles.cardPress, pressed && styles.pressed]}
              onPress={() => onGuidePress?.(guide.id)}
              accessibilityRole="button"
              accessibilityLabel={
                showMatchScores
                  ? `${guide.name}, ${guide.matchPercentage} percent match`
                  : guide.name
              }
            >
              <Card style={styles.card} padding="lg">
                <Avatar initials={guide.initials} size="lg" style={styles.avatar} />
                <View style={styles.cardBody}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={2}>
                      {guide.name}
                    </Text>
                    {showMatchScores ? (
                      <StatusBadge
                        label={`${guide.matchPercentage}%`}
                        tone="success"
                      />
                    ) : null}
                  </View>
                  <Text style={styles.location} numberOfLines={2}>
                    {guide.location}
                  </Text>
                  <Text style={styles.services} numberOfLines={2}>
                    {guide.serviceTypes.slice(0, 3).join(' · ')}
                  </Text>
                  <Text style={styles.price}>
                    {formatCurrency(guide.pricePerSession, guide.currency)} / session
                  </Text>
                </View>
                <AppIcon
                  name="chevron-forward"
                  size={iconSizes.md}
                  color={colors.teal}
                />
              </Card>
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
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
  },
  cityPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  cityPillText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  emptyWrap: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  cardPress: {
    minHeight: touchTarget,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pressed: {
    opacity: 0.94,
  },
  avatar: {
    marginRight: spacing.md,
  },
  cardBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
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
