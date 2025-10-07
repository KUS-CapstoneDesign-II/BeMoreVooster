/**
 * BeMore Design System Utilities
 * Helper functions for accessing design tokens and maintaining consistency
 */

import { designTokens, type DesignTokens } from './design-tokens';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// Utility: cn (Class Name Merger)
// ============================================================================

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Color System Utilities
// ============================================================================

/**
 * Get brand color by name
 * @example getBrandColor('navy') => '#25324A'
 */
export function getBrandColor(
  color: keyof typeof designTokens.colors.brand
): string {
  return designTokens.colors.brand[color];
}

/**
 * Get semantic color by name
 * @example getSemanticColor('highlight') => '#2F80ED'
 */
export function getSemanticColor(
  color: keyof typeof designTokens.colors.semantic
): string {
  return designTokens.colors.semantic[color];
}

/**
 * Get neutral color by shade
 * @example getNeutralColor('500') => '#6C757D'
 */
export function getNeutralColor(
  shade: keyof typeof designTokens.colors.neutral
): string {
  return designTokens.colors.neutral[shade];
}

/**
 * Generate Tailwind color class
 * @example colorClass('bg', 'brand-teal') => 'bg-brand-teal'
 */
export function colorClass(
  type: 'bg' | 'text' | 'border' | 'ring',
  color: string
): string {
  return `${type}-${color}`;
}

// ============================================================================
// Spacing Utilities
// ============================================================================

/**
 * Get spacing value
 * @example getSpacing('4') => '16px'
 */
export function getSpacing(size: keyof typeof designTokens.spacing): string {
  return designTokens.spacing[size];
}

/**
 * Generate spacing class
 * @example spacingClass('p', '4') => 'p-4'
 */
export function spacingClass(
  type: 'p' | 'm' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr' | 'gap',
  size: keyof typeof designTokens.spacing
): string {
  return `${type}-${size}`;
}

// ============================================================================
// Typography Utilities
// ============================================================================

/**
 * Get font family
 * @example getFontFamily('sans') => ['Inter', 'SF Pro Display', ...]
 */
export function getFontFamily(
  family: keyof typeof designTokens.typography.fontFamily
): readonly string[] {
  return designTokens.typography.fontFamily[family];
}

/**
 * Get font size
 * @example getFontSize('lg') => '18px'
 */
export function getFontSize(
  size: keyof typeof designTokens.typography.fontSize
): string {
  return designTokens.typography.fontSize[size];
}

/**
 * Generate typography classes
 * @example typographyClass({ size: 'lg', weight: 'semibold' }) => 'text-lg font-semibold'
 */
export function typographyClass(options: {
  size?: keyof typeof designTokens.typography.fontSize;
  weight?: keyof typeof designTokens.typography.fontWeight;
  leading?: keyof typeof designTokens.typography.lineHeight;
  tracking?: keyof typeof designTokens.typography.letterSpacing;
}): string {
  const classes: string[] = [];

  if (options.size) classes.push(`text-${options.size}`);
  if (options.weight) classes.push(`font-${options.weight}`);
  if (options.leading) classes.push(`leading-${options.leading}`);
  if (options.tracking) classes.push(`tracking-${options.tracking}`);

  return classes.join(' ');
}

// ============================================================================
// Border Radius Utilities
// ============================================================================

/**
 * Get border radius value
 * @example getRadius('lg') => '12px'
 */
export function getRadius(size: keyof typeof designTokens.radius): string {
  return designTokens.radius[size];
}

/**
 * Generate border radius class
 * @example radiusClass('lg') => 'rounded-lg'
 */
export function radiusClass(
  size: keyof typeof designTokens.radius,
  position?: 't' | 'b' | 'l' | 'r' | 'tl' | 'tr' | 'bl' | 'br'
): string {
  const prefix = position ? `rounded-${position}` : 'rounded';
  return `${prefix}-${size}`;
}

// ============================================================================
// Shadow Utilities
// ============================================================================

/**
 * Get shadow value
 * @example getShadow('md') => '0 4px 6px rgba(37, 50, 74, 0.05)'
 */
export function getShadow(size: keyof typeof designTokens.shadows): string {
  return designTokens.shadows[size];
}

