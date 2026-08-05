import type {
  AppAlertButton,
  AppAlertOptions,
  AppAlertPayload,
} from '../components/AppAlertModal';

type AppAlertListener = (payload: AppAlertPayload | null) => void;

let listener: AppAlertListener | null = null;
/** Alerts requested before AppAlertProvider has registered. */
let pending: AppAlertPayload | null = null;

/** Registered by AppAlertProvider — do not call from screens. */
export function registerAppAlertListener(next: AppAlertListener | null): void {
  listener = next;
  if (listener && pending) {
    const queued = pending;
    pending = null;
    listener(queued);
  }
}

/**
 * NestBridge branded dialog. Drop-in replacement for React Native `Alert.alert`.
 * Never uses the system alert — queues until the provider is mounted if needed.
 */
export function appAlert(
  title: string,
  message?: string,
  buttons?: AppAlertButton[],
  options?: AppAlertOptions,
): void {
  const payload: AppAlertPayload = {
    title,
    message,
    buttons,
    options,
  };

  if (!listener) {
    pending = payload;
    if (__DEV__) {
      console.warn(
        '[appAlert] Provider not ready yet — queued branded dialog:',
        title,
      );
    }
    return;
  }

  listener(payload);
}
