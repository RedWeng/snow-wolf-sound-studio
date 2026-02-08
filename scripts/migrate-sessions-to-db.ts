/**
 * 資料遷移腳本：將 mock data 匯入 Supabase
 * 
 * 執行方式：npm run migrate-sessions
 */

import { createClient } from '@supabase/supabase-js';
import { mockSessions } from '../lib/mock-data/sessions';
import type { Database } from '../lib/supabase/types';

// 從環境變數讀取 Supabase 設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 錯誤：缺少 Supabase 環境變數');
  console.error('請確認 .env.local 檔案中有設定：');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function migrateSession(session: typeof mockSessions[0]) {
  try {
    console.log(`\n📝 正在遷移課程：${session.title_zh}...`);

    // 準備課程資料
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

    if (sessionError) {
      throw new Error(`插入課程失敗：${sessionError.message}`);
    }

    console.log(`  ✅ 課程已插入 (ID: ${insertedSession.id})`);

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

      if (rolesError) {
        throw new Error(`插入角色失敗：${rolesError.message}`);
      }

      console.log(`  ✅ ${roles.length} 個角色已插入`);
    }

    // 插入加購項目報名數
    if (addon_registrations && Object.keys(addon_registrations).length > 0) {
      const addonsData = Object.entries(addon_registrations).map(([addon_id, count]) => ({
        session_id: insertedSession.id,
        addon_id,
        count,
      }));

      const { error: addonsError } = await supabase
        .from('session_addon_registrations')
        .insert(addonsData);

      if (addonsError) {
        throw new Error(`插入加購項目失敗：${addonsError.message}`);
      }

      console.log(`  ✅ ${Object.keys(addon_registrations).length} 個加購項目已插入`);
    }

    return { success: true, sessionId: insertedSession.id };
  } catch (error) {
    console.error(`  ❌ 遷移失敗：${error instanceof Error ? error.message : '未知錯誤'}`);
    return { success: false, error };
  }
}

async function main() {
  console.log('🚀 開始資料遷移...\n');
  console.log(`📊 總共有 ${mockSessions.length} 個課程需要遷移\n`);

  // 檢查連線
  console.log('🔌 測試 Supabase 連線...');
  const { error: connectionError } = await supabase.from('sessions').select('count').limit(1);
  if (connectionError) {
    console.error('❌ 無法連接到 Supabase：', connectionError.message);
    console.error('\n請確認：');
    console.error('1. Supabase 專案已建立');
    console.error('2. 資料表已建立（執行 SQL 腳本）');
    console.error('3. 環境變數設定正確');
    process.exit(1);
  }
  console.log('✅ Supabase 連線成功\n');

  // 詢問是否清空現有資料
  console.log('⚠️  警告：此操作將清空現有的課程資料！');
  console.log('按 Ctrl+C 取消，或按 Enter 繼續...\n');
  
  // 等待使用者確認（在 Node.js 環境中）
  if (process.stdin.isTTY) {
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
  }

  // 清空現有資料
  console.log('🗑️  清空現有資料...');
  await supabase.from('session_addon_registrations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('session_roles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ 現有資料已清空\n');

  // 遷移所有課程
  const results = {
    success: 0,
    failed: 0,
    errors: [] as any[],
  };

  for (const session of mockSessions) {
    const result = await migrateSession(session);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({ session: session.title_zh, error: result.error });
    }
  }

  // 輸出結果
  console.log('\n' + '='.repeat(60));
  console.log('📊 遷移結果');
  console.log('='.repeat(60));
  console.log(`✅ 成功：${results.success} 個課程`);
  console.log(`❌ 失敗：${results.failed} 個課程`);

  if (results.errors.length > 0) {
    console.log('\n失敗的課程：');
    results.errors.forEach(({ session, error }) => {
      console.log(`  - ${session}: ${error instanceof Error ? error.message : '未知錯誤'}`);
    });
  }

  // 驗證資料
  console.log('\n🔍 驗證資料完整性...');
  const { count: sessionsCount } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true });
  const { count: rolesCount } = await supabase
    .from('session_roles')
    .select('*', { count: 'exact', head: true });
  const { count: addonsCount } = await supabase
    .from('session_addon_registrations')
    .select('*', { count: 'exact', head: true });

  console.log(`  - 課程數量：${sessionsCount}`);
  console.log(`  - 角色數量：${rolesCount}`);
  console.log(`  - 加購項目數量：${addonsCount}`);

  console.log('\n✨ 資料遷移完成！');
  console.log('\n下一步：');
  console.log('1. 啟動開發伺服器：npm run dev');
  console.log('2. 前往管理員後台：http://localhost:3000/admin/sessions');
  console.log('3. 確認課程資料正確顯示');
}

main().catch(error => {
  console.error('\n❌ 遷移過程發生錯誤：', error);
  process.exit(1);
});
