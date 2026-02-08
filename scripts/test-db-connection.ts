/**
 * 測試資料庫連線和查詢
 */

import { config } from 'dotenv';
import { Pool } from 'pg';

// 載入環境變數
config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 測試資料庫連線...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // 測試連線
    console.log('1. 測試基本連線...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ 連線成功！', result.rows[0]);

    // 列出所有課程
    console.log('\n2. 查詢所有課程...');
    const sessionsResult = await pool.query('SELECT id, title_zh, title_en FROM sessions LIMIT 5');
    console.log(`✅ 找到 ${sessionsResult.rows.length} 個課程：`);
    sessionsResult.rows.forEach(row => {
      console.log(`   - ID: ${row.id}, 標題: ${row.title_zh}`);
    });

    // 測試單一課程查詢
    if (sessionsResult.rows.length > 0) {
      const testId = sessionsResult.rows[0].id;
      console.log(`\n3. 測試查詢單一課程 (ID: ${testId})...`);
      
      const query = `
        SELECT s.*,
               json_agg(DISTINCT jsonb_build_object(
                 'id', sr.role_id,
                 'name_zh', sr.name_zh,
                 'name_en', sr.name_en,
                 'image_url', sr.image_url,
                 'capacity', sr.capacity,
                 'description_zh', sr.description_zh,
                 'description_en', sr.description_en
               )) FILTER (WHERE sr.id IS NOT NULL) as roles,
               json_object_agg(sar.addon_id, sar.count) FILTER (WHERE sar.id IS NOT NULL) as addon_registrations
        FROM sessions s
        LEFT JOIN session_roles sr ON s.id = sr.session_id
        LEFT JOIN session_addon_registrations sar ON s.id = sar.session_id
        WHERE s.id = $1
        GROUP BY s.id
      `;

      const sessionResult = await pool.query(query, [testId]);
      
      if (sessionResult.rows.length > 0) {
        console.log('✅ 查詢成功！');
        console.log('   課程資料：', {
          id: sessionResult.rows[0].id,
          title_zh: sessionResult.rows[0].title_zh,
          roles: sessionResult.rows[0].roles,
        });
      } else {
        console.log('❌ 找不到課程');
      }
    }

    console.log('\n✅ 所有測試完成！');
  } catch (error) {
    console.error('❌ 錯誤：', error);
  } finally {
    await pool.end();
  }
}

testConnection();
