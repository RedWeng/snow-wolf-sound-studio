# 加購項目購物車修正 - Addon Cart Integration Fix

## 問題描述 (Problem Description)

**問題：** 用戶選擇加購項目（家庭動畫錄音）後，點擊「加入購物車」時，加購項目沒有被添加到購物車中。

**Issue:** When users select addon items (Family Animation Recording) and click "Add to Cart", the addon items were not being added to the shopping cart.

---

## 根本原因 (Root Cause)

**檔案：** `app/sessions/page.tsx`

`handleAddToCart` 函數只處理了孩子的課程項目，完全忽略了 `sessionAddonSelections` 狀態中的加購選擇。

```typescript
// 修正前 - 只添加孩子的課程
const handleAddToCart = (sessionId: string) => {
  // ... 只處理 childIdsToAdd
  const newItems: CartItem[] = childIdsToAdd.map(cId => {
    // ... 創建課程項目
  });
  
  setCartItems(prev => [...prev, ...newItems]);
  // ❌ 沒有處理 sessionAddonSelections
};
```

---

## 修正內容 (Fix Applied)

### 1. 添加 Addon 項目到購物車

**檔案：** `app/sessions/page.tsx` - `handleAddToCart` 函數

**修正後：**

```typescript
const handleAddToCart = (sessionId: string) => {
  const session = mockSessions.find(s => s.id === sessionId);
  if (!session) return;

  // 1. 添加孩子的課程項目
  const childIdsToAdd = getSessionSelection(sessionId)?.childIds || [];
  const newItems: CartItem[] = childIdsToAdd.map(cId => {
    // ... 創建課程項目
  }).filter(Boolean) as CartItem[];

  // 2. ✅ CRITICAL: 添加加購項目
  const selectedAddons = sessionAddonSelections[sessionId];
  if (selectedAddons && selectedAddons.size > 0) {
    selectedAddons.forEach(addonId => {
      const { getAddonById } = require('@/lib/config/addons');
      const addon = getAddonById(addonId);
      
      if (addon) {
        newItems.push({
          id: `${sessionId}-addon-${addonId}-${Date.now()}`,
          sessionId: session.id,
          sessionTitle: `${language === 'zh' ? '【加購】' : '[Add-on] '}${language === 'zh' ? addon.name_zh : addon.name_en}`,
          sessionDate: new Date(session.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US'),
          sessionTime: session.time,
          price: addon.price,
          childId: `addon-${sessionId}`, // 特殊 ID 用於分組
          childName: language === 'zh' ? '加購項目' : 'Add-on Item',
          childAge: 0,
          roleId: null,
        });
      }
    });
  }

  setCartItems(prev => [...prev, ...newItems]);
  setIsCartOpen(true);
};
```

---

## 關鍵設計決策 (Key Design Decisions)

### 1. Addon 項目的 `childId`

**問題：** Addon 不屬於特定孩子，如何在購物車中分組顯示？

**解決方案：** 使用特殊的 `childId` 格式：`addon-${sessionId}`

**原因：**
- CartSidebar 使用 `childId` 來分組顯示項目
- 使用 `addon-${sessionId}` 可以將同一場次的 addon 分組在一起
- 避免與真實的孩子 ID 衝突

### 2. Addon 項目的顯示名稱

**sessionTitle：** 添加前綴標識
- 中文：`【加購】家庭動畫錄音（開放2-5人一起）`
- 英文：`[Add-on] Family Animation Recording (2-5 people)`

**childName：** 分組標題
- 中文：`加購項目`
- 英文：`Add-on Item`

### 3. Addon 項目的價格

直接使用 `addon.price`（$4,500），會參與折扣計算。

---

## 購物車顯示效果 (Cart Display)

### 範例：用戶選擇 2 位孩子 + 1 個加購

```
購物車內容：

👤 小明 (8歲)
  📅 雪狼經典場 × 擬音錄音
  📅 2026/4/12 · 13:00
  💰 NT$5,500

👤 小華 (6歲)
  📅 雪狼經典場 × 擬音錄音
  📅 2026/4/12 · 13:00
  💰 NT$5,500

🎁 加購項目
  📅 【加購】家庭動畫錄音（開放2-5人一起）
  📅 2026/4/12 · 13:00
  💰 NT$4,500

---
小計：NT$15,500
折扣：-NT$400 (3場/3人)
總計：NT$15,100
```

