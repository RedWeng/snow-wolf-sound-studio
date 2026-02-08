'use client';

import { calculateUnlockedRewards, determineSessionType } from '@/lib/config/unlock-rewards';

interface UnlockRewardsDisplayProps {
  sessionPrice: number;
  ageMin: number | null;
  ageMax: number | null;
  currentRegistrations: number;
  language: 'zh' | 'en';
}

/**
 * Gamified unlock rewards display
 * Shows unlocked rewards without revealing exact numbers
 */
export function UnlockRewardsDisplay({
  sessionPrice,
  ageMin,
  ageMax,
  currentRegistrations,
  language,
}: UnlockRewardsDisplayProps) {
  const sessionType = determineSessionType(sessionPrice, ageMin, ageMax);
  const { unlocked, nextReward, progress } = calculateUnlockedRewards(currentRegistrations, sessionType);

  if (unlocked.length === 0 && !nextReward) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Unlocked Rewards - Glowing style */}
      {unlocked.map(reward => (
        <div
          key={reward.id}
          className="relative group"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-aurora to-accent-moon rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
          
          {/* Content */}
          <div className="relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-accent-aurora/30 to-accent-moon/30 border-2 border-accent-aurora rounded-xl backdrop-blur-sm">
            <div className="text-3xl animate-bounce">{reward.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg">
                {language === 'zh' ? reward.name_zh : reward.name_en}
              </div>
              <div className="text-sm text-accent-aurora font-semibold">
                {language === 'zh' ? '已解鎖！' : 'Unlocked!'}
              </div>
            </div>
            {/* Sparkles */}
            <div className="flex gap-1">
              <span className="text-accent-aurora text-xl animate-pulse">✨</span>
              <span className="text-accent-moon text-xl animate-pulse delay-100">✨</span>
            </div>
          </div>
        </div>
      ))}

      {/* Next Reward (Locked) - Mystery box style */}
      {nextReward && (
        <div className="relative">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border-2 border-dashed border-white/30 rounded-xl backdrop-blur-sm">
            <div className="text-3xl grayscale opacity-40">{nextReward.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-white/60">
                {language === 'zh' ? '神秘獎勵' : 'Mystery Reward'}
              </div>
              <div className="text-xs text-white/40">
                {language === 'zh' ? '冒險者集結中...' : 'Gathering adventurers...'}
              </div>
            </div>
            {/* Lock icon with pulse */}
            <div className="text-2xl opacity-30 animate-pulse">🔒</div>
          </div>
          
          {/* Progress Bar - Energy bar style */}
          <div className="mt-2 h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-accent-moon via-accent-aurora to-accent-ice transition-all duration-500 relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
