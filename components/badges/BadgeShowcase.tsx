/**
 * Badge Showcase Component
 * 
 * 徽章展示區 - 在儀表板顯示最近獲得的徽章
 */

'use client';

import Link from 'next/link';
import { getAllBadges } from '@/lib/config/badges';
import { Button } from '@/components/ui';

interface BadgeShowcaseProps {
  earnedBadgeIds: string[];
  language?: 'zh' | 'en';
}

const content = {
  zh: {
    title: '我的徽章',
    viewAll: '查看全部',
    noBadges: '還沒有獲得任何徽章',
    startJourney: '參加課程開始收集徽章！',
    recent: '最近獲得',
  },
  en: {
    title: 'My Badges',
    viewAll: 'View All',
    noBadges: 'No badges earned yet',
    startJourney: 'Attend sessions to start collecting badges!',
    recent: 'Recently Earned',
  },
};

export function BadgeShowcase({ earnedBadgeIds, language = 'zh' }: BadgeShowcaseProps) {
  const t = content[language];
  const allBadges = getAllBadges();
  
  // 獲取已獲得的徽章（最多顯示 4 個）
  const earnedBadges = allBadges
    .filter(badge => earnedBadgeIds.includes(badge.id))
    .slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-brand-steel/20 to-brand-steel/10 border-2 border-accent-moon/30 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading text-brand-snow flex items-center gap-2">
          <svg className="w-6 h-6 text-accent-moon" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {t.title}
        </h2>
        <Link href="/badges">
          <Button variant="secondary" size="sm">
            {t.viewAll}
          </Button>
        </Link>
      </div>

      {/* Badge Display */}
      {earnedBadges.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="group relative"
            >
              {/* Badge Image */}
              <div className="relative aspect-square bg-brand-midnight/50 rounded-lg p-2 border-2 border-accent-moon/50 hover:border-accent-moon transition-all hover:scale-105">
                <img
                  src={badge.image_url}
                  alt={language === 'zh' ? badge.name_zh : badge.name_en}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-brand-midnight border-2 border-accent-moon/50 rounded-lg px-3 py-2 whitespace-nowrap">
                  <p className="text-sm font-medium text-brand-snow">
                    {language === 'zh' ? badge.name_zh : badge.name_en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 opacity-30">
            <svg fill="currentColor" viewBox="0 0 20 20" className="text-brand-frost">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <p className="text-brand-frost/60 mb-2">{t.noBadges}</p>
          <p className="text-sm text-brand-frost/40">{t.startJourney}</p>
        </div>
      )}

      {/* Progress Bar */}
      {earnedBadges.length > 0 && (
        <div className="mt-6 pt-4 border-t border-brand-frost/20">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-brand-frost/60">收藏進度</span>
            <span className="text-accent-moon font-bold">
              {earnedBadgeIds.length} / {allBadges.length}
            </span>
          </div>
          <div className="w-full bg-brand-midnight/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-accent-moon to-accent-ice h-2 rounded-full transition-all duration-500"
              style={{ width: `${(earnedBadgeIds.length / allBadges.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
