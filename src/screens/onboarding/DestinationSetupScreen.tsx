import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingProgress from '../../components/OnboardingProgress';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';

export interface DestinationSetupScreenProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  city: string;
  university: string;
  arrivalDate: string;
  departureDate: string;
  onCityChange?: (value: string) => void;
  onUniversityChange?: (value: string) => void;
  onArrivalDateChange?: (value: string) => void;
  onDepartureDateChange?: (value: string) => void;
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
  onCityChange,
  onUniversityChange,
  onArrivalDateChange,
  onDepartureDateChange,
  onContinue,
  onBack,
}: DestinationSetupScreenProps) {
  const insets = useSafeAreaInsets();
  const [destinationError, setDestinationError] = useState(false);

  const handleContinue = () => {
    if (city.trim().length === 0) {
      setDestinationError(true);
      return;
    }

    setDestinationError(false);
    onContinue?.();
  };

  const handleCityChange = (value: string) => {
    onCityChange?.(value);
    if (value.trim().length > 0) {
      setDestinationError(false);
    }
  };

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

        <View style={styles.formCard}>
          <FormTextField
            label="Destination"
            value={city}
            placeholder="e.g. Accra, Ghana"
            onChangeText={handleCityChange}
          />
          {destinationError && (
            <Text style={styles.fieldError}>This field is required</Text>
          )}
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

        <PrimaryButton label="Continue →" onPress={handleContinue} />
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
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldError: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.danger,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateField: {
    flex: 1,
  },
});
