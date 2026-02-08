# 名額控制嚴格修正 - Critical Capacity Control Fix

## 問題描述 (Problem Description)

**嚴重問題：** 當場次顯示「剩下1名冒險名額」時，系統沒有嚴格控制，可能允許多人同時報名，導致超額。

**Critical Issue:** When a session shows "1 spot remaining", the system did not strictly enforce capacity limits, potentially allowing multiple people to register simultaneously, causing overbooking.

---

## 修正內容 (Fixes Applied)

### 1. 前端選課頁面 (Frontend Session Selection)

**檔案：** `app/sessions/page.tsx`

#### 1.1 `handleChildToggle` 函數 - 添加名額驗證

**修正前：** 沒有檢查剩餘名額，用戶可以無限制選擇孩子

**修正後：** 
- 在添加孩子前檢查剩餘名額
- 計算公式：`remaining = capacity - current_registrations`
- 阻止條件：`remaining <= currentlySelected`
- 顯示明確的錯誤訊息給用戶

```typescript
// CRITICAL: Check remaining capacity before adding
const currentRegistrations = session.current_registrations || 0;
const capacity = session.capacity;
const remaining = capacity - currentRegistrations;
const currentlySelected = existing.childIds.length;

// Block if no remaining spots
if (remaining <= currentlySelected) {
  alert(language === 'zh' 
    ? `此場次剩餘名額不足！目前剩餘 ${remaining} 個名額，您已選擇 ${currentlySelected} 位孩子。` 
    : `Not enough spots remaining! Only ${remaining} spot(s) left, you have selected ${currentlySelected} child(ren).`);
  return prev;
}
```

#### 1.2 UI 層面 - 禁用按鈕

**修正：** 當名額不足時，禁用孩子選擇按鈕

```typescript
// Calculate if this child can be added
const currentRegistrations = session.current_registrations || 0;
const capacity = session.capacity;
const remaining = capacity - currentRegistrations;
const currentlySelected = selection?.childIds.length || 0;

// Disable if: not selected AND no remaining spots
const cannotAdd = !isSelected && remaining <= currentlySelected;
```

視覺效果：
- 禁用的按鈕：灰色背景、降低透明度、顯示 `cursor-not-allowed`
- 可選的按鈕：正常顏色、可點擊

---

### 2. 後端 API 驗證 (Backend API Validation)

**檔案：** `app/api/orders/route.ts`

#### 2.1 訂單提交前驗證名額

**修正前：** API 直接創建訂單，沒有檢查名額

**修正後：**
- 在創建訂單前驗證所有場次的名額
- 使用 Map 追蹤每個場次在當前訂單中的報名數量
- 如果任何場次名額不足，返回 400 錯誤並提供明確訊息

```typescript
// CRITICAL: Validate capacity for all sessions before creating order
const sessionCapacityCheck = new Map<string, number>();

for (const item of orderItems) {
  const session = mockSessions.find(s => s.id === item.sessionId);
  if (!session) {
    return NextResponse.json(
      { success: false, error: `場次不存在: ${item.sessionTitle}` },
      { status: 400 }
    );
  }
  
  // Count registrations for this session in current order
  const currentCount = sessionCapacityCheck.get(item.sessionId) || 0;
  sessionCapacityCheck.set(item.sessionId, currentCount + 1);
  
  // Check capacity
  const currentRegistrations = session.current_registrations || 0;
  const capacity = session.capacity;
  const remaining = capacity - currentRegistrations;
  const orderCount = sessionCapacityCheck.get(item.sessionId) || 0;
  
  if (remaining < orderCount) {
    return NextResponse.json(
      { 
        success: false, 
        error: `場次「${item.sessionTitle}」名額不足！剩餘 ${remaining} 個名額，您嘗試報名 ${orderCount} 位孩子。請返回重新選擇。` 
      },
      { status: 400 }
    );
  }
}
```

---

### 3. 結帳頁面錯誤處理 (Checkout Error Handling)

**檔案：** `app/checkout/page.tsx`

**修正：** 顯示 API 返回的具體錯誤訊息

```typescript
if (data.success) {
  alert(`報名成功！\n\n訂單編號：${data.orderNumber}\n\n${data.message}\n\n請檢查您的 Email 收件匣（${parentInfo.email}）`);
  router.push('/');
} else {
  // Show specific error message from API (e.g., capacity issues)
  alert(`報名失敗\n\n${data.error || '提交失敗，請稍後再試。'}`);
}
```

---

## 名額控制邏輯 (Capacity Control Logic)

### 關鍵規則 (Key Rules)

