/**
 * Unlock Rewards Configuration
 * Gamified rewards display for session registration milestones
 */

export interface UnlockReward {
  id: string;
  name_zh: string;
  name_en: string;
  icon: string;
  threshold: number; // Number of registrations needed
}

export interface SessionUnlockConfig {
  sessionType: 'little-kids' | 'big-kids' | 'family';
  rewards: UnlockReward[];
}

/**
 * Little Kids Theater Unlock Rewards
 * 只有小禮物解鎖
 */
export const littleKidsUnlocks: SessionUnlockConfig = {
  sessionType: 'little-kids',
  rewards: [
    {
      id: 'gift',
      name_zh: '小禮物',
      name_en: 'Gift',
      icon: '🎁',
      threshold: 15,
    },
  ],
};

/**
 * Big Kids Animation Unlock Rewards
 * 14位→小禮物，18位→升級版
 */
export const bigKidsUnlocks: SessionUnlockConfig = {
  sessionType: 'big-kids',
  rewards: [
    {
      id: 'gift',
      name_zh: '小禮物',
      name_en: 'Gift',
      icon: '🎁',
      threshold: 14,
    },
    {
      id: 'upgraded',
      name_zh: '升級版',
      name_en: 'Upgraded',
      icon: '✨',
      threshold: 18,
    },
  ],
};

/**
 * Family Session Unlock Rewards
 * 10組→小禮物，12組→升級版
 */
export const familyUnlocks: SessionUnlockConfig = {
  sessionType: 'family',
  rewards: [
    {
      id: 'gift',
      name_zh: '小禮物',
      name_en: 'Gift',
      icon: '🎁',
      threshold: 10,
    },
    {
      id: 'upgraded',
      name_zh: '升級版',
      name_en: 'Upgraded',
      icon: '✨',
      threshold: 12,
    },
  ],
};

/**
 * Get unlock config by session type
 */
export function getUnlockConfig(sessionType: 'little-kids' | 'big-kids' | 'family'): SessionUnlockConfig {
  switch (sessionType) {
    case 'little-kids':
      return littleKidsUnlocks;
    case 'big-kids':
      return bigKidsUnlocks;
    case 'family':
      return familyUnlocks;
  }
}

/**
 * Determine session type from session data
 */
export function determineSessionType(price: number, ageMin: number | null, ageMax: number | null): 'little-kids' | 'big-kids' | 'family' {
  // Family sessions: $5500
  if (price === 5500) {
    return 'family';
  }
  
  // Little kids: $2800, ages 5-7
  if (price === 2800 && ageMin === 5 && ageMax === 7) {
    return 'little-kids';
  }
  
  // Big kids: $3600, ages 8-13
  if (price === 3600 && ageMin === 8 && ageMax === 13) {
    return 'big-kids';
  }
  
  // Default to family for unknown types
  return 'family';
}

/**
 * Calculate which rewards are unlocked
 */
export function calculateUnlockedRewards(
  currentRegistrations: number,
  sessionType: 'little-kids' | 'big-kids' | 'family'
): {
  unlocked: UnlockReward[];
  nextReward: UnlockReward | null;
  progress: number; // 0-100
} {
  const config = getUnlockConfig(sessionType);
  const unlocked: UnlockReward[] = [];
  let nextReward: UnlockReward | null = null;
  
  for (const reward of config.rewards) {
    if (currentRegistrations >= reward.threshold) {
      unlocked.push(reward);
    } else if (nextReward === null) {
      nextReward = reward;
    }
  }
  
  // Calculate progress to next reward
  let progress = 100;
  if (nextReward !== null) {
    const previousThreshold = unlocked.length > 0 ? unlocked[unlocked.length - 1].threshold : 0;
    const range = nextReward.threshold - previousThreshold;
    const current = currentRegistrations - previousThreshold;
    progress = Math.min(100, Math.max(0, (current / range) * 100));
  }
  
  return {
    unlocked,
    nextReward,
    progress,
  };
}
