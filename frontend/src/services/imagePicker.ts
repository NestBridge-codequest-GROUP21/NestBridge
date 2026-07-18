import { Alert } from 'react-native';

export type PickedImage = {
  uri: string;
};

/**
 * Lazily loads expo-image-picker so a missing/broken native module cannot
 * crash the app at import time. Never throws — returns null on any failure.
 */
export async function pickProfileImage(): Promise<PickedImage | null> {
  let ImagePicker: typeof import('expo-image-picker');
  try {
    ImagePicker = await import('expo-image-picker');
  } catch (error) {
    console.warn('[imagePicker] module unavailable', error);
    Alert.alert(
      'Photos unavailable',
      'Photo picker is not available in this build. You can skip for now.',
    );
    return null;
  }

  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Photo access needed',
        'Allow photo library access to add a profile picture, or skip for now.',
      );
      return null;
    }

    // Prefer the SDK 54+ array form. Avoid MediaTypeOptions.Images — it can be
    // undefined in some standalone builds and throw on property access.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as never,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    const uri = result.assets[0]?.uri;
    return uri ? { uri } : null;
  } catch (error) {
    console.warn('[imagePicker] pick failed', error);
    Alert.alert(
      'Could not open photos',
      'Something went wrong opening the photo library. You can skip for now.',
    );
    return null;
  }
}
