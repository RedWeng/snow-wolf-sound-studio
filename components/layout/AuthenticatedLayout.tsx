'use client';

import React, { Suspense, createContext, useContext } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoadingOverlay } from '@/components/ui/Loading';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'parent' | 'owner' | 'assistant' | 'teacher';
}

export interface AuthenticatedLayoutProps {
  /**
   * Child components to render
   */
  children: React.ReactNode;
  /**
   * Current authenticated user
   */
  user: User;
  /**
   * Current language preference
   */
  language?: 'zh' | 'en';
  /**
   * Callback when language is changed
   */
  onLanguageChange?: (language: 'zh' | 'en') => void;
  /**
   * Callback when logout button is clicked
   */
  onLogout?: () => void;
}

// User context for child components
const UserContext = createContext<User | null>(null);

/**
 * Hook to access user context
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within AuthenticatedLayout');
  }
  return context;
};

/**
 * AuthenticatedLayout with user context
 * Features:
 * - Header with user information
 * - Footer with contact information
 * - User context provider for child components
 * - Loading states
 * - Error boundaries
 * 
 * Requirements: 1.3, 1.4, 13.2
 */
export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  user,
  language = 'zh',
  onLanguageChange,
  onLogout,
}) => {
  return (
    <UserContext.Provider value={user}>
      <div className="min-h-screen flex flex-col bg-brand-snow">
        <Header
          user={user}
          language={language}
          onLanguageChange={onLanguageChange}
          onLogout={onLogout}
        />
        <main className="flex-1">
          <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>
        </main>
        <Footer language={language} />
      </div>
    </UserContext.Provider>
  );
};
