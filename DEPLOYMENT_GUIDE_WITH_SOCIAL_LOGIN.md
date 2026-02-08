# 🚀 完整部署指南（含社交登入整合）
## 2026-02-08 - Vercel 部署 + Google/LINE/Facebook 登入

---

## ⚠️ 重要提醒

### 目前社交登入狀態
- ❌ **Google 登入**: 未整合（只有 UI）
- ❌ **LINE 登入**: 未整合（只有 UI）
- ❌ **Facebook 登入**: 未整合（只有 UI）

### 目前可用的登入方式
- ✅ **Email 登入**: 已完成（使用 localStorage）
- ✅ **Demo 登入**: 已完成（開發用）

---

## 📋 部署選項

### 選項 1: 快速部署（不含社交登入）⚡
**適合**: 立即上線，先讓用戶使用 Email 登入
**時間**: 30 分鐘
**優點**: 快速上線，核心功能完整
**缺點**: 用戶需要填寫 Email 和資料

### 選項 2: 完整部署（含社交登入）🔐
**適合**: 提供最佳用戶體驗
**時間**: 2-3 小時
**優點**: 用戶可以一鍵登入
**缺點**: 需要申請各平台的 OAuth 憑證

---

## 🚀 選項 1: 快速部署（推薦先執行）

### 步驟 1: 確認環境變數

檢查 `.env.local` 是否包含：
```bash
# 資料庫
DATABASE_URL=postgresql://...

# 應用程式
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email（選用）
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# 管理員
ADMIN_PASSWORD=your_secure_password
```

### 步驟 2: 建置測試

```bash
# 確保沒有 TypeScript 錯誤
npm run build

# 如果建置成功，繼續下一步
```

### 步驟 3: 部署到 Vercel

```bash
# 方法 1: 使用 Vercel CLI（推薦）
npm install -g vercel
vercel login
vercel

# 方法 2: 使用 Git 推送（自動部署）
git add .
git commit -m "Production ready - deploy"
git push origin main
# 然後在 Vercel Dashboard 連接 GitHub repo
```

### 步驟 4: 設定 Vercel 環境變數

1. 前往 Vercel Dashboard
2. 選擇你的專案
3. 前往 Settings > Environment Variables
4. 新增以下變數：

```bash
# 必須設定
DATABASE_URL=postgresql://...（你的 Neon 資料庫連線）
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
ADMIN_PASSWORD=強密碼（至少16字元）

# 選用（Email 通知）
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 步驟 5: 重新部署

```bash
# 在 Vercel Dashboard 點擊 "Redeploy"
# 或使用 CLI
vercel --prod
```

### 步驟 6: 測試生產環境

1. 前往你的網址: `https://your-domain.vercel.app`
2. 測試購買流程：
   - 選擇課程
   - 加入購物車
   - 前往結帳
   - 填寫資料（會自動建立用戶）
   - 提交訂單
3. 檢查資料庫是否有訂單記錄

---

## 🔐 選項 2: 整合社交登入（進階）

### 為什麼需要社交登入？

**優點**:
- ✅ 用戶體驗更好（一鍵登入）
- ✅ 減少表單填寫
- ✅ 提高轉換率
- ✅ 自動取得用戶資料（姓名、Email）

**缺點**:
- ❌ 需要申請各平台的開發者帳號
- ❌ 需要設定 OAuth 回調 URL
- ❌ 需要額外的開發時間（2-3 小時）

### 整合方案: NextAuth.js

**推薦使用 NextAuth.js**，因為：
- ✅ 支援多種 OAuth 提供商
- ✅ 內建 session 管理
- ✅ 安全性高
- ✅ 文件完整

### 整合步驟

#### 1. 安裝 NextAuth.js

```bash
npm install next-auth
```

#### 2. 申請 OAuth 憑證

##### Google OAuth
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google+ API
4. 建立 OAuth 2.0 憑證
5. 設定授權重新導向 URI:
   - 開發: `http://localhost:3000/api/auth/callback/google`
   - 正式: `https://your-domain.vercel.app/api/auth/callback/google`
6. 取得 Client ID 和 Client Secret

##### LINE Login
1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 建立新的 Provider
3. 建立 LINE Login channel
4. 設定 Callback URL:
   - 開發: `http://localhost:3000/api/auth/callback/line`
   - 正式: `https://your-domain.vercel.app/api/auth/callback/line`
5. 取得 Channel ID 和 Channel Secret

##### Facebook Login
1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 建立新應用程式
3. 新增 Facebook Login 產品
4. 設定有效的 OAuth 重新導向 URI:
   - 開發: `http://localhost:3000/api/auth/callback/facebook`
   - 正式: `https://your-domain.vercel.app/api/auth/callback/facebook`
5. 取得 App ID 和 App Secret

#### 3. 建立 NextAuth 配置

