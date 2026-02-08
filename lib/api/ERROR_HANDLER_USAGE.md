# 統一錯誤處理使用指南

## 概述

統一錯誤處理機制為 API 路由提供一致的錯誤處理方式，確保在 500 人同時上線時能夠穩定運行。

## 核心功能

1. **APIError 類別** - 結構化的錯誤類型
2. **handleAPIError 函數** - 統一錯誤處理
3. **withErrorHandler 包裝器** - 自動錯誤捕獲
4. **資料庫錯誤處理** - 自動轉換資料庫錯誤
5. **驗證錯誤處理** - 輸入驗證支援

## 快速開始

### 1. 基本使用 - withErrorHandler

最簡單的方式是使用 `withErrorHandler` 包裝你的 API 路由：

```typescript
// app/api/sessions/route.ts
import { withErrorHandler, createNotFoundError } from '@/lib/api/error-handler';

export const GET = withErrorHandler(async (request) => {
  const sessions = await db.query('SELECT * FROM sessions');
  
  if (sessions.length === 0) {
    throw createNotFoundError('課程');
  }
  
  return Response.json({ sessions });
});
```

### 2. 手動錯誤處理

如果需要更細緻的控制：

```typescript
// app/api/orders/route.ts
import { 
  handleAPIError, 
  APIError, 
  ErrorCodes,
  validateRequiredFields,
  safeJSONParse 
} from '@/lib/api/error-handler';

export async function POST(request: Request) {
  try {
    // 安全解析 JSON
    const body = await safeJSONParse(request);
    
    // 驗證必要欄位
    validateRequiredFields(body, ['sessionId', 'childId', 'paymentMethod']);
    
    // 業務邏輯
    const session = await getSession(body.sessionId);
    if (!session) {
      throw new APIError(404, '課程不存在', ErrorCodes.NOT_FOUND);
    }
    
    if (session.registered_count >= session.capacity) {
      throw new APIError(
        422, 
        '課程已額滿', 
        ErrorCodes.SESSION_FULL
      );
    }
    
    // 建立訂單
    const order = await createOrder(body);
    
    return Response.json({ order });
    
  } catch (error) {
    return handleAPIError(error);
  }
}
```

### 3. 自訂錯誤類型

建立特定的錯誤：

```typescript
import { 
  APIError, 
  createValidationError,
  createAuthError,
  createNotFoundError,
  createBusinessError 
} from '@/lib/api/error-handler';

// 驗證錯誤
throw createValidationError('電子郵件格式不正確', { 
  field: 'email',
  value: email 
});

// 認證錯誤
throw createAuthError('請先登入');

// 資源不存在
throw createNotFoundError('訂單');

// 業務邏輯錯誤
throw createBusinessError('課程報名已截止', ErrorCodes.REGISTRATION_CLOSED);

// 自訂錯誤
throw new APIError(
  409,
  '此電子郵件已被使用',
  ErrorCodes.DUPLICATE_ENTRY,
  { email }
);
```

## 錯誤代碼參考

### 驗證錯誤 (400)
- `VALIDATION_ERROR` - 一般驗證錯誤
- `INVALID_INPUT` - 無效輸入
- `MISSING_REQUIRED_FIELD` - 缺少必要欄位

### 認證錯誤 (401)
- `UNAUTHORIZED` - 未授權
- `INVALID_TOKEN` - 無效 token
- `TOKEN_EXPIRED` - Token 過期

### 權限錯誤 (403)
- `FORBIDDEN` - 禁止存取
- `INSUFFICIENT_PERMISSIONS` - 權限不足

### 資源錯誤 (404)
- `NOT_FOUND` - 資源不存在
- `RESOURCE_NOT_FOUND` - 特定資源不存在

### 衝突錯誤 (409)
- `CONFLICT` - 資源衝突
- `DUPLICATE_ENTRY` - 重複資料
- `CAPACITY_EXCEEDED` - 超過容量

### 業務邏輯錯誤 (422)
- `BUSINESS_LOGIC_ERROR` - 一般業務邏輯錯誤
- `SESSION_FULL` - 課程已額滿
- `REGISTRATION_CLOSED` - 報名已截止
- `INVALID_PAYMENT_METHOD` - 無效付款方式

