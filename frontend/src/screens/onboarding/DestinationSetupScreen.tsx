import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import OnboardingProgress from '../../components/OnboardingProgress';
import SelectField from '../../components/SelectField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../constants/theme';
import { isLikelyValidPlaceName } from '../../utils/textValidation';
import { validationCopy } from '../../data/appCopy';
import {
  destinationCityOptions,
  universityOptionsForCity,
} from '../../data/ghanaReference';

const DESTINATION_OPTIONS = destinationCityOptions();

function parseDateValue(value: string): Date | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface DatePickerFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange?: (value: string) => void;
}

function DatePickerField({ label, value, placeholder, onChange }: DatePickerFieldProps) {
  const [show, setShow] = useState(false);
  const parsed = parseDateValue(value);
  const initialDate = parsed ?? new Date();
  const displayText = parsed ? formatDisplayDate(parsed) : '';

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'set' && selected) {
      onChange?.(toIsoDate(selected));
    } else if (event.type === 'dismissed') {
      setShow(false);
    }
  };

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        style={styles.dateField}
        onPress={() => setShow(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: displayText || placeholder }}
      >
        <Text style={[styles.dateText, !displayText && styles.datePlaceholder]}>
          {displayText || placeholder}
        </Text>
      </Pressable>

      {show && Platform.OS === 'android' && (
        <DateTimePicker value={initialDate} mode="date" onChange={handleChange} />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={() => setShow(false)}
        >
          <Pressable style={styles.pickerBackdrop} onPress={() => setShow(false)}>
            <Pressable style={styles.pickerSheet} onPress={() => {}}>
              <DateTimePicker
                value={initialDate}
                mode="date"
                display="spinner"
                onChange={(event, selected) => {
                  if (selected) {
                    onChange?.(toIsoDate(selected));
                  }
                }}
              />
              <Pressable
                style={styles.pickerDoneBtn}
                onPress={() => setShow(false)}
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <Text style={styles.pickerDoneText}>Done</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
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
  const [destinationError, setDestinationError] = useState<'required' | 'gibberish' | null>(
    null,
  );
  const universityOptions = useMemo(
    () => universityOptionsForCity(city),
    [city],
  );

  const handleContinue = () => {
    if (city.trim().length === 0) {
      setDestinationError('required');
      return;
    }

    if (!isLikelyValidPlaceName(city)) {
      setDestinationError('gibberish');
      return;
    }

    setDestinationError(null);
    onContinue?.();
  };

  const handleCityChange = (value: string) => {
    onCityChange?.(value);
    if (destinationError) {
      if (value.trim().length === 0) {
        return;
      }
      if (isLikelyValidPlaceName(value)) {
        setDestinationError(null);
      }
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
          <SelectField
            label="Destination"
            value={city}
            placeholder="Select a city"
            options={DESTINATION_OPTIONS}
            onSelect={handleCityChange}
          />
          {destinationError === 'required' && (
            <Text style={styles.fieldError}>This field is required</Text>
          )}
          {destinationError === 'gibberish' && (
            <Text style={styles.fieldError}>{validationCopy.placeInvalid}</Text>
          )}
          <SelectField
            label="University or area"
            value={university}
            placeholder="Select a university or area"
            options={universityOptions}
            onSelect={onUniversityChange}
          />
          <View style={styles.dateRow}>
            <View style={styles.dateFieldCol}>
              <DatePickerField
                label="Arrival"
                value={arrivalDate}
                placeholder="Select date"
                onChange={onArrivalDateChange}
              />
            </View>
            <View style={styles.dateFieldCol}>
              <DatePickerField
                label="Departure"
                value={departureDate}
                placeholder="Select date"
                onChange={onDepartureDateChange}
              />
            </View>
          </View>
        </View>

        <PrimaryButton label="Continue" onPress={handleContinue} />
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
  dateFieldCol: {
    flex: 1,
  },
  fieldWrap: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  dateField: {
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    minHeight: 48,
  },
  dateText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
  },
  datePlaceholder: {
    color: colors.textTertiary,
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.md,
  },
  pickerDoneBtn: {
    alignSelf: 'flex-end',
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerDoneText: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.teal,
  },
});
