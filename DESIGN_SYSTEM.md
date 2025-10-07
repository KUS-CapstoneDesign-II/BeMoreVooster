# BeMore Design System

Comprehensive design system implementation based on BeMore Brand Guide.

## 📚 Overview

The BeMore Design System provides a unified, type-safe foundation for building consistent, accessible, and maintainable UI components.

### Key Features

- ✅ **Single Source of Truth**: All design tokens defined in `design-tokens.ts`
- ✅ **Type Safety**: Full TypeScript support with exported types
- ✅ **Tailwind Integration**: Design tokens automatically integrated into Tailwind CSS
- ✅ **Brand Consistency**: 100% alignment with BeMore Brand Guide
- ✅ **Utility Functions**: Helper functions for accessing tokens programmatically
- ✅ **Component Presets**: Pre-configured component styles

---

## 🎨 Design Tokens

### Colors

#### Brand Colors
```typescript
import { designTokens } from '@/lib/design-tokens';

designTokens.colors.brand.navy      // #25324A (Misty Navy)
designTokens.colors.brand.slate     // #F5F7FA (Light Slate)
designTokens.colors.brand.teal      // #3D8A9E (Dusty Teal)
designTokens.colors.brand.lavender  // #A9B0C7 (Muted Lavender)
```

**Usage in Tailwind**:
```jsx
<div className="bg-brand-navy text-white">
  <Button className="bg-brand-teal" />
</div>
```

#### Semantic Colors
```typescript
designTokens.colors.semantic.highlight  // #2F80ED (Sky Blue)
designTokens.colors.semantic.success    // #2DBE76 (Emerald)
designTokens.colors.semantic.warning    // #E8A531 (Amber)
designTokens.colors.semantic.error      // #E1574C (Coral)
```

**Usage in Tailwind**:
```jsx
<Badge className="bg-success" />
<Alert className="border-error" />
```

#### Neutral Palette
```typescript
designTokens.colors.neutral[50]   // Lightest
designTokens.colors.neutral[500]  // Mid-tone
designTokens.colors.neutral[900]  // Darkest
```

### Spacing (4px Baseline Grid)

```typescript
designTokens.spacing[1]   // 4px
designTokens.spacing[2]   // 8px
designTokens.spacing[4]   // 16px
designTokens.spacing[6]   // 24px
designTokens.spacing[8]   // 32px
designTokens.spacing[12]  // 48px
```

**Usage in Tailwind**:
```jsx
<div className="p-4 m-6 gap-2">
  {/* padding: 16px, margin: 24px, gap: 8px */}
</div>
```

### Typography

#### Font Families
```typescript
designTokens.typography.fontFamily.sans  // ['Inter', 'SF Pro Display', ...]
```

#### Font Sizes
```typescript
designTokens.typography.fontSize.sm    // 14px
designTokens.typography.fontSize.base  // 16px
designTokens.typography.fontSize.lg    // 18px
designTokens.typography.fontSize['2xl']  // 24px
```

#### Font Weights
```typescript
designTokens.typography.fontWeight.normal    // 400
designTokens.typography.fontWeight.medium    // 500
designTokens.typography.fontWeight.semibold  // 600
```

### Border Radius
```typescript
designTokens.radius.sm    // 4px
designTokens.radius.base  // 6px
designTokens.radius.md    // 8px
designTokens.radius.lg    // 12px
```

### Shadows
```typescript
designTokens.shadows.sm   // Subtle elevation
designTokens.shadows.md   // Medium elevation
designTokens.shadows.lg   // High elevation
```

---

## 🛠️ Utility Functions

### Design System Utilities

Import from `@/lib/design-system`:

```typescript
import {
  cn,                    // Class name merger
  getBrandColor,         // Get brand color by name
  getSemanticColor,      // Get semantic color
  getSpacing,            // Get spacing value
  typographyClass,       // Generate typography classes
  radiusClass,           // Generate border radius classes
  shadowClass,           // Generate shadow classes
  cardPreset,            // Card component preset
  inputPreset,           // Input component preset
} from '@/lib/design-system';
```

### Examples

#### Color Utilities
```typescript
// Get color values
getBrandColor('navy')       // => '#25324A'
getSemanticColor('success') // => '#2DBE76'

// Generate classes
colorClass('bg', 'brand-teal')  // => 'bg-brand-teal'
```

#### Spacing Utilities
```typescript
// Get spacing value
getSpacing(4)  // => '16px'

// Generate classes
spacingClass('p', 4)   // => 'p-4'
spacingClass('mt', 6)  // => 'mt-6'
```

#### Typography Utilities
```typescript
// Generate typography classes
typographyClass({
  size: 'lg',
  weight: 'semibold',
  leading: 'relaxed'
})
// => 'text-lg font-semibold leading-relaxed'
```

#### Component Presets
```typescript
// Pre-configured component styles
<div className={cardPreset}>
  {/* bg-card, rounded-lg, shadow-sm, p-6 */}
</div>

<input className={inputPreset} />
{/* Fully styled input with focus states */}
```

---

## 🧩 Component Usage

### Button Component

Enhanced with brand-specific variants:

```tsx
import { Button } from '@/components/ui/button';

// Semantic variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="destructive">Delete</Button>

// Brand variants
<Button variant="brand-teal">BeMore Teal</Button>
<Button variant="brand-navy">BeMore Navy</Button>

// Semantic action variants
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="highlight">Highlight</Button>
```

