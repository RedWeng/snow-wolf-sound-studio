# 🚀 Neon 快速開始（2 步驟）

## ✅ 你現在要做的事

### 1️⃣ 在 Neon 網站完成專案建立

你現在看到的畫面：
- **不要執行** `npx neonctl@latest init`
- **直接在網頁上填寫**：
  - Project name: `snow-wolf-sound-studio`
  - Region: `AWS Tokyo` 或 `AWS Singapore`
  - 其他保持預設
- **點擊「Create Project」**

### 2️⃣ 執行互動式設定（自動化）

```bash
npm run setup:neon:interactive
```

這個指令會：
1. ✅ 詢問你的 Neon 連線字串
2. ✅ 自動寫入 `.env.local`
3. ✅ 自動建立資料表
4. ✅ 自動遷移課程資料
5. ✅ 完成所有設定

---

## 🎉 完成！

打開瀏覽器：
- 管理員後台：http://localhost:3000/admin/sessions
- 前台課程：http://localhost:3000/sessions

---

## 📝 手動設定（如果你想自己控制）

```bash
# 1. 手動編輯 .env.local，加入：
# DATABASE_URL=postgresql://...你的連線字串...

# 2. 安裝套件
npm install pg @types/pg

# 3. 執行設定
npm run setup:neon

# 4. 啟動開發
npm run dev
```

---

## ❓ 遇到問題？

告訴我錯誤訊息，我會幫你解決！
