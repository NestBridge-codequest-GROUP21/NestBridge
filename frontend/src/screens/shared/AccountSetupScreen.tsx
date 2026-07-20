import { useTheme, useThemedStyles, type AppTheme } from '../../theme';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import AppIcon from '../../components/AppIcon';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
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
  motion,
  touchTarget,
  iconSizes,
} from '../../constants/theme';
import { accountSetupCopy } from '../../data/appCopy';
import {
  PRIMARY_INTENT_LABELS,
  SETUP_TRACK_DESCRIPTIONS,
  SETUP_TRACK_ICONS,
  SETUP_TRACK_LABELS,
  type PrimaryIntent,
} from '../../types/accountProfile';

export interface SetupTrackCardData {
  track: 'SEEKER' | 'HOST' | 'GUIDE';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE';
  progressPercent: number;
  blocked?: boolean;
  blockedMessage?: string;
}

export interface AccountSetupScreenProps {
  userName: string;
  userInitials: string;
  primaryIntent: PrimaryIntent | null;
  setupTracks: SetupTrackCardData[];
  showExchangeStudentToggle?: boolean;
  isNoLongerExchangeStudent?: boolean;
  onExchangeStudentToggle?: () => void;
  onBack?: () => void;
  onTrackPress?: (track: SetupTrackCardData['track']) => void;
  onChangeIntent?: () => void;
}

function statusLabel(status: SetupTrackCardData['status']): string {
  switch (status) {
    case 'COMPLETE':
      return 'Ready';
    case 'IN_PROGRESS':
      return 'In progress';
    default:
      return 'Not started';
  }
}

function statusTone(
  status: SetupTrackCardData['status'],
): 'success' | 'warning' | 'neutral' {
  switch (status) {
    case 'COMPLETE':
      return 'success';
    case 'IN_PROGRESS':
      return 'warning';
    default:
      return 'neutral';
  }
}

function SetupProgressBar({ percent }: { percent: number }) {
  const styles = useThemedStyles(createStyles);

  const widthAnim = useRef(new Animated.Value(percent / 100)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percent / 100,
      duration: motion.durationNormal,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [percent, widthAnim]);

  const fillWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width: fillWidth }]} />
    </View>
  );
}

