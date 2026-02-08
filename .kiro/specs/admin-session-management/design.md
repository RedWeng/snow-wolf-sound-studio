# 管理員課程管理系統 - 設計文件

## 1. 系統架構

```
┌─────────────────────────────────────────────────────────┐
│                     前台使用者                            │
│                  (app/sessions/page.tsx)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ GET /api/sessions
                     │
┌────────────────────▼────────────────────────────────────┐
│                   API Layer                              │
│              (app/api/sessions/route.ts)                 │
│                                                          │
│  - GET    /api/sessions          (列表)                 │
│  - GET    /api/sessions/[id]     (詳情)                 │
│  - POST   /api/sessions          (新增)                 │
│  - PUT    /api/sessions/[id]     (更新)                 │
│  - DELETE /api/sessions/[id]     (刪除)                 │
│  - POST   /api/sessions/[id]/duplicate (複製)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Supabase Client
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Supabase Database                       │
│                    (PostgreSQL)                          │
│                                                          │
│  Tables:                                                 │
│  - sessions                                              │
│  - session_roles                                         │
│  - session_addon_registrations                           │
└──────────────────────────────────────────────────────────┘
                     ▲
                     │
┌────────────────────┴────────────────────────────────────┐
│                  管理員後台                               │
│                                                          │
│  - /admin/sessions          (列表)                       │
│  - /admin/sessions/new      (新增)                       │
│  - /admin/sessions/[id]/edit (編輯)                      │
└──────────────────────────────────────────────────────────┘
```

## 2. 資料庫設計

### 2.1 資料表結構

#### sessions 表
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  theme_zh TEXT NOT NULL,
  theme_en TEXT NOT NULL,
  story_zh TEXT,
  story_en TEXT,
  description_zh TEXT,
  description_en TEXT,
  venue_zh TEXT NOT NULL,
  venue_en TEXT NOT NULL,
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL,
  time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  hidden_buffer INTEGER DEFAULT 0,
  price INTEGER NOT NULL,
  age_min INTEGER,
  age_max INTEGER,
  image_url TEXT,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  current_registrations INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  updated_by TEXT
);

-- 索引
CREATE INDEX idx_sessions_date ON sessions(date);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);
```

#### session_roles 表
```sql
CREATE TABLE session_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  image_url TEXT,
  capacity INTEGER NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_session_roles_session_id ON session_roles(session_id);
```

#### session_addon_registrations 表
```sql
CREATE TABLE session_addon_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  addon_id TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, addon_id)
);

-- 索引
CREATE INDEX idx_addon_registrations_session_id ON session_addon_registrations(session_id);
```

### 2.2 Row Level Security (RLS)

```sql
-- 啟用 RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_addon_registrations ENABLE ROW LEVEL SECURITY;

-- 公開讀取政策（所有人都可以讀取 active 課程）
CREATE POLICY "Public sessions are viewable by everyone"
  ON sessions FOR SELECT
  USING (status = 'active');

-- 管理員完整權限政策
CREATE POLICY "Admins can do everything"
  ON sessions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- session_roles 公開讀取
CREATE POLICY "Session roles are viewable by everyone"
  ON session_roles FOR SELECT
  USING (true);

-- session_roles 管理員完整權限
CREATE POLICY "Admins can manage session roles"
  ON session_roles FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- addon_registrations 公開讀取
CREATE POLICY "Addon registrations are viewable by everyone"
  ON session_addon_registrations FOR SELECT
  USING (true);

-- addon_registrations 管理員完整權限
CREATE POLICY "Admins can manage addon registrations"
  ON session_addon_registrations FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

## 3. API 設計

### 3.1 GET /api/sessions

**功能：**取得課程列表

**Query Parameters：**
```typescript
{
  status?: 'active' | 'completed' | 'cancelled' | 'all'
  search?: string  // 搜尋標題或主題
  dateFrom?: string  // YYYY-MM-DD
  dateTo?: string    // YYYY-MM-DD
  page?: number      // 分頁
  limit?: number     // 每頁筆數
}
```

**Response：**
```typescript
{
  sessions: Session[]
  total: number
  page: number
  limit: number
}
```