/**
 * Generate shadow class
 * @example shadowClass('md') => 'shadow-md'
 */
export function shadowClass(size: keyof typeof designTokens.shadows): string {
  return `shadow-${size}`;
}

// ============================================================================
// Animation Utilities
// ============================================================================

/**
 * Get animation duration
 * @example getDuration('base') => '200ms'
 */
export function getDuration(
  duration: keyof typeof designTokens.animation.duration
): string {
  return designTokens.animation.duration[duration];
}

/**
 * Get animation easing
 * @example getEasing('default') => 'cubic-bezier(0.4, 0, 0.2, 1)'
 */
export function getEasing(
  easing: keyof typeof designTokens.animation.easing
): string {
  return designTokens.animation.easing[easing];
}

/**
 * Generate transition class
 * @example transitionClass('base', 'default') => 'transition duration-base ease-default'
 */
export function transitionClass(
  duration?: keyof typeof designTokens.animation.duration,
  easing?: keyof typeof designTokens.animation.easing
): string {
  const classes: string[] = ['transition'];

  if (duration) classes.push(`duration-${duration}`);
  if (easing) classes.push(`ease-${easing}`);

  return classes.join(' ');
}

// ============================================================================
// Component Preset Utilities
// ============================================================================

/**
 * Preset: Card component classes
 */
export const cardPreset = cn(
  'bg-card text-card-foreground',
  radiusClass('lg'),
  shadowClass('sm'),
  spacingClass('p', 6)
);

/**
 * Preset: Input component classes
 */
export const inputPreset = cn(
  'flex h-10 w-full',
  radiusClass('base'),
  'border border-input bg-background',
  spacingClass('px', 3),
  spacingClass('py', 2),
  typographyClass({ size: 'sm' }),
  'ring-offset-background',
  'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

/**
 * Preset: Container classes
 */
export const containerPreset = cn(
  'container mx-auto',
  spacingClass('px', 4),
  'max-w-7xl'
);

/**
 * Preset: Section spacing
 */
export const sectionPreset = cn(
  spacingClass('py', 12),
  spacingClass('px', 4)
);

// ============================================================================
// Accessibility Utilities
// ============================================================================

/**
 * Screen reader only class (visually hidden but accessible)
 */
export const srOnly = 'sr-only';

/**
 * Focus visible classes (keyboard navigation)
 */
export const focusVisible = cn(
  'focus-visible:outline-hidden',
  'focus-visible:ring-2',
  'focus-visible:ring-ring',
  'focus-visible:ring-offset-2'
);

/**
 * Disabled state classes
 */
export const disabled = cn('disabled:pointer-events-none', 'disabled:opacity-50');

// ============================================================================
// Responsive Utilities
// ============================================================================

/**
 * Get breakpoint value
 * @example getBreakpoint('tablet') => '768px'
 */
export function getBreakpoint(
  breakpoint: keyof typeof designTokens.layout.breakpoints
): string {
  return designTokens.layout.breakpoints[breakpoint];
}

/**
 * Generate responsive class
 * @example responsiveClass('md', 'grid-cols-2') => 'md:grid-cols-2'
 */
export function responsiveClass(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl',
  className: string
): string {
  return `${breakpoint}:${className}`;
}

// ============================================================================
// Design Token Validation
// ============================================================================

/**
 * Validate if a color exists in the design system
 */
export function isValidColor(colorPath: string): boolean {
  try {
    const keys = colorPath.split('.');
    let value: any = designTokens.colors;
    for (const key of keys) {
      value = value?.[key];
    }
    return typeof value === 'string' && value.startsWith('#');
  } catch {
    return false;
  }
}

/**
 * Validate if a spacing value exists
 */
export function isValidSpacing(size: string): boolean {
  return size in designTokens.spacing;
}

// ============================================================================
// Theme Utilities
// ============================================================================

/**
 * Get all design tokens (useful for debugging/documentation)
 */
export function getAllTokens(): DesignTokens {
  return designTokens;
}

/**
 * Export commonly used token groups
 */
export const tokens = {
  colors: designTokens.colors,
  spacing: designTokens.spacing,
  typography: designTokens.typography,
  radius: designTokens.radius,
  shadows: designTokens.shadows,
  animation: designTokens.animation,
} as const;
