# 🚀 Vercel 部署指南 - Quick Deployment Guide

## ✅ 系統狀態檢查

- [x] Build 成功（npm run build）
- [x] .gitignore 配置正確
- [x] package.json 配置完整
- [x] 核心功能已實現（85%）

---

## 📦 部署步驟

### 方法 A：使用 Vercel CLI（推薦 - 最快）

#### 1. 安裝 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登入 Vercel
```bash
vercel login
```

#### 3. 部署
```bash
# 第一次部署
vercel

# 按照提示操作：
# - Set up and deploy? Yes
# - Which scope? 選擇你的帳號
# - Link to existing project? No
# - Project name? snow-wolf-sound-studio（或自訂）
# - Directory? ./（直接按 Enter）
# - Override settings? No

# 部署到正式環境
vercel --prod
```

---

### 方法 B：使用 Vercel 網頁介面（推薦 - 最簡單）

#### 1. 推送代碼到 GitHub

```bash
# 初始化 git（如果還沒有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial deployment - Snow Wolf Recording Party"

# 連接到 GitHub repository（需要先在 GitHub 創建）
git remote add origin https://github.com/你的用戶名/snow-wolf-sound-studio.git

# 推送
git branch -M main
git push -u origin main
```

#### 2. 在 Vercel 部署

1. 訪問：https://vercel.com
2. 使用 GitHub 登入
3. 點擊 "Add New Project"
4. 選擇 "Import Git Repository"
5. 選擇你的 `snow-wolf-sound-studio` repository
6. 配置項目：
   - **Framework Preset:** Next.js（自動檢測）
   - **Root Directory:** ./（保持預設）
   - **Build Command:** `npm run build`（自動填入）
   - **Output Directory:** `.next`（自動填入）

7. **環境變數設定（重要！）：**
   
   點擊 "Environment Variables"，添加：
   
   ```
   名稱: RESEND_API_KEY
   值: [你的 Resend API Key]
   環境: Production, Preview, Development（全選）
   ```
   
   如果沒有 Resend API Key，可以先跳過，系統會使用 mock 模式。

8. 點擊 "Deploy"

9. 等待 1-2 分鐘，部署完成！

---

## 🌐 部署完成後

### 你會得到：

1. **正式環境 URL：**
   ```
   https://snow-wolf-sound-studio.vercel.app
   ```
   或自訂網域

2. **預覽環境 URL：**
   每次 push 到非 main 分支都會自動創建預覽環境

3. **自動 HTTPS**

4. **全球 CDN 加速**

---

## 🔄 持續更新流程

### 每次修改後：

```bash
# 1. 修改代碼
# 2. 測試本地
npm run dev

# 3. 提交更改
git add .
git commit -m "描述你的修改"

# 4. 推送到 GitHub
git push

# 5. Vercel 自動檢測並重新部署（30秒-2分鐘）
# 6. 助理可以立即看到更新！
```

### 查看部署狀態：

1. 訪問 Vercel Dashboard：https://vercel.com/dashboard
2. 選擇你的項目
3. 查看 "Deployments" 標籤
4. 可以看到：
   - 部署狀態（Building / Ready / Error）
   - 部署時間
   - 部署日誌
   - 預覽 URL

---

## 📧 Email 設定（重要！）

### 如果要啟用真實 Email 發送：

1. **註冊 Resend：** https://resend.com
2. **獲取 API Key**
3. **在 Vercel 添加環境變數：**
   - 進入項目設定
   - Settings → Environment Variables
   - 添加 `RESEND_API_KEY`
   - 重新部署（Deployments → 最新部署 → Redeploy）

### 如果暫時不設定：

- 系統會使用 mock 模式
- 訂單資訊會顯示在 console
- 不會真的發送 Email
- 適合測試階段

---

## 🐛 常見問題

### Q1: 部署失敗怎麼辦？

**A:** 查看部署日誌：
1. Vercel Dashboard → 你的項目 → Deployments
2. 點擊失敗的部署
3. 查看 "Build Logs"
4. 根據錯誤訊息修復

常見錯誤：
- **Build 失敗：** 本地先執行 `npm run build` 確認沒問題
- **環境變數缺失：** 檢查是否設定必要的環境變數
- **依賴問題：** 確認 `package.json` 正確

### Q2: 如何回滾到之前的版本？

**A:** 
1. Vercel Dashboard → Deployments
2. 找到想要回滾的版本
3. 點擊 "..." → "Promote to Production"

### Q3: 如何設定自訂網域？

**A:**
1. Vercel Dashboard → 你的項目 → Settings → Domains
2. 添加你的網域
3. 按照指示設定 DNS（CNAME 或 A 記錄）
4. 等待 DNS 生效（通常 5-30 分鐘）

### Q4: 部署後修改會立即生效嗎？

**A:** 是的！
- Push 到 GitHub → Vercel 自動檢測
- 自動 build（1-2 分鐘）
- 自動部署到正式環境
- 用戶刷新頁面即可看到更新

### Q5: 如何查看網站流量和錯誤？

**A:**
1. Vercel Dashboard → Analytics（需要升級方案）
2. 或使用 Google Analytics
3. 或使用 Vercel 的 Runtime Logs

---

## 🎯 給助理的測試 URL

部署完成後，將以下資訊提供給助理：

```
📱 測試網站：https://你的網站.vercel.app

🧪 測試帳號：
- Email: test@example.com
- 密碼: [如果有的話]

📋 測試重點：
1. 完整報名流程
2. 多人報名折扣
3. 角色選擇
4. 加購項目
5. 名額控制
6. 付款方式
7. 手機版體驗

🐛 回報問題：
- 使用 [Google Form / Notion / Email]
- 包含：截圖、瀏覽器、裝置、問題描述
```

---

## 📊 部署後監控

### 建議監控項目：

1. **部署狀態：** Vercel Dashboard
2. **錯誤日誌：** Vercel Runtime Logs
3. **效能：** Vercel Analytics 或 Google PageSpeed Insights
4. **使用者反饋：** 助理測試回報

### 每日檢查：

- [ ] 網站是否正常運作
- [ ] 有無新的錯誤日誌
- [ ] 助理回報的問題
- [ ] 部署是否成功

---

## 🚨 緊急回滾計劃

如果上線後發現嚴重問題：

### 方法 1：回滾到上一個版本
```bash
# Vercel Dashboard → Deployments → 選擇穩定版本 → Promote to Production
```

### 方法 2：快速修復並重新部署
```bash
# 1. 修復問題
# 2. 提交並推送
git add .
git commit -m "Hotfix: 修復嚴重問題"
git push

# 3. Vercel 自動重新部署
```

---

## ✅ 部署檢查清單

### 部署前：
- [ ] 本地 build 成功（`npm run build`）
- [ ] 核心功能測試通過
- [ ] .gitignore 配置正確
- [ ] 敏感資訊已移除

### 部署中：
- [ ] GitHub repository 創建
- [ ] 代碼推送成功
- [ ] Vercel 項目創建
- [ ] 環境變數設定（如需要）
- [ ] 部署成功

### 部署後：
- [ ] 訪問正式 URL 確認
- [ ] 測試核心功能
- [ ] 提供 URL 給助理
- [ ] 準備收集反饋
- [ ] 監控部署狀態

---

## 📞 需要幫助？

- **Vercel 文檔：** https://vercel.com/docs
- **Next.js 部署指南：** https://nextjs.org/docs/deployment
- **Vercel 支援：** https://vercel.com/support

---

**建立日期：** 2026-02-04  
**狀態：** 準備部署  
**目標：** 讓助理開始測試，持續改進
