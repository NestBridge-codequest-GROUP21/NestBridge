import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../constants/theme';

interface KYCPromptData {
  roleLabel: string;
  message: string;
  explanation: string;
}

interface Props {
  data?: KYCPromptData;
}

const defaultData: KYCPromptData = {
  roleLabel: 'Host Family',
  message: 'One last step to go live.',
  explanation: 'Verification helps students trust that you are a safe and reliable host. It only takes a few minutes.',
};

export default function KYCPromptScreen({ data = defaultData }: Props) {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.roleLabel}>{data.roleLabel}</Text>
        <Text style={styles.heading}>{data.message}</Text>
        <Text style={styles.explanation}>{data.explanation}</Text>
      </View>

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🪪</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => console.log('Verify now tapped')}
        >
          <Text style={styles.primaryButtonText}>Verify now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => console.log('Verify later tapped')}
        >
          <Text style={styles.secondaryButtonText}>Verify later</Text>
        </TouchableOpacity>
      </View>

      {/* Note */}
      <Text style={styles.note}>
        Your listing will not be visible until verified.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.teal,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  explanation: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 80,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.teal,
  },
  secondaryButtonText: {
    color: colors.teal,
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});