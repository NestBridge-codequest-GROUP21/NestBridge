import React from 'react';
import { View, StyleSheet } from 'react-native';
import SosFloatingButton from './SosFloatingButton';

export interface StackSosLayoutProps {
  children: React.ReactNode;
  onSosPress?: () => void;
}

export default function StackSosLayout({
  children,
  onSosPress,
}: StackSosLayoutProps) {
  return (
    <View style={styles.root}>
      {children}
      <SosFloatingButton onPress={onSosPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