### 3.2 GET /api/sessions/[id]

**功能：**取得單一課程詳情

**Response：**
```typescript
{
  session: Session & {
    roles: SessionRole[]
    addon_registrations: AddonRegistration[]
  }
}
```

### 3.3 POST /api/sessions

**功能：**新增課程

**Request Body：**
```typescript
{
  title_zh: string
  title_en: string
  theme_zh: string
  theme_en: string
  story_zh?: string
  story_en?: string
  description_zh?: string
  description_en?: string
  venue_zh: string
  venue_en: string
  date: string  // YYYY-MM-DD
  day_of_week: string
  time: string  // HH:MM
  duration_minutes: number
  capacity: number
  hidden_buffer?: number
  price: number
  age_min?: number
  age_max?: number
  image_url?: string
  video_url?: string
  status?: 'active' | 'completed' | 'cancelled'
  tags?: string[]
  roles?: {
    role_id: string
    name_zh: string
    name_en: string
    image_url?: string
    capacity: number
    description_zh?: string
    description_en?: string
  }[]
}
```

**Response：**
```typescript
{
  session: Session
  message: string
}
```

### 3.4 PUT /api/sessions/[id]

**功能：**更新課程

**Request Body：**同 POST，所有欄位都是可選的

**Response：**
```typescript
{
  session: Session
  message: string
}
```

### 3.5 DELETE /api/sessions/[id]

**功能：**刪除課程

**Response：**
```typescript
{
  success: boolean
  message: string
}
```

### 3.6 POST /api/sessions/[id]/duplicate

**功能：**複製課程

**Request Body：**
```typescript
{
  date?: string  // 新的日期
  time?: string  // 新的時間
  title_suffix?: string  // 標題後綴（例如 "B場"）
}
```

**Response：**
```typescript
{
  session: Session
  message: string
}
```

## 4. 前端設計

### 4.1 新增課程頁面 (/admin/sessions/new)

**元件結構：**
```
SessionNewPage
├── SessionForm
│   ├── BasicInfoSection (基本資訊)
│   │   ├── TitleInput (中英文標題)
│   │   ├── ThemeInput (中英文主題)
│   │   ├── StoryTextarea (中英文故事)
│   │   └── DescriptionTextarea (中英文描述)
│   ├── ScheduleSection (時間安排)
│   │   ├── DatePicker (日期)
│   │   ├── TimePicker (時間)
│   │   ├── DurationInput (時長)
│   │   └── VenueInput (地點)
│   ├── CapacitySection (容量設定)
│   │   ├── CapacityInput (容量)
│   │   ├── BufferInput (緩衝)
│   │   └── PriceInput (價格)
│   ├── AgeRangeSection (年齡範圍)
│   │   ├── AgeMinInput (最小年齡)
│   │   └── AgeMaxInput (最大年齡)
│   ├── MediaSection (媒體檔案)
│   │   ├── ImageUpload (圖片上傳)
│   │   └── VideoUrlInput (影片網址)
│   ├── RolesSection (角色設定)
│   │   └── RoleList (角色列表)
│   │       └── RoleItem (單一角色)
│   ├── TagsSection (標籤)
│   │   └── TagInput (標籤輸入)
│   └── StatusSection (狀態)
│       └── StatusSelect (狀態選擇)
└── FormActions
    ├── SaveButton (儲存)
    ├── SaveDraftButton (儲存草稿)
    └── CancelButton (取消)
```

**表單驗證規則：**
```typescript
const validationSchema = {
  title_zh: { required: true, minLength: 2, maxLength: 100 },
  title_en: { required: true, minLength: 2, maxLength: 100 },
  theme_zh: { required: true, minLength: 2, maxLength: 100 },
  theme_en: { required: true, minLength: 2, maxLength: 100 },
  venue_zh: { required: true },
  venue_en: { required: true },
  date: { required: true, format: 'YYYY-MM-DD' },
  time: { required: true, format: 'HH:MM' },
  duration_minutes: { required: true, min: 30, max: 600 },
  capacity: { required: true, min: 1, max: 100 },
  price: { required: true, min: 0 },
  age_min: { min: 0, max: 99 },
  age_max: { min: 0, max: 99 },
}
```

