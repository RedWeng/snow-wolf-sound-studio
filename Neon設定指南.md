# 🚀 Neon 資料庫設定指南

## 📌 使用 Neon（免費 PostgreSQL）

Neon 是一個現代化的 serverless PostgreSQL 資料庫，完全免費！

---

## 🎯 設定步驟（2 分鐘 - 自動化版本）

### 方法 A：互動式自動設定（推薦）⭐

**只需要 2 步驟！**

#### 步驟 1：在 Neon 網站建立專案

1. 前往 https://neon.tech/
2. 登入或註冊帳號
3. 點擊「Create Project」
4. 填寫資訊：
   - **Project name**：`snow-wolf-sound-studio`
   - **Postgres version**：17（預設）
   - **Region**：選擇 `AWS Tokyo` 或 `AWS Singapore`
   - **Enable Neon Auth**：關閉（不需要）
5. 點擊「Create Project」
6. **複製連線字串**（類似：`postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require`）

#### 步驟 2：執行互動式設定

```bash
npm run setup:neon:interactive
```

腳本會：
1. ✅ 詢問你的連線字串
2. ✅ 自動寫入 `.env.local`
3. ✅ 詢問是否繼續設定
4. ✅ 自動建立資料表
5. ✅ 自動遷移課程資料

**完成！** 🎉

---

### 方法 B：手動設定（如果你想自己控制）

#### 步驟 1：完成 Neon 專案建立

**❌ 不需要執行 `npx neonctl@latest init`**

直接在 Neon 網站上建立專案（同上）

#### 步驟 2：複製連線字串

專案建立後，你會看到：

```
Connection string:
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**複製整個連線字串！**

#### 步驟 3：設定環境變數

在專案根目錄建立或編輯 `.env.local`：

```env
# Neon Database Connection
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**重要**：把上面的連線字串替換成你自己的！

#### 步驟 4：安裝 PostgreSQL 客戶端

```bash
npm install pg @types/pg
```

#### 步驟 5：執行設定腳本

```bash
npm run setup:neon
```

腳本會自動：
- ✅ 檢測 Neon 資料庫
- ✅ 建立所有資料表
- ✅ 遷移課程資料
- ✅ 驗證完成

#### 步驟 6：啟動測試

```bash
npm run dev
```

打開：
- **管理員後台**：http://localhost:3000/admin/sessions
- **前台課程**：http://localhost:3000/sessions

✅ **完成！**

---

## 🔧 程式碼已自動支援 Neon

所有 API 端點已更新，會自動檢測：
- 如果有 `DATABASE_URL` → 使用 Neon
- 如果有 `NEXT_PUBLIC_SUPABASE_URL` → 使用 Supabase

**你不需要修改任何程式碼！**

---

## 💡 Neon 的優勢

- ✅ **完全免費**（不需要信用卡）
- ✅ **Serverless**（自動擴展）
- ✅ **快速**（低延遲）
- ✅ **PostgreSQL**（完全相容）
- ✅ **簡單設定**（只需要一個連線字串）

---

## 📊 Neon 免費方案

- ✅ 3 GB 儲存空間
- ✅ 無限查詢
- ✅ 自動備份
- ✅ 分支功能（類似 Git）

**對你的專案來說綽綽有餘！**

---

## 🆘 常見問題

### Q: 找不到連線字串？
A: 在 Neon 儀表板，點擊專案 → Dashboard → Connection Details

### Q: 連線失敗？
A: 確認：
1. 連線字串完整複製（包含 `?sslmode=require`）
2. `.env.local` 檔案在專案根目錄
3. 重新啟動開發伺服器（`npm run dev`）

### Q: setup 腳本報錯？
A: 確認：
1. 已安裝 `pg` 套件：`npm install pg @types/pg`
2. `.env.local` 中的 `DATABASE_URL` 正確
3. 查看錯誤訊息，告訴我詳細內容

### Q: 需要執行 `npx neonctl@latest init` 嗎？
A: **不需要！** CLI 工具是選用的，直接在網頁上建立專案更簡單。

---

## 📝 完整流程總結

```bash
# 1. 在 Neon 網站建立專案（不用 CLI）
# 2. 複製連線字串到 .env.local
# 3. 安裝套件
npm install pg @types/pg

# 4. 執行設定
npm run setup:neon

# 5. 啟動開發
npm run dev
```

---

**現在就開始設定吧！** 🚀

有任何問題隨時問我！
