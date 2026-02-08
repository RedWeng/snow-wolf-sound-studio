# Email 自動化系統設定指南 📧

## 🎉 已完成功能

### 1. Email 模板系統
✅ 報名確認信（給家長）
✅ 付款待確認通知（給你）
✅ 報名成功確認信（給家長）

### 2. 付款證明上傳頁面
✅ 專屬連結（從 Email 點擊進入）
✅ 上傳截圖功能
✅ 輸入後五碼選項

### 3. 後台管理系統
✅ 訂單列表（待確認/已確認）
✅ 查看付款證明
✅ 一鍵確認並自動發送成功信

---

## 📝 設定步驟（5 分鐘完成）

### 步驟 1：註冊 Resend 帳號

1. 前往 [Resend 官網](https://resend.com/)
2. 點擊「Sign Up」註冊（免費方案每月 3,000 封）
3. 驗證 Email

### 步驟 2：取得 API Key

1. 登入 Resend 後台
2. 點擊左側「API Keys」
3. 點擊「Create API Key」
4. 名稱填寫：`Snow Wolf Production`
5. 複製產生的 API Key（re_開頭）

### 步驟 3：設定環境變數

1. 在專案根目錄創建 `.env.local` 檔案：

```bash
# 複製 .env.example 並重新命名
copy .env.example .env.local
```

2. 編輯 `.env.local`，填入你的 API Key：

```env
RESEND_API_KEY=re_你的API金鑰
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_EMAIL=molodyschool@gmail.com
```

### 步驟 4：驗證網域（重要！）

**為什麼需要驗證網域？**
- 未驗證網域只能發送到你自己的 Email
- 驗證後才能發送給客戶

**驗證步驟：**

1. 在 Resend 後台點擊「Domains」
2. 點擊「Add Domain」
3. 輸入你的網域（例如：`snowwolf.com`）
4. 按照指示在你的 DNS 設定中新增記錄：
   - TXT 記錄（用於驗證）
   - MX 記錄（用於接收退信）
   - DKIM 記錄（用於防止被當垃圾郵件）

5. 等待驗證完成（通常 5-30 分鐘）

**暫時測試方案（未驗證網域前）：**
```typescript
// 在 lib/email/service.ts 中暫時改為：
const FROM_EMAIL = 'onboarding@resend.dev'; // Resend 提供的測試用寄件者
```

### 步驟 5：更新寄件者 Email

驗證網域後，更新 `lib/email/service.ts`：

```typescript
const FROM_EMAIL = 'Snow Wolf <noreply@你的網域.com>';
```

---

## 🧪 測試流程

### 本地測試

1. 啟動開發伺服器：
```bash
npm run dev
```

2. 完整流程測試：

**A. 家長報名流程：**
```
1. 訪問 http://localhost:3000
2. 完成報名流程
3. 填寫 Email（用你自己的測試）
4. 提交訂單
5. 檢查 Email 收件匣
```

**B. 付款證明上傳：**
```
1. 點擊 Email 中的「上傳付款證明」按鈕
2. 選擇付款方式
3. 上傳截圖或輸入後五碼
4. 提交
5. 檢查你的 Email（molodyschool@gmail.com）
```

**C. 後台確認付款：**
```
1. 訪問 http://localhost:3000/admin/orders
2. 查看待確認訂單
3. 點擊「確認付款並通知家長」
4. 檢查家長 Email 收到成功通知
```

---

## 📧 Email 流程圖

```
家長完成報名
    ↓
✉️ 自動發送「報名確認信」給家長
    - 訂單詳情
    - 付款資訊
    - 「上傳付款證明」按鈕
    ↓
家長點擊按鈕 → 上傳付款證明
    ↓
✉️ 自動發送「付款待確認通知」給你 (molodyschool@gmail.com)
    - 訂單資訊
    - 付款證明截圖
    - 「前往後台確認」按鈕
    ↓
你在後台點擊「確認付款」
    ↓
✉️ 自動發送「報名成功確認信」給家長
    - 恭喜報名成功
    - 課程詳情
    - 上課地點和注意事項
```

---

## 🎨 Email 預覽

### 1. 報名確認信（給家長）
- 標題：✅ Snow Wolf 報名確認 - 訂單編號 SW...
- 內容：
  - 訂單詳情
  - 報名課程列表
  - 付款方式說明
  - 大按鈕：「上傳付款證明」

### 2. 付款待確認通知（給你）
- 標題：🔔 新付款待確認 - SW...
- 內容：
  - 家長資訊
  - 訂單金額
  - 付款證明截圖
  - 大按鈕：「前往後台確認付款」

### 3. 報名成功確認信（給家長）
- 標題：🎊 報名成功！歡迎加入 Snow Wolf
- 內容：
  - 恭喜訊息
  - 課程時間地點
  - 課前提醒事項
  - 聯絡資訊

---

## 🔧 進階設定

### 自訂 Email 模板

編輯 `lib/email/templates.tsx` 可以修改：
- Email 樣式（顏色、字體、排版）
- 文字內容
- 按鈕連結
- 圖片和 Logo

### 新增更多通知

在 `lib/email/service.ts` 中可以新增：
- 課程提醒通知（上課前 1 天）
- 取消訂單通知
- 退款通知
- 課程變更通知

---

## ⚠️ 注意事項

### Email 發送限制

**Resend 免費方案：**
- 每月 3,000 封
- 每天 100 封
- 足夠小型工作室使用

**如果超過限制：**
- 升級到付費方案（$20/月 50,000 封）
- 或使用其他服務（SendGrid, AWS SES）

### 防止被當垃圾郵件

1. ✅ 驗證網域（最重要）
2. ✅ 設定 DKIM 記錄
3. ✅ 避免使用垃圾郵件關鍵字
4. ✅ 提供取消訂閱連結（未來可加）

### 資料安全

- ❌ 不要把 API Key 上傳到 GitHub
- ✅ 使用 `.env.local`（已在 .gitignore 中）
- ✅ 定期更換 API Key

---

## 🚀 上線部署

### Vercel 部署

1. 推送程式碼到 GitHub
2. 在 Vercel 連接專案
3. 設定環境變數：
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_BASE_URL`（改為正式網址）
   - `ADMIN_EMAIL`

4. 部署完成！

### 更新 Email 中的連結

部署後，記得更新 `.env.local`：
```env
NEXT_PUBLIC_BASE_URL=https://你的網域.com
```

---

## 📊 監控和分析

### Resend 後台可以看到：
- Email 發送成功率
- 開信率
- 點擊率
- 退信原因

### 建議監控項目：
- 每日發送量
- 失敗原因
- 客戶是否收到 Email

---

## 🆘 常見問題

**Q: Email 沒有收到？**
A: 檢查：
1. 垃圾郵件資料夾
2. API Key 是否正確
3. 網域是否已驗證
4. Resend 後台的發送記錄

**Q: 可以用 Gmail 發送嗎？**
A: 不建議。Gmail 有每日發送限制（100-500 封），且容易被擋。

**Q: 如何測試 Email 樣式？**
A: 使用 Resend 的 Email 預覽功能，或發送測試信給自己。

**Q: 可以加入附件嗎？**
A: 可以！在 `resend.emails.send()` 中加入 `attachments` 參數。

**Q: 如何追蹤 Email 開信率？**
A: Resend 自動追蹤，在後台可以看到統計數據。

---

## 📞 需要協助？

如果遇到問題：
1. 檢查 Resend 後台的錯誤訊息
2. 查看瀏覽器 Console 的錯誤
3. 確認環境變數設定正確

隨時告訴我，我可以幫你調整！

---

## ✅ 檢查清單

設定完成後，確認以下項目：

- [ ] Resend 帳號已註冊
- [ ] API Key 已取得並設定
- [ ] `.env.local` 檔案已建立
- [ ] 網域已驗證（或使用測試寄件者）
- [ ] 本地測試成功發送 Email
- [ ] 付款證明上傳頁面可正常運作
- [ ] 後台管理頁面可正常確認訂單
- [ ] 家長收到報名成功通知

全部完成後，你的 Email 自動化系統就上線了！🎉
