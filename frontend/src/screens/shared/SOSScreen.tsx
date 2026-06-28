import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  layout,
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
        subtitle="Help is available whenever you need it."
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
            <Text style={styles.emergencyIcon}>!</Text>
          </View>
          <View style={styles.emergencyTextBlock}>
            <Text style={styles.emergencyTitle}>Call emergency services</Text>
            <Text style={styles.emergencySubtitle}>
              Connect with local emergency responders
            </Text>
          </View>
        </Pressable>

        <Text style={styles.listHeading}>Emergency contacts</Text>

        <View style={styles.contactList}>
          {emergencyContacts.map((contact, index) => {
            const isLast = index === emergencyContacts.length - 1;

            return (
              <View
                key={`${contact.label}-${contact.number}`}
                style={[styles.contactRow, !isLast && styles.contactRowBorder]}
              >
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{contact.label}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.callAction,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onContactCallPress?.(contact)}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${contact.label}`}
                >
                  <Text style={styles.callActionText}>Call</Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={styles.footerSpacer} />

        <Text style={styles.footerNote}>
          Your location can be shared with your trusted contacts.
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: layout.sectionGap,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 88,
  },
  pressed: {
    opacity: 0.95,
  },
  emergencyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warmCream,
    borderWidth: 2,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emergencyIcon: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.danger,
    lineHeight: lineHeights.heading,
  },
  emergencyTextBlock: {
    flex: 1,
  },
  emergencyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  emergencySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    color: colors.textSecondary,
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
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 72,
  },
  contactRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactInfo: {
    flex: 1,
    paddingRight: spacing.md,
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
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  callActionText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
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
