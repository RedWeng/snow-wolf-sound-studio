/**
 * Milestone Progress Component
 * 
 * 里程碑進度展示 - 顯示徽章收集進度和獎勵
 */

'use client';

import { milestoneRewards, getNextMilestone, getAchievedMilestones } from '@/lib/config/badges';

interface MilestoneProgressProps {
  currentBadgeCount: number;
  language?: 'zh' | 'en';
}

export function MilestoneProgress({ currentBadgeCount, language = 'zh' }: MilestoneProgressProps) {
  const nextMilestone = getNextMilestone(currentBadgeCount);
  const achievedMilestones = getAchievedMilestones(currentBadgeCount);

  return (
    <div className="bg-gradient-to-br from-brand-steel/20 to-brand-steel/10 border-2 border-accent-moon/30 rounded-xl p-6">
      {/* Header */}
      <h2 className="text-2xl font-heading text-brand-snow mb-6">
        {language === 'zh' ? '里程碑獎勵' : 'Milestone Rewards'}
      </h2>

      {/* Milestone Timeline */}
      <div className="space-y-6">
        {milestoneRewards.map((milestone, index) => {
          const isAchieved = currentBadgeCount >= milestone.badge_count;
          const isNext = nextMilestone?.id === milestone.id;
          const progress = isNext 
            ? (currentBadgeCount / milestone.badge_count) * 100 
            : isAchieved ? 100 : 0;

          return (
            <div key={milestone.id} className="relative">
              {/* Connection Line */}
              {index < milestoneRewards.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-brand-frost/20" />
              )}

              <div className={`
                relative flex items-start gap-4 p-4 rounded-lg transition-all
                ${isAchieved 
                  ? 'bg-accent-moon/10 border-2 border-accent-moon/50' 
                  : isNext
                  ? 'bg-brand-midnight/30 border-2 border-brand-frost/30'
                  : 'bg-brand-midnight/20 border-2 border-brand-frost/10 opacity-60'
                }
              `}>
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold
                  ${isAchieved 
                    ? 'bg-accent-moon text-brand-midnight' 
                    : 'bg-brand-steel/30 text-brand-frost/50'
                  }
                `}>
                  {isAchieved ? '✓' : milestone.badge_count}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`
                      font-heading text-lg
                      ${isAchieved ? 'text-accent-moon' : 'text-brand-snow'}
                    `}>
                      {language === 'zh' ? milestone.name_zh : milestone.name_en}
                    </h3>
                    <span className={`
                      text-sm font-bold
                      ${isAchieved ? 'text-accent-moon' : 'text-brand-frost/60'}
                    `}>
                      {milestone.badge_count} {language === 'zh' ? '個徽章' : 'Badges'}
                    </span>
                  </div>

                  <p className={`
                    text-sm mb-3
                    ${isAchieved ? 'text-brand-frost' : 'text-brand-frost/60'}
                  `}>
                    {language === 'zh' ? milestone.description_zh : milestone.description_en}
                  </p>

                  {/* Progress Bar (for next milestone) */}
                  {isNext && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-brand-frost/60">
                        <span>{currentBadgeCount} / {milestone.badge_count}</span>
                        <span>{Math.floor(progress)}%</span>
                      </div>
                      <div className="w-full bg-brand-midnight/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-accent-moon to-accent-ice h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-accent-moon mt-2">
                        {language === 'zh' 
                          ? `還需要 ${milestone.badge_count - currentBadgeCount} 個徽章！` 
                          : `${milestone.badge_count - currentBadgeCount} more badges needed!`
                        }
                      </p>
                    </div>
                  )}

                  {/* Achieved Badge */}
                  {isAchieved && (
                    <div className="flex items-center gap-2 text-accent-moon text-sm font-medium">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {language === 'zh' ? '已達成！' : 'Achieved!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-brand-frost/20 text-center">
        <p className="text-brand-frost/60 text-sm">
          {language === 'zh' 
            ? `已達成 ${achievedMilestones.length} / ${milestoneRewards.length} 個里程碑` 
            : `Achieved ${achievedMilestones.length} / ${milestoneRewards.length} milestones`
          }
        </p>
      </div>
    </div>
  );
}
