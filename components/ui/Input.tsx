import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Input component with validation states and accessibility features
 * Supports labels, error messages, and helper text
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${React.useId()}`;

    // Base input styles
    const baseStyles =
      'px-4 py-3 rounded-lg border-2 transition-all duration-base ease-smooth focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]';

    // State styles
    const stateStyles = error
      ? 'border-semantic-error focus:border-semantic-error focus:ring-2 focus:ring-semantic-error/20'
      : 'border-brand-frost focus:border-accent-aurora focus:ring-2 focus:ring-accent-aurora/20';

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${stateStyles} ${widthStyles} ${className}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-body-sm font-medium text-brand-navy mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={combinedClassName}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-body-sm text-semantic-error">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-2 text-body-sm text-brand-slate">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

/**
 * Textarea component with validation states and accessibility features
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      className = '',
      id,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const textareaId = id || `textarea-${React.useId()}`;

    // Base textarea styles
    const baseStyles =
      'px-4 py-3 rounded-lg border-2 transition-all duration-base ease-smooth focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-vertical';

    // State styles
    const stateStyles = error
      ? 'border-semantic-error focus:border-semantic-error focus:ring-2 focus:ring-semantic-error/20'
      : 'border-brand-frost focus:border-accent-aurora focus:ring-2 focus:ring-accent-aurora/20';

    // Width styles
    const widthStyles = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${stateStyles} ${widthStyles} ${className}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-body-sm font-medium text-brand-navy mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={combinedClassName}
          disabled={disabled}
          rows={rows}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-2 text-body-sm text-semantic-error">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-2 text-body-sm text-brand-slate">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
