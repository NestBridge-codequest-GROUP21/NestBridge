import { appAlert } from '../utils/appAlert';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png']);

export type PickedImage = {
  uri: string;
  mimeType?: string;
  fileSize?: number;
};

/**
 * Lazily loads expo-image-picker so a missing/broken native module cannot
 * crash the app at import time. Never throws — returns null on any failure.
 */
type PickImageOptions = {
  aspect?: [number, number];
  permissionMessage?: string;
};

function resolveMimeType(uri: string, mimeType?: string | null): string | undefined {
  const normalized = (mimeType ?? '').toLowerCase().trim();
  if (normalized) {
    return normalized;
  }
  if (uri.toLowerCase().includes('.png')) {
    return 'image/png';
  }
  if (uri.toLowerCase().includes('.jpg') || uri.toLowerCase().includes('.jpeg')) {
    return 'image/jpeg';
  }
  return undefined;
}

async function pickImage(options: PickImageOptions = {}): Promise<PickedImage | null> {
  const {
    aspect = [1, 1],
    permissionMessage = 'Allow photo library access to add a photo, or skip for now.',
  } = options;

  let ImagePicker: typeof import('expo-image-picker');
  try {
    ImagePicker = await import('expo-image-picker');
  } catch (error) {
    console.warn('[imagePicker] module unavailable', error);
    appAlert(
      'Photos unavailable',
      'Photo picker is not available in this build. You can skip for now.',
    );
    return null;
  }

  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      appAlert('Photo access needed', permissionMessage);
      return null;
    }

    // Prefer the SDK 54+ array form. Avoid MediaTypeOptions.Images — it can be
    // undefined in some standalone builds and throw on property access.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] as never,
      allowsEditing: true,
      aspect,
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    const asset = result.assets[0];
    const uri = asset?.uri;
    if (!uri) {
      return null;
    }

    const mimeType = resolveMimeType(uri, asset.mimeType);
    if (mimeType && !ALLOWED_CONTENT_TYPES.has(mimeType)) {
      appAlert('Unsupported photo', 'Please choose a JPEG or PNG image.');
      return null;
    }

    const fileSize = typeof asset.fileSize === 'number' ? asset.fileSize : undefined;
    if (fileSize != null && fileSize > MAX_PHOTO_BYTES) {
      appAlert('Photo too large', 'Please choose a photo under 5 MB.');
      return null;
    }

    return {
      uri,
      mimeType,
      fileSize,
    };
  } catch (error) {
    console.warn('[imagePicker] pick failed', error);
    appAlert(
      'Could not open photos',
      'Something went wrong opening the photo library. You can skip for now.',
    );
    return null;
  }
}

export async function pickProfileImage(): Promise<PickedImage | null> {
  return pickImage({
    aspect: [1, 1],
    permissionMessage:
      'Allow photo library access to add a profile picture, or skip for now.',
  });
}

/** Wider crop for host listing / property photos. */
export async function pickListingImage(): Promise<PickedImage | null> {
  return pickImage({
    aspect: [4, 3],
    permissionMessage:
      'Allow photo library access to add listing photos, or skip for now.',
  });
}

/** Face or ID photo for manual NestBridge staff KYC review. */
export async function pickKycDocumentImage(): Promise<PickedImage | null> {
  return pickImage({
    aspect: [3, 4],
    permissionMessage:
      'Allow photo library access so NestBridge staff can review your identity photo.',
  });
}
