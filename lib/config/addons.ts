/**
 * Addon configurations for sessions
 * All sessions can have addons
 */

import { Addon } from '@/lib/types/database';

/**
 * Animation Recording Addon
 * Available for all sessions
 */
export const animationRecordingAddon: Addon = {
  id: 'addon-animation-recording',
  name_zh: '家庭動畫錄音（開放2-5人一起）',
  name_en: 'Family Animation Recording (2-5 people)',
  description_zh: '專業錄製的動畫配音完成品，可帶走珍藏。包含30分鐘錄音時間，專業後製處理。錄音時段將依報名順序安排，課程前3天通知確切時間。',
  description_en: 'Professionally recorded animation voice acting final product to take home. Includes 30 minutes of recording time and professional post-production. Recording time slots will be arranged by registration order, confirmed 3 days before the session.',
  price: 4500,
  duration_minutes: 30,
  max_per_session: 4, // 每場限4組
};

/**
 * Get all available addons
 */
export function getAllAddons(): Addon[] {
  return [animationRecordingAddon];
}

/**
 * Get addon by ID
 */
export function getAddonById(id: string): Addon | null {
  const addons = getAllAddons();
  return addons.find(addon => addon.id === id) || null;
}