### 4.2 編輯課程頁面 (/admin/sessions/[id]/edit)

**與新增頁面相同的表單結構，但：**
- 預填現有資料
- 顯示修改歷史
- 顯示報名人數（不可編輯）
- 如果有報名記錄，某些欄位不可修改（例如日期、時間）

### 4.3 課程列表頁面 (/admin/sessions)

**更新內容：**
- 連接到 API 而非 mock data
- 新增「複製」按鈕
- 新增「快速編輯」功能（inline editing）
- 新增批次操作（批次刪除、批次更改狀態）

## 5. 資料遷移策略

### 5.1 遷移腳本

**檔案：**`scripts/migrate-sessions-to-db.ts`

**流程：**
```typescript
1. 讀取 lib/mock-data/sessions.ts
2. 連接 Supabase
3. 對每個 session：
   a. 插入 sessions 表
   b. 如果有 roles，插入 session_roles 表
   c. 如果有 addon_registrations，插入 session_addon_registrations 表
4. 驗證資料完整性
5. 輸出遷移報告
```

### 5.2 向後相容

**策略：**
- 保留 `lib/mock-data/sessions.ts` 作為備份
- 建立 `lib/api/sessions.ts` 作為資料存取層
- 前台頁面透過 API 讀取資料
- 如果 API 失敗，fallback 到 mock data

## 6. 錯誤處理

### 6.1 API 錯誤

```typescript
// 標準錯誤回應格式
{
  error: {
    code: string  // 'VALIDATION_ERROR', 'NOT_FOUND', 'UNAUTHORIZED', etc.
    message: string
    details?: any
  }
}
```

### 6.2 前端錯誤處理

```typescript
// 使用 Toast 顯示錯誤
try {
  await createSession(data)
  showToast({ type: 'success', message: '課程新增成功！' })
  router.push('/admin/sessions')
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    showToast({ type: 'error', message: '請檢查表單欄位' })
  } else if (error.code === 'UNAUTHORIZED') {
    showToast({ type: 'error', message: '您沒有權限執行此操作' })
    router.push('/login')
  } else {
    showToast({ type: 'error', message: '操作失敗，請稍後再試' })
  }
}
```

## 7. 效能優化

### 7.1 資料庫查詢優化

- 使用索引加速查詢
- 實作分頁避免一次載入太多資料
- 使用 `SELECT` 指定欄位，避免載入不需要的資料

### 7.2 前端優化

- 使用 React Query 快取 API 回應
- 實作樂觀更新（Optimistic Updates）
- 圖片延遲載入（Lazy Loading）
- 表單自動儲存草稿到 localStorage

### 7.3 圖片優化

- 上傳前壓縮圖片
- 使用 Next.js Image 元件
- 設定圖片大小限制（5MB）
- 支援 WebP 格式

## 8. 安全性考量

### 8.1 認證與授權

- 使用 Supabase Auth
- 檢查使用者角色（admin）
- API 端點需要驗證 token
- 前端路由保護（middleware）

### 8.2 輸入驗證

- 前端表單驗證
- 後端 API 驗證
- SQL injection 防護（使用 Supabase client）
- XSS 防護（sanitize 輸入）

### 8.3 資料保護

- 敏感資料加密
- 定期備份資料庫
- 實作軟刪除（soft delete）
- 記錄操作日誌

## 9. 測試策略

### 9.1 單元測試

- API 端點測試
- 表單驗證測試
- 資料轉換測試

### 9.2 整合測試

- 完整的 CRUD 流程測試
- 資料遷移測試
- 權限檢查測試

### 9.3 E2E 測試

- 新增課程流程
- 編輯課程流程
- 刪除課程流程
- 複製課程流程

## 10. 部署檢查清單

- [ ] Supabase 專案建立完成
- [ ] 資料表建立完成
- [ ] RLS 政策設定完成
- [ ] 環境變數設定完成
- [ ] API 端點測試通過
- [ ] 前端頁面測試通過
- [ ] 資料遷移完成
- [ ] 生產環境驗證通過
- [ ] 備份機制建立完成
- [ ] 監控告警設定完成
