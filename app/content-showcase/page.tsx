/**
 * Content Section Showcase
 * 
 * Demonstrates how to use ContentSection for visual storytelling
 */

'use client';

import { ContentSection } from '@/components/landing/ContentSection';

export default function ContentShowcasePage() {
  return (
    <main className="min-h-screen">
      {/* Example 1: Full-width hero image with overlay text */}
      <ContentSection
        layout="full-image"
        image="/path/to/hero-image.jpg"
        title="Snow Wolf 錄音派對"
        subtitle="為孩子打造的創意體驗"
        description="在專業錄音室中，讓孩子的聲音成為最動人的旋律"
        minHeight="min-h-screen"
        overlayOpacity={0.4}
      >
        <button className="px-8 py-4 bg-white text-brand-navy rounded-lg font-semibold text-lg hover:shadow-2xl transition-all duration-300">
          立即探索
        </button>
      </ContentSection>

      {/* Example 2: Split layout - Image left, text right */}
      <ContentSection
        layout="split-left"
        image="/path/to/image-1.jpg"
        subtitle="專業設備"
        title="AAA 級錄音室體驗"
        description="我們使用業界頂級的錄音設備，為孩子提供最專業的錄音環境。每一個細節都經過精心設計，確保最佳的聲音品質。"
        backgroundColor="bg-white"
      />

      {/* Example 3: Split layout - Image right, text left */}
      <ContentSection
        layout="split-right"
        image="/path/to/image-2.jpg"
        subtitle="創意啟發"
        title="激發孩子的創造力"
        description="透過主題式的錄音活動，讓孩子在玩樂中學習，在創作中成長。每一次的錄音都是一次獨特的冒險。"
        backgroundColor="bg-gradient-to-b from-white to-brand-frost/20"
      />

      {/* Example 4: Image grid */}
      <ContentSection
        layout="grid"
        images={[
          '/path/to/gallery-1.jpg',
          '/path/to/gallery-2.jpg',
          '/path/to/gallery-3.jpg',
          '/path/to/gallery-4.jpg',
          '/path/to/gallery-5.jpg',
          '/path/to/gallery-6.jpg',
        ]}
        title="精彩瞬間"
        subtitle="Gallery"
        description="看看孩子們在 Snow Wolf 的快樂時光"
        backgroundColor="bg-brand-frost/10"
      />

      {/* Example 5: Text only section */}
      <ContentSection
        layout="text-only"
        subtitle="Our Mission"
        title="我們的使命"
        description="Snow Wolf 致力於為每一位孩子創造難忘的音樂體驗。我們相信，每個孩子都有獨特的聲音，值得被聽見、被記錄、被珍藏。"
        backgroundColor="bg-white"
      >
        <div className="flex gap-4 justify-center mt-8">
          <button className="px-6 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-midnight transition-colors">
            了解更多
          </button>
          <button className="px-6 py-3 border-2 border-brand-navy text-brand-navy rounded-lg font-semibold hover:bg-brand-navy hover:text-white transition-colors">
            聯絡我們
          </button>
        </div>
      </ContentSection>

      {/* Example 6: Another full-width image */}
      <ContentSection
        layout="full-image"
        image="/path/to/cta-image.jpg"
        title="準備好開始了嗎？"
        description="立即登入，為孩子預約一場難忘的錄音體驗"
        minHeight="min-h-[600px]"
        overlayOpacity={0.5}
      >
        <button className="px-10 py-5 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-lg font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          立即登入
        </button>
      </ContentSection>
    </main>
  );
}
