# 🚀 部署檢查清單
## 快速部署指南 - 2026-02-08

---

## ✅ 部署前檢查

### 1. 建置測試
- [x] 執行 `npm run build` - **已完成**
- [x] 建置成功 - **已完成**
- [x] 無嚴重錯誤 - **已完成**

### 2. 環境變數準備
準備以下環境變數（稍後在 Vercel 設定）:

**必須設定**:
```bash
DATABASE_URL=postgresql://neondb_owner:npg_bKuSiLE0nCm3@ep-royal-cell-a11btrcy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

ADMIN_LOGIN_EMAIL=admin@snowwolf.com
ADMIN_LOGIN_PASSWORD=SnowWolf2026!

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

**選用**:
```bash
RESEND_API_KEY=re_5YHHANt2_B6mKPTGVBrxWjJPBUs53mcWB
ADMIN_EMAIL=molodyschool@gmail.com
```

---

## 🚀 部署步驟

### 方法 A: 使用 PowerShell 腳本（最簡單）

```powershell
# 執行部署腳本
.\deploy-to-vercel.ps1
```

腳本會引導你完成部署流程。

---

### 方法 B: 手動部署

#### 步驟 1: 安裝 Vercel CLI
```bash
npm install -g vercel
```

#### 步驟 2: 登入 Vercel
```bash
vercel login
```

#### 步驟 3: 部署
```bash
# 部署到正式環境
vercel --prod
```

#### 步驟 4: 設定環境變數
1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇你的專案
3. 前往 Settings > Environment Variables
4. 新增上述環境變數
5. 點擊 "Redeploy"

---

## 🔍 部署後測試

### 1. 基本功能測試
- [ ] 首頁正常顯示
- [ ] 課程列表正常顯示
- [ ] 可以加入購物車
- [ ] 可以前往結帳
- [ ] 可以提交訂單

### 2. 登入功能測試
- [ ] Email 登入正常
- [ ] 可以註冊新用戶
- [ ] 可以查看 Dashboard

### 3. 管理後台測試
- [ ] 可以登入管理後台
- [ ] 可以查看報名名單
- [ ] 可以管理課程

### 4. API 測試
- [ ] `/api/health` 回傳正常
- [ ] `/api/sessions` 回傳課程列表
- [ ] `/api/orders` 可以建立訂單

### 5. 效能測試
- [ ] 頁面載入速度 < 3 秒
- [ ] 手機版本正常顯示

---

## 📱 測試網址

**前台**:
- 首頁: `https://your-domain.vercel.app`
- 課程: `https://your-domain.vercel.app/sessions`
- 登入: `https://your-domain.vercel.app/login`

**後台**:
- 管理員登入: `https://your-domain.vercel.app/admin/login`
- Dashboard: `https://your-domain.vercel.app/admin/dashboard`

**API**:
- 健康檢查: `https://your-domain.vercel.app/api/health`

---

## ⚠️ 常見問題

### Q1: 建置失敗怎麼辦？
**A**: 檢查 Vercel 的 Build Logs，確認環境變數設定正確。

### Q2: 資料庫連線失敗？
**A**: 確認 `DATABASE_URL` 設定正確，並且 Neon 資料庫正常運作。

### Q3: 頁面顯示錯誤？
**A**: 檢查 Vercel 的 Function Logs，查看詳細錯誤訊息。

### Q4: 管理員無法登入？
**A**: 確認 `ADMIN_LOGIN_EMAIL` 和 `ADMIN_LOGIN_PASSWORD` 設定正確。

---

## 🎉 完成！

部署完成後，你的系統就可以開始接受報名了！

### 下一步：
1. ✅ 測試所有功能
2. ✅ 分享網址給用戶
3. ✅ 監控系統狀態
4. ⏳ 根據反饋優化

---

**需要幫助？**
- 詳細指南: `READY_TO_DEPLOY_2026-02-08.md`
- 社交登入: `DEPLOYMENT_GUIDE_WITH_SOCIAL_LOGIN.md`
- 快速參考: `QUICK_DEPLOY.md`

---

**準備好了嗎？開始部署！** 🚀
