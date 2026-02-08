# 管理員課程管理系統 - 任務清單

## Phase 1: 資料庫設定與配置 (30分鐘)

### 1.1 Supabase 專案設定
- [ ] 建立 Supabase 專案
- [ ] 取得 API URL 和 anon key
- [ ] 設定環境變數到 `.env.local`
- [ ] 安裝 Supabase client 套件

### 1.2 建立資料表
- [ ] 建立 `sessions` 表
- [ ] 建立 `session_roles` 表
- [ ] 建立 `session_addon_registrations` 表
- [ ] 建立索引

### 1.3 設定 Row Level Security (RLS)
- [ ] 啟用 RLS
- [ ] 建立公開讀取政策
- [ ] 建立管理員完整權限政策
- [ ] 測試權限設定

## Phase 2: API 開發 (30分鐘)

### 2.1 建立 Supabase 客戶端
- [ ] 建立 `lib/supabase/client.ts`
- [ ] 建立 `lib/supabase/server.ts`
- [ ] 建立型別定義

### 2.2 Sessions API - 列表與詳情
- [ ] 建立 `app/api/sessions/route.ts`
  - [ ] GET 端點（列表）
  - [ ] POST 端點（新增）
- [ ] 建立 `app/api/sessions/[id]/route.ts`
  - [ ] GET 端點（詳情）
  - [ ] PUT 端點（更新）
  - [ ] DELETE 端點（刪除）

### 2.3 Sessions API - 複製功能
- [ ] 建立 `app/api/sessions/[id]/duplicate/route.ts`
  - [ ] POST 端點（複製課程）

### 2.4 API 驗證與錯誤處理
- [ ] 實作輸入驗證
- [ ] 實作錯誤處理
- [ ] 實作權限檢查
- [ ] 建立標準錯誤回應格式

## Phase 3: 資料存取層 (15分鐘)

### 3.1 建立資料存取函式
- [ ] 建立 `lib/db/sessions.ts`
  - [ ] `getAllSessions()`
  - [ ] `getSessionById()`
  - [ ] `createSession()`
  - [ ] `updateSession()`
  - [ ] `deleteSession()`
  - [ ] `duplicateSession()`

### 3.2 建立型別定義
- [ ] 更新 `lib/types/database.ts`
- [ ] 新增 Supabase 型別

## Phase 4: 前端 - 新增課程頁面 (30分鐘)

### 4.1 建立新增課程頁面
- [ ] 建立 `app/admin/sessions/new/page.tsx`
- [ ] 建立表單元件 `components/admin/SessionForm.tsx`

### 4.2 表單區塊元件
- [ ] 建立 `BasicInfoSection` (基本資訊)
- [ ] 建立 `ScheduleSection` (時間安排)
- [ ] 建立 `CapacitySection` (容量設定)
- [ ] 建立 `AgeRangeSection` (年齡範圍)
- [ ] 建立 `MediaSection` (媒體檔案)
- [ ] 建立 `RolesSection` (角色設定)
- [ ] 建立 `TagsSection` (標籤)
- [ ] 建立 `StatusSection` (狀態)

### 4.3 表單功能
- [ ] 實作表單驗證
- [ ] 實作自動儲存草稿
- [ ] 實作圖片上傳預覽
- [ ] 實作角色動態新增/刪除
- [ ] 實作標籤輸入

### 4.4 表單提交
- [ ] 連接 API
- [ ] 實作成功/失敗提示
- [ ] 實作導向邏輯

## Phase 5: 前端 - 編輯課程頁面 (20分鐘)

### 5.1 建立編輯課程頁面
- [ ] 建立 `app/admin/sessions/[id]/edit/page.tsx`
- [ ] 重用 `SessionForm` 元件

### 5.2 編輯功能
- [ ] 載入現有課程資料
- [ ] 預填表單欄位
- [ ] 實作更新邏輯
- [ ] 顯示修改歷史

### 5.3 限制編輯
- [ ] 如果有報名記錄，限制某些欄位編輯
- [ ] 顯示報名人數（唯讀）
- [ ] 實作確認提示

## Phase 6: 前端 - 更新課程列表頁面 (15分鐘)

