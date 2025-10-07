import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import { designTokens } from "./src/lib/design-tokens";

const config: Config = {
  theme: {
    extend: {
      // Brand Colors - Direct token usage
      colors: {
        // Semantic color system (CSS variables for theme support)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // BeMore Brand Colors - Direct values
        brand: {
          navy: designTokens.colors.brand.navy,
          slate: designTokens.colors.brand.slate,
          teal: designTokens.colors.brand.teal,
          lavender: designTokens.colors.brand.lavender,
        },

        // Semantic action colors
        highlight: designTokens.colors.semantic.highlight,
        success: designTokens.colors.semantic.success,
        warning: designTokens.colors.semantic.warning,
        error: designTokens.colors.semantic.error,

        // Neutral palette
        neutral: designTokens.colors.neutral,
      },

      // Spacing system (4px baseline grid)
      spacing: designTokens.spacing,

      // Typography
      fontFamily: {
        sans: ["var(--font-sans)", ...designTokens.typography.fontFamily.sans],
      },
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      lineHeight: designTokens.typography.lineHeight,
      letterSpacing: designTokens.typography.letterSpacing,

      // Border radius
      borderRadius: designTokens.radius,

      // Shadows
      boxShadow: {
        ...designTokens.shadows,
        // Make sure glow effects are available
        'glow-teal': designTokens.shadows['glow-teal'],
        'glow-navy': designTokens.shadows['glow-navy'],
        'glow-highlight': designTokens.shadows['glow-highlight'],
        'glow-success': designTokens.shadows['glow-success'],
        'float': designTokens.shadows.float,
        'inner': designTokens.shadows.inner,
      },

      // Container
      container: {
        center: true,
        padding: designTokens.layout.container.padding,
        screens: {
          sm: designTokens.layout.breakpoints.mobile,
          md: designTokens.layout.breakpoints.tablet,
          lg: designTokens.layout.breakpoints.desktop,
          xl: designTokens.layout.breakpoints.wide,
        },
      },

      // Animation
      transitionDuration: designTokens.animation.duration,
      transitionTimingFunction: designTokens.animation.easing,
    },
  },
};

export default config;


