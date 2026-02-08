/**
 * Badge Card Component
 * 
 * 徽章卡片 - 顯示單個徽章（已獲得/未獲得狀態）
 */

'use client';

import { Badge, getBadgeRarityColor, getBadgeRarityGlow } from '@/lib/config/badges';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
  language?: 'zh' | 'en';
  onClick?: () => void;
}

export function BadgeCard({ badge, earned, language = 'zh', onClick }: BadgeCardProps) {
  const name = language === 'zh' ? badge.name_zh : badge.name_en;
  const description = language === 'zh' ? badge.description_zh : badge.description_en;
  const rarityColor = getBadgeRarityColor(badge.rarity);
  const rarityGlow = getBadgeRarityGlow(badge.rarity);

  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer
        bg-gradient-to-br from-brand-steel/20 to-brand-steel/10
        border-2 rounded-xl p-4
        transition-all duration-300
        ${earned 
          ? `${rarityColor} hover:scale-105 hover:${rarityGlow} shadow-lg` 
          : 'border-gray-600 opacity-40 hover:opacity-60'
        }
      `}
    >
      {/* 徽章圖片 */}
      <div className="relative w-full aspect-square mb-3">
        <img
          src={badge.image_url}
          alt={name}
          className={`
            w-full h-full object-contain
            transition-all duration-300
            ${earned ? 'filter-none' : 'filter grayscale'}
            ${earned ? 'group-hover:scale-110' : ''}
          `}
        />
        
        {/* 未獲得遮罩 */}
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}
      </div>

      {/* 徽章名稱 */}
      <h3 className={`
        text-center font-heading text-lg mb-2
        ${earned ? 'text-brand-snow' : 'text-gray-500'}
      `}>
        {name}
      </h3>

      {/* 徽章描述 */}
      <p className={`
        text-center text-sm
        ${earned ? 'text-brand-frost/80' : 'text-gray-600'}
      `}>
        {earned ? description : (language === 'zh' ? '待解鎖' : 'Locked')}
      </p>

      {/* 稀有度標籤 */}
      <div className={`
        mt-3 text-center text-xs font-bold uppercase tracking-wider
        ${earned ? rarityColor : 'text-gray-600'}
      `}>
        {badge.rarity}
      </div>
    </div>
  );
}
