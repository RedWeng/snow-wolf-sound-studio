/**
 * Family Badge Vault Component
 * 
 * 家庭徽章庫 - 展示全家人的徽章收藏
 */

'use client';

import { useState } from 'react';
import { getAllBadges } from '@/lib/config/badges';
import { BadgeCard } from './BadgeCard';

interface ChildBadges {
  childId: string;
  childName: string;
  earnedBadgeIds: string[];
}

interface FamilyBadgeVaultProps {
  familyBadges: ChildBadges[];
  language?: 'zh' | 'en';
}

const content = {
  zh: {
    title: '家庭徽章庫',
    subtitle: '全家一起收集，共同成長',
    totalBadges: '家庭總徽章',
    childrenCount: '位孩子',
    viewBy: '查看方式',
    viewAll: '全部徽章',
    viewByChild: '依孩子分類',
    noChild: '尚未添加孩子',
    addChild: '新增孩子資料',
  },
  en: {
    title: 'Family Badge Vault',
    subtitle: 'Collect together, grow together',
    totalBadges: 'Total Family Badges',
    childrenCount: 'Children',
    viewBy: 'View By',
    viewAll: 'All Badges',
    viewByChild: 'By Child',
    noChild: 'No children added yet',
    addChild: 'Add Child Profile',
  },
};

export function FamilyBadgeVault({ familyBadges, language = 'zh' }: FamilyBadgeVaultProps) {
  const t = content[language];
  const [viewMode, setViewMode] = useState<'all' | 'by-child'>('all');
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  
  const allBadges = getAllBadges();
  
  // 計算家庭總徽章數（每個孩子的徽章都計入，不去重）
  const totalFamilyBadges = familyBadges.reduce((total, child) => {
    return total + child.earnedBadgeIds.length;
  }, 0);
  
  // 計算每個徽章被獲得的次數（用於顯示重複徽章）
  const badgeCountMap = new Map<string, number>();
  familyBadges.forEach(child => {
    child.earnedBadgeIds.forEach(badgeId => {
      badgeCountMap.set(badgeId, (badgeCountMap.get(badgeId) || 0) + 1);
    });
  });
  
  // 獲取所有已獲得的徽章ID（去重，用於判斷是否獲得）
  const allEarnedBadgeIds = new Set<string>();
  familyBadges.forEach(child => {
    child.earnedBadgeIds.forEach(badgeId => allEarnedBadgeIds.add(badgeId));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-steel/20 to-brand-steel/10 border-2 border-accent-moon/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-heading text-brand-snow mb-2">
              {t.title}
            </h2>
            <p className="text-brand-frost/60">{t.subtitle}</p>
          </div>
          
          {/* Family Stats */}
          <div className="text-right">
            <div className="text-4xl font-bold text-accent-moon">{totalFamilyBadges}</div>
            <div className="text-sm text-brand-frost/60">{t.totalBadges}</div>
            <div className="text-xs text-brand-frost/40 mt-1">
              {familyBadges.length} {t.childrenCount}
            </div>
          </div>
        </div>

        {/* Children Avatars */}
        <div className="flex items-center gap-3 pt-4 border-t border-brand-frost/20">
          {familyBadges.map((child) => (
            <div
              key={child.childId}
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => {
                setViewMode('by-child');
                setSelectedChild(child.childId);
              }}
            >
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                transition-all duration-300
                ${selectedChild === child.childId && viewMode === 'by-child'
                  ? 'bg-accent-moon text-brand-midnight ring-4 ring-accent-moon/30'
                  : 'bg-brand-steel/30 text-brand-snow group-hover:bg-brand-steel/50'
                }
              `}>
                {child.childName.charAt(0)}
              </div>
              <div className="text-xs text-brand-frost/60 text-center">
                {child.childName}
                <div className="text-accent-moon font-bold">{child.earnedBadgeIds.length}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-brand-frost/60">{t.viewBy}</div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewMode('all');
              setSelectedChild(null);
            }}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${viewMode === 'all'
                ? 'bg-accent-moon text-brand-midnight'
                : 'bg-brand-steel/20 text-brand-frost hover:bg-brand-steel/40'
              }
            `}
          >
            {t.viewAll}
          </button>
          <button
            onClick={() => setViewMode('by-child')}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${viewMode === 'by-child'
                ? 'bg-accent-moon text-brand-midnight'
                : 'bg-brand-steel/20 text-brand-frost hover:bg-brand-steel/40'
              }
            `}
          >
            {t.viewByChild}
          </button>
        </div>
      </div>

      {/* Badge Display */}
      {viewMode === 'all' ? (
        // All Badges View - Show duplicates
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allBadges.map((badge) => {
            const isEarned = Array.from(allEarnedBadgeIds).includes(badge.id);
            const earnedCount = badgeCountMap.get(badge.id) || 0;
            
            // If badge is earned multiple times, show it multiple times
            if (isEarned && earnedCount > 1) {
              return Array.from({ length: earnedCount }).map((_, index) => (
                <div key={`${badge.id}-${index}`} className="relative">
                  <BadgeCard
                    badge={badge}
                    earned={true}
                    language={language}
                  />
                  {/* Show count badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-aurora rounded-full border-2 border-brand-navy flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-navy">
                      {index + 1}/{earnedCount}
                    </span>
                  </div>
                  {/* Show which child earned this instance */}
                  <div className="mt-2 flex gap-1 justify-center">
                    {familyBadges.map((child) => {
                      const childBadgeIndex = child.earnedBadgeIds.filter(id => id === badge.id).length;
                      if (childBadgeIndex > index) {
                        return (
                          <div
                            key={child.childId}
                            className="w-6 h-6 rounded-full bg-accent-moon/20 border border-accent-moon/50 flex items-center justify-center text-xs text-accent-moon font-bold"
                            title={child.childName}
                          >
                            {child.childName.charAt(0)}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ));
            }
            
            // Show single badge (earned once or not earned)
            return (
              <div key={badge.id} className="relative">
                <BadgeCard
                  badge={badge}
                  earned={isEarned}
                  language={language}
                />
                {/* Show which children earned this badge */}
                {isEarned && (
                  <div className="mt-2 flex gap-1 justify-center">
                    {familyBadges.map((child) => 
                      child.earnedBadgeIds.includes(badge.id) && (
                        <div
                          key={child.childId}
                          className="w-6 h-6 rounded-full bg-accent-moon/20 border border-accent-moon/50 flex items-center justify-center text-xs text-accent-moon font-bold"
                          title={child.childName}
                        >
                          {child.childName.charAt(0)}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // By Child View
        <div className="space-y-8">
          {familyBadges.map((child) => (
            <div
              key={child.childId}
              className={`
                ${selectedChild && selectedChild !== child.childId ? 'hidden' : ''}
              `}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-moon text-brand-midnight flex items-center justify-center text-lg font-bold">
                  {child.childName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-heading text-brand-snow">{child.childName}</h3>
                  <p className="text-sm text-brand-frost/60">
                    {child.earnedBadgeIds.length} / {allBadges.length} {language === 'zh' ? '個徽章' : 'badges'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allBadges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={child.earnedBadgeIds.includes(badge.id)}
                    language={language}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {familyBadges.length === 0 && (
        <div className="text-center py-16 bg-brand-steel/10 rounded-xl border-2 border-brand-frost/20">
          <p className="text-brand-frost/60 text-lg mb-4">{t.noChild}</p>
          <button className="px-6 py-3 bg-accent-moon text-brand-midnight rounded-lg font-medium hover:bg-accent-ice transition-colors">
            {t.addChild}
          </button>
        </div>
      )}
    </div>
  );
}
