# 🚀 立即部署 - 使用 GitHub 自動部署

## 問題說明
專案檔案太大（超過 100MB），無法直接使用 Vercel CLI 部署。
解決方案：使用 GitHub 連接 Vercel 自動部署。

---

## 立即執行（10 分鐘）

### 步驟 1: 推送到 GitHub（2 分鐘）

```bash
# 如果還沒有 GitHub repo，先建立一個
# 前往 https://github.com/new 建立新 repository

# 設定 remote（如果還沒設定）
git remote add origin https://github.com/你的用戶名/你的repo名稱.git

# 推送到 GitHub
git push -u origin master
```

### 步驟 2: 連接 Vercel（3 分鐘）

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊 "Add New Project"
3. 選擇 "Import Git Repository"
4. 選擇你的 GitHub repository
5. 點擊 "Import"

### 步驟 3: 設定環境變數（3 分鐘）

在 Vercel 專案設定中，前往 "Settings" > "Environment Variables"，新增：

```bash
DATABASE_URL=postgresql://neondb_owner:npg_bKuSiLE0nCm3@ep-royal-cell-a11btrcy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXT_PUBLIC_BASE_URL=https://你的vercel網址.vercel.app

ADMIN_LOGIN_EMAIL=admin@snowwolf.com
ADMIN_LOGIN_PASSWORD=SnowWolf2026!

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345

RESEND_API_KEY=re_5YHHANt2_B6mKPTGVBrxWjJPBUs53mcWB
ADMIN_EMAIL=molodyschool@gmail.com
```

### 步驟 4: 部署（2 分鐘）

Vercel 會自動開始建置和部署。等待完成即可！

---

## 測試（5 分鐘）

部署完成後，前往你的 Vercel 網址測試：

1. **首頁**: `https://你的網址.vercel.app`
2. **課程列表**: `https://你的網址.vercel.app/sessions`
3. **管理後台**: `https://你的網址.vercel.app/admin/login`
4. **API 健康檢查**: `https://你的網址.vercel.app/api/health`

---

## 之後的更新

每次你推送到 GitHub，Vercel 會自動重新部署：

```bash
git add .
git commit -m "更新內容"
git push
```

---

## 🎉 完成！

系統已上線，可以開始接受報名了！

**下一步**:
1. 測試所有功能
2. 新增課程資料
3. 分享網址給用戶
