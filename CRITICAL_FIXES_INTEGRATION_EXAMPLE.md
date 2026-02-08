# 關鍵修復整合範例

## 概述

本文件展示如何整合新建立的錯誤處理機制和前端 Hooks，以訂單建立流程為例。

---

## 後端 API 實作

### 訂單建立 API (app/api/orders/route.ts)

```typescript
import { 
  withErrorHandler, 
  validateRequiredFields,
  safeJSONParse,
  createBusinessError,
  createNotFoundError,
  ErrorCodes 
} from '@/lib/api/error-handler';
import { pool } from '@/lib/neon/client';

/**
 * 建立訂單 API
 * 使用統一錯誤處理和資料庫交易
 */
export const POST = withErrorHandler(async (request) => {
  // 1. 安全解析 JSON
  const body = await safeJSONParse<{
    userId: string;
    sessionId: string;
    childId: string;
    paymentMethod: string;
    addons?: string[];
  }>(request);
  
  // 2. 驗證必要欄位
  validateRequiredFields(body, [
    'userId',
    'sessionId',
    'childId',
    'paymentMethod'
  ]);
  
  // 3. 驗證付款方式
  const validPaymentMethods = ['credit_card', 'bank_transfer', 'line_pay'];
  if (!validPaymentMethods.includes(body.paymentMethod)) {
    throw createBusinessError(
      '無效的付款方式',
      ErrorCodes.INVALID_PAYMENT_METHOD
    );
  }
  
  // 4. 使用資料庫交易處理訂單建立
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 5. 鎖定課程記錄並檢查名額
    const sessionResult = await client.query(
      'SELECT * FROM sessions WHERE id = $1 FOR UPDATE',
      [body.sessionId]
    );
    
    if (sessionResult.rows.length === 0) {
      throw createNotFoundError('課程');
    }
    
    const session = sessionResult.rows[0];
    
    // 6. 檢查課程是否開放報名
    const now = new Date();
    if (new Date(session.registration_start) > now) {
      throw createBusinessError(
        '課程尚未開放報名',
        ErrorCodes.REGISTRATION_CLOSED
      );
    }
    
    if (new Date(session.registration_end) < now) {
      throw createBusinessError(
        '課程報名已截止',
        ErrorCodes.REGISTRATION_CLOSED
      );
    }
    
    // 7. 計算當前報名人數
    const countResult = await client.query(
      `SELECT COUNT(*) as count 
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.session_id = $1 
       AND o.status IN ('pending', 'confirmed')`,
      [body.sessionId]
    );
    
    const currentCount = parseInt(countResult.rows[0].count);
    
    // 8. 檢查是否額滿
    if (currentCount >= session.capacity) {
      throw createBusinessError(
        '課程已額滿，請選擇其他課程或加入候補名單',
        ErrorCodes.SESSION_FULL
      );
    }
    
    // 9. 驗證孩童是否存在
    const childResult = await client.query(
      'SELECT * FROM children WHERE id = $1 AND parent_id = $2',
      [body.childId, body.userId]
    );
    
    if (childResult.rows.length === 0) {
      throw createNotFoundError('孩童資料');
    }
    
    // 10. 計算訂單金額
    let totalAmount = session.price;
    
    // 加入附加項目
    if (body.addons && body.addons.length > 0) {
      const addonsResult = await client.query(
        'SELECT * FROM addons WHERE id = ANY($1)',
        [body.addons]
      );
      
      totalAmount += addonsResult.rows.reduce(
        (sum, addon) => sum + addon.price,
        0
      );
    }
    
    // 11. 建立訂單
    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id, 
        total_amount, 
        payment_method,
        status,
        order_number,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *`,
      [
        body.userId,
        totalAmount,
        body.paymentMethod,
        'pending',
        generateOrderNumber()
      ]
    );
    
    const order = orderResult.rows[0];
    
    // 12. 建立訂單項目
    await client.query(
      `INSERT INTO order_items (
        order_id,
        session_id,
        child_id,
        price
      )
      VALUES ($1, $2, $3, $4)`,
      [order.id, body.sessionId, body.childId, session.price]
    );
    
    // 13. 建立附加項目
    if (body.addons && body.addons.length > 0) {
      for (const addonId of body.addons) {
        const addon = await client.query(
          'SELECT * FROM addons WHERE id = $1',
          [addonId]
        );
        
        if (addon.rows.length > 0) {
          await client.query(
            `INSERT INTO order_addons (
              order_id,
              addon_id,
              price
            )
            VALUES ($1, $2, $3)`,
            [order.id, addonId, addon.rows[0].price]
          );
        }
      }
    }
    
    // 14. 提交交易
    await client.query('COMMIT');
    
    // 15. 發送確認郵件（非同步，不影響回應）
    sendOrderConfirmationEmail(order.id).catch(err => {
      console.error('Failed to send confirmation email:', err);
    });
    
    // 16. 返回成功回應
    return Response.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
      }
    }, { status: 201 });
    
  } catch (error) {
    // 回滾交易
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // 釋放連線
    client.release();
  }
});

