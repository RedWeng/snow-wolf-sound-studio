'use client';

import { getAllAddons } from '@/lib/config/addons';
import { Session } from '@/lib/types/database';

interface AddonSelectorProps {
  session: Session;
  onAddonToggle: (addonId: string, selected: boolean) => void;
  selectedAddons: Set<string>;
  language: 'zh' | 'en';
  isYoungKids?: boolean; // Add this prop to determine color scheme
}

/**
 * Addon selection component
 * Allows users to add optional addons to their registration
 * Shows remaining slots per session (max 4 per session)
 */
export function AddonSelector({
  session,
  onAddonToggle,
  selectedAddons,
  language,
  isYoungKids = false, // Default to false (older kids style)
}: AddonSelectorProps) {
  const addons = getAllAddons();

  if (addons.length === 0) {
    return null;
  }

  // Color scheme based on session type
  const colors = isYoungKids ? {
    // 小小孩場 - 深色文字
    headerBg: 'from-purple-100 to-pink-100 border-purple-300',
    headerIcon: 'text-purple-700',
    headerText: 'text-purple-900',
    buttonUnselected: 'bg-daylight-tag-bg border-2 border-daylight-button-border hover:bg-daylight-button-bg hover:border-daylight-button-border',
    buttonSelected: 'bg-gradient-to-r from-purple-200/60 to-pink-200/60 border-2 border-purple-400 shadow-lg shadow-purple-500/20',
    buttonDisabled: 'bg-gray-200/40 border-2 border-gray-300/40 opacity-60 cursor-not-allowed',
    titleText: 'text-daylight-title',
    titleDisabled: 'text-gray-500',
    descText: 'text-daylight-body',
    descDisabled: 'text-gray-400',
    priceText: 'text-purple-700',
    priceDisabled: 'text-gray-400',
    metaText: 'text-daylight-body',
    metaDisabled: 'text-gray-400',
    checkboxBorder: 'border-daylight-button-border',
    checkboxBorderDisabled: 'border-gray-400/50 bg-gray-300/20',
  } : {
    // 大小孩場 - 淺色文字
    headerBg: 'from-purple-500/20 to-pink-500/20 border-purple-400/50',
    headerIcon: 'text-purple-300',
    headerText: 'text-white',
    buttonUnselected: 'bg-white/10 border-2 border-white/30 hover:bg-white/15 hover:border-purple-400/50',
    buttonSelected: 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400/70 shadow-lg shadow-purple-500/20',
    buttonDisabled: 'bg-gray-600/20 border-2 border-gray-500/40 opacity-60 cursor-not-allowed',
    titleText: 'text-white',
    titleDisabled: 'text-white/50',
    descText: 'text-white/70',
    descDisabled: 'text-white/40',
    priceText: 'text-accent-aurora',
    priceDisabled: 'text-gray-400',
    metaText: 'text-white/60',
    metaDisabled: 'text-white/40',
    checkboxBorder: 'border-white/50',
    checkboxBorderDisabled: 'border-gray-500/50 bg-gray-600/20',
  };

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${colors.headerBg} border-2 rounded-xl`}>
        <svg className={`w-5 h-5 ${colors.headerIcon}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
        <span className={`font-bold ${colors.headerText} text-sm`}>
          {language === 'zh' ? '✨ 加購選項' : '✨ Add-ons'}
        </span>
      </div>

      {addons.map(addon => {
        const isSelected = selectedAddons.has(addon.id);
        const name = language === 'zh' ? addon.name_zh : addon.name_en;
        const description = language === 'zh' ? addon.description_zh : addon.description_en;
        
        // Get current addon registrations for this session
        const currentRegistrations = session.addon_registrations?.[addon.id] || 0;
        const remaining = addon.max_per_session - currentRegistrations;
        const isFull = remaining <= 0;
        const isDisabled = isFull && !isSelected;

        return (
          <button
            key={addon.id}
            onClick={() => !isDisabled && onAddonToggle(addon.id, !isSelected)}
            disabled={isDisabled}
            className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 ${
              isDisabled
                ? colors.buttonDisabled
                : isSelected
                  ? colors.buttonSelected
                  : colors.buttonUnselected
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <div className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                isDisabled
                  ? colors.checkboxBorderDisabled
                  : isSelected 
                    ? 'bg-purple-500 border-purple-500' 
                    : colors.checkboxBorder
              }`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isDisabled && !isSelected && (
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-bold ${isDisabled ? colors.titleDisabled : colors.titleText}`}>{name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isDisabled ? colors.priceDisabled : colors.priceText}`}>
                      ${addon.price.toLocaleString()}
                    </span>
                    <span className={`text-xs ${isDisabled ? colors.metaDisabled : colors.metaText}`}>
                      / {language === 'zh' ? '組' : 'group'}
                    </span>
                  </div>
                </div>
                <p className={`text-sm mb-2 ${isDisabled ? colors.descDisabled : colors.descText}`}>{description}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className={isDisabled ? colors.metaDisabled : colors.metaText}>
                    ⏱ {addon.duration_minutes} {language === 'zh' ? '分鐘' : 'min'}
                  </span>
                  {isFull ? (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      🔒 {language === 'zh' ? '本場次已額滿' : 'Full for this session'}
                    </span>
                  ) : remaining <= 2 ? (
                    <span className="text-orange-600 font-bold flex items-center gap-1 animate-pulse">
                      🔥 {language === 'zh' ? `剩下 ${remaining} 組` : `${remaining} left`}
                    </span>
                  ) : (
                    <span className={isDisabled ? colors.metaDisabled : colors.metaText}>
                      👥 {language === 'zh' ? `剩下 ${remaining}/${addon.max_per_session} 組` : `${remaining}/${addon.max_per_session} available`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
