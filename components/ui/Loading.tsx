import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'navy' | 'moon' | 'white';
  className?: string;
}

/**
 * Loading spinner component with multiple sizes and colors
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'navy',
  className = '',
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // Color styles
  const colorStyles = {
    navy: 'text-brand-navy',
    moon: 'text-accent-moon',
    white: 'text-white',
  };

  return (
    <svg
      className={`animate-spin ${sizeStyles[size]} ${colorStyles[color]} ${className}`}
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
  );
};

export interface LoadingOverlayProps {
  message?: string;
}

/**
 * Full-screen loading overlay
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
        <LoadingSpinner size="lg" color="navy" />
        <p className="text-body text-brand-navy">{message}</p>
      </div>
    </div>
  );
};

export interface LoadingDotsProps {
  className?: string;
}

/**
 * Animated loading dots
 */
export const LoadingDots: React.FC<LoadingDotsProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="w-2 h-2 bg-brand-navy rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-brand-navy rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-brand-navy rounded-full animate-bounce"></div>
    </div>
  );
};
