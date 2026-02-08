/**
 * Badge System Configuration
 * 
 * 徽章系統配置 - 雙重徽章機制
 * 1. 報名徽章：完成報名付款即獲得
 * 2. 完成徽章：實際參加並完成錄音（後台老師確認）
 */

export interface Badge {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  image_url: string;
  session_id: string; // 對應的課程 ID
  type: 'registration' | 'completion'; // 徽章類型
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'story' | 'animation' | 'rpg' | 'family' | 'special';
}

/**
 * 里程碑獎勵配置
 */
export interface MilestoneReward {
  id: string;
  badge_count: number; // 需要的徽章數量
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  icon: string;
  reward_type: 'birthday_card' | 'rpg_account' | 'vip_party' | 'special';
}

/**
 * 徽章配置 - 每個課程有兩個徽章（報名 + 完成）
 */
export const badges: Badge[] = [
  // ① 5/3（日）- 無字繪本場
  {
    id: 'badge-wordless-registration',
    name_zh: '繪本探索者',
    name_en: 'Picture Book Explorer',
    description_zh: '報名無字繪本場，準備開啟聲音冒險！',
    description_en: 'Registered for Wordless Picture Book session',
    image_url: '/image2/徽章/新手徽章_寫實風格.png',
    session_id: 'session-2026-05-03',
    type: 'registration',
    rarity: 'common',
    category: 'story',
  },
  {
    id: 'badge-wordless-completion',
    name_zh: '故事說書人',
    name_en: 'Story Narrator',
    description_zh: '完成無字繪本錄音，用聲音創造故事！',
    description_en: 'Completed Wordless Picture Book recording',
    image_url: '/image2/徽章/成長徽章_寫實風格.png',
    session_id: 'session-2026-05-03',
    type: 'completion',
    rarity: 'rare',
    category: 'story',
  },

  // ② 5/10（日）- 動畫配音場
  {
    id: 'badge-animation-registration',
    name_zh: '動畫學徒',
    name_en: 'Animation Apprentice',
    description_zh: '報名動畫配音場，準備化身動畫角色！',
    description_en: 'Registered for Animation Voice Acting session',
    image_url: '/image2/徽章/勇氣徽章_寫實風格.png',
    session_id: 'session-2026-05-10',
    type: 'registration',
    rarity: 'common',
    category: 'animation',
  },
  {
    id: 'badge-animation-completion',
    name_zh: '配音大師',
    name_en: 'Voice Master',
    description_zh: '完成動畫配音，用聲音展現勇氣與力量！',
    description_en: 'Completed animation voice acting with courage',
    image_url: '/image2/徽章/守護印記_電影級.png',
    session_id: 'session-2026-05-10',
    type: 'completion',
    rarity: 'epic',
    category: 'animation',
  },

  // ③ 5/17（日）- 家庭動畫配音
  {
    id: 'badge-family-registration',
    name_zh: '家庭冒險家',
    name_en: 'Family Adventurer',
    description_zh: '報名家庭場，準備與家人一起創作！',
    description_en: 'Registered for Family Animation session',
    image_url: '/image2/徽章/愛心徽章_寫實風格.png',
    session_id: 'session-2026-05-17',
    type: 'registration',
    rarity: 'rare',
    category: 'family',
  },
  {
    id: 'badge-family-completion',
    name_zh: '同心之帶',
    name_en: 'Unity Band',
    description_zh: '全家完成錄音，凝聚家庭的溫暖力量！',
    description_en: 'Completed family recording, united with warmth',
    image_url: '/image2/徽章/同心之帶_寫實風格.png',
    session_id: 'session-2026-05-17',
    type: 'completion',
    rarity: 'legendary',
    category: 'family',
  },

  // ④ 5/24（日）- 時空冒險RPG
  {
    id: 'badge-time-registration',
    name_zh: '時空旅人',
    name_en: 'Time Traveler',
    description_zh: '報名時空冒險，準備穿越時空！',
    description_en: 'Registered for Time Adventure RPG',
    image_url: '/image2/徽章/召唤卷轴.png',
    session_id: 'session-2026-05-24',
    type: 'registration',
    rarity: 'rare',
    category: 'rpg',
  },
  {
    id: 'badge-time-completion',
    name_zh: '星辰碎片',
    name_en: 'Star Fragment',
    description_zh: '完成時空冒險，收集來自不同時代的星辰碎片！',
    description_en: 'Completed time travel, collected star fragments',
    image_url: '/image2/徽章/星辰碎片_寫實風格.png',
    session_id: 'session-2026-05-24',
    type: 'completion',
    rarity: 'epic',
    category: 'rpg',
  },

  // ⑤ 5/31（日）- 古代神殿之謎
  {
    id: 'badge-temple-registration',
    name_zh: '神殿探險者',
    name_en: 'Temple Explorer',
    description_zh: '報名神殿之謎，準備解開古老謎題！',
    description_en: 'Registered for Ancient Temple Mystery',
    image_url: '/image2/徽章/古代種子_寫實風格.png',
    session_id: 'session-2026-05-31',
    type: 'registration',
    rarity: 'epic',
    category: 'rpg',
  },
  {
    id: 'badge-temple-completion',
    name_zh: '古老聖杯',
    name_en: 'Ancient Chalice',
    description_zh: '解開神殿謎題，獲得傳說中的聖杯！',
    description_en: 'Solved temple mysteries, obtained the legendary chalice',
    image_url: '/image2/徽章/古老聖杯_寫實風格.png',
    session_id: 'session-2026-05-31',
    type: 'completion',
    rarity: 'legendary',
    category: 'rpg',
  },

  // ⑥ 6/14（日）- 雪狼男孩《卡達爾之戰》動畫場
  {
    id: 'badge-kadar-registration',
    name_zh: '卡達爾戰士',
    name_en: 'Kadar Warrior',
    description_zh: '報名卡達爾之戰，準備展現守護決心！',
    description_en: 'Registered for Battle of Kadar',
    image_url: '/image2/徽章/熱情徽章_寫實風格.png',
    session_id: 'session-2026-06-14',
    type: 'registration',
    rarity: 'rare',
    category: 'animation',
  },
  {
    id: 'badge-kadar-completion',
    name_zh: '守護之盾',
    name_en: 'Guardian Shield',
    description_zh: '完成卡達爾之戰錄音，展現守護的決心！',
    description_en: 'Completed Battle of Kadar, showed determination to protect',
    image_url: '/image2/徽章/守護之盾_寫實風格.png',
    session_id: 'session-2026-06-14',
    type: 'completion',
    rarity: 'epic',
    category: 'animation',
  },

  // ⑦ 6/28（日）- RPG《穆高爾傳說》
  {
    id: 'badge-mughal-registration',
    name_zh: '穆高爾冒險者',
    name_en: 'Mughal Adventurer',
    description_zh: '報名穆高爾傳說，準備探索大陸！',
    description_en: 'Registered for Legend of Mughal',
    image_url: '/image2/徽章/森林種子_寫實風格.png',
    session_id: 'session-2026-06-28',
    type: 'registration',
    rarity: 'epic',
    category: 'rpg',
  },
  {
    id: 'badge-mughal-completion',
    name_zh: '森林護符',
    name_en: 'Forest Talisman',
    description_zh: '完成穆高爾傳說，成為大陸守護者！',
    description_en: 'Completed Mughal legend, became guardian of continent',
    image_url: '/image2/徽章/森林護符_寫實風格.png',
    session_id: 'session-2026-06-28',
    type: 'completion',
    rarity: 'legendary',
    category: 'rpg',
  },
];

