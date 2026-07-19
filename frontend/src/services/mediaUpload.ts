import { getProfilePhotoUploadUrl } from './api';

/**
 * Uploads a local ImagePicker URI to S3 when configured; returns public URL or undefined.
 */
export async function uploadProfilePhotoIfConfigured(
  localUri: string | null | undefined,
): Promise<string | undefined> {
  if (!localUri || localUri.startsWith('http')) {
    return localUri ?? undefined;
  }

  const contentType = localUri.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg';
  const uploadMeta = await getProfilePhotoUploadUrl(contentType);
  if (!uploadMeta.enabled || !uploadMeta.uploadUrl || !uploadMeta.publicUrl) {
    return undefined;
  }

  const blob = await fetch(localUri).then((response) => response.blob());
  const uploadResponse = await fetch(uploadMeta.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': uploadMeta.contentType ?? contentType,
    },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error('Could not upload profile photo.');
  }

  return uploadMeta.publicUrl;
}
