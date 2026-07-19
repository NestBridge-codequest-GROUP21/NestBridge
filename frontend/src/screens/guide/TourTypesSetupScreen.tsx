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
  onToggle,
}: {
  tourType: TourTypeOption;
  onToggle?: (enabled: boolean) => void;
}) {
  return (
    <View style={styles.tourRow}>
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
        <Text style={styles.screenTitle}>Tour Types Setup</Text>
        <Text style={styles.screenSubtitle}>
          Choose the experiences you offer and set your base pricing.
        </Text>

        <View style={styles.section}>
          {tourTypes.map((tourType) => (
            <TourTypeRow
              key={tourType.id}
              tourType={tourType}
              onToggle={(enabled) => onToggleTourType?.(tourType.id, enabled)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & capacity</Text>
          <FormTextField
            label="Base Rate ($)"
            value={baseRate}
            placeholder="e.g. 45"
            keyboardType="numeric"
            onChangeText={onBaseRateChange}
          />
          <FormTextField
            label="Max Group Size"
            value={maxGroupSize}
            placeholder="e.g. 8"
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
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
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
  },
  tourInfo: {
    flex: 1,
  },
  tourLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tourDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
});
