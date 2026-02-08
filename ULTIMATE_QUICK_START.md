# 🚀 終極快速開始指南

## 只需 1 個指令！

我已經幫你自動化了所有能自動化的步驟。

### 你只需要做 2 件事：

#### 1️⃣ 選擇並建立資料庫（2 分鐘）

**選項 A：Vercel Postgres（推薦）**
1. 前往 [Vercel 儀表板](https://vercel.com/dashboard)
2. 選擇你的專案
3. 點擊「Storage」→「Create Database」→「Postgres」
4. 建立資料庫（名稱：`snow-wolf-db`）

✅ **環境變數會自動設定！**

**選項 B：Supabase**
1. 前往 [Supabase](https://supabase.com/)
2. 建立新專案（名稱：`snow-wolf-sound-studio`）
3. 複製 Project URL 和 anon key
4. 在 `.env.local` 設定：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=你的_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_KEY
   ```

#### 2️⃣ 執行自動化腳本（2 分鐘）

```bash
npm run setup
```

**就這樣！** 🎉

這個腳本會自動：
- ✅ 檢測你使用的資料庫類型
- ✅ 驗證環境變數
- ✅ 建立所有資料表
- ✅ 設定權限政策
- ✅ 遷移所有課程資料
- ✅ 驗證資料完整性
- ✅ 顯示清楚的進度

---

## 🎯 完成後

啟動開發伺服器：

```bash
npm run dev
```

前往：
- **管理員後台**: http://localhost:3000/admin/sessions
- **前台課程頁面**: http://localhost:3000/sessions

---

## 💡 我推薦 Vercel Postgres

因為：
- ✅ 與 Vercel 部署完美整合
- ✅ 環境變數自動設定
- ✅ 不需要額外註冊
- ✅ 完全免費

---

## 📊 已自動化的內容

我已經幫你建立好：

### 後端基礎設施 ✅
- API 端點（列表、新增、編輯、刪除、複製）
- 資料存取層（CRUD 操作）
- 型別定義
- 錯誤處理

### 自動化工具 ✅
- 一鍵設定腳本
- 資料遷移腳本
- 資料驗證腳本
- 進度顯示

### 文件 ✅
- 快速開始指南
- 完整設定指南
- API 文件
- Spec 文件

---

## 🆘 如果遇到問題

執行診斷腳本：

```bash
npm run diagnose
```

這會自動檢查：
- 環境變數是否正確
- 資料庫連線是否正常
- 資料表是否存在
- 資料是否完整

---

**就是這麼簡單！** 🎊

選擇資料庫 → 執行 `npm run setup` → 完成！
