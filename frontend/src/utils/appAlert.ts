import { Alert } from 'react-native';
import type {
  AppAlertButton,
  AppAlertOptions,
  AppAlertPayload,
} from '../components/AppAlertModal';

type AppAlertListener = (payload: AppAlertPayload | null) => void;

let listener: AppAlertListener | null = null;

/** Registered by AppAlertProvider — do not call from screens. */
export function registerAppAlertListener(next: AppAlertListener | null): void {
  listener = next;
}

/**
 * NestBridge branded dialog. Drop-in replacement for React Native `Alert.alert`.
 * Falls back to the system alert only if the provider is not mounted yet.
 */
export function appAlert(
  title: string,
  message?: string,
  buttons?: AppAlertButton[],
  options?: AppAlertOptions,
): void {
  if (!listener) {
    Alert.alert(
      title,
      message,
      buttons?.map((button) => ({
        text: button.text,
        style: button.style,
        onPress: button.onPress,
      })),
      options
        ? {
            cancelable: options.cancelable,
            onDismiss: options.onDismiss,
          }
        : undefined,
    );
    return;
  }

  listener({
    title,
    message,
    buttons,
    options,
  });
}
