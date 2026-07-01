import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../constants/theme';

interface Sponsor {
  id: string;
  name: string;
  category: string;
  description: string;
  amount: string;
  logo: string;
}

interface Props {
  navigation?: any;
  route?: any;
}

export default function SponsorDetailScreen({ navigation, route }: Props) {
  const sponsor: Sponsor = route?.params?.sponsor || {
    id: '1',
    name: 'Ghana Tourism Authority',
    category: 'Government',
    description: 'Supporting student travel across Ghana.',
    amount: '$5,000',
    logo: '🏛️',
  };

  const details = [
    { label: 'Category', value: sponsor.category },
    { label: 'Max Award', value: sponsor.amount },
    { label: 'Eligibility', value: 'International students enrolled in accredited universities' },
    { label: 'Deadline', value: 'August 30, 2026' },
    { label: 'Duration', value: 'One academic year' },
    { label: 'Location', value: 'Ghana & West Africa' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>{sponsor.logo}</Text>
        <Text style={styles.name}>{sponsor.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{sponsor.category}</Text>
        </View>
        <Text style={styles.amount}>{sponsor.amount}</Text>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About this Sponsor</Text>
        <Text style={styles.description}>{sponsor.description} This sponsorship is designed to help international students and tourists experience the rich culture, history, and opportunities across the region. Recipients gain access to housing support, cultural immersion programs, and mentorship networks.</Text>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sponsorship Details</Text>
        {details.map((item, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{item.label}</Text>
            <Text style={styles.detailValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        {[
          'Valid student ID or enrollment letter',
          'Minimum GPA of 2.5 or equivalent',
          'Personal statement (500 words)',
          'Two letters of recommendation',
          'Proof of financial need',
        ].map((req, i) => (
          <View key={i} style={styles.requirementRow}>
            <Text style={styles.bullet}>✓</Text>
            <Text style={styles.requirementText}>{req}</Text>
          </View>
        ))}
      </View>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => navigation?.navigate('SponsorApplication', { sponsor })}
        >
          <Text style={styles.applyBtnText}>Apply for Sponsorship</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.navy,
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16 },
  backText: { color: colors.tealBright, fontSize: 15 },
  logo: { fontSize: 56, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '700', color: colors.white, textAlign: 'center' },
  categoryBadge: {
    backgroundColor: colors.teal,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 8,
  },
  categoryText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  amount: { fontSize: 28, fontWeight: '800', color: colors.gold, marginTop: 12 },
  section: {
    backgroundColor: colors.white,
    margin: 16,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: { fontSize: 14, color: colors.textSecondary },
  detailValue: { fontSize: 14, color: colors.textPrimary, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
  requirementRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bullet: { color: colors.teal, fontWeight: '700', marginRight: 10, fontSize: 14 },
  requirementText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  footer: { padding: 16, paddingBottom: 32 },
  applyBtn: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  applyBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});