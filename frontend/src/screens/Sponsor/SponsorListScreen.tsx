import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SponsorCategory, SponsorListing } from '../../data/sponsorsMock';
import { SPONSOR_CATEGORIES } from '../../data/sponsorsMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
  gradients,
} from '../../constants/theme';

export interface SponsorListScreenProps {
  sponsors: SponsorListing[];
  onSponsorPress?: (sponsorId: string) => void;
  onBack?: () => void;
  onSosPress?: () => void;
}

export default function SponsorListScreen({
  sponsors,
  onSponsorPress,
  onBack,
}: SponsorListScreenProps) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SponsorCategory | 'All'>('All');

  const filtered = useMemo(
    () =>
      sponsors.filter((sponsor) => {
        const matchSearch = sponsor.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selected === 'All' || sponsor.category === selected;
        return matchSearch && matchCategory;
      }),
    [sponsors, search, selected],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
        ) : null}
        <Text style={styles.headerTitle}>Sponsors</Text>
        <Text style={styles.headerSubtitle}>Find funding for your journey</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search sponsors..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search sponsors"
        />
      </View>

      <FlatList
        data={SPONSOR_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={styles.categoryList}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoryChip,
              selected === item && styles.categoryChipActive,
            ]}
            onPress={() => setSelected(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: selected === item }}
            accessibilityLabel={`Filter by ${item}`}
          >
            <Text
              style={[
                styles.categoryText,
                selected === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.xl * 3 },
        ]}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() => onSponsorPress?.(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`View ${item.name} sponsorship`}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.logo}>{item.logo}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.sponsorName}>{item.name}</Text>
              <Text style={styles.sponsorCategory}>{item.category}</Text>
              <Text style={styles.sponsorDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.amount}>{item.amountLabel}</Text>
              <Text style={styles.applyText}>Apply →</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingBottom: spacing.lg,
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  backButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption + 1,
    color: colors.tealBright,
    marginTop: spacing.xs,
  },
  searchContainer: {
    margin: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md + 2,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.body - 1,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryList: {
    paddingLeft: spacing.md,
    marginBottom: spacing.sm,
    flexGrow: 0,
  },
  categoryChip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  categoryText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    fontFamily: fontFamilies.semibold,
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLeft: {
    marginRight: spacing.sm + 6,
  },
  logo: {
    fontSize: spacing.xl + spacing.xs,
  },
  cardBody: {
    flex: 1,
  },
  sponsorName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body - 1,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  sponsorCategory: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption - 1,
    color: colors.teal,
    marginTop: spacing.xs / 2,
    fontWeight: fontWeights.semibold,
  },
  sponsorDesc: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption - 1,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: lineHeights.caption,
  },
  cardRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  amount: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption + 1,
    fontWeight: fontWeights.bold,
    color: colors.gold,
    textAlign: 'right',
  },
  applyText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption - 1,
    color: colors.teal,
    marginTop: spacing.xs + 2,
    fontWeight: fontWeights.semibold,
  },
  pressed: {
    opacity: 0.92,
  },
});
