/**
 * Language Context
 * 
 * Manages language preference with localStorage persistence.
 * Supports Chinese (zh) and English (en).
 * 
 * Requirements: 2.5, 15.7
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'snow-wolf-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'zh' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch (error) {
      console.error('Failed to load language from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      } catch (error) {
        console.error('Failed to save language to localStorage:', error);
      }
    }
  }, [language, isInitialized]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'zh' ? 'en' : 'zh'));
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
