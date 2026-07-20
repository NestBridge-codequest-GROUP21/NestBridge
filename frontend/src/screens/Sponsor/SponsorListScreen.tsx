import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import SearchField from '../../components/SearchField';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import AppIcon from '../../components/AppIcon';
import type { SponsorCategory, SponsorListing } from '../../data/sponsorsMock';
import { SPONSOR_CATEGORIES } from '../../data/sponsorsMock';
import {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  iconSizes,
  touchTarget,
  avatarSizes,
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
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SponsorCategory | 'All'>('All');

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sponsors.filter((sponsor) => {
      const haystack = [
        sponsor.name,
        sponsor.category,
        sponsor.description,
        sponsor.eligibility,
        sponsor.location,
        sponsor.amountLabel,
      ]
        .join(' ')
        .toLowerCase();
      const matchSearch = query.length === 0 || haystack.includes(query);
      const matchCategory = selected === 'All' || sponsor.category === selected;
      return matchSearch && matchCategory;
    });
  }, [sponsors, search, selected]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: sponsors.length };
    for (const category of SPONSOR_CATEGORIES) {
      if (category === 'All') continue;
      counts[category] = sponsors.filter((item) => item.category === category).length;
    }
    return counts;
  }, [sponsors]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScreenHeader
        title="Sponsors"
        subtitle="Funding and support partners for study and relocation in Ghana"
        compact
        onBack={onBack}
      />

      <View style={styles.searchContainer}>
        <SearchField
          value={search}
          placeholder="Search by name, city, or focus…"
          onChangeText={setSearch}
          onClear={() => setSearch('')}
        />
      </View>

      <FlatList
        data={SPONSOR_CATEGORIES}
        extraData={selected}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={styles.categoryList}
        contentContainerStyle={styles.categoryContent}
        renderItem={({ item }) => {
          const count = categoryCounts[item] ?? 0;
          return (
            <Pressable
              style={[
                styles.categoryChip,
                selected === item && styles.categoryChipActive,
              ]}
              onPress={() => setSelected(item)}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === item }}
              accessibilityLabel={`Filter by ${item}, ${count} sponsors`}
            >
              <Text
                style={[
                  styles.categoryText,
                  selected === item && styles.categoryTextActive,
                ]}
              >
                {item}
                {count > 0 ? ` (${count})` : ''}
              </Text>
            </Pressable>
          );
        }}
      />

      {filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title="No sponsors match"
            body="Clear the search or pick another category. Every chip shows how many partners are available."
            tip="Try “All” or search words like scholarship, diaspora, or Accra."
            iconName="ribbon-outline"
            primaryActionLabel={search || selected !== 'All' ? 'Clear filters' : undefined}
            onPrimaryAction={
              search || selected !== 'All'
                ? () => {
                    setSearch('');
                    setSelected('All');
                  }
                : undefined
            }
          />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [pressed && styles.pressed]}
              onPress={() => onSponsorPress?.(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`View ${item.name} sponsorship`}
            >
              <Card padding="md" elevation="card">
                <View style={styles.cardTop}>
                  <View style={styles.logoTile}>
                    <AppIcon
                      glyph={item.logo}
                      size={iconSizes.lg}
                      color={colors.tealDeep}
                    />
                  </View>
                  <View style={styles.cardTitleBlock}>
                    <Text style={styles.sponsorName}>{item.name}</Text>
                    <StatusBadge
                      label={item.category}
                      tone="info"
                      style={styles.categoryBadge}
                    />
                  </View>
                </View>
                <Text style={styles.sponsorDesc}>{item.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.amount}>{item.amountLabel}</Text>
                  <View style={styles.applyRow}>
                    <Text style={styles.applyText}>View & apply</Text>
                    <AppIcon
                      name="chevron-forward"
                      size={iconSizes.sm}
                      color={colors.teal}
                    />
                  </View>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    marginHorizontal: layout.screenPaddingHorizontal,
    marginTop: spacing.md,
  },
  categoryList: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    flexGrow: 0,
  },
  categoryContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    gap: spacing.sm,
  },
  categoryChip: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: borderWidths.hairline,
    borderColor: colors.border,
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
  emptyWrap: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.md,
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  logoTile: {
    width: avatarSizes.lg,
    height: avatarSizes.lg,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  sponsorName: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  sponsorDesc: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  amount: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    color: colors.gold,
  },
  applyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touchTarget / 2,
  },
  applyText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    color: colors.teal,
    fontWeight: fontWeights.semibold,
  },
  pressed: {
    opacity: 0.92,
  },
});
