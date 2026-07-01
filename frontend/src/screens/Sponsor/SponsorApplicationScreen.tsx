import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { colors } from '../../constants/theme';

interface Props {
  navigation?: any;
  route?: any;
}

export default function SponsorApplicationScreen({ navigation, route }: Props) {
  const sponsor = route?.params?.sponsor || { name: 'Ghana Tourism Authority', logo: '🏛️' };

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gpa, setGpa] = useState('');
  const [statement, setStatement] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!fullName || !email || !university || !studentId || !statement) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.successTitle}>Application Submitted!</Text>
        <Text style={styles.successMessage}>
          Your application to {sponsor.name} has been received. You will be contacted within 5-7 business days.
        </Text>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation?.navigate('SponsorList')}
        >
          <Text style={styles.doneBtnText}>Back to Sponsors</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>{sponsor.logo}</Text>
        <Text style={styles.headerTitle}>Apply for Sponsorship</Text>
        <Text style={styles.headerSubtitle}>{sponsor.name}</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Personal Info */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor={colors.textTertiary}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={colors.textTertiary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Academic Info */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Academic Information</Text>

        <Text style={styles.label}>University / Institution *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. KNUST, University of Ghana"
          placeholderTextColor={colors.textTertiary}
          value={university}
          onChangeText={setUniversity}
        />

        <Text style={styles.label}>Student ID *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your student ID"
          placeholderTextColor={colors.textTertiary}
          value={studentId}
          onChangeText={setStudentId}
        />

        <Text style={styles.label}>GPA (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 3.5"
          placeholderTextColor={colors.textTertiary}
          value={gpa}
          onChangeText={setGpa}
          keyboardType="decimal-pad"
        />

        {/* Personal Statement */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Personal Statement</Text>
        <Text style={styles.hint}>Tell the sponsor why you deserve this sponsorship (min. 100 words)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Write your personal statement here..."
          placeholderTextColor={colors.textTertiary}
          value={statement}
          onChangeText={setStatement}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Text style={styles.wordCount}>{statement.trim().split(/\s+/).filter(Boolean).length} words</Text>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit Application</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By submitting, you confirm all information provided is accurate and complete.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.navy,
    paddingTop: 56,
    paddingBottom: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 12 },
  backText: { color: colors.tealBright, fontSize: 15 },
  logo: { fontSize: 44, marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.white },
  headerSubtitle: { fontSize: 13, color: colors.tealBright, marginTop: 4 },
  formContainer: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  hint: { fontSize: 12, color: colors.textTertiary, marginBottom: 8 },
  textArea: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 140,
    marginBottom: 6,
  },
  wordCount: { fontSize: 12, color: colors.textTertiary, textAlign: 'right', marginBottom: 24 },
  submitBtn: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  disclaimer: { fontSize: 12, color: colors.textTertiary, textAlign: 'center', lineHeight: 18 },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successIcon: { fontSize: 72, marginBottom: 20 },
  successTitle: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  successMessage: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  doneBtn: { backgroundColor: colors.teal, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40 },
  doneBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});