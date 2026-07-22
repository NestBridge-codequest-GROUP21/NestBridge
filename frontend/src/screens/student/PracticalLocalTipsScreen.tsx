import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenHeader from '../../components/ScreenHeader';
import ScreenScroll from '../../components/ScreenScroll';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import SectionHeader from '../../components/SectionHeader';
import CategoryFilterChips from '../../components/CategoryFilterChips';
import type { PracticalTipSection } from '../../data/practicalLocalTips';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  lineHeights,
  iconSizes,
  avatarSizes,
  layout,
} from '../../constants/theme';
import { emptyStates } from '../../data/appCopy';

const ALL_CATEGORY_ID = 'all';

export interface PracticalLocalTipsScreenProps {
  greeting: string;
  userName: string;
  userInitials: string;
  statusIcon?: string;
  statusLabel?: string;
  sections: PracticalTipSection[];
  onBack?: () => void;
  onEmptyPrimaryAction?: () => void;
}

/**
 * Practical daily-living tips for foreigners.
 * Culture, etiquette, and language stay on LocalTipsScreen.
 */
export default function PracticalLocalTipsScreen({
  greeting,
  userName,
  userInitials,
  statusIcon,
  statusLabel,
  sections,
  onBack,
  onEmptyPrimaryAction,
}: PracticalLocalTipsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const empty = emptyStates.practicalTips;
  const [categoryId, setCategoryId] = useState(ALL_CATEGORY_ID);

  const categoryOptions = useMemo(
    () => [
      { id: ALL_CATEGORY_ID, label: 'All' },
      ...sections.map((section) => ({
        id: section.id,
        label: section.title,
      })),
    ],
    [sections],
  );

  const visibleSections = useMemo(() => {
    if (categoryId === ALL_CATEGORY_ID) {
      return sections;
    }
    return sections.filter((section) => section.id === categoryId);
  }, [sections, categoryId]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScreenHeader
        greeting={greeting}
        userName={userName}
        userInitials={userInitials}
        statusIcon={statusIcon}
        statusLabel={statusLabel}
        onBack={onBack}
      />

      <ScreenScroll>
        <SectionHeader
          title="Local tips"
          subtitle="Practical daily living — transport, money, connectivity, safety, and getting settled. For greetings and etiquette, open Culture & language."
        />

        {sections.length === 0 ? (
          <EmptyState
            title={empty.title}
            body={empty.body}
            tip={empty.tip}
            iconGlyph={empty.iconGlyph}
            primaryActionLabel={empty.primaryActionLabel}
            onPrimaryAction={onEmptyPrimaryAction}
          />
        ) : (
          <>
            <CategoryFilterChips
              options={categoryOptions}
              selectedId={categoryId}
              onSelect={setCategoryId}
              accessibilityLabel="Local tip categories"
            />

            {visibleSections.length === 0 ? (
              <EmptyState
                title={empty.title}
                body={empty.body}
                tip={empty.tip}
                iconGlyph={empty.iconGlyph}
              />
            ) : (
              visibleSections.map((section, index) => (
                <View
                  key={section.id}
                  style={index > 0 ? styles.sectionSpacer : undefined}
                >
                  <SectionHeader
                    title={section.title}
                    subtitle={section.subtitle}
                    style={styles.sectionTight}
                  />
                  <View style={styles.tipList}>
                    {section.tips.map((tip) => (
                      <Card key={tip.id} padding="md" style={styles.tipCard}>
                        <View style={styles.tipHeader}>
                          <View style={styles.iconTile}>
                            <AppIcon
                              glyph={tip.emoji}
                              size={iconSizes.md}
                              color={colors.onAccent}
                            />
                          </View>
                          <Text style={styles.tipTitle}>{tip.title}</Text>
                        </View>
                        <Text style={styles.tipBody}>{tip.description}</Text>
                      </Card>
                    ))}
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScreenScroll>
    </View>
  );
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    sectionTight: {
      marginBottom: spacing.sm,
    },
    sectionSpacer: {
      marginTop: layout.sectionGap,
    },
    tipList: {
      gap: spacing.md,
    },
    tipCard: {
      width: '100%',
    },
    tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    iconTile: {
      width: avatarSizes.md,
      height: avatarSizes.md,
      borderRadius: borderRadius.md,
      backgroundColor: tints.teal,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipTitle: {
      flex: 1,
      fontFamily: fontFamilies.semibold,
      fontSize: fontSizes.subheading,
      fontWeight: fontWeights.semibold,
      color: colors.textPrimary,
      lineHeight: lineHeights.subheading,
    },
    tipBody: {
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.body,
      color: colors.textSecondary,
      lineHeight: lineHeights.body,
    },
  });
}
