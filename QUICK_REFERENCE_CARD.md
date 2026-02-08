# 快速參考卡片
## 關鍵修復功能速查

---

## 🚨 統一錯誤處理

### 基本使用

```typescript
import { withErrorHandler } from '@/lib/api/error-handler';

export const POST = withErrorHandler(async (request) => {
  // 你的邏輯
});
```

### 常用函數

```typescript
// 驗證必要欄位
validateRequiredFields(body, ['email', 'password']);

// 安全解析 JSON
const body = await safeJSONParse(request);

// 建立錯誤
throw createNotFoundError('課程');
throw createValidationError('電子郵件格式不正確');
throw createBusinessError('課程已額滿', ErrorCodes.SESSION_FULL);
```

### 常用錯誤代碼

| 代碼 | 狀態碼 | 說明 |
|------|--------|------|
| `VALIDATION_ERROR` | 400 | 驗證錯誤 |
| `UNAUTHORIZED` | 401 | 未授權 |
| `NOT_FOUND` | 404 | 資源不存在 |
| `DUPLICATE_ENTRY` | 409 | 重複資料 |
| `SESSION_FULL` | 422 | 課程已額滿 |
| `DATABASE_ERROR` | 500 | 資料庫錯誤 |

---

## 🔄 API 請求 Hook

### 基本使用

```typescript
import { useAPIRequest } from '@/lib/hooks/useAPIRequest';

const { request, loading, error } = useAPIRequest();

const data = await request('/api/orders', {
  method: 'POST',
  body: JSON.stringify(orderData),
  retries: 3,
});
```

### 便捷 Hooks

```typescript
// GET 請求
const { get, loading, error } = useAPIGet();
await get('/api/sessions');

// POST 請求
const { post, loading, error } = useAPIPost();
await post('/api/orders', orderData);

// PUT 請求
const { put, loading, error } = useAPIPut();
await put(`/api/users/${id}`, userData);

// DELETE 請求
const { delete: del, loading, error } = useAPIDelete();
await del(`/api/orders/${id}`);
```

### 選項

| 選項 | 預設值 | 說明 |
|------|--------|------|
| `retries` | 3 | 重試次數 |
| `timeout` | 30000 | 超時時間（毫秒） |
| `exponentialBackoff` | true | 指數退避 |
| `retryDelay` | 1000 | 基礎延遲（毫秒） |

---

## 📝 表單提交 Hook

### 基本使用

```typescript
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

const { handleSubmit, isSubmitting, error } = useFormSubmit({
  onSubmit: async (data) => {
    // 提交邏輯
  },
  onSuccess: (result) => {
    // 成功處理
  },
});
```

### 完整表單管理

```typescript
import { useForm } from '@/lib/hooks/useFormSubmit';

const {
  values,
  setFieldValue,
  errors,
  handleSubmit,
  isSubmitting,
} = useForm({
  initialValues: { email: '', password: '' },
  validate: (values) => {
    // 驗證邏輯
  },
  onSubmit: async (values) => {
    // 提交邏輯
  },
});
```

### 選項

| 選項 | 預設值 | 說明 |
|------|--------|------|
| `debounceDelay` | 300 | 防抖延遲（毫秒） |
| `resetOnSuccess` | false | 成功後重置 |
| `validate` | - | 驗證函數 |

---

## 🎯 常見模式

### 模式 1: API 端點

```typescript
// app/api/orders/route.ts
import { 
  withErrorHandler, 
  validateRequiredFields,
  safeJSONParse 
} from '@/lib/api/error-handler';

export const POST = withErrorHandler(async (request) => {
  const body = await safeJSONParse(request);
  validateRequiredFields(body, ['sessionId', 'childId']);
  
  // 業務邏輯
  
  return Response.json({ success: true });
});
```

### 模式 2: 表單元件

```typescript
// components/OrderForm.tsx
import { useAPIRequest } from '@/lib/hooks/useAPIRequest';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

function OrderForm() {
  const { request } = useAPIRequest();
  const { handleSubmit, isSubmitting, error } = useFormSubmit({
    onSubmit: async (data) => {
      return await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
        retries: 3,
      });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(formData);
    }}>
      <button disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '提交'}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### 模式 3: 資料庫交易

```typescript
const client = await pool.connect();

try {
  await client.query('BEGIN');
  
  // 鎖定記錄
  const result = await client.query(
    'SELECT * FROM sessions WHERE id = $1 FOR UPDATE',
    [sessionId]
  );
  
  // 業務邏輯
  
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

---

## 🔍 除錯技巧

### 檢查錯誤類型

```typescript
try {
  // 操作
} catch (error) {
  if (error instanceof APIError) {
    console.log('API Error:', error.code, error.message);
  } else {
    console.log('Unknown Error:', error);
  }
}
```

### 檢查請求狀態

```typescript
const { request, loading, error, errorCode } = useAPIRequest();

console.log('Loading:', loading);
console.log('Error:', error);
console.log('Error Code:', errorCode);
```

### 檢查表單狀態

```typescript
const { handleSubmit, isSubmitting, isSuccess, error } = useFormSubmit({
  // ...
});

console.log('Submitting:', isSubmitting);
console.log('Success:', isSuccess);
console.log('Error:', error);
```

---

## 📚 文件連結

- **錯誤處理**: `lib/api/ERROR_HANDLER_USAGE.md`
- **Hooks 使用**: `lib/hooks/HOOKS_USAGE.md`
- **整合範例**: `CRITICAL_FIXES_INTEGRATION_EXAMPLE.md`
- **檢查清單**: `CRITICAL_FIXES_CHECKLIST.md`
- **完成報告**: `CRITICAL_FIXES_COMPLETION_REPORT.md`

---

## ⚡ 效能提示

### API 端點

- ✅ 使用 `withErrorHandler` 包裝所有路由
- ✅ 使用資料庫交易處理關鍵操作
- ✅ 使用 `SELECT FOR UPDATE` 鎖定記錄
- ✅ 設定適當的索引

### 前端

- ✅ 使用 `useAPIRequest` 自動重試
- ✅ 使用 `useFormSubmit` 防止重複提交
- ✅ 顯示 Loading 狀態
- ✅ 處理錯誤訊息

---

## 🚨 常見問題

### Q: 如何處理特定錯誤？

```typescript
const { handleSubmit, error, errorCode } = useFormSubmit({
  onSubmit: async (data) => {
    // 提交邏輯
  },
  onError: (error) => {
    if (error.message.includes('額滿')) {
      showWaitlistModal();
    }
  },
});
```

### Q: 如何自訂重試邏輯？

```typescript
const data = await request('/api/orders', {
  method: 'POST',
  retries: 5,              // 重試 5 次
  retryDelay: 2000,        // 基礎延遲 2 秒
  exponentialBackoff: true, // 使用指數退避
});
```

### Q: 如何取消請求？

```typescript
const { request, cancel } = useAPIRequest();

// 發送請求
const promise = request('/api/data');

// 取消請求
cancel();
```

---

## 📞 緊急聯絡

如遇問題：
1. 查看相關文件
2. 檢查錯誤日誌
3. 聯絡技術負責人

---

**最後更新**: 2026-02-08
**版本**: 1.0
