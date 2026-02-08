/**
 * Image Configuration
 * 
 * Centralized image paths for easy management and updates.
 * Uses Cloudinary CDN URLs for uploaded images.
 */

import { getImageUrl } from '../utils/image-url';

// Local paths (will be mapped to Cloudinary URLs automatically)
const localPaths = {
  hero: {
    main: '/image2/RPG.png', // Using RPG.png as hero (課程資訊HERO圖 is too large)
  },
  content: {
    studioEquipment: '/image2/RPG.png',
    creativeSession: '/image2/沒有對齊的世界.png', // Using smaller alternative
    teamPhoto: '/image2/大合照@3x-8.png', // Using team photo instead
  },
  sessions: {
    session1: '/image2/5-7歲的繪本場.png', // Using alternative (無字繪本首頁圖 is too large)
    session2: '/image2/RPG_古神殿之謎.png', // Using alternative (SNOWWOLFBOY_卡達爾之戰 is too large)
    session3: '/image2/家庭動畫配音.png',
    session4: '/image2/RPG_古神殿之謎.png',
    session5: '/image2/穆高爾傳說RPG.png', // Using alternative (分鏡_06 is too large)
    session6: '/image2/時空冒險.jpg', // Using alternative (分鏡_07 is too large)
  },
  gallery: [
    '/image2/151_珍珠暴衝反擊_關鍵場景.png',
    '/image2/沒有對齊的世界.png', // Using alternative
    '/image/1769486410119-artguru.png',
    '/image/1769486410123-artguru.png',
    '/image/1769486410231-artguru.png',
    '/image2/RPG.png',
    '/image2/RPG_古神殿之謎.png',
    '/image2/家庭動畫配音.png',
    '/image2/大合照@3x-8.png',
  ],
  extra: [
    '/image2/勇者之劍_寫實風格.png',
    '/image2/動漫MV錄製.jpg',
    '/image2/時空冒險.jpg',
    '/image2/穆高爾傳說RPG.png',
    '/image2/金屬底背景圖.png',
    '/image2/麵包_RPG風格.png',
    '/image/1769486410119-artguru.png',
    '/image/1769486410123-artguru.png',
    '/image/1769486410231-artguru.png',
  ],
};

// Export images with Cloudinary URLs
export const images = {
  hero: {
    main: getImageUrl(localPaths.hero.main),
  },
  content: {
    studioEquipment: getImageUrl(localPaths.content.studioEquipment),
    creativeSession: getImageUrl(localPaths.content.creativeSession),
    teamPhoto: getImageUrl(localPaths.content.teamPhoto),
  },
  sessions: {
    session1: getImageUrl(localPaths.sessions.session1),
    session2: getImageUrl(localPaths.sessions.session2),
    session3: getImageUrl(localPaths.sessions.session3),
    session4: getImageUrl(localPaths.sessions.session4),
    session5: getImageUrl(localPaths.sessions.session5),
    session6: getImageUrl(localPaths.sessions.session6),
  },
  gallery: localPaths.gallery.map(getImageUrl),
  extra: localPaths.extra.map(getImageUrl),
};

// Helper function to get random session image
export function getRandomSessionImage(): string {
  const sessionImages = Object.values(images.sessions);
  return sessionImages[Math.floor(Math.random() * sessionImages.length)];
}
