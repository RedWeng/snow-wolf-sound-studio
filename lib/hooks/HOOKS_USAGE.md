# 前端 Hooks 使用指南

## 概述

前端 Hooks 提供統一的 API 請求和表單提交管理，確保在 500 人同時上線時能夠穩定運行。

## 包含的 Hooks

1. **useAPIRequest** - 統一的 API 請求管理
2. **useFormSubmit** - 表單防重複提交
3. **useForm** - 完整的表單狀態管理

---

## useAPIRequest

### 功能特點

- ✅ 自動重試機制（預設 3 次）
- ✅ 指數退避策略
- ✅ Loading 狀態管理
- ✅ 錯誤狀態管理
- ✅ 請求取消支援
- ✅ 超時控制

### 基本使用

```typescript
import { useAPIRequest } from '@/lib/hooks/useAPIRequest';

function SessionsList() {
  const { request, loading, error } = useAPIRequest<Session[]>();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await request('/api/sessions', {
          method: 'GET',
          retries: 3,
        });
        setSessions(data);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {sessions.map(session => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
```

### 進階選項

```typescript
const { request, loading, error, cancel } = useAPIRequest();

// 自訂重試次數和超時
const data = await request('/api/orders', {
  method: 'POST',
  body: JSON.stringify(orderData),
  retries: 5,              // 重試 5 次
  timeout: 60000,          // 60 秒超時
  exponentialBackoff: true, // 使用指數退避
  retryDelay: 2000,        // 基礎延遲 2 秒
});

// 取消請求
cancel();
```

### 便捷 Hooks

#### useAPIGet

```typescript
import { useAPIGet } from '@/lib/hooks/useAPIRequest';

function SessionDetail({ id }: { id: string }) {
  const { get, loading, error } = useAPIGet<Session>();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const data = await get(`/api/sessions/${id}`);
      setSession(data);
    };
    fetchSession();
  }, [id]);

  // ...
}
```

#### useAPIPost

```typescript
import { useAPIPost } from '@/lib/hooks/useAPIRequest';

function CreateOrderButton({ orderData }: { orderData: OrderData }) {
  const { post, loading, error } = useAPIPost<Order>();

  const handleCreateOrder = async () => {
    try {
      const order = await post('/api/orders', orderData);
      console.log('Order created:', order);
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  return (
    <button onClick={handleCreateOrder} disabled={loading}>
      {loading ? '建立中...' : '建立訂單'}
    </button>
  );
}
```

#### useAPIPut

```typescript
import { useAPIPut } from '@/lib/hooks/useAPIRequest';

function UpdateProfile({ userId, profileData }: Props) {
  const { put, loading, error } = useAPIPut();

  const handleUpdate = async () => {
    await put(`/api/users/${userId}`, profileData);
  };

  // ...
}
```

#### useAPIDelete

```typescript
import { useAPIDelete } from '@/lib/hooks/useAPIRequest';

function DeleteButton({ orderId }: { orderId: string }) {
  const { delete: deleteOrder, loading } = useAPIDelete();

  const handleDelete = async () => {
    if (confirm('確定要刪除此訂單？')) {
      await deleteOrder(`/api/orders/${orderId}`);
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? '刪除中...' : '刪除'}
    </button>
  );
}
```

### 錯誤處理

```typescript
const { request, error, errorCode, clearError } = useAPIRequest();

// 根據錯誤代碼處理
useEffect(() => {
  if (errorCode === 'SESSION_FULL') {
    // 顯示候補選項
    showWaitlistModal();
  } else if (errorCode === 'UNAUTHORIZED') {
    // 重新導向到登入頁
    router.push('/login');
  }
}, [errorCode]);

// 清除錯誤
const handleRetry = () => {
  clearError();
  // 重試請求
};
```

---

## useFormSubmit

### 功能特點

