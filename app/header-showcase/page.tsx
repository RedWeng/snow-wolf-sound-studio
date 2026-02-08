'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';

export default function HeaderShowcase() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const mockUser = isLoggedIn
    ? {
        id: '1',
        name: '張小明',
        email: 'zhang@example.com',
      }
    : null;

  const handleLogin = () => {
    setIsLoggedIn(true);
    alert('Login clicked! (Mock authentication)');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('Logout clicked!');
  };

  const handleLanguageChange = (newLanguage: 'zh' | 'en') => {
    setLanguage(newLanguage);
  };

  return (
    <div className="min-h-screen bg-brand-snow">
      <Header
        user={mockUser}
        language={language}
        onLanguageChange={handleLanguageChange}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 font-heading text-brand-navy mb-6">
            Header Component Showcase
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-h3 font-heading text-brand-navy mb-4">Features</h2>
            <ul className="space-y-3 text-body text-brand-slate">
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>Responsive Design:</strong> Adapts seamlessly from mobile to desktop
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>Mobile Hamburger Menu:</strong> Touch-friendly navigation on small screens
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>Language Switcher:</strong> Toggle between Traditional Chinese and English
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>Authentication States:</strong> Different UI for logged in/out users
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>User Avatar:</strong> Displays user initial or avatar image
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>Shopping Cart Icon:</strong> Quick access to cart (when logged in)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>44px Touch Targets:</strong> All interactive elements meet mobile accessibility standards
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>Sticky Header:</strong> Stays visible while scrolling
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-accent-moon mr-2">✓</span>
                <span>
                  <strong>Backdrop Blur:</strong> Modern glassmorphism effect
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-h3 font-heading text-brand-navy mb-4">Test Controls</h2>
            <div className="space-y-4">
              <div>
                <p className="text-body text-brand-slate mb-2">
                  <strong>Current State:</strong> {isLoggedIn ? 'Logged In' : 'Logged Out'}
                </p>
                <button
                  onClick={() => setIsLoggedIn(!isLoggedIn)}
                  className="px-6 py-3 bg-brand-navy text-brand-snow rounded-lg hover:bg-brand-midnight transition-colors duration-base font-medium"
                >
                  Toggle Login State
                </button>
              </div>

              <div>
                <p className="text-body text-brand-slate mb-2">
                  <strong>Current Language:</strong> {language === 'zh' ? 'Traditional Chinese (中文)' : 'English'}
                </p>
                <button
                  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                  className="px-6 py-3 bg-accent-moon text-brand-navy rounded-lg hover:bg-accent-aurora hover:text-brand-snow transition-colors duration-base font-medium"
                >
                  Toggle Language
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-h3 font-heading text-brand-navy mb-4">Testing Instructions</h2>
            <ol className="space-y-3 text-body text-brand-slate list-decimal list-inside">
              <li>Try resizing your browser window to see responsive behavior</li>
              <li>On mobile/narrow screens, click the hamburger menu icon</li>
              <li>Toggle between logged in and logged out states</li>
              <li>Switch languages using the language button</li>
              <li>When logged in, notice the cart icon and user avatar</li>
              <li>Click on navigation links to see hover effects</li>
              <li>Test keyboard navigation with Tab key</li>
            </ol>
          </div>

          {/* Spacer content to demonstrate sticky header */}
          <div className="mt-12 bg-gradient-navy-frost rounded-lg p-8 text-brand-snow">
            <h2 className="text-h2 font-heading mb-4">Scroll Down</h2>
            <p className="text-body-lg mb-4">
              Scroll down this page to see the sticky header in action. The header will remain visible at the top of the viewport with a subtle backdrop blur effect.
            </p>
            <div className="h-screen flex items-center justify-center">
              <p className="text-h3 font-heading">Keep scrolling...</p>
            </div>
            <div className="h-screen flex items-center justify-center">
              <p className="text-h3 font-heading">Almost there...</p>
            </div>
            <div className="h-screen flex items-center justify-center">
              <p className="text-h3 font-heading">
                Notice how the header stays at the top! 🎉
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
