import { Alert, Linking, Share } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { NESTBRIDGE_SUPPORT_EMAIL } from '../constants/support';

/** Opens the device mail app, then Gmail-in-browser, then a share/copy fallback. */
export async function openNestBridgeSupportEmail(
  accountEmail?: string,
  subject = 'NestBridge help',
  bodyPrefix = 'I need help with NestBridge.',
): Promise<void> {
  const body = accountEmail?.trim()
    ? `Hi NestBridge team,\n\n${bodyPrefix}\n\nAccount email: ${accountEmail.trim()}\n`
    : `Hi NestBridge team,\n\n${bodyPrefix}\n`;
  const mailto = `mailto:${NESTBRIDGE_SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  try {
    const canOpen = await Linking.canOpenURL(mailto);
    if (canOpen) {
      await Linking.openURL(mailto);
      return;
    }
  } catch {
    try {
      await Linking.openURL(mailto);
      return;
    } catch {
      // Fall through.
    }
  }

  try {
    await WebBrowser.openBrowserAsync(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(NESTBRIDGE_SUPPORT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
    return;
  } catch {
    // Fall through.
  }

  Alert.alert(
    'Contact NestBridge support',
    `Email us at ${NESTBRIDGE_SUPPORT_EMAIL} and include a screenshot of this screen.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Share address',
        onPress: () => {
          void Share.share({
            message: NESTBRIDGE_SUPPORT_EMAIL,
            title: 'NestBridge support',
          });
        },
      },
    ],
  );
}
