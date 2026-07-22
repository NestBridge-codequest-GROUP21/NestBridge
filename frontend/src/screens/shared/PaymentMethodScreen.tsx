import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import AppIcon from '../../components/AppIcon';
import PrimaryButton from '../../components/PrimaryButton';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  touchTarget,
  iconSizes,
} from '../../constants/theme';

export type PaymentMethodId = 'mobile_money' | 'card' | 'bank_transfer';

export type PaymentMethodOption = {
  id: PaymentMethodId;
  title: string;
  subtitle: string;
  icon: string;
};

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    id: 'mobile_money',
    title: 'Mobile Money',
    subtitle: 'MTN, Telecel, or AirtelTigo MoMo',
    icon: '📱',
  },
  {
    id: 'card',
    title: 'Bank card',
    subtitle: 'Visa or Mastercard',
    icon: '💳',
  },
  {
    id: 'bank_transfer',
    title: 'Bank transfer',
    subtitle: 'Pay from your Ghana bank account',
    icon: '🏦',
  },
];

export interface PaymentMethodScreenProps {
  hostName: string;
  amountLabel: string;
  currencyLabel?: string;
  selectedMethodId?: PaymentMethodId | null;
  paying?: boolean;
  statusLabel?: string;
  onSelectMethod?: (methodId: PaymentMethodId) => void;
  onPayPress?: () => void;
  onBack?: () => void;
}

export default function PaymentMethodScreen({
  hostName,
  amountLabel,
  currencyLabel = 'GHS',
  selectedMethodId = null,
  paying = false,
  statusLabel,
  onSelectMethod,
  onPayPress,
  onBack,
}: PaymentMethodScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const canPay = Boolean(selectedMethodId) && !paying;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting="Pay securely"
        userName={hostName}
        userInitials="NB"
        subtitle="Choose how you want to pay"
        onBack={onBack}
      />

      <ScreenScroll contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryEyebrow}>Amount due</Text>
          <Text style={styles.summaryAmount}>
            {currencyLabel} {amountLabel}
          </Text>
          <Text style={styles.summaryHost}>for {hostName}</Text>
          <Text style={styles.summaryNote}>
            NestBridge opens Paystack checkout for Mobile Money, cards, and bank transfer.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Payment method</Text>
        {PAYMENT_METHOD_OPTIONS.map((option) => {
          const selected = selectedMethodId === option.id;
          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.methodRow,
                selected && styles.methodRowSelected,
                pressed && styles.pressed,
              ]}
              onPress={() => onSelectMethod?.(option.id)}
              disabled={paying}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: paying }}
              accessibilityLabel={`${option.title}. ${option.subtitle}`}
            >
              <View style={styles.methodIconWrap}>
                <AppIcon glyph={option.icon} size={iconSizes.md} color={colors.teal} />
              </View>
              <View style={styles.methodText}>
                <Text style={styles.methodTitle}>{option.title}</Text>
                <Text style={styles.methodSubtitle}>{option.subtitle}</Text>
              </View>
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          );
        })}

        {statusLabel ? <Text style={styles.statusLabel}>{statusLabel}</Text> : null}

        <PrimaryButton
          label={
            paying
              ? statusLabel || 'Opening Paystack...'
              : selectedMethodId
                ? 'Continue to Paystack'
                : 'Select a payment method'
          }
          onPress={onPayPress}
          disabled={!canPay}
        />

        {paying ? (
          <View style={styles.busyRow}>
            <ActivityIndicator color={colors.teal} />
            <Text style={styles.busyText}>Secure checkout will open next</Text>
          </View>
        ) : null}
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
      gap: spacing.md,
      paddingBottom: spacing.xxl,
    },
    summaryCard: {
      gap: spacing.xs,
    },
    summaryEyebrow: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
      textTransform: 'uppercase',
    },
    summaryAmount: {
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.heading,
      lineHeight: lineHeights.heading,
      fontWeight: fontWeights.bold,
      color: colors.textPrimary,
    },
    summaryHost: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      color: colors.textSecondary,
    },
    summaryNote: {
      marginTop: spacing.sm,
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textTertiary,
    },
    sectionTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      lineHeight: lineHeights.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginTop: spacing.sm,
    },
    methodRow: {
      minHeight: touchTarget,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      borderWidth: borderWidths.hairline,
      borderColor: colors.border,
      backgroundColor: colors.white,
    },
    methodRowSelected: {
      borderColor: colors.teal,
      borderWidth: borderWidths.strong,
      backgroundColor: colors.warmCream,
    },
    methodIconWrap: {
      width: touchTarget,
      height: touchTarget,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    methodText: {
      flex: 1,
      gap: spacing.xs,
    },
    methodTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    methodSubtitle: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
    },
    radio: {
      width: spacing.lg,
      height: spacing.lg,
      borderRadius: borderRadius.pill,
      borderWidth: borderWidths.strong,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: colors.teal,
    },
    radioDot: {
      width: spacing.sm,
      height: spacing.sm,
      borderRadius: borderRadius.pill,
      backgroundColor: colors.teal,
    },
    statusLabel: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    busyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    busyText: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      lineHeight: lineHeights.caption,
      color: colors.textSecondary,
    },
    pressed: {
      opacity: 0.9,
    },
  });
}
