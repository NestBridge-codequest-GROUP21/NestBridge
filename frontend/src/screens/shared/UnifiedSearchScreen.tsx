import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
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
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        greeting="Search"
        userName={userName}
        userInitials={userInitials}
        subtitle={`Explore options in ${cityLabel}`}
        onBack={onBack}
      />

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lead}>
          Homestays near campus, verified local guides, and hotels when you want
          your own space — search by what you need today.
        </Text>

        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onCategoryPress?.(category.id)}
            accessibilityRole="button"
            accessibilityLabel={category.label}
          >
            <Text style={styles.cardIcon}>{category.icon}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{category.label}</Text>
              <Text style={styles.cardDescription}>{category.description}</Text>
            </View>
            <Text style={styles.cardChevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  lead: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 72,
  },
  cardPressed: {
    opacity: 0.95,
  },
  cardIcon: {
    fontSize: fontSizes.heading,
    marginRight: spacing.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  cardChevron: {
    fontSize: 24,
    color: colors.teal,
    marginLeft: spacing.sm,
  },
});
