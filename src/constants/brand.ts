/**
 * BeMore Brand System
 * Centralized brand constants based on design guide
 */

export const BRAND = {
  name: 'BeMore',
  tagline: 'Calm, Insightful, Encouraging',
  description: 'Weekly reflections turn into clear insights with VAD trends and CBT guidance',

  // Color System (from design guide)
  colors: {
    // Primary Palette
    primary: '#25324A',       // Misty Navy
    secondary: '#F5F7FA',     // Light Slate

    // Extended Palette
    accent: {
      primary: '#3D8A9E',     // Dusty Teal - Charts, primary buttons
      secondary: '#A9B0C7',   // Muted Lavender - Secondary CTA, borders
    },

    // Functional Colors
    highlight: '#2F80ED',     // Sky Blue - Primary actions, links
    success: '#2DBE76',       // Emerald
    warning: '#E8A531',       // Amber
    error: '#E1574C',         // Coral

    // Usage Guidelines
    usage: {
      criticalActions: '#2F80ED',    // Start recording, view results
      primaryContent: '#25324A',     // Headers, important text
      dataVisualization: '#3D8A9E',  // Charts, progress indicators
      secondaryActions: '#A9B0C7',   // Optional features, borders
      background: '#F5F7FA',         // Page backgrounds, card surfaces
    }
  },

  // Typography System
  typography: {
    fontFamily: {
      primary: 'Inter',
      fallback: ['SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
    },

    // Typography Scale (from design guide)
    scale: {
      h1: { size: '32px', weight: 600, letterSpacing: '-0.2px' },
      h2: { size: '24px', weight: 600, letterSpacing: '-0.1px' },
      h3: { size: '20px', weight: 500, letterSpacing: 'normal' },
      bodyLarge: { size: '18px', weight: 400, lineHeight: 1.5 },
      body: { size: '16px', weight: 400, lineHeight: 1.5 },
      bodySmall: { size: '14px', weight: 400, lineHeight: 1.4 },
      caption: { size: '12px', weight: 500, lineHeight: 1.3 },
    },

    // Special Typography
    special: {
      chartNumbers: { fontFeatures: 'tabular-nums' },
      emotionalLabels: { weight: 500 },
    }
  },

  // Layout System
  layout: {
    // Grid System (4px baseline)
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px',
    },

    // Container
    container: {
      maxWidth: '1200px',
    },

    // Breakpoints
    breakpoints: {
      mobile: '375px',
      tablet: '768px',
      desktop: '1024px',
    },

    // Component Heights
    heights: {
      header: '64px',
      bottomNav: '72px',
      mobileNav: '72px',
    },

    // Border Radius
    radius: {
      cards: '12px',
      buttons: '8px',
      inputs: '6px',
    },
  },

  // Icon System
  icons: {
    library: 'lucide-react',
    strokeWeight: '1.5px',
    sizes: {
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '32px',
    },
  },

  // Shadow System
  shadows: {
    subtle: 'rgba(37, 50, 74, 0.05)',
    elevation: {
      sm: '0 1px 2px rgba(37, 50, 74, 0.05)',
      md: '0 4px 6px rgba(37, 50, 74, 0.05)',
      lg: '0 8px 12px rgba(37, 50, 74, 0.05)',
    },
  },

  // UX Principles
  ux: {
    mood: 'trustworthy and professional',
    approach: 'guided discovery',
    safety: 'emotional safety first',
    disclosure: 'progressive',
    feedback: 'gentle encouragement',
  },
} as const;

// Type exports for TypeScript support
export type BrandColors = typeof BRAND.colors;
export type BrandTypography = typeof BRAND.typography;
export type BrandLayout = typeof BRAND.layout;

// Helper functions
export const getBrandColor = (path: string) => {
  const keys = path.split('.');
  let value: any = BRAND.colors;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

export const getBrandSpacing = (size: keyof typeof BRAND.layout.spacing) => {
  return BRAND.layout.spacing[size];
};

export const getBrandTypography = (scale: keyof typeof BRAND.typography.scale) => {
  return BRAND.typography.scale[scale];
};