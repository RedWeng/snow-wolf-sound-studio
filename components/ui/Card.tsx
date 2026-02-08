import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient-navy' | 'gradient-midnight' | 'gradient-aurora' | 'glass';
  hover?: boolean;
  children: React.ReactNode;
}

/**
 * Card component with gradient backgrounds and glass morphism effects
 * Supports hover animations for interactive cards
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = false, className = '', children, ...props }, ref) => {
    // Base styles
    const baseStyles = 'rounded-lg transition-all duration-base ease-smooth';

    // Variant styles
    const variantStyles = {
      default: 'bg-white shadow-md',
      'gradient-navy':
        'bg-gradient-to-br from-brand-navy to-brand-midnight text-brand-snow shadow-lg',
      'gradient-midnight':
        'bg-gradient-to-br from-brand-midnight to-brand-slate text-brand-snow shadow-lg',
      'gradient-aurora':
        'bg-gradient-to-br from-accent-aurora via-accent-ice to-accent-moon text-brand-navy shadow-lg',
      glass:
        'bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-brand-snow',
    };

    // Hover styles
    const hoverStyles = hover
      ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer active:translate-y-0'
      : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`px-6 pb-6 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-6 pb-6 pt-4 border-t border-gray-200 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