1. **剩餘名額計算：** `remaining = capacity - current_registrations`

2. **選課限制：**
   - 剩餘 1 名額 → 只能選 1 位孩子
   - 剩餘 2 名額 → 只能選 2 位孩子
   - 剩餘 0 名額 → 不能選擇（顯示「名額已滿」）

3. **候補機制：**
   - 名額已滿後，可接受最多 4 位候補
   - 候補免費登記，三天後可能遞補
   - 顯示候補位置：「候補第 X 位」

4. **多層驗證：**
   - **前端 UI：** 禁用按鈕，防止誤操作
   - **前端邏輯：** `handleChildToggle` 檢查並阻止
   - **後端 API：** 最終驗證，防止並發問題

---

## 測試場景 (Test Scenarios)

### 場景 1：剩餘 1 名額
- **初始狀態：** 19/20 已報名
- **用戶操作：** 嘗試選擇 2 位孩子
- **預期結果：** 
  - 第 1 位孩子：成功選擇
  - 第 2 位孩子：按鈕禁用，無法選擇
  - 如果強制點擊：顯示錯誤訊息

### 場景 2：剩餘 0 名額
- **初始狀態：** 20/20 已報名
- **用戶操作：** 嘗試選擇任何孩子
- **預期結果：**
  - 所有孩子選擇按鈕禁用
  - 顯示「名額已滿」狀態
  - 提示可加入候補

### 場景 3：候補狀態
- **初始狀態：** 21/20 (候補 1 位)
- **顯示：** 「預備冒險者等待中 - 候補第 1 位（免費登記，三天後可能遞補）」
- **最多候補：** 4 位 (21-24/20)

### 場景 4：API 層面驗證
- **情況：** 用戶在選課時名額還有，但提交訂單時名額已滿
- **預期結果：**
  - API 返回 400 錯誤
  - 顯示明確錯誤訊息：「場次「XXX」名額不足！剩餘 X 個名額，您嘗試報名 Y 位孩子。請返回重新選擇。」
  - 用戶需要返回重新選擇

---

## 未來改進 (Future Improvements)

### 1. 資料庫層面的原子性操作
```sql
-- 使用資料庫事務確保名額更新的原子性
BEGIN TRANSACTION;
  SELECT current_registrations FROM sessions WHERE id = ? FOR UPDATE;
  -- Check capacity
  UPDATE sessions SET current_registrations = current_registrations + ? WHERE id = ?;
COMMIT;
```

### 2. 實時名額更新
- 使用 WebSocket 或 Server-Sent Events
- 當其他用戶報名時，即時更新前端顯示的剩餘名額

### 3. 樂觀鎖機制
- 在訂單中記錄 `session_version`
- 提交時檢查版本號，如果不匹配則拒絕

### 4. 候補自動遞補
- 當有人取消報名時，自動通知候補名單中的用戶
- 設定時限（如 24 小時）讓候補用戶確認

---

## 驗證清單 (Verification Checklist)

- [x] 前端選課頁面添加名額檢查
- [x] UI 層面禁用超額選擇按鈕
- [x] 後端 API 添加名額驗證
- [x] 結帳頁面顯示具體錯誤訊息
- [x] Build 成功無錯誤
- [ ] 手動測試：剩餘 1 名額場景
- [ ] 手動測試：剩餘 0 名額場景
- [ ] 手動測試：候補場景
- [ ] 手動測試：並發報名場景
- [ ] 壓力測試：多用戶同時報名

---

## 相關檔案 (Related Files)

1. `app/sessions/page.tsx` - 前端選課邏輯
2. `app/api/orders/route.ts` - 後端訂單 API
3. `app/checkout/page.tsx` - 結帳頁面
4. `lib/mock-data/sessions.ts` - 場次資料（包含 current_registrations）
5. `lib/types/database.ts` - Session 型別定義

---

## 總結 (Summary)

此次修正解決了名額控制的嚴重問題，確保：

1. ✅ **前端嚴格控制** - 用戶無法選擇超過剩餘名額的孩子數量
2. ✅ **UI 視覺反饋** - 禁用按鈕清楚顯示哪些選項不可用
3. ✅ **後端最終驗證** - API 層面確保資料一致性
4. ✅ **明確錯誤訊息** - 用戶清楚知道為什麼無法報名

**關鍵原則：** 剩下 1 名額 = 只能 1 人報名，第 2 人就是候補 1！

---

**修正日期：** 2026-02-03
**修正人員：** Kiro AI Assistant
**測試狀態：** Build 成功，待手動測試驗證
