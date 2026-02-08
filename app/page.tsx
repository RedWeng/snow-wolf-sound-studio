/**
 * Snow Wolf Boy Event Registration System
 * One-Page Landing Experience
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8
 */

'use client';

import { useState } from 'react';
import { ContentSection } from '@/components/landing';
import { images } from '@/lib/config/images';

export default function Home() {
  const [language] = useState<'zh' | 'en'>('zh');

  const handleStartAdventure = () => {
    // Redirect to login page first
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animation Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
        }}
      />
      
      {/* Dark overlay to dim the background */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* NO HEADER - Pure Immersive Experience */}

        {/* Main Content - Cinematic Full-Screen Experience */}
        <main className="overflow-hidden">
        {/* Full-Screen Video 1 - HERO - 錄音派對影片 */}
        <ContentSection
          layout="full-image"
          image={images.hero.main}
          video="/video/錄音派對影片.mp4"
          subtitle="2026"
          title="Recording Party · Animation Edition"
          description="錄音派對 3.0｜動畫版"
          minHeight="min-h-screen"
          overlayOpacity={0.65}
          isHero={true}
        />

        {/* Full-Screen Image 2 - 玉成錄音室 */}
        <ContentSection
          layout="full-image"
          image="/image2/玉成錄音室.png"
          subtitle="2026 RECORDING STUDIO"
          title="全台唯一劇院錄音室"
          description="專業級錄音設備，打造孩子的聲音舞台"
          minHeight="min-h-screen"
          overlayOpacity={0.65}
        />

        {/* Full-Screen Image 2.5 - DD BOX */}
        <ContentSection
          layout="full-image"
          image="/image2/dd box.png"
          subtitle="GRAND OPENING 2026"
          title="D.D BOX 全新開幕劇場"
          description="全新劇場空間，為孩子打造專屬的表演舞台"
          minHeight="min-h-screen"
          overlayOpacity={0.65}
        />

        {/* Full-Screen Image 3 - 大合照 */}
        <ContentSection
          layout="full-image"
          image="/image2/大合照@3x-8.png"
          subtitle="1000+ PARTICIPANTS"
          title="超過 1000 位孩子的聲音冒險"
          description="每一個聲音，都是獨一無二的故事"
          minHeight="min-h-screen"
          overlayOpacity={0.3}
        />

        {/* Full-Screen Image 4 - RPG */}
        <ContentSection
          layout="full-image"
          image={images.content.studioEquipment}
          subtitle="RPG VOICE ACTING"
          title="遊戲RPG角色配音"
          description="孩子在玩的時候，也在練習成為自己。"
          minHeight="min-h-screen"
          overlayOpacity={0.65}
        />

        {/* Full-Screen Image 5 - 雪狼男孩動畫配音 */}
        <ContentSection
          layout="full-image"
          image={images.content.creativeSession}
          subtitle="SNOW WOLF BOY VOICE ACTING"
          title="雪狼男孩系列動畫配音"
          description="我們把冒險做得很大，是因為孩子的人生更大。"
          minHeight="min-h-screen"
          overlayOpacity={0.65}
        />

        {/* Full-Screen Image 6 - 無字繪本 */}
        <ContentSection
          layout="full-image"
          image={images.sessions.session1}
          subtitle="Picture Stories in Motion"
          title="5–7 歲音樂繪本場"
          description="如果一定要留下什麼，希望是孩子對自己的信任。"
          minHeight="min-h-screen"
          overlayOpacity={0.65}
        />

        {/* Full-Screen Image 7 - 時空冒險 */}
        <ContentSection
          layout="full-image"
          image="/image2/時空冒險.jpg"
          subtitle="Time & Space Adventure"
          title="時空冒險"
          description="時空冒險不一定要很危險，但一定要很真實。"
          minHeight="min-h-screen"
          overlayOpacity={0.65}
        >
          <button
            onClick={handleStartAdventure}
            className="px-12 py-6 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-full font-bold text-2xl hover:shadow-2xl hover:scale-110 transition-all duration-500 animate-pulse-slow"
          >
            {language === 'zh' ? '為孩子選擇聲音冒險' : 'Choose Sound Adventure for Your Child'}
          </button>
        </ContentSection>
        </main>

        {/* NO FOOTER - Pure Immersive Experience */}
      </div>
    </div>
  );
}