**檔案**: `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { getPool } from '@/lib/neon/client';

// LINE Provider (需要自訂)
const LineProvider = {
  id: 'line',
  name: 'LINE',
  type: 'oauth',
  authorization: {
    url: 'https://access.line.me/oauth2/v2.1/authorize',
    params: { scope: 'profile openid email' },
  },
  token: 'https://api.line.me/oauth2/v2.1/token',
  userinfo: 'https://api.line.me/v2/profile',
  profile(profile: any) {
    return {
      id: profile.userId,
      name: profile.displayName,
      email: profile.email,
      image: profile.pictureUrl,
    };
  },
  clientId: process.env.LINE_CLIENT_ID,
  clientSecret: process.env.LINE_CLIENT_SECRET,
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    LineProvider as any,
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 當用戶登入時，自動建立或更新資料庫記錄
      const pool = getPool();
      
      try {
        // 檢查用戶是否存在
        const checkQuery = 'SELECT * FROM users WHERE email = $1';
        const checkResult = await pool.query(checkQuery, [user.email]);
        
        if (checkResult.rows.length > 0) {
          // 更新現有用戶
          const updateQuery = `
            UPDATE users
            SET full_name = $1,
                updated_at = NOW()
            WHERE email = $2
            RETURNING *
          `;
          await pool.query(updateQuery, [user.name, user.email]);
        } else {
          // 建立新用戶
          const insertQuery = `
            INSERT INTO users (email, full_name)
            VALUES ($1, $2)
            RETURNING *
          `;
          await pool.query(insertQuery, [user.email, user.name]);
        }
        
        return true;
      } catch (error) {
        console.error('Error saving user to database:', error);
        return false;
      }
    },
    async session({ session, token }) {
      // 從資料庫取得完整的用戶資料
      if (session.user?.email) {
        const pool = getPool();
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [session.user.email]);
        
        if (result.rows.length > 0) {
          session.user = {
            ...session.user,
            id: result.rows[0].id,
            phone: result.rows[0].phone,
          };
        }
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### 4. 更新登入頁面

**檔案**: `app/login/page.tsx`

```typescript
import { signIn } from 'next-auth/react';

const handleOAuthLogin = async (provider: 'google' | 'line' | 'facebook') => {
  setIsLoading(true);
  setError('');

  try {
    // 使用 NextAuth 進行 OAuth 登入
    const result = await signIn(provider, {
      callbackUrl: redirectTo,
      redirect: false,
    });

    if (result?.error) {
      setError(t.error);
    } else if (result?.url) {
      router.push(result.url);
    }
  } catch (err) {
    setError(t.error);
  } finally {
    setIsLoading(false);
  }
};
```

#### 5. 更新環境變數

**開發環境** (`.env.local`):
```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LINE Login
LINE_CLIENT_ID=your-line-channel-id
LINE_CLIENT_SECRET=your-line-channel-secret

# Facebook Login
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
```

**生產環境** (Vercel):
在 Vercel Dashboard 新增相同的環境變數，但 `NEXTAUTH_URL` 改為你的正式網址。

#### 6. 測試社交登入

```bash
# 啟動開發伺服器
npm run dev

# 測試流程:
1. 前往 http://localhost:3000/login
2. 點擊 "Login with Google"
3. 完成 Google 授權
4. 確認自動建立用戶記錄
5. 確認可以正常使用系統
```

---

## 📊 部署後檢查清單

### 基本功能
- [ ] 首頁正常顯示
- [ ] 課程列表正常顯示
- [ ] 可以加入購物車
- [ ] 可以前往結帳
- [ ] 可以提交訂單
- [ ] 訂單資料正確儲存到資料庫

### 登入功能
- [ ] Email 登入正常（如果使用選項 1）
- [ ] Google 登入正常（如果使用選項 2）
- [ ] LINE 登入正常（如果使用選項 2）
- [ ] Facebook 登入正常（如果使用選項 2）

### 管理後台
- [ ] 可以登入管理後台
- [ ] 可以查看報名名單
- [ ] 可以查看參加者
- [ ] 可以管理課程

### 效能
- [ ] 頁面載入速度 < 3 秒
- [ ] API 回應時間 < 1 秒
- [ ] 手機版本正常顯示

---

## 🎯 建議的執行順序

### 今天（立即上線）
1. ✅ **執行選項 1: 快速部署**
   - 不含社交登入
   - 使用 Email 登入
   - 30 分鐘完成
   - 立即可以接受報名

### 明天（優化體驗）
2. ⏳ **執行選項 2: 整合社交登入**
   - 申請 OAuth 憑證（1 小時）
   - 整合 NextAuth.js（1 小時）
   - 測試和調整（1 小時）
   - 部署更新

---

## 🚨 重要注意事項

### 關於社交登入
1. **不是必須的**: 系統目前使用 Email 登入也能完整運作
2. **可以之後加**: 社交登入可以在上線後再慢慢整合
3. **用戶體驗**: 有社交登入會更方便，但不影響核心功能

### 關於部署
1. **先測試**: 在本地完整測試後再部署
2. **備份資料**: 部署前備份資料庫
3. **監控**: 部署後密切監控系統狀態
4. **準備回滾**: 如果有問題可以快速回滾

---

## 📞 需要幫助？

### 如果遇到問題

**部署問題**:
- 檢查 Vercel 的 Build Logs
- 確認環境變數設定正確
- 確認資料庫連線正常

**社交登入問題**:
- 檢查 OAuth 憑證是否正確
- 確認 Callback URL 設定正確
- 檢查瀏覽器 Console 的錯誤訊息

---

## ✅ 我的建議

**立即執行**: 選項 1（快速部署）
- 系統已經完整可用
- Email 登入足夠使用
- 可以立即接受報名
- 30 分鐘內完成

**之後優化**: 選項 2（社交登入）
- 等系統穩定運作後
- 根據用戶反饋決定
- 不急於一時

**現在最重要的是**: 讓系統上線，開始接受報名！🚀

---

**指南版本**: 1.0
**最後更新**: 2026-02-08
**作者**: Kiro AI Assistant

