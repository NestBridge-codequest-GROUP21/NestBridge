import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
} from '../constants/theme';

export interface HomeStatItem {
  id: string;
  value: string;
  label: string;
  subtitle?: string;
}

export interface HomeStatsCarouselProps {
  title: string;
  items: HomeStatItem[];
  onItemPress?: (itemId: string) => void;
}

export default function HomeStatsCarousel({
  title,
  items,
  onItemPress,
}: HomeStatsCarouselProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled
      >
        {items.map((item, index) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.card,
              index < items.length - 1 && styles.cardSpacing,
              pressed && styles.pressed,
            ]}
            onPress={() => onItemPress?.(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`${item.value} ${item.label}`}
          >
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.label}>{item.label}</Text>
            {item.subtitle ? (
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: layout.sectionGap,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  listContent: {
    paddingRight: spacing.lg,
  },
  card: {
    width: layout.listingCardWidth * 0.65,
    minHeight: layout.carouselMinHeight * 0.65,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  cardSpacing: {
    marginRight: spacing.md,
  },
  pressed: {
    opacity: 0.94,
  },
  value: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.tealDeep,
    marginBottom: spacing.xs,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
});