### 6.1 更新列表頁面
- [ ] 更新 `app/admin/sessions/page.tsx`
- [ ] 連接到 API 而非 mock data
- [ ] 實作分頁

### 6.2 新增功能
- [ ] 新增「複製」按鈕
- [ ] 實作複製功能
- [ ] 新增批次操作
- [ ] 實作快速編輯

## Phase 7: 資料遷移 (15分鐘)

### 7.1 建立遷移腳本
- [ ] 建立 `scripts/migrate-sessions-to-db.ts`
- [ ] 讀取 mock data
- [ ] 連接 Supabase
- [ ] 插入資料

### 7.2 執行遷移
- [ ] 備份 mock data
- [ ] 執行遷移腳本
- [ ] 驗證資料完整性
- [ ] 輸出遷移報告

### 7.3 向後相容
- [ ] 更新前台頁面連接 API
- [ ] 實作 fallback 機制
- [ ] 測試前台顯示

## Phase 8: 測試與驗證 (20分鐘)

### 8.1 API 測試
- [ ] 測試 GET /api/sessions
- [ ] 測試 GET /api/sessions/[id]
- [ ] 測試 POST /api/sessions
- [ ] 測試 PUT /api/sessions/[id]
- [ ] 測試 DELETE /api/sessions/[id]
- [ ] 測試 POST /api/sessions/[id]/duplicate

### 8.2 前端測試
- [ ] 測試新增課程流程
- [ ] 測試編輯課程流程
- [ ] 測試刪除課程流程
- [ ] 測試複製課程流程
- [ ] 測試表單驗證
- [ ] 測試錯誤處理

### 8.3 整合測試
- [ ] 測試完整 CRUD 流程
- [ ] 測試權限控制
- [ ] 測試資料一致性
- [ ] 測試前台顯示

## Phase 9: 部署與上線 (15分鐘)

### 9.1 環境設定
- [ ] 設定 Vercel 環境變數
- [ ] 設定 Supabase 生產環境
- [ ] 更新 CORS 設定

### 9.2 部署
- [ ] 部署到 Vercel
- [ ] 驗證生產環境
- [ ] 測試所有功能

### 9.3 監控與備份
- [ ] 設定錯誤監控
- [ ] 設定資料庫備份
- [ ] 建立操作文件

## Phase 10: 文件與培訓 (10分鐘)

### 10.1 建立使用文件
- [ ] 撰寫管理員操作手冊
- [ ] 建立常見問題 FAQ
- [ ] 錄製操作示範影片

### 10.2 系統文件
- [ ] 更新 API 文件
- [ ] 更新資料庫 schema 文件
- [ ] 建立故障排除指南

---

## 總計時間估算

- Phase 1: 30分鐘
- Phase 2: 30分鐘
- Phase 3: 15分鐘
- Phase 4: 30分鐘
- Phase 5: 20分鐘
- Phase 6: 15分鐘
- Phase 7: 15分鐘
- Phase 8: 20分鐘
- Phase 9: 15分鐘
- Phase 10: 10分鐘

**總計：約 3 小時**

---

## 優先順序標記

- 🔴 高優先級（必須完成）
- 🟡 中優先級（建議完成）
- 🟢 低優先級（可選）

### 高優先級任務 🔴
- Phase 1: 資料庫設定
- Phase 2: API 開發
- Phase 4: 新增課程頁面
- Phase 7: 資料遷移

### 中優先級任務 🟡
- Phase 3: 資料存取層
- Phase 5: 編輯課程頁面
- Phase 6: 更新列表頁面
- Phase 8: 測試與驗證

### 低優先級任務 🟢
- Phase 9: 部署與上線（可以先在開發環境測試）
- Phase 10: 文件與培訓（可以後續補充）

---

## 注意事項

1. **資料備份**：在執行資料遷移前，務必備份現有的 mock data
2. **漸進式部署**：建議先在開發環境完整測試後再部署到生產環境
3. **向後相容**：保持 API 回應格式與 mock data 一致，確保前台不受影響
4. **權限控制**：確保只有管理員可以存取管理功能
5. **錯誤處理**：所有 API 都要有完善的錯誤處理和使用者友善的錯誤訊息
