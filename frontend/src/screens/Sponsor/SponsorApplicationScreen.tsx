import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import FormTextField from '../../components/FormTextField';
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
  iconSizes,
  avatarSizes,
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
          <AppIcon
            name="checkmark-circle"
            size={avatarSizes.lg + spacing.sm}
            color={colors.success}
          />
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
          paddingBottom: insets.bottom + layout.scrollBottomInset,
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
            <AppIcon
              glyph={sponsor.logo}
              size={iconSizes.xl}
              color={colors.white}
            />
          </View>
          <Text style={styles.headerTitle}>Apply for sponsorship</Text>
          <Text style={styles.headerSubtitle}>{sponsor.name}</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <InlineBanner
            tone="info"
            message="Share accurate university details — sponsors in Ghana review student ID and enrollment first."
          />

          <Card padding="lg" elevation="card" style={styles.formCard}>
            <SectionHeader title="Personal information" style={styles.sectionHeader} />

            <FormTextField
              label="Full name"
              value={fullName}
              placeholder="Enter your full name"
              onChangeText={setFullName}
              autoCapitalize="words"
            />

            <FormTextField
              label="Email address"
              value={email}
              placeholder="Enter your email"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Card>

          <Card padding="lg" elevation="card" style={styles.formCard}>
            <SectionHeader title="Academic information" style={styles.sectionHeader} />

            <FormTextField
              label="University / institution"
              value={university}
              placeholder="e.g. KNUST, University of Ghana"
              onChangeText={setUniversity}
            />

            <FormTextField
              label="Student ID"
              value={studentId}
              placeholder="Enter your student ID"
              onChangeText={setStudentId}
              autoCapitalize="characters"
            />

            <FormTextField
              label="GPA (optional)"
              value={gpa}
              placeholder="e.g. 3.5"
              onChangeText={setGpa}
              keyboardType="decimal-pad"
            />
          </Card>

          <Card padding="lg" elevation="card" style={styles.formCard}>
            <SectionHeader title="Personal statement" style={styles.sectionHeader} />
            <FormTextField
              label="Statement"
              value={statement}
              placeholder="Write your personal statement here…"
              onChangeText={setStatement}
              multiline
              numberOfLines={6}
              helperText="Tell the sponsor why this support matters for your move or studies (min. 100 words)"
            />
            <Text style={styles.wordCount}>{wordCount} words</Text>

            <PrimaryButton label="Submit application" onPress={handleSubmit} />

            <Text style={styles.disclaimer}>
              By submitting, you confirm the information is accurate and complete.
            </Text>
          </Card>
        </View>
      </ScreenScroll>
    </View>
  );
}

const LOGO_TILE = avatarSizes.lg + spacing.sm;

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
    width: LOGO_TILE,
    height: LOGO_TILE,
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
    gap: spacing.md,
  },
  formCard: {
    marginBottom: spacing.xs,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  wordCount: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'right',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
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
