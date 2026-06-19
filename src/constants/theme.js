// src/constants/theme.js

export const COLORS = {
    // Primary brand colors
    primary: '#0B6E5E',      // Deep teal — CTA buttons, active states, 'me' chat bubbles
    primaryLight: '#E7EFEC', // Soft teal tint — input fields, chips, surface blocks
    secondary: '#115C61',    // Darker teal — splash bg, hero panels, secondary accents
  
    // Neutral palette
    background: '#F6F8F7',   // Near-white cool grey — main screen backgrounds
    surface: '#DAEBE8',      // Muted teal-green — image placeholders, card tints
  
    // Typography colors
    textPrimary: '#0C1A3A',  // Deep navy — headers and primary body text
    textSecondary: '#4E5971',// Slate blue-grey — subheadings, captions, escrow notes
    textLight: '#FFFFFF',    // White — text on primary buttons and dark headers
  
    // Header / navigation
    headerBg: '#0C1A3A',     // Deep navy — top bars and bottom nav background
  
    // Status semantic colors
    success: '#0B6E5E',      // Teal-green — 'Confirmed' / 'Paid' badges
    warning: '#D4A24C',      // Warm gold — 'Pending' / star ratings
    danger: '#C0392B',       // Red — 'SOS' button and errors
  };
  
  export const FONTS = {
    header: {
      fontSize: 24,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.textPrimary,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: COLORS.textPrimary,
    },
    caption: {
      fontSize: 13,
      fontWeight: '400',
      color: COLORS.textSecondary,
    },
  };
  
  export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,    // Standard padding for screen edges and between cards
    lg: 24,
    xl: 32,
  };
  
  const theme = { COLORS, FONTS, SPACING };
  export default theme;