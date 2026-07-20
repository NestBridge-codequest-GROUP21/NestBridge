import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import AppIcon from './AppIcon';
import type { OnboardingNextStep } from './OnboardingNextStepsCard';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  layout,
} from '../constants/theme';

export interface OnboardingReadyCarouselProps {
  cards: OnboardingNextStep[];
}

const CARD_GAP = spacing.md;
const CARD_PEEK = spacing.xl + spacing.sm;

export default function OnboardingReadyCarousel({
  cards,
}: OnboardingReadyCarouselProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  const screenWidth = Dimensions.get('window').width;
  const contentWidth = screenWidth - layout.screenPaddingHorizontal * 2;
  const cardWidth = contentWidth - CARD_PEEK;
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

  if (cards.length === 0) {
    return null;
  }

  return (
    <View
      style={styles.wrap}
      accessibilityRole="adjustable"
      accessibilityLabel="Next steps carousel"
      accessibilityHint="Swipe for more tips"
    >
      <Animated.FlatList
        data={cards}
        keyExtractor={(item) => item.title}
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
            <View style={[styles.slide, { width: snapWidth }]}>
              <View style={[styles.card, { width: cardWidth }]}>
                <Text style={styles.pageIndicator}>
                  {index + 1}/{cards.length}
                </Text>
                <View style={styles.iconWrap}>
                  <AppIcon
                    glyph={item.icon}
                    size={fontSizes.heading}
                    color={colors.tealDeep}
                  />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.body}</Text>
              </View>
            </View>
          )}
      />
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  wrap: {
    minHeight: layout.carouselMinHeight + spacing.lg,
  },
  listContent: {
    paddingLeft: layout.screenPaddingHorizontal,
  },
  slide: {
    paddingRight: CARD_GAP,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    minHeight: layout.carouselMinHeight,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: spacing.sm },
    shadowOpacity: 0.12,
    shadowRadius: spacing.md,
    elevation: 4,
    position: 'relative',
  },
  pageIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textTertiary,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    paddingRight: spacing.xl,
  },
  cardBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
});
}

