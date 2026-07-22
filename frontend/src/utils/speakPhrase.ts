import * as Speech from 'expo-speech';

/**
 * Speaks a phrase for pronunciation practice.
 * Device TTS may approximate Twi — the on-screen pronunciation guide is the
 * primary learning aid; audio is a practice prompt.
 */
export async function speakPhrase(text: string): Promise<void> {
  const cleaned = text.trim();
  if (!cleaned) {
    return;
  }
  try {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      Speech.stop();
    }
    Speech.speak(cleaned, {
      language: 'en-GH',
      rate: 0.85,
      pitch: 1.0,
    });
  } catch {
    // Pronunciation text on the card remains available if speech fails.
  }
}
