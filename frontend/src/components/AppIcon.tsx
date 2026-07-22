import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../theme';
import { fontSizes } from '../constants/theme';

export type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * Single source of truth mapping the legacy emoji "glyphs" (still used as keys
 * in mock/data files and API fallbacks) to one consistent Ionicons set.
 * No emoji is ever rendered — the emoji string is only a lookup key.
 */
const GLYPH_TO_ICON: Record<string, IoniconName> = {
  // Home / stays
  '🏠': 'home-outline',
  '🏡': 'home-outline',
  '🏘️': 'home-outline',
  '🛋️': 'home-outline',
  '🏢': 'business-outline',
  '🏙️': 'business-outline',
  '🏨': 'business-outline',
  '🛏️': 'bed-outline',
  '🏰': 'business-outline',
  // Guides / maps / travel
  '🗺️': 'map-outline',
  '📍': 'location-outline',
  '🌍': 'globe-outline',
  '✈️': 'airplane-outline',
  '🛬': 'airplane-outline',
  '📸': 'camera-outline',
  '🧳': 'briefcase-outline',
  '🎒': 'bag-outline',
  '🏖️': 'sunny-outline',
  '🌴': 'leaf-outline',
  '🌳': 'leaf-outline',
  '🛍️': 'bag-handle-outline',
  // Transport
  '🚌': 'bus-outline',
  '🚐': 'bus-outline',
  '🚕': 'car-outline',
  '🚗': 'car-outline',
  '⚡': 'flash-outline',
  // Events / culture / food
  '🎉': 'balloon-outline',
  '🥁': 'musical-notes-outline',
  '🎭': 'musical-notes-outline',
  '🍲': 'restaurant-outline',
  '🍽️': 'restaurant-outline',
  '🏛️': 'library-outline',
  // People / social
  '🤝': 'people-outline',
  '👋': 'hand-left-outline',
  '😊': 'happy-outline',
  '😌': 'happy-outline',
  '🤗': 'happy-outline',
  '🤲': 'heart-outline',
  '💛': 'heart-outline',
  '❤️': 'heart-outline',
  '👑': 'ribbon-outline',
  '👤': 'person-outline',
  '🎓': 'school-outline',
  // Communication
  '🔔': 'notifications-outline',
  '💬': 'chatbubble-ellipses-outline',
  '📩': 'mail-outline',
  '📬': 'mail-open-outline',
  '📣': 'megaphone-outline',
  '🔊': 'volume-high-outline',
  // Status / feedback
  '✅': 'checkmark-circle-outline',
  '✔️': 'checkmark-outline',
  '⭐': 'star-outline',
  '🎯': 'locate-outline',
  '📈': 'trending-up-outline',
  '💰': 'cash-outline',
  '🕐': 'time-outline',
  '📅': 'calendar-outline',
  '📆': 'calendar-outline',
  '🗓️': 'calendar-outline',
  '✨': 'sparkles-outline',
  '💡': 'bulb-outline',
  '🔒': 'lock-closed-outline',
  '🛡️': 'shield-checkmark-outline',
  '🚀': 'rocket-outline',
  '🔍': 'search-outline',
  '📋': 'clipboard-outline',
  '📝': 'create-outline',
  '🪪': 'card-outline',
  '🎬': 'film-outline',
  '💻': 'laptop-outline',
  '⚠️': 'warning-outline',
  '🧭': 'compass-outline',
  '✋': 'hand-left-outline',
  '🗣️': 'chatbubble-ellipses-outline',
  '👍': 'thumbs-up-outline',
  '📱': 'phone-portrait-outline',
  '💳': 'card-outline',
  '🏦': 'business-outline',
  '👕': 'body-outline',
  // Emergency
  '🆘': 'alert-circle-outline',
  '🚨': 'alert-circle-outline',
};

const DEFAULT_ICON: IoniconName = 'ellipse-outline';

export interface AppIconProps {
  /** Legacy emoji string used as a lookup key; mapped to an Ionicons glyph. */
  glyph?: string;
  /** Explicit Ionicons name; wins over `glyph` when provided. */
  name?: IoniconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function iconForGlyph(glyph?: string): IoniconName {
  if (!glyph) return DEFAULT_ICON;
  if (GLYPH_TO_ICON[glyph]) return GLYPH_TO_ICON[glyph];
  // Allow Ionicon names (e.g. search-outline) passed through legacy glyph props.
  if (glyph.includes('-') || glyph.endsWith('outline')) {
    return glyph as IoniconName;
  }
  return DEFAULT_ICON;
}

export default function AppIcon({
  glyph,
  name,
  size = fontSizes.subheading,
  color,
  style,
}: AppIconProps) {
  const { colors } = useTheme();
  const resolved = name ?? iconForGlyph(glyph);
  return (
    <Ionicons
      name={resolved}
      size={size}
      color={color ?? colors.teal}
      style={style}
    />
  );
}
