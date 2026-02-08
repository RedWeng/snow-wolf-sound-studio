# ⚡ 快速部署指令
## 立即部署到 Vercel（不含社交登入）

---

## 🎯 現況說明

### ✅ 已完成（可以立即部署）
- 完整的購買流程
- 訂單管理系統
- 管理後台
- 資料庫整合
- Email 登入（使用 localStorage）

### ❌ 未完成（可以之後加）
- Google 登入（只有 UI，未整合 OAuth）
- LINE 登入（只有 UI，未整合 OAuth）
- Facebook 登入（只有 UI，未整合 OAuth）

### 💡 建議
**先部署現有版本，社交登入之後再加！**

---

## 🚀 快速部署步驟

### 步驟 1: 確認建置成功

```bash
npm run build
```

**預期結果**: 
- ✅ 建置成功，沒有錯誤
- ✅ 顯示 "Compiled successfully"

**如果有錯誤**: 
- 檢查 TypeScript 錯誤
- 修復後重新建置

---

### 步驟 2: 部署到 Vercel

#### 方法 A: 使用 Vercel CLI（推薦）

```bash
# 1. 安裝 Vercel CLI
npm install -g vercel

# 2. 登入 Vercel
vercel login

# 3. 部署（第一次會問一些問題）
vercel

# 4. 部署到生產環境
vercel --prod
```

**回答問題**:
- Set up and deploy? → Yes
- Which scope? → 選擇你的帳號
- Link to existing project? → No
- What's your project's name? → snowwolf-recording-party（或你想要的名稱）
- In which directory is your code located? → ./
- Want to override the settings? → No

#### 方法 B: 使用 GitHub（自動部署）

```bash
# 1. 推送到 GitHub
git add .
git commit -m "Production ready - deploy"
git push origin main

# 2. 前往 Vercel Dashboard
# https://vercel.com/dashboard

# 3. 點擊 "Add New Project"

# 4. 選擇你的 GitHub repository

# 5. 點擊 "Deploy"
```

---

### 步驟 3: 設定環境變數

**在 Vercel Dashboard**:

1. 前往你的專案
2. 點擊 "Settings"
3. 點擊 "Environment Variables"
4. 新增以下變數：

```bash
# 必須設定（複製你的 .env.local）
DATABASE_URL=postgresql://...
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
ADMIN_PASSWORD=你的管理員密碼

# 選用（Email 通知）
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**重要**: 
- `DATABASE_URL` 必須是你的 Neon 資料庫連線
- `NEXT_PUBLIC_BASE_URL` 改成你的 Vercel 網址
- `ADMIN_PASSWORD` 設定一個強密碼

---

### 步驟 4: 重新部署

設定環境變數後，需要重新部署：

```bash
# 方法 A: 使用 CLI
vercel --prod

# 方法 B: 在 Vercel Dashboard
# 前往 Deployments → 點擊最新的部署 → 點擊 "Redeploy"
```

---

### 步驟 5: 測試生產環境

1. **前往你的網址**: `https://your-project.vercel.app`

2. **測試購買流程**:
   ```
   ✅ 首頁顯示正常
   ✅ 可以瀏覽課程
   ✅ 可以加入購物車
   ✅ 可以前往結帳
   ✅ 填寫資料後可以提交訂單
   ✅ 顯示訂單編號
   ```

3. **檢查資料庫**:
   - 前往 Neon Dashboard
   - 查看 `users` 表是否有新記錄
   - 查看 `orders` 表是否有新訂單
   - 查看 `order_items` 表是否有訂單項目

4. **測試管理後台**:
   ```
   ✅ 前往 /admin/login
   ✅ 輸入管理員密碼
   ✅ 可以查看報名名單
   ✅ 可以查看參加者
   ```

---

## 🎉 部署完成！

你的網站現在已經上線了！

### 你的網址
```
https://your-project.vercel.app
```

### 管理後台
```
https://your-project.vercel.app/admin/login
```

---

## 📱 分享給用戶

### 給家長的訊息範本

```
🎉 雪狼男孩錄音派對報名系統上線了！

立即報名: https://your-project.vercel.app

📝 報名步驟:
1. 瀏覽課程
2. 選擇適合的場次
3. 填寫孩子和家長資料
4. 完成報名

💰 多人優惠:
- 報名 2 場/2 人: 每項折扣 $300
- 報名 3 場/3 人: 每項折扣 $400

有任何問題歡迎聯絡我們！
```

---

## 🔧 常見問題

### Q: 部署後顯示 500 錯誤
**A**: 檢查環境變數是否設定正確，特別是 `DATABASE_URL`

### Q: 訂單建立失敗
**A**: 檢查資料庫連線，確認 Neon 資料庫正在運行

### Q: 管理後台無法登入
**A**: 確認 `ADMIN_PASSWORD` 環境變數已設定

### Q: Email 沒有收到
**A**: 
- 如果沒設定 `RESEND_API_KEY`，Email 不會發送（這是正常的）
- 可以在 Vercel Logs 中看到 Email 內容
- 之後可以設定 Resend 來發送真實 Email

---

## 🚨 緊急回滾

如果部署後發現問題，可以快速回滾：

```bash
# 在 Vercel Dashboard
1. 前往 Deployments
2. 找到上一個正常的部署
3. 點擊 "..." → "Promote to Production"
```

---

## 📊 監控

### Vercel Analytics
- 前往 Vercel Dashboard → Analytics
- 查看訪問量、效能指標

### 資料庫監控
- 前往 Neon Dashboard
- 查看連線數、查詢效能

### 錯誤追蹤
- 前往 Vercel Dashboard → Logs
- 查看即時錯誤訊息

---

## 🎯 下一步

### 立即執行
- ✅ 部署完成
- ✅ 測試通過
- ✅ 開始接受報名

### 之後優化
- ⏳ 整合社交登入（Google、LINE、Facebook）
- ⏳ 整合金流（ECPay）
- ⏳ 設定 Email 服務（Resend）
- ⏳ 效能優化
- ⏳ SEO 優化

---

## ✅ 檢查清單

部署前:
- [ ] `npm run build` 成功
- [ ] 本地測試通過
- [ ] 環境變數準備好

部署中:
- [ ] Vercel 部署成功
- [ ] 環境變數已設定
- [ ] 重新部署完成

部署後:
- [ ] 網站可以訪問
- [ ] 購買流程正常
- [ ] 資料庫有記錄
- [ ] 管理後台可用

---

**準備好了嗎？執行 `npm run build` 開始部署！** 🚀

