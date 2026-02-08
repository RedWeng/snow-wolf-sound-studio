/**
 * Background Images Configuration
 * 
 * Centralized management of background images for different pages
 */

export interface BackgroundImage {
  path: string;
  name: string;
  category: 'story' | 'character' | 'scene' | 'rpg';
}

/**
 * Login Page Background Images
 * High-quality dramatic scenes suitable for login page
 */
export const loginBackgrounds: BackgroundImage[] = [
  // Story Scenes - 故事場景
  { path: '/image2/天裂之痕.png', name: '天裂之痕', category: 'story' },
  { path: '/image2/SNOWWOLFBOY_卡達爾之戰.png', name: '卡達爾之戰', category: 'story' },
  { path: '/image2/SNOWWOLFBOY_天烈之痕.png', name: '天烈之痕', category: 'story' },
  { path: '/image2/天烈之痕之餐廳黑影.png', name: '餐廳黑影', category: 'story' },
  { path: '/image2/天裂之痕之艾娜的秘密.png', name: '艾娜的秘密', category: 'story' },
  
  // Storyboard Scenes - 分鏡場景
  { path: '/image2/分鏡_03_雷獸試煉_無文字.png', name: '雷獸試煉', category: 'scene' },
  { path: '/image2/分鏡_05_海瑟風暴中心_無文字.png', name: '海瑟風暴中心', category: 'scene' },
  { path: '/image2/分鏡_06_黑雪暴風_無文字.png', name: '黑雪暴風', category: 'scene' },
  { path: '/image2/分鏡_07_夜影穿梭_無文字.png', name: '夜影穿梭', category: 'scene' },
  { path: '/image2/分鏡_08_里特狼化_無文字.png', name: '里特狼化', category: 'scene' },
  { path: '/image2/分鏡_09_菲亞雪能爆發_無文字.png', name: '菲亞雪能爆發', category: 'scene' },
  
  // Character Moments - 角色時刻
  { path: '/image2/雪狼男孩_天裂之時_坎之深淵_賽西莉雅.png', name: '賽西莉雅', category: 'character' },
  { path: '/image2/雪狼男孩_天裂之時_翠妮絲風之試煉.png', name: '翠妮絲風之試煉', category: 'character' },
  { path: '/image2/雪狼男孩_天裂之時_艾納水晶治療.png', name: '艾納水晶治療', category: 'character' },
  { path: '/image2/雪狼男孩_天裂之時_菲亞雪光變灰_無文字 (1).png', name: '菲亞雪光變灰', category: 'character' },
  { path: '/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png', name: '里特與巨狼', category: 'character' },
  
  // RPG Scenes - RPG場景
  { path: '/image2/RPG_古神殿之謎.png', name: '古神殿之謎', category: 'rpg' },
  { path: '/image2/穆高爾傳說RPG.png', name: '穆高爾傳說', category: 'rpg' },
  
  // Key Scenes - 關鍵場景
  { path: '/image2/151_珍珠暴衝反擊_關鍵場景.png', name: '珍珠暴衝反擊', category: 'scene' },
];

/**
 * Get a random background image from the pool
 */
export function getRandomLoginBackground(): string {
  const randomIndex = Math.floor(Math.random() * loginBackgrounds.length);
  return loginBackgrounds[randomIndex].path;
}

/**
 * Get backgrounds by category
 */
export function getBackgroundsByCategory(category: BackgroundImage['category']): BackgroundImage[] {
  return loginBackgrounds.filter(bg => bg.category === category);
}

/**
 * Onboarding Page Background Images
 * Welcoming and inspiring scenes
 */
export const onboardingBackgrounds: BackgroundImage[] = [
  { path: '/image2/hero-main.png', name: 'Hero Main', category: 'story' },
  { path: '/image2/課程資訊HERO圖.png', name: '課程資訊HERO圖', category: 'story' },
  { path: '/image2/無字繪本首頁圖.png', name: '無字繪本首頁圖', category: 'story' },
];

/**
 * Get a random onboarding background
 */
export function getRandomOnboardingBackground(): string {
  const randomIndex = Math.floor(Math.random() * onboardingBackgrounds.length);
  return onboardingBackgrounds[randomIndex].path;
}