/**
 * 生成訂單編號
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

/**
 * 發送訂單確認郵件
 */
async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  // 實作郵件發送邏輯
  // 這裡應該使用郵件服務 API
}
```

---

## 前端實作

### 訂單表單元件 (components/checkout/OrderForm.tsx)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAPIRequest } from '@/lib/hooks/useAPIRequest';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

interface OrderFormProps {
  sessionId: string;
  userId: string;
  children: Array<{ id: string; name: string; age: number }>;
  availableAddons: Array<{ id: string; name: string; price: number }>;
}

interface OrderFormData {
  childId: string;
  paymentMethod: string;
  addons: string[];
  agreeToTerms: boolean;
}

export function OrderForm({ 
  sessionId, 
  userId, 
  children, 
  availableAddons 
}: OrderFormProps) {
  const router = useRouter();
  const { request } = useAPIRequest();
  
  const [formData, setFormData] = useState<OrderFormData>({
    childId: '',
    paymentMethod: '',
    addons: [],
    agreeToTerms: false,
  });

  // 使用 useFormSubmit 處理表單提交
  const { 
    handleSubmit, 
    isSubmitting, 
    error, 
    isSuccess,
    clearError 
  } = useFormSubmit({
    // 提交前驗證
    validate: (data: OrderFormData) => {
      if (!data.childId) {
        return false;
      }
      if (!data.paymentMethod) {
        return false;
      }
      if (!data.agreeToTerms) {
        return false;
      }
      return true;
    },
    validationErrorMessage: '請填寫所有必要欄位並同意服務條款',
    
    // 提交處理
    onSubmit: async (data: OrderFormData) => {
      // 使用 useAPIRequest 發送請求，自動重試
      return await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          sessionId,
          childId: data.childId,
          paymentMethod: data.paymentMethod,
          addons: data.addons,
        }),
        retries: 3,
        exponentialBackoff: true,
        timeout: 30000,
      });
    },
    
    // 成功回調
    onSuccess: (result) => {
      console.log('Order created successfully:', result);
      
      // 顯示成功訊息
      showSuccessToast('訂單建立成功！');
      
      // 導向訂單確認頁
      setTimeout(() => {
        router.push(`/orders/${result.order.orderNumber}`);
      }, 1000);
    },
    
    // 錯誤回調
    onError: (error) => {
      console.error('Order creation failed:', error);
      
      // 根據錯誤類型顯示不同訊息
      if (error.message.includes('額滿')) {
        showWaitlistModal();
      } else {
        showErrorToast(error.message);
      }
    },
    
    // 防抖延遲
    debounceDelay: 500,
  });

  // 處理表單提交
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  // 處理欄位變更
  const handleFieldChange = (field: keyof OrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError(); // 清除錯誤訊息
  };

  // 處理附加項目選擇
  const handleAddonToggle = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      addons: prev.addons.includes(addonId)
        ? prev.addons.filter(id => id !== addonId)
        : [...prev.addons, addonId]
    }));
  };

  // 計算總金額
  const calculateTotal = () => {
    const sessionPrice = 2000; // 從 props 獲取
    const addonsPrice = formData.addons.reduce((sum, addonId) => {
      const addon = availableAddons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return sessionPrice + addonsPrice;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 選擇孩童 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          選擇孩童 <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.childId}
          onChange={(e) => handleFieldChange('childId', e.target.value)}
          disabled={isSubmitting}
          required
        >
          <option value="">請選擇孩童</option>
          {children.map(child => (
            <option key={child.id} value={child.id}>
              {child.name} ({child.age} 歲)
            </option>
          ))}
        </Select>
      </div>

      {/* 選擇付款方式 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          付款方式 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={formData.paymentMethod === 'credit_card'}
              onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
              disabled={isSubmitting}
              className="mr-2"
            />
            信用卡
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={formData.paymentMethod === 'bank_transfer'}
              onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
              disabled={isSubmitting}
              className="mr-2"
            />
            銀行轉帳
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="line_pay"
              checked={formData.paymentMethod === 'line_pay'}
              onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
              disabled={isSubmitting}
              className="mr-2"
            />
            LINE Pay
          </label>
        </div>
      </div>

      {/* 附加項目 */}
      {availableAddons.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            附加項目（可選）
          </label>
          <div className="space-y-2">
            {availableAddons.map(addon => (
              <label key={addon.id} className="flex items-center">
                <Checkbox
                  checked={formData.addons.includes(addon.id)}
                  onChange={() => handleAddonToggle(addon.id)}
                  disabled={isSubmitting}
                />
                <span className="ml-2">
                  {addon.name} (+NT$ {addon.price})
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 總金額 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">總金額</span>
          <span className="text-2xl font-bold text-primary">
            NT$ {calculateTotal().toLocaleString()}
          </span>
        </div>
      </div>

      {/* 服務條款 */}
      <div>
        <label className="flex items-start">
          <Checkbox
            checked={formData.agreeToTerms}
            onChange={(e) => handleFieldChange('agreeToTerms', e.target.checked)}
            disabled={isSubmitting}
          />
          <span className="ml-2 text-sm">
            我已閱讀並同意
            <a href="/terms" target="_blank" className="text-primary underline mx-1">
              服務條款
            </a>
            和
            <a href="/refund-policy" target="_blank" className="text-primary underline mx-1">
              退款政策
            </a>
            <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">提交失敗</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* 成功訊息 */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <p className="font-medium">訂單建立成功！</p>
          <p className="text-sm mt-1">正在導向訂單確認頁...</p>
        </div>
      )}

      {/* 提交按鈕 */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1"
        >
          返回
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting || !formData.agreeToTerms}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              處理中...
            </>
          ) : (
            '確認訂單'
          )}
        </Button>
      </div>

      {/* 提交提示 */}
      {isSubmitting && (
        <p className="text-sm text-gray-500 text-center">
          請勿關閉或重新整理頁面...
        </p>
      )}
    </form>
  );
}

// 輔助函數
function showSuccessToast(message: string) {
  // 實作成功提示
  console.log('Success:', message);
}

function showErrorToast(message: string) {
  // 實作錯誤提示
  console.log('Error:', message);
}

function showWaitlistModal() {
  // 顯示候補名單模態框
  console.log('Show waitlist modal');
}
```

