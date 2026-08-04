import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import type { EmergencyContact } from './SOSScreen';
import type { HelpTopic } from '../../data/helpDesk';
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

export interface HelpDeskScreenProps {
  topics: HelpTopic[];
  supportContacts: EmergencyContact[];
  onBack?: () => void;
  onOpenSos?: () => void;
  onCallSupport?: (contact: EmergencyContact) => void;
}

export default function HelpDeskScreen({
  topics,
  supportContacts,
  onBack,
  onOpenSos,
  onCallSupport,
}: HelpDeskScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, scheme } = useTheme();

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <ScreenHeader
        title="Help desk"
        subtitle="Stuck in the app? Start here"
        compact
        onBack={onBack}
      />

      <ScreenScroll>
        <InlineBanner
          tone="info"
          message="For danger or medical emergencies, use SOS — not this help desk."
        />

        <SectionHeader title="Common issues" />
        {topics.map((topic) => (
          <Card key={topic.id} padding="lg" style={styles.topicCard}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicBody}>{topic.body}</Text>
          </Card>
        ))}

        <SectionHeader title="Contact NestBridge support" />
        <Text style={styles.sectionHint}>
          Call a team member for booking, payment, KYC, or account help.
        </Text>
        <Card padding="none" style={styles.groupCard}>
          {supportContacts.map((contact, index) => {
            const isLast = index === supportContacts.length - 1;
            return (
              <Pressable
                key={`${contact.number}-${contact.contactName ?? index}`}
                onPress={() => onCallSupport?.(contact)}
                style={({ pressed }) => [
                  styles.contactRow,
                  !isLast && styles.contactBorder,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Call ${contact.contactName ?? contact.organisation}`}
              >
                <View style={styles.contactIcon}>
                  <AppIcon name="call-outline" size={iconSizes.md} color={colors.teal} />
                </View>
                <View style={styles.contactText}>
                  <Text style={styles.contactName}>
                    {contact.contactName ?? contact.organisation}
                  </Text>
                  <Text style={styles.contactMeta}>{contact.number}</Text>
                </View>
                <AppIcon
                  name="chevron-forward"
                  size={iconSizes.md}
                  color={colors.textTertiary}
                />
              </Pressable>
            );
          })}
        </Card>

        <View style={styles.actions}>
          <PrimaryButton label="Open SOS for emergencies" onPress={onOpenSos} />
          <SecondaryButton
            label="Email support (opens mail)"
            onPress={() => {
              void Linking.openURL(
                'mailto:bsbhackman@gmail.com?subject=NestBridge%20help',
              );
            }}
          />
        </View>
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
    topicCard: {
      marginBottom: spacing.md,
    },
    topicTitle: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    topicBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.regular,
      color: colors.textSecondary,
      lineHeight: lineHeights.body,
    },
    sectionHint: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
    },
    groupCard: {
      marginBottom: spacing.lg,
      overflow: 'hidden',
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: touchTarget + spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    contactBorder: {
      borderBottomWidth: borderWidths.hairline,
      borderBottomColor: colors.border,
    },
    pressed: {
      opacity: 0.92,
    },
    contactIcon: {
      width: touchTarget,
      height: touchTarget,
      borderRadius: borderRadius.md,
      backgroundColor: colors.warmCream,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactText: {
      flex: 1,
      minWidth: 0,
    },
    contactName: {
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.body,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
    },
    contactMeta: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    actions: {
      gap: spacing.sm,
      marginBottom: spacing.xxl,
    },
  });
}
