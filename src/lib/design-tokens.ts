/**
 * BeMore Design System - Design Tokens
 * Single source of truth for all design values
 * Based on BeMore Brand Guide
 */

// ============================================================================
// Color Tokens
// ============================================================================

export const colorTokens = {
  // Brand Colors
  brand: {
    navy: '#25324A',      // Misty Navy - Primary brand color
    slate: '#F5F7FA',     // Light Slate - Background, surfaces
    teal: '#3D8A9E',      // Dusty Teal - Primary accent
    lavender: '#A9B0C7',  // Muted Lavender - Secondary accent
  },

  // Semantic Colors
  semantic: {
    highlight: '#2F80ED',  // Sky Blue - Primary actions, links
    success: '#2DBE76',    // Emerald
    warning: '#E8A531',    // Amber
    error: '#E1574C',      // Coral
  },

  // Neutrals (generated from brand colors)
  neutral: {
    50: '#F8F9FA',
    100: '#F5F7FA',  // brand.slate
    200: '#E1E6ED',
    300: '#CED4DA',
    400: '#A9B0C7',  // brand.lavender
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#25324A',  // brand.navy
    900: '#1A2332',
    950: '#0F1419',
  },
} as const;

// ============================================================================
// Spacing Tokens (4px baseline grid)
// ============================================================================

export const spacingTokens = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

// ============================================================================
// Typography Tokens
// ============================================================================

export const typographyTokens = {
  fontFamily: {
    sans: ['Inter', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
    mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '64px',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },

  // Display typography presets
  display: {
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    fontWeight: 700,
  },
} as const;

// ============================================================================
// Border Radius Tokens
// ============================================================================

export const radiusTokens = {
  none: '0',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const;

// ============================================================================
// Shadow Tokens
// ============================================================================

export const shadowTokens = {
  sm: '0 1px 2px rgba(37, 50, 74, 0.05)',
  base: '0 2px 4px rgba(37, 50, 74, 0.05)',
  md: '0 4px 6px rgba(37, 50, 74, 0.05)',
  lg: '0 8px 12px rgba(37, 50, 74, 0.05)',
  xl: '0 12px 24px rgba(37, 50, 74, 0.08)',
  '2xl': '0 20px 40px -12px rgba(37, 50, 74, 0.15)',

  // Glow effects for emotional design
  'glow-teal': '0 0 20px rgba(61, 138, 158, 0.3)',
  'glow-navy': '0 0 30px rgba(37, 50, 74, 0.2)',
  'glow-highlight': '0 0 25px rgba(47, 128, 237, 0.3)',
  'glow-success': '0 0 20px rgba(45, 190, 118, 0.3)',

  // Utility shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  float: '0 20px 40px -12px rgba(37, 50, 74, 0.15)',
  none: 'none',
} as const;

// ============================================================================
// Layout Tokens
// ============================================================================

export const layoutTokens = {
  container: {
    maxWidth: '1200px',
    padding: '2rem',
  },

  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1400px',
  },

  heights: {
    header: '64px',
    bottomNav: '72px',
    mobileNav: '72px',
  },
} as const;

// ============================================================================
// Icon Tokens
// ============================================================================

export const iconTokens = {
  library: 'lucide-react',
  strokeWeight: 1.5,
  sizes: {
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  },
} as const;

// ============================================================================
// Gradient Tokens
// ============================================================================

export const gradientTokens = {
  // Background gradients
  hero: 'linear-gradient(135deg, #F5F7FA 0%, #E8EEF5 100%)',
  heroAlt: 'linear-gradient(to bottom right, #F8F9FA 0%, #F5F7FA 50%, #E1E6ED 100%)',
  card: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFB 100%)',

  // Brand gradients
  teal: 'linear-gradient(135deg, #3D8A9E 0%, #2D7A8E 100%)',
  tealBright: 'linear-gradient(135deg, #5AA5B8 0%, #3D8A9E 100%)',
  navy: 'linear-gradient(135deg, #25324A 0%, #1A2332 100%)',
  navyLight: 'linear-gradient(135deg, #364968 0%, #25324A 100%)',

  // Semantic gradients
  highlight: 'linear-gradient(135deg, #2F80ED 0%, #1E5FBF 100%)',
  success: 'linear-gradient(135deg, #2DBE76 0%, #22A55F 100%)',
  warning: 'linear-gradient(135deg, #E8A531 0%, #D89520 100%)',
  error: 'linear-gradient(135deg, #E1574C 0%, #D04439 100%)',

  // Text gradients
  textTeal: 'linear-gradient(to right, #3D8A9E, #2F80ED)',
  textNavy: 'linear-gradient(to right, #25324A, #3D8A9E)',
  textBrand: 'linear-gradient(135deg, #3D8A9E 0%, #25324A 100%)',

  // Glass morphism
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassHover: 'rgba(255, 255, 255, 0.8)',
  glassDark: 'rgba(37, 50, 74, 0.05)',

  // Overlay gradients
  overlayTop: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 100%)',
  overlayBottom: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 100%)',

  // Radial gradients for backgrounds
  radialTeal: 'radial-gradient(circle at 30% 20%, rgba(61, 138, 158, 0.1), transparent 50%)',
  radialNavy: 'radial-gradient(circle at 70% 80%, rgba(37, 50, 74, 0.05), transparent 60%)',
} as const;

