import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
} from '../constants/theme';
import {
  getBootStage,
  recordBootError,
} from '../services/bootDiagnostics';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
  stage: string;
};

/**
 * Keeps a JS render crash from blanking/killing the whole standalone app.
 */
export default class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '', stage: '' };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || 'Something went wrong while starting NestBridge.',
      stage: getBootStage(),
    };
  }

  componentDidCatch(error: Error) {
    console.error('[AppErrorBoundary]', error);
    void recordBootError(`error_boundary:${getBootStage()}`, error);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, message: '', stage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.root}>
          <Text style={styles.title}>NestBridge hit a startup issue</Text>
          {this.state.stage ? (
            <Text style={styles.stage}>Stage: {this.state.stage}</Text>
          ) : null}
          <Text style={styles.body}>{this.state.message}</Text>
          <Text style={styles.hint}>
            This message is also saved for the next launch if the app closes.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={this.handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <Text style={styles.buttonLabel}>Try again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  stage: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  hint: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.tealBright,
  },
  pressed: {
    opacity: 0.9,
  },
  buttonLabel: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
});