export default function AccountSetupScreen({
  userName,
  userInitials,
  primaryIntent,
  setupTracks,
  showExchangeStudentToggle = false,
  isNoLongerExchangeStudent = false,
  onExchangeStudentToggle,
  onBack,
  onTrackPress,
  onChangeIntent,
}: AccountSetupScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { colors, gradients } = useTheme();


  const insets = useSafeAreaInsets();
  const intentLabel = primaryIntent ? PRIMARY_INTENT_LABELS[primaryIntent] : 'Guest';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[...gradients.headerCompact]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerTop}>
          {onBack ? (
            <BackButton onPress={onBack} color={colors.onPrimary} />
          ) : (
            <View style={styles.backPlaceholder} />
          )}
          <Text style={styles.headerTitle}>Account setup</Text>
          <View style={styles.backPlaceholder} />
        </View>
        <Text style={styles.headerSubtitle}>{accountSetupCopy.headerSubtitle}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[
          styles.bodyContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userRow}>
          <Avatar initials={userInitials} size="lg" style={styles.avatarSpacing} />
          <View style={styles.userText}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userHint}>Primary focus: {intentLabel}</Text>
          </View>
        </View>

        {onChangeIntent ? (
          <Pressable
            onPress={onChangeIntent}
            style={styles.changeIntentButton}
            accessibilityRole="button"
            accessibilityLabel="Change primary focus"
          >
            <Text style={styles.changeIntentText}>Change home focus</Text>
          </Pressable>
        ) : null}

        {showExchangeStudentToggle ? (
          <Pressable
            style={styles.exchangeTogglePressable}
            onPress={onExchangeStudentToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isNoLongerExchangeStudent }}
            accessibilityLabel={accountSetupCopy.exchangeStudentToggleLabel}
          >
            <Card style={styles.exchangeToggleRow}>
              <View
                style={[
                  styles.exchangeCheckbox,
                  isNoLongerExchangeStudent && styles.exchangeCheckboxChecked,
                ]}
              >
                {isNoLongerExchangeStudent ? (
                  <AppIcon name="checkmark" size={iconSizes.sm} color={colors.onPrimary} />
                ) : null}
              </View>
              <View style={styles.exchangeToggleText}>
                <Text style={styles.exchangeToggleLabel}>
                  {accountSetupCopy.exchangeStudentToggleLabel}
                </Text>
                <Text style={styles.exchangeToggleHint}>
                  {accountSetupCopy.exchangeStudentToggleHint}
                </Text>
              </View>
            </Card>
          </Pressable>
        ) : null}

        {setupTracks.map((item) => {
          const disabled = item.blocked === true;
          return (
            <Pressable
              key={item.track}
              style={({ pressed }) => [
                styles.cardPressable,
                disabled && styles.cardDisabled,
                pressed && !disabled && styles.cardPressed,
              ]}
              onPress={() => {
                if (!disabled) {
                  onTrackPress?.(item.track);
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={SETUP_TRACK_LABELS[item.track]}
              accessibilityState={{ disabled }}
            >
              <Card>
                <View style={styles.cardTop}>
                  <View style={styles.cardLeading}>
                    <View style={styles.cardAccent} />
                    <AppIcon
                      glyph={SETUP_TRACK_ICONS[item.track]}
                      size={iconSizes.lg}
                      color={colors.tealDeep}
                    />
                  </View>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{SETUP_TRACK_LABELS[item.track]}</Text>
                    <Text style={styles.cardDescription}>
                      {SETUP_TRACK_DESCRIPTIONS[item.track]}
                    </Text>
                    {disabled && item.blockedMessage ? (
                      <Text style={styles.blockedText}>{item.blockedMessage}</Text>
                    ) : null}
                  </View>
                  <StatusBadge
                    label={statusLabel(item.status)}
                    tone={statusTone(item.status)}
                  />
                </View>

                <SetupProgressBar percent={item.progressPercent} />
                <Text style={styles.progressLabel}>{item.progressPercent}% complete</Text>
              </Card>
            </Pressable>
          );
        })}

        <Card padding="lg" style={styles.infoCard}>
          <Text style={styles.infoTitle}>{accountSetupCopy.infoTitle}</Text>
          <Text style={styles.infoBody}>{accountSetupCopy.infoBody}</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backPlaceholder: {
    width: touchTarget,
    height: touchTarget,
  },
  headerTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.heading,
    color: colors.onPrimary,
  },
  headerSubtitle: {
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarSpacing: {
    marginRight: spacing.md,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    color: colors.textSecondary,
  },
  changeIntentButton: {
    minHeight: touchTarget,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  changeIntentText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  exchangeTogglePressable: {
    marginBottom: spacing.lg,
  },
  exchangeToggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: touchTarget,
  },
  exchangeCheckbox: {
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: borderRadius.sm,
    borderWidth: borderWidths.strong,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  exchangeCheckboxChecked: {
    backgroundColor: colors.teal,
  },
  exchangeToggleText: {
    flex: 1,
  },
  exchangeToggleLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  exchangeToggleHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  cardPressable: {
    marginBottom: layout.sectionGap,
  },
  cardDisabled: {
    opacity: 0.65,
  },
  cardPressed: {
    opacity: 0.95,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cardAccent: {
    width: spacing.xs,
    alignSelf: 'stretch',
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
    marginRight: spacing.sm,
  },
  cardText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  cardTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: lineHeights.caption,
  },
  blockedText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.danger,
    marginTop: spacing.sm,
    lineHeight: lineHeights.caption,
  },
  progressTrack: {
    height: spacing.sm - borderWidths.strong,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.teal,
  },
  progressLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
  infoCard: {
    marginTop: spacing.sm,
  },
  infoTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoBody: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    lineHeight: lineHeights.body,
  },
});
}

