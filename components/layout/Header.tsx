'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export interface HeaderProps {
  /**
   * Current user information (null if not logged in)
   */
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
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
  /**
   * Callback when logout button is clicked
   */
  onLogout?: () => void;
}

/**
 * Header component with responsive navigation
 * Features:
 * - Responsive header with logo and navigation links
 * - Mobile hamburger menu
 * - Language switcher (Traditional Chinese / English)
 * - Login/logout button with user avatar
 * - 44px minimum touch targets for mobile
 * 
 * Requirements: 1.1, 2.5, 15.5, 16.2
 */
export const Header: React.FC<HeaderProps> = ({
  user = null,
  language = 'zh',
  onLanguageChange,
  onLogin,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Translation strings
  const t = {
    zh: {
      home: '首頁',
      sessions: '活動課程',
      about: '關於我們',
      contact: '聯絡我們',
      login: '登入',
      logout: '登出',
      dashboard: '我的帳戶',
      cart: '報名清單',
      language: 'English',
    },
    en: {
      home: 'Home',
      sessions: 'Sessions',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout',
      dashboard: 'Dashboard',
      cart: 'Registration List',
      language: '中文',
    },
  };

  const translations = t[language];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    onLanguageChange?.(newLanguage);
  };

  const handleLoginClick = () => {
    onLogin?.();
  };

  const handleLogoutClick = () => {
    onLogout?.();
    setMobileMenuOpen(false);
  };

  // Navigation links
  const navLinks = [
    { href: '/', label: translations.home },
    { href: '/sessions', label: translations.sessions },
    { href: '/badges', label: language === 'zh' ? '徽章收藏' : 'Badges' },
    { href: '/about', label: translations.about },
    { href: '/contact', label: translations.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-snow/95 backdrop-blur-md border-b border-brand-frost shadow-sm">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded-lg"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-navy-frost rounded-full flex items-center justify-center transition-transform duration-base group-hover:scale-110">
              <span className="text-brand-snow font-heading font-bold text-lg md:text-xl">
                SW
              </span>
            </div>
            <span className="font-heading text-h4 md:text-h3 text-brand-navy hidden sm:block">
              Snow Wolf
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body text-brand-navy hover:text-brand-midnight transition-colors duration-fast font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded px-2 py-1 touch-target"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={handleLanguageToggle}
              className="touch-target px-3 py-2 text-body-sm text-brand-navy hover:text-brand-midnight transition-colors duration-fast font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded-lg"
              aria-label={`Switch to ${language === 'zh' ? 'English' : 'Traditional Chinese'}`}
            >
              {translations.language}
            </button>

            {/* Cart Icon (if logged in) */}
            {user && (
              <Link
                href="/cart"
                className="touch-target relative p-2 text-brand-navy hover:text-brand-midnight transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded-lg flex items-center justify-center"
                aria-label={translations.cart}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>
            )}

            {/* User Menu or Login Button */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-brand-frost transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora touch-target"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-aurora flex items-center justify-center">
                      <span className="text-brand-navy font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-body-sm font-medium text-brand-navy">
                    {user.name}
                  </span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogoutClick}>
                  {translations.logout}
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="md" onClick={handleLoginClick}>
                {translations.login}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden touch-target p-2 text-brand-navy hover:text-brand-midnight transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded-lg"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-brand-frost animate-slide-up">
            <div className="flex flex-col space-y-2">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="touch-target px-4 py-3 text-body text-brand-navy hover:bg-brand-frost rounded-lg transition-colors duration-fast font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora block"
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="h-px bg-brand-frost my-2" />

              {/* User Section */}
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="touch-target flex items-center space-x-3 px-4 py-3 text-body text-brand-navy hover:bg-brand-frost rounded-lg transition-colors duration-fast font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-aurora flex items-center justify-center">
                        <span className="text-brand-navy font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span>{user.name}</span>
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="touch-target px-4 py-3 text-body text-brand-navy hover:bg-brand-frost rounded-lg transition-colors duration-fast font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora block"
                  >
                    {translations.cart}
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="touch-target w-full text-left px-4 py-3 text-body text-brand-navy hover:bg-brand-frost rounded-lg transition-colors duration-fast font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora"
                  >
                    {translations.logout}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="touch-target w-full text-left px-4 py-3 text-body text-brand-navy hover:bg-brand-frost rounded-lg transition-colors duration-fast font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora"
                >
                  {translations.login}
                </button>
              )}

              {/* Language Switcher */}
              <button
                onClick={handleLanguageToggle}
                className="touch-target w-full text-left px-4 py-3 text-body text-brand-navy hover:bg-brand-frost rounded-lg transition-colors duration-fast font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora"
              >
                {translations.language}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
