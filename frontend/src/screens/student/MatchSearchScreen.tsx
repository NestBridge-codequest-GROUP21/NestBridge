import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
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
  borderRadius,
  gradients,
  layout,
  lineHeights,
  shadows,
} from '../../constants/theme';
import MatchResultsScreen, {
  type MatchResultHost,
} from './MatchResultsScreen';
import AppTabBar, { type TabBarItem } from '../../components/AppTabBar';
import BackButton from '../../components/BackButton';

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
        <Text style={styles.headerTitle}>Find your perfect host</Text>
        <Text style={styles.headerSubtitle}>
          We match you with verified Ghana host families based on lifestyle, diet,
          language, and budget.
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
        <View style={styles.summaryCard}>
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
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Destination city</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={destinationCity}
                  onChangeText={setDestinationCity}
                  placeholder="e.g. Accra, Kumasi, Wa, Ho"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Check-in</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={checkIn}
                    onChangeText={setCheckIn}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Check-out</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={checkOut}
                    onChangeText={setCheckOut}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textTertiary}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Budget min ({currency})</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={budgetMin}
                    onChangeText={setBudgetMin}
                    placeholder="100"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldLabel}>Budget max ({currency})</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={budgetMax}
                    onChangeText={setBudgetMax}
                    placeholder="200"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroCardTitle}>Why matching matters</Text>
          <Text style={styles.heroCardBody}>
            Every result shows exactly why a host fits you — diet, quiet hours, languages,
            and neighbourhood — so you can choose with confidence before you message anyone.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.findButton,
            isSearching && styles.findButtonDisabled,
            pressed && !isSearching && styles.findButtonPressed,
          ]}
          onPress={handleFindMatches}
          disabled={isSearching}
          accessibilityRole="button"
          accessibilityLabel="Find my matches"
          accessibilityState={{ disabled: isSearching }}
        >
          <LinearGradient
            colors={isSearching ? [colors.border, colors.border] : [...gradients.accent]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.findButtonGradient}
          >
            {isSearching ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.textSecondary} size="small" />
                <Text style={styles.findButtonTextLoading}>Finding your matches…</Text>
              </View>
            ) : (
              <Text style={styles.findButtonText}>Find my matches</Text>
            )}
          </LinearGradient>
        </Pressable>
      </ScrollView>

      {isSearching ? (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <View style={styles.loadingOverlayBackdrop} />
          <View style={styles.loadingCard}>
            <ActivityIndicator color={colors.teal} size="large" />
            <Text style={styles.loadingTitle}>Matching hosts to your profile</Text>
            <View style={styles.skeletonBlock} />
            <View style={[styles.skeletonBlock, styles.skeletonBlockShort]} />
            <View style={[styles.skeletonBlock, styles.skeletonBlockMedium]} />
          </View>
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
    height: spacing.sm,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.raised,
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
    minHeight: 44,
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
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fieldHalf: {
    flex: 1,
    gap: spacing.sm,
  },
  fieldLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldInput: {
    backgroundColor: colors.warmCream,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    minHeight: 48,
  },
  heroCard: {
    backgroundColor: colors.navyMid,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  heroCardTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.subheading,
  },
  heroCardBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.9,
    lineHeight: lineHeights.body,
  },
  findButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.floating,
  },
  findButtonDisabled: {
    ...shadows.none,
  },
  findButtonPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  findButtonGradient: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  findButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  findButtonTextLoading: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.floating,
  },
  loadingTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: lineHeights.body,
  },
  skeletonBlock: {
    width: '100%',
    height: 14,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  skeletonBlockShort: {
    width: '72%',
    alignSelf: 'flex-start',
  },
  skeletonBlockMedium: {
    width: '88%',
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
});