/**
 * 額外徽章 - 未來課程或特殊活動徽章（待解鎖）
 */
export const futureBadges: Badge[] = [
  {
    id: 'badge-future-grass-spirit',
    name_zh: '草之靈',
    name_en: 'Grass Spirit',
    description_zh: '神秘的自然力量徽章（待解鎖）',
    description_en: 'Mysterious nature power badge (Locked)',
    image_url: '/image2/徽章/草之靈_寫實風格.png',
    session_id: 'future-session-1',
    type: 'completion',
    rarity: 'rare',
    category: 'special',
  },
  {
    id: 'badge-future-eternal-leaf',
    name_zh: '永生樹葉',
    name_en: 'Eternal Leaf',
    description_zh: '永恆生命的象徵（待解鎖）',
    description_en: 'Symbol of eternal life (Locked)',
    image_url: '/image2/徽章/永生樹葉_寫實風格.png',
    session_id: 'future-session-2',
    type: 'completion',
    rarity: 'legendary',
    category: 'special',
  },
  {
    id: 'badge-future-star-fragment-2',
    name_zh: '星辰碎片·二',
    name_en: 'Star Fragment II',
    description_zh: '來自遙遠星系的碎片（待解鎖）',
    description_en: 'Fragment from distant galaxy (Locked)',
    image_url: '/image2/徽章/星辰碎片_寫實風格 (1).png',
    session_id: 'future-session-3',
    type: 'completion',
    rarity: 'epic',
    category: 'special',
  },
  {
    id: 'badge-future-guardian-shield-2',
    name_zh: '守護之盾·二',
    name_en: 'Guardian Shield II',
    description_zh: '更強大的守護力量（待解鎖）',
    description_en: 'Stronger guardian power (Locked)',
    image_url: '/image2/徽章/守護之盾_寫實風格 (1).png',
    session_id: 'future-session-4',
    type: 'completion',
    rarity: 'epic',
    category: 'special',
  },
  {
    id: 'badge-future-guardian-shield-3',
    name_zh: '守護之盾·三',
    name_en: 'Guardian Shield III',
    description_zh: '終極守護之力（待解鎖）',
    description_en: 'Ultimate guardian power (Locked)',
    image_url: '/image2/徽章/守護之盾_寫實風格 (2).png',
    session_id: 'future-session-5',
    type: 'completion',
    rarity: 'legendary',
    category: 'special',
  },
  // 魔戒風格徽章 (Lord of the Rings Style Badges)
  {
    id: 'badge-future-lotr-chalice-light',
    name_zh: '聖杯之光',
    name_en: 'Chalice of Light',
    description_zh: '散發神聖光芒的古老聖杯（待解鎖）',
    description_en: 'Ancient chalice radiating holy light (Locked)',
    image_url: '/image2/徽章/魔戒風格_徽章_1_聖杯之光_寫實粗糙.png',
    session_id: 'future-session-lotr-1',
    type: 'completion',
    rarity: 'legendary',
    category: 'special',
  },
  {
    id: 'badge-future-lotr-eternal-leaf',
    name_zh: '永生之葉',
    name_en: 'Leaf of Eternity',
    description_zh: '永不凋零的精靈樹葉（待解鎖）',
    description_en: 'Elven leaf that never withers (Locked)',
    image_url: '/image2/徽章/魔戒風格_徽章_2_永生之葉_寫實粗糙.png',
    session_id: 'future-session-lotr-2',
    type: 'completion',
    rarity: 'legendary',
    category: 'special',
  },
  {
    id: 'badge-future-lotr-unity-band',
    name_zh: '同心之帶',
    name_en: 'Band of Unity',
    description_zh: '凝聚夥伴力量的神秘腰帶（待解鎖）',
    description_en: 'Mystical band that unites companions (Locked)',
    image_url: '/image2/徽章/魔戒風格_徽章_4_同心之帶_寫實粗糙.png',
    session_id: 'future-session-lotr-3',
    type: 'completion',
    rarity: 'epic',
    category: 'special',
  },
  {
    id: 'badge-future-lotr-guardian-shield',
    name_zh: '守護之盾',
    name_en: 'Guardian Shield',
    description_zh: '抵禦黑暗的傳說盾牌（待解鎖）',
    description_en: 'Legendary shield against darkness (Locked)',
    image_url: '/image2/徽章/魔戒風格_徽章_5_守護之盾_寫實粗糙.png',
    session_id: 'future-session-lotr-4',
    type: 'completion',
    rarity: 'epic',
    category: 'special',
  },
  {
    id: 'badge-future-lotr-warrior-wing',
    name_zh: '戰士之翼',
    name_en: 'Warrior Wings',
    description_zh: '賦予勇者飛翔力量的羽翼（待解鎖）',
    description_en: 'Wings that grant warriors flight (Locked)',
    image_url: '/image2/徽章/魔戒風格_徽章_7_戰士之翼_寫實粗糙.png',
    session_id: 'future-session-lotr-5',
    type: 'completion',
    rarity: 'epic',
    category: 'special',
  },
  {
    id: 'badge-future-lotr-griffin-shield',
    name_zh: '獅鷲之盾',
    name_en: 'Griffin Shield',
    description_zh: '刻有獅鷲紋章的王者之盾（待解鎖）',
    description_en: 'Royal shield bearing griffin crest (Locked)',
    image_url: '/image2/徽章/魔戒風格_徽章_8_獅鷲之盾_極粗糙.png',
    session_id: 'future-session-lotr-6',
    type: 'completion',
    rarity: 'legendary',
    category: 'special',
  },
  {
    id: 'badge-future-lotr-eternal-light',
    name_zh: '永生之光',
    name_en: 'Light of Eternity',
    description_zh: '永不熄滅的神聖之光（待解鎖）',
    description_en: 'Sacred light that never fades (Locked)',
    image_url: '/image2/徽章/魔戒風格_徽章_10_永生之光_極粗糙.png',
    session_id: 'future-session-lotr-7',
    type: 'completion',
    rarity: 'legendary',
    category: 'special',
  },
];

