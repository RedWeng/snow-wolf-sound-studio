/**
 * Neon 資料庫設定腳本
 * 
 * 自動建立資料表並遷移資料到 Neon PostgreSQL
 * 
 * 執行方式：npm run setup:neon
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// 載入環境變數
config({ path: resolve(process.cwd(), '.env.local') });

import { pool } from '../lib/neon/client';
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
-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 課程主表
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

-- 索引
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

-- 課程角色表
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

-- 加購項目報名表
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

-- 自動更新 updated_at 的觸發器
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

async function migrateSession(session: typeof mockSessions[0], index: number, total: number) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id, roles, addon_registrations, ...sessionData } = session;

    // 插入課程（不指定 ID，讓資料庫自動生成 UUID）
    const insertSessionQuery = `
      INSERT INTO sessions (
        title_zh, title_en, theme_zh, theme_en, story_zh, story_en,
        description_zh, description_en, venue_zh, venue_en, date, day_of_week,
        time, duration_minutes, capacity, hidden_buffer, price, age_min, age_max,
        image_url, video_url, status, current_registrations, tags
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24
      ) RETURNING id
    `;

    const sessionValues = [
      sessionData.title_zh,
      sessionData.title_en,
      sessionData.theme_zh,
      sessionData.theme_en,
      sessionData.story_zh || '',
      sessionData.story_en || '',
      sessionData.description_zh || '',
      sessionData.description_en || '',
      sessionData.venue_zh,
      sessionData.venue_en,
      sessionData.date,
      sessionData.day_of_week,
      sessionData.time,
      sessionData.duration_minutes,
      sessionData.capacity,
      sessionData.hidden_buffer || 0,
      sessionData.price,
      sessionData.age_min,
      sessionData.age_max,
      sessionData.image_url || '',
      sessionData.video_url || '',
      sessionData.status,
      sessionData.current_registrations || 0,
      sessionData.tags || [],
    ];

    const sessionResult = await client.query(insertSessionQuery, sessionValues);
    const sessionId = sessionResult.rows[0].id;

    // 插入角色
    if (roles && roles.length > 0) {
      const insertRolesQuery = `
        INSERT INTO session_roles (
          session_id, role_id, name_zh, name_en, image_url, capacity,
          description_zh, description_en
        ) VALUES ${roles.map((_, i) => {
          const base = i * 8;
          return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`;
        }).join(', ')}
      `;

      const rolesValues = roles.flatMap((role: any) => [
        sessionId,
        role.id,
        role.name_zh,
        role.name_en,
        role.image_url || '',
        role.capacity,
        role.description_zh || '',
        role.description_en || '',
      ]);

      await client.query(insertRolesQuery, rolesValues);
    }

    // 插入加購項目
    if (addon_registrations && Object.keys(addon_registrations).length > 0) {
      const addons = Object.entries(addon_registrations);
      const insertAddonsQuery = `
        INSERT INTO session_addon_registrations (session_id, addon_id, count)
        VALUES ${addons.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(', ')}
      `;

      const addonsValues = [sessionId, ...addons.flatMap(([addon_id, count]) => [addon_id, count])];
      await client.query(insertAddonsQuery, addonsValues);
    }

    await client.query('COMMIT');

    logProgress(index + 1, total, session.title_zh);
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    logError(`${session.title_zh} - ${error instanceof Error ? error.message : '未知錯誤'}`);
    return { success: false, error };
  } finally {
    client.release();
  }
}

async function main() {
  log('\n🚀 Neon 資料庫設定腳本', 'bright');
  log('此腳本將自動建立資料表並遷移資料\n', 'magenta');

  const totalSteps = 6;

  // 步驟 1: 檢查環境變數
  logStep(1, totalSteps, '檢查環境變數');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    logError('未找到 DATABASE_URL 環境變數！');
    logInfo('\n請在 .env.local 設定：');
    log('DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require\n');
    process.exit(1);
  }

  logSuccess('DATABASE_URL 已設定');
  logInfo(`連線 URL: ${databaseUrl.substring(0, 50)}...`);

  // 步驟 2: 測試連線
  logStep(2, totalSteps, '測試資料庫連線');

  try {
    const result = await pool.query('SELECT NOW()');
    logSuccess(`資料庫連線成功 - ${result.rows[0].now}`);
  } catch (error) {
    logError('資料庫連線失敗');
    logError(error instanceof Error ? error.message : '未知錯誤');
    process.exit(1);
  }

  // 步驟 3: 建立資料表
  logStep(3, totalSteps, '建立資料表');

  try {
    await pool.query(CREATE_TABLES_SQL);
    logSuccess('資料表建立成功');
  } catch (error) {
    logError('建立資料表失敗');
    logError(error instanceof Error ? error.message : '未知錯誤');
    process.exit(1);
  }

  // 步驟 4: 清空現有資料
  logStep(4, totalSteps, '清空現有資料');

  logWarning('此操作將刪除所有現有課程資料！');
  logInfo('等待 3 秒...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    await pool.query('DELETE FROM session_addon_registrations');
    await pool.query('DELETE FROM session_roles');
    await pool.query('DELETE FROM sessions');
    logSuccess('現有資料已清空');
  } catch (error) {
    logWarning('清空資料時發生錯誤（可能沒有資料）');
  }

  // 步驟 5: 遷移課程資料
  logStep(5, totalSteps, `遷移課程資料 (共 ${mockSessions.length} 個課程)`);

  const results = { success: 0, failed: 0 };

  for (let i = 0; i < mockSessions.length; i++) {
    const result = await migrateSession(mockSessions[i], i, mockSessions.length);
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

  // 步驟 6: 驗證資料完整性
  logStep(6, totalSteps, '驗證資料完整性');

  try {
    const sessionsResult = await pool.query('SELECT COUNT(*) as count FROM sessions');
    const rolesResult = await pool.query('SELECT COUNT(*) as count FROM session_roles');
    const addonsResult = await pool.query('SELECT COUNT(*) as count FROM session_addon_registrations');

    const sessionsCount = parseInt(sessionsResult.rows[0].count);
    const rolesCount = parseInt(rolesResult.rows[0].count);
    const addonsCount = parseInt(addonsResult.rows[0].count);

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
  log('✨ Neon 設定完成！', 'green');
  log('='.repeat(60), 'cyan');

  logInfo('\n下一步：');
  log('  1. 啟動開發伺服器：npm run dev');
  log('  2. 前往管理員後台：http://localhost:3000/admin/sessions');
  log('  3. 前往前台課程頁面：http://localhost:3000/sessions\n');

  // 關閉連線池
  await pool.end();
}

main().catch(error => {
  logError('\n設定過程發生錯誤');
  logError(error instanceof Error ? error.message : '未知錯誤');
  console.error(error);
  process.exit(1);
});
