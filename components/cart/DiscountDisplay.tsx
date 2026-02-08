'use client';

import { getDiscountTierLabel, getDiscountExplanation } from '@/lib/api/discount-calculator';

interface DiscountDisplayProps {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  discountTier: '0' | '300' | '400';
  language: 'zh' | 'en';
  variant?: 'light' | 'dark'; // light for cart sidebar, dark for sessions page
}

/**
 * Discount display component for cart
 * Shows discount tier, amount, and explanation
 */
export function DiscountDisplay({
  originalTotal,
  discountAmount,
  finalTotal,
  discountTier,
  language,
  variant = 'dark',
}: DiscountDisplayProps) {
  const tierLabel = getDiscountTierLabel(discountTier, language);
  const explanation = getDiscountExplanation(discountTier, language);

  const textColor = variant === 'light' ? 'text-brand-midnight/70' : 'text-white/80';
  const titleColor = variant === 'light' ? 'text-brand-navy' : 'text-white';
  const accentColor = variant === 'light' ? 'text-semantic-success' : 'text-accent-aurora';
  const bgColor = variant === 'light' ? 'bg-accent-aurora/10 border-accent-aurora/30' : 'bg-accent-aurora/10 border-accent-aurora/30';
  const badgeBg = variant === 'light' ? 'bg-gradient-to-r from-accent-moon/20 to-accent-aurora/20 border-accent-aurora/50' : 'bg-gradient-to-r from-accent-moon/20 to-accent-aurora/20 border-accent-aurora/50';

  return (
    <div className="space-y-3">
      {/* Original Total */}
      <div className={`flex items-center justify-between ${textColor}`}>
        <span>{language === 'zh' ? '課程費用' : 'Course Fees'}</span>
        <span className="font-mono">${originalTotal.toLocaleString()}</span>
      </div>

      {/* Discount */}
      {discountAmount > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`${accentColor} font-semibold`}>{tierLabel}</span>
              {discountTier === '400' && (
                <span className={`px-2 py-0.5 ${bgColor} border rounded-full text-xs ${accentColor}`}>
                  {language === 'zh' ? '最高優惠' : 'Max Discount'}
                </span>
              )}
            </div>
            <span className={`font-mono ${accentColor} font-bold`}>-${discountAmount.toLocaleString()}</span>
          </div>

          {/* Explanation */}
          <div className={`px-3 py-2 ${bgColor} border rounded-lg`}>
            <p className={`text-xs ${accentColor}`}>{explanation}</p>
          </div>
        </>
      )}

      {/* Divider */}
      <div className={`h-px bg-gradient-to-r from-transparent ${variant === 'light' ? 'via-brand-frost' : 'via-white/30'} to-transparent`} />

      {/* Final Total */}
      <div className={`flex items-center justify-between text-xl font-bold`}>
        <span className={titleColor}>{language === 'zh' ? '總計' : 'Total'}</span>
        <span className={`font-mono ${variant === 'light' ? 'text-brand-navy' : 'text-accent-aurora'}`}>${finalTotal.toLocaleString()}</span>
      </div>

      {/* Savings Badge */}
      {discountAmount > 0 && (
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 ${badgeBg} border-2 rounded-full`}>
            <svg className={`w-5 h-5 ${accentColor}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className={`text-sm font-bold ${accentColor}`}>
              {language === 'zh' ? `已省下 ${discountAmount.toLocaleString()}` : `Saved ${discountAmount.toLocaleString()}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
