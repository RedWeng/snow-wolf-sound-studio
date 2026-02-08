# Snow Wolf Design System

This document describes the complete design system for the Snow Wolf Boy Event Registration System.

## Overview

The Snow Wolf design system is built on Tailwind CSS with custom design tokens that express a cinematic brand aesthetic featuring dark-to-light gradients, moon/snow imagery, and clean typography.

## Color Palette

### Brand Colors

| Color | Hex | Tailwind Class | CSS Variable | Usage |
|-------|-----|----------------|--------------|-------|
| Navy | `#0A1628` | `bg-brand-navy` | `--color-brand-navy` | Deep night sky, primary dark |
| Midnight | `#1A2B47` | `bg-brand-midnight` | `--color-brand-midnight` | Midnight blue, secondary dark |
| Slate | `#2D3E5F` | `bg-brand-slate` | `--color-brand-slate` | Slate blue, tertiary dark |
| Frost | `#E8F1F8` | `bg-brand-frost` | `--color-brand-frost` | Frost white, light background |
| Snow | `#F8FBFF` | `bg-brand-snow` | `--color-brand-snow` | Pure snow, primary light |

### Accent Colors

| Color | Hex | Tailwind Class | CSS Variable | Usage |
|-------|-----|----------------|--------------|-------|
| Moon Gold | `#FFE5B4` | `bg-accent-moon` | `--color-accent-moon` | Moonlight gold, warm accent |
| Ice Blue | `#B8E6F5` | `bg-accent-ice` | `--color-accent-ice` | Ice blue, cool accent |
| Aurora Purple | `#C8B6FF` | `bg-accent-aurora` | `--color-accent-aurora` | Aurora purple, magical accent |

### Semantic Colors

| Color | Hex | Tailwind Class | CSS Variable | Usage |
|-------|-----|----------------|--------------|-------|
| Success | `#10B981` | `bg-semantic-success` | `--color-success` | Success states |
| Warning | `#F59E0B` | `bg-semantic-warning` | `--color-warning` | Warning states |
| Error | `#EF4444` | `bg-semantic-error` | `--color-error` | Error states |
| Info | `#3B82F6` | `bg-semantic-info` | `--color-info` | Info states |

## Typography

### Font Families

- **Headings**: Playfair Display (serif) - `font-heading`
- **Body**: Inter (sans-serif) - `font-body`
- **Monospace**: JetBrains Mono - `font-mono`

### Type Scale

| Size | Tailwind Class | Font Size | Line Height | Letter Spacing | Usage |
|------|----------------|-----------|-------------|----------------|-------|
| Display | `text-display` | 4rem (64px) | 1.1 | -0.02em | Hero headlines |
| H1 | `text-h1` | 3rem (48px) | 1.2 | -0.01em | Page titles |
| H2 | `text-h2` | 2.25rem (36px) | 1.3 | - | Section titles |
| H3 | `text-h3` | 1.875rem (30px) | 1.4 | - | Subsection titles |
| H4 | `text-h4` | 1.5rem (24px) | 1.5 | - | Card titles |
| Body Large | `text-body-lg` | 1.125rem (18px) | 1.6 | - | Lead paragraphs |
| Body | `text-body` | 1rem (16px) | 1.6 | - | Body text |
| Body Small | `text-body-sm` | 0.875rem (14px) | 1.5 | - | Secondary text |
| Caption | `text-caption` | 0.75rem (12px) | 1.4 | - | Captions, labels |

## Spacing Scale

| Name | Tailwind Class | Value | Pixels | CSS Variable |
|------|----------------|-------|--------|--------------|
| XS | `space-xs`, `p-xs`, `m-xs` | 0.5rem | 8px | `--spacing-xs` |
| SM | `space-sm`, `p-sm`, `m-sm` | 0.75rem | 12px | `--spacing-sm` |
| MD | `space-md`, `p-md`, `m-md` | 1rem | 16px | `--spacing-md` |
| LG | `space-lg`, `p-lg`, `m-lg` | 1.5rem | 24px | `--spacing-lg` |
| XL | `space-xl`, `p-xl`, `m-xl` | 2rem | 32px | `--spacing-xl` |
| 2XL | `space-2xl`, `p-2xl`, `m-2xl` | 3rem | 48px | `--spacing-2xl` |
| 3XL | `space-3xl`, `p-3xl`, `m-3xl` | 4rem | 64px | `--spacing-3xl` |
| 4XL | `space-4xl`, `p-4xl`, `m-4xl` | 6rem | 96px | `--spacing-4xl` |

## Responsive Breakpoints

| Breakpoint | Tailwind Prefix | Min Width | Device Target |
|------------|-----------------|-----------|---------------|
| SM | `sm:` | 640px | Mobile landscape |
| MD | `md:` | 768px | Tablet |
| LG | `lg:` | 1024px | Desktop |
| XL | `xl:` | 1280px | Large desktop |
| 2XL | `2xl:` | 1536px | Extra large |

