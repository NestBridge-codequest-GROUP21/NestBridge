import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
  gradients,
  layout,
  lineHeights,
  touchTarget,
} from '../../constants/theme';
import MatchResultsScreen, {
  type MatchResultHost,
} from './MatchResultsScreen';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SkeletonLoader, { SkeletonBlock } from '../../components/SkeletonLoader';

export interface MatchSearchDefaults {
  destinationCity: string;
  checkIn: string;
  checkOut: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
}

export const matchSearchDefaults: MatchSearchDefaults = {
  destinationCity: 'Accra',
  checkIn: '2026-08-10',
  checkOut: '2026-08-20',
  budgetMin: 100,
  budgetMax: 200,
  currency: 'GHS',
};

export interface MatchSearchScreenProps {
  defaults: MatchSearchDefaults;
  onSearch: (params: MatchSearchDefaults) => Promise<{
    results: MatchResultHost[];
    error?: string;
  }>;
  tabBarItems?: TabBarItem[];
  activeTabId?: string;
  showSosDock?: boolean;
  onSosPress?: () => void;
  onBack?: () => void;
  onHostPress?: (hostId: string) => void;
  onTabPress?: (tabId: string) => void;
}

function formatDateRangeShort(checkIn: string, checkOut: string): string {
  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  }

  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
}

function formatBudgetRange(currency: string, min: number, max: number): string {
  return `${currency} ${min.toLocaleString('en-GH')}-${max.toLocaleString('en-GH')}`;
}

function buildSummaryLine(params: MatchSearchDefaults): string {
  return [
    params.destinationCity,
    formatDateRangeShort(params.checkIn, params.checkOut),
    formatBudgetRange(params.currency, params.budgetMin, params.budgetMax),
  ].join(' · ');
}

