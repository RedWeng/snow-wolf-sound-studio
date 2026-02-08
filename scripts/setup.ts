/**
 * 統一自動化設定腳本
 * 
 * 自動檢測並設定 Supabase 或 Vercel Postgres
 * 
 * 執行方式：npm run setup
 */

import { createClient } from '@supabase/supabase-js';
import { mockSessions } from '../lib/mock-data/sessions';

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step: number, total: number, message: string) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`步驟 ${step}/${total}: ${message}`, 'bright');
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

function logProgress(current: number, total: number, item: string) {
  const percentage = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
  log(`[${bar}] ${percentage}% - ${item}`, 'cyan');
}

// SQL 腳本
const CREATE_TABLES_SQL = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

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

CREATE INDEX IF NOT EXISTS idx_session_roles_session_id ON session_roles(session_id);

CREATE TABLE IF NOT EXISTS session_addon_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  addon_id TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, addon_id)
);

CREATE INDEX IF NOT EXISTS idx_addon_registrations_session_id ON session_addon_registrations(session_id);

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

async function migrateSession(supabase: any, session: typeof mockSessions[0], index: number, total: number) {
  try {
    const { roles, addon_registrations, ...sessionData } = session;

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

    if (roles && roles.length > 0) {
      const rolesData = roles.map((role: any) => ({
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

    logProgress(index + 1, total, session.title_zh);
    return { success: true };
  } catch (error) {
    logError(`${session.title_zh} - ${error instanceof Error ? error.message : '未知錯誤'}`);
    return { success: false, error };
  }
}

async function main() {
  log('\n🚀 雪狼錄音派對 - 自動化設定腳本', 'bright');
  log('此腳本將自動完成所有設定步驟\n', 'magenta');

  const totalSteps = 7;

  // 步驟 1: 檢測資料庫類型
  logStep(1, totalSteps, '檢測資料庫類型');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.POSTGRES_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.POSTGRES_PRISMA_URL;

  if (!supabaseUrl) {
    logError('未找到資料庫環境變數！');
    logInfo('\n請先建立資料庫：');
    log('  選項 A（推薦）：Vercel Postgres');
    log('    1. 前往 Vercel 儀表板');
    log('    2. 選擇專案 → Storage → Create Database → Postgres');
    log('    3. 環境變數會自動設定\n');
    log('  選項 B：Supabase');
    log('    1. 前往 https://supabase.com/');
    log('    2. 建立專案');
    log('    3. 在 .env.local 設定 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY\n');
    process.exit(1);
  }

  const dbType = supabaseUrl.includes('supabase') ? 'Supabase' : 'Vercel Postgres';
  logSuccess(`檢測到：${dbType}`);
  logInfo(`連線 URL: ${supabaseUrl.substring(0, 30)}...`);

  // 步驟 2: 建立資料庫連線
  logStep(2, totalSteps, '建立資料庫連線');

  let supabase;
  try {
    if (dbType === 'Supabase') {
      if (!supabaseKey) {
        throw new Error('缺少 NEXT_PUBLIC_SUPABASE_ANON_KEY');
      }
      supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      // Vercel Postgres 也使用 Supabase client（因為都是 PostgreSQL）
      const key = supabaseKey || 'dummy-key'; // Vercel Postgres 不需要 key
      supabase = createClient(supabaseUrl, key);
    }
    logSuccess('資料庫連線已建立');
  } catch (error) {
    logError('無法建立資料庫連線');
    logError(error instanceof Error ? error.message : '未知錯誤');
    process.exit(1);
  }

  // 步驟 3: 測試連線
  logStep(3, totalSteps, '測試資料庫連線');

  try {
    const { error } = await supabase.from('sessions').select('count').limit(1);
    if (error && !error.message.includes('does not exist')) {
      throw error;
    }
    logSuccess('資料庫連線測試成功');
  } catch (error) {
    logError('資料庫連線測試失敗');
    logError(error instanceof Error ? error.message : '未知錯誤');
    process.exit(1);
  }

  // 步驟 4: 建立資料表
  logStep(4, totalSteps, '建立資料表');

  try {
    // 嘗試直接查詢，如果表不存在會報錯
    const { error: checkError } = await supabase.from('sessions').select('count').limit(1);
    
    if (checkError && checkError.message.includes('does not exist')) {
      logWarning('資料表不存在，需要手動建立');
      logInfo('\n請在資料庫管理介面執行以下 SQL：');
      logInfo('（SQL 腳本已儲存在 SUPABASE_SETUP_GUIDE.md）\n');
      
      if (dbType === 'Vercel Postgres') {
        logInfo('Vercel Postgres 步驟：');
        log('  1. 前往 Vercel 儀表板');
        log('  2. Storage → 你的資料庫 → Query');
        log('  3. 複製 SUPABASE_SETUP_GUIDE.md 中的 SQL');
        log('  4. 執行 SQL');
        log('  5. 重新執行此腳本\n');
      } else {
        logInfo('Supabase 步驟：');
        log('  1. 前往 Supabase 儀表板');
        log('  2. SQL Editor → New query');
        log('  3. 複製 SUPABASE_SETUP_GUIDE.md 中的 SQL');
        log('  4. 執行 SQL');
        log('  5. 重新執行此腳本\n');
      }
      
      process.exit(1);
    } else {
      logSuccess('資料表已存在');
    }
  } catch (error) {
    logWarning('無法檢查資料表狀態');
    logInfo(error instanceof Error ? error.message : '未知錯誤');
  }

  // 步驟 5: 清空現有資料
  logStep(5, totalSteps, '清空現有資料');

  logWarning('此操作將刪除所有現有課程資料！');
  logInfo('等待 3 秒...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    await supabase.from('session_addon_registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('session_roles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    logSuccess('現有資料已清空');
  } catch (error) {
    logWarning('清空資料時發生錯誤（可能沒有資料）');
  }

  // 步驟 6: 遷移課程資料
  logStep(6, totalSteps, `遷移課程資料 (共 ${mockSessions.length} 個課程)`);

  const results = { success: 0, failed: 0 };

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

  // 步驟 7: 驗證資料完整性
  logStep(7, totalSteps, '驗證資料完整性');

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

  // 完成
  log('\n' + '='.repeat(60), 'cyan');
  log('✨ 設定完成！', 'green');
  log('='.repeat(60), 'cyan');

  logInfo('\n下一步：');
  log('  1. 啟動開發伺服器：npm run dev');
  log('  2. 前往管理員後台：http://localhost:3000/admin/sessions');
  log('  3. 前往前台課程頁面：http://localhost:3000/sessions\n');
  
  logInfo('如果遇到問題，執行診斷：npm run diagnose\n');
}

main().catch(error => {
  logError('\n設定過程發生錯誤');
  logError(error instanceof Error ? error.message : '未知錯誤');
  logInfo('\n請執行診斷腳本：npm run diagnose');
  process.exit(1);
});
