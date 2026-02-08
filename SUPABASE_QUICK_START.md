# Supabase 快速開始指南 ⚡

## 只需 3 步驟！

### 步驟 1: 建立 Supabase 專案（5 分鐘）

1. 前往 **[Supabase](https://supabase.com/)**
2. 點擊「**Start your project**」或「**New Project**」
3. 填寫資訊：
   - **Name**: `snow-wolf-sound-studio`
   - **Database Password**: 設定一個強密碼（請記住！）
   - **Region**: 選擇 `Northeast Asia (Tokyo)`
4. 點擊「**Create new project**」
5. 等待 2 分鐘讓專案建立完成

### 步驟 2: 取得 API 金鑰（1 分鐘）

1. 在專案儀表板，點擊左側的「**Settings**」（齒輪圖示）
2. 點擊「**API**」
3. 複製以下兩個值：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 步驟 3: 設定環境變數並執行自動化腳本（2 分鐘）

1. **在專案根目錄建立或編輯 `.env.local` 檔案**：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=你的_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_public_key
```

2. **執行自動化設定腳本**：

```bash
npm run setup-supabase
```

這個腳本會自動完成：
- ✅ 驗證環境變數
- ✅ 建立所有資料表
- ✅ 設定 RLS 政策
- ✅ 遷移所有課程資料
- ✅ 驗證資料完整性

---

## 🎉 完成！

現在你可以：

```bash
npm run dev
```

然後前往：
- **管理員後台**: http://localhost:3000/admin/sessions
- **前台課程頁面**: http://localhost:3000/sessions

---

## ⚠️ 如果自動化腳本失敗

如果 `npm run setup-supabase` 無法自動建立資料表，請手動執行：

1. 在 Supabase 儀表板，點擊「**SQL Editor**」
2. 點擊「**New query**」
3. 複製貼上 `SUPABASE_SETUP_GUIDE.md` 中的 SQL 腳本
4. 點擊「**Run**」
5. 重新執行 `npm run setup-supabase`

---

## 📚 詳細文件

如需更多資訊，請參考：
- `SUPABASE_SETUP_GUIDE.md` - 完整的設定步驟和 SQL 腳本
- `ADMIN_SESSION_MANAGEMENT_IMPLEMENTATION.md` - 實作進度和技術細節

---

## 🆘 常見問題

### Q: 找不到 Project URL 和 anon key？
A: 在 Supabase 專案中，點擊左側「Settings」→「API」，就能看到這兩個值。

### Q: 環境變數設定後還是報錯？
A: 確認 `.env.local` 檔案在專案根目錄，並且重新啟動開發伺服器。

### Q: 資料遷移失敗？
A: 檢查 Supabase 儀表板的「Logs」查看錯誤訊息，或手動執行 SQL 腳本。

### Q: 如何重新遷移資料？
A: 直接再次執行 `npm run setup-supabase`，腳本會自動清空舊資料並重新匯入。