- ✅ 防止重複提交
- ✅ 防抖機制
- ✅ Loading 狀態
- ✅ 成功/錯誤回調
- ✅ 表單驗證
- ✅ 自動重置

### 基本使用

```typescript
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

function OrderForm() {
  const [formData, setFormData] = useState({
    sessionId: '',
    childId: '',
    paymentMethod: '',
  });

  const { handleSubmit, isSubmitting, error, isSuccess } = useFormSubmit({
    onSubmit: async (data) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
      }

      return response.json();
    },
    onSuccess: (result) => {
      console.log('Order created:', result);
      router.push(`/orders/${result.orderNumber}`);
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      {/* 表單欄位 */}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : '提交訂單'}
      </button>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {isSuccess && (
        <div className="success-message">訂單建立成功！</div>
      )}
    </form>
  );
}
```

### 進階選項

```typescript
const { handleSubmit, isSubmitting, error, reset } = useFormSubmit({
  onSubmit: async (data) => {
    // 提交邏輯
    return await createOrder(data);
  },
  
  // 提交前驗證
  validate: async (data) => {
    if (!data.email.includes('@')) {
      return false;
    }
    return true;
  },
  
  // 驗證失敗訊息
  validationErrorMessage: '請填寫正確的電子郵件',
  
  // 防抖延遲（毫秒）
  debounceDelay: 500,
  
  // 成功後自動重置
  resetOnSuccess: true,
  
  // 成功回調
  onSuccess: (result, data) => {
    console.log('Success:', result);
    showSuccessToast('訂單建立成功！');
  },
  
  // 錯誤回調
  onError: (error, data) => {
    console.error('Error:', error);
    showErrorToast(error.message);
  },
  
  // 最終回調（無論成功或失敗）
  onFinally: (data) => {
    console.log('Form submission completed');
  },
});

// 手動重置表單
const handleReset = () => {
  reset();
};
```

### 與 useAPIRequest 結合

```typescript
import { useAPIRequest } from '@/lib/hooks/useAPIRequest';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';

function RegistrationForm() {
  const { request } = useAPIRequest();
  const [formData, setFormData] = useState({
    sessionId: '',
    childId: '',
  });

  const { handleSubmit, isSubmitting, error } = useFormSubmit({
    onSubmit: async (data) => {
      // 使用 useAPIRequest 發送請求，自動重試
      return await request('/api/registrations', {
        method: 'POST',
        body: JSON.stringify(data),
        retries: 3,
      });
    },
    onSuccess: (result) => {
      router.push(`/registrations/${result.id}`);
    },
  });

  // ...
}
```

---

## useForm

### 功能特點

- ✅ 完整的表單狀態管理
- ✅ 欄位級驗證
- ✅ 觸碰狀態追蹤
- ✅ 錯誤訊息管理
- ✅ 防重複提交
- ✅ 整合 useFormSubmit

### 基本使用

```typescript
import { useForm } from '@/lib/hooks/useFormSubmit';

function LoginForm() {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    handleSubmit,
    isSubmitting,
    submitError,
  } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: any = {};
      
      if (!values.email) {
        errors.email = '請輸入電子郵件';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = '電子郵件格式不正確';
      }
      
      if (!values.password) {
        errors.password = '請輸入密碼';
      } else if (values.password.length < 6) {
        errors.password = '密碼至少需要 6 個字元';
      }
      
      return Object.keys(errors).length > 0 ? errors : null;
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('登入失敗');
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      router.push('/dashboard');
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>電子郵件</label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => setFieldValue('email', e.target.value)}
          onBlur={() => setFieldTouched('email')}
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <label>密碼</label>
        <input
          type="password"
          value={values.password}
          onChange={(e) => setFieldValue('password', e.target.value)}
          onBlur={() => setFieldTouched('password')}
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '登入中...' : '登入'}
      </button>

      {submitError && (
        <div className="error-message">{submitError}</div>
      )}
    </form>
  );
}
```

### 複雜表單範例

