import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import EmptyState from '../../components/EmptyState';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import ListRow from '../../components/ListRow';
import SectionHeader from '../../components/SectionHeader';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  lineHeights,
  layout,
  shadows,
  iconSizes,
  controlHeights,
  touchTarget,
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
            <View style={styles.emergencyIconTint} />
            <AppIcon name="call" size={iconSizes.lg} color={colors.white} />
          </View>
          <View style={styles.emergencyTextBlock}>
            <Text style={styles.emergencyTitle}>Call emergency services</Text>
            <Text style={styles.emergencySubtitle}>
              Reach Ghana’s national emergency line (112)
            </Text>
          </View>
          <AppIcon name="chevron-forward" size={iconSizes.lg} color={colors.white} />
        </Pressable>

        <SectionHeader title="Your emergency contacts" />

        {emergencyContacts.length === 0 ? (
          <EmptyState
            title="No contacts saved yet"
            body="Add trusted contacts from your profile so you can reach them quickly in an emergency."
            tip="Campus security and your host family are good starting points."
            iconName="people-outline"
          />
        ) : (
          <Card padding="none" elevation="card">
            {emergencyContacts.map((contact, index) => {
              const isLast = index === emergencyContacts.length - 1;

              return (
                <View
                  key={`${contact.label}-${contact.number}`}
                  style={[styles.contactRow, !isLast && styles.contactRowBorder]}
                >
                  <ListRow
                    title={contact.label}
                    subtitle={contact.number}
                    iconName="person-outline"
                    showChevron={false}
                    bordered={false}
                    style={styles.contactListRow}
                  />
                  <Pressable
                    style={({ pressed }) => [
                      styles.callAction,
                      pressed && styles.callPressed,
                    ]}
                    onPress={() => onContactCallPress?.(contact)}
                    accessibilityRole="button"
                    accessibilityLabel={`Call ${contact.label}`}
                  >
                    <AppIcon name="call-outline" size={iconSizes.sm} color={colors.white} />
                    <Text style={styles.callActionText}>Call</Text>
                  </Pressable>
                </View>
              );
            })}
          </Card>
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
    padding: layout.cardPaddingLarge,
    marginBottom: layout.sectionGap,
    minHeight: controlHeights.lg + spacing.xl,
    ...shadows.raised,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  emergencyIconWrap: {
    width: controlHeights.lg,
    height: controlHeights.lg,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  emergencyIconTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    opacity: 0.18,
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.md,
    minHeight: touchTarget + spacing.md,
  },
  contactRowBorder: {
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
  },
  contactListRow: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  callAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touchTarget,
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
