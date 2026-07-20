import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../components/PrimaryButton';
import BackButton from '../../components/BackButton';
import AppIcon from '../../components/AppIcon';
import Card from '../../components/Card';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  borderWidths,
  gradients,
  lineHeights,
  layout,
  iconSizes,
  avatarSizes,
  touchTarget,
} from '../../constants/theme';
import type { PrimaryIntent } from '../../types/accountProfile';
import {
  PRIMARY_INTENT_DESCRIPTIONS,
  PRIMARY_INTENT_ICONS,
  PRIMARY_INTENT_LABELS,
} from '../../types/accountProfile';

export interface IntentOption {
  id: PrimaryIntent;
  label: string;
  description: string;
  icon: string;
}

export interface IntentSelectScreenProps {
  title: string;
  subtitle: string;
  noteTitle?: string;
  noteBody?: string;
  options: IntentOption[];
  selectedIntent?: PrimaryIntent | null;
  onSelect?: (intent: PrimaryIntent) => void;
  onContinue?: () => void;
  onBack?: () => void;
}

export default function IntentSelectScreen({
  title,
  subtitle,
  noteTitle = 'You can do it all here',
  noteBody = 'Pick what matters most right now. You can still book guides and find stays anytime.',
  options,
  selectedIntent,
  onSelect,
  onContinue,
  onBack,
}: IntentSelectScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, gradients } = useTheme();


  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        style={[styles.header, { paddingTop: insets.top + spacing.md }]}
      >
        {onBack ? (
          <BackButton
            onPress={onBack}
            color={colors.onPrimary}
            style={styles.back}
          />
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {options.map((option) => {
          const selected = selectedIntent === option.id;
          return (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.optionPressable,
                pressed && styles.optionPressed,
              ]}
              onPress={() => onSelect?.(option.id)}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
            >
              <Card
                padding="lg"
                style={[styles.optionCard, selected && styles.optionCardSelected]}
              >
                <View style={styles.optionIconTile}>
                  <AppIcon
                    glyph={option.icon}
                    size={iconSizes.lg}
                    color={colors.tealDeep}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </Card>
            </Pressable>
          );
        })}

        <Card padding="lg" style={styles.noteCard}>
          <Text style={styles.noteTitle}>{noteTitle}</Text>
          <Text style={styles.noteBody}>{noteBody}</Text>
        </Card>

        <PrimaryButton
          label="Continue"
          onPress={onContinue}
          disabled={!selectedIntent}
        />
      </ScrollView>
    </View>
  );
}

export function intentOptionsFromPrimary(): IntentOption[] {
  const intents: PrimaryIntent[] = ['STUDENT', 'TOURIST', 'HOST', 'GUIDE'];
  return intents.map((id) => ({
    id,
    label: PRIMARY_INTENT_LABELS[id],
    description: PRIMARY_INTENT_DESCRIPTIONS[id],
    icon: PRIMARY_INTENT_ICONS[id],
  }));
}

function createStyles({ colors, tints }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  back: {
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  backPlaceholder: {
    height: touchTarget,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.heading,
    color: colors.onPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.onPrimary,
    opacity: 0.88,
    lineHeight: lineHeights.body,
  },
  body: {
    flex: 1,
    marginTop: -spacing.sm,
  },
  bodyContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  optionPressable: {
    marginBottom: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionCardSelected: {
    borderColor: colors.teal,
    borderWidth: borderWidths.strong,
    backgroundColor: colors.warmCream,
  },
  optionPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  optionIconTile: {
    width: avatarSizes.lg,
    height: avatarSizes.lg,
    borderRadius: borderRadius.md,
    backgroundColor: tints.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
  noteCard: {
    marginBottom: spacing.xl,
  },
  noteTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  noteBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
});
}

