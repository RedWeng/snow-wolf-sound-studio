/**
 * Hero Section Component
 * 
 * Full-viewport hero section with cinematic Snow Wolf branding,
 * gradient background, and prominent call-to-action.
 * 
 * Requirements: 15.1, 15.2, 16.1
 */

'use client';

import { Button } from '@/components/ui';

interface HeroSectionProps {
  onBrowseSessions: () => void;
  language?: 'zh' | 'en';
}

const content = {
  zh: {
    year: '2026',
    title: 'Recording Party · Animation Edition',
    subtitle: '錄音派對 3.0｜動畫版',
    description: '專為孩子打造的主題錄音與創意體驗',
    cta: '瀏覽課程',
    tagline: '3秒理解 · 30秒下單 · 3分鐘完成',
  },
  en: {
    year: '2026',
    title: 'Recording Party · Animation Edition',
    subtitle: 'Recording Party 3.0 | Animation Edition',
    description: 'Themed recording and creative experiences for children',
    cta: 'Browse Sessions',
    tagline: '3 seconds to understand · 30 seconds to order · 3 minutes to complete',
  },
};

export function HeroSection({ onBrowseSessions, language = 'zh' }: HeroSectionProps) {
  const t = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* HERO Background Image */}
      <img 
        src="/image2/課程資訊HERO圖.png"
        alt="Recording Party Hero"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Year Badge */}
        <div className="animate-fade-in">
          <span className="inline-block px-6 py-2 bg-accent-moon/20 border-2 border-accent-moon/50 rounded-full text-accent-moon text-lg sm:text-xl font-bold backdrop-blur-sm">
            {t.year}
          </span>
        </div>

        {/* Title */}
        <div className="space-y-4 animate-fade-in delay-200">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-brand-snow tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-heading text-accent-moon">
            {t.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xl sm:text-2xl text-brand-frost/90 max-w-2xl mx-auto animate-fade-in delay-300">
          {t.description}
        </p>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-accent-ice font-medium animate-fade-in delay-400">
          {t.tagline}
        </p>

        {/* CTA Button */}
        <div className="pt-4 animate-fade-in delay-500">
          <Button
            size="lg"
            onClick={onBrowseSessions}
            className="text-lg px-8 py-6 shadow-2xl hover:shadow-accent-moon/50 transition-all duration-300 hover:scale-105"
          >
            {t.cta}
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-brand-frost/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-brand-frost/50 rounded-full animate-scroll" />
          </div>
        </div>
      </div>
    </section>
  );
}