/**
 * 獲取所有徽章（包含未來徽章）
 */
export function getAllBadgesIncludingFuture(): Badge[] {
  return [...badges, ...futureBadges];
}

/**
 * 根據課程 ID 獲取對應徽章
 */
export function getBadgeBySessionId(sessionId: string): Badge | undefined {
  return badges.find(badge => badge.session_id === sessionId);
}

/**
 * 根據課程 ID 和類型獲取徽章
 */
export function getBadgeBySessionIdAndType(
  sessionId: string, 
  type: 'registration' | 'completion'
): Badge | undefined {
  return badges.find(badge => 
    badge.session_id === sessionId && badge.type === type
  );
}

/**
 * 里程碑獎勵配置
 * 
 * 徽章累積方式：帳號統一累積（全家所有孩子的徽章加總）
 */
export const milestoneRewards: MilestoneReward[] = [
  {
    id: 'milestone-8',
    badge_count: 8,
    name_zh: '免費錄製雪狼男孩主題曲',
    name_en: 'Free Snow Wolf Boy Theme Song Recording',
    description_zh: '免費錄製雪狼男孩主題曲，後製到動畫MV上（無混音）',
    description_en: 'Free recording of Snow Wolf Boy theme song, edited into animation MV (no mixing)',
    icon: '🎵',
    reward_type: 'birthday_card',
  },
  {
    id: 'milestone-16',
    badge_count: 16,
    name_zh: '雪狼RPG玩家帳號',
    name_en: 'Snow Wolf RPG Player Account',
    description_zh: '解鎖雪狼RPG遊戲帳號，開啟線上冒險！（預計6月上線）',
    description_en: 'Unlock Snow Wolf RPG game account, start online adventure (Launching June)',
    icon: '🎮',
    reward_type: 'rpg_account',
  },
  {
    id: 'milestone-24',
    badge_count: 24,
    name_zh: '年度VIP派對優先資格',
    name_en: 'Annual VIP Party Priority Access',
    description_zh: '優先參加年度VIP派對，可獲得兩位入場名額（一位孩童+一位家長）',
    description_en: 'Priority access to annual VIP party, includes 2 admission tickets (1 child + 1 parent)',
    icon: '👑',
    reward_type: 'vip_party',
  },
];

