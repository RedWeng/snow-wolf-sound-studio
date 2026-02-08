# 🧪 上線前測試指南
## 完整的測試流程 - 2026-02-08

---

## 📋 測試目標

1. ✅ 驗證完整購買流程
2. ✅ 驗證訂單資料正確儲存
3. ✅ 驗證優惠計算正確
4. ✅ 驗證課程容量控制
5. ✅ 驗證手機響應式
6. ✅ 驗證錯誤處理

---

## 🔧 測試前準備

### 1. 確認環境變數
```bash
# 檢查 .env.local 檔案
DATABASE_URL=postgresql://...  # Neon 資料庫連線
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=re_...  # Email 服務（選用）
```

### 2. 啟動開發伺服器
```bash
npm run dev
```

### 3. 清空測試資料（選用）
```sql
-- 在 Neon Dashboard 執行
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM children;
DELETE FROM users WHERE email LIKE '%test%';
```

---

## 🧪 測試案例

### 測試案例 1: 單一孩子報名單一課程

**目標**: 驗證基本購買流程

**步驟**:
1. 前往首頁 `http://localhost:3000`
2. 點擊任一課程的「查看詳情」
3. 在 Modal 中點擊「立即報名」
4. 填寫孩子資料：
   - 姓名: 測試寶寶1
   - 年齡: 5
5. 點擊「加入購物車」
6. 點擊右上角購物車圖示
7. 點擊「前往結帳」
8. 填寫家長資料：
   - 姓名: 測試家長
   - Email: test@example.com
   - 手機: 0912345678
9. 選擇付款方式: 銀行轉帳
10. 點擊「確認付款」

**預期結果**:
- ✅ 訂單建立成功
- ✅ 顯示訂單編號（SW開頭）
- ✅ 跳轉到訂單詳情頁
- ✅ 購物車已清空
- ✅ 資料庫中有訂單記錄

**驗證資料庫**:
```sql
-- 檢查用戶
SELECT * FROM users WHERE email = 'test@example.com';

-- 檢查孩子
SELECT * FROM children WHERE name = '測試寶寶1';

-- 檢查訂單
SELECT * FROM orders WHERE parent_id = (
  SELECT id FROM users WHERE email = 'test@example.com'
);

-- 檢查訂單項目
SELECT * FROM order_items WHERE order_id = (
  SELECT id FROM orders WHERE order_number LIKE 'SW%' 
  ORDER BY created_at DESC LIMIT 1
);
```

---

### 測試案例 2: 多人優惠 - 2場/2人 (-$300)

**目標**: 驗證 2場/2人優惠計算

**步驟**:
1. 清空購物車（如果有）
2. 選擇第一個課程，加入購物車（孩子: 測試寶寶1, 5歲）
3. 選擇第二個課程，加入購物車（孩子: 測試寶寶2, 6歲）
4. 查看購物車，確認優惠顯示
5. 前往結帳
6. 填寫資料並提交

**預期結果**:
- ✅ 原價: $1,800 x 2 = $3,600
- ✅ 優惠: -$300 x 2 = -$600
- ✅ 實付: $3,000
- ✅ 訂單中 discount_amount = 600
- ✅ 訂單中 final_amount = 3000

**驗證資料庫**:
```sql
SELECT 
  order_number,
  total_amount,
  discount_amount,
  final_amount
FROM orders
WHERE order_number LIKE 'SW%'
ORDER BY created_at DESC
LIMIT 1;

-- 應該顯示:
-- total_amount: 3600
-- discount_amount: 600
-- final_amount: 3000
```

---

### 測試案例 3: 多人優惠 - 3場/3人 (-$400)

**目標**: 驗證 3場/3人最高優惠

**步驟**:
1. 清空購物車
2. 選擇第一個課程（孩子: 測試寶寶1, 5歲）
3. 選擇第二個課程（孩子: 測試寶寶2, 6歲）
4. 選擇第三個課程（孩子: 測試寶寶3, 7歲）
5. 查看購物車，確認優惠顯示
6. 前往結帳並提交

**預期結果**:
- ✅ 原價: $1,800 x 3 = $5,400
- ✅ 優惠: -$400 x 3 = -$1,200
- ✅ 實付: $4,200
- ✅ 訂單中 discount_amount = 1200
- ✅ 訂單中 final_amount = 4200

---

### 測試案例 4: 課程容量控制

**目標**: 驗證防止超賣機制

**步驟**:
1. 在 Neon Dashboard 找一個課程
2. 將該課程的 capacity 設為 1
3. 將 current_registrations 設為 0
4. 嘗試報名 2 個孩子到同一課程
5. 提交訂單

