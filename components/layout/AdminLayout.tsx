'use client';

import React, { Suspense, createContext, useContext, useState } from 'react';
import Link from 'next/link';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoadingOverlay } from '@/components/ui/Loading';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'assistant' | 'teacher';
}

export interface AdminLayoutProps {
  /**
   * Child components to render
   */
  children: React.ReactNode;
  /**
   * Current authenticated admin user
   */
  user: AdminUser;
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

// Admin user context for child components
const AdminUserContext = createContext<AdminUser | null>(null);

/**
 * Hook to access admin user context
 */
export const useAdminUser = () => {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error('useAdminUser must be used within AdminLayout');
  }
  return context;
};

/**
 * AdminLayout with role-based navigation
 * Features:
 * - Header with admin user information
 * - Sidebar navigation with role-based access
 * - Footer with contact information
 * - Admin user context provider for child components
 * - Loading states
 * - Error boundaries
 * 
 * Requirements: 1.3, 1.4, 13.2
 */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  user,
  language = 'zh',
  onLanguageChange,
  onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Translation strings
  const t = {
    zh: {
      dashboard: '儀表板',
      sessions: '課程管理',
      orders: '訂單管理',
      waitlist: '候補名單',
      users: '用戶管理',
      settings: '系統設定',
      backToSite: '返回網站',
      toggleSidebar: '切換側邊欄',
    },
    en: {
      dashboard: 'Dashboard',
      sessions: 'Sessions',
      orders: 'Orders',
      waitlist: 'Waitlist',
      users: 'Users',
      settings: 'Settings',
      backToSite: 'Back to Site',
      toggleSidebar: 'Toggle Sidebar',
    },
  };

  const translations = t[language];

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      {
        href: '/admin/dashboard',
        label: translations.dashboard,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        ),
        roles: ['owner', 'assistant', 'teacher'],
      },
      {
        href: '/admin/sessions',
        label: translations.sessions,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
        roles: ['owner', 'assistant', 'teacher'],
      },
      {
        href: '/admin/orders',
        label: translations.orders,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        ),
        roles: ['owner', 'assistant'],
      },
      {
        href: '/admin/waitlist',
        label: translations.waitlist,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        roles: ['owner', 'assistant'],
      },
      {
        href: '/admin/users',
        label: translations.users,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
        roles: ['owner'],
      },
      {
        href: '/admin/settings',
        label: translations.settings,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
        roles: ['owner'],
      },
    ];

    // Filter based on user role
    return baseItems.filter((item) => item.roles.includes(user.role));
  };

  const navItems = getNavItems();

  return (
    <AdminUserContext.Provider value={user}>
      <div className="min-h-screen flex flex-col bg-brand-snow">
        <Header
          user={user}
          language={language}
          onLanguageChange={onLanguageChange}
          onLogout={onLogout}
        />
        <div className="flex-1 flex">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'w-64' : 'w-20'
            } bg-brand-navy border-r border-brand-midnight transition-all duration-base hidden lg:block`}
          >
            <div className="p-4">
              {/* Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full mb-4 p-2 text-brand-frost hover:text-brand-snow hover:bg-brand-midnight rounded-lg transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora"
                aria-label={translations.toggleSidebar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 mx-auto transition-transform duration-base ${
                    sidebarOpen ? '' : 'rotate-180'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-brand-frost hover:text-brand-snow hover:bg-brand-midnight rounded-lg transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora"
                  >
                    {item.icon}
                    {sidebarOpen && (
                      <span className="text-body font-medium">
                        {item.label}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Back to Site Link */}
              <div className="mt-8 pt-8 border-t border-brand-midnight">
                <Link
                  href="/"
                  className="flex items-center space-x-3 px-3 py-2 text-brand-frost hover:text-brand-snow hover:bg-brand-midnight rounded-lg transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  {sidebarOpen && (
                    <span className="text-body font-medium">
                      {translations.backToSite}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Suspense fallback={<LoadingOverlay />}>{children}</Suspense>
          </main>
        </div>
        <Footer language={language} />
      </div>
    </AdminUserContext.Provider>
  );
};
