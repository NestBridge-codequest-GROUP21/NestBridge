import { useThemedStyles, type AppTheme } from '../theme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SosCircleButton from './SosCircleButton';
import {
  spacing,
  layout,
} from '../constants/theme';

export interface StackSosLayoutProps {
  children: React.ReactNode;
  onSosPress?: () => void;
}

/**
 * Wraps stack/detail screens that have no bottom tab bar. Renders content
 * above a slim bottom bar holding the SOS control, so SOS is always reachable
 * without floating over scrollable content.
 */
export default function StackSosLayout({
  children,
  onSosPress,
}: StackSosLayoutProps) {
  const styles = useThemedStyles(createStyles);

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={styles.content}>{children}</View>
      {onSosPress ? (
        <View
          style={[
            styles.sosBar,
            { paddingBottom: insets.bottom + layout.tabBarBottomInset },
          ]}
        >
          <SosCircleButton onPress={onSosPress} />
        </View>
      ) : null}
    </View>
  );
}

function createStyles({ colors }: AppTheme) {
  return StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  sosBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
});
}

