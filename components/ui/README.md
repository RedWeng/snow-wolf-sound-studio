# Snow Wolf UI Component Library

A comprehensive, AAA-grade UI component library built with React, TypeScript, Tailwind CSS, and Radix UI primitives. Designed for the Snow Wolf Boy Event Registration System with a focus on mobile responsiveness, smooth animations, and accessibility.

## Components

### Button

A versatile button component with multiple variants, sizes, and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `fullWidth`: boolean (default: false)
- `loading`: boolean (default: false)
- All standard HTML button attributes

**Example:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="secondary" loading>
  Loading...
</Button>
```

### Card

A flexible card component with gradient backgrounds and glass morphism effects.

**Variants:**
- `default`: White card with shadow
- `gradient-navy`: Navy to midnight gradient
- `gradient-midnight`: Midnight to slate gradient
- `gradient-aurora`: Aurora to ice gradient
- `glass`: Frosted glass effect with backdrop blur

**Sub-components:**
- `CardHeader`: Card header section
- `CardBody`: Card body section
- `CardFooter`: Card footer section with border

**Example:**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

<Card variant="gradient-navy" hover>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>
    <p>Card content goes here...</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input & Textarea

Form input components with validation states and accessibility features.

**Props:**
- `label`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- `fullWidth`: boolean (default: false)
- All standard HTML input/textarea attributes

**Example:**
```tsx
import { Input, Textarea } from '@/components/ui';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  helperText="We'll never share your email"
  fullWidth
/>

<Textarea
  label="Message"
  placeholder="Enter your message"
  rows={4}
  fullWidth
/>
```

### Modal

An accessible modal/dialog component built on Radix UI primitives.

**Props:**
- `open`: boolean (required)
- `onOpenChange`: (open: boolean) => void (required)
- `title`: string (optional)
- `description`: string (optional)
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `showClose`: boolean (default: true)

**Sub-components:**
- `ModalFooter`: Footer section for action buttons

**Example:**
```tsx
import { Modal, ModalFooter, Button } from '@/components/ui';

const [open, setOpen] = useState(false);

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  size="md"
>
  <p>Modal content goes here...</p>
  
  <ModalFooter>
    <Button variant="ghost" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

### Loading Components

Multiple loading indicators for different use cases.

**LoadingSpinner:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `color`: 'navy' | 'moon' | 'white' (default: 'navy')

**LoadingOverlay:**
- `message`: string (default: 'Loading...')

**LoadingDots:**
- Animated three-dot loader

**Example:**
```tsx
import { LoadingSpinner, LoadingOverlay, LoadingDots } from '@/components/ui';

<LoadingSpinner size="lg" color="navy" />

<LoadingOverlay message="Processing your request..." />

<LoadingDots />
```

### Skeleton Loaders

Content placeholder components for loading states.

**Skeleton:**
- `variant`: 'text' | 'circular' | 'rectangular' (default: 'rectangular')
- `width`: string | number (optional)
- `height`: string | number (optional)
- `animation`: 'pulse' | 'wave' | 'none' (default: 'pulse')

**Pre-built Skeletons:**
- `SkeletonCard`: Card skeleton with optional image
- `SkeletonList`: List item skeletons
- `SkeletonText`: Text line skeletons

**Example:**
```tsx
import { Skeleton, SkeletonCard, SkeletonList } from '@/components/ui';

<Skeleton variant="rectangular" height={200} />
<Skeleton variant="circular" width={48} height={48} />
<Skeleton variant="text" width="80%" />

<SkeletonCard showImage lines={3} />
<SkeletonList items={5} />
```

## Design Principles

### Mobile-First
All components are designed mobile-first with minimum 44px touch targets for accessibility.

### Smooth Animations
Components use GPU-accelerated animations (transform, opacity) for 60fps performance.

### Accessibility
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus indicators with aurora purple outline
- Screen reader friendly

### Color Contrast
All color combinations meet WCAG AA standards for contrast ratios.

## Customization

Components accept standard HTML attributes and can be customized with additional className props:

```tsx
<Button className="custom-class" onClick={handleClick}>
  Custom Button
</Button>
```

## Testing

Visit `/components-showcase` in development mode to see all components in action with various states and variants.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- React 19+
- TypeScript 5+
- Tailwind CSS 3+
- Radix UI (Dialog primitives)

## License

Part of the Snow Wolf Boy Event Registration System.