### Badge Component

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="brand-navy">Brand</Badge>
```

---

## 🎯 Usage Guidelines

### 1. Always Use Design Tokens

❌ **Don't**: Hardcode values
```tsx
<div className="text-[#25324A] p-[16px]" />
```

✅ **Do**: Use design tokens
```tsx
<div className="text-brand-navy p-4" />
```

### 2. Use Utility Functions

❌ **Don't**: Manually construct classes
```tsx
const classes = `text-${size} font-${weight}`;
```

✅ **Do**: Use utility functions
```tsx
const classes = typographyClass({ size, weight });
```

### 3. Leverage Component Presets

❌ **Don't**: Repeat common patterns
```tsx
<div className="bg-card rounded-lg shadow-sm p-6" />
```

✅ **Do**: Use presets
```tsx
<div className={cardPreset} />
```

---

## 📦 File Structure

```
src/
├── lib/
│   ├── design-tokens.ts      # Core design tokens (SSOT)
│   ├── design-system.ts      # Utility functions & presets
│   └── utils.ts              # Re-exports cn for compatibility
├── app/
│   └── globals.css           # CSS variables & base styles
├── components/
│   └── ui/
│       ├── button.tsx        # Enhanced with brand variants
│       └── badge.tsx         # Enhanced with brand variants
└── tailwind.config.ts        # Token integration
```

---

## 🔄 Migration Guide

### From Old System

1. **Replace direct imports**:
   ```typescript
   // Before
   import { cn } from '@/lib/utils';

   // After (recommended)
   import { cn } from '@/lib/design-system';
   ```

2. **Use brand colors instead of semantic**:
   ```tsx
   // Before
   <Button className="bg-primary" />

   // After (more explicit)
   <Button variant="brand-teal" />
   ```

3. **Replace hardcoded values**:
   ```tsx
   // Before
   <div className="p-[24px] rounded-[12px]" />

   // After
   <div className="p-6 rounded-lg" />
   ```

---

## 🚀 Best Practices

### 1. Component Development

```tsx
import { cn, radiusClass, spacingClass } from '@/lib/design-system';

export function MyComponent({ className }: Props) {
  return (
    <div className={cn(
      'bg-brand-slate',
      radiusClass('md'),
      spacingClass('p', 4),
      className
    )}>
      {/* Content */}
    </div>
  );
}
```

### 2. Type Safety

```typescript
import { type ColorTokens } from '@/lib/design-tokens';

// Type-safe color usage
function useThemeColor(color: keyof ColorTokens['brand']) {
  return getBrandColor(color);
}
```

### 3. Validation

```typescript
import { isValidColor, isValidSpacing } from '@/lib/design-system';

// Validate user input
if (isValidColor('brand.navy')) {
  // Safe to use
}
```

---

## 📊 Design Token Reference

### Complete Color System

| Token | Value | Usage |
|-------|-------|-------|
| `brand.navy` | `#25324A` | Headers, primary text |
| `brand.slate` | `#F5F7FA` | Backgrounds, surfaces |
| `brand.teal` | `#3D8A9E` | Primary actions, charts |
| `brand.lavender` | `#A9B0C7` | Secondary actions, borders |
| `semantic.highlight` | `#2F80ED` | Critical actions, links |
| `semantic.success` | `#2DBE76` | Success states |
| `semantic.warning` | `#E8A531` | Warning states |
| `semantic.error` | `#E1574C` | Error states |

### Spacing Scale

| Token | Value | Common Use |
|-------|-------|------------|
| `1` | `4px` | Tight spacing, borders |
| `2` | `8px` | Small gaps, padding |
| `4` | `16px` | Default spacing |
| `6` | `24px` | Section spacing |
| `8` | `32px` | Large spacing |
| `12` | `48px` | Major sections |

---

## 🔧 Customization

### Adding New Tokens

1. **Define in `design-tokens.ts`**:
   ```typescript
   export const colorTokens = {
     brand: {
       // ... existing colors
       newColor: '#HEXVAL',
     }
   };
   ```

2. **Update Tailwind config** (auto-imported via spread)

3. **Use in components**:
   ```tsx
   <div className="bg-brand-newColor" />
   ```

### Creating New Presets

```typescript
// In design-system.ts
export const myPreset = cn(
  'bg-brand-slate',
  radiusClass('lg'),
  spacingClass('p', 6),
  typographyClass({ size: 'lg', weight: 'semibold' })
);
```

---

## 📝 Notes

- All design tokens are derived from BeMore Brand Guide
- CSS variables in `globals.css` use HSL format for theme support
- Tailwind utilities use direct hex values from design tokens
- The `cn` utility handles class conflicts and conditional classes
- Component presets can be extended with additional classes

---

## 🤝 Contributing

When adding new components or features:

1. Use existing design tokens
2. Add new variants to existing components when possible
3. Document new patterns in this guide
4. Ensure type safety with TypeScript
5. Test across light/dark themes

---

## 📚 Resources

- **Design Tokens**: `/src/lib/design-tokens.ts`
- **Utilities**: `/src/lib/design-system.ts`
- **Brand Guide**: `/src/constants/brand.ts` (legacy reference)
- **Tailwind Config**: `/tailwind.config.ts`
