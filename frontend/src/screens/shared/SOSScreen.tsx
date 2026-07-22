import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import EmptyState from '../../components/EmptyState';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
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
  controlHeights,
  touchTarget,
} from '../../constants/theme';
import { emptyStates } from '../../data/appCopy';

export interface EmergencyContact {
  /** Organisation or agency name (e.g. Ghana Police Service). */
  organisation: string;
  /** Responsible office / department when known. */
  department?: string;
  /** Role or desk title (e.g. Emergency Dispatch) — not a personal name. */
  contactTitle?: string;
  number: string;
  description?: string;
  /** Person who owns this line (NestBridge team or a saved personal contact). */
  contactName?: string;
  isUserContact?: boolean;
}

export interface SOSScreenProps {
  emergencyContacts: EmergencyContact[];
  onBack?: () => void;
  onCallEmergencyServices?: () => void;
  onContactCallPress?: (contact: EmergencyContact) => void;
  onEmptyPrimaryAction?: () => void;
  /** Fired once when contacts are available — marks journey progress. */
  onJourneyVisit?: () => void;
}

function uniqueContacts(contacts: EmergencyContact[]): EmergencyContact[] {
  const seen = new Set<string>();
  const unique: EmergencyContact[] = [];
  for (const contact of contacts) {
    const key = contact.number.replace(/[^\d+]/g, '');
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(contact);
  }
  return unique;
}

function contactHeading(contact: EmergencyContact): string {
  if (contact.contactName?.trim()) {
    return contact.contactName.trim();
  }
  return contact.organisation;
}

function contactContextLines(contact: EmergencyContact): string[] {
  const lines: string[] = [];
  const org = contact.organisation?.trim() ?? '';
  const name = contact.contactName?.trim() ?? '';
  if (name && org && org.toLowerCase() !== name.toLowerCase()) {
    lines.push(org);
  }

  const office = contact.contactTitle?.trim() || '';
  const department = contact.department?.trim() || '';
  if (department && department.toLowerCase() !== office.toLowerCase()) {
    lines.push(department);
  }
  if (office) {
    lines.push(office);
  }
  if (contact.description?.trim()) {
    lines.push(contact.description.trim());
  }
  return lines;
}

export default function SOSScreen({
  emergencyContacts,
  onBack,
  onCallEmergencyServices,
  onContactCallPress,
  onEmptyPrimaryAction,
  onJourneyVisit,
}: SOSScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const empty = emptyStates.sosContacts;

  const contacts = uniqueContacts(emergencyContacts);

  useEffect(() => {
    if (contacts.length > 0) {
      onJourneyVisit?.();
    }
  }, [contacts.length, onJourneyVisit]);

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
            <AppIcon name="call" size={iconSizes.lg} color={colors.onPrimary} />
          </View>
          <View style={styles.emergencyTextBlock}>
            <Text
              style={styles.emergencyTitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              Call emergency services
            </Text>
            <Text style={styles.emergencySubtitle}>
              Reach Ghana’s national emergency line (112)
            </Text>
          </View>
          <View style={styles.emergencyChevron}>
            <AppIcon
              name="chevron-forward"
              size={iconSizes.lg}
              color={colors.onPrimary}
            />
          </View>
        </Pressable>

        <SectionHeader title="Your emergency contacts" />

        {contacts.length === 0 ? (
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
            primaryActionLabel={empty.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : (
          <Card padding="none" elevation="card">
            {contacts.map((contact, index) => {
              const isLast = index === contacts.length - 1;
              const heading = contactHeading(contact);
              const contextLines = contactContextLines(contact);

              return (
                <View
                  key={`${heading}-${contact.number}`}
                  style={[styles.contactRow, !isLast && styles.contactRowBorder]}
                >
                  <View style={styles.contactBody}>
                    <View style={styles.iconTile}>
                      <AppIcon
                        name="person-outline"
                        size={iconSizes.md}
                        color={colors.onAccent}
                      />
                    </View>
                    <View style={styles.contactText}>
                      <Text style={styles.contactOrg}>{heading}</Text>
                      {contextLines.map((line, lineIndex) => (
                        <Text
                          key={`${heading}-${lineIndex}-${line}`}
                          style={styles.contactMeta}
                        >
                          {line}
                        </Text>
                      ))}
                      <Text style={styles.contactNumber} numberOfLines={1}>
                        {contact.number}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.callAction,
                      pressed && styles.callPressed,
                    ]}
                    onPress={() => onContactCallPress?.(contact)}
                    accessibilityRole="button"
                    accessibilityLabel={`Call ${heading}`}
                  >
                    <AppIcon
                      name="call-outline"
                      size={iconSizes.sm}
                      color={colors.danger}
                    />
                    <Text style={styles.callActionText} numberOfLines={1}>
                      Call
                    </Text>
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

function createStyles({ colors, tints, shadows }: AppTheme) {
  return StyleSheet.create({
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
    gap: spacing.md,
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
    overflow: 'hidden',
    flexShrink: 0,
  },
  emergencyIconTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface,
    opacity: 0.18,
  },
  emergencyTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  emergencyChevron: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emergencyTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.onPrimary,
    marginBottom: spacing.xs,
  },
  emergencySubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    color: colors.onPrimary,
    opacity: 0.9,
  },
  contactRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  contactRowBorder: {
    borderBottomWidth: borderWidths.hairline,
    borderBottomColor: colors.border,
  },
  contactBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconTile: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contactText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  contactOrg: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    lineHeight: lineHeights.body,
  },
  contactMeta: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  contactNumber: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
    lineHeight: lineHeights.body,
    marginTop: spacing.xs,
  },
  callAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: spacing.sm,
    minHeight: touchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: borderWidths.strong,
    borderColor: colors.danger,
    backgroundColor: colors.surface,
  },
  callPressed: {
    opacity: 0.9,
    backgroundColor: tints.terracotta,
  },
  callActionText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.danger,
    flexShrink: 0,
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
}
