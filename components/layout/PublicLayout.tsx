'use client';

import React, { Suspense } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoadingOverlay } from '@/components/ui/Loading';

export interface PublicLayoutProps {
  /**
   * Child components to render
   */
  children: React.ReactNode;
  /**
   * Current language preference
   */
  language?: 'zh' | 'en';
  /**
   * Callback when language is changed
   */
  onLanguageChange?: (language: 'zh' | 'en') => void;
  /**
   * Callback when login button is clicked
   */
  onLogin?: () => void;
}

/**
 * PublicLayout for unauthenticated pages
 * Features:
 * - Header with navigation and language switcher
 * - Footer with contact information
 * - Loading states
 * - Error boundaries
 * 
 * Requirements: 1.3, 1.4, 13.2
 */
export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  language = 'zh',
  onLanguageChange,
  onLogin,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-snow">
      <Header
        user={null}
        language={language}
        onLanguageChange={onLanguageChange}
        onLogin={onLogin}
      />
      <main className="flex-1">
        <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>
      </main>
      <Footer language={language} />
    </div>
  );
};
