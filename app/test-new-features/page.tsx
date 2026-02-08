'use client';

import { useState } from 'react';
import { UnlockRewardsDisplay } from '@/components/session/UnlockRewardsDisplay';
import { AddonSelector } from '@/components/session/AddonSelector';
import { DiscountDisplay } from '@/components/cart/DiscountDisplay';
import { mockSessions } from '@/lib/mock-data/sessions';

export default function TestNewFeaturesPage() {
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  
  // Use first active session for testing
  const testSession = mockSessions.find(s => s.status === 'active') || mockSessions[0];

  const handleAddonToggle = (addonId: string, selected: boolean) => {
    const newSet = new Set(selectedAddons);
    if (selected) {
      newSet.add(addonId);
    } else {
      newSet.delete(addonId);
    }
    setSelectedAddons(newSet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-midnight to-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading text-white">2026 Q2 新功能測試</h1>
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="px-4 py-2 bg-white/10 border-2 border-white/30 rounded-lg text-white hover:bg-white/20 transition-all"
          >
            {language === 'zh' ? 'Switch to English' : '切換至中文'}
          </button>
        </div>

        {/* Unlock Rewards Display */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">1. 解鎖獎勵顯示（遊戲化）</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Little Kids */}
            <div className="p-6 bg-white/5 border-2 border-white/20 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">小小孩劇場 (12/20位)</h3>
              <UnlockRewardsDisplay
                sessionPrice={2800}
                ageMin={5}
                ageMax={7}
                currentRegistrations={12}
                language={language}
              />
            </div>

            {/* Big Kids */}
            <div className="p-6 bg-white/5 border-2 border-white/20 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">大孩子動畫場 (16/20位)</h3>
              <UnlockRewardsDisplay
                sessionPrice={3600}
                ageMin={8}
                ageMax={13}
                currentRegistrations={16}
                language={language}
              />
            </div>

            {/* Family */}
            <div className="p-6 bg-white/5 border-2 border-white/20 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">家庭場 (11/15組)</h3>
              <UnlockRewardsDisplay
                sessionPrice={5500}
                ageMin={2}
                ageMax={99}
                currentRegistrations={11}
                language={language}
              />
            </div>
          </div>
        </section>

        {/* Addon Selector */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">2. 加購選項</h2>
          <div className="p-6 bg-white/5 border-2 border-white/20 rounded-xl">
            <AddonSelector
              session={testSession}
              onAddonToggle={handleAddonToggle}
              selectedAddons={selectedAddons}
              language={language}
            />
          </div>
        </section>

        {/* Discount Display */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">3. 折扣顯示</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* No Discount */}
            <div className="p-6 bg-white/5 border-2 border-white/20 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">單場報名</h3>
              <DiscountDisplay
                originalTotal={2800}
                discountAmount={0}
                finalTotal={2800}
                discountTier="0"
                language={language}
              />
            </div>

            {/* 300 Discount */}
            <div className="p-6 bg-white/5 border-2 border-white/20 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">2場報名</h3>
              <DiscountDisplay
                originalTotal={5600}
                discountAmount={600}
                finalTotal={5000}
                discountTier="300"
                language={language}
              />
            </div>

            {/* 400 Discount */}
            <div className="p-6 bg-white/5 border-2 border-white/20 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-4">3場報名</h3>
              <DiscountDisplay
                originalTotal={8400}
                discountAmount={1200}
                finalTotal={7200}
                discountTier="400"
                language={language}
              />
            </div>
          </div>
        </section>

        {/* Discount Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">4. 折扣案例說明</h2>
          <div className="p-6 bg-white/5 border-2 border-white/20 rounded-xl space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-accent-aurora">✅ 案例1: 2個孩子同場</h3>
              <p className="text-white/80">小小孩劇場 $2,800 × 2 = $5,600</p>
              <p className="text-accent-aurora">折扣: -$300 × 2 = -$600</p>
              <p className="text-white font-bold">總計: $5,000</p>
            </div>

            <div className="h-px bg-white/20" />

            <div className="space-y-2">
              <h3 className="font-bold text-accent-aurora">✅ 案例2: 家庭場 + 加購</h3>
              <p className="text-white/80">家庭場 $5,500 + 加購 $4,500 = $10,000</p>
              <p className="text-accent-aurora">折扣: -$300 × 2 = -$600</p>
              <p className="text-white font-bold">總計: $9,400</p>
            </div>

            <div className="h-px bg-white/20" />

            <div className="space-y-2">
              <h3 className="font-bold text-accent-aurora">✅ 案例3: 3場報名（最高優惠）</h3>
              <p className="text-white/80">小小孩 $2,800 × 3 = $8,400</p>
              <p className="text-accent-aurora">折扣: -$400 × 3 = -$1,200</p>
              <p className="text-white font-bold">總計: $7,200</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
