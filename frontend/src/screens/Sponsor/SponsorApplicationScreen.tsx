import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SponsorListing } from '../../data/sponsorsMock';
import AppIcon from '../../components/AppIcon';
import {
  colors,
  tints,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  layout,
  lineHeights,
  gradients,
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
          Your application to {sponsor.name} has been received. You will be contacted within 5–7 business days.
        </Text>
        <Text style={styles.demoNote}>
          Demo only — applications are not sent to real sponsors yet.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.doneBtn, pressed && styles.pressed]}
          onPress={onReturnToList}
          accessibilityRole="button"
          accessibilityLabel="Back to sponsors"
        >
          <Text style={styles.doneBtnText}>Back to sponsors</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xl * 3,
        }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[...gradients.headerCompact]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + spacing.md }]}
        >
          <Pressable
            style={styles.backBtn}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppIcon name="chevron-back" size={fontSizes.heading} color={colors.white} />
          </Pressable>
          <View style={styles.logoTile}>
            <AppIcon glyph={sponsor.logo} size={28} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Apply for sponsorship</Text>
          <Text style={styles.headerSubtitle}>{sponsor.name}</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
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
            Tell the sponsor why you deserve this sponsorship (min. 100 words)
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Write your personal statement here..."
            placeholderTextColor={colors.textTertiary}
            value={statement}
            onChangeText={setStatement}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            accessibilityLabel="Personal statement"
          />
          <Text style={styles.wordCount}>{wordCount} words</Text>

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit application"
          >
            <Text style={styles.submitBtnText}>Submit application</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            By submitting, you confirm all information provided is accurate and complete. Demo submissions are stored locally only.
          </Text>
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
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: spacing.lg + 4,
    paddingHorizontal: layout.screenPaddingHorizontal,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backText: {
    fontFamily: fontFamilies.bold,
    color: colors.white,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
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
    marginBottom: spacing.xs + 2,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md + 2,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSizes.body - 1,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  hint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption - 1,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  textArea: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSizes.body - 1,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 140,
    marginBottom: spacing.xs + 2,
  },
  wordCount: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption - 1,
    color: colors.textTertiary,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  submitBtn: {
    backgroundColor: colors.teal,
    borderRadius: borderRadius.lg,
    minHeight: 44,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  submitBtnText: {
    fontFamily: fontFamilies.bold,
    color: colors.white,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
  },
  disclaimer: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption - 1,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: lineHeights.caption + 2,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    fontSize: spacing.xl * 2 + spacing.sm,
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSizes.display - 6,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  successMessage: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body - 1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: lineHeights.body,
    marginBottom: spacing.sm,
  },
  demoNote: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption - 1,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  doneBtn: {
    backgroundColor: colors.teal,
    borderRadius: borderRadius.lg,
    minHeight: 44,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl + spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontFamily: fontFamilies.bold,
    color: colors.white,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
  },
  pressed: {
    opacity: 0.88,
  },
});
