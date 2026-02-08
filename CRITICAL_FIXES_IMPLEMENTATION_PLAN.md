# 關鍵修復實施計劃
## 500 人同時上線準備 - 2026-02-08

---

## 🚨 立即執行的修復

### 修復 1: 資料庫連線池設定

**檔案**: `lib/neon/client.ts`

**問題**: 沒有設定連線池，可能導致連線耗盡

**修復**:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // 最大連線數
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 錯誤處理
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export { pool };
```

---

### 修復 2: 訂單建立並發控制

**檔案**: `app/api/orders/route.ts`

**問題**: 沒有庫存鎖定，可能超賣

**修復策略**:
1. 使用資料庫交易
2. 使用 `SELECT FOR UPDATE` 鎖定課程記錄
3. 檢查名額後再建立訂單
4. 失敗時回滾交易

**實作**:
```typescript
// 在交易中處理
const client = await pool.connect();
try {
  await client.query('BEGIN');
  
  // 鎖定課程記錄並檢查名額
  const sessionResult = await client.query(
    'SELECT * FROM sessions WHERE id = $1 FOR UPDATE',
    [sessionId]
  );
  
  const session = sessionResult.rows[0];
  const currentRegistrations = await client.query(
    'SELECT COUNT(*) FROM order_items WHERE session_id = $1 AND order_id IN (SELECT id FROM orders WHERE status = $2)',
    [sessionId, 'confirmed']
  );
  
  if (currentRegistrations.rows[0].count >= session.capacity) {
    throw new Error('課程已額滿');
  }
  
  // 建立訂單
  // ...
  
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

---

### 修復 3: Session 安全性改善

**檔案**: `app/api/auth/login/route.ts`

**問題**: 使用 localStorage 存儲 token

**修復**:
```typescript
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

// 設定 HTTP-only cookie
const token = await new SignJWT({ userId, email })
  .setProtectedHeader({ alg: 'HS256' })
  .setExpirationTime('24h')
  .sign(new TextEncoder().encode(process.env.JWT_SECRET));

cookies().set('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 86400, // 24 hours
  path: '/',
});
```

---

### 修復 4: 統一錯誤處理

**檔案**: `lib/api/error-handler.ts` (新建)

**實作**:
```typescript
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof APIError) {
    return Response.json(
      { error: { message: error.message, code: error.code } },
      { status: error.statusCode }
    );
  }
  
  // 資料庫錯誤
  if (error instanceof Error && error.message.includes('duplicate key')) {
    return Response.json(
      { error: { message: '資料已存在', code: 'DUPLICATE' } },
      { status: 409 }
    );
  }
  
  // 預設錯誤
  return Response.json(
    { error: { message: '系統錯誤，請稍後再試', code: 'INTERNAL_ERROR' } },
    { status: 500 }
  );
}
```

---

### 修復 5: 前端錯誤處理

**檔案**: `lib/hooks/useAPIRequest.ts` (新建)

**實作**:
```typescript
export function useAPIRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const request = async <T>(
    url: string,
    options?: RequestInit,
    retries = 3
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || '請求失敗');
        }
        
        const data = await response.json();
        setLoading(false);
        return data;
      } catch (err) {
        if (i === retries - 1) {
          const message = err instanceof Error ? err.message : '網路錯誤';
          setError(message);
          setLoading(false);
          throw err;
        }
        // 等待後重試
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    
    throw new Error('請求失敗');
  };
  
  return { request, loading, error };
}
```

---

### 修復 6: 表單防重複提交

**檔案**: 所有表單元件

**實作**:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (isSubmitting) return; // 防止重複提交
  
  setIsSubmitting(true);
  try {
    await submitForm();
  } finally {
    setIsSubmitting(false);
  }
};

// 按鈕
<button disabled={isSubmitting}>
  {isSubmitting ? '處理中...' : '提交'}
</button>
```

---

### 修復 7: 即時名額顯示

**檔案**: `components/landing/SessionsGridSection.tsx`

**實作**:
```typescript
// 使用 SWR 或 React Query 實作即時更新
import useSWR from 'swr';

const { data: sessions, mutate } = useSWR(
  '/api/sessions',
  fetcher,
  {
    refreshInterval: 30000, // 每 30 秒刷新
    revalidateOnFocus: true,
  }
);

// 顯示剩餘名額
<div className="text-sm">
  剩餘名額: {session.capacity - session.registered_count}
  {session.capacity - session.registered_count <= 5 && (
    <span className="text-red-600 ml-2">即將額滿！</span>
  )}
</div>
```

---

### 修復 8: 購物車持久化

**檔案**: `lib/context/CartContext.tsx`

**實作**:
```typescript
// 使用 cookies 而非 localStorage
import Cookies from 'js-cookie';

useEffect(() => {
  // 載入購物車
  const savedCart = Cookies.get('cart');
  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);

useEffect(() => {
  // 儲存購物車
  if (cart.length > 0) {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
  } else {
    Cookies.remove('cart');
  }
}, [cart]);
```

---

### 修復 9: 圖片優化

**檔案**: 所有使用圖片的元件

**修復**:
```typescript
// 使用 Next.js Image 組件
import Image from 'next/image';

<Image
  src={session.image_url}
  alt={session.title_zh}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

---

### 修復 10: 手機觸控優化

**檔案**: `app/globals.css`

**修復**:
```css
/* 確保按鈕大小適合觸控 */
button, a {
  min-height: 44px;
  min-width: 44px;
}

/* 優化觸控反饋 */
button:active {
  transform: scale(0.98);
  transition: transform 0.1s;
}

/* 防止雙擊縮放 */
* {
  touch-action: manipulation;
}

/* 優化滾動 */
* {
  -webkit-overflow-scrolling: touch;
}
```

---

## 📊 效能監控設定

### 設定 Vercel Analytics

**檔案**: `app/layout.tsx`

```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

### 設定錯誤追蹤（Sentry）

**檔案**: `sentry.client.config.ts` (新建)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

---

## 🧪 測試計劃

### 1. 負載測試
```bash
# 使用 k6 進行負載測試
k6 run --vus 500 --duration 5m load-test.js
```

### 2. 並發測試
```bash
# 測試同時報名同一課程
# 確保不會超賣
```

### 3. 手機測試
- iPhone Safari
- Android Chrome
- 各種螢幕尺寸

### 4. 跨瀏覽器測試
- Chrome
- Safari
- Firefox
- Edge

---

## ✅ 上線前最終檢查

### 環境變數
```env
# 生產環境
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXT_PUBLIC_API_URL=https://...
EMAIL_API_KEY=...
PAYMENT_API_KEY=...
SENTRY_DSN=...
```

### 資料庫
- [ ] 連線測試通過
- [ ] 索引已建立
- [ ] 備份已設定
- [ ] 連線池已設定

### API
- [ ] Rate limiting 已啟用
- [ ] CORS 已設定
- [ ] 錯誤處理已完善
- [ ] 日誌已設定

### 前端
- [ ] 圖片已優化
- [ ] 程式碼已壓縮
- [ ] CDN 已設定
- [ ] 快取已設定

---

## 🚀 部署流程

1. 執行所有測試
2. 建立生產環境 build
3. 部署到 Vercel
4. 執行煙霧測試
5. 監控錯誤和效能
6. 準備回滾計劃

---

**建立日期**: 2026-02-08
**預計完成**: 上線前 2 小時
**負責人**: 開發團隊
