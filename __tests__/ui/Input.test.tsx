import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input, Textarea } from '@/components/ui';

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('renders input correctly', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Name" placeholder="Enter name" />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByText(/name/i)).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<Input helperText="This is helper text" />);
      expect(screen.getByText(/this is helper text/i)).toBeInTheDocument();
    });
  });

  describe('Validation States', () => {
    it('displays error message', () => {
      render(<Input error="This field is required" />);
      const errorMessage = screen.getByText(/this field is required/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass('text-semantic-error');
    });

    it('applies error styles when error prop is provided', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-semantic-error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('hides helper text when error is shown', () => {
      render(<Input error="Error message" helperText="Helper text" />);
      expect(screen.getByText(/error message/i)).toBeInTheDocument();
      expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('can be disabled', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Layout', () => {
    it('renders full width when fullWidth prop is true', () => {
      render(<Input fullWidth />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('w-full');
    });
  });

  describe('Accessibility', () => {
    it('has minimum touch target height', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('min-h-[44px]');
    });

    it('associates label with input using htmlFor', () => {
      render(<Input label="Email" />);
      const label = screen.getByText(/email/i);
      const input = screen.getByLabelText(/email/i);
      expect(label).toHaveAttribute('for', input.id);
    });

    it('uses aria-describedby for error messages', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText(/error message/i)).toHaveAttribute('id', errorId!);
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });
});

describe('Textarea Component', () => {
  describe('Basic Rendering', () => {
    it('renders textarea correctly', () => {
      render(<Textarea placeholder="Enter message" />);
      const textarea = screen.getByPlaceholderText(/enter message/i);
      expect(textarea).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Textarea label="Message" />);
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('respects rows prop', () => {
      render(<Textarea rows={6} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '6');
    });
  });

  describe('Validation States', () => {
    it('displays error message', () => {
      render(<Textarea error="Message is required" />);
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });

    it('applies error styles', () => {
      render(<Textarea error="Error" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-semantic-error');
    });
  });

  describe('Interactions', () => {
    it('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'test message' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('can be disabled', () => {
      render(<Textarea disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });
});
