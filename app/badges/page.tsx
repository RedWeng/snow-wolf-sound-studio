/**
 * Badges Collection Page
 * 
 * 徽章收藏頁面 - 顯示所有徽章（已獲得/未獲得）
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { MilestoneProgress } from '@/components/badges/MilestoneProgress';
import { FamilyBadgeVault } from '@/components/badges/FamilyBadgeVault';
import { getAllBadges } from '@/lib/config/badges';

// Mock: 家庭徽章數據（實際應從後端獲取）
const mockFamilyBadges = [
  {
    childId: 'child-1',
    childName: '小明',
    earnedBadgeIds: [
      'badge-wordless-registration',
      'badge-wordless-completion',
      'badge-animation-registration',
    ],
  },
  {
    childId: 'child-2',
    childName: '小華',
    earnedBadgeIds: [
      'badge-wordless-registration',
      'badge-animation-registration',
      'badge-animation-completion',
      'badge-family-registration',
      'badge-family-completion',
    ],
  },
];

const content = {
  zh: {
    title: '徽章收藏',
    subtitle: '參加課程，收集專屬徽章',
    earned: '已獲得',
    locked: '未獲得',
    total: '總計',
    filterAll: '全部',
    filterEarned: '已獲得',
    filterLocked: '未獲得',
    filterRegistration: '報名徽章',
    filterCompletion: '完成徽章',
    categories: {
      all: '全部',
      story: '故事場',
      animation: '動畫場',
      rpg: 'RPG場',
      family: '家庭場',
      special: '特殊',
    },
  },
  en: {
    title: 'Badge Collection',
    subtitle: 'Attend sessions to collect exclusive badges',
    earned: 'Earned',
    locked: 'Locked',
    total: 'Total',
    filterAll: 'All',
    filterEarned: 'Earned',
    filterLocked: 'Locked',
    filterRegistration: 'Registration',
    filterCompletion: 'Completion',
    categories: {
      all: 'All',
      story: 'Story',
      animation: 'Animation',
      rpg: 'RPG',
      family: 'Family',
      special: 'Special',
    },
  },
};

export default function BadgesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [language] = useState<'zh' | 'en'>('zh');
  
  // 權限檢查：未登入重定向到登入頁
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/badges');
    }
  }, [user, router]);
  
  const t = content[language];
  const allBadges = getAllBadges();
  
  // 如果未登入，顯示載入中
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-midnight to-black">
        <div className="text-center">
          <div className="text-xl text-white">載入中...</div>
        </div>
      </div>
    );
  }
  
  // 計算家庭總徽章數（每個孩子的徽章都計入）
  const earnedCount = mockFamilyBadges.reduce((total, child) => {
    return total + child.earnedBadgeIds.length;
  }, 0);
  
  // 計算去重的徽章ID（用於顯示）
  const allEarnedBadgeIds = new Set<string>();
  mockFamilyBadges.forEach(child => {
    child.earnedBadgeIds.forEach(badgeId => allEarnedBadgeIds.add(badgeId));
  });
  const totalCount = allBadges.length;

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/image2/金屬底背景圖.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-midnight/80 via-brand-midnight/60 to-brand-midnight/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading text-brand-snow mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-brand-frost/80 mb-6">
            {t.subtitle}
          </p>
          
          {/* 統計 */}
          <div className="inline-flex items-center gap-4 bg-brand-steel/20 border-2 border-accent-moon/30 rounded-full px-8 py-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-moon">{earnedCount}</div>
              <div className="text-sm text-brand-frost/60">{t.earned}</div>
            </div>
            <div className="w-px h-12 bg-brand-frost/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-frost">{totalCount}</div>
              <div className="text-sm text-brand-frost/60">{t.total}</div>
            </div>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="mb-12">
          <MilestoneProgress currentBadgeCount={earnedCount} language={language} />
        </div>

        {/* Family Badge Vault */}
        <FamilyBadgeVault familyBadges={mockFamilyBadges} language={language} />
      </div>
    </div>
  );
}
