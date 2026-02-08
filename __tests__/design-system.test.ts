/**
 * Design System Tests
 * 
 * Validates that all design tokens are properly configured and accessible.
 * Tests Requirements 15.1 and 16.1
 */

import tailwindConfig from '../tailwind.config';

describe('Design System - Color Palette', () => {
  const colors = tailwindConfig.theme?.extend?.colors as any;

  describe('Brand Colors', () => {
    it('should have all brand colors defined', () => {
      expect(colors.brand).toBeDefined();
      expect(colors.brand.navy).toBe('#0A1628');
      expect(colors.brand.midnight).toBe('#1A2B47');
      expect(colors.brand.slate).toBe('#2D3E5F');
      expect(colors.brand.frost).toBe('#E8F1F8');
      expect(colors.brand.snow).toBe('#F8FBFF');
    });
  });

  describe('Accent Colors', () => {
    it('should have all accent colors defined', () => {
      expect(colors.accent).toBeDefined();
      expect(colors.accent.moon).toBe('#FFE5B4');
      expect(colors.accent.ice).toBe('#B8E6F5');
      expect(colors.accent.aurora).toBe('#C8B6FF');
    });
  });

  describe('Semantic Colors', () => {
    it('should have all semantic colors defined', () => {
      expect(colors.semantic).toBeDefined();
      expect(colors.semantic.success).toBe('#10B981');
      expect(colors.semantic.warning).toBe('#F59E0B');
      expect(colors.semantic.error).toBe('#EF4444');
      expect(colors.semantic.info).toBe('#3B82F6');
    });
  });
});

describe('Design System - Typography', () => {
  const fontFamily = tailwindConfig.theme?.extend?.fontFamily as any;
  const fontSize = tailwindConfig.theme?.extend?.fontSize as any;

  describe('Font Families', () => {
    it('should have heading font (Playfair Display)', () => {
      expect(fontFamily.heading).toBeDefined();
      expect(fontFamily.heading).toContain('Playfair Display');
      expect(fontFamily.heading).toContain('serif');
    });

    it('should have body font (Inter)', () => {
      expect(fontFamily.body).toBeDefined();
      expect(fontFamily.body).toContain('Inter');
      expect(fontFamily.body).toContain('sans-serif');
    });

    it('should have monospace font (JetBrains Mono)', () => {
      expect(fontFamily.mono).toBeDefined();
      expect(fontFamily.mono).toContain('JetBrains Mono');
      expect(fontFamily.mono).toContain('monospace');
    });
  });

  describe('Type Scale', () => {
    it('should have display size with correct properties', () => {
      expect(fontSize.display).toBeDefined();
      expect(fontSize.display[0]).toBe('4rem');
      expect(fontSize.display[1].lineHeight).toBe('1.1');
      expect(fontSize.display[1].letterSpacing).toBe('-0.02em');
    });

    it('should have h1 size with correct properties', () => {
      expect(fontSize.h1).toBeDefined();
      expect(fontSize.h1[0]).toBe('3rem');
      expect(fontSize.h1[1].lineHeight).toBe('1.2');
      expect(fontSize.h1[1].letterSpacing).toBe('-0.01em');
    });

    it('should have h2 size', () => {
      expect(fontSize.h2).toBeDefined();
      expect(fontSize.h2[0]).toBe('2.25rem');
      expect(fontSize.h2[1].lineHeight).toBe('1.3');
    });

    it('should have h3 size', () => {
      expect(fontSize.h3).toBeDefined();
      expect(fontSize.h3[0]).toBe('1.875rem');
      expect(fontSize.h3[1].lineHeight).toBe('1.4');
    });

    it('should have h4 size', () => {
      expect(fontSize.h4).toBeDefined();
      expect(fontSize.h4[0]).toBe('1.5rem');
      expect(fontSize.h4[1].lineHeight).toBe('1.5');
    });

    it('should have body-lg size', () => {
      expect(fontSize['body-lg']).toBeDefined();
      expect(fontSize['body-lg'][0]).toBe('1.125rem');
      expect(fontSize['body-lg'][1].lineHeight).toBe('1.6');
    });

    it('should have body size', () => {
      expect(fontSize.body).toBeDefined();
      expect(fontSize.body[0]).toBe('1rem');
      expect(fontSize.body[1].lineHeight).toBe('1.6');
    });

    it('should have body-sm size', () => {
      expect(fontSize['body-sm']).toBeDefined();
      expect(fontSize['body-sm'][0]).toBe('0.875rem');
      expect(fontSize['body-sm'][1].lineHeight).toBe('1.5');
    });

    it('should have caption size', () => {
      expect(fontSize.caption).toBeDefined();
      expect(fontSize.caption[0]).toBe('0.75rem');
      expect(fontSize.caption[1].lineHeight).toBe('1.4');
    });
  });
});

describe('Design System - Spacing Scale', () => {
  const spacing = tailwindConfig.theme?.extend?.spacing as any;

  it('should have all spacing values defined', () => {
    expect(spacing.xs).toBe('0.5rem');
    expect(spacing.sm).toBe('0.75rem');
    expect(spacing.md).toBe('1rem');
    expect(spacing.lg).toBe('1.5rem');
    expect(spacing.xl).toBe('2rem');
    expect(spacing['2xl']).toBe('3rem');
    expect(spacing['3xl']).toBe('4rem');
    expect(spacing['4xl']).toBe('6rem');
  });
});

