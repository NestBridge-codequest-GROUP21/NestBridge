import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingProgress from '../../components/OnboardingProgress';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';

export interface DestinationSuggestion {
  id: string;
  city: string;
  country: string;
  flag: string;
}

export interface DestinationSetupScreenProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  city: string;
  university: string;
  arrivalDate: string;
  departureDate: string;
  suggestions: DestinationSuggestion[];
  selectedSuggestionId?: string;
  onCityChange?: (value: string) => void;
  onUniversityChange?: (value: string) => void;
  onArrivalDateChange?: (value: string) => void;
  onDepartureDateChange?: (value: string) => void;
  onSelectSuggestion?: (id: string) => void;
  onContinue?: () => void;
  onBack?: () => void;
}

export default function DestinationSetupScreen({
  currentStep,
  totalSteps,
  title,
  subtitle,
  city,
  university,
  arrivalDate,
  departureDate,
  suggestions,
  selectedSuggestionId,
  onCityChange,
  onUniversityChange,
  onArrivalDateChange,
  onDepartureDateChange,
  onSelectSuggestion,
  onContinue,
  onBack,
}: DestinationSetupScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        )}

        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepLabel="Destination"
        />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Text style={styles.suggestionsLabel}>Popular destinations</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsRow}
        >
          {suggestions.map((item) => {
            const selected = item.id === selectedSuggestionId;
            return (
              <Pressable
                key={item.id}
                style={[styles.suggestionChip, selected && styles.suggestionChipSelected]}
                onPress={() => onSelectSuggestion?.(item.id)}
              >
                <Text style={styles.suggestionFlag}>{item.flag}</Text>
                <Text style={[styles.suggestionCity, selected && styles.suggestionCitySelected]}>
                  {item.city}
                </Text>
                <Text style={styles.suggestionCountry}>{item.country}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.formCard}>
          <FormTextField
            label="City"
            value={city}
            placeholder="e.g. Accra"
            onChangeText={onCityChange}
          />
          <FormTextField
            label="University or area"
            value={university}
            placeholder="e.g. University of Ghana, East Legon"
            onChangeText={onUniversityChange}
          />
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <FormTextField
                label="Arrival"
                value={arrivalDate}
                placeholder="Jul 15, 2026"
                onChangeText={onArrivalDateChange}
              />
            </View>
            <View style={styles.dateField}>
              <FormTextField
                label="Departure"
                value={departureDate}
                placeholder="Aug 5, 2026"
                onChangeText={onDepartureDateChange}
              />
            </View>
          </View>
        </View>

        <PrimaryButton label="Continue →" onPress={onContinue} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  backBtn: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  title: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  suggestionsLabel: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.sm,
  },
  suggestionsRow: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  suggestionChip: {
    width: 120,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  suggestionChipSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.warmCream,
  },
  suggestionFlag: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  suggestionCity: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  suggestionCitySelected: {
    color: colors.tealDeep,
  },
  suggestionCountry: {
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateField: {
    flex: 1,
  },
});
