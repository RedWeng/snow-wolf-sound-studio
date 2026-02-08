# 管理者登入系統說明

## 功能概述

已建立完整的管理者登入驗證系統，確保只有授權的管理者才能存取後台管理功能。

## 主要功能

### 1. 管理者登入頁面
- **路徑**: `/admin/login`
- **功能**: 
  - 電子郵件 + 密碼登入
  - JWT token 驗證
  - 登入失敗記錄
  - 美觀的 UI 設計

### 2. 自動驗證保護
- 所有 `/admin/*` 頁面都受保護
- 未登入自動導向登入頁
- 非管理者無法存取
- Token 過期自動登出

### 3. 管理者導航列
- 顯示管理者資訊
- 快速導航連結
- 登出功能

## 預設帳號

在 `.env.local` 中設定：

```env
ADMIN_LOGIN_EMAIL=admin@snowwolf.com
ADMIN_LOGIN_PASSWORD=SnowWolf2026!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

## 使用方式

### 1. 存取管理後台
1. 開啟瀏覽器前往 `http://localhost:3000/admin`
2. 自動導向登入頁面
3. 輸入管理者帳號密碼
4. 登入成功後進入管理後台

### 2. 修改管理者帳號
編輯 `.env.local` 檔案：
```env
ADMIN_LOGIN_EMAIL=your-email@example.com
ADMIN_LOGIN_PASSWORD=your-secure-password
```

### 3. 登出
點擊右上角的「登出」按鈕

## 安全性功能

### 1. JWT Token 驗證
- 使用 JWT token 進行身份驗證
- Token 有效期 24 小時
- 儲存在 localStorage

### 2. 登入記錄
- 記錄所有登入嘗試
- 失敗的登入會被記錄在 console
- 包含時間戳記和 email

### 3. 路由保護
- 使用 Layout 中介層保護所有管理頁面
- 自動檢查登入狀態
- 自動檢查管理者權限

## 檔案結構

```
app/
├── admin/
│   ├── layout.tsx          # 管理者 Layout（含驗證）
│   ├── login/
│   │   └── page.tsx        # 管理者登入頁面
│   ├── sessions/           # 課程管理
│   ├── orders/             # 訂單管理
│   └── waitlist/           # 候補名單
└── api/
    └── admin/
        └── login/
            └── route.ts    # 登入 API 端點
```

## 生產環境部署注意事項

### 1. 更改預設密碼
**重要**: 在部署到生產環境前，務必更改預設密碼！

### 2. 設定環境變數
在 Vercel 或其他平台設定環境變數：
- `ADMIN_LOGIN_EMAIL`
- `ADMIN_LOGIN_PASSWORD`
- `JWT_SECRET`（使用強隨機字串）

### 3. 產生安全的 JWT Secret
```bash
# 使用 Node.js 產生隨機字串
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. 啟用 HTTPS
確保生產環境使用 HTTPS，保護登入資訊傳輸安全。

### 5. 考慮使用資料庫
目前管理者帳號儲存在環境變數中。
未來可以考慮：
- 將管理者帳號存入資料庫
- 支援多個管理者帳號
- 密碼加密（bcrypt）
- 角色權限管理

## 測試

### 測試登入功能
1. 前往 `http://localhost:3000/admin`
2. 使用預設帳號登入：
   - Email: `admin@snowwolf.com`
   - Password: `SnowWolf2026!`
3. 確認可以存取管理後台
4. 測試登出功能
5. 確認登出後無法存取管理頁面

### 測試錯誤處理
1. 輸入錯誤的密碼
2. 確認顯示錯誤訊息
3. 檢查 console 是否記錄失敗嘗試

## 未來改進建議

1. **雙因素驗證 (2FA)**
   - 增加 OTP 驗證
   - 提高安全性

2. **密碼重設功能**
   - Email 驗證
   - 重設連結

3. **登入歷史記錄**
   - 儲存到資料庫
   - 顯示登入記錄頁面

4. **IP 白名單**
   - 限制特定 IP 存取
   - 防止暴力破解

5. **Session 管理**
   - 多裝置登入管理
   - 強制登出功能

## 問題排除

### 無法登入
1. 檢查 `.env.local` 是否正確設定
2. 確認密碼沒有多餘空格
3. 檢查 console 的錯誤訊息

### Token 過期
- Token 有效期為 24 小時
- 過期後需要重新登入

### 環境變數未生效
- 修改 `.env.local` 後需要重新啟動開發伺服器
- 執行 `npm run dev`