/**
 * 根據徽章 ID 獲取徽章
 */
export function getBadgeById(badgeId: string): Badge | undefined {
  return badges.find(badge => badge.id === badgeId);
}

/**
 * 獲取所有徽章（用於收藏頁面）
 */
export function getAllBadges(): Badge[] {
  return [...badges, ...futureBadges];
}

/**
 * 獲取下一個里程碑
 */
export function getNextMilestone(currentBadgeCount: number): MilestoneReward | null {
  return milestoneRewards.find(milestone => 
    milestone.badge_count > currentBadgeCount
  ) || null;
}

/**
 * 獲取已達成的里程碑
 */
export function getAchievedMilestones(currentBadgeCount: number): MilestoneReward[] {
  return milestoneRewards.filter(milestone => 
    milestone.badge_count <= currentBadgeCount
  );
}

/**
 * 檢查是否達成新里程碑
 */
export function checkNewMilestone(
  previousCount: number, 
  newCount: number
): MilestoneReward | null {
  const newMilestone = milestoneRewards.find(milestone => 
    milestone.badge_count > previousCount && milestone.badge_count <= newCount
  );
  return newMilestone || null;
}

/**
 * 根據稀有度獲取徽章顏色
 */
export function getBadgeRarityColor(rarity: Badge['rarity']): string {
  const colors = {
    common: 'text-gray-400 border-gray-400',
    rare: 'text-blue-400 border-blue-400',
    epic: 'text-purple-400 border-purple-400',
    legendary: 'text-yellow-400 border-yellow-400',
  };
  return colors[rarity];
}

/**
 * 根據稀有度獲取徽章背景光暈
 */
export function getBadgeRarityGlow(rarity: Badge['rarity']): string {
  const glows = {
    common: 'shadow-gray-400/50',
    rare: 'shadow-blue-400/50',
    epic: 'shadow-purple-400/50',
    legendary: 'shadow-yellow-400/50',
  };
  return glows[rarity];
}
