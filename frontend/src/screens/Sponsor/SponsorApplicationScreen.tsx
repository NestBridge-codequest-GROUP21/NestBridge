import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenScroll from '../../components/ScreenScroll';
import InlineBanner from '../../components/InlineBanner';
import AppIcon from '../../components/AppIcon';
import type { SponsorListing } from '../../data/sponsorsMock';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
  gradients,
  shadows,
} from '../../constants/theme';

export interface SponsorApplicationForm {
  fullName: string;
  email: string;
  university: string;
  studentId: string;
  gpa: string;
  statement: string;
}

export interface SponsorApplicationScreenProps {
  sponsor: Pick<SponsorListing, 'id' | 'name' | 'logo'>;
  onBack?: () => void;
  onSubmit?: (application: SponsorApplicationForm) => void;
  onReturnToList?: () => void;
  onSosPress?: () => void;
}

export default function SponsorApplicationScreen({
  sponsor,
  onBack,
  onSubmit,
  onReturnToList,
}: SponsorApplicationScreenProps) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gpa, setGpa] = useState('');
  const [statement, setStatement] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const wordCount = statement.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = () => {
    if (!fullName || !email || !university || !studentId || !statement) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    onSubmit?.({ fullName, email, university, studentId, gpa, statement });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <StatusBar style="dark" />
        <View style={styles.successIcon}>
          <AppIcon name="checkmark-circle" size={56} color={colors.success} />
        </View>
        <Text style={styles.successTitle}>Application submitted</Text>
        <Text style={styles.successMessage}>
          Your application to {sponsor.name} has been received. Expect a reply
          within 5–7 business days.
        </Text>
        <PrimaryButton label="Back to sponsors" onPress={onReturnToList} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScreenScroll
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xl * 3,
          paddingHorizontal: 0,
          paddingTop: 0,
        }}
      >
        <LinearGradient
          colors={[...gradients.headerCompact]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + spacing.md }]}
        >
          <BackButton onPress={onBack} color={colors.white} style={styles.backBtn} />
          <View style={styles.logoTile}>
            <AppIcon glyph={sponsor.logo} size={28} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Apply for sponsorship</Text>
          <Text style={styles.headerSubtitle}>{sponsor.name}</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <InlineBanner
            tone="info"
            message="Share accurate university details — sponsors in Ghana review student ID and enrollment first."
          />

          <Text style={styles.sectionTitle}>Personal information</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textTertiary}
            value={fullName}
            onChangeText={setFullName}
            accessibilityLabel="Full name"
          />

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email address"
          />

          <Text style={[styles.sectionTitle, styles.sectionGap]}>Academic information</Text>

          <Text style={styles.label}>University / institution</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. KNUST, University of Ghana"
            placeholderTextColor={colors.textTertiary}
            value={university}
            onChangeText={setUniversity}
            accessibilityLabel="University"
          />

          <Text style={styles.label}>Student ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your student ID"
            placeholderTextColor={colors.textTertiary}
            value={studentId}
            onChangeText={setStudentId}
            accessibilityLabel="Student ID"
          />

          <Text style={styles.label}>GPA (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3.5"
            placeholderTextColor={colors.textTertiary}
            value={gpa}
            onChangeText={setGpa}
            keyboardType="decimal-pad"
            accessibilityLabel="GPA"
          />

          <Text style={[styles.sectionTitle, styles.sectionGap]}>Personal statement</Text>
          <Text style={styles.hint}>
            Tell the sponsor why this support matters for your move or studies (min. 100 words)
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your personal statement here…"
            placeholderTextColor={colors.textTertiary}
            value={statement}
            onChangeText={setStatement}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            accessibilityLabel="Personal statement"
          />
          <Text style={styles.wordCount}>{wordCount} words</Text>

          <PrimaryButton label="Submit application" onPress={handleSubmit} />

          <Text style={styles.disclaimer}>
            By submitting, you confirm the information is accurate and complete.
          </Text>
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingBottom: spacing.lg,
    paddingHorizontal: layout.screenPaddingHorizontal,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  logoTile: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.navyMid,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.tealBright,
    marginTop: spacing.xs,
  },
  formContainer: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionGap: {
    marginTop: spacing.lg,
  },
  label: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.body,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  hint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    lineHeight: lineHeights.caption,
  },
  textArea: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.body,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 140,
    marginBottom: spacing.xs,
    ...shadows.card,
  },
  wordCount: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  disclaimer: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: lineHeights.caption,
    marginTop: spacing.md,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  successMessage: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: lineHeights.body,
    marginBottom: spacing.xl,
  },
});
