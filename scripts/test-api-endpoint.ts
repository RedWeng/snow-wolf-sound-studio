/**
 * 測試 API 端點
 */

async function testAPI() {
  const testId = '1a169da0-038f-4a1c-8e78-9a8becc830ee'; // 從資料庫測試中取得的 ID
  const apiUrl = `http://localhost:3000/api/sessions/${testId}`;

  console.log(`🔍 測試 API 端點: ${apiUrl}\n`);

  try {
    const response = await fetch(apiUrl);
    
    console.log('狀態碼:', response.status);
    console.log('狀態文字:', response.statusText);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ API 回應成功！');
      console.log('課程資料：', {
        id: data.session?.id,
        title_zh: data.session?.title_zh,
        roles: data.session?.roles?.length || 0,
      });
    } else {
      console.log('\n❌ API 回應錯誤：', data);
    }
  } catch (error) {
    console.error('\n❌ 請求失敗：', error);
    console.log('\n提示：請確保開發伺服器正在運行 (npm run dev)');
  }
}

testAPI();
