# 管理員課程管理系統 - 需求文件

## 1. 功能概述

建立完整的資料庫式課程管理系統，讓管理員可以在後台直接新增、編輯、刪除課程，所有變更立即生效，不需要重新部署網站。

## 2. 使用者故事

### 2.1 課程新增
**身為**管理員  
**我想要**在後台新增新課程  
**以便**快速上架新的活動課程，不需要編輯程式碼

**驗收標準：**
- 可以填寫完整的課程資訊（中英文標題、主題、故事、描述等）
- 可以設定日期、時間、時長、容量、價格
- 可以設定年齡範圍
- 可以上傳課程圖片和影片
- 可以新增角色選項（如果有的話）
- 可以新增標籤
- 儲存後立即在前台顯示

### 2.2 課程編輯
**身為**管理員  
**我想要**編輯現有課程的資訊  
**以便**更新課程內容或修正錯誤

**驗收標準：**
- 可以修改所有課程欄位
- 可以調整容量和價格
- 可以更新報名人數
- 修改後立即生效
- 保留修改歷史記錄

### 2.3 課程刪除
**身為**管理員  
**我想要**刪除不需要的課程  
**以便**保持課程列表整潔

**驗收標準：**
- 可以刪除課程
- 刪除前有確認提示
- 已有報名的課程不能直接刪除（需要先取消）
- 刪除後立即從前台移除

### 2.4 課程複製
**身為**管理員  
**我想要**複製現有課程  
**以便**快速建立類似的課程（例如 A場、B場）

**驗收標準：**
- 可以一鍵複製課程
- 複製後可以修改日期、時間等資訊
- 保留原課程的所有設定

### 2.5 課程狀態管理
**身為**管理員  
**我想要**管理課程狀態  
**以便**控制課程的顯示和報名

**驗收標準：**
- 可以設定課程狀態：進行中、已完成、已取消
- 已取消的課程不顯示在前台
- 已完成的課程不能報名

### 2.6 資料遷移
**身為**系統管理員  
**我想要**將現有的 mock 資料遷移到資料庫  
**以便**保留所有現有課程資料

**驗收標準：**
- 提供資料遷移腳本
- 所有現有課程都正確匯入
- 報名人數、角色、標籤等資料完整保留

## 3. 技術需求

### 3.1 資料庫選擇
- 使用 **Supabase** 作為資料庫（免費版足夠使用）
- PostgreSQL 資料庫
- 提供 REST API 和即時訂閱功能

### 3.2 資料表結構

#### sessions 表
```sql
- id (uuid, primary key)
- title_zh (text)
- title_en (text)
- theme_zh (text)
- theme_en (text)
- story_zh (text)
- story_en (text)
- description_zh (text)
- description_en (text)
- venue_zh (text)
- venue_en (text)
- date (date)
- day_of_week (text)
- time (text)
- duration_minutes (integer)
- capacity (integer)
- hidden_buffer (integer)
- price (integer)
- age_min (integer, nullable)
- age_max (integer, nullable)
- image_url (text)
- video_url (text)
- status (text) - 'active', 'completed', 'cancelled'
- current_registrations (integer, default 0)
- tags (text[])
- created_at (timestamp)
- updated_at (timestamp)
- created_by (text)
- updated_by (text)
```

#### session_roles 表
```sql
- id (uuid, primary key)
- session_id (uuid, foreign key)
- role_id (text)
- name_zh (text)
- name_en (text)
- image_url (text)
- capacity (integer)
- description_zh (text)
- description_en (text)
- created_at (timestamp)
```

#### session_addon_registrations 表
```sql
- id (uuid, primary key)
- session_id (uuid, foreign key)
- addon_id (text)
- count (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### 3.3 API 端點

#### GET /api/sessions
- 取得所有課程列表
- 支援篩選（status, date range）
- 支援搜尋（title, theme）
- 支援排序

#### GET /api/sessions/[id]
- 取得單一課程詳細資訊
- 包含角色和加購項目

#### POST /api/sessions
- 新增課程
- 驗證必填欄位
- 自動生成 ID

#### PUT /api/sessions/[id]
- 更新課程資訊
- 記錄修改者和時間

#### DELETE /api/sessions/[id]
- 刪除課程
- 檢查是否有報名記錄

#### POST /api/sessions/[id]/duplicate
- 複製課程
- 生成新的 ID

### 3.4 前端頁面

#### /admin/sessions/new
- 新增課程表單
- 表單驗證
- 圖片上傳預覽
- 角色動態新增

#### /admin/sessions/[id]/edit
- 編輯課程表單
- 預填現有資料
- 修改歷史顯示

#### /admin/sessions
- 課程列表（已存在，需要更新）
- 連接到資料庫 API
- 新增「複製」按鈕

## 4. 非功能需求

### 4.1 效能
- API 回應時間 < 500ms
- 課程列表支援分頁（每頁 20 筆）
- 圖片上傳大小限制 5MB

### 4.2 安全性
- 只有管理員可以存取
- API 需要驗證 token
- 防止 SQL injection
- 輸入資料驗證

### 4.3 可用性
- 表單自動儲存草稿
- 錯誤訊息清楚明確
- 操作有確認提示
- 支援鍵盤快捷鍵

### 4.4 相容性
- 向後相容現有的前台頁面
- 資料格式與 mock data 一致
- 支援現有的角色選擇功能

## 5. 實作優先順序

### Phase 1: 資料庫設定（30分鐘）
1. 建立 Supabase 專案
2. 建立資料表
3. 設定 API 權限
4. 環境變數設定

### Phase 2: API 開發（30分鐘）
1. 建立 sessions API 端點
2. 實作 CRUD 操作
3. 資料驗證
4. 錯誤處理

### Phase 3: 管理介面（30分鐘）
1. 新增課程頁面
2. 編輯課程頁面
3. 更新課程列表頁面
4. 複製功能

### Phase 4: 資料遷移（15分鐘）
1. 建立遷移腳本
2. 匯入現有課程
3. 驗證資料完整性

### Phase 5: 測試與部署（15分鐘）
1. 功能測試
2. 整合測試
3. 部署到 Vercel
4. 驗證生產環境

## 6. 風險與挑戰

### 6.1 資料遷移風險
- **風險**：現有資料可能遺失
- **對策**：先備份 mock data，分批遷移，驗證每筆資料

### 6.2 API 效能
- **風險**：大量課程時查詢變慢
- **對策**：建立索引，實作分頁，快取常用資料

### 6.3 圖片儲存
- **風險**：圖片儲存空間不足
- **對策**：使用 Supabase Storage，設定大小限制，壓縮圖片

### 6.4 向後相容
- **風險**：前台頁面可能無法讀取新資料
- **對策**：保持資料格式一致，漸進式遷移

## 7. 成功指標

- ✅ 可以在 2 分鐘內新增一個完整課程
- ✅ 所有現有課程成功遷移到資料庫
- ✅ 前台頁面正常顯示資料庫課程
- ✅ 修改課程後立即生效（不需部署）
- ✅ 管理員可以獨立管理課程，不需要開發者協助