---

## 測試範例

### API 測試 (__tests__/api/orders.test.ts)

```typescript
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('POST /api/orders', () => {
  let testUserId: string;
  let testSessionId: string;
  let testChildId: string;

  beforeEach(async () => {
    // 設定測試資料
    testUserId = 'test-user-1';
    testSessionId = 'test-session-1';
    testChildId = 'test-child-1';
  });

  afterEach(async () => {
    // 清理測試資料
  });

  it('should create order successfully', async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        sessionId: testSessionId,
        childId: testChildId,
        paymentMethod: 'credit_card',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.order).toBeDefined();
    expect(data.order.orderNumber).toBeDefined();
  });

  it('should return 400 for missing required fields', async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        // 缺少 sessionId, childId, paymentMethod
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error.code).toBe('MISSING_REQUIRED_FIELD');
  });

  it('should return 422 when session is full', async () => {
    // 模擬課程已額滿
    const fullSessionId = 'full-session-1';

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        sessionId: fullSessionId,
        childId: testChildId,
        paymentMethod: 'credit_card',
      }),
    });

    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error.code).toBe('SESSION_FULL');
  });

  it('should return 404 for non-existent session', async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        sessionId: 'non-existent-session',
        childId: testChildId,
        paymentMethod: 'credit_card',
      }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error.code).toBe('NOT_FOUND');
  });

  it('should handle concurrent requests correctly', async () => {
    // 測試並發請求
    const requests = Array(10).fill(null).map(() =>
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: testUserId,
          sessionId: testSessionId,
          childId: testChildId,
          paymentMethod: 'credit_card',
        }),
      })
    );

    const responses = await Promise.all(requests);
    
    // 應該只有一個成功，其他因為名額不足而失敗
    const successCount = responses.filter(r => r.status === 201).length;
    expect(successCount).toBeLessThanOrEqual(1);
  });
});
```

---

## 效能監控

### 監控關鍵指標

```typescript
// lib/monitoring/metrics.ts
export function trackOrderCreation(duration: number, success: boolean) {
  // 記錄訂單建立時間
  console.log('Order creation:', { duration, success });
  
  // 發送到監控服務
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'order_creation', {
      duration,
      success,
    });
  }
}

export function trackAPIError(endpoint: string, errorCode: string) {
  // 記錄 API 錯誤
  console.error('API Error:', { endpoint, errorCode });
  
  // 發送到錯誤追蹤服務
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureMessage(`API Error: ${endpoint}`, {
      level: 'error',
      extra: { errorCode },
    });
  }
}
```

---

## 總結

這個整合範例展示了：

1. **後端**：
   - ✅ 使用 `withErrorHandler` 自動錯誤處理
   - ✅ 使用資料庫交易確保資料一致性
   - ✅ 使用 `SELECT FOR UPDATE` 防止超賣
   - ✅ 完整的驗證和錯誤處理

2. **前端**：
   - ✅ 使用 `useAPIRequest` 自動重試
   - ✅ 使用 `useFormSubmit` 防止重複提交
   - ✅ 完整的 Loading 和錯誤狀態管理
   - ✅ 良好的使用者體驗

3. **測試**：
   - ✅ 完整的 API 測試覆蓋
   - ✅ 並發測試確保資料一致性

這確保系統在 500 人同時上線時能夠穩定運行！
