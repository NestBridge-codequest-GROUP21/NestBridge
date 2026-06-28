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
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  gradients,
  lineHeights,
  layout,
  motion,
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

function SetupProgressBar({ percent }: { percent: number }) {
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
            <Pressable
              onPress={onBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backIcon}>←</Text>
            </Pressable>
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
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
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
            style={styles.exchangeToggleRow}
            onPress={onExchangeStudentToggle}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isNoLongerExchangeStudent }}
            accessibilityLabel={accountSetupCopy.exchangeStudentToggleLabel}
          >
            <View
              style={[
                styles.exchangeCheckbox,
                isNoLongerExchangeStudent && styles.exchangeCheckboxChecked,
              ]}
            >
              {isNoLongerExchangeStudent ? (
                <Text style={styles.exchangeCheckmark}>✓</Text>
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
          </Pressable>
        ) : null}

        {setupTracks.map((item) => {
          const complete = item.status === 'COMPLETE';
          const disabled = item.blocked === true;
          return (
            <Pressable
              key={item.track}
              style={({ pressed }) => [
                styles.card,
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
              <View style={styles.cardTop}>
                <View style={styles.cardLeading}>
                  <View style={styles.cardAccent} />
                  <Text style={styles.cardIcon}>{SETUP_TRACK_ICONS[item.track]}</Text>
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
                <View
                  style={[
                    styles.statusBadge,
                    complete ? styles.statusComplete : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      complete ? styles.statusTextComplete : styles.statusTextPending,
                    ]}
                  >
                    {statusLabel(item.status)}
                  </Text>
                </View>
              </View>

              <SetupProgressBar percent={item.progressPercent} />
              <Text style={styles.progressLabel}>{item.progressPercent}% complete</Text>
            </Pressable>
          );
        })}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{accountSetupCopy.infoTitle}</Text>
          <Text style={styles.infoBody}>{accountSetupCopy.infoBody}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
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
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.white,
  },
  backPlaceholder: {
    width: 44,
    height: 44,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.regular,
    color: colors.white,
    opacity: 0.88,
    lineHeight: lineHeights.body,
  },
  body: {
    flex: 1,
    marginTop: -spacing.sm,
  },
  bodyContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.subheading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  userHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
  },
  changeIntentButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  changeIntentText: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.teal,
  },
  exchangeToggleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  exchangeCheckbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  exchangeCheckboxChecked: {
    backgroundColor: colors.teal,
  },
  exchangeCheckmark: {
    color: colors.white,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
  },
  exchangeToggleText: {
    flex: 1,
  },
  exchangeToggleLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  exchangeToggleHint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
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
    width: 4,
    alignSelf: 'stretch',
    borderRadius: borderRadius.pill,
    backgroundColor: colors.teal,
    marginRight: spacing.sm,
  },
  cardIcon: {
    fontSize: fontSizes.heading,
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
    lineHeight: 16,
  },
  blockedText: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.danger,
    marginTop: spacing.sm,
    lineHeight: 16,
  },
  statusBadge: {
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusComplete: {
    backgroundColor: colors.success,
  },
  statusPending: {
    backgroundColor: colors.warmCream,
  },
  statusText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
  },
  statusTextComplete: {
    color: colors.white,
  },
  statusTextPending: {
    color: colors.warning,
  },
  progressTrack: {
    height: 6,
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
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
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