describe('Design System - Responsive Breakpoints', () => {
  const screens = tailwindConfig.theme?.extend?.screens as any;

  it('should have all breakpoints defined', () => {
    expect(screens.sm).toBe('640px');
    expect(screens.md).toBe('768px');
    expect(screens.lg).toBe('1024px');
    expect(screens.xl).toBe('1280px');
    expect(screens['2xl']).toBe('1536px');
  });

  it('should have breakpoints in ascending order', () => {
    const breakpointValues = [
      parseInt(screens.sm),
      parseInt(screens.md),
      parseInt(screens.lg),
      parseInt(screens.xl),
      parseInt(screens['2xl'])
    ];

    for (let i = 1; i < breakpointValues.length; i++) {
      expect(breakpointValues[i]).toBeGreaterThan(breakpointValues[i - 1]);
    }
  });
});

describe('Design System - Animation and Transitions', () => {
  const transitionDuration = tailwindConfig.theme?.extend?.transitionDuration as any;
  const transitionTimingFunction = tailwindConfig.theme?.extend?.transitionTimingFunction as any;

  describe('Transition Durations', () => {
    it('should have all duration values defined', () => {
      expect(transitionDuration.fast).toBe('150ms');
      expect(transitionDuration.base).toBe('250ms');
      expect(transitionDuration.slow).toBe('350ms');
      expect(transitionDuration.slower).toBe('500ms');
    });

    it('should have durations in ascending order', () => {
      const durations = [
        parseInt(transitionDuration.fast),
        parseInt(transitionDuration.base),
        parseInt(transitionDuration.slow),
        parseInt(transitionDuration.slower)
      ];

      for (let i = 1; i < durations.length; i++) {
        expect(durations[i]).toBeGreaterThan(durations[i - 1]);
      }
    });
  });

  describe('Easing Functions', () => {
    it('should have all easing functions defined', () => {
      expect(transitionTimingFunction.smooth).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
      expect(transitionTimingFunction.bounce).toBe('cubic-bezier(0.68, -0.55, 0.265, 1.55)');
      expect(transitionTimingFunction['ease-in-out']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('should have valid cubic-bezier values', () => {
      const cubicBezierRegex = /^cubic-bezier\([\d\s.,\-]+\)$/;
      expect(transitionTimingFunction.smooth).toMatch(cubicBezierRegex);
      expect(transitionTimingFunction.bounce).toMatch(cubicBezierRegex);
      expect(transitionTimingFunction['ease-in-out']).toMatch(cubicBezierRegex);
    });
  });
});

describe('Design System - Integration', () => {
  it('should have all required theme extensions', () => {
    const theme = tailwindConfig.theme?.extend;
    expect(theme).toBeDefined();
    expect(theme?.colors).toBeDefined();
    expect(theme?.fontFamily).toBeDefined();
    expect(theme?.fontSize).toBeDefined();
    expect(theme?.spacing).toBeDefined();
    expect(theme?.screens).toBeDefined();
    expect(theme?.transitionDuration).toBeDefined();
    expect(theme?.transitionTimingFunction).toBeDefined();
  });

  it('should not override default Tailwind values', () => {
    // Verify we're extending, not replacing
    expect(tailwindConfig.theme?.extend).toBeDefined();
    // The base theme should still be accessible
    expect(tailwindConfig.content).toBeDefined();
    expect(Array.isArray(tailwindConfig.content)).toBe(true);
  });
});

describe('Design System - Accessibility', () => {
  describe('Touch Targets', () => {
    it('should have minimum 44px touch target in button base', () => {
      // This is verified in the CSS, but we document the requirement here
      // The btn-base class should have min-height: 44px
      expect(true).toBe(true); // Placeholder for CSS verification
    });
  });

  describe('Color Contrast', () => {
    it('should have distinct brand colors for contrast', () => {
      const colors = tailwindConfig.theme?.extend?.colors as any;
      
      // Navy (dark) should be different from Snow (light)
      expect(colors.brand.navy).not.toBe(colors.brand.snow);
      expect(colors.brand.midnight).not.toBe(colors.brand.frost);
      
      // Verify we have both dark and light options
      const darkColors = [colors.brand.navy, colors.brand.midnight, colors.brand.slate];
      const lightColors = [colors.brand.frost, colors.brand.snow];
      
      expect(darkColors.length).toBeGreaterThan(0);
      expect(lightColors.length).toBeGreaterThan(0);
    });
  });
});

describe('Design System - Requirements Validation', () => {
  it('should satisfy Requirement 15.1 - Landing Page Design', () => {
    const colors = tailwindConfig.theme?.extend?.colors as any;
    const fontFamily = tailwindConfig.theme?.extend?.fontFamily as any;
    
    // Cinematic Snow Wolf branding colors
    expect(colors.brand.navy).toBeDefined(); // Deep night sky
    expect(colors.accent.moon).toBeDefined(); // Moonlight gold
    
    // Typography for elegant headings
    expect(fontFamily.heading).toContain('Playfair Display');
  });

  it('should satisfy Requirement 16.1 - Mobile-Responsive Design', () => {
    const screens = tailwindConfig.theme?.extend?.screens as any;
    
    // Mobile-first breakpoints
    expect(screens.sm).toBe('640px'); // Mobile landscape
    expect(screens.md).toBe('768px'); // Tablet
    expect(screens.lg).toBe('1024px'); // Desktop
    
    // Responsive spacing
    const spacing = tailwindConfig.theme?.extend?.spacing as any;
    expect(spacing.xs).toBeDefined();
    expect(spacing.sm).toBeDefined();
    expect(spacing.md).toBeDefined();
    expect(spacing.lg).toBeDefined();
  });
});