---

## 折扣計算 (Discount Calculation)

加購項目**會參與折扣計算**：

### 範例 1：2 位孩子 + 1 個加購
- 項目數：3 項
- 折扣條件：3 場/3 人 → -$400
- 小計：$5,500 + $5,500 + $4,500 = $15,500
- 折扣：-$400
- **總計：$15,100**

### 範例 2：1 位孩子 + 1 個加購
- 項目數：2 項
- 折扣條件：2 場/2 人 → -$300
- 小計：$5,500 + $4,500 = $10,000
- 折扣：-$300
- **總計：$9,700**

---

## 測試場景 (Test Scenarios)

### 場景 1：只選課程，不選加購
- **操作：** 選擇 2 位孩子，不勾選加購
- **預期：** 購物車只有 2 個課程項目

### 場景 2：選課程 + 加購
- **操作：** 選擇 2 位孩子，勾選加購
- **預期：** 購物車有 2 個課程項目 + 1 個加購項目

### 場景 3：只選加購，不選課程
- **操作：** 不選孩子，只勾選加購
- **預期：** 購物車只有 1 個加購項目

### 場景 4：多場次，每場都有加購
- **操作：** 
  - 場次 A：選 1 位孩子 + 加購
  - 場次 B：選 1 位孩子 + 加購
- **預期：** 購物車有 4 個項目（2 課程 + 2 加購）

---

## 相關檔案 (Related Files)

1. **`app/sessions/page.tsx`** - 修正 `handleAddToCart` 函數
2. **`lib/config/addons.ts`** - Addon 配置（價格、名稱等）
3. **`components/cart/CartSidebar.tsx`** - 購物車顯示邏輯
4. **`lib/api/discount-calculator.ts`** - 折扣計算（包含 addon）
5. **`lib/context/CartContext.tsx`** - CartItem 型別定義

---

## 未來改進 (Future Improvements)

### 1. Addon 專屬顯示區域
目前 addon 混在孩子分組中顯示，可以考慮：
- 在購物車底部單獨顯示「加購項目」區域
- 使用不同的視覺樣式（如不同背景色）

### 2. Addon 數量控制
目前每個場次只能選 1 次加購，未來可以考慮：
- 允許選擇數量（如 2 組加購）
- 顯示剩餘可選數量

### 3. Addon 與課程的關聯顯示
在購物車中明確顯示 addon 屬於哪個場次：
```
📅 雪狼經典場 × 擬音錄音 (2026/4/12)
  👤 小明 - NT$5,500
  👤 小華 - NT$5,500
  🎁 加購：家庭動畫錄音 - NT$4,500
```

---

## 驗證清單 (Verification Checklist)

- [x] `handleAddToCart` 添加 addon 邏輯
- [x] Addon 項目使用特殊 `childId` 格式
- [x] Addon 項目顯示名稱添加前綴
- [x] Build 成功無錯誤
- [ ] 手動測試：選課程 + 加購
- [ ] 手動測試：只選加購
- [ ] 手動測試：多場次多加購
- [ ] 驗證折扣計算包含 addon
- [ ] 驗證結帳流程包含 addon

---

## 總結 (Summary)

此次修正解決了加購項目無法添加到購物車的問題：

1. ✅ **添加 Addon 邏輯** - `handleAddToCart` 現在會檢查並添加選中的 addon
2. ✅ **正確分組顯示** - 使用特殊 `childId` 格式讓 addon 正確分組
3. ✅ **清晰標識** - 添加【加購】前綴，用戶一眼就能識別
4. ✅ **參與折扣** - Addon 價格會參與折扣計算

**關鍵改進：** 從只處理課程項目，到完整處理課程 + 加購項目！

---

**修正日期：** 2026-02-03
**修正人員：** Kiro AI Assistant
**測試狀態：** Build 成功，待手動測試驗證
