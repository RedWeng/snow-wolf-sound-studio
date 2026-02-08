import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Button component with multiple variants and sizes
 * Ensures AAA-grade quality with smooth animations and mobile-friendly touch targets
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles - minimum 44px touch target for mobile
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-base ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles = {
      primary:
        'bg-brand-navy text-brand-snow hover:bg-brand-midnight active:scale-95 shadow-md hover:shadow-lg',
      secondary:
        'bg-accent-moon text-brand-navy hover:bg-accent-aurora hover:text-brand-snow active:scale-95 shadow-md hover:shadow-lg',
      ghost:
        'bg-transparent border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-brand-snow active:scale-95',
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-4 py-2 text-body-sm min-h-[36px]',
      md: 'px-6 py-3 text-body min-h-[44px]',
      lg: 'px-8 py-4 text-body-lg min-h-[52px]',
    };

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