**預期結果**:
- ✅ 訂單建立失敗
- ✅ 顯示錯誤訊息: "場次「XXX」名額不足！剩餘 1 個名額，您嘗試報名 2 位孩子。"
- ✅ 資料庫中沒有建立訂單
- ✅ 課程的 current_registrations 沒有變化

**驗證資料庫**:
```sql
-- 檢查課程容量
SELECT 
  title_zh,
  capacity,
  current_registrations,
  capacity - current_registrations as remaining
FROM sessions
WHERE id = 'YOUR_SESSION_ID';
```

---

### 測試案例 5: 重複用戶處理

**目標**: 驗證重複 email 的處理

**步驟**:
1. 使用相同的 email (test@example.com) 建立第二筆訂單
2. 但使用不同的姓名和電話
3. 提交訂單

**預期結果**:
- ✅ 訂單建立成功
- ✅ 用戶資料被更新（姓名、電話）
- ✅ 資料庫中只有一個 user 記錄（相同 email）
- ✅ 新訂單關聯到同一個 user

**驗證資料庫**:
```sql
-- 應該只有一筆記錄
SELECT COUNT(*) FROM users WHERE email = 'test@example.com';

-- 檢查用戶資料是否更新
SELECT * FROM users WHERE email = 'test@example.com';

-- 檢查該用戶的所有訂單
SELECT * FROM orders WHERE parent_id = (
  SELECT id FROM users WHERE email = 'test@example.com'
);
```

---

### 測試案例 6: 表單驗證

**目標**: 驗證必填欄位驗證

**步驟**:
1. 加入課程到購物車
2. 前往結帳頁
3. 不填寫任何資料，直接點擊「確認付款」
4. 逐一填寫欄位，測試驗證

**預期結果**:
- ✅ 姓名為空 → 顯示「請填寫姓名」
- ✅ Email 為空 → 顯示「請填寫 Email」
- ✅ Email 格式錯誤 → 顯示「請填寫正確的 Email 格式」
- ✅ 手機為空 → 顯示「請填寫手機號碼」
- ✅ 未選擇付款方式 → 顯示「請選擇付款方式」

---

### 測試案例 7: 角色選擇（雪狼男孩課程）

**目標**: 驗證角色選擇功能

**步驟**:
1. 選擇一個需要角色選擇的課程（雪狼男孩系列）
2. 加入購物車
3. 前往結帳
4. 不選擇角色，直接提交
5. 選擇角色後再提交

**預期結果**:
- ✅ 未選擇角色 → 顯示「請為每位孩子選擇配音角色」
- ✅ 選擇角色後 → 訂單建立成功
- ✅ 資料庫中 order_items.role_id 有值

**驗證資料庫**:
```sql
SELECT 
  oi.role_id,
  s.title_zh,
  c.name as child_name
FROM order_items oi
JOIN sessions s ON oi.session_id = s.id
JOIN children c ON oi.child_id = c.id
WHERE oi.role_id IS NOT NULL
ORDER BY oi.created_at DESC
LIMIT 5;
```

---

### 測試案例 8: 手機響應式測試

**目標**: 驗證手機版本正常運作

**步驟**:
1. 開啟 Chrome DevTools (F12)
2. 切換到手機模式（Toggle device toolbar）
3. 選擇 iPhone 12 Pro 或 Samsung Galaxy S20
4. 執行完整購買流程

**檢查項目**:
- ✅ 首頁課程卡片正常顯示
- ✅ 課程詳情 Modal 正常顯示
- ✅ 購物車側邊欄正常顯示
- ✅ 結帳頁表單正常顯示
- ✅ 所有按鈕可以點擊（≥ 44x44px）
- ✅ 文字大小適中（≥ 16px）
- ✅ 無橫向滾動
- ✅ 鍵盤彈出時佈局正常

---

### 測試案例 9: 管理後台驗證

**目標**: 驗證管理後台能看到訂單

**步驟**:
1. 建立一筆測試訂單
2. 前往管理後台 `http://localhost:3000/admin/login`
3. 登入（密碼在 .env.local 的 ADMIN_PASSWORD）
4. 查看各個管理頁面

**檢查項目**:
- ✅ Dashboard 顯示正確的統計數字
- ✅ 報名名單顯示新訂單
- ✅ 參加者管理顯示新孩子
- ✅ 訂單管理顯示新訂單
- ✅ 可以匯出 CSV

---

### 測試案例 10: 並發測試（簡易版）

**目標**: 驗證多人同時報名

