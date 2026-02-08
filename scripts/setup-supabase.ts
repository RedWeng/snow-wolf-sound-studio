/**
 * Supabase 自動化設定腳本
 * 
 * 此腳本會自動完成：
 * 1. 驗證環境變數
 * 2. 建立資料表
 * 3. 設定 RLS 政策
 * 4. 執行資料遷移
 * 5. 驗證資料完整性
 * 
 * 執行方式：npm run setup-supabase
 */

import { createClient } from '@supabase/supabase-js';
import { mockSessions } from '../lib/mock-data/sessions';
import type { Database } from '../lib/supabase/types';

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step: number, message: string) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`步驟 ${step}: ${message}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSuccess(message: string) {
  log(`✅ ${message}`, 'green');
}

function logError(message: string) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, 'blue');
}

// SQL 腳本
const CREATE_TABLES_SQL = `
-- 啟用 UUID 擴充功能
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 建立 sessions 表
CREATE TABLE IF NOT EXISTS sessions (
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
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

-- 建立 session_roles 表
CREATE TABLE IF NOT EXISTS session_roles (
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
CREATE INDEX IF NOT EXISTS idx_session_roles_session_id ON session_roles(session_id);

-- 建立 session_addon_registrations 表
CREATE TABLE IF NOT EXISTS session_addon_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  addon_id TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, addon_id)
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_addon_registrations_session_id ON session_addon_registrations(session_id);

-- 建立 updated_at 自動更新觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addon_registrations_updated_at ON session_addon_registrations;
CREATE TRIGGER update_addon_registrations_updated_at BEFORE UPDATE ON session_addon_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

const CREATE_RLS_POLICIES_SQL = `
-- 啟用 RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_addon_registrations ENABLE ROW LEVEL SECURITY;

-- 刪除舊政策（如果存在）
DROP POLICY IF EXISTS "Anyone can view sessions" ON sessions;
DROP POLICY IF EXISTS "Anyone can view session roles" ON session_roles;
DROP POLICY IF EXISTS "Anyone can view addon registrations" ON session_addon_registrations;
DROP POLICY IF EXISTS "Service role can do everything on sessions" ON sessions;
DROP POLICY IF EXISTS "Service role can do everything on session_roles" ON session_roles;
DROP POLICY IF EXISTS "Service role can do everything on addon_registrations" ON session_addon_registrations;

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

-- 管理員完整權限政策（暫時允許所有操作）
CREATE POLICY "Service role can do everything on sessions"
  ON sessions FOR ALL
  USING (true);

CREATE POLICY "Service role can do everything on session_roles"
  ON session_roles FOR ALL
  USING (true);

CREATE POLICY "Service role can do everything on addon_registrations"
  ON session_addon_registrations FOR ALL
  USING (true);
`;

async function migrateSession(supabase: any, session: typeof mockSessions[0], index: number, total: number) {
  try {
    const { roles, addon_registrations, ...sessionData } = session;

    // 插入課程
    const { data: insertedSession, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        id: session.id,
        ...sessionData,
        tags: sessionData.tags || [],
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 插入角色
    if (roles && roles.length > 0) {
      const rolesData = roles.map(role => ({
        session_id: insertedSession.id,
        role_id: role.id,
        name_zh: role.name_zh,
        name_en: role.name_en,
        image_url: role.image_url,
        capacity: role.capacity,
        description_zh: role.description_zh,
        description_en: role.description_en,
      }));

      const { error: rolesError } = await supabase
        .from('session_roles')
        .insert(rolesData);

      if (rolesError) throw rolesError;
    }

    // 插入加購項目
    if (addon_registrations && Object.keys(addon_registrations).length > 0) {
      const addonsData = Object.entries(addon_registrations).map(([addon_id, count]) => ({
        session_id: insertedSession.id,
        addon_id,
        count,
      }));

      const { error: addonsError } = await supabase
        .from('session_addon_registrations')
        .insert(addonsData);

      if (addonsError) throw addonsError;
    }

    logSuccess(`[${index + 1}/${total}] ${session.title_zh}`);
    return { success: true };
  } catch (error) {
    logError(`[${index + 1}/${total}] ${session.title_zh} - ${error instanceof Error ? error.message : '未知錯誤'}`);
    return { success: false, error };
  }
}

async function main() {
  log('\n🚀 Supabase 自動化設定腳本', 'bright');
  log('此腳本將自動完成所有設定步驟\n', 'cyan');

  // ============================================================
  // 步驟 1: 驗證環境變數
  // ============================================================
  logStep(1, '驗證環境變數');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    logError('缺少 Supabase 環境變數！');
    logInfo('\n請在 .env.local 檔案中設定：');
    log('  NEXT_PUBLIC_SUPABASE_URL=你的_Project_URL');
    log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_public_key\n');
    logInfo('取得方式：');
    log('  1. 前往 https://supabase.com/');
    log('  2. 建立或開啟專案');
    log('  3. 前往 Settings > API');
    log('  4. 複製 Project URL 和 anon public key\n');
    process.exit(1);
  }

  logSuccess('環境變數已設定');
  logInfo(`Supabase URL: ${supabaseUrl}`);

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  // ============================================================
  // 步驟 2: 測試連線
  // ============================================================
  logStep(2, '測試 Supabase 連線');

  try {
    const { error } = await supabase.from('sessions').select('count').limit(1);
    if (error && !error.message.includes('does not exist')) {
      throw error;
    }
    logSuccess('Supabase 連線成功');
  } catch (error) {
    logError('無法連接到 Supabase');
    logError(error instanceof Error ? error.message : '未知錯誤');
    process.exit(1);
  }

  // ============================================================
  // 步驟 3: 建立資料表
  // ============================================================
  logStep(3, '建立資料表');

  try {
    // 執行 SQL（需要使用 Supabase 的 SQL API）
    const { error } = await supabase.rpc('exec_sql', { sql: CREATE_TABLES_SQL });
    
    // 如果 RPC 不存在，使用替代方法
    if (error && error.message.includes('function')) {
      logWarning('無法使用 RPC 執行 SQL，嘗試直接建立表...');
      
      // 檢查表是否已存在
      const { error: checkError } = await supabase.from('sessions').select('count').limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        logError('無法自動建立資料表');
        logInfo('\n請手動執行以下步驟：');
        log('  1. 前往 Supabase 儀表板');
        log('  2. 點擊 SQL Editor');
        log('  3. 複製 SUPABASE_SETUP_GUIDE.md 中的 SQL 腳本');
        log('  4. 執行 SQL 腳本');
        log('  5. 重新執行此腳本\n');
        process.exit(1);
      } else {
        logSuccess('資料表已存在');
      }
    } else if (error) {
      throw error;
    } else {
      logSuccess('資料表建立成功');
    }
  } catch (error) {
    logWarning('建立資料表時發生錯誤（可能已存在）');
    logInfo(error instanceof Error ? error.message : '未知錯誤');
  }

  // ============================================================
  // 步驟 4: 設定 RLS 政策
  // ============================================================
  logStep(4, '設定 Row Level Security (RLS) 政策');

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: CREATE_RLS_POLICIES_SQL });
    
    if (error && error.message.includes('function')) {
      logWarning('無法使用 RPC 執行 SQL');
      logInfo('請手動在 Supabase SQL Editor 中執行 RLS 政策 SQL');
    } else if (error) {
      throw error;
    } else {
      logSuccess('RLS 政策設定成功');
    }
  } catch (error) {
    logWarning('設定 RLS 政策時發生錯誤');
    logInfo(error instanceof Error ? error.message : '未知錯誤');
  }

  // ============================================================
  // 步驟 5: 清空現有資料
  // ============================================================
  logStep(5, '清空現有資料');

  logWarning('此操作將刪除所有現有課程資料！');
  logInfo('按 Ctrl+C 取消，或等待 3 秒自動繼續...\n');
  
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    await supabase.from('session_addon_registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('session_roles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    logSuccess('現有資料已清空');
  } catch (error) {
    logWarning('清空資料時發生錯誤（可能沒有資料）');
  }

  // ============================================================
  // 步驟 6: 遷移課程資料
  // ============================================================
  logStep(6, `遷移課程資料 (共 ${mockSessions.length} 個課程)`);

  const results = {
    success: 0,
    failed: 0,
  };

  for (let i = 0; i < mockSessions.length; i++) {
    const result = await migrateSession(supabase, mockSessions[i], i, mockSessions.length);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }
  }

  log('');
  logSuccess(`成功遷移 ${results.success} 個課程`);
  if (results.failed > 0) {
    logError(`失敗 ${results.failed} 個課程`);
  }

  // ============================================================
  // 步驟 7: 驗證資料完整性
  // ============================================================
  logStep(7, '驗證資料完整性');

  try {
    const { count: sessionsCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });
    const { count: rolesCount } = await supabase
      .from('session_roles')
      .select('*', { count: 'exact', head: true });
    const { count: addonsCount } = await supabase
      .from('session_addon_registrations')
      .select('*', { count: 'exact', head: true });

    logSuccess(`課程數量：${sessionsCount}`);
    logSuccess(`角色數量：${rolesCount}`);
    logSuccess(`加購項目數量：${addonsCount}`);

    if (sessionsCount !== mockSessions.length) {
      logWarning(`預期 ${mockSessions.length} 個課程，實際 ${sessionsCount} 個`);
    }
  } catch (error) {
    logError('驗證資料時發生錯誤');
    logError(error instanceof Error ? error.message : '未知錯誤');
  }

  // ============================================================
  // 完成
  // ============================================================
  log('\n' + '='.repeat(60), 'cyan');
  log('✨ Supabase 設定完成！', 'green');
  log('='.repeat(60), 'cyan');

  logInfo('\n下一步：');
  log('  1. 啟動開發伺服器：npm run dev');
  log('  2. 前往管理員後台：http://localhost:3000/admin/sessions');
  log('  3. 確認課程資料正確顯示\n');
}

main().catch(error => {
  logError('\n設定過程發生錯誤');
  logError(error instanceof Error ? error.message : '未知錯誤');
  process.exit(1);
});
