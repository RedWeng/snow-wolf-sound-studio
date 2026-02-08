/**
 * Sessions Grid Section Component
 * 
 * Main section displaying all active sessions in a beautiful grid layout.
 * Each session is displayed as an AAA-quality card with clear information.
 * 
 * Requirements: 2.1, 2.7, 2.8, 15.4, 15.5
 */

'use client';

import { Session } from '@/lib/types/database';

interface SessionsGridSectionProps {
  sessions: Session[];
  onSessionClick: (sessionId: string) => void;
  onAddToCart: (sessionId: string) => void;
  language?: 'zh' | 'en';
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
}

const content = {
  zh: {
    title: '探索適合孩子的課程',
    subtitle: '為孩子打造的主題錄音與創意體驗',
    viewDetails: '查看詳情',
    addToCart: '為孩子報名',
    joinWaitlist: '加入候補',
    available: '名額充足',
    limited: '名額有限',
    full: '已額滿',
    price: 'NT$',
    duration: '分鐘',
    ages: '歲',
    ageRange: '🎯 適合',
    loginToViewAll: '登入查看完整課程',
    loginPrompt: '成為會員，探索更多精彩課程',
    previewBadge: '預覽',
  },
  en: {
    title: 'Explore Sessions for Your Child',
    subtitle: 'Themed recording and creative experiences for children',
    viewDetails: 'View Details',
    addToCart: 'Register Child',
    joinWaitlist: 'Join Waitlist',
    available: 'Available',
    limited: 'Limited',
    full: 'Full',
    price: 'NT$',
    duration: 'min',
    ages: 'years',
    ageRange: '🎯 Ages',
    loginToViewAll: 'Login to View All Sessions',
    loginPrompt: 'Become a member to explore more exciting sessions',
    previewBadge: 'Preview',
  },
};

function getAvailabilityStatus(capacity: number, registered: number): 'available' | 'limited' | 'full' {
  const remaining = capacity - registered;
  if (remaining === 0) return 'full';
  if (remaining <= 3) return 'limited';
  return 'available';
}

function getAvailabilityBadge(status: 'available' | 'limited' | 'full', language: 'zh' | 'en') {
  const t = content[language];
  const badges = {
    available: {
      text: t.available,
      className: 'bg-semantic-success/10 text-semantic-success border-semantic-success/20',
    },
    limited: {
      text: t.limited,
      className: 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20',
    },
    full: {
      text: t.full,
      className: 'bg-semantic-error/10 text-semantic-error border-semantic-error/20',
    },
  };
  return badges[status];
}

export function SessionsGridSection({
  sessions,
  onSessionClick,
  onAddToCart,
  language = 'zh',
  isAuthenticated = false,
  onLoginClick,
}: SessionsGridSectionProps) {
  const t = content[language];

  // Show only 3 sessions for preview when not authenticated
  const displaySessions = isAuthenticated ? sessions : sessions.slice(0, 3);

  return (
    <section id="sessions" className="py-20 sm:py-32 bg-gradient-to-b from-brand-frost/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading text-brand-navy">
            {t.title}
          </h2>
          <p className="text-lg sm:text-xl text-brand-midnight/80">
            {t.subtitle}
          </p>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displaySessions.map((session, index) => {
            const title = language === 'zh' ? session.title_zh : session.title_en;
            const theme = language === 'zh' ? session.theme_zh : session.theme_en;
            
            // Mock registered count for demo
            const registeredCount = Math.floor(Math.random() * session.capacity);
            const status = getAvailabilityStatus(session.capacity, registeredCount);
            const badge = getAvailabilityBadge(status, language);
            const isFull = status === 'full';

            return (
              <div
                key={session.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-brand-frost"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Preview Badge for non-authenticated users */}
                {!isAuthenticated && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-moon/90 text-brand-navy backdrop-blur-sm border border-accent-moon">
                      {t.previewBadge}
                    </span>
                  </div>
                )}

                {/* Session Image with Gradient Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/80 via-brand-midnight/60 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent z-10" />
                  
                  {/* Placeholder image - replace with actual session.image_url */}
                  <div className="w-full h-full bg-gradient-to-br from-accent-ice to-accent-aurora group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Availability Badge */}
                  {isAuthenticated && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.className} backdrop-blur-sm`}>
                        {badge.text}
                      </span>
                    </div>
                  )}

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-2xl font-heading text-white mb-1">
                      {title}
                    </h3>
                    <p className="text-accent-moon text-sm font-medium">
                      {theme}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Age Range Badge */}
                  {session.age_min && session.age_max && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-aurora/10 border border-accent-aurora/30 rounded-full">
                      <span className="text-sm font-semibold text-brand-navy">
                        {t.ageRange} {session.age_min}-{session.age_max} {t.ages}
                      </span>
                    </div>
                  )}

                  {/* Session Details */}
                  <div className="space-y-2 text-sm text-brand-midnight/70">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span>
                        {new Date(session.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}
                        {session.day_of_week && ` (${session.day_of_week})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⏰</span>
                      <span>
                        {session.time}
                        {session.duration_minutes && (() => {
                          const [hours, minutes] = session.time.split(':').map(Number);
                          const endMinutes = hours * 60 + minutes + session.duration_minutes;
                          const endHours = Math.floor(endMinutes / 60);
                          const endMins = endMinutes % 60;
                          return `-${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
                        })()}
                        {' '}({session.duration_minutes} {t.duration})
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-brand-frost">
                    <div className="text-3xl font-bold text-brand-navy">
                      {t.price}{session.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isAuthenticated ? (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => onSessionClick(session.id)}
                        className="flex-1 px-4 py-2.5 border-2 border-brand-navy text-brand-navy rounded-lg font-semibold hover:bg-brand-navy hover:text-white transition-colors duration-200 min-h-[44px]"
                      >
                        {t.viewDetails}
                      </button>
                      <button
                        onClick={() => onAddToCart(session.id)}
                        disabled={isFull}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 min-h-[44px] ${
                          isFull
                            ? 'bg-semantic-warning text-white hover:bg-semantic-warning/90'
                            : 'bg-brand-navy text-white hover:bg-brand-midnight hover:shadow-lg'
                        }`}
                      >
                        {isFull ? t.joinWaitlist : t.addToCart}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={onLoginClick}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-brand-navy to-brand-midnight text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 min-h-[44px]"
                    >
                      {t.viewDetails}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Login CTA for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-brand-navy/5 to-accent-aurora/5 rounded-2xl p-12 border-2 border-brand-frost">
              <h3 className="text-3xl font-heading text-brand-navy mb-4">
                {t.loginPrompt}
              </h3>
              <p className="text-lg text-brand-midnight/70 mb-8">
                {language === 'zh' 
                  ? '還有更多精彩課程等著您！立即登入，為孩子找到最適合的學習體驗。'
                  : 'More exciting sessions await! Login now to find the perfect learning experience for your child.'}
              </p>
              <button
                onClick={onLoginClick}
                className="px-8 py-4 bg-gradient-to-r from-brand-navy to-brand-midnight text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 min-h-[44px]"
              >
                {t.loginToViewAll}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
