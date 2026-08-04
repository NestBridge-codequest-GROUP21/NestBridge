import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import type { KYCPromptData } from '../../data/kycPromptMock';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
  iconSizes,
  avatarSizes,
  touchTarget,
  borderWidths,
} from '../../constants/theme';

export interface KYCPromptScreenProps {
  data: KYCPromptData;
  submitting?: boolean;
  selectedPhotoUri?: string | null;
  onPickPhoto?: () => void;
  onClearPhoto?: () => void;
  onVerifyNow?: () => void;
  onVerifyLater?: () => void;
  onSosPress?: () => void;
}

export default function KYCPromptScreen({
  data,
  submitting = false,
  selectedPhotoUri,
  onPickPhoto,
  onClearPhoto,
  onVerifyNow,
  onVerifyLater,
}: KYCPromptScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const canSubmit = Boolean(selectedPhotoUri) && !submitting;

  return (
    <View style={styles.container}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      <View
        style={[
          styles.topSection,
          { paddingTop: insets.top + spacing.xxl },
        ]}
      >
        <Text style={styles.roleLabel}>{data.roleLabel}</Text>
        <Text style={styles.heading}>{data.message}</Text>
        <Text style={styles.explanation}>{data.explanation}</Text>
      </View>

      <View style={styles.photoSection}>
        {selectedPhotoUri ? (
          <View style={styles.previewWrap}>
            <Image
              source={{ uri: selectedPhotoUri }}
              style={styles.preview}
              accessibilityLabel="Selected identity photo"
            />
            <Pressable
              onPress={onClearPhoto}
              disabled={submitting}
              style={({ pressed }) => [
                styles.clearBtn,
                pressed && styles.pressed,
                submitting && styles.disabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Remove selected photo"
            >
              <Text style={styles.clearLabel}>Change photo</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={onPickPhoto}
            disabled={submitting}
            style={({ pressed }) => [
              styles.pickBtn,
              pressed && styles.pressed,
              submitting && styles.disabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Upload identity photo"
          >
            <Card padding="none" elevation="none" style={styles.iconTile}>
              <AppIcon
                name="camera-outline"
                size={avatarSizes.lg + iconSizes.lg}
                color={colors.onAccent}
              />
            </Card>
            <Text style={styles.pickLabel}>Upload face or ID photo</Text>
          </Pressable>
        )}
      </View>

      <View
        style={[
          styles.buttonContainer,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.xxl },
        ]}
      >
        <PrimaryButton
          label="Submit for review"
          accessibilityLabel="Submit for review"
          onPress={onVerifyNow}
          loading={submitting}
          disabled={!canSubmit}
        />
        <SecondaryButton
          label="Keep browsing"
          onPress={onVerifyLater}
          disabled={submitting}
        />
        <Text style={styles.note}>{data.note}</Text>
      </View>
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: layout.screenPaddingHorizontal,
      justifyContent: 'space-between',
    },
    topSection: {
      alignItems: 'center',
    },
    roleLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: spacing.sm,
    },
    heading: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.heading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.md,
      lineHeight: lineHeights.heading,
    },
    explanation: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.regular,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: lineHeights.body,
    },
    photoSection: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
    },
    pickBtn: {
      alignItems: 'center',
      gap: spacing.md,
      minHeight: touchTarget,
    },
    pickLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    iconTile: {
      width: layout.iconTileSize + avatarSizes.xl,
      height: layout.iconTileSize + avatarSizes.xl,
      borderRadius: borderRadius.lg,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewWrap: {
      alignItems: 'center',
      gap: spacing.sm,
    },
    preview: {
      width: layout.iconTileSize + avatarSizes.xl,
      height: layout.iconTileSize + avatarSizes.xl + spacing.xxl,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      backgroundColor: colors.warmCream,
    },
    clearBtn: {
      minHeight: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
    },
    clearLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
    },
    buttonContainer: {
      gap: spacing.sm,
    },
    note: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.regular,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: spacing.sm,
      lineHeight: lineHeights.caption,
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.5,
    },
  });
}