export default function MatchSearchScreen({
  defaults,
  onSearch,
  tabBarItems,
  activeTabId = 'explore',
  showSosDock = false,
  onSosPress,
  onBack,
  onHostPress,
  onTabPress,
}: MatchSearchScreenProps) {
  const insets = useSafeAreaInsets();
  const showTabBar = tabBarItems != null && tabBarItems.length > 0;

  const [destinationCity, setDestinationCity] = useState(defaults.destinationCity);
  const [checkIn, setCheckIn] = useState(defaults.checkIn);
  const [checkOut, setCheckOut] = useState(defaults.checkOut);
  const [budgetMin, setBudgetMin] = useState(String(defaults.budgetMin));
  const [budgetMax, setBudgetMax] = useState(String(defaults.budgetMax));
  const [currency] = useState(defaults.currency);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<MatchResultHost[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    setDestinationCity(defaults.destinationCity);
    setCheckIn(defaults.checkIn);
    setCheckOut(defaults.checkOut);
  }, [defaults.destinationCity, defaults.checkIn, defaults.checkOut]);

  const currentParams = useMemo<MatchSearchDefaults>(
    () => ({
      destinationCity: destinationCity.trim() || defaults.destinationCity,
      checkIn: checkIn.trim() || defaults.checkIn,
      checkOut: checkOut.trim() || defaults.checkOut,
      budgetMin: Number.parseInt(budgetMin, 10) || defaults.budgetMin,
      budgetMax: Number.parseInt(budgetMax, 10) || defaults.budgetMax,
      currency,
    }),
    [
      budgetMax,
      budgetMin,
      checkIn,
      checkOut,
      currency,
      defaults.budgetMax,
      defaults.budgetMin,
      defaults.checkIn,
      defaults.checkOut,
      defaults.destinationCity,
      destinationCity,
    ],
  );

  const summaryLine = useMemo(() => buildSummaryLine(currentParams), [currentParams]);

  const handleFindMatches = useCallback(async () => {
    if (isSearching) {
      return;
    }

    setIsExpanded(false);
    setIsSearching(true);
    setSearchError(null);

    try {
      const { results, error } = await onSearch(currentParams);
      setSearchResults(results);
      setSearchError(error ?? null);
      setShowResults(true);
    } catch (err) {
      setSearchResults([]);
      setSearchError(err instanceof Error ? err.message : 'Something went wrong.');
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  }, [currentParams, isSearching, onSearch]);

  const handleBackFromResults = useCallback(() => {
    setShowResults(false);
  }, []);

  if (showResults) {
    return (
      <MatchResultsScreen
        results={searchResults}
        errorMessage={searchError}
        destinationLabel={`${currentParams.destinationCity} matches`}
        onBack={handleBackFromResults}
        onRetry={() => {
          setShowResults(false);
          void handleFindMatches();
        }}
        onHostPress={onHostPress}
        onSosPress={onSosPress}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Marketing search hero — richer than ScreenHeader (eyebrow + display title). */}
      <LinearGradient
        colors={[...gradients.header]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        {onBack && !showTabBar ? (
          <BackButton onPress={onBack} color={colors.white} style={styles.backButton} />
        ) : (
          <View style={styles.backButtonSpacer} />
        )}
        <Text style={styles.headerEyebrow}>Host search</Text>
        <Text style={styles.headerTitle}>Find your host</Text>
        <Text style={styles.headerSubtitle}>
          Matched to verified Ghana host families by lifestyle, diet, language, and budget.
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: showTabBar
              ? insets.bottom + layout.scrollBottomInset
              : insets.bottom + spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card padding="lg" elevation="card" style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.summaryTextWrap}>
              <Text style={styles.summaryLabel}>Your search</Text>
              <Text style={styles.summaryValue}>{summaryLine}</Text>
            </View>

            <Pressable
              onPress={() => setIsExpanded((prev) => !prev)}
              style={({ pressed }) => [styles.editButton, pressed && styles.editButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel={isExpanded ? 'Collapse search details' : 'Edit search details'}
            >
              <Text style={styles.editButtonText}>{isExpanded ? 'Done' : 'Edit'}</Text>
            </Pressable>
          </View>

          {isExpanded ? (
            <View style={styles.expandedFields}>
              <FormTextField
                label="Destination city"
                value={destinationCity}
                onChangeText={setDestinationCity}
                placeholder="e.g. Accra, Kumasi, Wa, Ho"
                autoCapitalize="words"
              />

              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <FormTextField
                    label="Check-in"
                    value={checkIn}
                    onChangeText={setCheckIn}
                    placeholder="YYYY-MM-DD"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.fieldHalf}>
                  <FormTextField
                    label="Check-out"
                    value={checkOut}
                    onChangeText={setCheckOut}
                    placeholder="YYYY-MM-DD"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <FormTextField
                    label={`Budget min (${currency})`}
                    value={budgetMin}
                    onChangeText={setBudgetMin}
                    placeholder="100"
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.fieldHalf}>
                  <FormTextField
                    label={`Budget max (${currency})`}
                    value={budgetMax}
                    onChangeText={setBudgetMax}
                    placeholder="200"
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>
          ) : null}
        </Card>

        <Card padding="lg" elevation="card" style={styles.heroCard}>
          <Text style={styles.heroCardTitle}>Why you will see match reasons</Text>
          <Text style={styles.heroCardBody}>
            Each result explains the fit — diet, quiet hours, languages, and neighbourhood —
            before you message anyone.
          </Text>
        </Card>

        <PrimaryButton
          label="Find my matches"
          onPress={handleFindMatches}
          loading={isSearching}
          iconName="search-outline"
        />
      </ScrollView>

      {isSearching ? (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <View style={styles.loadingOverlayBackdrop} />
          <Card padding="lg" elevation="raised" style={styles.loadingCard}>
            <Text style={styles.loadingTitle}>Matching hosts to your profile</Text>
            <SkeletonLoader lines={2} style={styles.loadingSkeleton} />
            <SkeletonBlock width="72%" height={12} style={styles.skeletonGap} />
            <SkeletonBlock width="88%" height={12} style={styles.skeletonGap} />
          </Card>
        </View>
      ) : null}
      {showTabBar ? (
        <AppTabBar
          items={tabBarItems!}
          activeTabId={activeTabId}
          showSosDock={showSosDock}
          onSosPress={onSosPress}
          onTabPress={onTabPress}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.xs,
    marginLeft: -spacing.sm,
  },
  backButtonSpacer: {
    height: touchTarget,
  },
  headerEyebrow: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    opacity: 0.82,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.display,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.9,
    lineHeight: lineHeights.body,
  },
  scroll: {
    flex: 1,
    marginTop: -spacing.md,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.sm,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.subheading,
  },
  editButton: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  editButtonPressed: {
    opacity: 0.75,
  },
  editButtonText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  expandedFields: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: borderWidths.hairline,
    borderTopColor: colors.border,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fieldHalf: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: colors.navyMid,
    borderColor: colors.navyMid,
    marginBottom: spacing.xl,
  },
  heroCardTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.subheading,
  },
  heroCardBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.9,
    lineHeight: lineHeights.caption,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPaddingHorizontal,
  },
  loadingOverlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.navy,
    opacity: 0.18,
  },
  loadingCard: {
    width: '100%',
  },
  loadingTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: lineHeights.body,
  },
  loadingSkeleton: {
    marginBottom: spacing.sm,
  },
  skeletonGap: {
    marginTop: spacing.sm,
  },
});