### 伺服器錯誤 (500)
- `INTERNAL_ERROR` - 內部錯誤
- `DATABASE_ERROR` - 資料庫錯誤
- `EXTERNAL_SERVICE_ERROR` - 外部服務錯誤

## 資料庫錯誤處理

資料庫錯誤會自動轉換為使用者友善的訊息：

```typescript
// PostgreSQL 唯一約束違反
// "duplicate key value violates unique constraint"
// → 409: "資料已存在，請檢查是否重複提交"

// PostgreSQL 外鍵約束違反
// "foreign key constraint"
// → 400: "關聯資料不存在，請確認資料正確性"

// PostgreSQL 非空約束違反
// "not null constraint"
// → 400: "缺少必要欄位，請填寫完整資料"

// 連線錯誤
// "connection timeout"
// → 503: "資料庫連線失敗，請稍後再試"
```

## 實際範例

### 範例 1: 訂單建立 API

```typescript
// app/api/orders/route.ts
import { 
  withErrorHandler, 
  validateRequiredFields,
  safeJSONParse,
  createBusinessError,
  ErrorCodes 
} from '@/lib/api/error-handler';
import { pool } from '@/lib/neon/client';

export const POST = withErrorHandler(async (request) => {
  // 解析請求
  const body = await safeJSONParse(request);
  
  // 驗證必要欄位
  validateRequiredFields(body, [
    'sessionId',
    'childId',
    'paymentMethod'
  ]);
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 鎖定課程記錄
    const sessionResult = await client.query(
      'SELECT * FROM sessions WHERE id = $1 FOR UPDATE',
      [body.sessionId]
    );
    
    if (sessionResult.rows.length === 0) {
      throw createBusinessError('課程不存在', ErrorCodes.NOT_FOUND);
    }
    
    const session = sessionResult.rows[0];
    
    // 檢查名額
    const countResult = await client.query(
      `SELECT COUNT(*) FROM order_items 
       WHERE session_id = $1 
       AND order_id IN (
         SELECT id FROM orders WHERE status = 'confirmed'
       )`,
      [body.sessionId]
    );
    
    const currentCount = parseInt(countResult.rows[0].count);
    
    if (currentCount >= session.capacity) {
      throw createBusinessError(
        '課程已額滿，請選擇其他課程',
        ErrorCodes.SESSION_FULL
      );
    }
    
    // 建立訂單
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [body.userId, body.totalAmount, 'pending']
    );
    
    const order = orderResult.rows[0];
    
    // 建立訂單項目
    await client.query(
      `INSERT INTO order_items (order_id, session_id, child_id)
       VALUES ($1, $2, $3)`,
      [order.id, body.sessionId, body.childId]
    );
    
    await client.query('COMMIT');
    
    return Response.json({ 
      success: true,
      order 
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});
```

### 範例 2: 課程查詢 API

```typescript
// app/api/sessions/[id]/route.ts
import { 
  withErrorHandler, 
  createNotFoundError 
} from '@/lib/api/error-handler';
import { pool } from '@/lib/neon/client';

export const GET = withErrorHandler(async (request, { params }) => {
  const { id } = params;
  
  const result = await pool.query(
    'SELECT * FROM sessions WHERE id = $1',
    [id]
  );
  
  if (result.rows.length === 0) {
    throw createNotFoundError('課程');
  }
  
  return Response.json({ 
    session: result.rows[0] 
  });
});
```

### 範例 3: 使用者認證 API

```typescript
// app/api/auth/login/route.ts
import { 
  withErrorHandler, 
  validateRequiredFields,
  safeJSONParse,
  createAuthError 
} from '@/lib/api/error-handler';
import { pool } from '@/lib/neon/client';
import bcrypt from 'bcryptjs';

export const POST = withErrorHandler(async (request) => {
  const body = await safeJSONParse(request);
  
  validateRequiredFields(body, ['email', 'password']);
  
  // 查詢使用者
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [body.email]
  );
  
  if (result.rows.length === 0) {
    throw createAuthError('電子郵件或密碼錯誤');
  }
  
  const user = result.rows[0];
  
  // 驗證密碼
  const isValid = await bcrypt.compare(body.password, user.password_hash);
  
  if (!isValid) {
    throw createAuthError('電子郵件或密碼錯誤');
  }
  
  // 建立 session
  // ...
  
  return Response.json({ 
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});
```

