import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { getFeedbackPreferences } from './feedbackPreferences';

type FeedbackKind = 'success' | 'warning' | 'error' | 'selection' | 'impact';

let audioModeReady = false;
let successSound: Audio.Sound | null = null;
let errorSound: Audio.Sound | null = null;

async function ensureAudioMode(): Promise<void> {
  if (audioModeReady) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioModeReady = true;
  } catch {
    // Expo Go / web may not support every mode flag.
  }
}

async function loadSound(
  existing: Audio.Sound | null,
  asset: number,
): Promise<Audio.Sound | null> {
  if (existing) return existing;
  try {
    await ensureAudioMode();
    const { sound } = await Audio.Sound.createAsync(asset, {
      shouldPlay: false,
      volume: 0.55,
    });
    return sound;
  } catch {
    return null;
  }
}

async function playLoadedSound(
  getter: () => Promise<Audio.Sound | null>,
  setter: (sound: Audio.Sound | null) => void,
  asset: number,
): Promise<void> {
  try {
    const sound = await getter();
    if (!sound) {
      const created = await loadSound(null, asset);
      setter(created);
      if (!created) return;
      await created.replayAsync();
      return;
    }
    await sound.replayAsync();
  } catch {
    // Never crash the UI for optional feedback.
  }
}

const SUCCESS_SOUND = require('../../assets/sounds/success.wav') as number;
const ERROR_SOUND = require('../../assets/sounds/error.wav') as number;

async function playSuccessSound(): Promise<void> {
  await playLoadedSound(
    async () => successSound,
    (sound) => {
      successSound = sound;
    },
    SUCCESS_SOUND,
  );
}

async function playErrorSound(): Promise<void> {
  await playLoadedSound(
    async () => errorSound,
    (sound) => {
      errorSound = sound;
    },
    ERROR_SOUND,
  );
}

async function runHaptic(kind: FeedbackKind): Promise<void> {
  try {
    switch (kind) {
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      case 'selection':
        await Haptics.selectionAsync();
        return;
      case 'impact':
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch {
    // Haptics unsupported (simulator / web) — ignore.
  }
}

/**
 * NestBridge feedback — respects Settings toggles for haptics and sounds.
 * Safe to call from anywhere; never throws to the UI.
 */
export async function appFeedback(kind: FeedbackKind): Promise<void> {
  const prefs = getFeedbackPreferences();
  const tasks: Promise<void>[] = [];

  if (prefs.hapticsEnabled) {
    tasks.push(runHaptic(kind));
  }

  if (prefs.soundsEnabled) {
    if (kind === 'success') {
      tasks.push(playSuccessSound());
    } else if (kind === 'error') {
      tasks.push(playErrorSound());
    }
  }

  await Promise.all(tasks);
}

export function feedbackSuccess(): void {
  void appFeedback('success');
}

export function feedbackWarning(): void {
  void appFeedback('warning');
}

export function feedbackError(): void {
  void appFeedback('error');
}

export function feedbackSelection(): void {
  void appFeedback('selection');
}

/** Stronger pulse for SOS / urgent actions (haptic only — no cheerful sound). */
export function feedbackUrgent(): void {
  const prefs = getFeedbackPreferences();
  if (!prefs.hapticsEnabled) return;
  void (async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      // ignore
    }
  })();
}

/** Prefetch short chimes after boot so first success feels instant. */
export async function warmFeedbackAssets(): Promise<void> {
  if (!getFeedbackPreferences().soundsEnabled) return;
  try {
    successSound = await loadSound(successSound, SUCCESS_SOUND);
    errorSound = await loadSound(errorSound, ERROR_SOUND);
  } catch {
    // Optional.
  }
}
