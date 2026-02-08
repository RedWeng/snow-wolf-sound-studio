# 快速開始測試 Email 系統 🚀

## 目前狀態

✅ Email 系統已建立
✅ 付款流程已整合
⏳ 等待設定 Resend API Key（可選）

---

## 方案 A：立即測試（模擬模式）⚡

**不需要任何設定，立刻可以測試！**

### 1. 查看 Email 模板預覽

訪問：`http://localhost:3000/test-email`

你可以看到三種 Email 的完整預覽：
- 報名確認信（給家長）
- 付款待確認通知（給你）
- 報名成功確認信（給家長）

**🆕 新功能：直接發送測試 Email！**
- 在預覽頁面點擊「🚀 發送測試 Email」按鈕
- 系統會立即發送測試郵件
- 需要先設定 Resend API Key（見方案 B）

### 2. 測試完整報名流程

1. 訪問：`http://localhost:3000`
2. 完成報名流程
3. 在結帳頁面填寫資料
4. 提交訂單
5. **打開瀏覽器 Console（按 F12）**
6. 你會看到：
   ```
   📧 [MOCK] Email would be sent to: 你填寫的email
   📧 [MOCK] Admin notification would be sent to: molodyschool@gmail.com
   📋 Order Details: {...}
   ```

這樣你就能看到系統會發送什麼內容！

---

## 方案 B：真實發送 Email（5 分鐘設定）📧

### 步驟 1：註冊 Resend

1. 前往：https://resend.com/
2. 點擊「Sign Up」
3. 使用 Google 或 Email 註冊
4. 驗證 Email

### 步驟 2：取得 API Key

1. 登入後，點擊左側「API Keys」
2. 點擊「Create API Key」
3. 名稱填：`Snow Wolf`
4. 複製 API Key（re_開頭）

### 步驟 3：設定環境變數

在專案根目錄創建 `.env.local` 檔案：

```env
RESEND_API_KEY=re_你的API金鑰
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 步驟 4：重啟開發伺服器

```bash
# 停止目前的伺服器（Ctrl+C）
# 重新啟動
npm run dev
```

### 步驟 5：測試真實發送

**方法 1：使用測試頁面（快速）**
1. 訪問：`http://localhost:3000/test-email`
2. 選擇要測試的 Email 模板
3. 點擊「🚀 發送測試 Email」
4. 檢查收件匣（包括垃圾郵件）

**方法 2：完整流程測試**
1. 完成報名流程
2. 填寫**你自己的 Email**
3. 提交訂單
4. **檢查你的收件匣**（包括垃圾郵件）
5. 你應該會收到報名確認信！
6. **檢查 molodyschool@gmail.com**
7. 你應該會收到付款待確認通知！

---

## ⚠️ 重要提醒

### 未驗證網域的限制

Resend 免費方案在**未驗證網域**前：
- ✅ 可以發送到**你自己註冊 Resend 的 Email**
- ❌ 無法發送到其他人的 Email

**解決方案：**

**選項 1：暫時測試（推薦）**
- 用你自己的 Email 測試
- 確認系統運作正常
- 之後再驗證網域

**選項 2：驗證網域（正式上線）**
1. 在 Resend 後台點擊「Domains」
2. 新增你的網域
3. 在 DNS 設定中新增記錄
4. 等待驗證（5-30 分鐘）
5. 驗證後就能發送給所有人！

---

## 🧪 測試檢查清單

### 模擬模式測試
- [ ] 訪問 `/test-email` 查看 Email 預覽
- [ ] 完成報名流程
- [ ] 檢查 Console 看到 Email 資訊
- [ ] 確認訂單編號產生

### 真實發送測試（需要 Resend）
- [ ] Resend 帳號已註冊
- [ ] API Key 已設定在 `.env.local`
- [ ] 開發伺服器已重啟
- [ ] 用自己的 Email 測試報名
- [ ] 收到報名確認信
- [ ] molodyschool@gmail.com 收到通知
- [ ] Email 中的按鈕可以點擊
- [ ] 付款證明上傳頁面正常運作

---

## 📊 目前功能狀態

| 功能 | 狀態 | 說明 |
|------|------|------|
| Email 模板 | ✅ 完成 | 三種模板都已建立 |
| 模擬模式 | ✅ 可用 | Console 顯示 Email 內容 |
| 真實發送 | ⏳ 待設定 | 需要 Resend API Key |
| 付款證明上傳 | ✅ 完成 | 頁面已建立 |
| 後台管理 | ✅ 完成 | 訂單列表和確認功能 |
| 自動通知 | ✅ 完成 | 確認付款後自動發信 |

---

## 🆘 遇到問題？

### Email 沒收到？

**檢查清單：**
1. ✅ 檢查垃圾郵件資料夾
2. ✅ 確認 `.env.local` 中的 API Key 正確
3. ✅ 確認開發伺服器已重啟
4. ✅ 檢查 Console 是否有錯誤訊息
5. ✅ 確認使用的是註冊 Resend 的 Email

### API Key 無效？

- 確認複製完整（包括 `re_` 開頭）
- 確認沒有多餘的空格
- 在 Resend 後台重新產生一個新的

### 想發送給其他人？

- 需要驗證網域
- 或升級到付費方案
- 詳見 `EMAIL_SETUP_GUIDE.md`

---

## 📞 下一步

1. **先用模擬模式測試**：確認流程正確
2. **設定 Resend**：開始真實發送
3. **測試完整流程**：從報名到確認
4. **驗證網域**：正式上線前完成

需要協助隨時告訴我！🎉
