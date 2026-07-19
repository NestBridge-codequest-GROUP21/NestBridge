/** Sentinel used in mock/seed data until NestBridge publishes real videos. */
export const VIDEO_COMING_SOON_ID = 'pending';

/** YouTube video ids are 11 chars; anything else is treated as not playable. */
export function isPlayableYoutubeId(youtubeId: string | null | undefined): boolean {
  if (!youtubeId) {
    return false;
  }
  if (youtubeId === VIDEO_COMING_SOON_ID) {
    return false;
  }
  return /^[\w-]{11}$/.test(youtubeId);
}
