# Supabase 設定指南

## 步驟 1: 建立 Supabase 專案

1. 前往 [Supabase](https://supabase.com/)
2. 點擊「Start your project」或「New Project」
3. 填寫專案資訊：
   - **Name**: `snow-wolf-sound-studio`
   - **Database Password**: 設定一個強密碼（請記住！）
   - **Region**: 選擇 `Northeast Asia (Tokyo)` 或最接近的區域
4. 點擊「Create new project」
5. 等待專案建立完成（約 2 分鐘）

## 步驟 2: 取得 API 金鑰

1. 在專案儀表板，點擊左側選單的「Settings」（齒輪圖示）
2. 點擊「API」
3. 複製以下資訊：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 步驟 3: 設定環境變數

在專案根目錄的 `.env.local` 檔案中新增：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_public_key
```

## 步驟 4: 建立資料表

1. 在 Supabase 儀表板，點擊左側選單的「SQL Editor」
2. 點擊「New query」
3. 複製貼上以下 SQL 指令：

```sql
-- 啟用 UUID 擴充功能
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 建立 sessions 表
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

-- 建立索引
CREATE INDEX idx_sessions_date ON sessions(date);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);

-- 建立 session_roles 表
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

-- 建立索引
CREATE INDEX idx_session_roles_session_id ON session_roles(session_id);

-- 建立 session_addon_registrations 表
CREATE TABLE session_addon_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  addon_id TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, addon_id)
);

-- 建立索引
CREATE INDEX idx_addon_registrations_session_id ON session_addon_registrations(session_id);

-- 建立 updated_at 自動更新觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addon_registrations_updated_at BEFORE UPDATE ON session_addon_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. 點擊「Run」執行 SQL
5. 確認顯示「Success. No rows returned」

## 步驟 5: 設定 Row Level Security (RLS)

繼續在 SQL Editor 中執行：

```sql
-- 啟用 RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_addon_registrations ENABLE ROW LEVEL SECURITY;

-- 公開讀取政策（所有人都可以讀取課程）
CREATE POLICY "Anyone can view sessions"
  ON sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view session roles"
  ON session_roles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view addon registrations"
  ON session_addon_registrations FOR SELECT
  USING (true);

-- 管理員完整權限政策（暫時允許所有操作，之後可以加強）
CREATE POLICY "Service role can do everything on sessions"
  ON sessions FOR ALL
  USING (true);

CREATE POLICY "Service role can do everything on session_roles"
  ON session_roles FOR ALL
  USING (true);

CREATE POLICY "Service role can do everything on addon_registrations"
  ON session_addon_registrations FOR ALL
  USING (true);
```

## 步驟 6: 驗證設定

1. 在 Supabase 儀表板，點擊「Table Editor」
2. 確認看到三個表：
   - `sessions`
   - `session_roles`
   - `session_addon_registrations`
3. 點擊每個表，確認欄位都正確建立

## 步驟 7: 執行資料遷移

回到專案，執行資料遷移腳本：

```bash
npm run migrate-sessions
```

這會將 `lib/mock-data/sessions.ts` 中的所有課程匯入到 Supabase 資料庫。

## 步驟 8: 測試連線

啟動開發伺服器：

```bash
npm run dev
```

前往 `http://localhost:3000/admin/sessions` 確認可以看到從資料庫載入的課程列表。

## 常見問題

### Q: 忘記資料庫密碼怎麼辦？
A: 在 Supabase 專案設定中，可以重設資料庫密碼。

### Q: API 金鑰洩漏了怎麼辦？
A: 在 Supabase 專案設定的 API 頁面，可以重新產生金鑰。記得更新 `.env.local`。

### Q: 如何備份資料庫？
A: 在 Supabase 儀表板的「Database」→「Backups」可以手動建立備份。

### Q: 如何查看資料庫日誌？
A: 在 Supabase 儀表板的「Logs」可以查看所有 API 請求和錯誤。

## 下一步

設定完成後，你就可以：
1. 在管理員後台新增課程
2. 編輯現有課程
3. 刪除不需要的課程
4. 複製課程建立 A場、B場

所有變更都會立即生效，不需要重新部署網站！
