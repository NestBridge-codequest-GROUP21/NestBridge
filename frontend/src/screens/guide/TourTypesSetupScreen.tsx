import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import type { TourTypeOption } from '../../data/featureScreensMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  shadows,
} from '../../constants/theme';

export interface TourTypesSetupScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  tourTypes: TourTypeOption[];
  baseRate: string;
  maxGroupSize: string;
  onToggleTourType?: (tourTypeId: string, enabled: boolean) => void;
  onBaseRateChange?: (value: string) => void;
  onMaxGroupSizeChange?: (value: string) => void;
  onSavePress?: () => void;
  onBack?: () => void;
}

function TourTypeRow({
  tourType,
  isLast,
  onToggle,
}: {
  tourType: TourTypeOption;
  isLast: boolean;
  onToggle?: (enabled: boolean) => void;
}) {
  return (
    <View style={[styles.tourRow, isLast && styles.tourRowLast]}>
      <View style={styles.tourInfo}>
        <Text style={styles.tourLabel}>{tourType.label}</Text>
        <Text style={styles.tourDescription}>{tourType.description}</Text>
      </View>
      <Switch
        value={tourType.enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.tealBright }}
        thumbColor={colors.white}
        accessibilityLabel={`Toggle ${tourType.label}`}
      />
    </View>
  );
}

export default function TourTypesSetupScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  tourTypes,
  baseRate,
  maxGroupSize,
  onToggleTourType,
  onBaseRateChange,
  onMaxGroupSizeChange,
  onSavePress,
  onBack,
}: TourTypesSetupScreenProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        statusIcon={statusIcon}
        statusLabel={statusLabel}
        onBack={onBack}
      />

      <ScreenScroll>
        <Text style={styles.screenTitle}>Tour types</Text>
        <Text style={styles.screenSubtitle}>
          Choose the experiences you offer and set your base pricing.
        </Text>

        <View style={styles.section}>
          {tourTypes.map((tourType, index) => (
            <TourTypeRow
              key={tourType.id}
              tourType={tourType}
              isLast={index === tourTypes.length - 1}
              onToggle={(enabled) => onToggleTourType?.(tourType.id, enabled)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & capacity</Text>
          <FormTextField
            label="Base rate (GHS)"
            value={baseRate}
            placeholder="45"
            keyboardType="numeric"
            onChangeText={onBaseRateChange}
          />
          <FormTextField
            label="Max group size"
            value={maxGroupSize}
            placeholder="8"
            keyboardType="numeric"
            onChangeText={onMaxGroupSizeChange}
          />
        </View>

        <PrimaryButton label="Save tour settings" onPress={onSavePress} />
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  screenSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: lineHeights.body,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.md,
  },
  tourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
    minHeight: 56,
  },
  tourRowLast: {
    borderBottomWidth: 0,
  },
  tourInfo: {
    flex: 1,
  },
  tourLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tourDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
});
