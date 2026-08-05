import { useThemedStyles, type AppTheme } from '../../theme';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import SelectField from '../../components/SelectField';
import FormTextField from '../../components/FormTextField';
import CheckboxRow from '../../components/CheckboxRow';
import PrimaryButton from '../../components/PrimaryButton';
import InlineBanner from '../../components/InlineBanner';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  touchTarget,
} from '../../constants/theme';
import {
  CITY_OTHER_OPTION,
  destinationCityOptionsWithOther,
  isCityOtherOption,
  isUniversityValidForCity,
  universityOptionsForCity,
} from '../../data/ghanaReference';
import {
  DIETARY_OPTIONS,
  LANGUAGE_OPTIONS,
  RELIGION_OPTIONS,
} from '../onboarding/quizConstants';
import { SEEKER_BUDGET_RANGES } from '../../data/budgetRanges';
import { isLikelyValidPlaceName } from '../../utils/textValidation';
import type { QuizAnswers } from '../onboarding/QuizPage';

const DESTINATION_OPTIONS_WITH_OTHER = destinationCityOptionsWithOther();
const BUDGET_OPTIONS = SEEKER_BUDGET_RANGES.map((range) => range.label);
const LIFESTYLE_OPTIONS = ['Quiet', 'Flexible', 'Social'] as const;
const CULTURAL_OPTIONS = [
  'No preference',
  'Similar to mine',
  'Open to any background',
] as const;

export interface EditTravelPreferencesValues {
  city: string;
  university: string;
  arrivalDate: string;
  departureDate: string;
  budget: string;
  languages: string[];
  dietary: string[];
  lifestyle: 'Quiet' | 'Flexible' | 'Social';
  religion: string;
  culturalPreference: string;
  foodAllergies: string;
}

export interface EditTravelPreferencesScreenProps {
  userName?: string;
  userInitials?: string;
  initialValues: EditTravelPreferencesValues;
  onSave: (values: EditTravelPreferencesValues) => Promise<void> | void;
  onBack?: () => void;
}

function toggleListValue(list: string[], value: string): string[] {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }
  return [...list, value];
}

export function lifestyleLabelFromQuiz(answers: QuizAnswers): 'Quiet' | 'Flexible' | 'Social' {
  const vibe = answers.householdVibe ?? answers.stayVibe;
  if (typeof vibe === 'number') {
    if (vibe <= 35) return 'Quiet';
    if (vibe >= 65) return 'Social';
    return 'Flexible';
  }
  return 'Flexible';
}

export function quizPatchFromEditor(values: EditTravelPreferencesValues): QuizAnswers {
  const vibe =
    values.lifestyle === 'Quiet' ? 20 : values.lifestyle === 'Social' ? 80 : 50;
  return {
    budget: values.budget,
    languages: values.languages,
    dietary: values.dietary.length > 0 ? values.dietary : ['None'],
    householdVibe: vibe,
    stayVibe: vibe,
    religion: values.religion,
    hostCulturalBackground: values.culturalPreference,
    culturalPreference: values.culturalPreference,
    foodAllergies: values.foodAllergies.trim() || null,
  };
}

