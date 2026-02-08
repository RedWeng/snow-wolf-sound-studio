# Vercel Postgres 快速開始指南 ⚡

## 只需 2 步驟！（比 Supabase 更簡單）

### 步驟 1: 在 Vercel 建立 Postgres 資料庫（2 分鐘）

1. 前往你的 **[Vercel 儀表板](https://vercel.com/dashboard)**
2. 選擇你的專案（`snow-wolf-sound-studio`）
3. 點擊「**Storage**」標籤
4. 點擊「**Create Database**」
5. 選擇「**Postgres**」
6. 填寫資訊：
   - **Database Name**: `snow-wolf-db`
   - **Region**: 選擇最近的區域（例如：Singapore）
7. 點擊「**Create**」
8. 等待 1 分鐘讓資料庫建立完成

✅ **完成！環境變數會自動設定到你的專案**

### 步驟 2: 執行自動化腳本（2 分鐘）

回到本地專案，執行：

```bash
npm run setup-database
```

這個腳本會自動：
- ✅ 建立所有資料表
- ✅ 遷移所有課程資料
- ✅ 驗證資料完整性

**就這樣！** 🎉

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

## 💡 Vercel Postgres 免費額度

**Hobby 方案（免費）包含：**
- ✅ 256 MB 儲存空間
- ✅ 60 小時運算時間/月
- ✅ 無限資料傳輸
- ✅ 自動備份

**你的使用量：**
- 資料庫大小：< 1 MB（7 個課程）
- 運算時間：< 5 小時/月（查詢很快）

**結論：完全夠用！** ✅

---

## 🆚 為什麼選 Vercel Postgres？

相比 Supabase：
- ✅ **更簡單** - 不需要額外註冊
- ✅ **更整合** - 與 Vercel 部署無縫整合
- ✅ **更快速** - 資料庫在同一區域
- ✅ **自動設定** - 環境變數自動注入

---

## 🔧 技術細節

Vercel Postgres 使用：
- **PostgreSQL 15** - 與 Supabase 相同的資料庫
- **@vercel/postgres** - 官方 SDK
- **連線池** - 自動管理連線

所有 API 和資料存取層都已經準備好，只需要連接資料庫！

---

## 📚 相關文件

- 完整實作進度：`ADMIN_SESSION_MANAGEMENT_IMPLEMENTATION.md`
- API 文件：查看 `app/api/sessions/` 目錄
- 資料存取層：`lib/db/sessions.ts`

---

## 🆘 需要協助？

如果遇到問題：
1. 確認 Vercel 資料庫已建立完成
2. 確認環境變數已自動設定
3. 查看 Vercel 儀表板的「Logs」
4. 重新部署專案：`vercel --prod`

---

**建立時間**: 2026-02-08  
**狀態**: ✅ 準備就緒，等待資料庫建立
