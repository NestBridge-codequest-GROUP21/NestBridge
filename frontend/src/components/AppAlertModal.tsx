import { useTheme, useThemedStyles, type AppTheme } from '../theme';
import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import AppIcon, { type IoniconName } from './AppIcon';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  iconSizes,
  touchTarget,
} from '../constants/theme';
import {
  feedbackError,
  feedbackSuccess,
  feedbackWarning,
} from '../services/appFeedback';

export type AppAlertTone = 'info' | 'success' | 'warning' | 'danger';

export type AppAlertButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

export type AppAlertOptions = {
  cancelable?: boolean;
  onDismiss?: () => void;
  tone?: AppAlertTone;
  iconName?: IoniconName;
};

export type AppAlertPayload = {
  title: string;
  message?: string;
  buttons?: AppAlertButton[];
  options?: AppAlertOptions;
};

export interface AppAlertModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AppAlertButton[];
  options?: AppAlertOptions;
  onRequestClose: () => void;
}

function toneIcon(tone: AppAlertTone): IoniconName {
  switch (tone) {
    case 'success':
      return 'checkmark-circle';
    case 'warning':
      return 'warning';
    case 'danger':
      return 'alert-circle';
    default:
      return 'information-circle';
  }
}

function inferTone(
  title: string,
  buttons: AppAlertButton[] | undefined,
  explicit?: AppAlertTone,
): AppAlertTone {
  if (explicit) return explicit;
  if (buttons?.some((button) => button.style === 'destructive')) return 'danger';
  const lower = title.toLowerCase();
  if (
    lower.includes('updated') ||
    lower.includes('success') ||
    lower.includes('submitted') ||
    lower.includes('saved') ||
    lower.includes('successful')
  ) {
    return 'success';
  }
  if (
    lower.includes('could not') ||
    lower.includes('failed') ||
    lower.includes('error') ||
    lower.includes('required') ||
    lower.includes('missing')
  ) {
    return 'danger';
  }
  if (
    lower.includes('explore') ||
    lower.includes('budget') ||
    lower.includes('needed') ||
    lower.includes('permission')
  ) {
    return 'warning';
  }
  return 'info';
}

export default function AppAlertModal({
  visible,
  title,
  message,
  buttons,
  options,
  onRequestClose,
}: AppAlertModalProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, overlays, tints } = useTheme();
  const tone = inferTone(title, buttons, options?.tone);
  const iconName = options?.iconName ?? toneIcon(tone);
  const resolvedButtons =
    buttons && buttons.length > 0
      ? buttons
      : [{ text: 'OK', style: 'default' as const }];

  const cancelable = options?.cancelable !== false;

  useEffect(() => {
    if (!visible) return;
    if (tone === 'success') feedbackSuccess();
    else if (tone === 'danger') feedbackError();
    else if (tone === 'warning') feedbackWarning();
  }, [visible, tone, title]);

  const handleDismiss = () => {
    if (!cancelable) return;
    options?.onDismiss?.();
    onRequestClose();
  };

  const iconColor =
    tone === 'success'
      ? colors.success
      : tone === 'warning'
        ? colors.warning
        : tone === 'danger'
          ? colors.danger
          : colors.teal;

  const iconWellBg =
    tone === 'success'
      ? tints.teal
      : tone === 'warning'
        ? tints.gold
        : tone === 'danger'
          ? tints.terracotta
          : tints.teal;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      <View style={[styles.backdrop, { backgroundColor: overlays.scrimStrong }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss dialog"
        />
        <View
          style={styles.card}
          accessibilityRole="alert"
          accessibilityViewIsModal
        >
          <View style={[styles.iconWell, { backgroundColor: iconWellBg }]}>
            <AppIcon name={iconName} size={iconSizes.xl} color={iconColor} />
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            {resolvedButtons.map((button, index) => {
              const closeThenRun = () => {
                onRequestClose();
                // Defer so the modal can unmount before navigation/side effects.
                requestAnimationFrame(() => {
                  button.onPress?.();
                });
              };
              if (button.style === 'cancel') {
                return (
                  <SecondaryButton
                    key={`${button.text}-${index}`}
                    label={button.text}
                    onPress={closeThenRun}
                    style={styles.actionButton}
                  />
                );
              }
              return (
                <PrimaryButton
                  key={`${button.text}-${index}`}
                  label={button.text}
                  onPress={closeThenRun}
                  tone={button.style === 'destructive' ? 'danger' : 'default'}
                  style={styles.actionButton}
                />
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: layout.screenPaddingHorizontal,
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.lg,
      alignItems: 'center',
    },
    iconWell: {
      width: touchTarget + spacing.md,
      height: touchTarget + spacing.md,
      borderRadius: borderRadius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    title: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.sm,
      lineHeight: lineHeights.subheading,
    },
    message: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: lineHeights.body,
      marginBottom: spacing.lg,
    },
    actions: {
      width: '100%',
      gap: spacing.sm,
    },
    actionButton: {
      width: '100%',
    },
  });
}
