import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import FormTextField from '../../components/FormTextField';
import PrimaryButton from '../../components/PrimaryButton';
import SectionHeader from '../../components/SectionHeader';
import type { TourTypeOption } from '../../data/featureScreensMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderWidths,
  lineHeights,
  touchTarget,
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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

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
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();


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
        <SectionHeader
          title="Tour types"
          subtitle="Choose the experiences you offer and set your base pricing."
        />

        <Card padding="md" style={styles.section}>
          {tourTypes.map((tourType, index) => (
            <TourTypeRow
              key={tourType.id}
              tourType={tourType}
              isLast={index === tourTypes.length - 1}
              onToggle={(enabled) => onToggleTourType?.(tourType.id, enabled)}
            />
          ))}
        </Card>

        <Card padding="md" style={styles.section}>
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
        </Card>

        <PrimaryButton label="Save tour settings" onPress={onSavePress} />
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
  section: {
    marginBottom: spacing.lg,
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
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
    gap: spacing.md,
    minHeight: touchTarget + spacing.md,
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
}

