export type VideoHubCategoryId =
  | 'preparing'
  | 'living'
  | 'culture'
  | 'exploring';

export type VideoWatchStatus = 'unwatched' | 'in_progress' | 'watched';

export interface VideoProgressState {
  startedKeys: string[];
  completedKeys: string[];
}

export const EMPTY_VIDEO_PROGRESS: VideoProgressState = {
  startedKeys: [],
  completedKeys: [],
};

export interface VideoHubCategory {
  id: VideoHubCategoryId;
  title: string;
  subtitle: string;
}

export const VIDEO_HUB_CATEGORIES: VideoHubCategory[] = [
  {
    id: 'preparing',
    title: 'Preparing for Ghana 🇬🇭',
    subtitle: 'Arrival, visas, airport, and money essentials',
  },
  {
    id: 'living',
    title: 'Living in Ghana',
    subtitle: 'Transport, Mobile Money, neighborhoods, and stays',
  },
  {
    id: 'culture',
    title: 'Culture & Communication',
    subtitle: 'Greetings, Twi basics, etiquette, and traditions',
  },
  {
    id: 'exploring',
    title: 'Exploring Ghana',
    subtitle: 'Attractions, food, festivals, and heritage sites',
  },
];
