import { useTheme, useThemedStyles, type AppTheme, THEME_OPTIONS } from '../../theme';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import AppIcon from '../../components/AppIcon';
import InlineBanner from '../../components/InlineBanner';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  iconSizes,
  touchTarget,
} from '../../constants/theme';

export interface SettingsScreenProps {
  notificationsEnabled: boolean;
  notificationsSaving?: boolean;
  notificationsError?: string;
  onNotificationsChange?: (enabled: boolean) => void;
  onHelpPress?: () => void;
  onBack?: () => void;
}

export default function SettingsScreen({
  notificationsEnabled,
  notificationsSaving = false,
  notificationsError,
  onNotificationsChange,
  onHelpPress,
  onBack,
}: SettingsScreenProps) {
  const { preference, setPreference, colors, scheme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />

      <ScreenHeader
        title="Settings"
        subtitle="Appearance and notification preferences"
        compact
        onBack={onBack}
      />

      <ScreenScroll>
        <SectionHeader title="Appearance" />
        <Card padding="none" style={styles.groupCard}>
          {THEME_OPTIONS.map((option, index) => {
            const selected = preference === option.id;
            const isLast = index === THEME_OPTIONS.length - 1;
            return (
              <Pressable
                key={option.id}
                onPress={() => setPreference(option.id)}
                style={({ pressed }) => [
                  styles.themeRow,
                  !isLast && styles.themeRowBorder,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`${option.label} theme`}
              >
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: option.swatchBackground },
                  ]}
                >
                  <View
                    style={[
                      styles.swatchSurface,
                      { backgroundColor: option.swatchSurface },
                    ]}
                  />
                  <View
                    style={[
                      styles.swatchPrimary,
                      { backgroundColor: option.swatchPrimary },
                    ]}
                  />
                  <View
                    style={[
                      styles.swatchAccent,
                      { backgroundColor: option.swatchAccent },
                    ]}
                  />
                </View>
                <View style={styles.themeText}>
                  <Text style={styles.themeLabel}>{option.label}</Text>
                  <Text style={styles.themeSubtitle}>{option.subtitle}</Text>
                </View>
                {selected ? (
                  <AppIcon
                    name="checkmark-circle"
                    size={iconSizes.lg}
                    color={colors.success}
                  />
                ) : (
                  <View style={styles.radioIdle} />
                )}
              </Pressable>
            );
          })}
        </Card>

        <SectionHeader title="Notifications" />
        <Card padding="lg" style={styles.groupCard}>
          <View style={styles.notifyRow}>
            <View style={styles.notifyText}>
              <Text style={styles.notifyLabel}>Enable notifications</Text>
              <Text style={styles.notifySubtitle}>
                Push alerts and unread badges on Home
              </Text>
            </View>
            {notificationsSaving ? (
              <ActivityIndicator color={colors.teal} />
            ) : (
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => onNotificationsChange?.(value)}
                trackColor={{ false: colors.border, true: colors.tealBright }}
                thumbColor={colors.white}
                accessibilityLabel="Enable notifications"
              />
            )}
          </View>
          {notificationsError ? (
            <InlineBanner
              tone="error"
              message={notificationsError}
              style={styles.notifyError}
            />
          ) : null}
        </Card>

        {onHelpPress ? (
          <>
            <SectionHeader title="Support" />
            <Card padding="none" style={styles.groupCard}>
              <Pressable
                onPress={onHelpPress}
                style={({ pressed }) => [
                  styles.themeRow,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Open help desk"
              >
                <View style={styles.themeText}>
                  <Text style={styles.themeLabel}>Help desk</Text>
                  <Text style={styles.themeSubtitle}>
                    Guidance and NestBridge support contacts
                  </Text>
                </View>
                <AppIcon
                  name="chevron-forward"
                  size={iconSizes.lg}
                  color={colors.textTertiary}
                />
              </Pressable>
            </Card>
          </>
        ) : null}
      </ScreenScroll>
    </View>
  );
}

/** Optional local hook used when parent wants optimistic toggle UI. */
export function useLocalNotificationsToggle(
  initial: boolean,
): [boolean, (next: boolean) => void] {
  const [enabled, setEnabled] = useState(initial);
  useEffect(() => {
    setEnabled(initial);
  }, [initial]);
  const update = useCallback((next: boolean) => {
    setEnabled(next);
  }, []);
  return [enabled, update];
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    groupCard: {
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: touchTarget + spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    themeRowBorder: {
      borderBottomWidth: borderWidths.hairline,
      borderBottomColor: colors.border,
    },
    pressed: {
      opacity: 0.92,
    },
    swatch: {
      width: touchTarget,
      height: touchTarget,
      borderRadius: borderRadius.md,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      overflow: 'hidden',
      padding: spacing.xs,
      justifyContent: 'space-between',
    },
    swatchSurface: {
      height: spacing.sm + spacing.xs,
      borderRadius: borderRadius.sm,
    },
    swatchPrimary: {
      width: '70%',
      height: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    swatchAccent: {
      position: 'absolute',
      right: spacing.xs,
      bottom: spacing.xs,
      width: spacing.sm + spacing.xs,
      height: spacing.sm + spacing.xs,
      borderRadius: borderRadius.sm,
    },
    themeText: {
      flex: 1,
      minWidth: 0,
    },
    themeLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    themeSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: lineHeights.caption,
    },
    radioIdle: {
      width: iconSizes.lg,
      height: iconSizes.lg,
      borderRadius: borderRadius.pill,
      borderWidth: borderWidths.strong,
      borderColor: colors.border,
    },
    notifyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: touchTarget,
    },
    notifyText: {
      flex: 1,
      minWidth: 0,
    },
    notifyLabel: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    notifySubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: lineHeights.caption,
    },
    notifyError: {
      marginTop: spacing.md,
    },
  });
}
