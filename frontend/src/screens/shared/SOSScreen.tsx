import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useEffect, useState } from 'react';
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
    let key = contact.number.replace(/[^\d]/g, '');
    if (key.length === 10 && key.startsWith('0')) {
      key = `233${key.slice(1)}`;
    }
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

function contactSubtitle(contact: EmergencyContact): string {
  if (contact.contactName?.trim()) {
    return contact.organisation;
  }
  return (
    contact.contactTitle?.trim() ||
    contact.department?.trim() ||
    'Emergency contact'
  );
}

function contactDetailLines(contact: EmergencyContact): string[] {
  const lines: string[] = [];
  const office = contact.contactTitle?.trim() || '';
  const department = contact.department?.trim() || '';
  if (department && department.toLowerCase() !== office.toLowerCase()) {
    lines.push(department);
  }
  if (office && office.toLowerCase() !== contactSubtitle(contact).toLowerCase()) {
    lines.push(office);
  }
  if (contact.description?.trim()) {
    lines.push(contact.description.trim());
  }
  return lines;
}

function contactKey(contact: EmergencyContact): string {
  return `${contactHeading(contact)}-${contact.number}`;
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
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

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
            <Text style={styles.emergencySubtitle} numberOfLines={2}>
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
              const key = contactKey(contact);
              const expanded = expandedKey === key;
              const detailLines = contactDetailLines(contact);

              return (
                <View
                  key={key}
                  style={[styles.contactRow, !isLast && styles.contactRowBorder]}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.contactSummary,
                      pressed && styles.pressed,
                    ]}
                    onPress={() =>
                      setExpandedKey((current) => (current === key ? null : key))
                    }
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    accessibilityLabel={`${heading}, ${contact.number}. ${
                      expanded ? 'Hide details' : 'Show details'
                    }`}
                  >
                    <View style={styles.iconTile}>
                      <AppIcon
                        name="person-outline"
                        size={iconSizes.md}
                        color={colors.onAccent}
                      />
                    </View>
                    <View style={styles.contactText}>
                      <Text style={styles.contactOrg} numberOfLines={1}>
                        {heading}
                      </Text>
                      <Text style={styles.contactMeta} numberOfLines={1}>
                        {contactSubtitle(contact)}
                      </Text>
                      <Text style={styles.contactNumber} numberOfLines={1}>
                        {contact.number}
                      </Text>
                      {!expanded ? (
                        <Text style={styles.expandHint} numberOfLines={1}>
                          Tap to expand · Call
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.expandChevron}>
                      <AppIcon
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={iconSizes.md}
                        color={colors.textTertiary}
                      />
                    </View>
                  </Pressable>

                  {expanded ? (
                    <View style={styles.contactExpanded}>
                      {detailLines.length > 0 ? (
                        detailLines.map((line, lineIndex) => (
                          <Text
                            key={`${key}-detail-${lineIndex}`}
                            style={styles.contactDetail}
                          >
                            {line}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.contactDetail}>
                          NestBridge support contact
                        </Text>
                      )}
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
                  ) : null}
                </View>
              );
            })}
          </Card>
        )}

        <View style={styles.footerSpacer} />

        <Text style={styles.footerNote}>
          In a real emergency, call local services first. NestBridge contacts are
          a backup — not a replacement for 112. Tap a contact to see full details.
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
      paddingVertical: spacing.sm,
    },
    contactRowBorder: {
      borderBottomWidth: borderWidths.hairline,
      borderBottomColor: colors.border,
    },
    contactSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      minHeight: touchTarget,
      paddingVertical: spacing.sm,
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
      gap: spacing.xs / 2,
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
      fontSize: fontSizes.caption,
      fontWeight: fontWeights.semibold,
      color: colors.teal,
      lineHeight: lineHeights.caption,
    },
    expandHint: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textTertiary,
      lineHeight: lineHeights.caption,
      marginTop: spacing.xs / 2,
    },
    expandChevron: {
      width: touchTarget,
      height: touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    contactExpanded: {
      paddingLeft: touchTarget + spacing.md,
      paddingBottom: spacing.sm,
      gap: spacing.sm,
    },
    contactDetail: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.caption,
      color: colors.textSecondary,
      lineHeight: lineHeights.caption,
    },
    callAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
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
