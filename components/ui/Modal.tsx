'use client';

import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

/**
 * Modal/Dialog component built on Radix UI primitives
 * Provides accessible modal dialogs with smooth animations
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm animate-fade-in z-40" />

        {/* Content */}
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 w-[90vw] ${sizeStyles[size]} max-h-[85vh] overflow-y-auto animate-scale-in z-50 focus:outline-none`}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {title && (
                  <Dialog.Title className="text-h3 text-brand-navy font-heading">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-body text-brand-slate mt-2">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showClose && (
                <Dialog.Close className="ml-4 p-2 rounded-lg hover:bg-brand-frost transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-slate"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              )}
            </div>
          )}

          {/* Body */}
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal footer component for action buttons
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-frost ${className}`}>
      {children}
    </div>
  );
};
