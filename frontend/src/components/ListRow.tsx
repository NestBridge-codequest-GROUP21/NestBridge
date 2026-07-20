import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import AppIcon, { type IoniconName } from './AppIcon';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  lineHeights,
  borderWidths,
  iconSizes,
  touchTarget,
  borderRadius,
  layout,
} from '../constants/theme';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  iconName?: IoniconName;
  showChevron?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  /** When false, omit bottom border (e.g. last row). Default true. */
  bordered?: boolean;
}

/** Tappable settings / directory row with optional leading icon. */
export default function ListRow({
  title,
  subtitle,
  iconName,
  showChevron = true,
  onPress,
  style,
  bordered = true,
}: ListRowProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  const content = (
    <>
      {iconName ? (
        <View style={styles.iconTile}>
          <AppIcon name={iconName} size={iconSizes.md} color={colors.tealDeep} />
        </View>
      ) : null}
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={3}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {showChevron ? (
        <View style={styles.chevron}>
          <AppIcon
            name="chevron-forward"
            size={iconSizes.md}
            color={colors.textTertiary}
          />
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.row,
          bordered && styles.bordered,
          pressed && styles.pressed,
          style,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, bordered && styles.bordered, style]}>{content}</View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: touchTarget + spacing.sm,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  bordered: {
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.88,
  },
  iconTile: {
    width: layout.iconTileSize,
    height: layout.iconTileSize,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  chevron: {
    marginTop: spacing.xs,
    flexShrink: 0,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.body,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
}

