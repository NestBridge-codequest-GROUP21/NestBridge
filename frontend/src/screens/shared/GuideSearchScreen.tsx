import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
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

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
        <View style={styles.cityPill}>
          <Text style={styles.cityPillText}>{cityLabel}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {guides.map((guide, index) => {
          const isLast = index === guides.length - 1;
          return (
            <Pressable
              key={guide.id}
              style={({ pressed }) => [
                styles.card,
                !isLast && styles.cardSpacing,
                pressed && styles.pressed,
              ]}
              onPress={() => onGuidePress?.(guide.id)}
              accessibilityRole="button"
              accessibilityLabel={
                showMatchScores
                  ? `${guide.name}, ${guide.matchPercentage} percent match`
                  : guide.name
              }
            >
              <View style={styles.iconWrap}>
                <Text style={styles.iconInitials}>{guide.initials}</Text>
              </View>
              <View style={styles.body}>
                <View style={styles.topRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {guide.name}
                  </Text>
                  {showMatchScores ? (
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{guide.matchPercentage}%</Text>
                  </View>
                  ) : null}
                </View>
                <Text style={styles.location} numberOfLines={1}>
                  {guide.location}
                </Text>
                <Text style={styles.services} numberOfLines={1}>
                  {guide.serviceTypes.slice(0, 2).join(' · ')}
                </Text>
                <Text style={styles.price}>
                  {formatCurrency(guide.pricePerSession, guide.currency)} / session
                </Text>
              </View>
            </Pressable>
          );
        })}
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
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  headerTitle: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: fontSizes.body,
    color: colors.white,
    opacity: 0.88,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  cityPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  cityPillText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  scroll: {
    flex: 1,
    marginTop: -spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSpacing: {
    marginBottom: spacing.md,
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
    marginRight: spacing.md,
  },
  iconInitials: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
  },
  body: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  matchBadge: {
    backgroundColor: colors.teal,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  matchText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  location: {
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  services: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.tealDeep,
  },
  arrow: {
    fontSize: fontSizes.heading,
    color: colors.teal,
    marginLeft: spacing.sm,
  },
});