**步驟**:
1. 開啟 3 個瀏覽器視窗（或無痕模式）
2. 在每個視窗中同時進行購買流程
3. 選擇同一個課程
4. 幾乎同時提交訂單

**預期結果**:
- ✅ 所有訂單都能成功建立（如果容量足夠）
- ✅ 課程的 current_registrations 正確增加
- ✅ 沒有超賣情況
- ✅ 資料庫資料一致

**驗證資料庫**:
```sql
-- 檢查課程報名人數
SELECT 
  s.title_zh,
  s.capacity,
  s.current_registrations,
  COUNT(oi.id) as actual_registrations
FROM sessions s
LEFT JOIN order_items oi ON s.id = oi.session_id
GROUP BY s.id, s.title_zh, s.capacity, s.current_registrations
HAVING COUNT(oi.id) > 0;

-- current_registrations 應該等於 actual_registrations
```

---

## 🐛 常見問題排查

### 問題 1: 訂單建立失敗 - "用戶資料不完整"

**原因**: parentInfo.id 未設定

**解決**:
1. 檢查 localStorage 中是否有 user 資料
2. 確認 user 資料包含 id 欄位
3. 清空 localStorage 重新測試

```javascript
// 在瀏覽器 Console 執行
localStorage.getItem('user')
// 應該看到包含 id 的 JSON
```

### 問題 2: 優惠計算錯誤

**原因**: 購物車資料格式不正確

**解決**:
1. 檢查 localStorage 中的 cart 資料
2. 確認每個項目都有 sessionId, childName, price
3. 清空購物車重新加入

```javascript
// 在瀏覽器 Console 執行
JSON.parse(localStorage.getItem('cart'))
```

### 問題 3: 資料庫連線失敗

**原因**: DATABASE_URL 設定錯誤

**解決**:
1. 檢查 .env.local 中的 DATABASE_URL
2. 確認 Neon 資料庫正在運行
3. 測試連線

```bash
# 執行測試腳本
npm run test:db
```

### 問題 4: Email 未收到

**原因**: RESEND_API_KEY 未設定或錯誤

**解決**:
1. 檢查 .env.local 中的 RESEND_API_KEY
2. 如果沒有設定，Email 會在 Console 中顯示（開發模式）
3. 檢查 Resend Dashboard 的發送記錄

---

## ✅ 測試完成檢查清單

### 功能測試
- [ ] 單一課程報名成功
- [ ] 多課程報名成功
- [ ] 2場/2人優惠正確
- [ ] 3場/3人優惠正確
- [ ] 課程容量控制正常
- [ ] 重複用戶處理正常
- [ ] 表單驗證正常
- [ ] 角色選擇正常（如適用）

### 資料庫驗證
- [ ] 用戶資料正確儲存
- [ ] 孩子資料正確儲存
- [ ] 訂單資料正確儲存
- [ ] 訂單項目正確儲存
- [ ] 課程報名人數正確更新
- [ ] 優惠金額正確計算

### 響應式測試
- [ ] iPhone 12 Pro 正常
- [ ] Samsung Galaxy S20 正常
- [ ] iPad 正常
- [ ] 桌面版正常

### 管理後台測試
- [ ] Dashboard 統計正確
- [ ] 報名名單正確
- [ ] 參加者管理正確
- [ ] 訂單管理正確
- [ ] CSV 匯出正常

### 錯誤處理測試
- [ ] 必填欄位驗證
- [ ] Email 格式驗證
- [ ] 課程容量不足提示
- [ ] 網路錯誤處理
- [ ] 資料庫錯誤處理

---

## 🚀 測試通過後的下一步

1. **部署到 Vercel**
   ```bash
   vercel --prod
   ```

2. **設定生產環境變數**
   - 在 Vercel Dashboard 設定所有環境變數
   - 確認 DATABASE_URL 指向正式資料庫

3. **生產環境測試**
   - 在正式網址上執行完整測試
   - 確認 Email 正常發送
   - 確認資料正確儲存

4. **監控設定**
   - 設定 Sentry 錯誤追蹤
   - 設定 Vercel Analytics
   - 設定資料庫監控告警

5. **準備上線**
   - 通知團隊
   - 準備客服支援
   - 準備回滾計劃

---

## 📞 測試支援

如果測試過程中遇到問題：

1. 檢查瀏覽器 Console 的錯誤訊息
2. 檢查 Terminal 的伺服器日誌
3. 檢查 Neon Dashboard 的資料庫日誌
4. 參考本文件的「常見問題排查」章節

---

**測試指南版本**: 1.0
**最後更新**: 2026-02-08
**下次更新**: 上線後根據實際情況更新