```typescript
interface RegistrationFormData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number;
  sessionId: string;
  paymentMethod: string;
  agreeToTerms: boolean;
}

function RegistrationForm() {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    handleSubmit,
    isSubmitting,
    isSuccess,
    reset,
  } = useForm<RegistrationFormData>({
    initialValues: {
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      childName: '',
      childAge: 0,
      sessionId: '',
      paymentMethod: '',
      agreeToTerms: false,
    },
    validate: (values) => {
      const errors: Partial<Record<keyof RegistrationFormData, string>> = {};

      // 家長資訊驗證
      if (!values.parentName) {
        errors.parentName = '請輸入家長姓名';
      }

      if (!values.parentEmail) {
        errors.parentEmail = '請輸入電子郵件';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.parentEmail)) {
        errors.parentEmail = '電子郵件格式不正確';
      }

      if (!values.parentPhone) {
        errors.parentPhone = '請輸入聯絡電話';
      }

      // 孩童資訊驗證
      if (!values.childName) {
        errors.childName = '請輸入孩童姓名';
      }

      if (!values.childAge || values.childAge < 3 || values.childAge > 12) {
        errors.childAge = '孩童年齡需在 3-12 歲之間';
      }

      // 課程選擇驗證
      if (!values.sessionId) {
        errors.sessionId = '請選擇課程';
      }

      // 付款方式驗證
      if (!values.paymentMethod) {
        errors.paymentMethod = '請選擇付款方式';
      }

      // 條款同意驗證
      if (!values.agreeToTerms) {
        errors.agreeToTerms = '請閱讀並同意條款';
      }

      return Object.keys(errors).length > 0 ? errors : null;
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error.message);
      }

      return response.json();
    },
    onSuccess: (result) => {
      console.log('Registration successful:', result);
      router.push(`/registrations/${result.id}/confirmation`);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  if (isSuccess) {
    return <SuccessMessage />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 家長資訊 */}
      <section>
        <h2>家長資訊</h2>
        
        <Input
          label="家長姓名"
          value={values.parentName}
          onChange={(e) => setFieldValue('parentName', e.target.value)}
          onBlur={() => setFieldTouched('parentName')}
          error={touched.parentName ? errors.parentName : undefined}
        />

        <Input
          label="電子郵件"
          type="email"
          value={values.parentEmail}
          onChange={(e) => setFieldValue('parentEmail', e.target.value)}
          onBlur={() => setFieldTouched('parentEmail')}
          error={touched.parentEmail ? errors.parentEmail : undefined}
        />

        <Input
          label="聯絡電話"
          type="tel"
          value={values.parentPhone}
          onChange={(e) => setFieldValue('parentPhone', e.target.value)}
          onBlur={() => setFieldTouched('parentPhone')}
          error={touched.parentPhone ? errors.parentPhone : undefined}
        />
      </section>

      {/* 孩童資訊 */}
      <section>
        <h2>孩童資訊</h2>
        
        <Input
          label="孩童姓名"
          value={values.childName}
          onChange={(e) => setFieldValue('childName', e.target.value)}
          onBlur={() => setFieldTouched('childName')}
          error={touched.childName ? errors.childName : undefined}
        />

        <Input
          label="年齡"
          type="number"
          value={values.childAge}
          onChange={(e) => setFieldValue('childAge', parseInt(e.target.value))}
          onBlur={() => setFieldTouched('childAge')}
          error={touched.childAge ? errors.childAge : undefined}
        />
      </section>

      {/* 課程選擇 */}
      <section>
        <h2>課程選擇</h2>
        
        <Select
          label="選擇課程"
          value={values.sessionId}
          onChange={(e) => setFieldValue('sessionId', e.target.value)}
          onBlur={() => setFieldTouched('sessionId')}
          error={touched.sessionId ? errors.sessionId : undefined}
        >
          <option value="">請選擇課程</option>
          {/* 課程選項 */}
        </Select>
      </section>

      {/* 付款方式 */}
      <section>
        <h2>付款方式</h2>
        
        <RadioGroup
          value={values.paymentMethod}
          onChange={(value) => setFieldValue('paymentMethod', value)}
          error={touched.paymentMethod ? errors.paymentMethod : undefined}
        >
          <Radio value="credit_card">信用卡</Radio>
          <Radio value="bank_transfer">銀行轉帳</Radio>
          <Radio value="line_pay">LINE Pay</Radio>
        </RadioGroup>
      </section>

      {/* 條款同意 */}
      <section>
        <Checkbox
          checked={values.agreeToTerms}
          onChange={(e) => setFieldValue('agreeToTerms', e.target.checked)}
          error={touched.agreeToTerms ? errors.agreeToTerms : undefined}
        >
          我已閱讀並同意<a href="/terms">服務條款</a>
        </Checkbox>
      </section>

      {/* 提交按鈕 */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          disabled={isSubmitting}
        >
          重置
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="primary"
        >
          {isSubmitting ? '提交中...' : '提交報名'}
        </button>
      </div>
    </form>
  );
}
```

