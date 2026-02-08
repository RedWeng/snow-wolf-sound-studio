/**
 * Image Configuration
 * 
 * Centralized image paths for easy management and updates.
 * Replace these paths with your actual image filenames.
 */

export const images = {
  // Hero Section - Main visual
  hero: {
    main: '/image2/課程資訊HERO圖.png',
  },

  // Content Sections - 首頁滿版大圖
  content: {
    studioEquipment: '/image2/RPG.png',
    creativeSession: '/image2/天裂之痕.png',
    teamPhoto: '/image2/分鏡_05_海瑟風暴中心_無文字.png',
  },

  // Session Cards (for course listings) - 課程卡片圖片
  sessions: {
    session1: '/image2/無字繪本首頁圖.png',
    session2: '/image2/SNOWWOLFBOY_卡達爾之戰.png',
    session3: '/image2/家庭動畫配音.png',
    session4: '/image2/RPG_古神殿之謎.png',
    session5: '/image2/分鏡_06_黑雪暴風_無文字.png',
    session6: '/image2/分鏡_07_夜影穿梭_無文字.png',
  },

  // Gallery - Multiple images for grid display
  gallery: [
    '/image2/151_珍珠暴衝反擊_關鍵場景.png',
    '/image2/雪狼男孩_天裂之時_菲亞雪光變灰_無文字.png',
    '/image/1769486410112-artguru.png',
    '/image/1769486410119-artguru.png',
    '/image/1769486410123-artguru.png',
    '/image/1769486410133-artguru.png',
    '/image/1769486410140-artguru.png',
    '/image/1769486410147-artguru.png',
    '/image/1769486410154-artguru.png',
  ],

  // Additional images
  extra: [
    '/image/1769486410182-artguru.png',
    '/image/1769486410189-artguru.png',
    '/image/1769486410196-artguru.png',
    '/image/1769486410203-artguru.png',
    '/image/1769486410210-artguru.png',
    '/image/1769486410217-artguru.png',
    '/image/1769486410224-artguru.png',
    '/image/1769486410231-artguru.png',
  ],
};

// Helper function to get random session image
export function getRandomSessionImage(): string {
  const sessionImages = Object.values(images.sessions);
  return sessionImages[Math.floor(Math.random() * sessionImages.length)];
}
