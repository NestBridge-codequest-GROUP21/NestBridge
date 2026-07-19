import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ExploreSectionItem } from '../screens/tourist/ExploreHomeScreen';
import AppIcon from './AppIcon';
import {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  gradients,
} from '../constants/theme';

export interface ExploreSectionCarouselProps {
  sections: ExploreSectionItem[];
  savedLodgingCount?: number;
  onSectionPress?: (sectionId: string) => void;
}

const CARD_GAP = spacing.md;

function sectionGradient(sectionId: string): readonly [string, string, ...string[]] {
  if (sectionId === 'guides') {
    return gradients.accent;
  }
  if (sectionId === 'homestays') {
    return gradients.headerCompact;
  }
  return [colors.navyMid, colors.tealDeep];
}

interface CarouselCardProps {
  item: ExploreSectionItem;
  index: number;
  scrollX: Animated.Value;
  snapWidth: number;
  cardWidth: number;
  savedLodgingCount: number;
  onSectionPress?: (sectionId: string) => void;
}

function CarouselCard({
  item,
  index,
  scrollX,
  snapWidth,
  cardWidth,
  savedLodgingCount,
  onSectionPress,
}: CarouselCardProps) {
  const inputRange = [
    (index - 1) * snapWidth,
    index * snapWidth,
    (index + 1) * snapWidth,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.94, 1, 0.94],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.72, 1, 0.72],
    extrapolate: 'clamp',
  });

  const iconScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.9, 1.08, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.slide, { width: snapWidth }]}>
      <Animated.View
        style={[
          styles.cardOuter,
          {
            width: cardWidth,
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}
          onPress={() => onSectionPress?.(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          accessibilityHint="Swipe for more options"
        >
          <LinearGradient
            colors={[...sectionGradient(item.id)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientStrip}
          />
          <View style={styles.cardBody}>
            {item.icon ? (
              <Animated.View
                style={[styles.iconTile, { transform: [{ scale: iconScale }] }]}
              >
                <AppIcon glyph={item.icon} size={26} color={colors.tealDeep} />
              </Animated.View>
            ) : null}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            {item.id === 'lodging' && savedLodgingCount > 0 ? (
              <View style={styles.savedBadge}>
                <Text style={styles.savedBadgeText}>
                  {savedLodgingCount} saved
                </Text>
              </View>
            ) : null}
            <Text style={styles.cta}>Explore</Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function ExploreSectionCarousel({
  sections,
  savedLodgingCount = 0,
  onSectionPress,
}: ExploreSectionCarouselProps) {
  const screenWidth = Dimensions.get('window').width;
  const contentWidth = screenWidth - layout.screenPaddingHorizontal * 2;
  const cardWidth = contentWidth * 0.88;
  const snapWidth = cardWidth + CARD_GAP;
  const scrollX = useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.setValue(event.nativeEvent.contentOffset.x);
    },
    [scrollX],
  );

  return (
    <View
      style={styles.wrap}
      accessibilityRole="adjustable"
      accessibilityLabel="Discover services carousel"
      accessibilityHint="Swipe for more options"
    >
      <Animated.FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        snapToInterval={snapWidth}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={[
          styles.listContent,
          { paddingRight: contentWidth - cardWidth },
        ]}
        renderItem={({ item, index }) => (
          <CarouselCard
            item={item}
            index={index}
            scrollX={scrollX}
            snapWidth={snapWidth}
            cardWidth={cardWidth}
            savedLodgingCount={savedLodgingCount}
            onSectionPress={onSectionPress}
          />
        )}
      />

      <View style={styles.dots} accessibilityRole="tablist">
        {sections.map((section, index) => {
          const dotWidth = scrollX.interpolate({
            inputRange: [
              (index - 1) * snapWidth,
              index * snapWidth,
              (index + 1) * snapWidth,
            ],
            outputRange: [spacing.sm, spacing.lg, spacing.sm],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * snapWidth,
              index * snapWidth,
              (index + 1) * snapWidth,
            ],
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={section.id}
              style={[
                styles.dot,
                { width: dotWidth, opacity: dotOpacity },
                index === sections.length - 1 ? null : styles.dotSpacing,
              ]}
              accessibilityLabel={`${section.title}, slide ${index + 1} of ${sections.length}`}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: layout.sectionGap,
    marginHorizontal: -layout.screenPaddingHorizontal,
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardOuter: {
    minHeight: layout.carouselMinHeight,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardPressable: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.96,
  },
  gradientStrip: {
    height: spacing.sm,
    width: '100%',
  },
  cardBody: {
    padding: spacing.lg,
    justifyContent: 'center',
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  savedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warmCream,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    marginBottom: spacing.sm,
  },
  savedBadgeText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.tealDeep,
  },
  cta: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    marginTop: spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  dot: {
    height: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
  },
  dotSpacing: {
    marginRight: spacing.sm,
  },
});