---

## useFormField

### 單一欄位管理

```typescript
import { useFormField } from '@/lib/hooks/useFormSubmit';

function EmailInput() {
  const {
    value,
    setValue,
    error,
    touched,
    setTouched,
    validate,
    reset,
  } = useFormField({
    initialValue: '',
    required: true,
    requiredMessage: '請輸入電子郵件',
    validate: (value) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return '電子郵件格式不正確';
      }
      return null;
    },
  });

  return (
    <div>
      <input
        type="email"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          setTouched();
          validate();
        }}
      />
      {touched && error && (
        <span className="error">{error}</span>
      )}
    </div>
  );
}
```

---

## 最佳實踐

### 1. 組合使用 Hooks

```typescript
function OrderForm() {
  const { request } = useAPIRequest();
  const { handleSubmit, isSubmitting, error } = useFormSubmit({
    onSubmit: async (data) => {
      return await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
        retries: 3,
        exponentialBackoff: true,
      });
    },
  });

  // ...
}
```

### 2. 錯誤處理

```typescript
const { handleSubmit, error, clearError } = useFormSubmit({
  onSubmit: async (data) => {
    // 提交邏輯
  },
  onError: (error) => {
    // 根據錯誤類型顯示不同訊息
    if (error.message.includes('SESSION_FULL')) {
      showWaitlistModal();
    } else {
      showErrorToast(error.message);
    }
  },
});

// 清除錯誤後重試
const handleRetry = () => {
  clearError();
  handleSubmit(formData);
};
```

### 3. Loading 狀態

```typescript
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={isSubmitting ? 'loading' : ''}
    >
      {isSubmitting ? (
        <>
          <Spinner />
          <span>處理中...</span>
        </>
      ) : (
        '提交'
      )}
    </button>
  );
}
```

### 4. 成功回饋

```typescript
const { handleSubmit, isSuccess } = useFormSubmit({
  onSubmit: async (data) => {
    // 提交邏輯
  },
  onSuccess: (result) => {
    // 顯示成功訊息
    showSuccessToast('訂單建立成功！');
    
    // 延遲後導向
    setTimeout(() => {
      router.push(`/orders/${result.orderNumber}`);
    }, 1500);
  },
  resetOnSuccess: true,
});

// 顯示成功狀態
{isSuccess && (
  <div className="success-banner">
    <CheckIcon />
    <span>提交成功！</span>
  </div>
)}
```

---

## 總結

這些 Hooks 提供：

- ✅ 統一的 API 請求管理
- ✅ 自動重試和錯誤處理
- ✅ 防止重複提交
- ✅ 完整的表單狀態管理
- ✅ 易於測試和維護

確保在 500 人同時上線時，系統能夠穩定運行並提供良好的使用者體驗。
