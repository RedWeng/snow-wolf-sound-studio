/**
 * Discount Calculator for Snow Wolf Recording Party
 * 
 * Rules (同一筆訂單內):
 * - 2場/2人以上 → 每項目 -$300
 * - 3場/3人以上 → 每項目 -$400 (上限)
 * - 適用於: 場次票價、家庭場、加購項目
 * - 每一個場次/家庭/加購，最高回饋 -$400
 * - 回饋擇一，不疊加
 */

export interface CartItem {
  id: string;
  sessionId: string;
  childId?: string;        // For individual tickets
  familyId?: string;       // For family sessions
  isAddon?: boolean;       // For addon purchases
  price: number;
  type: 'individual' | 'family' | 'addon';
}

export interface DiscountResult {
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  itemDiscounts: Map<string, number>; // itemId -> discount amount
  discountTier: '0' | '300' | '400';
}

/**
 * Calculate discount for a cart
 * @param items Cart items
 * @returns Discount calculation result
 */
export function calculateDiscount(items: CartItem[]): DiscountResult {
  const originalTotal = items.reduce((sum, item) => sum + item.price, 0);
  
  // Count unique sessions/families/addons
  const uniqueSessionIds = new Set<string>();
  const uniqueChildIds = new Set<string>();
  const uniqueFamilyIds = new Set<string>();
  
  items.forEach(item => {
    if (item.type === 'family') {
      uniqueFamilyIds.add(item.familyId || item.sessionId);
    } else if (item.type === 'individual') {
      uniqueChildIds.add(item.childId || '');
    }
    uniqueSessionIds.add(item.sessionId);
  });
  
  // Determine discount tier
  // Count: sessions + families + addons
  const totalCount = items.length;
  const uniqueChildCount = uniqueChildIds.size;
  const uniqueFamilyCount = uniqueFamilyIds.size;
  
  let discountPerItem = 0;
  let discountTier: '0' | '300' | '400' = '0';
  
  // Rule: 2場/2人以上 → -300
  // Rule: 3場/3人以上 → -400
  if (totalCount >= 3 || uniqueChildCount >= 3 || uniqueFamilyCount >= 2) {
    discountPerItem = 400;
    discountTier = '400';
  } else if (totalCount >= 2 || uniqueChildCount >= 2 || uniqueFamilyCount >= 1) {
    discountPerItem = 300;
    discountTier = '300';
  }
  
  // Apply discount to each item (max -400 per item)
  const itemDiscounts = new Map<string, number>();
  let totalDiscount = 0;
  
  items.forEach(item => {
    const discount = Math.min(discountPerItem, 400, item.price); // Cannot exceed item price
    itemDiscounts.set(item.id, discount);
    totalDiscount += discount;
  });
  
  return {
    originalTotal,
    discountAmount: totalDiscount,
    finalTotal: originalTotal - totalDiscount,
    itemDiscounts,
    discountTier,
  };
}

/**
 * Format discount tier for display
 */
export function getDiscountTierLabel(tier: '0' | '300' | '400', language: 'zh' | 'en'): string {
  if (tier === '0') return '';
  
  if (language === 'zh') {
    return tier === '300' ? '多人優惠 -$300/項' : '多人優惠 -$400/項';
  } else {
    return tier === '300' ? 'Multi-person Discount -$300/item' : 'Multi-person Discount -$400/item';
  }
}

/**
 * Get discount explanation
 */
export function getDiscountExplanation(tier: '0' | '300' | '400', language: 'zh' | 'en'): string {
  if (tier === '0') {
    return language === 'zh' 
      ? '報名2場/2人以上即享優惠' 
      : 'Discount available for 2+ sessions/people';
  }
  
  if (tier === '300') {
    return language === 'zh'
      ? '已享2場/2人優惠！再加1場/1人升級至-$400/項'
      : '2+ discount applied! Add 1 more for -$400/item';
  }
  
  return language === 'zh'
    ? '已享最高優惠！每項目折扣$400'
    : 'Maximum discount applied! $400 off per item';
}
