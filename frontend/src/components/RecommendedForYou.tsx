import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Card from './Card';
import SectionHeader from './SectionHeader';
import AppIcon from './AppIcon';
import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
  touchTarget,
  layout,
} from '../constants/theme';
import type { EmptyStateContent } from '../data/appCopy';
import EmptyState, { emptyStateFromContent } from './EmptyState';
import type {
  RecommendationItem,
  RecommendationSection,
} from '../types/recommendations';
import {
  presentRecommendationGroups,
  recommendationHeadlineForCity,
  type PresentedRecommendationSection,
} from '../utils/presentRecommendations';

export interface RecommendedForYouProps {
  headline?: string;
  city?: string;
  sections: RecommendationSection[];
  emptyState?: EmptyStateContent;
  onEmptyPrimaryAction?: () => void;
  onItemPress?: (item: RecommendationItem) => void;
}

function actionLabel(item: RecommendationItem): string {
  return item.actionLabel ?? 'Explore';
}

function ListSection({
  section,
  onItemPress,
}: {
  section: PresentedRecommendationSection;
  onItemPress?: (item: RecommendationItem) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const preview = section.previewCount ?? 3;
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? section.items : section.items.slice(0, preview);
  const canExpand = section.items.length > preview;

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{section.title}</Text>
      <Card padding="none" elevation="card" style={styles.listCard}>
        {visible.map((item, index) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.listRow,
              index > 0 && styles.listRowBorder,
              pressed && styles.pressed,
            ]}
            onPress={() => onItemPress?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${actionLabel(item)}`}
          >
            {section.numbered ? (
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
            ) : (
              <View style={styles.listIcon}>
                <AppIcon
                  glyph={item.icon ?? '📍'}
                  size={iconSizes.md}
                  color={colors.tealDeep}
                />
              </View>
            )}
            <View style={styles.listText}>
              <Text style={styles.listTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {item.location ? (
                <Text style={styles.location} numberOfLines={1}>
                  📍 {item.location}
                </Text>
              ) : null}
              {item.reason ? (
                <Text style={styles.reason} numberOfLines={2}>
                  {item.reason}
                </Text>
              ) : item.subtitle ? (
                <Text style={styles.listSubtitle} numberOfLines={2}>
                  {item.subtitle}
                </Text>
              ) : null}
              <Text style={styles.inlineCta}>{actionLabel(item)}</Text>
            </View>
            {item.priceLabel ? (
              <Text style={styles.price}>{item.priceLabel}</Text>
            ) : (
              <AppIcon
                name="chevron-forward"
                size={iconSizes.md}
                color={colors.textTertiary}
              />
            )}
          </Pressable>
        ))}
      </Card>
      {canExpand ? (
        <Pressable
          onPress={() => setExpanded((value) => !value)}
          style={styles.showMore}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Show fewer' : 'Show more'}
        >
          <Text style={styles.showMoreText}>
            {expanded ? 'Show less' : `Show all ${section.items.length}`}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function GridSection({
  section,
  onItemPress,
}: {
  section: PresentedRecommendationSection;
  onItemPress?: (item: RecommendationItem) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const preview = section.previewCount ?? 4;
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? section.items : section.items.slice(0, preview);
  const canExpand = section.items.length > preview;

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{section.title}</Text>
      <View style={styles.grid}>
        {visible.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.gridCard,
              pressed && styles.pressed,
            ]}
            onPress={() => onItemPress?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${actionLabel(item)}`}
          >
            <View style={styles.gridIcon}>
              <AppIcon
                glyph={item.icon ?? '📍'}
                size={iconSizes.md}
                color={colors.tealDeep}
              />
            </View>
            <Text style={styles.gridTitle} numberOfLines={2}>
              {item.title}
            </Text>
            {item.location ? (
              <Text style={styles.gridLocation} numberOfLines={1}>
                📍 {item.location}
              </Text>
            ) : null}
            {item.reason ? (
              <Text style={styles.gridReason} numberOfLines={2}>
                {item.reason}
              </Text>
            ) : null}
            <Text style={styles.gridCta}>{actionLabel(item)}</Text>
          </Pressable>
        ))}
      </View>
      {canExpand ? (
        <Pressable
          onPress={() => setExpanded((value) => !value)}
          style={styles.showMore}
          accessibilityRole="button"
        >
          <Text style={styles.showMoreText}>
            {expanded ? 'Show less' : `Show all ${section.items.length}`}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function FeaturedSection({
  section,
  onItemPress,
}: {
  section: PresentedRecommendationSection;
  onItemPress?: (item: RecommendationItem) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{section.title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredTrack}
        accessibilityLabel={`${section.title} featured picks`}
      >
        {section.items.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.featuredCard,
              pressed && styles.pressed,
            ]}
            onPress={() => onItemPress?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${actionLabel(item)}`}
          >
            <View style={styles.featuredIcon}>
              <AppIcon
                glyph={item.icon ?? '✨'}
                size={iconSizes.lg}
                color={colors.tealDeep}
              />
            </View>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {item.title}
            </Text>
            {item.location ? (
              <Text style={styles.featuredLocation} numberOfLines={1}>
                📍 {item.location}
              </Text>
            ) : null}
            {item.reason ? (
              <Text style={styles.featuredReason} numberOfLines={2}>
                {item.reason}
              </Text>
            ) : null}
            <Text style={styles.featuredCta}>{actionLabel(item)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function renderSection(
  section: PresentedRecommendationSection,
  onItemPress?: (item: RecommendationItem) => void,
) {
  if (section.layout === 'grid') {
    return (
      <GridSection
        key={section.id}
        section={section}
        onItemPress={onItemPress}
      />
    );
  }
  if (section.layout === 'featured') {
    return (
      <FeaturedSection
        key={section.id}
        section={section}
        onItemPress={onItemPress}
      />
    );
  }
  return (
    <ListSection
      key={section.id}
      section={section}
      onItemPress={onItemPress}
    />
  );
}

/** Destination-aware recommendation blocks with list / grid / featured layouts. */
export default function RecommendedForYou({
  headline,
  city,
  sections,
  emptyState,
  onEmptyPrimaryAction,
  onItemPress,
}: RecommendedForYouProps) {
  const styles = useThemedStyles(createStyles);
  const groups = useMemo(
    () => presentRecommendationGroups(sections, city),
    [sections, city],
  );
  const resolvedHeadline =
    headline?.trim() || recommendationHeadlineForCity(city);

  if (!sections.length) {
    if (!emptyState) {
      return null;
    }
    return (
      <View style={styles.root} accessibilityRole="summary">
        <SectionHeader title={resolvedHeadline} style={styles.headline} />
        <EmptyState {...emptyStateFromContent(emptyState, onEmptyPrimaryAction)} />
      </View>
    );
  }

  return (
    <View style={styles.root} accessibilityRole="summary">
      <SectionHeader
        title={resolvedHeadline}
        subtitle="Organized for your destination — tap any card for details"
        style={styles.headline}
      />
      {groups.map((group) => (
        <View key={group.id} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.sections.map((section) => renderSection(section, onItemPress))}
        </View>
      ))}
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
    root: {
      marginBottom: spacing.lg,
    },
    headline: {
      marginBottom: spacing.md,
    },
    group: {
      marginBottom: spacing.lg,
    },
    groupTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    block: {
      marginBottom: spacing.md,
    },
    blockTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    listCard: {
      overflow: 'hidden',
    },
    listRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      minHeight: touchTarget + spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    listRowBorder: {
      borderTopWidth: borderWidths.hairline,
      borderTopColor: colors.border,
    },
    rankBadge: {
      width: touchTarget - spacing.sm,
      height: touchTarget - spacing.sm,
      borderRadius: borderRadius.pill,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xs,
    },
    rankText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.tealDeep,
    },
    listIcon: {
      width: touchTarget,
      height: touchTarget,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surfaceElevated,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    listText: {
      flex: 1,
      gap: spacing.xs,
    },
    listTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    location: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
    },
    listSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
    },
    reason: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.primaryAction,
      lineHeight: lineHeights.micro,
    },
    inlineCta: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      marginTop: spacing.xs,
    },
    price: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.tealDeep,
      maxWidth: 88,
      textAlign: 'right',
      marginTop: spacing.xs,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    gridCard: {
      width: '48%',
      flexGrow: 1,
      maxWidth: '48%',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      padding: spacing.md,
      minHeight: layout.iconTileSize + spacing.xl * 2,
    },
    gridIcon: {
      width: iconSizes.xl,
      height: iconSizes.xl,
      borderRadius: borderRadius.md,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    gridTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    gridLocation: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    gridReason: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.primaryAction,
      lineHeight: lineHeights.micro,
      marginBottom: spacing.sm,
    },
    gridCta: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.micro,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      marginTop: spacing.sm,
    },
    featuredTrack: {
      gap: spacing.sm,
      paddingRight: spacing.md,
    },
    featuredCard: {
      width: layout.carouselMinHeight + spacing.xl * 2,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      padding: spacing.md,
    },
    featuredIcon: {
      width: layout.iconTileSize,
      height: layout.iconTileSize,
      borderRadius: borderRadius.md,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    featuredTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    featuredLocation: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    featuredReason: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.micro,
      color: colors.primaryAction,
      lineHeight: lineHeights.micro,
      marginBottom: spacing.sm,
    },
    featuredCta: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    showMore: {
      alignSelf: 'flex-start',
      minHeight: touchTarget,
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    showMoreText: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    pressed: {
      opacity: 0.9,
    },
  });
}
