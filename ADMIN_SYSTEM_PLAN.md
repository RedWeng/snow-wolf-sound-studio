# 管理後台系統規劃

## 系統架構

### 1. 主要功能模組

#### 📊 儀表板 (Dashboard)
- **路徑**: `/admin/dashboard`
- **功能**:
  - 今日/本週/本月統計數據
  - 待處理事項提醒
  - 最近訂單列表
  - 即將開始的課程
  - 收入統計圖表
  - 快速操作按鈕

#### 📅 課程管理 (Sessions Management)
- **路徑**: `/admin/sessions`
- **功能**:
  - 課程列表（篩選、搜尋、排序）
  - 新增課程
  - 編輯課程（包含角色管理）
  - 複製課程
  - 刪除課程
  - 課程狀態管理
  - 角色容量管理

**子頁面**:
- `/admin/sessions/new` - 新增課程
- `/admin/sessions/[id]/edit` - 編輯課程
- `/admin/sessions/[id]/registrations` - 查看報名名單
- `/admin/sessions/[id]/attendance` - 點名/出席管理

#### 👥 報名名單管理 (Registrations Management)
- **路徑**: `/admin/registrations`
- **功能**:
  - 所有報名記錄
  - 按課程篩選
  - 按狀態篩選（已確認/待確認/已取消）
  - 搜尋參加者
  - 匯出名單（CSV/Excel）
  - 查看參加者詳細資訊
  - 修改報名資訊
  - 取消報名

#### 📦 訂單管理 (Orders Management)
- **路徑**: `/admin/orders`
- **功能**:
  - 訂單列表
  - 訂單狀態（待付款/已付款/已完成/已取消/退款中）
  - 付款方式篩選
  - 金額統計
  - 訂單詳情查看
  - 編輯訂單
  - 確認付款
  - 處理退款
  - 匯出訂單資料

**子頁面**:
- `/admin/orders/[orderNumber]` - 訂單詳情
- `/admin/orders/[orderNumber]/edit` - 編輯訂單

#### ⏰ 候補名單 (Waitlist Management)
- **路徑**: `/admin/waitlist`
- **功能**:
  - 候補名單列表
  - 按課程分組
  - 候補順序管理
  - 通知候補者
  - 轉為正式報名
  - 移除候補

#### 👨‍👩‍👧‍👦 參加者管理 (Participants Management)
- **路徑**: `/admin/participants`
- **功能**:
  - 所有參加者（小孩）列表
  - 參加歷史記錄
  - 徽章獲得記錄
  - 家長聯絡資訊
  - 搜尋參加者
  - 匯出參加者資料

#### 💰 財務報表 (Financial Reports)
- **路徑**: `/admin/reports`
- **功能**:
  - 收入統計
  - 課程收入分析
  - 付款方式統計
  - 退款記錄
  - 日/週/月/年報表
  - 匯出報表

#### ⚙️ 系統設定 (Settings)
- **路徑**: `/admin/settings`
- **功能**:
  - 網站基本設定
  - 付款方式設定
  - Email 模板設定
  - 徽章系統設定
  - 管理員帳號管理

---

## 導航結構

### 主導航列（頂部）
```
[Logo] 雪狼管理後台
├─ 儀表板
├─ 課程管理
├─ 報名名單
├─ 訂單管理
├─ 候補名單
├─ 參加者
├─ 財務報表
└─ 設定

[使用者資訊] [登出]
```

### 快速操作（每個頁面右上角）
- 新增課程
- 查看最新訂單
- 通知候補者

---

## 頁面優先順序

### Phase 1 - 核心功能（立即實作）
1. ✅ 管理者登入
2. ✅ 課程管理（列表、新增、編輯、刪除）
3. ✅ 訂單管理（列表、查看）
4. ✅ 候補名單
5. 🔄 統一導航列

### Phase 2 - 進階功能
6. 儀表板
7. 報名名單管理
8. 參加者管理
9. 財務報表

### Phase 3 - 優化功能
10. 系統設定
11. 匯出功能
12. 進階篩選
13. 批次操作

---

## 資料庫需求

### 需要的資料表
- ✅ `sessions` - 課程
- ✅ `session_roles` - 課程角色
- ✅ `session_addon_registrations` - 加購項目
- 🔄 `orders` - 訂單
- 🔄 `order_items` - 訂單項目
- 🔄 `registrations` - 報名記錄
- 🔄 `waitlist` - 候補名單
- 🔄 `children` - 參加者（小孩）
- 🔄 `users` - 使用者（家長）
- 🔄 `badges` - 徽章記錄

---

## UI/UX 設計原則

### 1. 一致性
- 所有頁面使用統一的導航列
- 統一的按鈕樣式和顏色
- 統一的表格設計
- 統一的表單樣式

### 2. 易用性
- 清晰的麵包屑導航
- 明確的操作按鈕
- 即時的操作反饋
- 錯誤提示清楚

### 3. 效率
- 快速搜尋功能
- 批次操作
- 鍵盤快捷鍵
- 常用操作快速入口

### 4. 資訊呈現
- 重要資訊突出顯示
- 使用圖表視覺化數據
- 狀態用顏色區分
- 適當的分頁和篩選

---

## 權限管理（未來擴充）

### 角色定義
1. **超級管理員** - 所有權限
2. **課程管理員** - 課程、報名、候補
3. **財務管理員** - 訂單、財務報表
4. **客服人員** - 查看訂單、處理候補

---

## 技術實作

### 1. 統一導航元件
```typescript
<AdminNav 
  currentPage="sessions"
  user={adminUser}
  onLogout={handleLogout}
/>
```

### 2. 統一頁面佈局
```typescript
<AdminLayout>
  <AdminNav />
  <main>
    {children}
  </main>
</AdminLayout>
```

### 3. 統一資料載入
```typescript
const { data, loading, error } = useAdminData('/api/admin/sessions');
```

### 4. 統一操作確認
```typescript
const confirmed = await confirmDialog({
  title: '確認刪除',
  message: '確定要刪除這個課程嗎？',
  confirmText: '刪除',
  cancelText: '取消',
});
```

---

## 下一步行動

### 立即執行
1. 建立統一的 AdminNav 元件
2. 更新所有管理頁面使用統一導航
3. 建立儀表板頁面
4. 建立報名名單管理頁面
5. 優化訂單管理頁面

### 本週完成
- 所有核心管理功能
- 統一的 UI/UX
- 基本的資料匯出功能

### 下週規劃
- 財務報表
- 進階篩選
- 批次操作
- 系統設定