## Animation & Transitions

### Transition Durations

| Name | Tailwind Class | Value | CSS Variable | Usage |
|------|----------------|-------|--------------|-------|
| Fast | `duration-fast` | 150ms | `--duration-fast` | Quick interactions |
| Base | `duration-base` | 250ms | `--duration-base` | Standard transitions |
| Slow | `duration-slow` | 350ms | `--duration-slow` | Deliberate animations |
| Slower | `duration-slower` | 500ms | `--duration-slower` | Emphasis animations |

### Easing Functions

| Name | Tailwind Class | Value | CSS Variable | Usage |
|------|----------------|-------|--------------|-------|
| Smooth | `ease-smooth` | cubic-bezier(0.4, 0, 0.2, 1) | `--ease-smooth` | Standard easing |
| Bounce | `ease-bounce` | cubic-bezier(0.68, -0.55, 0.265, 1.55) | `--ease-bounce` | Playful bounce |
| Ease In Out | `ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | `--ease-in-out` | Smooth in/out |

### Animation Classes

| Class | Effect | Usage |
|-------|--------|-------|
| `animate-fade-in` | Fade in from transparent | Page/component entrance |
| `animate-slide-up` | Slide up from below | Content reveal |
| `animate-scale-in` | Scale up from 95% | Modal/dialog entrance |

## Component Utilities

### Gradient Backgrounds

```tsx
// Navy to Frost gradient
<div className="bg-gradient-navy-frost">...</div>

// Midnight to Snow gradient
<div className="bg-gradient-midnight-snow">...</div>

// Aurora gradient
<div className="bg-gradient-aurora">...</div>
```

### Text Gradients

```tsx
// Moon gradient text
<h1 className="text-gradient-moon">Gradient Text</h1>
```

### Glass Morphism

```tsx
// Frosted glass effect
<div className="glass">...</div>
```

### Card Hover Effect

```tsx
// Card with lift and shadow on hover
<div className="card-hover">...</div>
```

### Button Base

```tsx
// Base button styles with touch-friendly sizing
<button className="btn-base bg-brand-navy text-brand-snow">
  Click Me
</button>
```

### Container

```tsx
// Centered container with responsive padding
<div className="container-custom">...</div>
```

### Touch Target

```tsx
// Ensures minimum 44px touch target
<button className="touch-target">...</button>
```

## Usage Examples

### Hero Section

```tsx
<section className="min-h-screen bg-gradient-navy-frost flex items-center justify-center">
  <div className="container-custom text-center">
    <h1 className="text-display text-brand-snow animate-fade-in">
      Snow Wolf Boy
    </h1>
    <p className="text-body-lg text-brand-frost mt-4 animate-slide-up">
      Premium Event Registration System
    </p>
  </div>
</section>
```

### Card Component

```tsx
<div className="bg-white rounded-lg shadow-md p-6 card-hover">
  <h3 className="text-h3 text-brand-navy mb-2">Card Title</h3>
  <p className="text-body text-brand-slate">Card content goes here...</p>
</div>
```

### Button Variants

```tsx
// Primary button
<button className="btn-base bg-brand-navy text-brand-snow hover:bg-brand-midnight">
  Primary
</button>

// Accent button
<button className="btn-base bg-accent-moon text-brand-navy hover:bg-accent-aurora">
  Accent
</button>

// Outline button
<button className="btn-base bg-transparent border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-snow">
  Outline
</button>
```

### Form Input

```tsx
<input
  type="text"
  className="w-full px-4 py-3 rounded-lg border-2 border-brand-frost focus:border-accent-aurora focus:outline-none transition-colors duration-base"
  placeholder="Enter text..."
/>
```

## Accessibility

### Focus States

All interactive elements have visible focus indicators using the `focus-visible:` variant with aurora purple outline.

### Touch Targets

All interactive elements meet the minimum 44px touch target size for mobile accessibility.

### Color Contrast

All color combinations meet WCAG AA standards for contrast ratios:
- Text on backgrounds: minimum 4.5:1
- Large text on backgrounds: minimum 3:1

### Keyboard Navigation

All interactive elements are keyboard accessible with proper focus management.

## Testing

Visit `/design-system-test` in development mode to see all design tokens in action and verify the implementation.

## CSS Variables

All design tokens are available as CSS custom properties for use in custom CSS:

```css
.custom-element {
  background-color: var(--color-brand-navy);
  padding: var(--spacing-lg);
  transition: all var(--duration-base) var(--ease-smooth);
}
```

## Mobile-First Approach

All components are designed mobile-first, then enhanced for larger screens:

```tsx
<div className="p-4 md:p-6 lg:p-8">
  <h2 className="text-h3 md:text-h2 lg:text-h1">
    Responsive Heading
  </h2>
</div>
```

## Performance

- All animations use GPU-accelerated properties (transform, opacity)
- Transitions are optimized for 60fps
- Images should use Next.js Image component for optimization
- Fonts are preloaded for optimal performance
