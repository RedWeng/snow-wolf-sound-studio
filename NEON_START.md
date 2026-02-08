# 🚀 開始使用 Neon（最簡單版本）

## 只需要 2 個步驟！

### 1️⃣ 在 Neon 建立專案並複製連線字串

前往：https://neon.tech/
- 建立專案
- 複製連線字串（類似：`postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require`）

### 2️⃣ 選擇一種方法設定

#### 方法 A：互動式（會詢問你）

```bash
npm run setup:neon:interactive
```

#### 方法 B：一行指令（直接貼上連線字串）

```bash
npm run add-db-url "你的連線字串"
npm run setup:neon
```

**就這樣！** 🎉

---

## 啟動開發

```bash
npm run dev
```

打開：http://localhost:3000/admin/sessions

---

## 完整範例

```bash
# 1. 複製你的 Neon 連線字串
# 2. 執行（把下面的連線字串換成你的）：
npm run add-db-url "postgresql://user:pass@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# 3. 執行設定
npm run setup:neon

# 4. 啟動
npm run dev
```

---

## 詳細說明

如果需要更多資訊，請看：
- `NEON_快速開始.md` - 完整步驟
- `Neon設定指南.md` - 詳細文件
