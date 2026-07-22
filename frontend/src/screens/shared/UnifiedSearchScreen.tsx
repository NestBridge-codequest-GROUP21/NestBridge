import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  iconSizes,
  touchTarget,
  layout,
  lineHeights,
} from '../../constants/theme';

export interface SearchCategoryItem {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface UnifiedSearchScreenProps {
  userName: string;
  userInitials: string;
  cityLabel: string;
  categories: SearchCategoryItem[];
  tabBarItems: TabBarItem[];
  activeTabId: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  onCategoryPress?: (categoryId: string) => void;
  onBack?: () => void;
  onTabPress?: (tabId: string) => void;
}

export default function UnifiedSearchScreen({
  userName,
  userInitials,
  cityLabel,
  categories,
  tabBarItems,
  activeTabId,
  showSosDock = false,
  onSosPress,
  onCategoryPress,
  onBack,
  onTabPress,
}: UnifiedSearchScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting="Search"
        userName={userName}
        userInitials={userInitials}
        subtitle={`Find stays and guides in ${cityLabel}`}
        onBack={onBack}
      />

      <ScreenScroll withTabBar withSosDock={showSosDock}>
        <Text style={styles.lead}>
          Homestays near campus, verified Ghanaian guides, and hotels when you
          want your own space — start with what you need today.
        </Text>

        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [styles.cardPress, pressed && styles.cardPressed]}
            onPress={() => onCategoryPress?.(category.id)}
            accessibilityRole="button"
            accessibilityLabel={category.label}
          >
            <Card style={styles.card} padding="lg">
              <View style={styles.cardIconTile}>
                <AppIcon
                  glyph={category.icon}
                  size={iconSizes.lg}
                  color={colors.onAccent}
                />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{category.label}</Text>
                <Text style={styles.cardDescription}>{category.description}</Text>
              </View>
              <AppIcon
                name="chevron-forward"
                size={iconSizes.lg}
                color={colors.teal}
              />
            </Card>
          </Pressable>
        ))}
      </ScreenScroll>

      <AppTabBar
        items={tabBarItems}
        activeTabId={activeTabId}
        showSosDock={showSosDock}
        onSosPress={onSosPress}
        onTabPress={onTabPress}
      />
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lead: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
    marginBottom: spacing.lg,
  },
  cardPress: {
    marginBottom: layout.sectionGap,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget + spacing.lg,
  },
  cardPressed: {
    opacity: 0.95,
  },
  cardIconTile: {
    width: layout.iconTileSize,
    height: layout.iconTileSize,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
});
}