// ============================================================================
// Animation Tokens
// ============================================================================

export const animationTokens = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '800ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================================================
// Emotion Color Tokens
// ============================================================================

export const emotionTokens = {
  calm: {
    bg: '#E8F4F8',
    text: '#3D8A9E',
    glow: 'rgba(61, 138, 158, 0.2)',
    gradient: 'linear-gradient(135deg, #E8F4F8 0%, #D4EBF3 100%)',
  },
  energetic: {
    bg: '#FFF4E6',
    text: '#E8A531',
    glow: 'rgba(232, 165, 49, 0.2)',
    gradient: 'linear-gradient(135deg, #FFF4E6 0%, #FFE8CC 100%)',
  },
  balanced: {
    bg: '#E8F5E9',
    text: '#2DBE76',
    glow: 'rgba(45, 190, 118, 0.2)',
    gradient: 'linear-gradient(135deg, #E8F5E9 0%, #D4EBD6 100%)',
  },
  stressed: {
    bg: '#FFEBEE',
    text: '#E1574C',
    glow: 'rgba(225, 87, 76, 0.2)',
    gradient: 'linear-gradient(135deg, #FFEBEE 0%, #FFD6DA 100%)',
  },
  focused: {
    bg: '#E8EEF5',
    text: '#2F80ED',
    glow: 'rgba(47, 128, 237, 0.2)',
    gradient: 'linear-gradient(135deg, #E8EEF5 0%, #D4DFEB 100%)',
  },
  reflective: {
    bg: '#F3EBF5',
    text: '#A9B0C7',
    glow: 'rgba(169, 176, 199, 0.2)',
    gradient: 'linear-gradient(135deg, #F3EBF5 0%, #E6D6EB 100%)',
  },
} as const;

// ============================================================================
// Unified Design Tokens Export
// ============================================================================

export const designTokens = {
  colors: colorTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  radius: radiusTokens,
  shadows: shadowTokens,
  gradients: gradientTokens,
  emotions: emotionTokens,
  layout: layoutTokens,
  icons: iconTokens,
  animation: animationTokens,
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type ColorTokens = typeof colorTokens;
export type SpacingTokens = typeof spacingTokens;
export type TypographyTokens = typeof typographyTokens;
export type RadiusTokens = typeof radiusTokens;
export type ShadowTokens = typeof shadowTokens;
export type GradientTokens = typeof gradientTokens;
export type EmotionTokens = typeof emotionTokens;
export type LayoutTokens = typeof layoutTokens;
export type IconTokens = typeof iconTokens;
export type AnimationTokens = typeof animationTokens;
export type DesignTokens = typeof designTokens;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get color value by path
 * @example getColor('brand.navy') => '#25324A'
 */
export function getColor(path: string): string {
  const keys = path.split('.');
  let value: any = colorTokens;
  for (const key of keys) {
    value = value?.[key];
  }
  return value || '';
}

/**
 * Get spacing value by key
 * @example getSpacing('4') => '16px'
 */
export function getSpacing(key: keyof SpacingTokens): string {
  return spacingTokens[key];
}

/**
 * Get typography value by category and key
 * @example getTypography('fontSize', 'lg') => '18px'
 */
export function getTypography<T extends keyof TypographyTokens>(
  category: T,
  key: keyof TypographyTokens[T]
): any {
  return typographyTokens[category][key];
}

/**
 * Get radius value by key
 * @example getRadius('lg') => '12px'
 */
export function getRadius(key: keyof RadiusTokens): string {
  return radiusTokens[key];
}

/**
 * Get shadow value by key
 * @example getShadow('md') => '0 4px 6px rgba(37, 50, 74, 0.05)'
 */
export function getShadow(key: keyof ShadowTokens): string {
  return shadowTokens[key];
}

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Convert hex to HSL
 * @example hexToHSL('#25324A') => '216 33% 22%'
 */
export function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  const hDeg = Math.round(h * 360);
  const sPercent = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${hDeg} ${sPercent}% ${lPercent}%`;
}

/**
 * Generate CSS custom property name
 * @example getCSSVar('brand.navy') => '--color-brand-navy'
 */
export function getCSSVar(path: string, prefix = 'color'): string {
  return `--${prefix}-${path.replace(/\./g, '-')}`;
}
