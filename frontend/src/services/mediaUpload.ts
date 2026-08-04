import axios from 'axios';
import { getProfilePhotoUploadUrl } from './api';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(['image/jpeg', 'image/png']);

export type UploadProfilePhotoOptions = {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
};

function resolveContentType(localUri: string, mimeType?: string | null): string {
  const normalized = (mimeType ?? '').toLowerCase().trim();
  if (ALLOWED_CONTENT_TYPES.has(normalized)) {
    return normalized;
  }
  if (localUri.toLowerCase().includes('.png')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

/**
 * Uploads a local ImagePicker URI to S3 when configured; returns public URL or undefined.
 */
export async function uploadProfilePhotoIfConfigured(
  localUri: string | null | undefined,
  options?: UploadProfilePhotoOptions,
): Promise<string | undefined> {
  if (!localUri || localUri.startsWith('http')) {
    return localUri ?? undefined;
  }

  const contentType = resolveContentType(localUri);
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error('Photo must be a JPEG or PNG.');
  }

  const uploadMeta = await getProfilePhotoUploadUrl(contentType);
  if (!uploadMeta.enabled || !uploadMeta.uploadUrl || !uploadMeta.publicUrl) {
    return undefined;
  }

  const resolvedType = uploadMeta.contentType ?? contentType;
  if (!ALLOWED_CONTENT_TYPES.has(resolvedType)) {
    throw new Error('Photo must be a JPEG or PNG.');
  }

  const blob = await fetch(localUri).then((response) => response.blob());
  if (blob.size > MAX_PHOTO_BYTES) {
    throw new Error('Photo must be 5 MB or smaller.');
  }

  await axios.put(uploadMeta.uploadUrl, blob, {
    headers: {
      'Content-Type': resolvedType,
    },
    signal: options?.signal,
    onUploadProgress: (event) => {
      if (!options?.onProgress || !event.total) {
        return;
      }
      options.onProgress(Math.min(1, event.loaded / event.total));
    },
  });

  return uploadMeta.publicUrl;
}