export default function EditTravelPreferencesScreen({
  userName = 'Traveller',
  userInitials = 'NB',
  initialValues,
  onSave,
  onBack,
}: EditTravelPreferencesScreenProps) {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const [city, setCity] = useState(initialValues.city);
  const [customCityMode, setCustomCityMode] = useState(
    () =>
      initialValues.city.trim().length > 0 &&
      !DESTINATION_OPTIONS_WITH_OTHER.includes(initialValues.city) &&
      initialValues.city !== CITY_OTHER_OPTION,
  );
  const [university, setUniversity] = useState(initialValues.university);
  const [arrivalDate, setArrivalDate] = useState(initialValues.arrivalDate);
  const [departureDate, setDepartureDate] = useState(initialValues.departureDate);
  const [budget, setBudget] = useState(initialValues.budget);
  const [languages, setLanguages] = useState(initialValues.languages);
  const [dietary, setDietary] = useState(initialValues.dietary);
  const [lifestyle, setLifestyle] = useState(initialValues.lifestyle);
  const [religion, setReligion] = useState(initialValues.religion);
  const [culturalPreference, setCulturalPreference] = useState(
    initialValues.culturalPreference,
  );
  const [foodAllergies, setFoodAllergies] = useState(initialValues.foodAllergies);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const universityOptions = useMemo(
    () => universityOptionsForCity(city),
    [city],
  );

  const selectCityValue = customCityMode
    ? CITY_OTHER_OPTION
    : DESTINATION_OPTIONS_WITH_OTHER.includes(city)
      ? city
      : '';

  const handleSave = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity || isCityOtherOption(trimmedCity)) {
      setError('Choose a destination city so we can match hosts nearby.');
      return;
    }
    if (!isLikelyValidPlaceName(trimmedCity)) {
      setError('Enter a real Ghanaian city or area name.');
      return;
    }
    if (!budget) {
      setError('Select a nightly budget range.');
      return;
    }
    if (languages.length === 0) {
      setError('Select at least one language you speak.');
      return;
    }

    let nextUniversity = university;
    if (nextUniversity && !isUniversityValidForCity(nextUniversity, trimmedCity)) {
      nextUniversity = '';
    }

    setError(null);
    setSaving(true);
    try {
      await onSave({
        city: trimmedCity,
        university: nextUniversity,
        arrivalDate: arrivalDate.trim(),
        departureDate: departureDate.trim(),
        budget,
        languages,
        dietary: dietary.filter((item) => item.toLowerCase() !== 'none'),
        lifestyle,
        religion,
        culturalPreference,
        foodAllergies,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your travel details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Travel details"
        userName={userName}
        userInitials={userInitials}
        subtitle="Update destination and match preferences anytime"
        onBack={onBack}
      />

      <ScreenScroll
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <Card padding="lg" style={styles.introCard}>
          <Text style={styles.introTitle}>What you can change</Text>
          <Text style={styles.introBody}>
            Destination, dates, budget, languages, diet, and household vibe feed the
            real matching score. Email, password, and locked identity bio stay protected.
          </Text>
        </Card>

        {error ? <InlineBanner tone="error" message={error} /> : null}

        <Text style={styles.sectionTitle}>Destination</Text>
        <Card padding="lg" style={styles.sectionCard}>
          <SelectField
            label="City / area"
            value={selectCityValue}
            placeholder="Select destination"
            options={DESTINATION_OPTIONS_WITH_OTHER}
            onSelect={(value) => {
              if (isCityOtherOption(value)) {
                setCustomCityMode(true);
                setCity('');
                setUniversity('');
                return;
              }
              setCustomCityMode(false);
              setCity(value);
              if (university && !isUniversityValidForCity(university, value)) {
                setUniversity('');
              }
            }}
          />
          {customCityMode ? (
            <FormTextField
              label="Custom city or area"
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Damongo, Hohoe"
              autoCapitalize="words"
            />
          ) : null}
          <SelectField
            label="University / campus (optional)"
            value={university}
            placeholder="Near which campus?"
            options={universityOptions}
            onSelect={setUniversity}
          />
          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <FormTextField
                label="Arrival"
                value={arrivalDate}
                onChangeText={setArrivalDate}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.fieldHalf}>
              <FormTextField
                label="Departure"
                value={departureDate}
                onChangeText={setDepartureDate}
                placeholder="YYYY-MM-DD"
                autoCapitalize="none"
              />
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Budget</Text>
        <Card padding="lg" style={styles.sectionCard}>
          <SelectField
            label="Nightly budget"
            value={budget}
            placeholder="Select budget range"
            options={BUDGET_OPTIONS}
            onSelect={setBudget}
          />
        </Card>

        <Text style={styles.sectionTitle}>Languages</Text>
        <Card padding="lg" style={styles.sectionCard}>
          {LANGUAGE_OPTIONS.map((option) => (
            <CheckboxRow
              key={option}
              label={option}
              checked={languages.includes(option)}
              onPress={() => setLanguages((prev) => toggleListValue(prev, option))}
              style={styles.checkRow}
            />
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Diet & household</Text>
        <Card padding="lg" style={styles.sectionCard}>
          {DIETARY_OPTIONS.filter((option) => option !== 'None').map((option) => (
            <CheckboxRow
              key={option}
              label={option}
              checked={dietary.includes(option)}
              onPress={() => setDietary((prev) => toggleListValue(prev, option))}
              style={styles.checkRow}
            />
          ))}
          <FormTextField
            label="Food allergies (optional)"
            value={foodAllergies}
            onChangeText={setFoodAllergies}
            placeholder="e.g. peanuts, shellfish"
          />
          <Text style={styles.chipLabel}>Household vibe</Text>
          <View style={styles.chipRow}>
            {LIFESTYLE_OPTIONS.map((option) => {
              const selected = lifestyle === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => setLifestyle(option)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Culture (optional)</Text>
        <Card padding="lg" style={styles.sectionCard}>
          <SelectField
            label="Religion to share with hosts"
            value={religion}
            placeholder="Optional"
            options={RELIGION_OPTIONS}
            onSelect={setReligion}
          />
          <SelectField
            label="Host cultural preference"
            value={culturalPreference}
            placeholder="No preference"
            options={[...CULTURAL_OPTIONS]}
            onSelect={setCulturalPreference}
          />
        </Card>

        <PrimaryButton
          label="Save and refresh matches"
          onPress={() => {
            void handleSave();
          }}
          loading={saving}
          iconName="checkmark-circle-outline"
        />
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: layout.screenPaddingHorizontal,
      paddingTop: spacing.md,
      gap: spacing.sm,
    },
    introCard: {
      marginBottom: spacing.sm,
    },
    introTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    introBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.body,
      color: colors.textSecondary,
    },
    sectionTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.textSecondary,
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    sectionCard: {
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    fieldRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    fieldHalf: {
      flex: 1,
    },
    checkRow: {
      marginBottom: spacing.xs,
    },
    chipLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    chip: {
      minHeight: touchTarget,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipSelected: {
      borderColor: colors.teal,
      backgroundColor: colors.warmCream,
    },
    chipPressed: {
      opacity: 0.9,
    },
    chipText: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textPrimary,
    },
    chipTextSelected: {
      color: colors.teal,
      fontFamily: fontFamilies.semibold,
      fontWeight: fontWeights.semibold,
    },
  });
}