## 最佳實踐

### 1. 使用 withErrorHandler

優先使用 `withErrorHandler` 包裝器，它會自動捕獲並處理所有錯誤：

```typescript
// ✅ 推薦
export const POST = withErrorHandler(async (request) => {
  // 你的邏輯
});

// ❌ 不推薦（除非需要特殊處理）
export async function POST(request: Request) {
  try {
    // 你的邏輯
  } catch (error) {
    return handleAPIError(error);
  }
}
```

### 2. 使用語義化的錯誤建立函數

```typescript
// ✅ 推薦
throw createNotFoundError('課程');
throw createValidationError('電子郵件格式不正確');
throw createBusinessError('課程已額滿', ErrorCodes.SESSION_FULL);

// ❌ 不推薦
throw new APIError(404, '課程不存在');
throw new APIError(400, '電子郵件格式不正確');
```

### 3. 提供有用的錯誤訊息

```typescript
// ✅ 推薦 - 明確的錯誤訊息
throw createBusinessError(
  '課程已額滿，請選擇其他課程或加入候補名單',
  ErrorCodes.SESSION_FULL
);

// ❌ 不推薦 - 模糊的錯誤訊息
throw createBusinessError('操作失敗');
```

### 4. 在開發環境提供詳細資訊

```typescript
throw new APIError(
  400,
  '電子郵件格式不正確',
  ErrorCodes.INVALID_INPUT,
  { 
    field: 'email',
    value: email,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
);
// details 只會在開發環境顯示
```

### 5. 使用輔助函數

```typescript
// 驗證必要欄位
validateRequiredFields(body, ['email', 'password', 'name']);

// 安全解析 JSON
const body = await safeJSONParse(request);

// 驗證請求方法
validateMethod(request, ['POST', 'PUT']);
```

## 前端整合

前端應該根據錯誤代碼顯示適當的訊息：

```typescript
try {
  const response = await fetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    
    // 根據錯誤代碼處理
    switch (error.error.code) {
      case 'SESSION_FULL':
        // 顯示候補選項
        showWaitlistOption();
        break;
      case 'VALIDATION_ERROR':
        // 顯示表單錯誤
        showFormErrors(error.error.details);
        break;
      default:
        // 顯示一般錯誤
        showErrorMessage(error.error.message);
    }
  }
} catch (error) {
  // 網路錯誤
  showErrorMessage('網路連線失敗，請檢查網路設定');
}
```

## 監控和日誌

在生產環境，所有錯誤都會被記錄。建議整合專業的錯誤追蹤服務（如 Sentry）：

```typescript
import * as Sentry from '@sentry/nextjs';

export function handleAPIError(error: unknown): Response {
  // 記錄到 Sentry
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error);
  }
  
  // 記錄到控制台
  console.error('API Error:', error);
  
  // 返回錯誤回應
  // ...
}
```

## 測試

測試 API 錯誤處理：

```typescript
// __tests__/api/orders.test.ts
describe('POST /api/orders', () => {
  it('should return 400 for missing required fields', async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('MISSING_REQUIRED_FIELD');
  });
  
  it('should return 422 when session is full', async () => {
    // 模擬課程已額滿
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: 'full-session',
        childId: 'child-1',
        paymentMethod: 'credit_card',
      }),
    });
    
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error.code).toBe('SESSION_FULL');
  });
});
```

## 總結

統一錯誤處理機制提供：

- ✅ 一致的錯誤格式
- ✅ 自動資料庫錯誤轉換
- ✅ 語義化的錯誤代碼
- ✅ 開發環境詳細資訊
- ✅ 生產環境安全性
- ✅ 易於測試和監控

這確保在 500 人同時上線時，系統能夠穩定運行並提供良好的錯誤回饋。
