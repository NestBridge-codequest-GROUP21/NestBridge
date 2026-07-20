import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import EmptyState from '../../components/EmptyState';
import AppIcon from '../../components/AppIcon';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  layout,
  shadows,
  tints,
} from '../../constants/theme';

export interface EmergencyContact {
  label: string;
  number: string;
}

export interface SOSScreenProps {
  emergencyContacts: EmergencyContact[];
  onBack?: () => void;
  onCallEmergencyServices?: () => void;
  onContactCallPress?: (contact: EmergencyContact) => void;
}

export default function SOSScreen({
  emergencyContacts,
  onBack,
  onCallEmergencyServices,
  onContactCallPress,
}: SOSScreenProps) {
  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenHeader
        title="Emergency help"
        subtitle="Local numbers and trusted contacts — ready when you need them."
        compact
        onBack={onBack}
      />

      <ScreenScroll contentContainerStyle={styles.scrollContent}>
        <Pressable
          style={({ pressed }) => [
            styles.emergencyButton,
            pressed && styles.pressed,
          ]}
          onPress={onCallEmergencyServices}
          accessibilityRole="button"
          accessibilityLabel="Call emergency services"
        >
          <View style={styles.emergencyIconWrap}>
            <AppIcon name="call" size={26} color={colors.white} />
          </View>
          <View style={styles.emergencyTextBlock}>
            <Text style={styles.emergencyTitle}>Call emergency services</Text>
            <Text style={styles.emergencySubtitle}>
              Reach Ghana’s national emergency line (112)
            </Text>
          </View>
          <AppIcon name="chevron-forward" size={22} color={colors.white} />
        </Pressable>

        <Text style={styles.listHeading}>Your emergency contacts</Text>

        {emergencyContacts.length === 0 ? (
          <EmptyState
            title="No contacts saved yet"
            body="Add trusted contacts from your profile so you can reach them quickly in an emergency."
            tip="Campus security and your host family are good starting points."
            iconName="people-outline"
          />
        ) : (
          <View style={styles.contactList}>
            {emergencyContacts.map((contact, index) => {
              const isLast = index === emergencyContacts.length - 1;

              return (
                <View
                  key={`${contact.label}-${contact.number}`}
                  style={[styles.contactRow, !isLast && styles.contactRowBorder]}
                >
                  <View style={styles.contactAvatar}>
                    <AppIcon name="person-outline" size={20} color={colors.tealDeep} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>{contact.label}</Text>
                    <Text style={styles.contactNumber}>{contact.number}</Text>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.callAction,
                      pressed && styles.callPressed,
                    ]}
                    onPress={() => onContactCallPress?.(contact)}
                    accessibilityRole="button"
                    accessibilityLabel={`Call ${contact.label}`}
                  >
                    <AppIcon name="call-outline" size={18} color={colors.white} />
                    <Text style={styles.callActionText}>Call</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.footerSpacer} />

        <Text style={styles.footerNote}>
          In a real emergency, call local services first. NestBridge contacts are
          a backup — not a replacement for 112.
        </Text>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: spacing.xl,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: layout.sectionGap,
    minHeight: 88,
    ...shadows.raised,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  emergencyIconWrap: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emergencyTextBlock: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  emergencyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  emergencySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    color: colors.white,
    opacity: 0.9,
  },
  listHeading: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  contactList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 72,
  },
  contactRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  contactLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  contactNumber: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
  },
  callAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.tealBright,
  },
  callPressed: {
    opacity: 0.9,
  },
  callActionText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  footerSpacer: {
    flex: 1,
    minHeight: spacing.xl,
  },
  footerNote: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
});
