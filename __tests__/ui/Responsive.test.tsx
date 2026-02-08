import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, Input, Card, Modal } from '@/components/ui';

/**
 * Responsive Behavior Tests
 * Tests Requirements 16.1, 16.2, 16.3
 * 
 * These tests verify that UI components have proper responsive classes
 * and mobile-friendly attributes.
 */

describe('Responsive Behavior', () => {
  describe('Touch Targets (Requirement 16.2)', () => {
    it('Button has minimum 44px touch target height', () => {
      render(<Button>Touch Me</Button>);
      const button = screen.getByRole('button', { name: /touch me/i });
      expect(button).toHaveClass('min-h-[44px]');
    });

    it('Input has minimum 44px touch target height', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).toHaveClass('min-h-[44px]');
    });

    it('Button with small size still meets minimum touch target', () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button', { name: /small button/i });
      expect(button).toHaveClass('min-h-[44px]');
    });
  });

  describe('Mobile-Optimized Layout (Requirement 16.1)', () => {
    it('Modal uses responsive width (90vw on mobile)', () => {
      const { container } = render(
        <Modal open={true} onOpenChange={() => {}} title="Test Modal">
          <p>Content</p>
        </Modal>
      );
      const content = container.querySelector('.w-\\[90vw\\]');
      expect(content).toBeInTheDocument();
    });

    it('Modal has max-height for mobile viewports', () => {
      const { container } = render(
        <Modal open={true} onOpenChange={() => {}} title="Test Modal">
          <p>Content</p>
        </Modal>
      );
      const content = container.querySelector('.max-h-\\[85vh\\]');
      expect(content).toBeInTheDocument();
    });

    it('Card component is responsive', () => {
      const { container } = render(
        <Card>
          <p>Card content</p>
        </Card>
      );
      const card = container.firstChild;
      // Card should have responsive padding
      expect(card).toHaveClass('p-6');
    });
  });

  describe('Full Width Support (Requirement 16.3)', () => {
    it('Button supports full width on mobile', () => {
      render(<Button fullWidth>Full Width Button</Button>);
      const button = screen.getByRole('button', { name: /full width button/i });
      expect(button).toHaveClass('w-full');
    });

    it('Input supports full width', () => {
      render(<Input fullWidth placeholder="Full width input" />);
      const input = screen.getByPlaceholderText(/full width input/i);
      expect(input).toHaveClass('w-full');
    });
  });

  describe('Responsive Typography', () => {
    it('Button text is readable without zooming', () => {
      render(<Button>Readable Text</Button>);
      const button = screen.getByRole('button', { name: /readable text/i });
      // Button should have appropriate text size class
      expect(button).toHaveClass('text-body');
    });
  });

  describe('Responsive Spacing', () => {
    it('Button has appropriate padding for touch', () => {
      render(<Button size="md">Medium Button</Button>);
      const button = screen.getByRole('button', { name: /medium button/i });
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
    });

    it('Input has appropriate padding', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-3');
    });
  });

  describe('Overflow Handling', () => {
    it('Modal content is scrollable when it exceeds viewport', () => {
      const { container } = render(
        <Modal open={true} onOpenChange={() => {}} title="Test">
          <p>Content</p>
        </Modal>
      );
      const content = container.querySelector('.overflow-y-auto');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Focus Indicators (Accessibility)', () => {
    it('Button has focus-visible styles', () => {
      render(<Button>Focus Me</Button>);
      const button = screen.getByRole('button', { name: /focus me/i });
      expect(button).toHaveClass('focus-visible:ring-2');
    });

    it('Input has focus-visible styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Responsive Animations', () => {
    it('Modal has scale-in animation', () => {
      const { container } = render(
        <Modal open={true} onOpenChange={() => {}} title="Test">
          <p>Content</p>
        </Modal>
      );
      const content = container.querySelector('.animate-scale-in');
      expect(content).toBeInTheDocument();
    });

    it('Button has transition classes', () => {
      render(<Button>Animated Button</Button>);
      const button = screen.getByRole('button', { name: /animated button/i });
      expect(button).toHaveClass('transition-all');
    });
  });

  describe('Mobile-Friendly Interactions', () => {
    it('Button has rounded corners for better touch feedback', () => {
      render(<Button>Rounded Button</Button>);
      const button = screen.getByRole('button', { name: /rounded button/i });
      expect(button).toHaveClass('rounded-lg');
    });

    it('Input has rounded corners', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('rounded-lg');
    });

    it('Modal has rounded corners', () => {
      const { container } = render(
        <Modal open={true} onOpenChange={() => {}} title="Test">
          <p>Content</p>
        </Modal>
      );
      const content = container.querySelector('.rounded-lg');
      expect(content).toBeInTheDocument();
    });
  });
});
